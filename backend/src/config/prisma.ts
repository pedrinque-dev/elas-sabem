import { PrismaClient } from "@prisma/client";

// Evita múltiplas instâncias do Prisma Client em ambiente de desenvolvimento
// (tsx watch reinicia o processo, mas isso protege contra hot-reload duplicando conexões).
declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV === "development") {
  global.__prisma__ = prisma;
}
