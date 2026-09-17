import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { aiChatSchema } from "../validators/aiChat.validator";
import { askNina } from "../services/aiService";

/**
 * POST /api/ai/chat
 * A conversa NUNCA é persistida no banco de dados (privacidade por padrão).
 * O histórico enviado pelo cliente existe apenas na memória do navegador da usuária.
 */
export const chatWithNina = asyncHandler(async (req: Request, res: Response) => {
  const { message, history } = aiChatSchema.parse(req.body);
  const result = await askNina(message, history);
  res.json(result);
});
