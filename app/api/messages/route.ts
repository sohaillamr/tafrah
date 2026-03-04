import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitize, clamp } from "@/lib/sanitize";

// GET /api/messages — get conversations
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.userId },
          { receiverId: session.userId },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
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
