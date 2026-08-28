# ScholarPay Deployment Guide

## 1. Prerequisites

- Node.js v20+ & npm v10+
- PostgreSQL database (e.g. Neon, Supabase, Render, Railway)
- Stellar CLI version 25.0+

---

## 2. Environment Setup

Copy `.env.example` to `.env` and set values:

```env
DATABASE_URL="postgresql://user:password@host:5432/scholarpay?schema=public"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
JWT_SECRET="your-production-jwt-secret-min-32-chars"

NEXT_PUBLIC_SOROBAN_CONTRACT_ID="CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ"
NEXT_PUBLIC_STELLAR_NETWORK="TESTNET"
NEXT_PUBLIC_STELLAR_HORIZON_URL="https://horizon-testnet.stellar.org"
```

---

## 3. Database Migration

```bash
npx prisma generate
npx prisma db push  # or npx prisma migrate deploy
```

---

## 4. Frontend & Backend Deployment (Vercel)

1. Push repository to GitHub.
2. Connect repository on Vercel dashboard.
3. Configure Environment Variables matching `.env`.
4. Deploy!

---

## 5. Soroban Smart Contract Deployment

```bash
cd contracts/scholarpay
stellar contract build
stellar contract deploy --wasm target/wasm32v1-none/release/scholarpay.wasm --source scholarpay-deployer --network testnet
```
