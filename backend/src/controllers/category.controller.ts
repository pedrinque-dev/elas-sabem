import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const { area } = req.query;
  const categories = await prisma.category.findMany({
    where: area ? { area: String(area) as never } : undefined,
    orderBy: [{ area: "asc" }, { order: "asc" }],
  });
  res.json(categories);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = createCategorySchema.parse(req.body);
  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) throw ApiError.conflict("Já existe uma categoria com este slug.");
  const category = await prisma.category.create({ data });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = updateCategorySchema.parse(req.body);
  const category = await prisma.category.update({ where: { id: req.params.id }, data });
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
