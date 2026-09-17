import { Router } from "express";
import { login, me } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth";
import { authRateLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/login", authRateLimiter, login);
router.get("/me", requireAuth, me);

export default router;
