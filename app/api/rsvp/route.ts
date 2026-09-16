import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/rsvp-schema";

// ─── Rate Limiter (in-memory, per IP) ────────────────────────────────────────
// Simpan: IP → { count: number; windowStart: number (epoch ms) }
// Reset window setiap WINDOW_MS.
// Ini cukup untuk mencegah bot spam ringan. Untuk traffic besar, ganti Redis.

const RATE_LIMIT = 5;          // maks request per window
const WINDOW_MS = 60 * 1000;  // window = 1 menit

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // Window baru / belum pernah hit
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

/** Ambil IP dari request — support X-Forwarded-For (Nginx reverse proxy) */
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ─── POST /api/rsvp — Submit RSVP dari form ──────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip = getClientIP(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak request. Coba lagi dalam 1 menit." },
      { status: 429 }
    );
  }

  // 2. Parse body
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body harus berupa JSON yang valid." },
      { status: 400 }
    );
  }

  // 3. Validasi dengan Zod
  const result = rsvpSchema.safeParse(rawBody);
  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `${String(issue.path.join("."))}: ${issue.message}`)
      .join("; ");
    return NextResponse.json(
      { error: `Validasi gagal: ${messages}` },
      { status: 400 }
    );
  }

  const { name, attendance, guests, message } = result.data;

  // 4. Simpan ke database
  try {
    const rsvp = await prisma.rSVP.create({
      data: { name, attendance, guests, message },
    });

    return NextResponse.json({ ok: true, id: rsvp.id }, { status: 200 });
  } catch (err) {
    // Log error internal — SEMENTARA bocorkan ke client untuk debug
    const errMsg = err instanceof Error ? err.message : String(err);
    const errStack = err instanceof Error ? err.stack : undefined;
    console.error("[RSVP POST] Database error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan data.", detail: errMsg, stack: errStack },
      { status: 500 }
    );
  }
}

// ─── GET /api/rsvp — Daftar RSVP (admin only) ────────────────────────────────

export async function GET(req: NextRequest) {
  // 1. Autentikasi: cek Bearer token
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    console.error("[RSVP GET] ADMIN_SECRET tidak di-set di environment!");
    return NextResponse.json(
      { error: "Konfigurasi server tidak lengkap." },
      { status: 500 }
    );
  }

  if (!token || token !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // 2. Ambil semua data RSVP
  try {
    const entries = await prisma.rSVP.findMany({
      orderBy: { createdAt: "desc" },
    });

    const total = entries.length;
    const attending = entries.filter((e) => e.attendance === "yes").length;
    const notAttending = entries.filter((e) => e.attendance === "no").length;
    const totalGuests = entries
      .filter((e) => e.attendance === "yes")
      .reduce((sum, e) => sum + e.guests, 0);

    return NextResponse.json(
      {
        total,
        attending,
        notAttending,
        totalGuests,
        entries: entries.map((e) => ({
          id: e.id,
          name: e.name,
          attendance: e.attendance,
          guests: e.guests,
          message: e.message ?? "",
          createdAt: e.createdAt.toISOString(),
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[RSVP GET] Database error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
