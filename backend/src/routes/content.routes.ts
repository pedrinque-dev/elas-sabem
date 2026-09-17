import { Router } from "express";
import {
  listContents,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
} from "../controllers/content.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Rotas públicas: só retornam conteúdo PUBLICADO
router.get("/", listContents);
router.get("/:id", getContentBySlug);

// Rotas administrativas
router.post("/", requireAuth, createContent);
router.put("/:id", requireAuth, updateContent);
router.delete("/:id", requireAuth, deleteContent);

export default router;
