# ScholarPay — User Growth & Validation Strategy (Level 5)

> **Documentation for Onboarding 50+ Real Testnet Users & Collecting Feedback**

---

## 1. Overview & Level 5 Objective

Level 5 Blue Belt requires expanding ScholarPay's user validation from initial core testing to **50+ real testnet users** demonstrating real transaction activity, active usage, and product feedback.

ScholarPay's core architecture and database support scalable multi-user activity:
- **Registration**: `/register` API creates users with bcrypt-hashed passwords.
- **Payment Requests**: Students create payment requests in XLM linked to Stellar addresses.
- **Transactions**: Senders execute payments on Stellar Testnet via Freighter or Albedo.
- **Verification**: On-chain verification records transactions in the PostgreSQL database.

---

## 2. Google Form Feedback Collection Requirements

To collect authentic user validation and wallet activity proof, a Google Form is distributed to onboarded test users with the following required fields:

1. **Full Name** (Required) — Participant identity.
2. **Email Address** (Required) — Contact and verification.
3. **Stellar Testnet Wallet Address** (Required) — Public key (starts with `G...`) used to test payment requests/transactions.
4. **Overall Product Rating** (Required) — 1 to 5 star rating scale.
5. **Qualitative Product Feedback** (Required) — Feedback on payment speed, wallet connection experience, UI clarity, and onboarding ease.

---

## 3. Data Export & Evidence Workflow

Once responses are collected via Google Form:

1. **Export to Google Sheets / Excel**:
   - Open Google Form → Responses tab → Click **Link to Sheets** or **Download responses (.csv / .xlsx)**.
   - Save the file or copy the public view link.

2. **Link Evidence in README**:
   - Place the Google Form link under `[ADD GOOGLE FORM LINK]` in `README.md`.
   - Place the exported Sheet link under `[ADD EXCEL SHEET LINK]` in `README.md`.

3. **Verify On-Chain Activity**:
   - Copy participant Stellar wallet addresses (`G...`) from the sheet.
   - Search addresses on [Stellar Expert Testnet Explorer](https://stellar.expert/explorer/testnet) to confirm active XLM transaction history.
   - Include direct explorer transaction URLs under `[ADD STELLAR EXPLORER LINK]` in `README.md`.

---

## 4. User Onboarding Flow for 50+ Testers

To onboard 50+ real users smoothly:

```
Step 1: Direct Users to Live App (Vercel URL)
   │
Step 2: User Registers Account (/register as Student or Sender)
   │
Step 3: Student creates Payment Request (or Sender fulfills existing Request via /pay/[requestId])
   │
Step 4: Sender connects Wallet (Freighter/Albedo) & pays in Testnet XLM
   │
Step 5: View Official Receipt (/receipt/[paymentId]) & Submit In-App Rating
   │
Step 6: Complete Google Form for Submission Validation
```

---

## 5. Feedback Iteration Summary

Feedback collected from initial and ongoing user testing directly informed Level 5 product refinements:

| Category | User Feedback Received | Action Taken & Implemented Code |
|---|---|---|
| **Error Recovery** | *"My wallet had 0 XLM on testnet and payment failed without explanation."* | Added instant **Stellar Friendbot Funding Recovery** banner on [`src/app/pay/[requestId]/page.tsx`](../src/app/pay/[requestId]/page.tsx). |
| **Shareability** | *"Copying payment URL requires selecting text manually."* | Added 1-click **Copy Link** button with toast feedback on Dashboard. |
| **Smart Contract** | *"How do I know my payment is recorded by a smart contract?"* | Added visible **Soroban Contract Address** badge on the public payment page. |
| **Mobile UX** | *"Navbar menu overlapped on small phone screens."* | Optimized mobile menu responsive breakpoints and touch targets in [`src/components/Navbar.tsx`](../src/components/Navbar.tsx). |
