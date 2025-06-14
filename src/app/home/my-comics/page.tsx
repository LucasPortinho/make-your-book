import { LibraryTable } from "@/components/LibraryTable"
import { findAllBooksByUserAndTypeCached } from "@/lib/queries/private-data-books"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Meus gibis',
        description: 'Meus gibis feitos com inteligência artificial'
    }
}

export default async function MyComicsPage() { 
    const userId = 'user-002'  // TODO: Lógica para pegar usuário
    const books = await findAllBooksByUserAndTypeCached(userId, "comic")

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

    return <LibraryTable title="Meus gibis" data={booksData} />
}