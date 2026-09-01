"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  CheckCircle, ExternalLink, Zap, Copy, Check, Star, ArrowLeft,
} from "lucide-react";
import { shortenAddress, CONTRACT_ID } from "@/lib/stellar";
import { analytics } from "@/lib/analytics";

interface PaymentReceiptData {
  id: string;
  amount: string;
  senderWallet: string;
  transactionHash: string;
  status: string;
  createdAt: string;
  paymentRequest: {
    id: string;
    title: string;
    purpose: string;
    asset: string;
    recipientAddress: string;
    student: { name: string; country: string };
  };
}

export default function ReceiptPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = use(params);

  const [payment, setPayment] = useState<PaymentReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);

  // Feedback state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    async function loadReceipt() {
      setLoading(true);
      try {
        const res = await fetch(`/api/payments/${paymentId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Receipt not found.");
        } else {
          setPayment(data.payment);
          if (data.payment) {
            analytics.trackReceiptViewed(data.payment.id, data.payment.transactionHash);
          }
        }
      } catch {
        setError("Failed to load receipt.");
      } finally {
        setLoading(false);
      }
    }
    loadReceipt();
  }, [paymentId]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          paymentId,
        }),
      });
      if (res.ok) {
        setSubmittedFeedback(true);
        analytics.trackFeedbackSubmitted(paymentId, rating);
      }
    } catch {
      // Ignore
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const copyHash = () => {
    if (payment?.transactionHash) {
      navigator.clipboard.writeText(payment.transactionHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[var(--color-muted)] text-sm">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 pb-16 max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Receipt Not Found</h1>
          <p className="text-[var(--color-muted)] text-sm mb-6">{error || "Could not locate transaction record."}</p>
          <Link href="/dashboard" className="btn-primary">Return to Dashboard</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        {/* Receipt Container */}
        <div className="card glow p-8 space-y-6">
          {/* Header */}
          <div className="text-center pb-6 border-b border-[var(--color-border)]">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <span className="testnet-badge mb-2"><Zap className="w-3 h-3" />Stellar TESTNET Verified</span>
            <h1 className="text-2xl font-bold">Official Payment Receipt</h1>
            <p className="text-xs text-[var(--color-muted)] mt-1">Receipt ID: {payment.id}</p>
          </div>

          {/* Key Amount */}
          <div className="text-center py-4 bg-[var(--color-surface-2)] rounded-xl">
            <span className="text-xs text-[var(--color-muted)] block mb-1">Amount Paid</span>
            <span className="text-3xl font-bold gradient-text">
              {parseFloat(payment.amount).toFixed(2)} {payment.paymentRequest.asset}
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-muted)]">Payment Purpose:</span>
              <span className="font-medium text-[var(--color-text)]">{payment.paymentRequest.title}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-muted)]">Category:</span>
              <span className="font-semibold text-blue-300">{payment.paymentRequest.purpose}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-muted)]">Student:</span>
              <span className="font-medium">{payment.paymentRequest.student.name} ({payment.paymentRequest.student.country})</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-muted)]">Sender Wallet:</span>
              <span className="font-mono text-xs text-blue-300">{shortenAddress(payment.senderWallet, 6, 6)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-muted)]">Recipient Wallet:</span>
              <span className="font-mono text-xs text-blue-300">{shortenAddress(payment.paymentRequest.recipientAddress, 6, 6)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-muted)]">Date & Time:</span>
              <span>{new Date(payment.createdAt).toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-muted)]">Status:</span>
              <span className="status-badge status-confirmed">CONFIRMED ON-CHAIN</span>
            </div>

            {/* Hash row */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-[var(--color-muted)]">Stellar Transaction Hash:</span>
                <button onClick={copyHash} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                  {copiedHash ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHash ? "Copied" : "Copy Hash"}
                </button>
              </div>
              <code className="font-mono text-[11px] text-blue-300 bg-[var(--color-surface-2)] p-2.5 rounded block break-all">
                {payment.transactionHash}
              </code>
            </div>

            {/* Smart contract row */}
            <div className="pt-1 text-xs text-[var(--color-muted)]">
              <span>Soroban Contract Address:</span>
              <code className="font-mono text-[10px] text-violet-300 block break-all bg-[var(--color-surface-2)] p-2 rounded mt-1">
                {CONTRACT_ID || "CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ"}
              </code>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--color-border)]">
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${payment.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 justify-center text-sm py-2.5"
            >
              View on Stellar Explorer <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* User Feedback Card */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <h3 className="font-bold text-base mb-1 text-center">How was your ScholarPay experience?</h3>
            <p className="text-xs text-[var(--color-muted)] text-center mb-4">Your feedback helps us improve our cross-border payment platform.</p>

            {submittedFeedback ? (
              <div className="success-box text-center justify-center">
                <span>Thank you for your feedback! ⭐</span>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4 max-w-md mx-auto">
                {/* Rating stars */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-[var(--color-muted)]"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Short feedback / comments..."
                    className="input-field text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="btn-secondary w-full justify-center text-xs py-2"
                >
                  {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
