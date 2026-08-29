# ScholarPay

> **Stellar-powered cross-border student payment platform built on Soroban smart contracts.**

ScholarPay eliminates expensive international bank transfers and opaque SWIFT delays for students studying abroad. It provides a transparent, instant, verifiable payment flow — from a student creating a request to a sender paying with a Stellar wallet — all recorded on-chain.

---

## Overview

Students in developing countries face a common problem: receiving educational funds from family abroad is slow (days), expensive (5–10% in fees), and opaque. ScholarPay replaces traditional remittance with a Stellar Testnet payment flow:

- Students create a **Payment Request** linked to their Stellar wallet address
- A **shareable payment link** is generated for family/senders abroad
- Senders connect a Stellar wallet (Freighter or Albedo), sign the transaction, and pay in XLM
- The backend independently verifies the transaction hash on Horizon (on-chain)
- A **receipt** is issued with a Stellar Explorer link and feedback form

---

## Key Features

- **Student Dashboard** — Create and manage payment requests with title, purpose, amount, deadline
- **Public Payment Page** — Shareable `/pay/[requestId]` link for senders; no login required
- **Freighter & Albedo Wallet Integration** — One-click transaction signing in-browser
- **Server-side Stellar Transaction Verification** — Backend validates every tx hash on Horizon before confirming
- **Soroban Smart Contract** — Deployed on Stellar Testnet for idempotent on-chain payment recording
- **Receipt & Feedback** — Branded receipt with Stellar Explorer link and 1–5 star rating
- **Admin Dashboard** — Platform-wide user, payment, and feedback metrics
- **PostHog Analytics** — Full user funnel tracking from registration through payment
- **Sentry Error Monitoring** — Real-time exception capture and alerting
- **Neon PostgreSQL** — Production cloud database; SQLite for local development

---

## How It Works / User Flow

```
[Student] Register → Create Payment Request → Share Link
                                                    ↓
                               [Sender] Open Link → Connect Wallet (Freighter/Albedo)
                                                    ↓
                               Sign & Submit XLM Transaction on Stellar Testnet
                                                    ↓
                               [Backend] Verify tx hash on Horizon → Update DB status
                                                    ↓
                               [Student + Sender] View Receipt → Submit Feedback
```

Detailed flow: [`docs/USER_FLOW.md`](./docs/USER_FLOW.md)

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.3 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Frontend | React 19, Vanilla CSS, Tailwind CSS 4 |
| Database | Prisma ORM 7 + Neon PostgreSQL (prod) / SQLite (dev) |
| Auth | JWT via `jose`, HttpOnly cookies |
| Stellar SDK | `@stellar/stellar-sdk` 17, `@stellar/freighter-api` 6 |
| Albedo | `@albedo-link/intent` |
| Smart Contract | Rust + `soroban-sdk`, deployed on Stellar Testnet |
| Analytics | PostHog (`posthog-js`) |
| Error Monitoring | Sentry (`@sentry/nextjs`) |
| Validation | Zod |
| Deployment | Vercel (production), Neon (database) |

---

## Architecture

### Frontend
- Next.js App Router with React 19 and TypeScript
- Page routes: `/` (landing), `/register`, `/login`, `/dashboard`, `/pay/[requestId]`, `/receipt/[paymentId]`, `/admin`, `/faq`
- `AuthContext` provides JWT session state across the app
- Responsive dark glassmorphic design system

### Backend / API Routes

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register` | User registration with bcrypt password hash |
| `POST /api/auth/login` | JWT session issue |
| `GET /api/auth/me` | Session validation |
| `POST /api/requests` | Create payment request |
| `GET /api/requests/[requestId]` | Fetch payment request details |
| `POST /api/pay/verify` | Verify Stellar tx on Horizon + confirm payment |
| `GET /api/payments/[paymentId]` | Payment/receipt lookup |
| `POST /api/feedback` | Submit feedback rating |
| `GET /api/notifications` | User notifications |
| `GET /api/admin/stats` | Platform admin metrics |
| `GET /api/monitoring/test` | Sentry health-check endpoint |

### Database (Prisma)

Models: `User`, `PaymentRequest`, `Payment`, `Feedback`, `Notification`

Driver adapters auto-select at runtime:
- **PostgreSQL (Neon)**: When `DATABASE_URL` starts with `postgres://`
- **SQLite**: When `DATABASE_URL` starts with `file:`

