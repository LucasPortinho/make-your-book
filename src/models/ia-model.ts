export type IaModel = {
    id: string
    name: string 
    ownerId?: string | null 
    model: string
    style: 'drawer' | 'colorful' | 'cartoon' | 'magic' | 'anime' | 'realistic'
    instructions?: string | null
}