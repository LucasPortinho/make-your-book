import { IaModel } from "@/models/ia-model"
import { IARepository } from "."

(async() => {
    const agent: IaModel = {
        id: 'agente-teste-001',
        model: 'dall-e-2',
        instructions: 'Gere ilustrações perfeitas seguindo seu estilo.',
        style: 'anime'
    }
    const newAgent = await IARepository.createAgent(agent)
    
})()