import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/** Limite geral aplicado a toda a API. */
export const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: "Muitas requisições. Tente novamente em instantes." } },
});

/** Limite mais restrito para a rota de IA, que tem custo maior. */
export const aiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.aiRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { message: "Limite de mensagens para a Nina atingido. Aguarde um momento e tente novamente." },
  },
});

/** Limite dedicado ao login, para dificultar força bruta. */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: "Muitas tentativas de login. Tente novamente mais tarde." } },
});
