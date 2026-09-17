import { Router } from "express";
import { getAdminOverview } from "../controllers/adminStats.controller";
import { listReports, moderateReport } from "../controllers/report.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);
router.get("/overview", getAdminOverview);
router.get("/reports", listReports);
router.patch("/reports/:id/moderate", moderateReport);

export default router;
