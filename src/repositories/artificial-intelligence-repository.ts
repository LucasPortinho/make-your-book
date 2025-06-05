import { IaModel } from "@/models/ia-model"
import { BookIllustrationResult, ComicResult, SummaryResult } from "@/models/illustration-models";

export type ArtificalIntelligenceRepository = {
    createAgent(agent: IaModel): Promise<IaModel>;
    deleteAgent(agentId: string): Promise<IaModel>;
    updateAgent(agentId: string, newAgentData: Pick<IaModel, 'instructions' | 'model' | 'style'>): Promise<IaModel>;
    callAgent(agentId: string): Promise<IaModel>;

    generateBookIllustrations(agentId: string, pdfPath: string): Promise<BookIllustrationResult>;
    generateComicFromPdf(agentId: string, pdfPath: string): Promise<ComicResult>;
    summarizePdf(pdfPath: string): Promise<SummaryResult>
}