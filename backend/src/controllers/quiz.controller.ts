import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const listQuizzes = asyncHandler(async (_req: Request, res: Response) => {
  const quizzes = await prisma.quiz.findMany({
    where: { active: true },
    select: { id: true, slug: true, title: true, description: true },
  });
  res.json(quizzes);
});

export const getQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await prisma.quiz.findFirst({
    where: { OR: [{ id: req.params.id }, { slug: req.params.id }] },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { answers: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!quiz) throw ApiError.notFound("Quiz não encontrado.");
  res.json(quiz);
});
