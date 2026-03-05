import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitize, clamp } from "@/lib/sanitize";

const VALID_PRIORITIES = ["low", "normal", "high"];

// POST /api/tickets — create support ticket (anyone)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // Validate required fields
    if (!body.subject || !body.message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    if (typeof body.subject !== "string" || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400 }
      );
    }

    // Validate email format if provided
    const email = body.email || session?.email || "";
    if (email && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const priority = VALID_PRIORITIES.includes(body.priority) ? body.priority : "normal";

    const ticket = await prisma.ticket.create({
      data: {
        userId: session?.userId || null,
        subject: sanitize(clamp(body.subject, 300)),
        message: sanitize(clamp(body.message, 5000)),
        email: sanitize(clamp(email, 320)),
        priority,
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error: unknown) {
    console.error("Ticket create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/tickets — list tickets (admin sees all, user sees own) with pagination
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));

    const where = session.role === "admin" ? {} : { userId: session.userId };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    return NextResponse.json({ tickets, total, page, limit });
  } catch (error: unknown) {
    console.error("Tickets list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
