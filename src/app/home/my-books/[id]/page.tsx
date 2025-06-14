import { IFrame } from "@/components/IFrame"
import { findBookByUserAndIdCached } from "@/lib/queries/private-data-books"

export const dynamic = 'force-dynamic'

type MyPageProps = {
    params: Promise<{ id: string }>
}

export default async function MyBook({ params }: MyPageProps) {
    const { id } = await params
    const userId = 'user-003' // TODO: Lógica para pegar usuário em questão de autenticação
    const book = await findBookByUserAndIdCached(userId, id)

    return (
        <IFrame src={book.modifiedUrl} labelTitle={book.projectTitle} />
      );
}