import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// ❌ IMPORTANT: Plesk + Next.js production me har request pe new client mat banao
// ✅ Isliye hum global object me store kar rahe hain
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
