# ScholarPay Soroban Smart Contract Documentation

## Overview

The `ScholarPayContract` is written in Rust using `soroban-sdk` version 22.0.0. It acts as an on-chain payment registry and transfer router for student transactions.

---

## Deployed Network & Address

- **Network**: Stellar TESTNET
- **Contract Address**: `CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ`
- **WASM Hash**: `0fd60d7d7ab66e2f36bc0d645af9512cb986f309b58ba8e8f7e01c180cc43208`
- **Explorer Link**: [https://lab.stellar.org/r/testnet/contract/CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ](https://lab.stellar.org/r/testnet/contract/CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ)

---

## Functions

### `pay`
```rust
pub fn pay(
    env: Env,
    sender: Address,
    recipient: Address,
    token: Address,
    amount: i128,
    payment_id: Symbol,
)
```
- Authenticates `sender` via `sender.require_auth()`.
- Verifies `payment_id` has not been processed.
- Transfers `amount` of `token` from `sender` to `recipient`.
- Stores `payment_id` in persistent storage.
- Emits event: `("scholarpay", "pay"), (payment_id, sender, recipient, amount, token)`.

### `is_paid`
```rust
pub fn is_paid(env: Env, payment_id: Symbol) -> bool
```
- Returns `true` if `payment_id` exists in contract storage.

---

## Build & Deployment Commands

```bash
# Navigate to contract directory
cd contracts/scholarpay

# Build WASM release binary
stellar contract build

# Deploy to Testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/scholarpay.wasm \
  --source scholarpay-deployer \
  --network testnet
```
