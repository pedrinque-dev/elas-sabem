import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";

/** Números-resumo exibidos no dashboard do painel administrativo. */
export const getAdminOverview = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalContents,
    publishedContents,
    totalStories,
    pendingStories,
    totalServices,
    pendingReports,
  ] = await Promise.all([
    prisma.content.count(),
    prisma.content.count({ where: { status: "PUBLICADO" } }),
    prisma.story.count(),
    prisma.story.count({ where: { status: "PENDENTE" } }),
    prisma.service.count(),
    prisma.report.count({ where: { status: "PENDENTE" } }),
  ]);

  res.json({
    totalContents,
    publishedContents,
    totalStories,
    pendingStories,
    totalServices,
    pendingReports,
  });
});
