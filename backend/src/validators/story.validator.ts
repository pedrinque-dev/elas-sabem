import { z } from "zod";

export const submitStorySchema = z.object({
  authorName: z.string().min(2).max(80),
  title: z.string().min(3).max(160),
  excerpt: z.string().min(10).max(300),
  body: z.string().min(30).max(8000),
  theme: z.string().min(2).max(60),
});

export const moderateStorySchema = z.object({
  status: z.enum(["PENDENTE", "APROVADO", "REJEITADO"]),
});
