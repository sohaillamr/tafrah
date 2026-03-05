import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitize, clamp } from "@/lib/sanitize";

// GET /api/jobs — list jobs with pagination
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");
    const postedById = url.searchParams.get("postedById");
    const all = url.searchParams.get("all");
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    else if (!all) where.status = "open";
    if (type) where.type = type;
    if (category) where.category = category;
    if (postedById) where.postedById = parseInt(postedById);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({ jobs, total, page, limit });
  } catch (error: unknown) {
    console.error("Jobs list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/jobs — create job (admin or hr)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "hr")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const job = await prisma.job.create({
      data: {
        titleAr: sanitize(clamp(body.titleAr || "", 200)),
        titleEn: sanitize(clamp(body.titleEn || "", 200)),
        descAr: sanitize(clamp(body.descAr || "", 5000)),
        descEn: sanitize(clamp(body.descEn || "", 5000)),
        type: ["task", "fulltime"].includes(body.type) ? body.type : "task",
        category: body.category || "data-entry",
        salary: typeof body.salary === "number" ? body.salary : 0,
        currency: body.currency || "EGP",
        companyName: sanitize(clamp(body.companyName || "", 200)),
        requiredSkills: sanitize(clamp(body.requiredSkills || "", 1000)),
        postedById: session.userId,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "create_job",
        details: `Posted job: ${body.titleEn}`,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error: unknown) {
    console.error("Job create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
