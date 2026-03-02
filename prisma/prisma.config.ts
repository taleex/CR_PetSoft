// prisma/prisma.config.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  adapter: {
    url: "file:./dev.db", // ou process.env.DATABASE_URL
  },
});