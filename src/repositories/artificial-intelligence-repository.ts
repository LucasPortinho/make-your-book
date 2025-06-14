import { BookModel } from "@/models/book-model";
import { IaModel } from "@/models/ia-model"
import { BookIllustrationResult, ComicResult, SummaryResult } from "@/models/illustration-models";

export type ArtificalIntelligenceRepository = {
    createAgent(agent: IaModel): Promise<IaModel>;
    deleteAgent(agentId: string): Promise<IaModel>;
    updateAgent(agentId: string, newAgentData: Pick<IaModel, 'instructions' | 'model' | 'style'>): Promise<IaModel>;
    callAgent(agentId: string): Promise<IaModel>;
    
    findAllAgents(): Promise<IaModel[]>;
    findAllAgentsByUserId(userId: string): Promise<IaModel[]>;
    findAllPublicAgents(): Promise<IaModel[]>;
    findPublicAndByUser(userId: string): Promise<IaModel[]>;

    generateBookIllustrations(book: Pick<BookModel, 'agentId' | 'id' | 'ownerId' | 'slug' | 'originalUrl'>): Promise<BookIllustrationResult>;
    generateComicFromPdf(book: Pick<BookModel, 'agentId' | 'id' | 'ownerId' | 'slug' | 'originalUrl' | 'projectTitle'>): Promise<ComicResult>;
    summarizePdf(book: Pick<BookModel, 'id' | 'ownerId' | 'slug' | 'originalUrl' | 'projectTitle'>): Promise<SummaryResult>
}