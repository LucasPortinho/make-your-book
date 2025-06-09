import { AgentForm } from "@/components/AgentsForm"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Criar agentes'
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
