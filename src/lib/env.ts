/**
 * Centralized Environment Configuration & Validation for ScholarPay
 */

export const env = {
  // Public Client-Side Environment Variables (safe to expose to browser)
  NEXT_PUBLIC_STELLAR_NETWORK:
    process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET",
  NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE:
    process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
  NEXT_PUBLIC_STELLAR_HORIZON_URL:
    process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org",
  NEXT_PUBLIC_STELLAR_RPC_URL:
    process.env.NEXT_PUBLIC_STELLAR_RPC_URL || process.env.STELLAR_RPC_URL || "https://soroban-testnet.stellar.org",
  NEXT_PUBLIC_SOROBAN_CONTRACT_ID:
    process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID || "CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ",

  // Analytics & Monitoring (Public)
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || "",

  // Server-Only Secrets
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  JWT_SECRET: process.env.JWT_SECRET || "scholarpay-dev-secret-change-in-production",
  NODE_ENV: process.env.NODE_ENV || "development",
};

/**
 * Validates environment configuration on server startup.
 * Logs clear configuration guidance without leaking secret values.
 */
export function validateEnvironment(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (env.NODE_ENV === "production") {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
      warnings.push("PRODUCTION CONFIG WARNING: DATABASE_URL should point to hosted PostgreSQL, not SQLite.");
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes("scholarpay-dev-secret")) {
      warnings.push("PRODUCTION CONFIG WARNING: JWT_SECRET must be set to a secure, random secret.");
    }
  }

  if (!env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID) {
    warnings.push("CONFIG WARNING: NEXT_PUBLIC_SOROBAN_CONTRACT_ID is not configured.");
  }

  if (process.env.NODE_ENV === "development" && warnings.length > 0) {
    console.log("[Env Validation]", warnings.join(" | "));
  }

  return { valid: warnings.length === 0, warnings };
}

// Run validation when loaded on server
if (typeof window === "undefined") {
  validateEnvironment();
}
