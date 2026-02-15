import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const VOTER_COOKIE = "sp_voter";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: needId } = await params;
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

    const need = await prisma.nationalNeed.findUnique({
      where: { id: needId },
      select: { id: true, likesCount: true, dislikesCount: true },
    });
    if (!need) {
      return NextResponse.json({ error: "Need not found" }, { status: 404 });
    }

    const existing = await prisma.needVote.findUnique({
      where: {
        nationalNeedId_voterToken: { nationalNeedId: needId, voterToken: token },
      },
    });

    if (existing) {
      if (existing.value === value) {
        return NextResponse.json({
          success: true,
          likes: need.likesCount,
          dislikes: need.dislikesCount,
        });
      }
      const likesDelta = (value === 1 ? 1 : 0) - (existing.value === 1 ? 1 : 0);
      const dislikesDelta = (value === -1 ? 1 : 0) - (existing.value === -1 ? 1 : 0);
      await prisma.$transaction([
        prisma.needVote.update({
          where: { id: existing.id },
          data: { value },
        }),
        prisma.nationalNeed.update({
          where: { id: needId },
          data: {
            likesCount: need.likesCount + likesDelta,
            dislikesCount: need.dislikesCount + dislikesDelta,
          },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.needVote.create({
          data: { nationalNeedId: needId, voterToken: token, value },
        }),
        prisma.nationalNeed.update({
          where: { id: needId },
          data: {
            likesCount: value === 1 ? need.likesCount + 1 : need.likesCount,
            dislikesCount: value === -1 ? need.dislikesCount + 1 : need.dislikesCount,
          },
        }),
      ]);
    }

    const updated = await prisma.nationalNeed.findUnique({
      where: { id: needId },
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
