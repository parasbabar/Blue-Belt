import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";
import { signToken, verifyToken } from "../src/lib/auth";

async function runAuthTests() {
  console.log("==========================================");
  console.log("Running ScholarPay Auth & Database Integration Tests");
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
    // Clean up test user if exists
    const testEmail = "teststudent@scholarpay.edu";
    await prisma.user.deleteMany({ where: { email: testEmail } });

    // 1. Create User Test
    const passwordHash = await bcrypt.hash("Password123!", 12);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
        name: "Test Student",
        role: "STUDENT",
        country: "Ghana",
      },
    });

    assert(user.id !== undefined, "User created successfully in database");
    assert(user.email === testEmail, "User email matches input");

    // 2. Duplicate Email Check Test
    const existing = await prisma.user.findUnique({ where: { email: testEmail } });
    assert(existing !== null, "Existing user accurately detected by unique index");

    // 3. Password Verification Test
    const passwordValid = await bcrypt.compare("Password123!", user.passwordHash);
    assert(passwordValid, "Password comparison succeeds with correct password");

    const passwordInvalid = await bcrypt.compare("WrongPassword", user.passwordHash);
    assert(!passwordInvalid, "Password comparison fails with incorrect password");

    // 4. JWT Session Sign & Verify Test
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    assert(token.length > 20, "JWT token generated successfully");

    const decoded = await verifyToken(token);
    assert(decoded !== null && decoded.userId === user.id, "JWT token verified and payload decoded correctly");

    // Clean up after test
    await prisma.user.delete({ where: { id: user.id } });
  } catch (err: unknown) {
    console.error("Test execution exception:", err);
    failed++;
  }

  console.log("\n==========================================");
  console.log(`Auth Test Results: ${passed} passed, ${failed} failed`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTests();
