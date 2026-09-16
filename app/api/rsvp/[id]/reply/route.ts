import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rsvpId } = await params;
    const body = await req.json();

    if (!body.message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    // Verify parent RSVP exists
    const existing = await prisma.rSVP.findUnique({
      where: { id: rsvpId },
    });

    if (!existing) {
      return NextResponse.json({ error: "RSVP not found." }, { status: 404 });
    }

    const reply = await prisma.reply.create({
      data: {
        name: body.name || "Tamu",
        message: body.message,
        rsvpId: rsvpId,
      },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (err) {
    console.error("[RSVP Reply POST] Database error:", err);
    return NextResponse.json(
      { error: "Failed to submit reply." },
      { status: 500 }
    );
  }
}
