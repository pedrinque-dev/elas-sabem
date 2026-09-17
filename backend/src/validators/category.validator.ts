import { z } from "zod";

const areaEnum = z.enum(["ENTENDER", "CUIDAR", "PROTEGER", "EDUCACAO", "COMO_AJUDAR"]);

export const createCategorySchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(120),
  description: z.string().max(400).optional(),
  area: areaEnum,
  icon: z.string().max(60).optional(),
  order: z.number().int().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
