import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * Singleton Prisma client untuk Next.js (Prisma 7).
 *
 * Prisma 7 memerlukan driver adapter untuk koneksi database.
 * Untuk SQLite, kita gunakan @prisma/adapter-libsql.
 *
 * Hot-reload dev server Next.js akan terus membuat instance baru jika
 * tidak di-cache di globalThis.
 */

function createPrismaClient(): PrismaClient {
  // Baca DATABASE_URL dari env, fallback ke lokasi default
  const rawUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

  // LibSQL memerlukan path absolut untuk file SQLite lokal.
  // Gunakan process.cwd() agar path selalu relatif dari root project,
  // baik saat dev maupun production (Next.js mengubah __dirname).
  let dbUrl = rawUrl;
  if (rawUrl.startsWith("file:./") || rawUrl.startsWith("file:../")) {
    const relativePath = rawUrl.replace(/^file:/, "");
    const absolutePath = path.resolve(process.cwd(), relativePath);
    dbUrl = "file:" + absolutePath.replace(/\\/g, "/");
    console.log("[Prisma] Resolved DB URL:", dbUrl);
  }

  const adapter = new PrismaLibSql({ url: dbUrl });
  return new PrismaClient({ adapter });
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = global.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}
