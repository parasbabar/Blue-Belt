# ScholarPay 🎓⚡

> **Cross-Border Student Payment Platform Powered by Stellar Blockchain & Soroban Smart Contracts.**

ScholarPay simplifies international education payments (tuition, accommodation, rent, and living expenses) by providing a fast, transparent, low-cost cross-border settlement layer directly on the **Stellar Testnet**.

---

## 📌 Submission Summary & Evaluation Links

- **Live Demo (Vercel)**: [ADD LIVE VERCEL LINK]
- **GitHub Repository**: [https://github.com/parasbabar/scholarpay](https://github.com/parasbabar/scholarpay)
- **Demo Video**: [ADD DEMO VIDEO LINK]
- **Google Feedback Form**: [ADD GOOGLE FORM LINK]
- **Google Sheet Feedback Responses**: [ADD GOOGLE SHEET LINK]
- **Soroban Smart Contract (Testnet)**: [`CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ`](https://lab.stellar.org/r/testnet/contract/CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ)
- **Target Network**: Stellar TESTNET
- **Level**: Level 4 — Green Belt Submission

---

## 🎯 Problem Statement

International students studying abroad face significant hurdles when transferring money for tuition, accommodation, and living expenses:

1. **High Banking Fees**: Traditional wire transfers and payment gateways charge 3%–7% in FX markups and intermediary bank fees.
2. **Slow Settlement Times**: Transfers can take 3 to 7 business days, risking missed payment deadlines.
3. **Lack of Transparency**: Neither students nor universities/sponsors have real-time status tracking for cross-border wire transfers.
4. **Complex Onboarding**: Traditional payment portals require extensive paperwork, physical branch visits, and complex bank routing numbers.

---

## 💡 The ScholarPay Solution

ScholarPay leverages the high speed (3–5 second finality) and near-zero transaction fees of the **Stellar Network** and **Soroban Smart Contracts** to solve cross-border educational payments:

- **Instant 5-Second Settlement**: Transactions finalize directly on-chain.
- **Micro-Fractional Fees**: Transaction costs under $0.0001 per payment.
- **Direct Wallet Integration**: Non-custodial payment flow using **Freighter** and **Albedo** Stellar wallets.
- **Independent On-Chain Verification**: Backend server verifies transaction hashes directly against Stellar Horizon RPC endpoints before confirming requests.
- **Transparent Receipts**: Printable, verifiable digital receipts linked to Stellar Expert blockchain explorer.

---

## ✨ Key Features

- 🎓 **Student Request Creation**: Create structured payment requests with title, purpose (Tuition, Rent, Living, etc.), amount, asset (XLM/USDC), recipient address, and deadline.
- 💳 **Non-Custodial Wallet Signing**: Instant payment execution using Freighter browser extension or Albedo web popup.
- ⚡ **Soroban Smart Contract Execution**: Smart contract invocation on Stellar Testnet emitting on-chain payment events.
- 🔍 **Server-Side On-Chain Verification**: Independent background verification against Horizon RPC to ensure recipient address, amount, and hash validity before confirmation.
- 📊 **Admin Dashboard**: Live metrics monitoring user signups, payment request volumes, total volume settled, confirmed vs. failed states, and user feedback.
- 💬 **Feedback Mechanism**: Integrated 5-star rating and comment submission on transaction completion.
- 🔔 **Notification Engine**: System notifications for payment request state changes (CREATED, SUBMITTED, CONFIRMED, FAILED, EXPIRED).
- 📱 **Mobile Responsive Design**: Clean dark-mode fintech interface tailored for mobile, tablet, and desktop viewports.

---

## 🔄 How ScholarPay Works

```
┌──────────────────────┐         ┌──────────────────────┐         ┌──────────────────────┐
│   1. Student Request │ ─────>  │  2. Share Link       │ ─────>  │   3. Wallet Pay      │
│  Student creates     │         │  Unique payment URL  │         │  Sponsor signs via   │
│  payment request     │         │  generated & shared │         │  Freighter / Albedo  │
└──────────────────────┘         └──────────────────────┘         └──────────────────────┘
                                                                             │
                                                                             ▼
┌──────────────────────┐         ┌──────────────────────┐         ┌──────────────────────┐
│  6. Verified Receipt │ <─────  │  5. DB Persistence   │ <─────  │ 4. Stellar Horizon   │
│  Receipt generated   │         │  Status updated to   │         │  Server verifies     │
│  with Explorer link  │         │  CONFIRMED in DB     │         │  hash on-chain RPC   │
└──────────────────────┘         └──────────────────────┘         └──────────────────────┘
```

1. **Create Request**: International student logs into ScholarPay and submits a payment request specifying the amount, purpose, and recipient Stellar wallet address.
2. **Share Link**: Student receives a public, shareable link (`/pay/[requestId]`).
3. **Execute Payment**: Sponsor/Sender opens the link, connects their Stellar wallet (Freighter or Albedo), reviews request details, and signs the on-chain transaction.
4. **Independent On-Chain Verification**: ScholarPay backend intercepts the transaction hash, queries the Stellar Horizon RPC endpoint, and verifies that the transaction was successfully committed on-chain, sent to the exact recipient, and matched the requested amount.
5. **Confirmation & Receipt**: Once verified, the database updates the status to `CONFIRMED`, sends a notification to the student, and generates an official printable receipt page (`/receipt/[paymentId]`).

---

## 🏗️ Architecture & Technology Stack

### System Architecture

ScholarPay follows a modern full-stack web application architecture:

- **Frontend Application**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons.
- **Backend API Layer**: Next.js Server Actions & API Routes with Zod input validation and JWT (`jose`) session authentication.
- **Database Layer**: Dual-database architecture using Prisma ORM 7 with `@prisma/adapter-pg` for production (Neon PostgreSQL) and `@prisma/adapter-better-sqlite3` for local development.
- **Blockchain Layer**: Stellar JavaScript SDK (`@stellar/stellar-sdk`), Soroban RPC, and Horizon Testnet REST API.
- **Smart Contract**: Written in Rust using `soroban-sdk` 22.0.0, compiled to WASM, and deployed to Stellar Testnet.

```
 scholarpay/
 ├── contracts/              # Soroban Smart Contract (Rust)
 │   └── scholarpay/
 │       └── src/lib.rs      # Soroban contract entrypoint & token transfer
 ├── prisma/                 # Database Schemas & Migrations
 │   ├── schema.prisma       # SQLite schema (Local development)
 │   └── schema.postgresql.prisma # PostgreSQL schema (Production Neon)
 ├── src/
 │   ├── app/                # Next.js App Router (Pages & API Routes)
 │   │   ├── admin/          # Admin Dashboard Panel
 │   │   ├── api/            # REST API Endpoints (Auth, Requests, Payments, Admin, Feedback)
 │   │   ├── dashboard/      # Student & Sender User Dashboard
 │   │   ├── pay/[requestId]/# Public Payment Request Page
 │   │   └── receipt/[paymentId]/ # Official Payment Receipt Page
 │   └── lib/                # Core Utility Modules
 │       ├── analytics.ts    # PostHog Analytics Integration
 │       ├── auth.ts         # JWT Session Management
 │       ├── db.ts           # Prisma Client with Dual Driver Adapters
 │       ├── env.ts          # Centralized Environment Validation
 │       ├── monitoring.ts   # Sentry Error Monitoring & Logging
 │       └── stellar.ts      # Stellar SDK & Horizon RPC Verification
 └── docs/                   # System Documentation
     ├── ARCHITECTURE.md     # System Architecture Spec
     ├── DEPLOYMENT.md       # Production Deployment Guide
     ├── SMART_CONTRACT.md   # Soroban Contract Spec
     ├── USER_FLOW.md        # Complete User Journey
     └── USER_ONBOARDING.md  # 10+ Real User Onboarding Guide
```

---

## 📜 Smart Contract & Deployment Information

ScholarPay utilizes a custom Soroban smart contract deployed on the Stellar Testnet.

- **Target Network**: Stellar TESTNET
- **Network Passphrase**: `Test SDF Network ; September 2015`
- **Horizon Endpoint**: `https://horizon-testnet.stellar.org`
- **Soroban RPC**: `https://soroban-testnet.stellar.org`
- **Contract ID**: `CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ`
- **WASM Hash**: `0fd60d7d7ab66e2f36bc0d645af9512cb986f309b58ba8e8f7e01c180cc43208`
- **Explorer Link**: [Stellar Lab Contract Explorer](https://lab.stellar.org/r/testnet/contract/CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ)

### Contract Features
1. `pay`: Executes token transfers between sender and recipient, records on-chain state, and emits structured payment events.
2. `get_payment_status`: Reads on-chain payment status and idempotency state.

---

## 🗄️ Database & Schema

ScholarPay uses Prisma ORM 7 with a 5-table relational schema:

1. **User**: Authentication, roles (`STUDENT`, `SENDER`), profile, optional wallet address.
2. **PaymentRequest**: Student-created requests (`title`, `purpose`, `amount`, `asset`, `recipientAddress`, `deadline`, `status`).
3. **Payment**: Verified payment records (`paymentRequestId`, `senderWallet`, `amount`, `transactionHash`, `status`).
4. **Feedback**: Platform ratings (`rating` 1–5, `comment`, `paymentId`).
5. **Notification**: In-app notifications for request state changes.

---

## 📊 Analytics & Error Monitoring

- **Analytics (PostHog)**: Configured in `src/lib/analytics.ts`. Tracks product telemetry events including `user_registered`, `user_logged_in`, `payment_request_created`, `wallet_connected`, `payment_submitted`, `payment_verified`, and `feedback_submitted`.
- **Monitoring (Sentry)**: Configured via `@sentry/nextjs` in `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`. Includes a dedicated backend test endpoint at `/api/monitoring/test`.

---

## 👥 User Validation & Onboarding Evidence

Per Level 4 evaluation guidelines, ScholarPay includes infrastructure for user validation and onboarding:

- **Admin Dashboard**: Accessible at `/admin` (displays registered users, total requests, confirmed vs. failed payments, average user rating, and recent user feedback).
- **User Onboarding Guide**: Comprehensive step-by-step instructions in `docs/USER_ONBOARDING.md`.
- **Google Feedback Form & Sheet**: [ADD GOOGLE FORM LINK] / [ADD GOOGLE SHEET LINK]

### User Interaction Summary
- **Registered User Accounts**: Verified in Admin Dashboard (`/admin`).
- **Real On-Chain Wallet Transactions**: Verified on Stellar Testnet via Horizon API.

---

## 📸 Product Screenshots

### Desktop View
![ScholarPay Desktop Interface]([ADD PRODUCT SCREENSHOT])

### Mobile Responsive View
![ScholarPay Mobile Interface]([ADD MOBILE SCREENSHOT])

### Analytics & Monitoring
![PostHog Analytics Dashboard]([ADD ANALYTICS SCREENSHOT])
![Sentry Error Monitoring]([ADD MONITORING SCREENSHOT])

---

## 🧪 Testing & Verification

ScholarPay includes automated unit, integration, and database smoke test suites:

### 1. Database Smoke Test (Neon PostgreSQL)
```bash
node scripts/neon-smoke-test.mjs
```
*Result*: 13/13 PASS (Table verification, User registration, Auth lookup, PaymentRequest creation, Payment persistence, Feedback & Notification creation, Cleanup).

### 2. Next.js Production Build Verification
```bash
npm run build
```
*Result*: Exit Code 0 (22 static & dynamic routes compiled, 0 TypeScript errors).

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js v18+
- Git

### 2. Installation
```bash
git clone https://github.com/parasbabar/scholarpay.git
cd pay
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STELLAR_NETWORK="TESTNET"
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_STELLAR_HORIZON_URL="https://horizon-testnet.stellar.org"
NEXT_PUBLIC_STELLAR_RPC_URL="https://soroban-testnet.stellar.org"
NEXT_PUBLIC_SOROBAN_CONTRACT_ID="CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ"
DATABASE_URL="file:./dev.db"
JWT_SECRET="scholarpay-dev-secret-change-in-production-min-32-chars"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Production Deployment (Vercel + Neon)

1. Push repository to GitHub.
2. Import project into **Vercel**.
3. Set environment variables on Vercel:
   - `DATABASE_URL`: Hosted Neon PostgreSQL connection string (`postgresql://...`)
   - `JWT_SECRET`: Random 32+ character string
   - `NEXT_PUBLIC_SOROBAN_CONTRACT_ID`: `CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ`
   - `NEXT_PUBLIC_POSTHOG_KEY`: (Optional) PostHog Project API key
   - `NEXT_PUBLIC_SENTRY_DSN`: (Optional) Sentry DSN key
4. Deploy! Vercel automatically runs `postinstall` to generate the matching PostgreSQL Prisma Client and compiles Next.js production routes.

---

## 🔮 Future Improvements

1. **Multi-Asset Soroban Pools**: Expand beyond XLM to native USDC and university-specific stablecoins on Stellar mainnet.
2. **Automated Fiat On/Off-Ramps**: Direct integration with MoneyGram Access and Stellar Anchor APIs for seamless local fiat deposits and cash pick-up.
3. **University Verification Portal**: Direct institution API access for automatic tuition invoice validation and instant clearance.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
