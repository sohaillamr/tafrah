import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST /api/tickets — create support ticket (anyone)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    const ticket = await prisma.ticket.create({
      data: {
        userId: session?.userId || null,
        subject: body.subject,
        message: body.message,
        email: body.email || session?.email || "",
        priority: body.priority || "normal",
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error: unknown) {
    console.error("Ticket create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/tickets — list tickets (admin sees all, user sees own)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = session.role === "admin" ? {} : { userId: session.userId };

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error: unknown) {
    console.error("Tickets list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
