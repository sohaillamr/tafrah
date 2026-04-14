export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitize, clamp } from "@/lib/sanitize";

type RouteContext = { params: Promise<{ id: string }> };

const VALID_JOB_TYPES = ["task", "fulltime"];
const VALID_JOB_STATUSES = ["open", "closed", "filled"];

// PATCH /api/jobs/[id] — update job (admin or owning HR)
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "hr")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    // HR can only edit their own jobs
    if (session.role === "hr") {
      const job = await prisma.job.findUnique({
        where: { id },
        select: { postedById: true },
      });
      if (!job || job.postedById !== session.userId) {
        return NextResponse.json({ error: "You can only edit your own job postings" }, { status: 403 });
      }
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    // Sanitize string fields
    if (body.titleAr !== undefined) data.titleAr = sanitize(clamp(String(body.titleAr), 200));
    if (body.titleEn !== undefined) data.titleEn = sanitize(clamp(String(body.titleEn), 200));
    if (body.descAr !== undefined) data.descAr = sanitize(clamp(String(body.descAr), 5000));
    if (body.descEn !== undefined) data.descEn = sanitize(clamp(String(body.descEn), 5000));
    if (body.companyName !== undefined) data.companyName = sanitize(clamp(String(body.companyName), 200));
    if (body.requiredSkills !== undefined) data.requiredSkills = sanitize(clamp(String(body.requiredSkills), 1000));

    // Validate enum fields
    if (body.type !== undefined) {
      if (!VALID_JOB_TYPES.includes(body.type)) {
        return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
      }
      data.type = body.type;
    }
    if (body.status !== undefined) {
      if (!VALID_JOB_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid job status" }, { status: 400 });
      }
      data.status = body.status;
    }
    if (body.category !== undefined) data.category = body.category;
    if (body.salary !== undefined && typeof body.salary === "number") data.salary = body.salary;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
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
  { params }: RouteContext
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Job delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
