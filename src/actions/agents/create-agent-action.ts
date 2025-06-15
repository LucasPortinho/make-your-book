'use server'

import { AgentCreateSchema } from "@/lib/validations"
import { IaModel } from "@/models/ia-model"
import { AIRepository } from "@/repositories"
import { getZodErrorMessages } from "@/utils/get-zod-error-messages"
import { makeRandomString } from "@/utils/make-random-string"
import { v4 as uuidv4 } from 'uuid'

type CreateAgentActionProps = {
    errors?: string[]
    success?: string
}

export async function createAgentAction(prevState: CreateAgentActionProps, formData: FormData): Promise<CreateAgentActionProps> {
    if (!(formData instanceof FormData)) {
        return {
            errors: ['Dados inválidos']
        }
    }

    const formDataToObj = Object.fromEntries(formData.entries())
    const zodParsedObj = AgentCreateSchema.safeParse(formDataToObj)

    if (!zodParsedObj.success) {
        const errors = getZodErrorMessages(zodParsedObj.error.format())
        return {
            errors
        }
    }

    const validData = zodParsedObj.data

    const agent: IaModel = {
        id: uuidv4(),
        name: validData.name,
        model: validData.model,
        style: validData.style,
        instructions: validData.instructions,
    }
    
    await AIRepository.createAgent(agent)
    return {
        success: `true-${makeRandomString()}`
    }
}
