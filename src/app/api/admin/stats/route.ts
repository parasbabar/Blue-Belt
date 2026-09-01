import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // Basic admin access — in production you'd want a proper ADMIN role
  const [users, requests, payments, feedback] = await Promise.all([
    prisma.user.count(),
    prisma.paymentRequest.count(),
    prisma.payment.count(),
    prisma.feedback.findMany({ select: { rating: true, comment: true, createdAt: true } }),
  ]);

  const confirmedPayments = await prisma.paymentRequest.count({ where: { status: "CONFIRMED" } });
  const failedPayments = await prisma.paymentRequest.count({ where: { status: "FAILED" } });
  const avgRating = feedback.length > 0
    ? feedback.reduce((s: number, f: { rating: number }) => s + f.rating, 0) / feedback.length
    : null;

  return NextResponse.json({
    stats: {
      totalUsers: users,
      totalRequests: requests,
      totalPayments: payments,
      confirmedPayments,
      failedPayments,
      feedbackCount: feedback.length,
      averageRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    },
    recentFeedback: feedback.slice(0, 10),
  });
}
