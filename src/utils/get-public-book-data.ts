import { BookModel } from "@/models/book-model";
import { AIRepository } from "@/repositories";

export async function getPublicBookData(books: BookModel[]) {
    return Promise.all(
        books.map(async(book) => {
            const agent = await AIRepository.callAgent(book.agentId)
            return {
                id: book.id,
                projectTitle: book.projectTitle,
                modifiedAt: book.modifiedAt,
                agentName: agent.name,
            }
        })
    )
}