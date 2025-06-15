import { AgentsTable } from "@/components/AgentsTable";
import { findAgentsPublicAndByUserId } from "@/lib/queries/private-data-agents";
import { IaModel } from "@/models/ia-model";
import { AuthenticationRepository } from "@/repositories";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Agentes',
        description: 'Agentes disponíveis para o meu uso',
    }
}

export default async function MyAgentsPage() {
    const user = await AuthenticationRepository.getUserByLoginSession() 
    
    if (!user) {
        redirect('/home?error=login-required')
    }

    const agents = await findAgentsPublicAndByUserId(user.id)
    const dto = agents.map(agent => {
        let owner: string;
        if (!!agent.ownerId) {
            owner = 'Eu'
        }
        else {
            owner = 'MakeYourBook'
        }

        const stylesMap: Record<IaModel['style'], string> = {
            drawer: 'Desenhista',
            anime: 'Anime',
            colorful: 'Colorido',
            cartoon: 'Cartoon',
            magic: 'Mágico',
            realistic: 'Magic'
        }    

        return {
            name: agent.name,
            style: stylesMap[agent.style],
            model: agent.model,
            owner
        }
    })

    return (
        <AgentsTable title="Agentes disponíveis" data={dto} />
    )
}
