import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyTransaction } from "@/lib/stellar";
import { z } from "zod";

const verifySchema = z.object({
  transactionHash: z.string().length(64).regex(/^[a-fA-F0-9]+$/),
  paymentRequestId: z.string().uuid(),
  senderWallet: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = verifySchema.parse(body);

    // Load payment request from database
    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { id: data.paymentRequestId },
    });

    if (!paymentRequest) {
      return NextResponse.json({ error: "Payment request not found." }, { status: 404 });
    }

    if (paymentRequest.status === "CONFIRMED") {
      return NextResponse.json({ error: "This payment request has already been completed." }, { status: 409 });
    }

    if (paymentRequest.status === "EXPIRED" || paymentRequest.status === "CANCELLED") {
      return NextResponse.json({ error: `Payment request is ${paymentRequest.status.toLowerCase()}.` }, { status: 400 });
    }

    // Check if deadline has passed
    if (new Date() > paymentRequest.deadline) {
      await prisma.paymentRequest.update({
        where: { id: data.paymentRequestId },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "Payment request has expired." }, { status: 400 });
    }

    // Check for duplicate transaction hash submission
    const existingPayment = await prisma.payment.findUnique({
      where: { transactionHash: data.transactionHash },
    });

    if (existingPayment) {
      return NextResponse.json({ error: "This transaction has already been recorded." }, { status: 409 });
    }

    // Update to SUBMITTED while we verify on-chain
    await prisma.paymentRequest.update({
      where: { id: data.paymentRequestId },
      data: { status: "SUBMITTED" },
    });

    // Independently verify the transaction on Stellar Testnet
    const verification = await verifyTransaction(data.transactionHash);

    if (!verification.valid) {
      // Revert status on verification failure
      await prisma.paymentRequest.update({
        where: { id: data.paymentRequestId },
        data: { status: "PENDING" },
      });
      return NextResponse.json(
        { error: verification.error || "Transaction verification failed." },
        { status: 422 }
      );
    }

    // Verify the transaction goes to the correct recipient
    const recipientMatches =
      verification.recipient?.toLowerCase() === paymentRequest.recipientAddress.toLowerCase();

    if (!recipientMatches) {
      await prisma.paymentRequest.update({
        where: { id: data.paymentRequestId },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: "Transaction recipient does not match the payment request." },
        { status: 422 }
      );
    }

    // Verify amount is at least what was requested (allow minor precision differences)
    const requestedAmount = parseFloat(paymentRequest.amount.toString());
    const paidAmount = parseFloat(verification.amount || "0");
    const tolerance = 0.0001;

    if (paidAmount < requestedAmount - tolerance) {
      await prisma.paymentRequest.update({
        where: { id: data.paymentRequestId },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: `Transaction amount (${paidAmount} XLM) is less than requested (${requestedAmount} XLM).` },
        { status: 422 }
      );
    }

    // All checks passed — record payment and mark as CONFIRMED using a transaction
    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          paymentRequestId: data.paymentRequestId,
          senderWallet: verification.sender || data.senderWallet,
          amount: paidAmount,
          transactionHash: data.transactionHash,
          status: "CONFIRMED",
        },
      }),
      prisma.paymentRequest.update({
        where: { id: data.paymentRequestId },
        data: { status: "CONFIRMED" },
      }),
    ]);

    // Create notification for the student
    await prisma.notification.create({
      data: {
        userId: paymentRequest.studentId,
        title: "Payment Confirmed! 🎉",
        message: `Your payment request "${paymentRequest.title}" for ${requestedAmount} ${paymentRequest.asset} has been confirmed. Transaction: ${data.transactionHash.slice(0, 8)}...`,
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        transactionHash: data.transactionHash,
        amount: paidAmount,
        sender: verification.sender,
        recipient: verification.recipient,
        asset: verification.asset,
      },
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message || "Invalid input." }, { status: 400 });
    }
    console.error("[verify-payment]", err);
    return NextResponse.json({ error: "Payment verification failed. Please try again." }, { status: 500 });
  }
}
