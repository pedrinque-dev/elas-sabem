import { Router } from "express";
import {
  listMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../controllers/educationalMaterial.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", listMaterials);
router.post("/", requireAuth, createMaterial);
router.put("/:id", requireAuth, updateMaterial);
router.delete("/:id", requireAuth, deleteMaterial);

export default router;
