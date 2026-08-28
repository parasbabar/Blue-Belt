"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, GraduationCap, Zap } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">ScholarPay</span>
          <span className="testnet-badge ml-1 hidden sm:inline-flex">
            <Zap className="w-2.5 h-2.5" />
            TESTNET
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-[var(--color-muted)]">
          <Link href="/#how-it-works" className="hover:text-[var(--color-text)] transition-colors">How it works</Link>
          <Link href="/#features" className="hover:text-[var(--color-text)] transition-colors">Features</Link>
          <Link href="/#why-stellar" className="hover:text-[var(--color-text)] transition-colors">Why Stellar</Link>
          <Link href="/faq" className="hover:text-[var(--color-text)] transition-colors">FAQ</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
          <Link href="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass border-t border-[var(--color-border)] px-4 py-4 flex flex-col gap-3">
          <Link href="/#how-it-works" onClick={() => setOpen(false)} className="sidebar-link">How it works</Link>
          <Link href="/#features" onClick={() => setOpen(false)} className="sidebar-link">Features</Link>
          <Link href="/#why-stellar" onClick={() => setOpen(false)} className="sidebar-link">Why Stellar</Link>
          <Link href="/faq" onClick={() => setOpen(false)} className="sidebar-link">FAQ</Link>
          <hr className="divider my-1" />
          <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary justify-center">Sign In</Link>
          <Link href="/register" onClick={() => setOpen(false)} className="btn-primary justify-center">Get Started</Link>
        </div>
      )}
    </nav>
  );
}
