export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/progress?courseSlug=xxx — get user's progress for a course
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const courseSlug = url.searchParams.get("courseSlug");

    if (!courseSlug) {
      return NextResponse.json({ error: "courseSlug required" }, { status: 400 });
    }

    const progress = await prisma.progress.findMany({
      where: { userId: session.userId, courseSlug },
      orderBy: { unitIndex: "asc" },
    });

    return NextResponse.json({ progress });
  } catch (error: unknown) {
    console.error("Progress fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/progress — save unit progress (upsert)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseSlug, unitIndex, stepIndex, quizPassed, quizScore } = await req.json();

    if (!courseSlug || typeof courseSlug !== "string" || courseSlug.length > 100 || unitIndex === undefined || unitIndex < 0 || unitIndex > 10) {
      return NextResponse.json({ error: "Valid courseSlug and unitIndex (0-10) required" }, { status: 400 });
    }

    // Verify the course exists
    const courseExists = await prisma.course.findUnique({ where: { slug: courseSlug }, select: { id: true } });
    if (!courseExists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_courseSlug_unitIndex: {
          userId: session.userId,
          courseSlug,
          unitIndex,
        },
      },
      update: {
        stepIndex: stepIndex ?? 0,
        quizPassed: quizPassed ?? false,
        quizScore: quizScore ?? null,
      },
      create: {
        userId: session.userId,
        courseSlug,
        unitIndex,
        stepIndex: stepIndex ?? 0,
        quizPassed: quizPassed ?? false,
        quizScore: quizScore ?? null,
      },
    });

    // Update enrollment progress percentage
    const totalUnits = 7;
    const allProgress = await prisma.progress.findMany({
      where: { userId: session.userId, courseSlug },
    });
    const passedUnits = allProgress.filter((p) => p.quizPassed).length;
    const progressPct = Math.round((passedUnits / totalUnits) * 100);
    const isCompleted = passedUnits >= totalUnits;

    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (course) {
      await prisma.enrollment.updateMany({
        where: { userId: session.userId, courseId: course.id },
        data: {
          progress: progressPct,
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      });

      // Post-Course Worker Logic
      if (isCompleted) {
        const completedCourses = await prisma.enrollment.findMany({
          where: { userId: session.userId, completed: true },
          include: { course: true },
        });

        // Recalculate Aggregate Score (Basic metric simulation)
        const totalScore = allProgress.reduce((sum, p) => sum + (p.quizScore || 0), 0);
        const avgScoreForCourse = totalScore / Math.max(1, passedUnits);
        
        // For demonstration, calculate an overall simulated user score across completed modules
        const aggregateScore = Math.min(100, Math.round(completedCourses.length * 10 + avgScoreForCourse * 0.1));

        // Create skill tag derived from course categories
        const baseSkills = "Foundational Logic, ";
        const acquiredTags = completedCourses.map(e => e.course.category).join(", ");
        
        await prisma.user.update({
          where: { id: session.userId },
          data: { 
            quizScore: aggregateScore,
            bio: `${baseSkills} ${acquiredTags}` // Simple representation of syncing new skill tags to profile
          }
        });
        
        // Output event stream for HR matching visibility (conceptual logging or messaging system)
        console.info(`[SYSTEM EVENT] User ${session.userId} completed ${courseSlug}. Updated score to ${aggregateScore}`);
      }
    }

    return NextResponse.json({ progress });
  } catch (error: unknown) {
    console.error("Progress save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
