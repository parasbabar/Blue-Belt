# ScholarPay User Onboarding & Evidence Guide

This document provides instructions for onboarding 10+ evaluation users and collecting proof of real wallet interactions for Level 4 evaluation.

---

## Instructions for Onboarding Test Users

1. **Share App Link**: Direct users to the live application URL (or local demo).
2. **Account Registration**:
   - Have users sign up at `/register`.
   - Ask students to create a sample payment request (e.g., 50 XLM for Tuition).
3. **Wallet Connection**:
   - Ask senders to open the request link `/pay/[requestId]`.
   - Instruct senders to connect via **Albedo** (no extension needed) or **Freighter**.
4. **Fund Account via Friendbot**:
   - If senders need testnet XLM, direct them to `https://friendbot.stellar.org` and paste their public address.
5. **Execute Payment**:
   - Sender signs payment; UI submits to Stellar Testnet and confirms.
6. **Submit Feedback**:
   - On the receipt page, sender completes the 1–5 star rating and comment form.

---

## Evidence Checklist (Manual Collection by Evaluator)

- [ ] **10+ User Accounts**: View total users in `/admin`.
- [ ] **10+ On-Chain Transactions**: Verify transactions on Stellar Testnet Explorer.
- [ ] **User Feedback Summary**: Review ratings and comments in `/admin`.
- [ ] **Screenshots & Video**: Record walkthrough following `/faq` steps.
