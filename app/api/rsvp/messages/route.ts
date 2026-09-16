import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const entries = await prisma.rSVP.findMany({
      where: {
        message: {
          not: "",
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        message: true,
        createdAt: true,
        replies: {
          orderBy: { createdAt: "asc" },
        },
      }
    });

    // Filter out entries that have empty messages after trimming
    const validEntries = entries.filter(e => e.message && e.message.trim() !== "");

    return NextResponse.json(validEntries, { status: 200 });
  } catch (err) {
    console.error("[RSVP Messages GET] Database error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil pesan." },
      { status: 500 }
    );
  }
}
