import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitize, clamp } from "@/lib/sanitize";

// GET /api/messages — get conversations with pagination
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50")));
    const contactId = url.searchParams.get("contactId");

    const where: Record<string, unknown> = {
      OR: [
        { senderId: session.userId },
        { receiverId: session.userId },
      ],
    };

    // Filter by specific conversation partner
    if (contactId) {
      const cId = parseInt(contactId);
      if (!isNaN(cId)) {
        where.OR = [
          { senderId: session.userId, receiverId: cId },
          { senderId: cId, receiverId: session.userId },
        ];
      }
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({ where }),
    ]);

    return NextResponse.json({ messages, total, page, limit });
  } catch (error: unknown) {
    console.error("Messages list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/messages — send message
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, content } = await req.json();

    if (!receiverId || !content || typeof content !== "string") {
      return NextResponse.json({ error: "receiverId and content are required" }, { status: 400 });
    }

    if (receiverId === session.userId) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId }, select: { id: true } });
    if (!receiver) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const safeContent = sanitize(clamp(content, 5000));

    const message = await prisma.message.create({
      data: {
        senderId: session.userId,
        receiverId,
        content: safeContent,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: unknown) {
    console.error("Message send error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
