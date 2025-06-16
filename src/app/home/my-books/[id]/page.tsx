import { IFrame } from "@/components/IFrame"
import { ReadMarkdown } from "@/components/ReadMarkdown"
import { findBookByUserAndIdCached } from "@/lib/queries/private-data-books"
import { AuthenticationRepository } from "@/repositories"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

type MyPageProps = {
    params: Promise<{ id: string }>
}

export default async function MyBook({ params }: MyPageProps) {
    const { id } = await params
    const user = await AuthenticationRepository.getUserByLoginSession()

    if (!user) {
        redirect('/home?error=login-required')
    }
    
    const book = await findBookByUserAndIdCached(user.id, id)

    return (
        <>
            {book.type === 'summary' ? (
                <ReadMarkdown markdownSrc={book.modifiedUrl} />
            ) : (
                <IFrame src={book.modifiedUrl} labelTitle={book.projectTitle} />
            )}
        </>
      );
}