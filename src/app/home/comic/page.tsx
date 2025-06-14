import { BookForm } from "@/components/BookForm"
import { findAgentsPublicAndByUserId } from "@/lib/queries/private-data-agents"

export const dynamic = 'force-dynamic'

export default async function ComicPage() {
    const maxFileBytes = Number(process.env.MAX_BYTES) || 0
    // TODO: lógica para pegar usuário
    const userId = 'user_1'
    const agents = await findAgentsPublicAndByUserId(userId)

    return (
        <BookForm 
        buttonText="Gerar gibi"
        description="Transforme livros entediantes em gibis divertidos"
        maxFileBytes={maxFileBytes}
        mode="comic"
        title="Gibis"
        agents={agents}
        />
    )
}
