import { Router } from "express";
import {
  listStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
} from "../controllers/statistic.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", listStatistics);
router.post("/", requireAuth, createStatistic);
router.put("/:id", requireAuth, updateStatistic);
router.delete("/:id", requireAuth, deleteStatistic);

export default router;
