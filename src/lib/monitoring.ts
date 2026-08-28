import * as Sentry from "@sentry/nextjs";

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
};
