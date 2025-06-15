import { LibraryTable } from "@/components/LibraryTable"
import { findAllBooksByUserCached } from "@/lib/queries/private-data-books"
import { AuthenticationRepository } from "@/repositories"
import { getPublicBookData } from "@/utils/get-public-book-data"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Biblioteca',
        description: 'Toda a minha biblioteca de livros'
    }
}

export default async function MyComicsPage() { 
    const user = await AuthenticationRepository.getUserByLoginSession() 
    
    if (!user) {
        redirect('/home?error=login-required')
    }
    
    const books = await findAllBooksByUserCached(user.id)

    const booksData = await getPublicBookData(books)
    
    return <LibraryTable title="Minha biblioteca" data={booksData} />
}