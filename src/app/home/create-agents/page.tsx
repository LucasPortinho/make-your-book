import { AgentForm } from "@/components/AgentsForm"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Criar agentes',
        description: 'Crie seus próprios agentes de inteligência artificial'
    }
}

export default function CreateAgentPage() {
    return (
        <AgentForm 
        title="Criar agente"
        description="Crie seu agente de forma totalmente gratuita e personalizada"
        buttonText="Criar"
        />
    )
}
