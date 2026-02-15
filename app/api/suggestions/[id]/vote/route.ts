import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const VOTER_COOKIE = "sp_voter";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: suggestionId } = await params;
    const body = await request.json();
    const value = body?.value === 1 ? 1 : body?.value === -1 ? -1 : null;
    if (value === null) {
      return NextResponse.json({ error: "value must be 1 (like) or -1 (dislike)" }, { status: 400 });
    }

    const cookieStore = await cookies();
    let token = cookieStore.get(VOTER_COOKIE)?.value;
    if (!token) {
      token = crypto.randomUUID();
      cookieStore.set(VOTER_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    const suggestion = await prisma.needSuggestion.findUnique({
      where: { id: suggestionId, status: "APPROVED" },
      select: { id: true, likesCount: true, dislikesCount: true },
    });
    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }

    const existing = await prisma.suggestionVote.findUnique({
      where: {
        suggestionId_voterToken: { suggestionId, voterToken: token },
      },
    });

    if (existing) {
      if (existing.value === value) {
        return NextResponse.json({ success: true, likes: suggestion.likesCount, dislikes: suggestion.dislikesCount });
      }
      const likesDelta = (value === 1 ? 1 : 0) - (existing.value === 1 ? 1 : 0);
      const dislikesDelta = (value === -1 ? 1 : 0) - (existing.value === -1 ? 1 : 0);
      await prisma.$transaction([
        prisma.suggestionVote.update({
          where: { id: existing.id },
          data: { value },
        }),
        prisma.needSuggestion.update({
          where: { id: suggestionId },
          data: {
            likesCount: suggestion.likesCount + likesDelta,
            dislikesCount: suggestion.dislikesCount + dislikesDelta,
          },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.suggestionVote.create({
          data: { suggestionId, voterToken: token, value },
        }),
        prisma.needSuggestion.update({
          where: { id: suggestionId },
          data: {
            likesCount: value === 1 ? suggestion.likesCount + 1 : suggestion.likesCount,
            dislikesCount: value === -1 ? suggestion.dislikesCount + 1 : suggestion.dislikesCount,
          },
        }),
      ]);
    }

    const updated = await prisma.needSuggestion.findUnique({
      where: { id: suggestionId },
      select: { likesCount: true, dislikesCount: true },
    });
    return NextResponse.json({
      success: true,
      likes: updated?.likesCount ?? 0,
      dislikes: updated?.dislikesCount ?? 0,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
