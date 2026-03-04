"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  BookOpen,
  FolderOpen,
  Home,
  Settings,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";

interface EnrollmentData {
  id: number;
  courseId: number;
  completed: boolean;
  progress: number;
  course: { titleAr: string; titleEn: string; slug: string; modules: number };
}

export default function StudentDashboardPage() {
  const { language } = useLanguage();
  const { user, loading } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/enrollments")
      .then((r) => r.json())
      .then((d) => setEnrollments(d.enrollments || []))
      .catch(() => {});
  }, [user]);
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          dashboard: "لوحة التحكم",
          support: "الدعم المباشر",
          courses: "دوراتي",
          jobs: "فرص العمل",
          portfolio: "المحفظة",
          settings: "الإعدادات",
          progress: "التقدم الحالي",
          nextTask: "المهمة التالية",
          continue: "اكمل الآن",
          summary: "ملخص الأداء",
          noCourses: "لم تسجل في أي دورة بعد.",
          browseCourses: "تصفح الدورات",
          completed: "مكتمل",
          loginRequired: "يرجى تسجيل الدخول للوصول.",
        }
      : {
          home: "Home",
          dashboard: "Dashboard",
          support: "Live support",
          courses: "My courses",
          jobs: "Jobs",
          portfolio: "Portfolio",
          settings: "Settings",
          progress: "Current progress",
          nextTask: "Next task",
          continue: "Continue now",
          summary: "Performance summary",
          noCourses: "You haven't enrolled in any course yet.",
          browseCourses: "Browse courses",
          completed: "Completed",
          loginRequired: "Please log in to access this page.",
        };

  const greeting = user
    ? language === "ar"
      ? `مرحباً ${user.name}.`
      : `Hello ${user.name}.`
    : "";

  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)
    : 0;
  const completedCourses = enrollments.filter((e) => e.completed).length;
  const activeCourse = enrollments.find((e) => !e.completed);

  if (loading) return <div className="min-h-screen"><TopBar /><main className="mx-auto max-w-6xl px-6 py-24 text-center text-[#6C757D]">...</main></div>;

  if (!user) return (
    <div className="min-h-screen"><TopBar />
      <main className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-[#212529]">
        <p>{labels.loginRequired}</p>
        <Link href="/auth/login" className="min-h-12 inline-flex items-center rounded-sm bg-[#2E5C8A] px-6 text-white">{language === "ar" ? "تسجيل الدخول" : "Login"}</Link>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.dashboard },
          ]}
        />

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-semibold">
              {greeting}
            </h1>
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-[#2E5C8A] px-4 text-white"
              >
                <LifeBuoy size={20} />
                {labels.support}
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="hidden rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4 md:block">
            <nav className="flex flex-col gap-2">
              <Link
                href="/dashboard/student"
                className="min-h-12 rounded-sm bg-[#2E5C8A] px-3 text-white"
              >
                {labels.dashboard}
              </Link>
              <Link
                href="/courses"
                className="min-h-12 rounded-sm px-3 text-[#212529]"
              >
                {labels.courses}
              </Link>
              <Link
                href="/jobs"
                className="min-h-12 rounded-sm px-3 text-[#212529]"
              >
                {labels.jobs}
              </Link>
              <Link
                href={`/profile/${user.id}`}
                className="min-h-12 rounded-sm px-3 text-[#212529]"
              >
                {labels.portfolio}
              </Link>
            </nav>
          </aside>

          <div className="flex flex-col gap-6">
            {enrollments.length === 0 ? (
              <div className="rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-6 text-center">
                <p className="mb-3">{labels.noCourses}</p>
                <Link href="/courses" className="min-h-12 inline-flex items-center rounded-sm bg-[#2E5C8A] px-6 text-white">{labels.browseCourses}</Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4">
                  <h2 className="font-semibold">{labels.progress}</h2>
                  <p>{avgProgress}%</p>
                  <div className="mt-3 h-3 w-full rounded-sm bg-[#DEE2E6]">
                    <div className="h-3 rounded-sm bg-[#2E5C8A]" style={{ width: `${avgProgress}%` }} />
                  </div>
                  <p className="mt-3">{completedCourses} / {enrollments.length}</p>
                </div>
                <div className="rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4">
                  <h2 className="font-semibold">{labels.nextTask}</h2>
                  {activeCourse ? (
                    <>
                      <p>{language === "ar" ? activeCourse.course.titleAr : activeCourse.course.titleEn}</p>
                      <Link
                        href={`/courses/${activeCourse.course.slug}/learn`}
                        className="mt-4 inline-flex min-h-12 items-center rounded-sm bg-[#2E5C8A] px-4 text-white"
                      >
                        {labels.continue}
                      </Link>
                    </>
                  ) : (
                    <p className="text-[#6C757D]">{labels.completed}</p>
                  )}
                </div>
                <div className="rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4">
                  <h2 className="font-semibold">{labels.summary}</h2>
                  <p>{enrollments.length} {labels.courses}</p>
                  <p>{completedCourses} {labels.completed}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-[#DEE2E6] bg-white md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
          <Link href="/dashboard/student" className="min-h-12">
            <Home size={20} />
          </Link>
          <Link href="/courses" className="min-h-12">
            <BookOpen size={20} />
          </Link>
          <Link href="/jobs" className="min-h-12">
            <Briefcase size={20} />
          </Link>
          <Link href={`/profile/${user?.id || "me"}`} className="min-h-12">
            <FolderOpen size={20} />
          </Link>
          <Link href="/contact" className="min-h-12">
            <LifeBuoy size={20} />
          </Link>
        </div>
      </nav>
    </div>
  );
}
