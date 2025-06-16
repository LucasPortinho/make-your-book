import { BookForm } from "@/components/BookForm"
import { findAgentsPublicAndByUserId, findAllPublicAgents } from "@/lib/queries/private-data-agents"
import { IaModel } from "@/models/ia-model"
import { AuthenticationRepository } from "@/repositories"

export const dynamic = 'force-dynamic'

export default async function ComicPage() {
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
        buttonText="Gerar gibi"
        description="Transforme livros entediantes em gibis divertidos"
        maxFileBytes={maxFileBytes}
        mode="comic"
        title="Gibis"
        agents={agents}
        isDisabled={isDisabled}
        />
    )
}