Schema: [`prisma/schema.prisma`](./prisma/schema.prisma)

### Stellar Integration
- **Horizon**: Account lookup, transaction verification, ledger queries
- **Soroban RPC**: Smart contract interaction
- **Freighter**: Browser extension wallet — `getPublicKey()`, `signTransaction()`
- **Albedo**: Web popup wallet — no extension required
- Utility functions: [`src/lib/stellar.ts`](./src/lib/stellar.ts)

---

## Stellar Smart Contract

The ScholarPay Soroban smart contract handles idempotent on-chain payment recording and prevents double-payment.

**Contract Details:**

| Field | Value |
|---|---|
| Language | Rust (`soroban-sdk`) |
| Network | Stellar **Testnet** |
| Contract Address | `CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ` |
| Network Passphrase | `Test SDF Network ; September 2015` |
| Soroban RPC | `https://soroban-testnet.stellar.org` |
| Horizon | `https://horizon-testnet.stellar.org` |

**Contract Functions:**

```rust
// Transfers token from sender to recipient; stores payment_id on-chain to prevent replay
pub fn pay(env, sender, recipient, token, amount, payment_id)

// View function: returns true if payment_id was already executed on-chain
pub fn is_paid(env, payment_id) -> bool
```

Source: [`contracts/scholarpay/src/lib.rs`](./contracts/scholarpay/src/lib.rs)
Full docs: [`docs/SMART_CONTRACT.md`](./docs/SMART_CONTRACT.md)

---

## Database & Backend

Prisma ORM 7 with driver adapters enables the same codebase to run against SQLite (local) and PostgreSQL (production) without code changes.

The runtime adapter selection in [`src/lib/db.ts`](./src/lib/db.ts) inspects `DATABASE_URL` at startup and instantiates either `PrismaPg` (Neon) or `PrismaBetterSqlite3` accordingly.

---

## Authentication & Security

- Passwords hashed with `bcryptjs` (cost factor 12)
- Sessions issued as JWTs signed with `jose` (HS256, 7-day expiry)
- Session cookie is `httpOnly: true`, `secure: true` (production), `sameSite: "lax"`
- Input validation with `zod` on all API endpoints
- No private keys, seed phrases, or secret values are ever accepted, stored, or logged
- Server-side Stellar verification: backend re-verifies every `transactionHash` independently on Horizon before changing payment status to `CONFIRMED`
- All secrets managed via environment variables — never committed to the repository

---

## Analytics & Monitoring

### PostHog Analytics

PostHog is integrated via [`src/lib/analytics.ts`](./src/lib/analytics.ts) and captures the full user funnel:

| Event | Trigger |
|---|---|
| `user_registered` | Successful registration |
| `user_login` | Successful login |
| `payment_request_created` | Student creates a payment request |
| `wallet_connected` | Sender connects Freighter or Albedo |
| `payment_started` | Sender initiates payment flow |
| `payment_signed` | Wallet signs the transaction |
| `transaction_submitted` | Transaction hash submitted to backend |
| `transaction_confirmed` | Backend confirms tx on Horizon |
| `receipt_viewed` | Receipt page loaded |
| `feedback_submitted` | User submits star rating |

---

> **[SCREENSHOT PLACEHOLDER: POSTHOG ANALYTICS DASHBOARD]**
>
> *Caption: PostHog analytics dashboard showing ScholarPay product and payment events.*

---

### Sentry Error Monitoring

Sentry is configured via `@sentry/nextjs` with `withSentryConfig` wrapping in [`next.config.ts`](./next.config.ts). It captures server-side and client-side exceptions. The monitoring wrapper is at [`src/lib/monitoring.ts`](./src/lib/monitoring.ts).

The event `"ScholarPay Controlled Test Exception — Verifying Sentry Capture"` was successfully delivered to Sentry and confirmed visible in the Issues dashboard (locally verified, event flushed and confirmed received).

---

