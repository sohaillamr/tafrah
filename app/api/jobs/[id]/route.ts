import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// PATCH /api/jobs/[id] — update job
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "hr")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await req.json();
    const data: Record<string, unknown> = {};
    const allowed = ["titleAr", "titleEn", "descAr", "descEn", "type", "category", "salary", "status", "requiredSkills"];
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    const job = await prisma.job.update({ where: { id }, data });
    return NextResponse.json({ job });
  } catch (error: unknown) {
    console.error("Job update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/jobs/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.job.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Job delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
