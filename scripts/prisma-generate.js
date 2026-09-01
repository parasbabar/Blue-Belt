/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config();
const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL || "";
const isPg = dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://") || process.env.VERCEL;

console.log(`[Prisma Generate] Target DB: ${isPg ? "PostgreSQL (Neon)" : "SQLite"}`);

if (isPg) {
  execSync("npx prisma generate --config prisma.pg.config.ts", { stdio: "inherit" });
} else {
  execSync("npx prisma generate --config prisma7.config.ts", { stdio: "inherit" });
}
