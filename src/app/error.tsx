"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { formatErrorMessage } from "@/lib/utils";
import { monitoring } from "@/lib/monitoring";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    monitoring.captureException(error, { globalBoundary: true });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--color-bg)]">
      <div className="card max-w-md w-full text-center space-y-5 glow">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-1">Something went wrong</h2>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            {formatErrorMessage(error, "ScholarPay encountered an unexpected runtime issue.")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button onClick={() => reset()} className="btn-primary text-xs py-2.5 px-4 justify-center">
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link href="/" className="btn-secondary text-xs py-2.5 px-4 justify-center">
            <Home className="w-3.5 h-3.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
