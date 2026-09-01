#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Symbol};

#[contracttype]
pub enum DataKey {
    Payment(Symbol),
}

#[contract]
pub struct ScholarPayContract;

#[contractimpl]
impl ScholarPayContract {
    /// Executes a student payment request.
    /// Transfers `amount` of `token` from `sender` to `recipient`.
    /// Uses `payment_id` as a unique idempotency key stored on-chain.
    pub fn pay(
        env: Env,
        sender: Address,
        recipient: Address,
        token: Address,
        amount: i128,
        payment_id: Symbol,
    ) {
        // Authenticate the sender
        sender.require_auth();

        // Check for duplicate payment on-chain
        let key = DataKey::Payment(payment_id.clone());
        if env.storage().persistent().has(&key) {
            panic!("Payment already completed");
        }

        // Validate amount
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Perform token transfer
        let client = token::Client::new(&env, &token);
        client.transfer(&sender, &recipient, &amount);

        // Record payment to prevent replay
        env.storage().persistent().set(&key, &true);

        // Emit verifiable on-chain event
        env.events().publish(
            (Symbol::new(&env, "scholarpay"), Symbol::new(&env, "pay")),
            (
                payment_id,
                sender.clone(),
                recipient.clone(),
                amount,
                token.clone(),
            ),
        );
    }

    /// View function: returns true if payment_id has been executed on-chain.
    pub fn is_paid(env: Env, payment_id: Symbol) -> bool {
        let key = DataKey::Payment(payment_id);
        env.storage().persistent().has(&key)
    }
}
