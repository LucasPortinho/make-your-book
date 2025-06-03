import { IaModel } from "@/models/ia-model";

export function createAgent(style: IaModel['style']): IaModel {
    const instructionsMap: Record<IaModel['style'], string> = {
        anime: 'estilo de ilustrações de anime. Faça traços detalhados baseados na descrição do usuário',
        cartoon: 'estilo de ilustrações de cartoon. Faça traços bem cartoonados e divertidos baseados na descrição do usuário',
        colorful: 'estilo de ilustração mais colorido. Não temos traços de desenhos tão específicos, então faça algo mais divertido e colorido',
        drawer: `estilo de ilustração mais profissional. Desenhe de forma seguindo bem os detalhes. 
        Imagine que você é aqueles desenhista bem detalistas, algo que parece ter sido ser feito a lápis.`,
        magic: 'estilo de ilustração mais mágico. Desenhe algo que, seguindo a descrição do usuário, pareça mágico',
        realistic: 'estilo de ilustração mais realista. Aqui não precisa ser tão desenhado, quero algo que pareça de verdade.'
    }

    const prompt = `Imagine que você é um desenhista experiente e renomado, 
    feito para ilustrar, de forma mágica, situações descritas por um usuário. 
    O estilo que eu quero que você utilize é o ${instructionsMap[style]}`

    return {
        instructions: prompt,
        style,
        model: 'dall-e-2'
    }
}