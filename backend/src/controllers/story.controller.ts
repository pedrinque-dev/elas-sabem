import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { submitStorySchema, moderateStorySchema } from "../validators/story.validator";

/** Lista pública: apenas histórias aprovadas. Uso administrativo pode ver todos os status. */
export const listStories = asyncHandler(async (req: Request, res: Response) => {
  const { theme, featured, status } = req.query;
  const isAdmin = Boolean(req.admin);

  const stories = await prisma.story.findMany({
    where: {
      status: isAdmin ? (status ? (String(status) as never) : undefined) : "APROVADO",
      theme: theme ? String(theme) : undefined,
      featured: featured === "true" ? true : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(stories);
});

export const getStory = asyncHandler(async (req: Request, res: Response) => {
  const story = await prisma.story.findUnique({ where: { id: req.params.id } });
  if (!story) throw ApiError.notFound("História não encontrada.");
  if (story.status !== "APROVADO" && !req.admin) throw ApiError.notFound("História não encontrada.");
  res.json(story);
});

/** Envio público de história — sempre entra como PENDENTE, nunca publicada automaticamente. */
export const submitStory = asyncHandler(async (req: Request, res: Response) => {
  const data = submitStorySchema.parse(req.body);
  const story = await prisma.story.create({
    data: { ...data, status: "PENDENTE" },
  });
  res.status(201).json({
    message: "Recebemos sua história. Ela passará por moderação antes de ser publicada.",
    id: story.id,
  });
});

export const moderateStory = asyncHandler(async (req: Request, res: Response) => {
  const { status } = moderateStorySchema.parse(req.body);
  const story = await prisma.story.update({
    where: { id: req.params.id },
    data: { status, moderatedAt: new Date() },
  });
  res.json(story);
});

export const deleteStory = asyncHandler(async (req: Request, res: Response) => {
  await prisma.story.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
