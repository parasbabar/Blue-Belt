# ScholarPay Architecture Specification

## Overview

ScholarPay is a production-grade cross-border student payment platform built on the **Stellar Network** and **Soroban Smart Contracts**. It eliminates intermediary banking delays and high SWIFT fees by providing instant, transparent, and verifiable transactions.

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interfaces                          │
│   Student Dashboard  │  Public Payment Page  │  Receipt View    │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Application Layer                   │
│   App Router  │  Auth (JWT)  │  Validation  │  Stellar Client   │
└───────────────┬────────────────────────────────┬────────────────┘
                │                                │
                ▼                                ▼
┌───────────────────────────────┐  ┌──────────────────────────────┐
│       Database Layer          │  │       Stellar Network        │
│   PostgreSQL + Prisma ORM     │  │  Horizon API + Soroban RPC   │
│   Users, Requests, Payments   │  │  Smart Contract Deployment   │
└───────────────────────────────┘  └──────────────────────────────┘
```

---

## 1. Frontend Architecture

- **Framework**: Next.js (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Vanilla CSS custom variables + Tailwind CSS with glassmorphic aesthetics
- **Wallet Connection**: Natively integrates `@stellar/freighter-api` and `albedo` web popup
- **State Management**: React Context (`AuthProvider`) for persistent JWT session state

---

## 2. Backend & Security Model

- **Authentication**: JWT signed via `jose` library stored in `HttpOnly`, `SameSite=Lax` cookies.
- **Server Verification**: The backend independently queries Stellar Horizon to verify transaction hashes directly on-chain before updating request statuses to `CONFIRMED`.
- **Secret Hygiene**: Zero private keys or secret seeds are ever transmitted, accepted, or stored.
- **Input Sanitization**: Strict schema validation powered by `zod`.

---

## 3. Smart Contract Layer (Soroban)

- **Language**: Rust (`soroban-sdk`)
- **Network**: Stellar TESTNET
- **Deployed Address**: `CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ`
- **Functions**:
  - `pay(sender, recipient, token, amount, payment_id)`: Transfers token assets and records `payment_id` on-chain to enforce idempotency.
  - `is_paid(payment_id)`: Public view function to verify on-chain payment status.

---

## 4. Monitoring & Telemetry

- **Analytics**: Wrapper for PostHog event collection tracking user conversion and payment steps.
- **Error Tracking**: Integration interface for Sentry tracking uncaught exceptions and API failures.
