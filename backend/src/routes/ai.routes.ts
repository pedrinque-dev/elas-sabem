import { Router } from "express";
import { chatWithNina } from "../controllers/aiChat.controller";
import { aiRateLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/chat", aiRateLimiter, chatWithNina);

export default router;
