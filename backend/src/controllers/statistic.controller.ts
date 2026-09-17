import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { createStatisticSchema, updateStatisticSchema } from "../validators/statistic.validator";

export const listStatistics = asyncHandler(async (req: Request, res: Response) => {
  const { category, region, period, indicator } = req.query;
  const statistics = await prisma.statistic.findMany({
    where: {
      category: category ? String(category) : undefined,
      region: region ? String(region) : undefined,
      period: period ? String(period) : undefined,
      indicator: indicator ? { contains: String(indicator), mode: "insensitive" } : undefined,
    },
    include: { source: true },
    orderBy: [{ category: "asc" }, { period: "asc" }],
  });
  res.json(statistics);
});

export const createStatistic = asyncHandler(async (req: Request, res: Response) => {
  const data = createStatisticSchema.parse(req.body);
  const statistic = await prisma.statistic.create({ data });
  res.status(201).json(statistic);
});

export const updateStatistic = asyncHandler(async (req: Request, res: Response) => {
  const data = updateStatisticSchema.parse(req.body);
  const statistic = await prisma.statistic.update({ where: { id: req.params.id }, data });
  res.json(statistic);
});

export const deleteStatistic = asyncHandler(async (req: Request, res: Response) => {
  await prisma.statistic.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
