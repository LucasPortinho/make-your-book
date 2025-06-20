'use server'

import { BookCreateSchema } from "@/lib/validations"
import { AIRepository, AuthenticationRepository } from "@/repositories"
import { getZodErrorMessages } from "@/utils/get-zod-error-messages"
import { makeRandomString } from "@/utils/make-random-string"
import { makeSlugFromText } from "@/utils/make-slug-from-text"
import { mkdir, writeFile } from "fs/promises"
import { redirect } from "next/navigation"
import { extname, resolve } from "path"
import { v4 as uuidv4 } from 'uuid'

type ComicActionState = {
    errors?: string[],
    success?: string, 
}

export async function comicAction(prevState: ComicActionState, formData: FormData): Promise<ComicActionState> {
    // TODO: verificar a autenticação e corrigir bug de salvar mesmo com erro nos dados
    const makeResult = ({ url='', errors=[''] }) => ({ url, errors })

    const user = await AuthenticationRepository.getUserByLoginSession();

    if (!user) {
        redirect('/home?error=login-required')
    }
    
    if (!(formData instanceof FormData)) {
        return makeResult({ errors: ['Dados inválidos'] })
    }

    const formDataToObj = Object.fromEntries(formData.entries())
    const zodParsedObj = BookCreateSchema.safeParse(formDataToObj)

    if (!zodParsedObj.success) {
        const errors = getZodErrorMessages(zodParsedObj.error.format())
        return {
            errors
        }
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

    const validData = zodParsedObj.data

    const pdfBook = {
        id: uuidv4(),
        ownerId: user.id,
        slug: uniqueFileName,
        originalUrl,
        projectTitle: validData.title,
        agentId: validData.model
    }

    try {
        await AIRepository.generateComicFromPdf(pdfBook)
    }
    catch {
        return makeResult({ errors: ['Erro ao gerar ilustração'] })
    }
    
    return {
        success: `true-${makeRandomString()}`
    }
} 