import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

// Direct initialization fallback for Next.js App Router API routes
// Only init if a real ingest DSN is present (must start with https://)
if (SENTRY_DSN && SENTRY_DSN.startsWith("https://")) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: true,
    enabled: true,
  });
}

export const monitoring = {
  captureException: (error: any, context?: Record<string, any>) => {
    // Prevent logging sensitive fields (passwords, JWTs, keys)
    const safeContext = { ...context };
    if (safeContext.password) delete safeContext.password;
    if (safeContext.token) delete safeContext.token;
    if (safeContext.secret) delete safeContext.secret;

    if (process.env.NODE_ENV === "development") {
      console.error("[Monitoring Captured Error]:", error?.message || error, safeContext);
    }

    Sentry.captureException(error, { extra: safeContext });
  },

  captureMessage: (message: string, level: "info" | "warning" | "error" = "info") => {
    Sentry.captureMessage(message, level);
  },

  flush: async (timeout = 4000) => {
    try {
      await Sentry.flush(timeout);
    } catch {
      // ignore
    }
  },
};
