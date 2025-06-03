import { BookForm } from "@/components/BookForm"

export const dynamic = 'force-dynamic'

export default function SummaryPage() {
    const maxFileBytes = Number(process.env.MAX_BYTES) || 0

    return (
        <BookForm 
        buttonText="Gerar resumo"
        title="Resumos"
        description="Gere resumos dinâmicos do seu livro de forma rápida e fácil"
        maxFileBytes={maxFileBytes}
        mode="summary"
        />
    )
}