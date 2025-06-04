import { drizzleDb } from "@/db/drizzle";
import { agentsTable } from "@/db/drizzle/schemas";
import { IaModel } from "@/models/ia-model";
import { BookIllustration, BookSummary, ComicPage, ImageModel } from "@/models/illustration-models";
import { ArtificalIntelligenceRepository } from "@/repositories/artificial-intelligence-repository";
import { PdfProcessorService } from "@/services/pdf-processor";
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

    async generateBookIllustrations(agentId: string, pdfPath: string): Promise<BookIllustration[]> {
        const agent = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, agentId)
        })

        if (!agent) {
            throw new Error('O agente não existe')
        }

        const imageModel = this.getImageModel(agent.model);
        return await this.pdfProcessor.generateBookIllustrations(pdfPath, agent.style, imageModel);
    }

    async generateComicFromPdf(agentId: string, pdfPath: string): Promise<ComicPage[]> {
        const agent = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, agentId)
        })

        if (!agent) {
            throw new Error('O agente não existe')
        }

        const imageModel = this.getImageModel(agent.model);
        return await this.pdfProcessor.generateComicFromPdf(pdfPath, agent.style, imageModel);
    }

    async summarizePdf(pdfPath: string): Promise<BookSummary> {
        // Resumo não precisa de agente específico
        return await this.pdfProcessor.summarizePdf(pdfPath);
    }
}