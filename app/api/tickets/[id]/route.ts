export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const VALID_STATUSES = ["new", "in-progress", "resolved", "closed"];
const VALID_PRIORITIES = ["low", "normal", "high"];

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
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
    }

    const body = await req.json();
    const data: Record<string, string> = {};

    if (body.status) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status. Must be: new, in-progress, resolved, or closed" }, { status: 400 });
      }
      data.status = body.status;
    }
    if (body.priority) {
      if (!VALID_PRIORITIES.includes(body.priority)) {
        return NextResponse.json({ error: "Invalid priority. Must be: low, normal, or high" }, { status: 400 });
      }
      data.priority = body.priority;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data,
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
    }

    await prisma.ticket.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Ticket delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
