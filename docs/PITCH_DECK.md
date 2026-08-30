# ScholarPay — Level 5 Pitch Deck

> **Stellar-Powered Cross-Border Educational Remittance Platform**

---

## Slide 1: Title Slide
# ScholarPay
### Instant, Low-Cost, Verifiable Educational Payments via Stellar & Soroban
- **Presenter**: ScholarPay Core Team
- **Blockchain**: Stellar Network (Testnet)
- **Smart Contract Engine**: Soroban (Rust)
- **Level 5 Submission**: Blue Belt

---

## Slide 2: The Problem
# The International Student Payment Crisis
- **5.6M+ Students**: International students studying abroad worldwide.
- **SWIFT Friction**: Legacy international wire transfers take 3–7 business days to clear.
- **Exorbitant Fees**: Bank wire fees and opaque FX markups consume 5%–10% of total transfer value.
- **Opaque Tracking**: Neither students nor universities can track pending tuition payments in real-time.
- **Blocked Admissions & Deadlines**: Delayed payments lead to missed registration deadlines and tuition penalties.

---

## Slide 3: Current Payment Friction
# High Cost, High Delay, Zero Visibility

| Friction Point | Legacy Banking (SWIFT) | ScholarPay (Stellar) |
|---|---|---|
| **Settlement Speed** | 3 to 7 Business Days | **< 5 Seconds** |
| **Transaction Fees** | $25 – $50 + 5-10% FX spread | **Sub-Cent (< $0.0001)** |
| **Payment Status** | Opaque / Untracked | **Real-Time On-Chain Receipts** |
| **Smart Contract** | None (Manual Clearing) | **Soroban Idempotent Security** |
| **Accessibility** | Requires Bank Accounts | **Web3 Wallet (Freighter/Albedo)** |

---

## Slide 4: The Solution
# ScholarPay: Frictionless Educational Remittance

ScholarPay connects international students with sponsors, donors, and family members abroad through instant, verifiable crypto payment requests.

- **Student-Led Requests**: Students generate payment requests (`/pay/[requestId]`) with amount, category, and recipient wallet.
- **One-Click Payer Experience**: Senders open the public link and pay directly via Freighter or Albedo wallets.
- **Server & On-Chain Double Verification**: Backend verifies transaction hashes on Horizon RPC and updates status to `CONFIRMED`.
- **Verifiable Digital Receipts**: Instant receipt generation linked to Stellar Expert Testnet Explorer.

---

## Slide 5: Why Stellar & Soroban?
# The Ultimate Financial Inclusion Blockchain

- **Built for Payments**: Stellar was architected specifically for global asset transfers and cross-border settlement.
- **Sub-Second Finality**: Stellar Consensus Protocol (SCP) settles transactions in 3–5 seconds.
- **Ultra-Low Cost**: Millions of transactions per dollar in network fees.
- **Soroban Smart Contracts**: Rust-based WebAssembly contracts provide programmable logic with safety guarantees.
- **Idempotency Guarantee**: ScholarPay's Soroban contract (`CAQWR6...`) logs `payment_id` on-chain to prevent double-spending or replay attacks.

---

## Slide 6: Product Walkthrough
# End-to-End User Experience

```
1. Student Onboarding    ──> 2. Create Payment Request ──> 3. Share Public Link
   (/register & /login)         (Tuition, Rent, Expenses)        (/pay/[requestId])
                                                                        │
                                                                        ▼
6. Digital Receipt       <── 5. Verification Endpoint <── 4. Wallet Signing & Pay
   (/receipt/[paymentId])       (Horizon RPC Check)              (Freighter / Albedo)
```

- **Landing Page**: Feature highlights, why Stellar, live FAQ, and CTA.
- **Dashboard**: Request counter, total volume, pending vs confirmed breakdown.
- **Public Payment Page**: Clean payment overview, wallet connect modal, and live Friendbot testnet wallet funding recovery.
- **Receipt & Feedback**: Printable receipt with explorer link and 1–5 star rating capture.

---

## Slide 7: Technical Architecture
# Enterprise-Grade Modern Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4.
- **Database Layer**: Prisma ORM 7 with dynamic runtime adapters (Neon PostgreSQL in Prod, SQLite in Dev).
- **Authentication**: JWT (`jose`) in `HttpOnly` `SameSite=Lax` cookies, `bcryptjs` password hashing.
- **Blockchain**: `@stellar/stellar-sdk` v17, Horizon RPC, Soroban RPC, Freighter API, Albedo Intent.
- **Analytics & Telemetry**: PostHog event engine for conversion funnel tracking; Sentry for real-time error tracing.

---

## Slide 8: Market Opportunity
# $50B+ Global Cross-Border Education Market

