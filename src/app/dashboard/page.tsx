"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FileText, Plus, CheckCircle, Clock, AlertTriangle, ExternalLink, Copy,
  Check, Wallet, RefreshCw, GraduationCap, DollarSign, Send, Zap, LogOut,
} from "lucide-react";
import { shortenAddress, isValidStellarAddress } from "@/lib/stellar";
import { formatErrorMessage } from "@/lib/utils";

interface PaymentRequest {
  id: string;
  title: string;
  purpose: string;
  amount: string;
  asset: string;
  recipientAddress: string;
  deadline: string;
  status: "CREATED" | "PENDING" | "SUBMITTED" | "CONFIRMED" | "FAILED" | "EXPIRED" | "CANCELLED";
  description?: string;
  createdAt: string;
  payments: { id: string; status: string; transactionHash: string }[];
}

export default function DashboardPage() {
  const { user, loading, logout, updateWallet } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create form state
  const [form, setForm] = useState({
    title: "",
    purpose: "Tuition",
    amount: "",
    asset: "XLM",
    recipientAddress: "",
    deadline: "",
    description: "",
  });
  const [createErr, setCreateErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Pre-fill recipient address with user's saved wallet
  useEffect(() => {
    if (user?.walletAddress) {
      setForm((prev) => ({ ...prev, recipientAddress: user.walletAddress || "" }));
    }
  }, [user]);

  const fetchRequests = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch {
      // Ignore error
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, fetchRequests]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateErr("");

    const numAmount = parseFloat(form.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setCreateErr("Amount must be a positive number.");
      return;
    }

    if (!isValidStellarAddress(form.recipientAddress)) {
      setCreateErr("Invalid recipient wallet address. Must be a valid Stellar public key starting with G.");
      return;
    }

    if (!form.deadline) {
      setCreateErr("Please set a payment deadline.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          purpose: form.purpose,
          amount: numAmount,
          asset: form.asset,
          recipientAddress: form.recipientAddress,
          deadline: new Date(form.deadline).toISOString(),
          description: form.description || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateErr(formatErrorMessage(data.error || "Failed to create payment request."));
      } else {
        // Save wallet if provided
        if (form.recipientAddress && form.recipientAddress !== user?.walletAddress) {
          updateWallet(form.recipientAddress);
        }
        setShowCreate(false);
        setForm({
          title: "", purpose: "Tuition", amount: "", asset: "XLM",
          recipientAddress: user?.walletAddress || "", deadline: "", description: "",
        });
        fetchRequests();
      }
    } catch {
      setCreateErr("Failed to create request.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyPayLink = (requestId: string) => {
    const url = `${window.location.origin}/pay/${requestId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(requestId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[var(--color-muted)] text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const confirmedCount = requests.filter((r) => r.status === "CONFIRMED").length;
  const pendingCount = requests.filter((r) => r.status === "CREATED" || r.status === "PENDING" || r.status === "SUBMITTED").length;
  const failedCount = requests.filter((r) => r.status === "FAILED").length;
  const totalAmount = requests.reduce((sum, r) => sum + (r.status === "CONFIRMED" ? parseFloat(r.amount) : 0), 0);

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header banner */}
        <div className="glass rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="testnet-badge"><Zap className="w-3 h-3" />Stellar TESTNET</span>
              <span className="text-xs text-[var(--color-muted)] capitalize">• {user.role.toLowerCase()} Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {timeGreeting}, <span className="gradient-text">{user.name}</span> 👋
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              {user.country} • {user.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {user.role === "STUDENT" && (
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary text-sm py-2.5 px-5"
              >
                <Plus className="w-4 h-4" />
                New Payment Request
              </button>
            )}
            <button onClick={logout} className="btn-secondary text-sm py-2.5 px-4 text-red-400 border-red-500/20 hover:bg-red-500/10">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase">Total Requests</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{requests.length}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">Payment requests created</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase">Pending</span>
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">Awaiting payment</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase">Completed</span>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{confirmedCount}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">On-chain confirmed</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase">Failed</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">{failedCount}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">Rejected transactions</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase">Total Received</span>
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold gradient-text">{totalAmount.toFixed(2)} XLM</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">Verified on Testnet</div>
          </div>
        </div>

        {/* Create Request Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 glass flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="card w-full max-w-lg glow max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Create Payment Request</h2>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">Generate a shareable payment link for Stellar Testnet</p>
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-lg"
                >
                  ✕
                </button>
              </div>

              {createErr && (
                <div className="error-box mb-4">
                  <span>⚠</span>
                  <span>{formatErrorMessage(createErr)}</span>
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="label" htmlFor="title">Title / Purpose summary *</label>
                  <input
                    id="title"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Fall 2026 Semester Tuition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label" htmlFor="purpose">Category *</label>
                    <select
                      id="purpose"
                      value={form.purpose}
                      onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                      className="input-field"
                    >
                      <option value="Tuition">Tuition</option>
                      <option value="Accommodation">Accommodation</option>
                      <option value="Rent">Rent</option>
                      <option value="Living Expenses">Living Expenses</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label" htmlFor="amount">Amount (XLM) *</label>
                    <input
                      id="amount"
                      type="number"
                      step="0.0000001"
                      min="0.0000001"
                      required
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="input-field"
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="recipientAddress">Your Stellar Wallet Address (Recipient) *</label>
                  <input
                    id="recipientAddress"
                    required
                    value={form.recipientAddress}
                    onChange={(e) => setForm({ ...form, recipientAddress: e.target.value })}
                    className="input-field font-mono text-xs"
                    placeholder="G..."
                  />
                  <p className="text-[10px] text-[var(--color-muted)] mt-1">
                    Must start with 'G' (Stellar public key). Sender will transfer funds to this address.
                  </p>
                </div>

                <div>
                  <label className="label" htmlFor="deadline">Deadline *</label>
                  <input
                    id="deadline"
                    type="datetime-local"
                    required
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label" htmlFor="description">Additional Notes / Description</label>
                  <textarea
                    id="description"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Student ID #12345 — Harvard University"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-sm py-2 px-5"
                  >
                    {submitting ? "Creating..." : "Create Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Requests List */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold">Payment Requests</h2>
              <p className="text-xs text-[var(--color-muted)]">Track and share your cross-border payment requests</p>
            </div>

            <button
              onClick={fetchRequests}
              disabled={fetching}
              className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              title="Refresh requests"
            >
              <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {fetching && requests.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-20 w-full"></div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-3 opacity-50" />
              <h3 className="font-semibold text-base mb-1">No payment requests yet</h3>
              <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto mb-6">
                Create a payment request to get a shareable Stellar link for tuition or living expenses.
              </p>
              {user.role === "STUDENT" && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="btn-primary text-sm py-2 px-5"
                >
                  <Plus className="w-4 h-4" />
                  Create First Request
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-base text-[var(--color-text)] truncate">{r.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                        {r.purpose}
                      </span>
                      <span className={`status-badge status-${r.status.toLowerCase()}`}>
                        {r.status}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--color-muted)] flex items-center gap-3 flex-wrap">
                      <span>Recipient: <code className="font-mono text-blue-300">{shortenAddress(r.recipientAddress)}</code></span>
                      <span>Deadline: {new Date(r.deadline).toLocaleDateString()}</span>
                      <span>Created: {new Date(r.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <div className="font-bold text-lg text-[var(--color-text)]">{parseFloat(r.amount).toFixed(2)} {r.asset}</div>
                      {r.payments?.[0]?.transactionHash && (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${r.payments[0].transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-400 hover:underline flex items-center justify-end gap-1"
                        >
                          Tx Hash <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyPayLink(r.id)}
                        className="btn-secondary text-xs py-1.5 px-3"
                        title="Copy payment link"
                      >
                        {copiedId === r.id ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Share Link</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/pay/${r.id}`}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        View Page
                      </Link>
                    </div>
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
