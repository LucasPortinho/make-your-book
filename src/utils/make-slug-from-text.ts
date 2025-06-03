import slugify from "slugify";

// Adicionar id do usuário
export function makeSlugFromText(text: string) {
    const slug = slugify(text, {
        lower: true,
        strict: true,
        trim: true
    })

    return `${slug}`
}