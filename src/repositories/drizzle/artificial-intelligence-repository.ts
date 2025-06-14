import { drizzleDb } from "@/db/drizzle";
import { agentsTable, booksTable } from "@/db/drizzle/schemas";
import { BookModel } from "@/models/book-model";
import { IaModel } from "@/models/ia-model";
import { BookIllustration, BookIllustrationResult, BookSummary, ComicPage, ComicResult, ImageModel, SummaryResult } from "@/models/illustration-models";
import { ArtificalIntelligenceRepository } from "@/repositories/artificial-intelligence-repository";
import { PdfProcessorService } from "@/services/pdf-processor";
import { queriesAsAgentsModels, queryAsAgentModel } from "@/utils/queries-as-agents";
import { eq } from "drizzle-orm";
import { BookRepository } from "..";

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

    async findAllAgents(): Promise<IaModel[]> {
        const agents = await drizzleDb.query.agents.findMany({
            orderBy: (agents, { desc }) => desc(agents.name)
        })

        const agentsQueries = queriesAsAgentsModels(agents)
        return agentsQueries
    }

    async findAllAgentsByUserId(userId: string): Promise<IaModel[]> {
        const agents = await drizzleDb.query.agents.findMany({
            where: (agents, { eq }) => eq(agents.ownerId, userId)
        })

        const agentsQueries = queriesAsAgentsModels(agents)
        return agentsQueries
    }

    async findAllPublicAgents(): Promise<IaModel[]> {
        const agents = await drizzleDb.query.agents.findMany({
            where: (agents, { isNull }) => isNull(agents.ownerId)
        })

        const agentsQueries = queriesAsAgentsModels(agents)
        return agentsQueries
    }

    async findPublicAndByUser(userId: string): Promise<IaModel[]> {
        const agents = await drizzleDb.query.agents.findMany({
            where: (agents, { eq, or, isNull }) => or(eq(agents.ownerId, userId), isNull(agents.ownerId))
        })
        const agentsQueries = queriesAsAgentsModels(agents)
        return agentsQueries
    }
    async generateBookIllustrations(book: Pick<BookModel, 'agentId' | 'id' | 'ownerId' | 'slug' | 'originalUrl' | 'projectTitle'>): Promise<BookIllustrationResult> {
        const agent = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, book.agentId)
        })

        if (!agent) {
            throw new Error('O agente não existe')
        }

        const agentQuery = queryAsAgentModel(agent)

        if (!agentQuery) {
            throw new Error('O agente não foi bem processado')
        }

        const imageModel = this.getImageModel(agent.model);
        const illustration = await this.pdfProcessor.generateBookIllustrations(book.originalUrl, agentQuery.style, imageModel);
        const bookModel: BookModel = {
            id: book.id,
            agentId: book.agentId,
            originalUrl: book.originalUrl,
            modifiedAt: new Date().toISOString(),
            modifiedUrl: illustration.pdfPath,
            ownerId: book.ownerId,
            slug: book.slug,
            projectTitle: book.projectTitle,
            type: 'illustrate'
        }
        await BookRepository.create(bookModel)
        return illustration
    }

    async generateComicFromPdf(book: Pick<BookModel, 'agentId' | 'id' | 'ownerId' | 'slug' | 'originalUrl' | 'projectTitle'>): Promise<ComicResult> {
        const agent = await drizzleDb.query.agents.findFirst({
            where: (agents, { eq }) => eq(agents.id, book.agentId)
        })

        if (!agent) {
            throw new Error('O agente não existe')
        }

        const agentQuery = queryAsAgentModel(agent)

        if (!agentQuery) {
            throw new Error('O agente não foi bem processado')
        }

        const imageModel = this.getImageModel(agent.model);
        const illustration = await this.pdfProcessor.generateComicFromPdf(book.originalUrl, agentQuery.style, imageModel);
        const bookModel: BookModel = {
            id: book.id,
            agentId: book.agentId,
            originalUrl: book.originalUrl,
            modifiedAt: new Date().toISOString(),
            modifiedUrl: illustration.pdfPath,
            ownerId: book.ownerId,
            slug: book.slug,
            projectTitle: book.projectTitle,
            type: 'comic'
        }
        await BookRepository.create(bookModel)
        return illustration
    }

    async summarizePdf(book: Pick<BookModel, 'id' | 'ownerId' | 'slug' | 'originalUrl' | 'projectTitle'>): Promise<SummaryResult> {
        const summary = await this.pdfProcessor.summarizePdf(book.originalUrl);
        const bookModel: BookModel = {
            id: book.id,
            ownerId: book.ownerId,
            slug: book.originalUrl,
            originalUrl: book.originalUrl,
            projectTitle: book.projectTitle,
            agentId: 'summarizer',
            modifiedAt: new Date().toISOString(),
            modifiedUrl: summary.markdownPath,
            type: 'summary'
        }
        await BookRepository.create(bookModel)
        return summary
    }
}