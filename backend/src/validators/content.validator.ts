import { z } from "zod";

const areaEnum = z.enum(["ENTENDER", "CUIDAR", "PROTEGER", "EDUCACAO", "COMO_AJUDAR"]);
const statusEnum = z.enum(["RASCUNHO", "PUBLICADO", "ARQUIVADO"]);

export const createContentSchema = z.object({
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "O slug deve conter apenas letras minúsculas, números e hífens."),
  title: z.string().min(3).max(160),
  summary: z.string().min(10).max(400),
  body: z.string().min(20),
  area: areaEnum,
  status: statusEnum.optional(),
  categoryId: z.string().uuid("categoryId deve ser um UUID válido."),
  coverImageUrl: z.string().url().optional().nullable(),
  readTimeMin: z.number().int().positive().max(120).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export const updateContentSchema = createContentSchema.partial();
