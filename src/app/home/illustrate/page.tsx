import { BookForm } from "@/components/BookForm"
import { findAgentsPublicAndByUserId } from "@/lib/queries/private-data-agents"

export const dynamic = 'force-dynamic'

export default async function IllustratePage() {
    // TODO: Lógica para pegar o usuário
    const userId = 'user_2'
    const agents = await findAgentsPublicAndByUserId(userId)

    const maxFileBytes = Number(process.env.MAX_BYTES) || 0

    return (
        <BookForm 
        maxFileBytes={maxFileBytes} 
        buttonText="Gerar ilustração" 
        mode="illustrate" 
        title="Ilustrações" 
        description="Faça suas ilustrações" 
        agents={agents}/>
    )
}