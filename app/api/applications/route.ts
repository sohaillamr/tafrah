import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST /api/applications — apply for a job
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, coverNote } = await req.json();

    const existing = await prisma.application.findUnique({
      where: { userId_jobId: { userId: session.userId, jobId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already applied" }, { status: 409 });
    }

    const application = await prisma.application.create({
      data: { userId: session.userId, jobId, coverNote },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "apply_job",
        details: `Applied for job #${jobId}`,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error: unknown) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/applications — get applications (admin sees all, user sees own)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let where: Record<string, unknown> = {};

    if (session.role === "admin") {
      where = {};
    } else if (session.role === "hr") {
      // HR sees applications for jobs they posted
      const hrJobs = await prisma.job.findMany({
        where: { postedById: session.userId },
        select: { id: true },
      });
      const jobIds = hrJobs.map((j) => j.id);
      where = { jobId: { in: jobIds } };
    } else {
      where = { userId: session.userId };
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: { select: { id: true, titleAr: true, titleEn: true, companyName: true, salary: true } },
        user: { select: { id: true, name: true, email: true, quizScore: true } },
      },
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error: unknown) {
    console.error("Applications list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/applications — update application status (admin or HR)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "hr")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, status: newStatus } = await req.json();

    if (!applicationId || !["accepted", "rejected", "pending"].includes(newStatus)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // If HR, verify they own the job
    if (session.role === "hr") {
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: { select: { postedById: true } } },
      });
      if (!application || application.job.postedById !== session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: `application_${newStatus}`,
        details: `Application #${applicationId} ${newStatus}`,
      },
    });

    return NextResponse.json({ application });
  } catch (error: unknown) {
    console.error("Application update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
