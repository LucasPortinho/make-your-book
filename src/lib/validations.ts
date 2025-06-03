import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

const BookBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Título deve ter, no mínimo, 3 caracteres')
    .max(80, 'Título deve ter um máximo de 80 caracteres')
    .transform(val => sanitizeHtml(val)),
  style: z
    .string()
    .trim()
    .min(3, 'Conteúdo é obrigatório')
    .transform(val => sanitizeHtml(val)),
});

// PostCreateSchema: igual ao base por enquanto
export const BookCreateSchema = BookBaseSchema;

// BookUpdateSchema: pode incluir campos extras no futuro (ex: id)
export const BookUpdateSchema = BookBaseSchema.extend({
  // id: z.string().uuid('ID inválido'),
});