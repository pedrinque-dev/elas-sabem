import { Router } from "express";
import {
  listStories,
  getStory,
  submitStory,
  moderateStory,
  deleteStory,
} from "../controllers/story.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", listStories);
router.get("/:id", getStory);
router.post("/", submitStory); // envio público, entra como PENDENTE

router.patch("/:id/moderate", requireAuth, moderateStory);
router.delete("/:id", requireAuth, deleteStory);

export default router;
