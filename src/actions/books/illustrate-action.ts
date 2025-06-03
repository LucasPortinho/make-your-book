'use server'

import { BookCreateSchema } from "@/lib/validations"
import { getZodErrorMessages } from "@/utils/get-zod-error-messages"
import { makeSlugFromText } from "@/utils/make-slug-from-text"
import { extname, resolve } from "path"
import { mkdir, writeFile } from "fs/promises"

type IllustrateActionState = {
    errors?: string[],
    success?: string, 
}

export async function illustrateAction(prevState: IllustrateActionState, formData: FormData): Promise<IllustrateActionState> {
    // TODO: verificar a autenticação
    const makeResult = ({ url='', errors=[''] }) => ({ url, errors })
    
    if (!(formData instanceof FormData)) {
        return makeResult({ errors: ['Dados inválidos'] })
    }

    const file = formData.get('file')
    
    if (!file) {
        return makeResult({ errors: ['Envie um arquivo'] })
    }

    if (!(file instanceof File)) {
        return makeResult({ errors: ['Arquivo inválido'] })
    }

    if (!(file.size > 0 )) {
        return makeResult({ errors: ['Envie um arquivo'] })
    }

    const maxBytes = Number(process.env.MAX_BYTES) || 0;

    if (file.size > maxBytes) {
        return makeResult({ errors: ['Arquivo muito grande']})
    }
    
    const allowedExtensions = ['.epub', '.pdf', '.mobi', '.azw', '.azw3', '.kfx', '.txt']
    const fileExtension = extname(file.name)
    
    if (!allowedExtensions.includes(fileExtension)) {
        return makeResult({ errors: ['Arquivo inválido'] })
    }

    const fileName = makeSlugFromText(file.name.replace(fileExtension,''))
    const uniqueFileName = `${makeSlugFromText(`${fileName}-${Date.now()}`)}${fileExtension}`

    const fileDir = process.env.FILES_DIR || 'uploads'
    const uploadFullPath = resolve(process.cwd(), 'public', fileDir)
    await mkdir(uploadFullPath, { recursive: true })

    const fileArrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(fileArrayBuffer)
    const fileFullPath = resolve(uploadFullPath, uniqueFileName)

    await writeFile(fileFullPath, buffer)

    const fileServerUrl = process.env.FILE_SERVER_URL || 'http://localhost:3000/uploads'
    const originalUrl = `${fileServerUrl}/${uniqueFileName}`

    const formDataToObj = Object.fromEntries(formData.entries())
    const zodParsedObj = BookCreateSchema.safeParse(formDataToObj)

    if (!zodParsedObj.success) {
        const errors = getZodErrorMessages(zodParsedObj.error.format())
        return {
            errors
        }
    }

    const validData = zodParsedObj.data

    // const book: BookModel = {
    //     projectTitle: validData.title,
    //     modifiedAt: new Date().toISOString(),
    //     iaAgent: createAgent(validData.style),
    //     type: 'illustrate',
    //     slug: makeSlugFromText(validData.title),  // Adicionar slug e o id do usuário
    //     originalUrl,
    // }

    return {}
}