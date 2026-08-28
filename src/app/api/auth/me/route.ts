import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      country: true,
      walletAddress: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json();
  const { name, country, walletAddress } = body;

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(name && { name }),
      ...(country && { country }),
      ...(walletAddress !== undefined && { walletAddress }),
    },
    select: { id: true, email: true, name: true, role: true, country: true, walletAddress: true },
  });

  return NextResponse.json({ user: updated });
}
