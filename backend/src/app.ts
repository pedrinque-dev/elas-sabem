import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { apiRateLimiter } from "./middlewares/rateLimit";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import contentRoutes from "./routes/content.routes";
import storyRoutes from "./routes/story.routes";
import serviceRoutes from "./routes/service.routes";
import statisticRoutes from "./routes/statistic.routes";
import quizRoutes from "./routes/quiz.routes";
import educationalMaterialRoutes from "./routes/educationalMaterial.routes";
import searchRoutes from "./routes/search.routes";
import aiRoutes from "./routes/ai.routes";
import adminRoutes from "./routes/admin.routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  // Segurança básica de cabeçalhos HTTP
  app.use(helmet());

  // CORS restrito à origem do frontend configurada em .env
  app.use(cors({ origin: env.corsOrigin, credentials: true }));

  app.use(express.json({ limit: "1mb" }));
  app.use(apiRateLimiter);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "elas-sabem-api", timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/contents", contentRoutes);
  app.use("/api/stories", storyRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/statistics", statisticRoutes);
  app.use("/api/quizzes", quizRoutes);
  app.use("/api/materials", educationalMaterialRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
