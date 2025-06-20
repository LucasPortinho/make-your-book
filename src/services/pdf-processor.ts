import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAI } from "openai";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { 
  BookIllustration, 
  BookSummary, 
  ComicPage, 
  IllustrationStyle,
  ImageModel 
} from "@/models/illustration-models";
import { ImagePromptBuilder } from "@/utils/builders/image-prompt-builder";
import { PdfFileManager } from "@/utils/pdf-file-manager";

export class PdfProcessorService {
  private llm: ChatOpenAI;
  private openai: OpenAI;
  private promptBuilder: ImagePromptBuilder;
  private fileManager: PdfFileManager;

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY    
    });
    
    this.promptBuilder = new ImagePromptBuilder();
    this.fileManager = new PdfFileManager();
  }

  async loadPdf(filePath: string): Promise<Document[]> {
    const response = await fetch(filePath)

    if (!response.ok) {
      throw new Error(`Erro ao baixar o PDF: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });

    const loader = new PDFLoader(blob);
    return await loader.load();
  }

  private async generateImage(
    prompt: string, 
    imageModel: ImageModel
  ): Promise<string> {
    const modelConfig = imageModel === 'dall-e-3' 
      ? { model: "dall-e-3", size: "1024x1024" as const }
      : { model: "dall-e-2", size: "1024x1024" as const };

    const imageResponse = await this.openai.images.generate({
      ...modelConfig,
      prompt,
      n: 1,
    });

    return imageResponse.data?.[0].url!;
  }

  async generateBookIllustrations(
    filePath: string,
    style: IllustrationStyle,
    imageModel: ImageModel
  ): Promise<{ illustrations: BookIllustration[], pdfPath: string }> {
    const documents = await this.loadPdf(filePath);
    const illustrations: BookIllustration[] = [];
    const maxIllustrations = 30;
    const pagesPerBatch = 15;
    const illustrationsPerBatch = 3;

    // Processar em lotes de 15 páginas
    for (let i = 0; i < documents.length && illustrations.length < maxIllustrations; i += pagesPerBatch) {
      const batch = documents.slice(i, i + pagesPerBatch);
      const batchText = batch.map(doc => doc.pageContent).join("\n");

      // Analisar o texto para encontrar cenas impactantes
      const scenesPrompt = `Analyze this text and identify up to ${illustrationsPerBatch} impactful scenes or descriptions that would make great illustrations. 
      Focus on:
      - Visual scenes with clear imagery
      - Important character moments
      - Dramatic or emotional scenes
      - Descriptive passages about settings or environments

      For each scene, provide:
      1. Page number (relative to this batch, starting from 1)
      2. A detailed description of the visual elements

      If you think that it is a very neutral scene, you don't need to generate a scene, you should just return false in the JSON field "shouldIllustrate"
      
      Format your response as a JSON array with objects containing 'pageNumber' and 'description' and 'shouldIllustrate' (a boolean field -> true ou false).
      
      Text: ${batchText.substring(0, 3000)}`;

      const response = await this.llm.invoke(scenesPrompt);
      const cleanResponse = response.content.toString().replace('json', '').replace('```', '').replace('```', '').trim();
      const scenes = JSON.parse(cleanResponse);

      // Gerar ilustrações para cada cena identificada
      for (const scene of scenes.slice(0, illustrationsPerBatch)) {
        if (illustrations.length >= maxIllustrations) break;
        if (!scene.shouldIllustrate) break

        const prompt = this.promptBuilder.buildIllustrationPrompt(
          scene.description,
          style,
          true
        );

        const imageUrl = await this.generateImage(prompt, imageModel);
        illustrations.push({
          pageNumber: i + scene.pageNumber,
          imageUrl,
          prompt,
          description: scene.description,
        });
      }
    }

    // Criar PDF com ilustrações anexadas
    const pdfPath = await this.fileManager.appendIllustrationsToPdf(filePath, illustrations);
    return { illustrations, pdfPath };
  }

  async generateComicFromPdf(
    filePath: string,
    style: IllustrationStyle,
    imageModel: ImageModel
  ): Promise<{ comicPages: ComicPage[], pdfPath: string }> {
    const documents = await this.loadPdf(filePath);
    const comicPages: ComicPage[] = [];
    const maxPages = 3;

    // Dividir o texto em chunks para criar exatamente 40 páginas
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: Math.floor(documents.map(d => d.pageContent).join("\n").length / maxPages),
      chunkOverlap: 50,
    });

    const allText = documents.map(doc => doc.pageContent).join("\n");
    const chunks = await splitter.splitText(allText);

    // Garantir que temos exatamente 40 chunks
    const finalChunks = chunks.slice(0, maxPages);
    
    // Se tivermos menos de 40, completar com o restante do texto dividido
    if (finalChunks.length < maxPages) {
      const remainingText = chunks.slice(maxPages).join(" ");
      const additionalChunks = await splitter.splitText(remainingText);
      finalChunks.push(...additionalChunks.slice(0, maxPages - finalChunks.length));
    }

    for (let i = 0; i < Math.min(finalChunks.length, maxPages); i++) {
      const chunk = finalChunks[i];

      // Analisar o texto para criar 4 painéis por página
      const panelsPrompt = `Convert this text into EXACTLY 4 comic book panels for a single page. 
      Each panel should:
      - Have a clear visual description
      - Include any dialogue or narration
      - Flow naturally from one to the next
      - Together tell a coherent part of the story
      
      Format as JSON array with exactly 4 objects, each containing:
      - 'description': visual description of what should be illustrated
      - 'text': dialogue or narration for that panel
      
      Text: ${chunk}`;

      const response = await this.llm.invoke(panelsPrompt);
      const cleanResponse = response.content.toString().replace('json', '').replace('```', '').replace('```', '').trim()
      let panels = JSON.parse(cleanResponse);
      
      // Garantir que temos exatamente 4 painéis
      if (panels.length > 4) {
        panels = panels.slice(0, 4);
      } else if (panels.length < 4) {
        // Completar com painéis adicionais se necessário
        while (panels.length < 4) {
          panels.push({
            description: "Continuation of the scene",
            text: ""
          });
        }
      }

      // Gerar uma única imagem com os 4 painéis
      // TODO: tirar truncated
      const prompt = this.promptBuilder.buildComicPagePrompt(panels, style);
      const truncatedPrompt = prompt.toString().substring(0, 997) + '...'
      const imageUrl = await this.generateImage(truncatedPrompt, imageModel);

      comicPages.push({
        pageNumber: i + 1,
        imageUrl,
        panels: panels.map(p => ({
          text: p.text,
          description: p.description
        })),
        prompt,
      });
    }

    // Criar PDF do gibi
    const pdfPath = await this.fileManager.createComicPdf(comicPages);

    return { comicPages, pdfPath };
  }

  async summarizePdf(filePath: string): Promise<{ summary: BookSummary, markdownPath: string }> {
    const documents = await this.loadPdf(filePath);
    const fullText = documents.map(doc => doc.pageContent).join("\n");

    // Usar text splitter para processar textos longos
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 4000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(fullText);

    // Resumir em etapas se o texto for muito longo
    let summary = "";
    if (chunks.length > 1) {
      // Primeiro, resumir cada chunk
      const chunkSummaries = await Promise.all(
        chunks.map(async (chunk) => {
          const response = await this.llm.invoke(
            `Crie um resumo conciso deste texto em português: ${chunk}`
          );
          return response.content;
        })
      );

      // Depois, resumir os resumos
      summary = (await this.llm.invoke(
        `Crie um resumo abrangente e bem estruturado a partir destes resumos parciais em português: ${chunkSummaries.join("\n")}`
      )).content as string;
    } else {
      summary = (await this.llm.invoke(
        `Crie um resumo abrangente deste texto em português: ${fullText}`
      )).content as string;
    }

    // Extrair pontos-chave
    const keyPointsResponse = await this.llm.invoke(
      `Extraia 5-7 pontos-chave deste resumo em formato de array JSON em português: ${summary}. Os objetos deve ser { ponto: content }`
    );
    const cleanResponse = keyPointsResponse.content.toString().replace('json', '').replace('```', '').replace('```', '').trim()
    const keyPoints = JSON.parse(cleanResponse);

    // Tentar extrair o título
    const titleResponse = await this.llm.invoke(
      `Extraia ou infira o título deste livro a partir do texto. Se não encontrar título, crie um apropriado em português. Amostra do texto: ${fullText.substring(0, 1000)}`
    );


    const bookSummary: BookSummary = {
      title: titleResponse.content as string,
      summary,
      keyPoints,
      totalPages: documents.length,
    };

    console.log(bookSummary)

    // Salvar resumo em Markdown
    const markdownPath = await this.fileManager.saveSummaryAsMarkdown(bookSummary);

    return {
      summary: bookSummary,
      markdownPath
    };
  }
}