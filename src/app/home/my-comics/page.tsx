import { LibraryTable } from "@/components/LibraryTable"
import { findAllBooksByUserAndTypeCached } from "@/lib/queries/private-data-books"
import { AuthenticationRepository } from "@/repositories"
import { getPublicBookData } from "@/utils/get-public-book-data"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Meus gibis',
        description: 'Meus gibis feitos com inteligência artificial'
    }
}

export default async function MyComicsPage() { 
    const user = await AuthenticationRepository.getUserByLoginSession() 
    
    if (!user) {
        redirect('/home?error=login-required')
    }
    const books = await findAllBooksByUserAndTypeCached(user.id, "comic")


    const booksData = await getPublicBookData(books)

    return <LibraryTable title="Meus gibis" data={booksData} />
}