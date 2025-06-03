import { BookForm } from "@/components/BookForm"

export const dynamic = 'force-dynamic'

export default function IllustratePage() {
    const maxFileBytes = Number(process.env.MAX_BYTES) || 0

    return (
        <BookForm 
        maxFileBytes={maxFileBytes} 
        buttonText="Gerar ilustração" 
        mode="illustrate" 
        title="Ilustrações" 
        description="Faça suas ilustrações" />
    )
}