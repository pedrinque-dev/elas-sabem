import { z } from "zod";

export const createStatisticSchema = z.object({
  indicator: z.string().min(2).max(160),
  category: z.string().min(2).max(60),
  region: z.string().min(2).max(60),
  period: z.string().min(2).max(20),
  value: z.number(),
  unit: z.string().min(1).max(40),
  isDemo: z.boolean().optional(),
  description: z.string().min(5).max(400),
  sourceId: z.string().uuid().optional().nullable(),
});

export const updateStatisticSchema = createStatisticSchema.partial();
