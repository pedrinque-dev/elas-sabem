import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema } from "../validators/auth.validator";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await prisma.admin.findUnique({ where: { email } });

  // Mensagem genérica proposital: não revelar se o e-mail existe ou não.
  if (!admin || !admin.active) {
    throw ApiError.unauthorized("E-mail ou senha inválidos.");
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) {
    throw ApiError.unauthorized("E-mail ou senha inválidos.");
  }

  const token = jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] }
  );
  
  res.json({
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) throw ApiError.unauthorized();
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin.sub },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  if (!admin) throw ApiError.notFound("Administrador não encontrado.");
  res.json(admin);
});
