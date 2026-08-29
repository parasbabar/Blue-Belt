import { NextResponse } from "next/server";
import { monitoring } from "@/lib/monitoring";

export async function GET() {
  const testError = new Error("ScholarPay Controlled Test Exception — Verifying Sentry Capture");
  monitoring.captureException(testError, { testRoute: true, timestamp: new Date().toISOString() });
  
  // Wait for Sentry background transport to complete before completing API response
  await monitoring.flush(3000);

  return NextResponse.json({
    status: "Captured",
    message: "Controlled Sentry test error dispatched successfully. Check Sentry dashboard if DSN is configured.",
  });
}
