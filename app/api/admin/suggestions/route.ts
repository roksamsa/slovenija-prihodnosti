import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const suggestions = await prisma.needSuggestion.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        segment: { select: { id: true, name: true, slug: true } },
      },
    });
    return NextResponse.json(suggestions);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
