import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(2).max(160),
  description: z.string().max(500).optional(),
  categoryId: z.string().uuid(),
  address: z.string().min(3).max(300),
  city: z.string().min(2).max(120),
  state: z.string().length(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().max(30).optional(),
  website: z.string().url().optional(),
  hours: z.string().max(200).optional(),
  is24h: z.boolean().optional(),
  verified: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();
