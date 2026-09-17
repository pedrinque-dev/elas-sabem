import { Router } from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", listCategories);
router.post("/", requireAuth, createCategory);
router.put("/:id", requireAuth, updateCategory);
router.delete("/:id", requireAuth, deleteCategory);

export default router;
