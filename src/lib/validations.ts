import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

const BookBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'O livro deve ter, no mínimo, 3 caracteres')
    .max(80, 'O livro deve ter um máximo de 80 caracteres')
    .transform(val => sanitizeHtml(val)),
  model: z
    .string()
    .trim()
    .min(3, 'O id do modelo é obrigatório')
    .transform(val => sanitizeHtml(val)),
});

const AgentBaseSchema = z.object({
    model: z
    .string()
    .trim()
    .min(3, 'O modelo deve ter, no mínimo, 3 caracteres')
    .max(80, 'O modelo deve ter um máximo de 80 caracteres')
    .transform(val => sanitizeHtml(val)),
    style: z
    .string()
    .trim()
    .min(3, 'O estilo é obrigatório')
    .max(80, 'O estilo deve ter um máximo de 80 caracteres')
    .transform(val => sanitizeHtml(val)),
    instructions: z
    .string()
    .trim()
    .max(600, 'As instruções não devem passar de 600 caracteres')
    .transform(val => sanitizeHtml(val)),
    name: z
    .string()
    .trim()
    .min(3, 'O nome deve ter, no mínimo, 3 caracteres')
    .max(80, 'O nome deve ter um máximo de 80 caracteres')
    .transform(val => sanitizeHtml(val)),
})

// BookCreateSchema: igual ao base por enquanto
export const BookCreateSchema = BookBaseSchema;

export const AgentCreateSchema = AgentBaseSchema;

// BookUpdateSchema: pode incluir campos extras no futuro (ex: id)
export const BookUpdateSchema = BookBaseSchema.extend({
  // id: z.string().uuid('ID inválido'),
});