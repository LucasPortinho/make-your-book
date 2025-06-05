import { IaModel } from "@/models/ia-model"

type QueryType = Omit<IaModel, 'style' | 'instructions'> & {
    style: string;
    instructions: string | null
}

export const queryAsAgentModel = (query: QueryType) => {
    if (["drawer", "colorful", "cartoon", "magic", "anime", "realistic"].includes(query.style)) {
            return {
                ...query,
                style: query.style as "drawer" | "colorful" | "cartoon" | "magic" | "anime" | "realistic"
            }
        }

    return null
  }
  