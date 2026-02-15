import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body?.status; // APPROVED | REJECTED
  if (status !== "APPROVED" && status !== "REJECTED") {
    return NextResponse.json({ error: "status must be APPROVED or REJECTED" }, { status: 400 });
  }

  try {
    const suggestion = await prisma.needSuggestion.update({
      where: { id },
      data: { status },
      include: {
        segment: { select: { name: true, slug: true } },
      },
    });
    return NextResponse.json(suggestion);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
