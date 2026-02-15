import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const KEY = "disclaimer";

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: KEY } });
  return NextResponse.json({ value: setting?.value ?? "" });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { value?: string };
  const value = body?.value ?? "";
  await prisma.siteSetting.upsert({
    where: { key: KEY },
    update: { value },
    create: { key: KEY, value },
  });
  return NextResponse.json({ ok: true });
}
