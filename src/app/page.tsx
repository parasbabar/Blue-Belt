import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  GraduationCap, Globe, Zap, Shield, Clock, CheckCircle, ArrowRight,
  Star, TrendingUp, Lock, RefreshCw, Users, BarChart3, Wallet, FileText,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(30,45,80,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 testnet-badge mb-6">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>Powered by Stellar • TESTNET</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            International student payments,{" "}
            <span className="gradient-text">simplified.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            ScholarPay connects international students and sponsors for instant, transparent, and low-cost tuition and living expense payments settled directly on the Stellar blockchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/register" className="btn-primary text-base px-8 py-3 w-full sm:w-auto justify-center">
              Create Payment Request
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-base px-8 py-3 w-full sm:w-auto justify-center">
              See How It Works
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            {[
              { val: "~4s", label: "Settlement Time" },
              { val: "$0.00001", label: "Avg Fee / Tx" },
              { val: "100%", label: "On-Chain Verified" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-4">
                <div className="text-xl sm:text-2xl font-bold gradient-text">{s.val}</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-semibold text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-3 py-1 mb-4">The Problem</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">International Payments Are Broken</h2>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
            Millions of international students struggle with slow, expensive, and opaque money transfers every semester.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Clock, color: "text-red-400", title: "3–7 Days", desc: "Average wire transfer settlement time for international payments." },
            { icon: TrendingUp, color: "text-orange-400", title: "5–10%", desc: "Hidden fees eaten by banks and SWIFT intermediaries on each transfer." },
            { icon: Globe, color: "text-yellow-400", title: "No Transparency", desc: "Funds disappear into the SWIFT network with zero real-time tracking." },
            { icon: Users, color: "text-red-300", title: "Multiple Middlemen", desc: "Correspondent banks, currency desks, and FX brokers all take a cut." },
          ].map((p) => (
            <div key={p.title} className="card card-hover">
              <p.icon className={`w-8 h-8 ${p.color} mb-4`} />
              <h3 className="font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-3 py-1 mb-4">The Solution</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Meet ScholarPay</h2>
            <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
              A real blockchain payment platform connecting students and their families through the Stellar network.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Instant Settlement", desc: "Transactions confirm in ~4 seconds on Stellar. No waiting, no anxiety.", color: "from-blue-500 to-cyan-500" },
              { icon: Shield, title: "Transparent & Verified", desc: "Every payment is verified on-chain. Real transaction hashes, real confirmation.", color: "from-violet-500 to-purple-600" },
              { icon: Globe, title: "Cross-Border Native", desc: "Send to any Stellar address worldwide. No borders, no correspondent banks.", color: "from-emerald-500 to-teal-600" },
            ].map((s) => (
              <div key={s.title} className="card card-hover glow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-[var(--color-muted)]">Three simple steps to send or receive a payment.</p>
        </div>

        <div className="space-y-4">
          {[
            { step: "01", title: "Student Creates a Payment Request", desc: "Log in, enter payment details (purpose, amount in XLM, recipient address, deadline), and share a unique payment link with your family or sponsor.", icon: FileText },
            { step: "02", title: "Sender Reviews & Signs", desc: "The sender opens the link, connects their Stellar wallet (Freighter or Albedo), reviews the exact amount, and signs the transaction — no private keys ever shared.", icon: Wallet },
            { step: "03", title: "Instant On-Chain Confirmation", desc: "ScholarPay submits the signed transaction to Stellar Testnet and independently verifies the real transaction hash. Your dashboard updates in seconds.", icon: CheckCircle },
          ].map((item) => (
            <div key={item.step} className="card card-hover flex gap-5 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-bg flex items-center justify-center font-bold text-sm text-white">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{item.desc}</p>
              </div>
              <item.icon className="w-6 h-6 text-[var(--color-muted)] flex-shrink-0 mt-1 hidden sm:block" />
            </div>
          ))}
        </div>
      </section>

      {/* Why Stellar */}
      <section id="why-stellar" className="py-20 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Stellar?</h2>
            <p className="text-[var(--color-muted)] max-w-xl mx-auto">
              Stellar was purpose-built for cross-border payments and financial inclusion.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Built for Payments", desc: "Stellar was designed from day one for fast, cheap, cross-border money movement." },
              { title: "Soroban Smart Contracts", desc: "Our contract runs on Soroban — Stellar's native, secure smart contract platform." },
              { title: "4-Second Finality", desc: "Stellar achieves transaction finality in ~4 seconds, not 10 minutes." },
              { title: "Near-Zero Fees", desc: "Transaction fees are fractions of a cent — keeping more money in students' hands." },
              { title: "Decentralized", desc: "No single point of failure. Transactions are verified by the Stellar validator network." },
              { title: "Open & Transparent", desc: "Every transaction is publicly verifiable on the Stellar blockchain explorer." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-4 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors">
                <Star className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-[var(--color-muted)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: FileText, title: "Payment Requests", desc: "Create detailed, shareable requests for tuition, rent, or living expenses." },
            { icon: Wallet, title: "Real Wallet Integration", desc: "Connect Freighter or Albedo — no private keys ever leave your device." },
            { icon: CheckCircle, title: "On-Chain Verification", desc: "Backend independently verifies every transaction on Stellar Testnet." },
            { icon: BarChart3, title: "Dashboard & History", desc: "Track all payments with full transaction history and status updates." },
            { icon: Lock, title: "Secure by Design", desc: "JWT auth, HTTPS-only, no secret keys stored, server-side verification." },
            { icon: RefreshCw, title: "Real-Time Status", desc: "Watch your payment go from SUBMITTED → CONFIRMED in real time." },
          ].map((f) => (
            <div key={f.title} className="card card-hover">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="py-20 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Security First</h2>
          <p className="text-[var(--color-muted)] mb-8">
            ScholarPay never stores private keys, never asks for secret keys, and independently verifies every transaction server-side.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              "No private keys stored",
              "Server-side tx verification",
              "JWT + HttpOnly cookies",
              "Double-spend protection",
              "Input validation (Zod)",
              "HTTPS enforced",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[var(--color-muted)] bg-[var(--color-surface-2)] rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Roadmap</h2>
          <p className="text-[var(--color-muted)]">Testnet MVP today. Production mainnet tomorrow.</p>
        </div>
        <div className="space-y-3">
          {[
            { phase: "Now", label: "Testnet MVP", items: ["Real Stellar testnet payments", "Soroban smart contract", "Wallet integration", "Dashboard"], done: true },
            { phase: "Q3", label: "Beta", items: ["Mainnet launch", "USDC support", "Email notifications", "Mobile app"], done: false },
            { phase: "Q4", label: "Growth", items: ["University partnerships", "Multi-currency", "Bulk payments", "Analytics"], done: false },
          ].map((r) => (
            <div key={r.phase} className={`card flex gap-5 items-start ${r.done ? 'border-blue-500/30' : ''}`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${r.done ? 'gradient-bg text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-muted)]'}`}>
                {r.phase}
              </div>
              <div>
                <h3 className="font-semibold mb-2">{r.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {r.items.map((item) => (
                    <span key={item} className={`text-xs px-2.5 py-1 rounded-full ${r.done ? 'bg-blue-500/15 text-blue-300' : 'bg-[var(--color-surface-2)] text-[var(--color-muted)]'}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10 pointer-events-none"></div>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6 text-blue-400" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Send Your First Payment?</h2>
          <p className="text-[var(--color-muted)] mb-8">
            Create your account, connect a Stellar testnet wallet, and experience the future of student payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-base px-8 py-3 justify-center">
              Create Payment Request
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/faq" className="btn-secondary text-base px-8 py-3 justify-center">
              Learn More
            </Link>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-6">
            ⚠️ Currently on Stellar Testnet. No real money involved.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
