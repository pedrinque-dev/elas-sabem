import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

/**
 * Busca global textual (sem IA) em conteúdos, histórias, serviços e materiais.
 * Funciona de forma totalmente independente da Nina.
 */
export const globalSearch = asyncHandler(async (req: Request, res: Response) => {
  const q = String(req.query.q ?? "").trim();
  if (q.length < 2) {
    throw ApiError.badRequest("Informe pelo menos 2 caracteres para buscar.");
  }

  const [contents, stories, services, materials] = await Promise.all([
    prisma.content.findMany({
      where: {
        status: "PUBLICADO",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 6,
      select: { id: true, slug: true, title: true, summary: true, area: true },
    }),
    prisma.story.findMany({
      where: {
        status: "APROVADO",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
      select: { id: true, title: true, excerpt: true, theme: true },
    }),
    prisma.service.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 4,
      select: { id: true, name: true, city: true, state: true },
    }),
    prisma.educationalMaterial.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      take: 4,
      select: { id: true, title: true, type: true, audience: true },
    }),
  ]);

  res.json({ query: q, contents, stories, services, materials });
});
