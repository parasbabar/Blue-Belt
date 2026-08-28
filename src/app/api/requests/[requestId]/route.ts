import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;

  const paymentRequest = await prisma.paymentRequest.findUnique({
    where: { id: requestId },
    include: {
      student: { select: { id: true, name: true, country: true } },
      payments: {
        select: {
          id: true,
          status: true,
          transactionHash: true,
          amount: true,
          senderWallet: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!paymentRequest) {
    return NextResponse.json({ error: "Payment request not found." }, { status: 404 });
  }

  return NextResponse.json({ request: paymentRequest });
}
