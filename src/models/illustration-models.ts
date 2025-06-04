import { IaModel } from "@/models/ia-model";

export type IllustrationStyle = IaModel['style'];

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