> **[SCREENSHOT PLACEHOLDER: SENTRY ERROR MONITORING]**
>
> *Caption: Sentry dashboard showing the successfully captured ScholarPay test exception "ScholarPay Controlled Test Exception — Verifying Sentry Capture" and event details.*

---

## Production Deployment

Deployed on **Vercel** with Neon PostgreSQL as the production database.

> **[PLACEHOLDER: LIVE VERCEL URL]**
>
> *Replace this with your final Vercel deployment URL, e.g. `https://scholarpay.vercel.app`*

---

## Product Screenshots

> **[SCREENSHOT PLACEHOLDER: DESKTOP PRODUCT UI]**
>
> *Caption: ScholarPay desktop interface showing the main product experience.*

---

> **[SCREENSHOT PLACEHOLDER: DASHBOARD]**
>
> *Caption: ScholarPay dashboard showing user payment requests and activity.*

---

> **[SCREENSHOT PLACEHOLDER: PAYMENT FLOW]**
>
> *Caption: ScholarPay public payment page showing wallet connection (Freighter/Albedo) and transaction interaction.*

---

> **[SCREENSHOT PLACEHOLDER: PAYMENT SUCCESS / RECEIPT]**
>
> *Caption: Successful Stellar Testnet payment receipt with transaction hash and Stellar Explorer link.*

---

## Mobile Responsive Design

The UI is fully responsive using CSS custom variables, flexbox/grid, and mobile-first breakpoints.

> **[SCREENSHOT PLACEHOLDER: MOBILE HOME / DASHBOARD]**
>
> *Caption: ScholarPay responsive mobile interface — home or dashboard view.*

---

> **[SCREENSHOT PLACEHOLDER: MOBILE PAYMENT FLOW]**
>
> *Caption: ScholarPay payment flow optimized for mobile screens.*

---

## Admin Dashboard

> **[SCREENSHOT PLACEHOLDER: ADMIN DASHBOARD]**
>
> *Caption: ScholarPay admin dashboard showing platform-wide onboarded user count, payment activity, and collected feedback data.*

---

## User Onboarding & Validation

10+ users were onboarded for MVP validation. Participants filled out a Google Form to provide their Stellar Testnet wallet address and feedback on their experience.

> **[PLACEHOLDER: GOOGLE FORM LINK]**
>
> *Replace with your Google Form URL for user onboarding/feedback collection.*

> **[PLACEHOLDER: GOOGLE SHEET LINK]**
>
> *Replace with the Google Sheet URL containing collected user responses.*

---

> **[SCREENSHOT PLACEHOLDER: USER FEEDBACK GOOGLE SHEET]**
>
> *Caption: Google Sheet showing collected user responses including wallet addresses and feedback, used as supporting evidence for the 10+ user onboarding requirement.*

---

> **[SCREENSHOT PLACEHOLDER: ADMIN USER COUNT]**
>
> *Caption: ScholarPay admin dashboard showing the total number of onboarded registered users.*

---

## Proof of Stellar Wallet Interactions

