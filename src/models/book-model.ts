import { IaModel } from "./ia-model"

export type BookModel = {
    id: string,
    ownerId: string, // Relation
    slug: string,
    projectTitle: string,
    originalUrl: string,
    modifiedUrl: string,
    modifiedAt: string,
    type: 'summary' | 'comic' | 'illustrate',
    agentId: string  /// Relation
}