import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/admin/stats — dashboard statistics (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const days = Math.min(parseInt(url.searchParams.get("days") || "30"), 365);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [
      totalUsers,
      totalStudents,
      totalHr,
      pendingUsers,
      bannedUsers,
      totalCourses,
      availableCourses,
      totalEnrollments,
      completedEnrollments,
      totalJobs,
      openJobs,
      totalApplications,
      totalTickets,
      openTickets,
      recentUsers,
      recentLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "student" } }),
      prisma.user.count({ where: { role: "hr" } }),
      prisma.user.count({ where: { status: "pending" } }),
      prisma.user.count({ where: { status: "banned" } }),
      prisma.course.count(),
      prisma.course.count({ where: { available: true } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { completed: true } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: "open" } }),
      prisma.application.count(),
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: { in: ["new", "in-progress"] } } }),
      prisma.user.findMany({
        where: { createdAt: { gte: since } },
        select: { id: true, name: true, role: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.activityLog.findMany({
        include: { user: { select: { name: true, role: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    // Use raw SQL for proper daily aggregation on PostgreSQL
    const signupsByDay = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*)::int AS count
      FROM "User"
      WHERE "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `;

    const enrollmentsByDay = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "enrolledAt") AS day, COUNT(*)::int AS count
      FROM "Enrollment"
      WHERE "enrolledAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `;

    return NextResponse.json({
      overview: {
        totalUsers,
        totalStudents,
        totalHr,
        pendingUsers,
        bannedUsers,
        totalCourses,
        availableCourses,
        totalEnrollments,
        completedEnrollments,
        completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
        totalJobs,
        openJobs,
        totalApplications,
        totalTickets,
        openTickets,
      },
      recentUsers,
      recentLogs,
      charts: {
        signupsByDay,
        enrollmentsByDay,
      },
    });
  } catch (error: unknown) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
