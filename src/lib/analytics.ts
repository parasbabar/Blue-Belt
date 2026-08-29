import posthog from "posthog-js";

let isInitialized = false;

/**
 * Ensures PostHog is initialized on the client side with valid environment variables.
 * Safe to call multiple times.
 */
function ensureInitialized(): boolean {
  if (typeof window === "undefined") return false;
  if (isInitialized) return true;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (
    apiKey &&
    apiKey !== "your-posthog-api-key" &&
    !apiKey.includes("demo_key") &&
    !apiKey.includes("your_actual")
  ) {
    try {
      posthog.init(apiKey, {
        api_host: apiHost,
        capture_pageview: true,
        persistence: "localStorage",
        autocapture: true,
      });
      isInitialized = true;
    } catch (err) {
      console.warn("[PostHog Init Warning]", err);
    }
  }
  return isInitialized;
}

// Attempt initial auto-init on module import in browser
if (typeof window !== "undefined") {
  ensureInitialized();
}

export const analytics = {
  trackSignupStarted: (role: string) => {
    if (ensureInitialized()) {
      posthog.capture("signup_started", { role });
    }
  },
  trackUserRegistered: (userId: string, role: string, country: string) => {
    if (ensureInitialized()) {
      posthog.identify(userId, { role, country });
      posthog.capture("user_registered", { userId, role, country });
      posthog.capture("signup_completed", { userId, role, country });
    }
  },
  trackUserLogin: (userId: string, role: string) => {
    if (ensureInitialized()) {
      posthog.identify(userId, { role });
      posthog.capture("user_login", { userId, role });
      posthog.capture("login_completed", { userId, role });
    }
  },
  trackWalletConnected: (walletType: string, address: string) => {
    if (ensureInitialized()) {
      posthog.capture("wallet_connected", { walletType, address });
    }
  },
  trackPaymentRequestCreated: (requestId: string, amount: number, asset: string, purpose: string) => {
    if (ensureInitialized()) {
      posthog.capture("payment_request_created", { requestId, amount, asset, purpose });
    }
  },
  trackPaymentStarted: (requestId: string, amount: number, walletType: string) => {
    if (ensureInitialized()) {
      posthog.capture("payment_started", { requestId, amount, walletType });
    }
  },
  trackPaymentSigned: (requestId: string, walletType: string) => {
    if (ensureInitialized()) {
      posthog.capture("payment_signed", { requestId, walletType });
    }
  },
  trackTransactionSubmitted: (requestId: string, txHash: string) => {
    if (ensureInitialized()) {
      posthog.capture("payment_submitted", { requestId, txHash });
      posthog.capture("transaction_submitted", { requestId, txHash });
    }
  },
  trackTransactionConfirmed: (requestId: string, txHash: string, amount: number) => {
    if (ensureInitialized()) {
      posthog.capture("payment_verified", { requestId, txHash, amount });
      posthog.capture("transaction_confirmed", { requestId, txHash, amount });
    }
  },
  trackTransactionFailed: (requestId: string, error: string) => {
    if (ensureInitialized()) {
      posthog.capture("payment_failed", { requestId, error });
      posthog.capture("transaction_failed", { requestId, error });
    }
  },
  trackReceiptViewed: (paymentId: string, txHash: string) => {
    if (ensureInitialized()) {
      posthog.capture("receipt_viewed", { paymentId, txHash });
    }
  },
  trackFeedbackSubmitted: (paymentId: string, rating: number) => {
    if (ensureInitialized()) {
      posthog.capture("feedback_submitted", { paymentId, rating });
    }
  },
};
