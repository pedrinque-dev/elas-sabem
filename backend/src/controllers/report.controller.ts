import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const listReports = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const reports = await prisma.report.findMany({
    where: { status: status ? (String(status) as never) : undefined },
    orderBy: { createdAt: "desc" },
  });
  res.json(reports);
});

export const moderateReport = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) throw ApiError.unauthorized();
  const { status } = req.body as { status: "APROVADO" | "REJEITADO" };
  const report = await prisma.report.update({
    where: { id: req.params.id },
    data: { status, moderatedAt: new Date(), moderatorId: req.admin.sub },
  });
  res.json(report);
});
