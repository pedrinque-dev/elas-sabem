import { Router } from "express";
import {
  listServices,
  getService,
  listServiceCategories,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/categories", listServiceCategories);
router.get("/", listServices);
router.get("/:id", getService);

router.post("/", requireAuth, createService);
router.put("/:id", requireAuth, updateService);
router.delete("/:id", requireAuth, deleteService);

export default router;
