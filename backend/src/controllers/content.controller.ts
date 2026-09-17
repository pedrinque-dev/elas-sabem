import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { createContentSchema, updateContentSchema } from "../validators/content.validator";

/**
 * Lista conteúdos publicados (uso público) com filtros por área, categoria e busca textual.
 * Se req.admin estiver presente (rota autenticada), também retorna rascunhos/arquivados.
 */
export const listContents = asyncHandler(async (req: Request, res: Response) => {
  const { area, categoryId, q, status } = req.query;
  const isAdminRequest = Boolean(req.admin);

  const contents = await prisma.content.findMany({
    where: {
      area: area ? (String(area) as never) : undefined,
      categoryId: categoryId ? String(categoryId) : undefined,
      status: isAdminRequest
        ? status
          ? (String(status) as never)
          : undefined
        : "PUBLICADO",
      OR: q
        ? [
            { title: { contains: String(q), mode: "insensitive" } },
            { summary: { contains: String(q), mode: "insensitive" } },
            { tags: { has: String(q) } },
          ]
        : undefined,
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  res.json(contents);
});

export const getContentBySlug = asyncHandler(async (req: Request, res: Response) => {
  const content = await prisma.content.findUnique({
    where: { slug: req.params.id },
    include: { category: true, sources: { include: { source: true } } },
  });
  if (!content) throw ApiError.notFound("Conteúdo não encontrado.");
  if (content.status !== "PUBLICADO" && !req.admin) {
    throw ApiError.notFound("Conteúdo não encontrado.");
  }

  const related = await prisma.content.findMany({
    where: {
      id: { not: content.id },
      area: content.area,
      status: "PUBLICADO",
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  res.json({ ...content, related });
});

export const createContent = asyncHandler(async (req: Request, res: Response) => {
  const data = createContentSchema.parse(req.body);
  const content = await prisma.content.create({
    data: {
      ...data,
      authorId: req.admin?.sub,
      publishedAt: data.status === "PUBLICADO" ? new Date() : null,
    },
  });
  res.status(201).json(content);
});

export const updateContent = asyncHandler(async (req: Request, res: Response) => {
  const data = updateContentSchema.parse(req.body);
  const existing = await prisma.content.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Conteúdo não encontrado.");

  const content = await prisma.content.update({
    where: { id: req.params.id },
    data: {
      ...data,
      publishedAt:
        data.status === "PUBLICADO" && !existing.publishedAt ? new Date() : undefined,
    },
  });
  res.json(content);
});

export const deleteContent = asyncHandler(async (req: Request, res: Response) => {
  await prisma.content.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
