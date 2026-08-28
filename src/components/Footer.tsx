import Link from "next/link";
import { GraduationCap, Globe, Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="gradient-text">ScholarPay</span>
            </div>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed">
              Cross-border student payments powered by the Stellar blockchain.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-muted)] hover:text-[var(--color-text)]">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-muted)] hover:text-[var(--color-text)]">
                <Code className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link href="/#features" className="hover:text-[var(--color-text)] transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-[var(--color-text)] transition-colors">How it works</Link></li>
              <li><Link href="/#why-stellar" className="hover:text-[var(--color-text)] transition-colors">Why Stellar</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--color-text)] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><a href="https://stellar.org/developers" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">Stellar Docs</a></li>
              <li><a href="https://laboratory.stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">Stellar Lab</a></li>
              <li><a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">Testnet Explorer</a></li>
              <li><a href="https://friendbot.stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">Friendbot (Fund)</a></li>
            </ul>
          </div>

          {/* Legal/Network */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Network</h4>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                Stellar TESTNET
              </li>
              <li>Soroban Smart Contract</li>
              <li>Horizon API</li>
              <li>Freighter / Albedo Wallet</li>
            </ul>
          </div>
        </div>

        <hr className="divider mt-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--color-muted)]">
          <p>© {new Date().getFullYear()} ScholarPay. Built on Stellar Testnet.</p>
          <p className="flex items-center gap-1">
            <span className="testnet-badge">⚠ Testnet Only — Not for real money</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
