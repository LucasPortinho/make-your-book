import { ChatOpenAI } from '@langchain/openai';
import { DallEAPIWrapper } from '@langchain/openai';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { PDFDocument, rgb } from 'pdf-lib';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.js';
import { IaModel } from '@/models/ia-model';

// Schema para decisão de ilustração
const IllustrationDecisionSchema = z.object({
  shouldIllustrate: z.boolean(),
  reason: z.string(),
  prompt: z.string().optional(),
});

// Tipo para o agente
type IllustratorAgent = {
  illustratePDF: (pdfPath: string, outputPath: string) => Promise<string>;
};

// Função principal para criar o agente
export async function createAgent(iaModel: IaModel): Promise<IllustratorAgent> {
  // Configurar o modelo OpenAI
  const llm = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
  });

  // Configurar DALL-E
  const dalle = new DallEAPIWrapper({
    model: iaModel.model as 'dall-e-2' | 'dall-e-3',
    n: 1,
    size: '1024x1024',
  });

  // Parser para respostas estruturadas
  const parser = StructuredOutputParser.fromZodSchema(IllustrationDecisionSchema);

  // Mapeamento de estilos para prompts
  const stylePrompts = {
    drawer: 'pencil sketch, hand-drawn illustration, black and white drawing',
    colorful: 'vibrant colors, bright and vivid illustration, colorful art',
    cartoon: 'cartoon style, animated look, comic book illustration',
    magic: 'magical atmosphere, fantasy art, mystical and enchanted illustration',
    anime: 'anime style, manga illustration, Japanese animation art',
    realistic: 'photorealistic, highly detailed, realistic digital art'
  };

  // Função para decidir se deve ilustrar
  async function shouldIllustrateText(text: string): Promise<{ shouldIllustrate: boolean; prompt?: string }> {
    const formatInstructions = parser.getFormatInstructions();
    
    const prompt = `
Você é um especialista em análise literária e ilustração de livros.
Analise o seguinte texto e decida se ele deve receber uma ilustração.

Critérios para ilustração:
1. Cenas com forte carga emocional (alegria, tristeza, medo, surpresa)
2. Descrições detalhadas de cenários ou ambientes
3. Momentos cruciais da narrativa ou pontos de virada
4. Apresentação de personagens principais ou importantes
5. Ações dramáticas ou sequências de movimento

Se decidir ilustrar, crie um prompt detalhado e descritivo para gerar uma imagem no estilo "${iaModel.style}".
O prompt deve capturar a essência da cena e ser visualmente rico.

Texto para análise:
${text}

${formatInstructions}
`;

    try {
      const response = await llm.invoke(prompt);
      const parsed = await parser.parse(response.content as string);
      return {
        shouldIllustrate: parsed.shouldIllustrate,
        prompt: parsed.prompt,
      };
    } catch (error) {
      return { shouldIllustrate: false };
    }
  }

  // Função para gerar ilustração
  async function generateIllustration(prompt: string): Promise<string | null> {
    try {
      // Enriquecer o prompt com o estilo específico
      const styleDescription = stylePrompts[iaModel.style];
      const enrichedPrompt = `${prompt}, ${styleDescription}, high quality illustration`;
      
      // O DallEAPIWrapper aceita o prompt como primeiro parâmetro
      const imageUrl = await dalle.invoke(enrichedPrompt);
      
      // Baixar a imagem
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer).toString('base64');
    } catch (error) {
      console.error('Erro ao gerar ilustração:', error);
      return null;
    }
  }

  // Função para extrair texto do PDF usando pdfjs-dist
  async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string[]> {
    try {
      // Configurar worker do pdfjs
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      // Converter Buffer para Uint8Array
      const data = new Uint8Array(pdfBuffer);
      
      // Carregar o documento
      const loadingTask = pdfjs.getDocument({ data });
      const pdf = await loadingTask.promise;
      
      const pages: string[] = [];
      
      // Extrair texto de cada página
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        pages.push(pageText);
      }
      
      return pages;
    } catch (error) {
      console.error('Erro ao extrair texto do PDF:', error);
      // Retornar páginas vazias em caso de erro
      return [];
    }
  }

  // Função principal para ilustrar PDF
  async function illustratePDF(pdfPath: string, outputPath: string): Promise<string> {
    try {
      // Ler o PDF original
      const pdfBuffer = await readFile(pdfPath);
      
      // Carregar o PDF com pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const totalPages = pdfDoc.getPageCount();
      
      // Extrair texto de cada página
      const pages = await extractTextFromPDF(pdfBuffer);
      
      // Se a extração falhou, usar texto padrão
      if (pages.length === 0) {
        for (let i = 0; i < totalPages; i++) {
          pages.push(`Página ${i + 1} - Conteúdo não extraído`);
        }
      }

      // Contadores para limites
      let totalIllustrations = 0;
      const maxTotal = 30;
      const maxPer10Pages = 3;
      
      // Array para armazenar as posições das ilustrações
      const illustrationsToAdd: { pageIndex: number; imageBase64: string }[] = [];
      
      // Processar páginas em blocos de 10
      for (let blockStart = 0; blockStart < totalPages; blockStart += 10) {
        const blockEnd = Math.min(blockStart + 10, totalPages);
        let blockIllustrations = 0;
        
        for (let i = blockStart; i < blockEnd; i++) {
          if (totalIllustrations >= maxTotal || blockIllustrations >= maxPer10Pages) {
            break;
          }
          
          const pageText = pages[i];
          if (!pageText || pageText.trim().length < 100) continue;
          
          // Decidir se deve ilustrar
          const decision = await shouldIllustrateText(pageText);
          
          if (decision.shouldIllustrate && decision.prompt) {
            console.log(`Gerando ilustração para página ${i + 1}...`);
            
            // Gerar ilustração
            const imageBase64 = await generateIllustration(decision.prompt);
            
            if (imageBase64) {
              illustrationsToAdd.push({ pageIndex: i, imageBase64 });
              totalIllustrations++;
              blockIllustrations++;
            }
          }
        }
      }

      // Adicionar todas as ilustrações de uma vez (para manter os índices corretos)
      let addedPages = 0;
      for (const { pageIndex, imageBase64 } of illustrationsToAdd) {
        // Adicionar nova página após a página atual (ajustando para páginas já adicionadas)
        const insertIndex = pageIndex + 1 + addedPages;
        const newPage = pdfDoc.insertPage(insertIndex);
        
        // Inserir imagem na nova página
        const image = await pdfDoc.embedPng(Buffer.from(imageBase64, 'base64'));
        const { width, height } = newPage.getSize();
        const imageWidth = width * 0.8;
        const imageHeight = (image.height / image.width) * imageWidth;
        
        newPage.drawImage(image, {
          x: width * 0.1,
          y: (height - imageHeight) / 2,
          width: imageWidth,
          height: imageHeight,
        });
        
        // Adicionar título à página da ilustração
        newPage.drawText(`Ilustração da página ${pageIndex + 1}`, {
          x: 50,
          y: height - 50,
          size: 12,
          color: rgb(0.5, 0.5, 0.5),
        });
        
        addedPages++;
      }

      console.log(`Total de ilustrações adicionadas: ${totalIllustrations}`);

      // Salvar o PDF modificado
      const modifiedPdfBytes = await pdfDoc.save();
      await writeFile(outputPath, modifiedPdfBytes);
      
      return outputPath;
    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      throw error;
    }
  }

  return {
    illustratePDF,
  };
}

// Função auxiliar para processar um PDF
export async function processIllustration(
  iaModel: IaModel,
  inputFile: string,
  outputFile: string
): Promise<string> {
  const agent = await createAgent(iaModel);
  
  const inputPath = resolve(process.cwd(), 'public', 'uploads', inputFile);
  const outputPath = resolve(process.cwd(), 'public', 'results', outputFile);
  
  return await agent.illustratePDF(inputPath, outputPath);
}