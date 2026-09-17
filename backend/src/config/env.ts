import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(
      `Variável de ambiente obrigatória ausente: ${name}. Verifique seu arquivo .env (veja .env.example).`
    );
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3333),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100),
  aiRateLimitMax: Number(process.env.AI_RATE_LIMIT_MAX ?? 10),
};

export const isAiConfigured = () => Boolean(env.groqApiKey);
