import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

/** Rota não encontrada — deve ser o último middleware antes do errorHandler. */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    },
  });
}

/**
 * Middleware central de tratamento de erros.
 * Nunca vaza detalhes internos (stack trace, queries SQL, etc.) em produção.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos.",
        details: err.flatten(),
      },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        details: err.details,
      },
    });
  }

  // Erro inesperado: logamos no servidor, mas respondemos de forma genérica.
  console.error("[erro não tratado]", err);
  return res.status(500).json({
    error: {
      message:
        env.nodeEnv === "development"
          ? String((err as Error)?.message ?? err)
          : "Erro interno do servidor.",
    },
  });
}
