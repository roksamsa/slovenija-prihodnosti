import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: list approved suggestions, optionally by segment
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const segmentSlug = searchParams.get("segment");

    const where: { status: string; segment?: { slug: string } } = { status: "APPROVED" };
    if (segmentSlug) where.segment = { slug: segmentSlug };

    const suggestions = await prisma.needSuggestion.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        segment: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json(suggestions);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}

// POST: create new suggestion (PENDING)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const segmentSlug = typeof body?.segmentSlug === "string" ? body.segmentSlug.trim() : null;
    const title = typeof body?.title === "string" ? body.title.trim() : null;
    const description = typeof body?.description === "string" ? body.description.trim() : null;
    const authorEmail = typeof body?.authorEmail === "string" ? body.authorEmail.trim() : null;

    if (!segmentSlug || !title || !authorEmail) {
      return NextResponse.json(
        { error: "segmentSlug, title and authorEmail are required" },
        { status: 400 }
      );
    }

    const segment = await prisma.nationalSegment.findUnique({
      where: { slug: segmentSlug },
      select: { id: true },
    });
    if (!segment) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const suggestion = await prisma.needSuggestion.create({
      data: {
        segmentId: segment.id,
        title,
        description: description ?? "",
        authorEmail,
        status: "PENDING",
      },
      include: {
        segment: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json(suggestion);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create suggestion" }, { status: 500 });
  }
}
