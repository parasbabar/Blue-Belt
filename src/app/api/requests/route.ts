import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isValidStellarAddress } from "@/lib/stellar";
import { z } from "zod";

const createRequestSchema = z.object({
  title: z.string().min(3).max(200),
  purpose: z.enum(["Tuition", "Accommodation", "Rent", "Living Expenses", "Other"]),
  amount: z.number().positive().multipleOf(0.0000001),
  asset: z.string().default("XLM"),
  recipientAddress: z.string(),
  deadline: z.string().datetime(),
  description: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createRequestSchema.parse(body);

    if (!isValidStellarAddress(data.recipientAddress)) {
      return NextResponse.json(
        { error: "Invalid Stellar wallet address. Must start with G and be a valid Stellar public key." },
        { status: 400 }
      );
    }

    const deadline = new Date(data.deadline);
    if (deadline <= new Date()) {
      return NextResponse.json({ error: "Deadline must be in the future." }, { status: 400 });
    }

    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        title: data.title,
        purpose: data.purpose,
        amount: data.amount,
        asset: data.asset,
        recipientAddress: data.recipientAddress,
        deadline,
        description: data.description,
        studentId: session.userId,
      },
    });

    // Notify the user
    await prisma.notification.create({
      data: {
        userId: session.userId,
        title: "Payment Request Created",
        message: `Your payment request "${data.title}" for ${data.amount} ${data.asset} has been created successfully.`,
      },
    });

    return NextResponse.json({ request: paymentRequest }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: err.errors[0]?.message || "Invalid input." }, { status: 400 });
    }
    console.error("[create-request]", err);
    return NextResponse.json({ error: "Failed to create payment request." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    prisma.paymentRequest.findMany({
      where: { studentId: session.userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { payments: { select: { id: true, status: true, transactionHash: true } } },
    }),
    prisma.paymentRequest.count({ where: { studentId: session.userId } }),
  ]);

  return NextResponse.json({ requests, total, page, pages: Math.ceil(total / limit) });
}
