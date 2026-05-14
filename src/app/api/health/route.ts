import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  let dbOk = false;
  try { await prisma.$queryRaw`SELECT 1`; dbOk = true; } catch {}
  return NextResponse.json({ status: dbOk ? "ok" : "degraded", db: dbOk ? "ok" : "unreachable", timestamp: new Date().toISOString() }, { status: dbOk ? 200 : 503 });
}
