import { z } from "zod";

export const aiChatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Escreva algo para a Nina.")
    .max(2000, "Mensagem muito longa. Tente resumir em até 2000 caracteres."),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(10)
    .optional(),
});
