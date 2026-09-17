import { NextFunction, Request, Response } from "express";

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Envolve um controller assíncrono garantindo que qualquer erro
 * (incluindo rejeições de Promise) seja encaminhado ao middleware de erro,
 * evitando handlers assíncronos que derrubam o processo silenciosamente.
 */
export function asyncHandler(handler: Handler) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}