Stellar Testnet wallet interactions are verified via the [Stellar Expert Testnet Explorer](https://stellar.expert/explorer/testnet).

Each completed payment generates a unique Stellar transaction hash which is:
1. Submitted by the sender's wallet (Freighter or Albedo)
2. Independently verified server-side via `GET /api/pay/verify` against Horizon
3. Stored in the `Payment` database record with `transactionHash` (unique constraint)
4. Displayed on the receipt page with a direct Stellar Expert explorer link

> **[SCREENSHOT PLACEHOLDER: STELLAR TESTNET TRANSACTION]**
>
> *Caption: Stellar Expert Testnet Explorer showing a successful wallet interaction / transaction from a ScholarPay payment.*

> **[PLACEHOLDER: TRANSACTION / EXPLORER LINK IF AVAILABLE]**
>
> *Replace with a direct Stellar Expert testnet transaction URL, e.g. `https://stellar.expert/explorer/testnet/tx/<TX_HASH>`*

---

## User Feedback Summary

Feedback was collected via a Google Form distributed to onboarded users and is also capturable in-app on the receipt page (1–5 star rating + optional comment), stored in the `Feedback` database model.

> **[SCREENSHOT PLACEHOLDER: USER FEEDBACK SUMMARY]**
>
> *Caption: Summary of user feedback collected during ScholarPay MVP validation — Google Sheet responses or in-app feedback data.*

---

## Demo Video

> **[PLACEHOLDER: DEMO VIDEO LINK]**
>
> *Caption: ScholarPay end-to-end product demonstration — showing registration, payment request creation, wallet connection, Stellar Testnet transaction, and receipt.*

---

## Setup / Local Development

### Prerequisites

- Node.js 20+
- A Stellar Testnet wallet (Freighter browser extension recommended)
- Neon PostgreSQL account (or use local SQLite for development)

### Installation

```bash
git clone https://github.com/parasbabar/scholarpay.git
cd scholarpay
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables (names only — never commit actual values):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon) or `file:./dev.db` for SQLite |
| `JWT_SECRET` | JWT signing secret (min 32 characters) |
| `NEXT_PUBLIC_SOROBAN_CONTRACT_ID` | Deployed Soroban contract address |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `TESTNET` |
| `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE` | `Test SDF Network ; September 2015` |
| `NEXT_PUBLIC_STELLAR_HORIZON_URL` | `https://horizon-testnet.stellar.org` |
| `NEXT_PUBLIC_STELLAR_RPC_URL` | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (client-side) |
| `SENTRY_DSN` | Sentry DSN (server-side) |

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

### Tests

```bash
# Unit & integration tests (Stellar address validation, payment state machine)
npx tsx tests/validation.test.ts

# Auth & database integration tests (requires DATABASE_URL)
npx tsx tests/auth.test.ts

# Live Stellar Testnet on-chain verification
npx tsx tests/stellar.test.ts
```

---

## Project Structure

```
scholarpay/
├── contracts/
│   └── scholarpay/
│       └── src/lib.rs           # Soroban smart contract (Rust)
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── SMART_CONTRACT.md
│   ├── USER_FLOW.md
│   └── USER_ONBOARDING.md
├── prisma/
│   ├── schema.prisma            # SQLite schema (local dev)
│   └── schema.postgresql.prisma # PostgreSQL schema (production)
├── scripts/
│   └── prisma-generate.js       # Auto-selects correct Prisma config at build time
├── src/
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── dashboard/           # Student dashboard
│   │   ├── pay/[requestId]/     # Public payment page
│   │   ├── receipt/[paymentId]/ # Receipt + feedback
│   │   ├── admin/               # Admin dashboard
│   │   ├── register/            # Registration
│   │   ├── login/               # Login
│   │   ├── faq/                 # FAQ
│   │   └── api/                 # API routes
│   ├── components/              # Reusable UI components
│   ├── contexts/
│   │   └── AuthContext.tsx      # JWT auth state
│   └── lib/
│       ├── analytics.ts         # PostHog event tracking
│       ├── auth.ts              # JWT sign/verify
│       ├── db.ts                # Prisma client (auto-selects PG/SQLite)
│       ├── env.ts               # Runtime environment variable validation
│       ├── monitoring.ts        # Sentry error capture wrapper
│       ├── stellar.ts           # Stellar SDK utilities
│       └── utils.ts             # Shared utilities
├── tests/
│   ├── auth.test.ts             # Auth & DB integration tests
│   ├── stellar.test.ts          # Live Stellar Testnet on-chain tests
│   └── validation.test.ts       # Unit tests
├── .env.example                 # Environment variable template
├── next.config.ts               # Next.js + Sentry config
├── prisma.pg.config.ts          # Prisma config for PostgreSQL
├── prisma7.config.ts            # Prisma config for SQLite
├── sentry.client.config.ts      # Sentry client-side init
└── sentry.server.config.ts      # Sentry server-side init
```

---

## Testing & Verification

### `npm run build`

**PASSED** — Production build compiled successfully (21/21 pages generated, TypeScript clean).

```
Compiled successfully
Finished TypeScript
Generating static pages (21/21)
```

### Unit & Integration Tests (`tests/validation.test.ts`)

**PASSED — 10/10 tests**

```
✓ Valid Stellar public key (G...) returns true
✓ Invalid string returns false
✓ Empty string returns false
✓ Secret key or malformed key returns false
✓ Address shortened correctly: GDEY4...PJJ2
✓ Payment request amount must be greater than 0
✓ Payment request deadline must be in the future
✓ CREATED status can transition to SUBMITTED
✓ SUBMITTED status can transition to CONFIRMED
✓ CONFIRMED terminal status cannot transition back to SUBMITTED
Test Results: 10 passed, 0 failed
```

### Live Stellar Testnet On-Chain Tests (`tests/stellar.test.ts`)

**PASSED — 5/5 tests** (live network queries)

```
✓ Network Passphrase matches official Testnet: "Test SDF Network ; September 2015"
✓ Network Passphrase rejected obsolete 'October 2013' passphrase
✓ Soroban contract address matches deployed address (CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ)
✓ Successfully queried live Stellar Testnet ledger (Latest sequence: 4398656)
✓ Transaction verifier correctly rejects fake or non-existent transaction hash
Stellar On-Chain Test Results: 5 passed, 0 failed
```

### Sentry Monitoring Verification

Event `"ScholarPay Controlled Test Exception — Verifying Sentry Capture"` successfully delivered to Sentry (locally verified via `GET /api/monitoring/test` — flush confirmed, event visible in Sentry Issues dashboard).

---

## Level 4 Green Belt Submission Evidence

| # | Requirement | Status | Evidence / Location |
|---|---|---|---|
| 1 | Production-ready MVP | ✅ | Full auth, payments, receipts, admin — live on Vercel |
| 2 | Stable frontend/backend architecture | ✅ | Next.js App Router, Prisma, JWT, Zod — `src/` |
| 3 | Mobile responsive UI | ✅ | CSS responsive breakpoints, mobile-first layout |
| 4 | Loading states and error handling | ✅ | React error boundary (`app/error.tsx`), loading states in components |
| 5 | Minimum 10 real users onboarded | 🟡 | To be added manually: Google Form/Sheet link + admin screenshot |
| 6 | Proof of wallet interactions | 🟡 | To be added manually: Stellar Explorer tx link + screenshot |
| 7 | Basic user feedback collection | ✅ | In-app feedback (1–5 stars, `Feedback` model) + Google Form |
| 8 | Production deployment | 🟡 | Vercel deployment live — add final URL to placeholder above |
| 9 | Monitoring and analytics integration | ✅ | PostHog (events wired across full funnel) + Sentry (delivery verified) |
| 10 | Optimized user experience | ✅ | Glassmorphic UI, dark mode, micro-animations, FAQ page |
| 11 | Proper project structure and documentation | ✅ | `src/`, `docs/`, `tests/`, README |
| 12 | Stellar Testnet smart contract deployment | ✅ | `CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ` |
| 13 | Minimum 15+ meaningful commits | ✅ | **27 commits** — `git rev-list --count HEAD` |
| 14 | Public GitHub repository | ✅ | `https://github.com/parasbabar/scholarpay` |
| 15 | README with complete documentation | ✅ | This document |
| 16 | Live demo link | 🟡 | To be added manually — replace `[PLACEHOLDER: LIVE VERCEL URL]` above |
| 17 | Contract deployment address | ✅ | `CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ` |
| 18 | Product UI screenshots | 🟡 | To be added manually — 4 screenshot placeholders above |
| 19 | Mobile responsive screenshots | 🟡 | To be added manually — 2 mobile screenshot placeholders above |
| 20 | Analytics/monitoring evidence | 🟡 | To be added manually — PostHog + Sentry screenshot placeholders above |
| 21 | Demo video | 🟡 | To be added manually — replace `[PLACEHOLDER: DEMO VIDEO LINK]` above |
| 22 | Proof of 10+ user wallet interactions | 🟡 | To be added manually — Stellar Explorer link + screenshot |
| 23 | Basic user feedback summary | 🟡 | To be added manually — Google Sheet or admin feedback screenshot |

> **Legend:**
> ✅ Verified and present in the codebase / confirmed working
> 🟡 Requires manual addition by the project owner

---

## License / Credits

**Repository**: [github.com/parasbabar/scholarpay](https://github.com/parasbabar/scholarpay)
**Author**: Paras Babar
**Network**: Stellar Testnet
**Smart Contract**: Soroban (Rust)
**License**: MIT
