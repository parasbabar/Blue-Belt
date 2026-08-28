import "dotenv/config";
import { Horizon } from "@stellar/stellar-sdk";
import { CONTRACT_ID, verifyTransaction } from "../src/lib/stellar";

async function runStellarOnChainTests() {
  console.log("==========================================");
  console.log("Running Live Stellar Testnet & Soroban On-Chain Verification");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Verify Contract Address Format
    assert(
      CONTRACT_ID === "CAQWR6A4JQIPR5IVPIF47KB2TJQJYFC6IDXXUZ2DRMOFFE4PDONQ7RCQ",
      `Soroban contract address matches deployed address (${CONTRACT_ID})`
    );

    // 2. Query Live Horizon Testnet RPC
    const server = new Horizon.Server("https://horizon-testnet.stellar.org");
    const ledgers = await server.ledgers().limit(1).order("desc").call();

    assert(
      ledgers.records.length > 0 && ledgers.records[0].sequence > 0,
      `Successfully queried live Stellar Testnet ledger (Latest sequence: ${ledgers.records[0]?.sequence})`
    );

    // 3. Test Invalid Transaction Verification Handling
    const invalidVerification = await verifyTransaction(
      "0000000000000000000000000000000000000000000000000000000000000000"
    );
    assert(
      !invalidVerification.valid,
      "Transaction verifier correctly rejects fake or non-existent transaction hash"
    );
  } catch (err: any) {
    console.error("Stellar test exception:", err?.message || err);
    failed++;
  }

  console.log("\n==========================================");
  console.log(`Stellar On-Chain Test Results: ${passed} passed, ${failed} failed`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runStellarOnChainTests();
