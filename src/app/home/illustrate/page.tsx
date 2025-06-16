import { BookForm } from "@/components/BookForm"
import { findAgentsPublicAndByUserId, findAllPublicAgents } from "@/lib/queries/private-data-agents"
import { IaModel } from "@/models/ia-model"
import { AuthenticationRepository } from "@/repositories"

export const dynamic = 'force-dynamic'

export default async function IllustratePage() {
    const user = await AuthenticationRepository.getUserByLoginSession()
   
    let agents: IaModel[], isDisabled: boolean = true;
    if (!user) {
        agents = await findAllPublicAgents();
        isDisabled = true
    }
    else {
        agents = await findAgentsPublicAndByUserId(user.id)
        isDisabled = false
    }

    const maxFileBytes = Number(process.env.MAX_BYTES) || 0

    return (
        <BookForm 
        maxFileBytes={maxFileBytes} 
        buttonText="Gerar ilustração" 
        mode="illustrate" 
        title="Ilustrações" 
        description="Faça suas ilustrações" 
        agents={agents}
        isDisabled={isDisabled}
        />
    )
}