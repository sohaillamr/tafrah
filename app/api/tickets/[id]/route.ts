import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// PATCH /api/tickets/[id] — update ticket status (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await req.json();

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        status: body.status,
        priority: body.priority,
      },
    });

    return NextResponse.json({ ticket });
  } catch (error: unknown) {
    console.error("Ticket update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/tickets/[id] — admin only
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.ticket.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Ticket delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
