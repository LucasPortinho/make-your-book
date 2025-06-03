import { LibraryTable } from "@/components/LibraryTable"
import { findAllByUserAndTypeCached } from "@/lib/queries/private-data-books"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Meus resumos',
        description: 'Resumos feitos dos livros com inteligência artificial'
    }
}

export default async function MySummariesPage() { 
    const userId = 'user-003'  // TODO: Lógica para pegar usuário
    const books = await findAllByUserAndTypeCached(userId, "summary")

    const styleMapping = {
        drawer: 'Desenhista',
        anime: 'Anime',
        colorful: 'Colorido',
        cartoon: 'Cartoon',
        magic: 'Mágico',
        realistic: 'Magic',
        explanatory: 'Explicatório',
        funny: 'Engraçado',
        dynamic: 'Dinâmico',
        organizer: 'Organizar o conteúdo',
        translator: 'Tradutor',
    }

    const booksData = books.map(book => {
        return { 
            modifiedAt: book.modifiedAt,
            style: styleMapping[book.iaAgent.style],
            projectTitle: book.projectTitle,
            id: book.id,
        }
    })

    return <LibraryTable title="Meus resumos" data={booksData} />
}