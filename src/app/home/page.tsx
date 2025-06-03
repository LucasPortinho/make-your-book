import { HomeCard } from "@/components/HomeCard"
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
    title: 'Página inicial'
}

export default function HomePage() {
    const illustrateBenefits = [
        {
            title: 'Ilustre livros com rapidez',
            description: 'Tenha seus livros ilustrados em menos de 5 minutos',
        },
        {
            title: 'Ilustrações personalizadas',
            description: 'Suas ilustrações serão personalizadas baseadas no estilo de escrita, mudando de livro para livro',
        },
        {
            title: 'Ilustrações com cor',
            description: 'As ilustrações poderão vir coloridas e animadas, ou desenhadas como se fossem a lápis, a depender do estilo do escritor',
        },
    ]

    const comicBenefits = [
        {
            title: 'Transforme seus livros com rapidez',
            description: 'Tenha seus livros transformados em gibi, em menos de 5 minutos',
        },
        {
            title: 'Estilo de leitura',
            description: 'Essa função permite que você transforme livros chatos e enrolados em gibis divertidos',
        },
        {
            title: 'Leitura dinâmica',
            description: 'O bom desse estilo, é deixar sua leitura menos cansativa e mais dinâmica, com ilustrações e balões de diálogo',
        },
    ]

    const summaryBenefits = [
        {
            title: 'Velocidade de resumo',
            description: 'Tenha seus resumos prontos em menos de 5 minutos',
        },
        {
            title: 'Praticidade',
            description: 'Resuma seus livros de qualquer tamanho, em qualquer lugar. Transforme 200 páginas em 10, e leia o necessário ',
        },
        {
            title: 'Estude de forma mais eficiente',
            description: 'Tenha seus livros da escola, faculdade, ou até vestibular, resumido em algumas páginas fáceis e simples de ler',
        },
    ]
    
    return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

        <div className="grid auto-rows-max gap-4 md:grid-cols-3 md:pt-40">
            <HomeCard 
            mode="illustrate" 
            benefits={illustrateBenefits} 
            title="Ilustrações" 
            description="Ilustre qualquer livro que você quiser em menos de 5 minutos" />

            <HomeCard 
            mode="comic" 
            benefits={comicBenefits} 
            title="Gibi" 
            description="Transforme seus livros em gibi com facilidade" />
          
            <HomeCard 
            mode="summary" 
            benefits={summaryBenefits} 
            title="Resumo" 
            description="Faça um resumo de seus livros com rapidez" />
        </div>
    </div>
    )
}