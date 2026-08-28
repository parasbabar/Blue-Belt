import posthog from "posthog-js";

// Initialize PostHog if configured
if (typeof window !== "undefined") {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (apiKey && apiKey !== "your-posthog-api-key" && !apiKey.includes("demo_key")) {
    posthog.init(apiKey, {
      api_host: apiHost,
      loaded: (posthogInstance) => {
        if (process.env.NODE_ENV === "development") {
          // Keep logging minimal in dev
        }
      },
      capture_pageview: true,
      persistence: "localStorage",
    });
  }
}

export const analytics = {
  trackSignupStarted: (role: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("signup_started", { role });
    }
  },
  trackSignupCompleted: (userId: string, role: string, country: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.identify(userId, { role, country });
      posthog.capture("signup_completed", { userId, role, country });
    }
  },
  trackLoginCompleted: (userId: string, role: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.identify(userId, { role });
      posthog.capture("login_completed", { userId, role });
    }
  },
  trackWalletConnected: (walletType: string, address: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("wallet_connected", { walletType, address });
    }
  },
  trackPaymentRequestCreated: (requestId: string, amount: number, asset: string, purpose: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("payment_request_created", { requestId, amount, asset, purpose });
    }
  },
  trackPaymentStarted: (requestId: string, amount: number, walletType: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("payment_started", { requestId, amount, walletType });
    }
  },
  trackTransactionSubmitted: (requestId: string, txHash: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("transaction_submitted", { requestId, txHash });
    }
  },
  trackTransactionConfirmed: (requestId: string, txHash: string, amount: number) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("transaction_confirmed", { requestId, txHash, amount });
    }
  },
  trackTransactionFailed: (requestId: string, error: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("transaction_failed", { requestId, error });
    }
  },
  trackReceiptViewed: (paymentId: string, txHash: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("receipt_viewed", { paymentId, txHash });
    }
  },
  trackFeedbackSubmitted: (paymentId: string, rating: number) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("feedback_submitted", { paymentId, rating });
    }
  },
};
