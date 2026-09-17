import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";

export const listMaterials = asyncHandler(async (req: Request, res: Response) => {
  const { audience, type } = req.query;
  const materials = await prisma.educationalMaterial.findMany({
    where: {
      audience: audience ? String(audience) : undefined,
      type: type ? String(type) : undefined,
    },
    orderBy: { order: "asc" },
  });
  res.json(materials);
});

export const createMaterial = asyncHandler(async (req: Request, res: Response) => {
  const material = await prisma.educationalMaterial.create({ data: req.body });
  res.status(201).json(material);
});

export const updateMaterial = asyncHandler(async (req: Request, res: Response) => {
  const material = await prisma.educationalMaterial.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(material);
});

export const deleteMaterial = asyncHandler(async (req: Request, res: Response) => {
  await prisma.educationalMaterial.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
