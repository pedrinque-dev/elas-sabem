import { createApp } from "./app";
import { env, isAiConfigured } from "./config/env";
import { prisma } from "./config/prisma";

async function main() {
  await prisma.$connect();
  console.log("✅ Conectado ao PostgreSQL via Prisma.");

  if (!isAiConfigured()) {
    console.warn(
      "⚠️  GROQ_API_KEY não configurada — a rota /api/ai/chat (Nina) retornará erro até ser configurada."
    );
  }

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`🚀 API do Elas Sabem rodando em http://localhost:${env.port}`);
    console.log(`   Ambiente: ${env.nodeEnv}`);
  });
}

main().catch((error) => {
  console.error("Falha ao iniciar o servidor:", error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
