import { BookForm } from "@/components/BookForm"
import { findAgentsPublicAndByUserId, findAllPublicAgents } from "@/lib/queries/private-data-agents"
import { IaModel } from "@/models/ia-model";
import { AuthenticationRepository } from "@/repositories";

export const dynamic = 'force-dynamic'

export default async function SummaryPage() {
    const maxFileBytes = Number(process.env.MAX_BYTES) || 0
    
    const user = await AuthenticationRepository.getUserByLoginSession();

    let agents: IaModel[], isDisabled: boolean = true;
    if (!user) {
        agents = await findAllPublicAgents();
        isDisabled = true
    }
    else {
        agents = await findAgentsPublicAndByUserId(user.id)
        isDisabled = false
    }

    return (
        <BookForm 
        buttonText="Gerar resumo"
        title="Resumos"
        description="Gere resumos dinâmicos do seu livro de forma rápida e fácil"
        maxFileBytes={maxFileBytes}
        mode="summary"
        agents={agents}
        isDisabled={isDisabled}
        />
    )
}