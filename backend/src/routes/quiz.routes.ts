import { Router } from "express";
import { listQuizzes, getQuiz } from "../controllers/quiz.controller";

const router = Router();

router.get("/", listQuizzes);
router.get("/:id", getQuiz);

export default router;
