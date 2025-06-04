import { IaModel } from "@/models/ia-model"
import { BookIllustration, BookSummary, ComicPage } from "@/models/illustration-models";

export type ArtificalIntelligenceRepository = {
    createAgent(agent: IaModel): Promise<IaModel>;
    deleteAgent(agentId: string): Promise<IaModel>;
    updateAgent(agentId: string, newAgentData: Pick<IaModel, 'instructions' | 'model' | 'style'>): Promise<IaModel>;
    callAgent(agentId: string): Promise<IaModel>;

    generateBookIllustrations(agentId: string, pdfPath: string): Promise<BookIllustration[]>;
    generateComicFromPdf(agentId: string, pdfPath: string): Promise<ComicPage[]>;
    summarizePdf(pdfPath: string): Promise<BookSummary>;
}