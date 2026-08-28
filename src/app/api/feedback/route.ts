import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  paymentId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = feedbackSchema.parse(body);

    const feedback = await prisma.feedback.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        paymentId: data.paymentId,
      },
    });

    return NextResponse.json({ feedback }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: err.errors[0]?.message || "Invalid input." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit feedback." }, { status: 500 });
  }
}

export async function GET() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const total = await prisma.feedback.count();
  const avgRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    : 0;

  return NextResponse.json({ feedbacks, total, averageRating: avgRating });
}
