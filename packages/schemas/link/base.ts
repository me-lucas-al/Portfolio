import { z } from "zod";

export const DefaultLinkSchema = z.object({
  title: z.string().min(1, { message: "O título não pode estar vazio" }),
  url: z.string().url({ message: "Insira uma URL válida" }),
  icon: z.string().min(1, { message: "O ícone é obrigatório" }),
});

export type DefaultLinkType = z.infer<typeof DefaultLinkSchema>;
