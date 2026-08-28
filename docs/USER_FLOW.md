# ScholarPay User Flow Documentation

## 1. Student Flow

1. **Sign Up / Sign In**:
   - Register at `/register` selecting the **STUDENT** role.
   - Enter full name, email, country, and password.

2. **Create Payment Request**:
   - Navigate to `/dashboard` and click **New Payment Request**.
   - Enter title, purpose (Tuition, Rent, Accommodation, Living Expenses), amount (XLM), recipient address (`G...`), deadline, and optional notes.
   - Submit form to generate request in database with status `CREATED`.

3. **Share Request Link**:
   - Copy unique public link (`/pay/[requestId]`) and send to sponsor/sender.

4. **Track Payment**:
   - Dashboard automatically reflects real-time status transitions (`CREATED` → `SUBMITTED` → `CONFIRMED`).

---

## 2. Sender Flow

1. **Open Payment Page**:
   - Open shared URL `/pay/[requestId]`.
   - Review payment purpose, requested amount, recipient address, and deadline.

2. **Connect Wallet**:
   - Click **Connect Stellar Wallet**.
   - Choose **Freighter** (browser extension) or **Albedo** (web popup).

3. **Review & Sign**:
   - Review transaction details.
   - Click **Pay with Stellar**.
   - Wallet prompts for transaction signature on Stellar Testnet.

4. **On-Chain Settlement**:
   - Signed XDR submitted to Horizon Testnet RPC.
   - Backend independently verifies transaction success.
   - View official receipt (`/receipt/[paymentId]`) with link to Stellar Explorer.
   - Submit 1–5 star rating & feedback.

---

## 3. Failure & Edge Case Handling

- **Invalid Address**: Rejected by client & server validation.
- **Insufficient Funds**: Freighter/Horizon returns clear error; UI prompts user to use Friendbot to fund account.
- **Rejected Signature**: UI updates state to `FAILED` with retry option; no database state is corrupted.
- **Duplicate Hash Submission**: Backend checks uniqueness constraint and rejects replay attempts.
