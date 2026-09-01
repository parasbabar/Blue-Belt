// Tests compiled only when running: cargo test --features testutils

use super::{ScholarPayContract, ScholarPayContractClient};
use soroban_sdk::{testutils::Address as _, token, Address, Env, Symbol};

#[test]
fn test_payment_flow() {
    let env = Env::default();
    env.mock_all_auths();

    // Register ScholarPay contract
    let contract_id = env.register(ScholarPayContract, ());
    let client = ScholarPayContractClient::new(&env, &contract_id);

    // Create test accounts
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);

    // Create a mock Stellar asset contract (wrapped native token)
    let token_admin = Address::generate(&env);
    let token_contract_id = env.register_stellar_asset_contract_v2(token_admin.clone());
    let sac_client = token::StellarAssetClient::new(&env, &token_contract_id.address());
    let token_client = token::Client::new(&env, &token_contract_id.address());

    // Mint 1000 tokens to sender
    sac_client.mint(&sender, &1000);
    assert_eq!(token_client.balance(&sender), 1000);
    assert_eq!(token_client.balance(&recipient), 0);

    let payment_id = Symbol::new(&env, "pay_abc123");

    // Confirm not yet paid
    assert!(!client.is_paid(&payment_id));

    // Execute payment
    client.pay(
        &sender,
        &recipient,
        &token_contract_id.address(),
        &300,
        &payment_id,
    );

    // Verify balances updated
    assert_eq!(token_client.balance(&sender), 700);
    assert_eq!(token_client.balance(&recipient), 300);

    // Confirm marked as paid
    assert!(client.is_paid(&payment_id));
}

#[test]
fn test_double_payment_rejected() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(ScholarPayContract, ());
    let client = ScholarPayContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_contract_id = env.register_stellar_asset_contract_v2(token_admin);
    let sac_client = token::StellarAssetClient::new(&env, &token_contract_id.address());

    sac_client.mint(&sender, &1000);

    let payment_id = Symbol::new(&env, "pay_dup");

    // First payment succeeds
    client.pay(
        &sender,
        &recipient,
        &token_contract_id.address(),
        &100,
        &payment_id,
    );

    // Second payment with same ID must fail
    let result = client.try_pay(
        &sender,
        &recipient,
        &token_contract_id.address(),
        &100,
        &payment_id,
    );
    assert!(result.is_err());
}
