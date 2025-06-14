import { BookForm } from "@/components/BookForm"
import { findAgentsPublicAndByUserId } from "@/lib/queries/private-data-agents"

export const dynamic = 'force-dynamic'

export default async function SummaryPage() {
    const maxFileBytes = Number(process.env.MAX_BYTES) || 0
    // TODO: lógica para pegar usuário
    const userId = 'user_1'
    const agents = await findAgentsPublicAndByUserId(userId)

    return (
        <BookForm 
        buttonText="Gerar resumo"
        title="Resumos"
        description="Gere resumos dinâmicos do seu livro de forma rápida e fácil"
        maxFileBytes={maxFileBytes}
        mode="summary"
        agents={agents}
        />
    )
}