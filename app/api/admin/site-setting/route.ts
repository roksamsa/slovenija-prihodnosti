import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ALLOWED_KEYS = new Set(["disclaimer", "beta_note"]);

function getKeyFromRequest(req: Request): string {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "disclaimer";
  return ALLOWED_KEYS.has(key) ? key : "disclaimer";
}

export async function GET(req: Request) {
  const key = getKeyFromRequest(req);
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return NextResponse.json({ key, value: setting?.value ?? "" });
}

export async function POST(req: Request) {
  const key = getKeyFromRequest(req);
  const body = (await req.json().catch(() => ({}))) as { value?: string; key?: string };
  const value = body?.value ?? "";
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json({ ok: true, key, value });
}
