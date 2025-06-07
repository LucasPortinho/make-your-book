import { IaModel } from "@/models/ia-model"
import { resolve } from "path"
import { IARepository } from "."

(async() => {
    const newAgent = await IARepository.callAgent('agente-teste-002')
    const path = resolve(process.cwd(), 'public', 'uploads', 'teste-curto.pdf')
    const result = await IARepository.summarizePdf(path)
    console.log(result)
})()