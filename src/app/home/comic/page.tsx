import { BookForm } from "@/components/BookForm"

export const dynamic = 'force-dynamic'

export default function ComicPage() {
    const maxFileBytes = Number(process.env.MAX_BYTES) || 0

    return (
        <BookForm 
        buttonText="Gerar gibi"
        description="Transforme livros entediantes em gibis divertidos"
        maxFileBytes={maxFileBytes}
        mode="comic"
        title="Gibis"
        />
    )
}
