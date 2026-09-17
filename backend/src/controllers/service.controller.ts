import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { createServiceSchema, updateServiceSchema } from "../validators/service.validator";

export const listServices = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId, state, city, q } = req.query;
  const services = await prisma.service.findMany({
    where: {
      categoryId: categoryId ? String(categoryId) : undefined,
      state: state ? String(state).toUpperCase() : undefined,
      city: city ? { equals: String(city), mode: "insensitive" } : undefined,
      name: q ? { contains: String(q), mode: "insensitive" } : undefined,
    },
    include: { category: true },
    orderBy: { name: "asc" },
  });
  res.json(services);
});

export const getService = asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.service.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });
  if (!service) throw ApiError.notFound("Serviço não encontrado.");
  res.json(service);
});

export const listServiceCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.serviceCategory.findMany({ orderBy: { name: "asc" } });
  res.json(categories);
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const data = createServiceSchema.parse(req.body);
  const service = await prisma.service.create({ data });
  res.status(201).json(service);
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const data = updateServiceSchema.parse(req.body);
  const service = await prisma.service.update({ where: { id: req.params.id }, data });
  res.json(service);
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
