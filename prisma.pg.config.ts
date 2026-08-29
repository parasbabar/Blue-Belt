import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 config for PostgreSQL (Neon). Run with: npx prisma db push --config prisma.pg.config.ts
export default defineConfig({
  schema: "prisma/schema.postgresql.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] || "",
  },
});
