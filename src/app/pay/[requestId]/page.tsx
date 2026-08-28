"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  GraduationCap, Wallet, CheckCircle, Clock, AlertTriangle, ExternalLink,
  ArrowRight, Shield, Zap, RefreshCw, Copy, Check, DollarSign,
} from "lucide-react";
import { shortenAddress, isValidStellarAddress, prepareXLMPaymentTransaction, CONTRACT_ID } from "@/lib/stellar";
import { isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";

interface PaymentRequestData {
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
  student: { id: string; name: string; country: string };
  payments: { id: string; status: string; transactionHash: string; senderWallet: string }[];
}

type PayStep = "CONNECT" | "REVIEW" | "SIGNING" | "SUBMITTING" | "VERIFYING" | "CONFIRMED" | "FAILED";

export default function PaymentRequestPage({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = use(params);

  const [req, setReq] = useState<PaymentRequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Wallet state
  const [walletAddress, setWalletAddress] = useState("");
  const [walletType, setWalletType] = useState<"freighter" | "albedo" | "manual" | null>(null);
  const [walletErr, setWalletErr] = useState("");
  const [connecting, setConnecting] = useState(false);

  // Manual fallback address input if no wallet extension installed
  const [manualAddress, setManualAddress] = useState("");

  // Payment process state
  const [step, setStep] = useState<PayStep>("CONNECT");
  const [payMsg, setPayMsg] = useState("");
  const [txHash, setTxHash] = useState("");
  const [confirmedPaymentId, setConfirmedPaymentId] = useState("");

  // Load payment request data
  const loadRequest = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/requests/${requestId}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment request not found.");
      } else {
        setReq(data.request);
        if (data.request.status === "CONFIRMED") {
          setStep("CONFIRMED");
          if (data.request.payments?.[0]) {
            setTxHash(data.request.payments[0].transactionHash);
            setConfirmedPaymentId(data.request.payments[0].id);
          }
        }
      }
    } catch {
      setError("Failed to load payment request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  // Connect Freighter wallet
  const connectFreighter = async () => {
    setWalletErr("");
    setConnecting(true);
    try {
      const connected = await isConnected();
      if (!connected.isConnected) {
        setWalletErr("Freighter wallet is not installed or enabled. Please install the Freighter browser extension or try Albedo.");
        setConnecting(false);
        return;
      }

      const access = await requestAccess();
      if (access.error) {
        setWalletErr(access.error);
      } else if (access.address) {
        setWalletAddress(access.address);
        setWalletType("freighter");
        setStep("REVIEW");
      }
    } catch (err: any) {
      setWalletErr(err?.message || "Failed to connect Freighter wallet.");
    } finally {
      setConnecting(false);
    }
  };

  // Connect via Albedo (web popup, works without browser extensions!)
  const connectAlbedo = async () => {
    setWalletErr("");
    setConnecting(true);
    try {
      const albedo = (await import("@albedo-link/intent")).default;
      const res = await albedo.publicKey({});
      if (res.pubkey) {
        setWalletAddress(res.pubkey);
        setWalletType("albedo");
        setStep("REVIEW");
      }
    } catch (err: any) {
      setWalletErr(err?.message || "Albedo connection rejected or closed.");
    } finally {
      setConnecting(false);
    }
  };

  // Connect manual address (for demo or custom signed transaction entry)
  const connectManual = () => {
    if (!isValidStellarAddress(manualAddress)) {
      setWalletErr("Please enter a valid Stellar wallet address (starts with 'G').");
      return;
    }
    setWalletAddress(manualAddress);
    setWalletType("manual");
    setStep("REVIEW");
  };

  // Execute REAL Stellar Testnet transaction payment
  const handlePay = async () => {
    if (!req || !walletAddress) return;

    setStep("SIGNING");
    setPayMsg("Preparing transaction for Stellar TESTNET...");
    setWalletErr("");

    try {
      // 1. Prepare transaction XDR
      const prep = await prepareXLMPaymentTransaction(
        walletAddress,
        req.recipientAddress,
        req.amount
      );

      if (prep.error || !prep.xdr) {
        setStep("FAILED");
        setWalletErr(prep.error || "Failed to prepare transaction.");
        return;
      }

      setPayMsg("Please sign the transaction in your Stellar wallet...");

      let signedXdr = "";

      // 2. Sign transaction via user's wallet
      if (walletType === "freighter") {
        const signResult = await signTransaction(prep.xdr, {
          networkPassphrase: "Test SDF Network ; October 2013",
        });
        if (signResult.error) {
          setStep("FAILED");
          setWalletErr(signResult.error || "Transaction signature rejected by wallet.");
          return;
        }
        signedXdr = signResult.signedTxXdr;
      } else if (walletType === "albedo") {
        const albedo = (await import("@albedo-link/intent")).default;
        const result = await albedo.tx({
          xdr: prep.xdr,
          network: "testnet",
        });
        signedXdr = result.signed_envelope_xdr;
      } else {
        // For manual fallback, request signature or submit XDR
        setStep("FAILED");
        setWalletErr("Manual address mode requires a wallet extension (Freighter/Albedo) to sign transactions.");
        return;
      }

      setStep("SUBMITTING");
      setPayMsg("Submitting transaction to Stellar Testnet network...");

      // 3. Submit transaction to Horizon Testnet RPC
      const horizonRes = await fetch("https://horizon-testnet.stellar.org/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ tx: signedXdr }),
      });

      const horizonData = await horizonRes.json();

      if (!horizonRes.ok || !horizonData.hash) {
        const detail = horizonData?.extras?.result_codes?.transaction || horizonData?.detail || "Transaction submission rejected on-chain.";
        setStep("FAILED");
        setWalletErr(`Stellar Testnet submission failed: ${detail}`);
        return;
      }

      const hash = horizonData.hash;
      setTxHash(hash);

      setStep("VERIFYING");
      setPayMsg("Backend independently verifying transaction hash on Stellar Testnet...");

      // 4. Backend verification against Stellar Horizon
      const verifyRes = await fetch("/api/pay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionHash: hash,
          paymentRequestId: req.id,
          senderWallet: walletAddress,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setStep("FAILED");
        setWalletErr(verifyData.error || "Backend verification failed.");
      } else {
        setConfirmedPaymentId(verifyData.payment.id);
        setStep("CONFIRMED");
        setReq({ ...req, status: "CONFIRMED" });
      }
    } catch (err: any) {
      setStep("FAILED");
      setWalletErr(err?.message || "Payment process encountered an error.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[var(--color-muted)] text-sm">Loading payment request...</p>
        </div>
      </div>
    );
  }

  if (error || !req) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 pb-16 max-w-md mx-auto px-4 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Request Not Found</h1>
          <p className="text-[var(--color-muted)] text-sm mb-6">{error || "This link may be invalid or expired."}</p>
          <Link href="/" className="btn-primary">Return Home</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 testnet-badge mb-3">
            <Zap className="w-3 h-3" />
            Stellar TESTNET Payment Request
          </div>
          <h1 className="text-3xl font-bold">{req.title}</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            Student: <span className="text-[var(--color-text)] font-semibold">{req.student.name}</span> ({req.student.country})
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Request summary (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="card">
              <h3 className="font-semibold text-sm text-[var(--color-muted)] uppercase mb-4">Payment Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Category:</span>
                  <span className="font-semibold text-blue-300">{req.purpose}</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-[var(--color-muted)]">Amount Requested:</span>
                  <span className="text-xl font-bold gradient-text">{parseFloat(req.amount).toFixed(2)} {req.asset}</span>
                </div>

                <hr className="divider my-2" />

                <div>
                  <span className="text-[var(--color-muted)] text-xs block mb-1">Recipient Address (Student):</span>
                  <code className="font-mono text-xs text-blue-300 bg-[var(--color-surface-2)] p-2 rounded block break-all">
                    {req.recipientAddress}
                  </code>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-muted)]">Deadline:</span>
                  <span>{new Date(req.deadline).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-muted)]">Status:</span>
                  <span className={`status-badge status-${req.status.toLowerCase()}`}>{req.status}</span>
                </div>

                {req.description && (
                  <div className="pt-2">
                    <span className="text-[var(--color-muted)] text-xs block mb-1">Notes:</span>
                    <p className="text-xs text-[var(--color-muted)] bg-[var(--color-surface-2)] p-2 rounded italic">
                      {req.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Contract info badge */}
            <div className="card glass-light text-xs space-y-2">
              <div className="flex items-center gap-2 text-violet-300 font-semibold">
                <Shield className="w-4 h-4" />
                Soroban Smart Contract Secured
              </div>
              <p className="text-[var(--color-muted)] leading-relaxed">
                This transaction is governed by Soroban contract address:
              </p>
              <code className="font-mono text-[10px] text-violet-300 block break-all bg-[var(--color-bg)] p-1.5 rounded">
                {CONTRACT_ID || "CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ"}
              </code>
            </div>
          </div>

          {/* Payment action card (3 cols) */}
          <div className="md:col-span-3">
            <div className="card glow">
              {/* Step: CONNECT */}
              {step === "CONNECT" && (
                <div className="space-y-5">
                  <div className="text-center">
                    <Wallet className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                    <h2 className="text-xl font-bold">Connect Stellar Wallet</h2>
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      Choose a Stellar-compatible wallet to review and sign the testnet payment.
                    </p>
                  </div>

                  {walletErr && (
                    <div className="error-box">
                      <span>⚠</span>
                      <span>{walletErr}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={connectFreighter}
                      disabled={connecting}
                      className="w-full p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-blue-500/50 flex items-center justify-between transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 group-hover:scale-105 transition-transform">
                          🚀
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Freighter Wallet</div>
                          <div className="text-xs text-[var(--color-muted)]">Official browser extension for Stellar</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--color-muted)] group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      onClick={connectAlbedo}
                      disabled={connecting}
                      className="w-full p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-purple-500/50 flex items-center justify-between transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center font-bold text-purple-400 group-hover:scale-105 transition-transform">
                          ✨
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Albedo Wallet</div>
                          <div className="text-xs text-[var(--color-muted)]">Web-based popup — no extension required</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--color-muted)] group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  {/* Manual fallback input for demonstration */}
                  <div className="pt-2">
                    <label className="label text-xs">Or enter address manually for review:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        placeholder="G..."
                        className="input-field text-xs font-mono"
                      />
                      <button onClick={connectManual} className="btn-secondary text-xs py-2 px-3">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step: REVIEW */}
              {step === "REVIEW" && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                    <div>
                      <span className="text-xs text-[var(--color-muted)]">Connected Wallet:</span>
                      <div className="font-mono text-sm text-blue-300 font-semibold">
                        {shortenAddress(walletAddress, 6, 6)} ({walletType})
                      </div>
                    </div>
                    <button
                      onClick={() => { setStep("CONNECT"); setWalletAddress(""); }}
                      className="text-xs text-[var(--color-muted)] hover:text-red-400"
                    >
                      Disconnect
                    </button>
                  </div>

                  <div className="bg-[var(--color-surface-2)] p-4 rounded-xl space-y-2 text-sm">
                    <h4 className="font-semibold text-xs text-[var(--color-muted)] uppercase">Transaction Review</h4>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">From:</span>
                      <span className="font-mono text-xs text-blue-300">{shortenAddress(walletAddress)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">To:</span>
                      <span className="font-mono text-xs text-blue-300">{shortenAddress(req.recipientAddress)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">Network:</span>
                      <span className="text-yellow-400 font-semibold text-xs">Stellar TESTNET</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-[var(--color-border)]">
                      <span className="font-bold">Total Payment:</span>
                      <span className="text-xl font-bold gradient-text">{parseFloat(req.amount).toFixed(2)} {req.asset}</span>
                    </div>
                  </div>

                  {walletErr && (
                    <div className="error-box">
                      <span>⚠</span>
                      <span>{walletErr}</span>
                    </div>
                  )}

                  <button
                    onClick={handlePay}
                    className="btn-primary w-full justify-center py-3.5 text-base"
                  >
                    Pay {parseFloat(req.amount).toFixed(2)} {req.asset} with Stellar
                  </button>

                  <p className="text-[10px] text-center text-[var(--color-muted)]">
                    By clicking pay, your wallet will prompt you to sign a real transaction on Stellar Testnet.
                  </p>
                </div>
              )}

              {/* Step: SIGNING / SUBMITTING / VERIFYING */}
              {(step === "SIGNING" || step === "SUBMITTING" || step === "VERIFYING") && (
                <div className="text-center py-10 space-y-4">
                  <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-lg font-bold">Processing Payment</h3>
                  <p className="text-sm text-[var(--color-muted)] max-w-sm mx-auto">{payMsg}</p>
                </div>
              )}

              {/* Step: CONFIRMED */}
              {step === "CONFIRMED" && (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto animate-bounce" />
                  <h2 className="text-2xl font-bold text-green-400">Payment Confirmed!</h2>
                  <p className="text-sm text-[var(--color-muted)]">
                    The transaction was successfully executed and verified on Stellar Testnet.
                  </p>

                  {txHash && (
                    <div className="bg-[var(--color-surface-2)] p-3 rounded-lg text-left text-xs font-mono space-y-1">
                      <span className="text-[var(--color-muted)] block">Transaction Hash:</span>
                      <span className="text-blue-300 break-all">{txHash}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    {confirmedPaymentId && (
                      <Link
                        href={`/receipt/${confirmedPaymentId}`}
                        className="btn-primary text-sm py-2.5 px-5 justify-center"
                      >
                        View Official Receipt
                      </Link>
                    )}
                    {txHash && (
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm py-2.5 px-5 justify-center"
                      >
                        Stellar Explorer <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Step: FAILED */}
              {step === "FAILED" && (
                <div className="text-center py-6 space-y-4">
                  <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
                  <h2 className="text-2xl font-bold text-red-400">Payment Failed</h2>
                  <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
                    {walletErr || "The payment transaction could not be completed."}
                  </p>
                  <button
                    onClick={() => setStep("REVIEW")}
                    className="btn-primary text-sm py-2 px-5 mx-auto"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
