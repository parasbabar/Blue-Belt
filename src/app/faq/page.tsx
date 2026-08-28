import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  GraduationCap, Wallet, Zap, Shield, CheckCircle, ExternalLink, HelpCircle,
  FileText, ArrowRight, CornerDownRight,
} from "lucide-react";

export default function FAQPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 testnet-badge mb-3">
            <Zap className="w-3 h-3" />
            User Setup & Onboarding Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-[var(--color-muted)] text-sm max-w-xl mx-auto">
            Everything you need to know about ScholarPay, setting up a Stellar testnet wallet, and completing real payments.
          </p>
        </div>

        {/* Step-by-Step Onboarding Cards */}
        <div className="card glow mb-12 space-y-6">
          <h2 className="text-xl font-bold border-b border-[var(--color-border)] pb-3">
            🚀 Quickstart: How to Make Your First Payment
          </h2>

          <div className="space-y-4">
            {[
              {
                num: "1",
                title: "Create a ScholarPay Account",
                desc: "Sign up as a Student (to request funds) or Sender (to pay). No sensitive personal data or private keys required.",
              },
              {
                num: "2",
                title: "Set Up a Stellar Testnet Wallet",
                desc: "Install the Freighter browser extension (freighter.app) OR simply use Albedo (albedo.link), which works in a secure web popup without installing extensions.",
              },
              {
                num: "3",
                title: "Fund Your Wallet on Testnet (Free)",
                desc: "Use the official Stellar Friendbot tool (friendbot.stellar.org) to get 10,000 free Testnet XLM instantly into your wallet address.",
              },
              {
                num: "4",
                title: "Create or Open a Payment Request",
                desc: "A student creates a payment request (e.g. 500 XLM for Tuition) and shares the link. The sender opens the link and connects their wallet.",
              },
              {
                num: "5",
                title: "Review & Sign Transaction",
                desc: "Review the transaction details in your wallet popup and click 'Approve'. ScholarPay submits it to Stellar Testnet and verifies the hash instantly.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-4 items-start p-3.5 rounded-lg bg-[var(--color-surface-2)]">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {[
            {
              q: "Is this real money?",
              a: "No! ScholarPay currently runs strictly on the Stellar TESTNET. All XLM tokens are testnet funds provided for free via Stellar Friendbot. Do not attempt to send real mainnet funds.",
            },
            {
              q: "How does ScholarPay verify transactions?",
              a: "When a payment is signed and submitted, ScholarPay receives the Stellar transaction hash. Our backend independently queries the Horizon Testnet API to confirm that the transaction was successful, recipient address matches, and amount satisfies the request before marking it CONFIRMED.",
            },
            {
              q: "Where is the Soroban Smart Contract deployed?",
              a: "Our smart contract is deployed on Stellar TESTNET at address CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ. You can inspect it directly on the Stellar Laboratory or Stellar Expert Explorer.",
            },
            {
              q: "Do I need to paste my private key into ScholarPay?",
              a: "NEVER! ScholarPay will NEVER ask you for your secret seed or private key. All transaction signing happens securely inside your Freighter or Albedo wallet popup.",
            },
            {
              q: "What wallets are supported?",
              a: "Freighter (official Stellar browser extension) and Albedo (popup-based web wallet) are natively supported.",
            },
            {
              q: "Can I view my official transaction receipt?",
              a: "Yes! Once a payment is confirmed, an official receipt is generated with your transaction hash, date, sender, recipient, and direct link to the Stellar Explorer.",
            },
          ].map((item) => (
            <div key={item.q} className="card">
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                {item.q}
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
