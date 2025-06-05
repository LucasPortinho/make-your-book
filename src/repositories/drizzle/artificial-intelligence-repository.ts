import { drizzleDb } from "@/db/drizzle";
import { agentsTable } from "@/db/drizzle/schemas";
import { IaModel } from "@/models/ia-model";
import { BookIllustration, BookIllustrationResult, BookSummary, ComicPage, ComicResult, ImageModel, SummaryResult } from "@/models/illustration-models";
import { ArtificalIntelligenceRepository } from "@/repositories/artificial-intelligence-repository";
import { PdfProcessorService } from "@/services/pdf-processor";
import { queryAsAgentModel } from "@/utils/queries-as-agents";
import { eq } from "drizzle-orm";

export class DrizzleArtificialIntelligenceRepository implements ArtificalIntelligenceRepository {
    private pdfProcessor: PdfProcessorService;

    constructor() {
        this.pdfProcessor = new PdfProcessorService();
    }

    private getImageModel(model: string): ImageModel {
        if (model.toLowerCase().includes('dall-e-3')) {
            return 'dall-e-3';
        }
        return 'dall-e-2';
    }

    async createAgent(agent: IaModel): Promise<IaModel> {
        const agentExists = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, agent.id)
        })

        if (!!agentExists) {
            throw new Error('Esse agente já existe')
        }

        await drizzleDb.insert(agentsTable).values(agent)
        return agent
    }

    async updateAgent(agentId: string, newAgentData: Pick<IaModel, "instructions" | "model" | "style">): Promise<IaModel> {
        const oldAgent = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, agentId)
        })

        if (!oldAgent) {
            throw new Error('O agente não existe')
        }

        const newData = {
            model: newAgentData.model,
            instructions: newAgentData.instructions,
            style: newAgentData.style    
        }

        await drizzleDb.update(agentsTable).set(newData).where(eq(agentsTable.id, agentId))
        return {
            ...oldAgent,
            ...newData,
        }
    }

    async deleteAgent(agentId: string): Promise<IaModel> {
        const agent = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, agentId)
        })

        if (!agent) {
            throw new Error('O agente não existe')
        }   

        const agentQuery = queryAsAgentModel(agent)

        if (!agentQuery) {
            throw new Error("Agente não foi processado")
        }

        await drizzleDb.delete(agentsTable).where(eq(agentsTable.id, agentId))
        return agentQuery
    }

    async callAgent(agentId: string): Promise<IaModel> {
        const agent = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, agentId)
        })

        if (!agent) {
            throw new Error('O agente não existe')
        }

        const agentQuery = queryAsAgentModel(agent)

        if (!agentQuery) {
            throw new Error("Agente não foi processado")
        }
        
        return agentQuery
    }

    async generateBookIllustrations(agentId: string, pdfPath: string): Promise<BookIllustrationResult> {
        const agent = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, agentId)
        })

        if (!agent) {
            throw new Error('O agente não existe')
        }

        const agentQuery = queryAsAgentModel(agent)

        if (!agentQuery) {
            throw new Error('O agente não foi bem processado')
        }

        const imageModel = this.getImageModel(agent.model);
        return await this.pdfProcessor.generateBookIllustrations(pdfPath, agentQuery.style, imageModel);
    }

    async generateComicFromPdf(agentId: string, pdfPath: string): Promise<ComicResult> {
        const agent = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, agentId)
        })

        if (!agent) {
            throw new Error('O agente não existe')
        }

        const agentQuery = queryAsAgentModel(agent)

        if (!agentQuery) {
            throw new Error('O agente não foi bem processado')
        }

        const imageModel = this.getImageModel(agent.model);
        return await this.pdfProcessor.generateComicFromPdf(pdfPath, agentQuery.style, imageModel);
    }

    async summarizePdf(pdfPath: string): Promise<SummaryResult> {
        // Resumo não precisa de agente específico
        return await this.pdfProcessor.summarizePdf(pdfPath);
    }
}