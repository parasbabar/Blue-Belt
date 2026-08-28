import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: { senderWallet: { not: "" } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        paymentRequest: {
          select: { title: true, purpose: true, asset: true, recipientAddress: true },
        },
      },
    }),
    prisma.payment.count(),
  ]);

  return NextResponse.json({ payments, total, page, pages: Math.ceil(total / limit) });
}
