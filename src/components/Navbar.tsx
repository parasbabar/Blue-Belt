"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, GraduationCap, Zap, LogOut, User as UserIcon, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

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
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-[var(--color-text)] transition-colors flex items-center gap-1.5 font-medium">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                Dashboard
              </Link>
              <Link href="/admin" className="hover:text-[var(--color-text)] transition-colors flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Admin
              </Link>
              <Link href="/faq" className="hover:text-[var(--color-text)] transition-colors">FAQ</Link>
            </>
          ) : (
            <>
              <Link href="/#how-it-works" className="hover:text-[var(--color-text)] transition-colors">How it works</Link>
              <Link href="/#features" className="hover:text-[var(--color-text)] transition-colors">Features</Link>
              <Link href="/#why-stellar" className="hover:text-[var(--color-text)] transition-colors">Why Stellar</Link>
              <Link href="/faq" className="hover:text-[var(--color-text)] transition-colors">FAQ</Link>
            </>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-muted)] bg-[var(--color-surface-2)] px-3 py-1.5 rounded-lg border border-[var(--color-border)] flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-[var(--color-text)]">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="btn-secondary text-xs py-1.5 px-3 text-red-400 border-red-500/20 hover:bg-red-500/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </>
          )}
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
          {user ? (
            <>
              <div className="px-3 py-2 bg-[var(--color-surface-2)] rounded-lg text-xs flex justify-between items-center">
                <span className="font-semibold text-blue-300">{user.name}</span>
                <span className="text-[var(--color-muted)]">{user.email}</span>
              </div>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="sidebar-link">Dashboard</Link>
              <Link href="/admin" onClick={() => setOpen(false)} className="sidebar-link">Admin</Link>
              <Link href="/faq" onClick={() => setOpen(false)} className="sidebar-link">FAQ</Link>
              <hr className="divider my-1" />
              <button onClick={() => { setOpen(false); logout(); }} className="btn-secondary justify-center text-red-400">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/#how-it-works" onClick={() => setOpen(false)} className="sidebar-link">How it works</Link>
              <Link href="/#features" onClick={() => setOpen(false)} className="sidebar-link">Features</Link>
              <Link href="/#why-stellar" onClick={() => setOpen(false)} className="sidebar-link">Why Stellar</Link>
              <Link href="/faq" onClick={() => setOpen(false)} className="sidebar-link">FAQ</Link>
              <hr className="divider my-1" />
              <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary justify-center">Sign In</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="btn-primary justify-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
