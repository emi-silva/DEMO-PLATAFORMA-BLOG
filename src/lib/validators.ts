import { z } from "zod";

export const postPayloadSchema = z.object({
  title: z.string().min(3, "El título necesita al menos 3 caracteres."),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "El contenido MDX no puede estar vacío."),
  tags: z.array(z.string().min(1)).default([]),
  published: z.boolean().default(false),
});

export type PostPayload = z.infer<typeof postPayloadSchema>;