- **Total Addressable Market (TAM)**: $50 Billion+ annual international tuition and student living transfers.
- **Serviceable Addressable Market (SAM)**: $12 Billion+ in cross-border student payments from emerging markets (Africa, LATAM, South Asia) to North America & Europe.
- **Serviceable Obtainable Market (SOM)**: $150 Million+ target volume within initial university partner ecosystems on Stellar.

---

## Slide 9: Target Users
# Who ScholarPay Serves

1. **International Students**:
   - Need reliable, fast funds for tuition, rent, and living expenses.
   - Require proof of payment for university bursars.
2. **Sponsors & Family Members**:
   - Want zero hidden fees, instant delivery, and transparent status updates.
3. **Educational Institutions & Bursars**:
   - Want verifiable, automated payment reconciliation via on-chain transaction hashes.

---

## Slide 10: User Growth & Level 5 Validation
# Validated by 50+ Real Testnet Users

- **Level 4 Foundation**: Validated core payment flow, smart contract deployment, and basic telemetry.
- **Level 5 Expansion**: Scaled user validation to **50+ active testnet users**.
- **Real Feedback Collection**: Distributed Google Form collecting names, emails, testnet wallet addresses, ratings, and qualitative product feedback.
- **Data Export & Transparency**: Feedback responses exported to Google Sheets / Excel for open validation.

---

## Slide 11: Feedback-Driven Product Refinements
# Iterating Based on Real User Feedback

| User Feedback | Implemented Refinement | Commit Reference |
|---|---|---|
| *"What if my wallet isn't funded on testnet?"* | Added instant **Stellar Friendbot Funding Recovery** banner right inside payment error box. | `feat: add Friendbot recovery` |
| *"I want to copy payment links easily"* | Added 1-click **Copy Payment Link** button with toast feedback on Dashboard. | `ui: polish dashboard interface` |
| *"Is the smart contract active?"* | Displayed live **Soroban Contract Address** badge on public payment page. | `feat: add contract transparency` |
| *"I need to verify my payment on-chain"* | Added direct **Stellar Expert Testnet Explorer** link on receipt page. | `ui: add receipt explorer link` |

---

## Slide 12: Product Improvements Summary
# Level 5 Blue Belt Enhancements

- **UI/UX Polish**: Glassmorphic dark fintech aesthetic, responsive mobile navigation, improved accessibility, and status badges.
- **Onboarding Simplification**: Guided onboarding CTAs, pre-filled recipient wallet address from user profile.
- **Mobile Responsiveness**: Touch-optimized modals, flex/grid layouts, no horizontal scroll leak.
- **Resilience & Error Handling**: Graceful API error boundary, sanitized context logging, Sentry error capture.

---

## Slide 13: Growth & Go-To-Market Strategy
# Scaling ScholarPay Globally

1. **Phase 1: Student Ambassador Program**: Onboard international student associations at key target universities.
2. **Phase 2: University Bursar API Integration**: Build direct webhooks into campus student portal financial software.
3. **Phase 3: Anchor Partnerships**: Partner with Stellar anchors (e.g., MoneyGram Access) to enable local cash-in/cash-out fiat offramps globally.

---

## Slide 14: Competitive Positioning
# Why ScholarPay Wins

| Feature | Legacy Banks (SWIFT) | Wise / Flywire | ScholarPay |
|---|---|---|---|
| **Speed** | 3–7 Days | 1–2 Days | **< 5 Seconds** |
| **Cost** | High ($30+) | Medium (1.5%–3%) | **Ultra-Low (< $0.0001)** |
| **On-Chain Audit** | ❌ No | ❌ No | **✅ Yes (Soroban)** |
| **Self-Custody Wallet** | ❌ No | ❌ No | **✅ Yes (Freighter/Albedo)** |
| **Permissionless** | ❌ No | ❌ No | **✅ Yes** |

---

## Slide 15: Future Roadmap
# What's Next for ScholarPay

- **Q4 2026**: Mainnet Soroban Smart Contract deployment with multi-token stablecoin support (USDC on Stellar).
- **Q1 2027**: Recurring subscription tuition payment requests (automated periodic payments).
- **Q2 2027**: Institutional University Dashboard for direct batch reconciliation and tuition receipt issuance.
- **Q3 2027**: Mobile Native iOS & Android apps via React Native + Stellar SDK.

---

## Slide 16: Closing & Call to Action
# Join the Future of Educational Payments

ScholarPay proves that cross-border remittance for education can be instant, affordable, transparent, and user-friendly.

- **GitHub Repository**: [github.com/parasbabar/scholarpay](https://github.com/parasbabar/scholarpay)
- **Deployed Contract**: `CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ`
- **Network**: Stellar Testnet

*Thank you for evaluating ScholarPay Level 5 Blue Belt Submission!*
