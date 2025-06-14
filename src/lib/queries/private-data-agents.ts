import { IaModel } from '@/models/ia-model'
import { IARepository } from '@/repositories'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const findAgentsPublicAndByUserId = cache(async(userId: string) => {
        const agents = await IARepository.findPublicAndByUser(userId)
        if (!agents) notFound();
        return agents
    }
)
