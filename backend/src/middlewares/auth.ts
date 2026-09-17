import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

export interface AuthPayload {
  sub: string;
  email: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

/**
 * Exige um token JWT válido no header Authorization: Bearer <token>.
 * Usado em todas as rotas administrativas (/api/admin/*, escrita em /api/*).
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Token de autenticação ausente."));
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    req.admin = payload;
    return next();
  } catch {
    return next(ApiError.unauthorized("Token inválido ou expirado."));
  }
}

/** Restringe a rota a determinados papéis administrativos. */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(ApiError.forbidden("Você não tem permissão para esta ação."));
    }
    return next();
  };
}
