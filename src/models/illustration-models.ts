export type IllustrationStyle = 'drawer' | 'colorful' | 'cartoon' | 'magic' | 'anime' | 'realistic';

export type ImageModel = 'dall-e-2' | 'dall-e-3';

export type BookIllustration = {
  pageNumber: number;
  imageUrl: string;
  prompt: string;
  description: string;
};

export type ComicPage = {
  pageNumber: number;
  imageUrl: string; // URL da imagem com os 4 painéis
  panels: {
    text: string;
    description: string;
  }[];
  prompt: string;
};

export type BookSummary = {
  title: string;
  summary: string;
  keyPoints: string[];
  totalPages: number;
};

export type BookIllustrationResult = {
  illustrations: BookIllustration[];
  pdfPath: string; // Caminho do PDF com ilustrações
};

export type ComicResult = {
  comicPages: ComicPage[];
  pdfPath: string; // Caminho do PDF do gibi
};

export type SummaryResult = {
  summary: BookSummary;
  pdfPath: string; // Caminho do PDF do resumo
  markdownPath: string; // Caminho do arquivo Markdown
};