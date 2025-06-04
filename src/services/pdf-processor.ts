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

export class PdfProcessorService {
  private llm: ChatOpenAI;
  private openai: OpenAI;
  private promptBuilder: ImagePromptBuilder;

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
    });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.promptBuilder = new ImagePromptBuilder();
  }

  async loadPdf(filePath: string): Promise<Document[]> {
    const loader = new PDFLoader(filePath);
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
  ): Promise<BookIllustration[]> {
    const documents = await this.loadPdf(filePath);
    const illustrations: BookIllustration[] = [];
    const maxIllustrations = 30;
    const pagesPerBatch = 15;
    const illustrationsPerBatch = 3;

    for (let i = 0; i < documents.length && illustrations.length < maxIllustrations; i += pagesPerBatch) {
      const batch = documents.slice(i, i + pagesPerBatch);
      const batchText = batch.map(doc => doc.pageContent).join("\n");

      const scenesPrompt = `Analyze this text and identify up to ${illustrationsPerBatch} impactful scenes or descriptions that would make great illustrations. 
      Focus on:
      - Visual scenes with clear imagery
      - Important character moments
      - Dramatic or emotional scenes
      - Descriptive passages about settings or environments
      
      For each scene, provide:
      1. Page number (relative to this batch, starting from 1)
      2. A detailed description of the visual elements
      
      Format your response as a JSON array with objects containing 'pageNumber' and 'description'.
      
      Text: ${batchText.substring(0, 3000)}`;

      const response = await this.llm.invoke(scenesPrompt);
      const scenes = JSON.parse(response.content as string);

      for (const scene of scenes.slice(0, illustrationsPerBatch)) {
        if (illustrations.length >= maxIllustrations) break;

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

    return illustrations;
  }

  async generateComicFromPdf(
    filePath: string,
    style: IllustrationStyle,
    imageModel: ImageModel
  ): Promise<ComicPage[]> {
    const documents = await this.loadPdf(filePath);
    const comicPages: ComicPage[] = [];
    const maxPages = 40;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: Math.floor(documents.map(d => d.pageContent).join("\n").length / maxPages),
      chunkOverlap: 50,
    });

    const allText = documents.map(doc => doc.pageContent).join("\n");
    const chunks = await splitter.splitText(allText);

    const finalChunks = chunks.slice(0, maxPages);
    
    if (finalChunks.length < maxPages) {
      const remainingText = chunks.slice(maxPages).join(" ");
      const additionalChunks = await splitter.splitText(remainingText);
      finalChunks.push(...additionalChunks.slice(0, maxPages - finalChunks.length));
    }

    for (let i = 0; i < Math.min(finalChunks.length, maxPages); i++) {
      const chunk = finalChunks[i];
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
      let panels = JSON.parse(response.content as string);

      if (panels.length > 4) {
        panels = panels.slice(0, 4);
      } else if (panels.length < 4) {
        while (panels.length < 4) {
          panels.push({
            description: "Continuation of the scene",
            text: ""
          });
        }
      }

      const prompt = this.promptBuilder.buildComicPagePrompt(panels, style);
      const imageUrl = await this.generateImage(prompt, imageModel);

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

    return comicPages;
  }

  async summarizePdf(filePath: string): Promise<BookSummary> {
    const documents = await this.loadPdf(filePath);
    const fullText = documents.map(doc => doc.pageContent).join("\n");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 4000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(fullText);

    let summary = "";
    if (chunks.length > 1) {
      const chunkSummaries = await Promise.all(
        chunks.map(async (chunk) => {
          const response = await this.llm.invoke(
            `Crie um resumo conciso deste texto em português: ${chunk}`
          );
          return response.content;
        })
      );

      summary = (await this.llm.invoke(
        `Crie um resumo abrangente e bem estruturado a partir destes resumos parciais em português: ${chunkSummaries.join("\n")}`
      )).content as string;
    } else {
      summary = (await this.llm.invoke(
        `Crie um resumo abrangente deste texto em português: ${fullText}`
      )).content as string;
    }

    const keyPointsResponse = await this.llm.invoke(
      `Extraia 5-7 pontos-chave deste resumo em formato de array JSON em português: ${summary}`
    );
    const keyPoints = JSON.parse(keyPointsResponse.content as string);

    const titleResponse = await this.llm.invoke(
      `Extraia ou infira o título deste livro a partir do texto. Se não encontrar título, crie um apropriado em português. Amostra do texto: ${fullText.substring(0, 1000)}`
    );

    return {
      title: titleResponse.content as string,
      summary,
      keyPoints,
      totalPages: documents.length,
    };
  }
}