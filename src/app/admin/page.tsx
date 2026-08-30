"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  BarChart3, FileText, CheckCircle, Star, Zap,
  RefreshCw, Shield, ArrowLeft,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalRequests: number;
  totalPayments: number;
  confirmedPayments: number;
  failedPayments: number;
  feedbackCount: number;
  averageRating: number | null;
}

interface FeedbackItem {
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load admin stats.");
      } else {
        setStats(data.stats);
        setFeedback(data.recentFeedback || []);
      }
    } catch {
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="testnet-badge"><Zap className="w-3 h-3" />Stellar TESTNET</span>
              <span className="text-xs text-[var(--color-muted)]">• Product Validation Panel</span>
            </div>
            <h1 className="text-3xl font-bold">ScholarPay Admin Dashboard</h1>
          </div>

          <button
            onClick={loadStats}
            disabled={loading}
            className="btn-secondary text-sm py-2 px-4"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="error-box mb-6">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase">Total Requests</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold">{stats?.totalRequests ?? "—"}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">Payment requests generated</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase">Confirmed On-Chain</span>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">{stats?.confirmedPayments ?? "—"}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">Verified on Stellar Testnet</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase">Avg Rating</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              {stats?.averageRating ? `${stats.averageRating} / 5` : "N/A"}
            </div>
            <div className="text-xs text-[var(--color-muted)] mt-1">From {stats?.feedbackCount ?? 0} user reviews</div>
          </div>
        </div>

        {/* User Feedback Table */}
        <div className="card">
          <h2 className="text-lg font-bold mb-1">User Feedback Submissions</h2>
          <p className="text-xs text-[var(--color-muted)] mb-6">Real user ratings and comments collected post-payment</p>

          {feedback.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)] text-center py-8">No user feedback submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {feedback.map((f, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] flex justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                        />
                      ))}
                      <span className="text-xs text-[var(--color-muted)] ml-2">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {f.comment && <p className="text-xs text-[var(--color-text)] font-medium">{f.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
