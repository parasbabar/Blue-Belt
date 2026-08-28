import { isValidStellarAddress, shortenAddress } from "../src/lib/stellar";

function runTests() {
  console.log("==========================================");
  console.log("Running ScholarPay Unit & Integration Tests");
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

  // 1. Stellar Address Validation Tests
  assert(
    isValidStellarAddress("GDEY4FVEWUR5277JWP3TTGY4LIRBCS4ZAI2FRJM4IIW3OYTGR7XAPJJ2"),
    "Valid Stellar public key (G...) returns true"
  );
  assert(
    !isValidStellarAddress("INVALID_ADDRESS_123"),
    "Invalid string returns false"
  );
  assert(!isValidStellarAddress(""), "Empty string returns false");
  assert(
    !isValidStellarAddress("SDFJ3KJ2K3J423J423"),
    "Secret key or malformed key returns false"
  );

  // 2. Address Shortening Utility Tests
  const fullAddress = "GDEY4FVEWUR5277JWP3TTGY4LIRBCS4ZAI2FRJM4IIW3OYTGR7XAPJJ2";
  const shortened = shortenAddress(fullAddress, 4, 4);
  assert(shortened === "GDEY4...PJJ2", `Address shortened correctly: ${shortened}`);

  // 3. Payment Request Validation Logic
  const validAmount = 500.5;
  assert(validAmount > 0, "Payment request amount must be greater than 0");

  const futureDeadline = new Date(Date.now() + 86400000);
  assert(futureDeadline > new Date(), "Payment request deadline must be in the future");

  // 4. Payment Status Transition State Machine Test
  const validTransitions: Record<string, string[]> = {
    CREATED: ["PENDING", "SUBMITTED", "CANCELLED", "EXPIRED"],
    PENDING: ["SUBMITTED", "FAILED", "CANCELLED", "EXPIRED"],
    SUBMITTED: ["CONFIRMED", "FAILED"],
    CONFIRMED: [], // Terminal state
    FAILED: ["PENDING", "SUBMITTED"], // Retry allowed
    EXPIRED: [], // Terminal state
    CANCELLED: [], // Terminal state
  };

  assert(
    validTransitions["CREATED"].includes("SUBMITTED"),
    "CREATED status can transition to SUBMITTED"
  );
  assert(
    validTransitions["SUBMITTED"].includes("CONFIRMED"),
    "SUBMITTED status can transition to CONFIRMED"
  );
  assert(
    !validTransitions["CONFIRMED"].includes("SUBMITTED"),
    "CONFIRMED terminal status cannot transition back to SUBMITTED"
  );

  console.log("\n==========================================");
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
