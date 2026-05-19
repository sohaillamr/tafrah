"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Award, BookOpen, Brain, CheckCircle2, Flame, HelpCircle, Lock, Sparkles, Trophy } from "lucide-react";
import TopBar from "@/app/components/TopBar";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useAuth } from "@/app/components/AuthProvider";

type Enrollment = {
  id: number;
  progress: number;
  completed: boolean;
  course: { slug: string; titleAr: string; titleEn: string; modules: number; category: string };
};

type ProgressItem = {
  courseSlug: string;
  unitIndex: number;
  quizPassed: boolean;
  quizScore: number | null;
  updatedAt: string;
};

const practicePrompts = {
  ar: [
    "اشرح الفكرة بجملة واحدة.",
    "اختر مثالا بسيطا من حياتك اليومية.",
    "ما الخطوة الأولى إذا كررت هذا الدرس غدا؟",
  ],
  en: [
    "Explain the idea in one sentence.",
    "Choose a simple example from daily life.",
    "What is the first step if you repeat this module tomorrow?",
  ],
};

const decodeMojibake = (value: string) => {
  if (!value || !/[ØÙÃ]/.test(value)) return value;
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
};

export default function DashboardPage() {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [storedXp, setStoredXp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const isAr = language === "ar";
  const labels = isAr
    ? {
        title: "لوحة تعلمي",
        subtitle: "تتبع هادئ وواضح للتقدم، النقاط، والتدريب اليومي.",
        xp: "نقاط XP",
        completed: "وحدات مكتملة",
        today: "وحدات اليوم",
        dailyLimit: "الحد اليومي",
        limitText: "يمكنك إنهاء وحدتين فقط يوميا للحفاظ على التعلم بدون إجهاد.",
        practice: "أسئلة نور الإضافية",
        practiceText: "بعد وحدات اليوم، أجب على أسئلة قصيرة لزيادة XP بدون فتح وحدة جديدة.",
        courses: "دوراتي",
        continue: "متابعة التعلم",
        locked: "تم الوصول للحد اليومي. استخدم أسئلة نور للتدريب.",
        noCourses: "لا توجد دورات بعد.",
        browse: "تصفح الدورات",
        centerOnly: "حساب المركز يستخدم لوحة المركز فقط.",
      }
    : {
        title: "My Learning Dashboard",
        subtitle: "A calm, clear view of progress, XP, and daily practice.",
        xp: "XP points",
        completed: "Completed units",
        today: "Units today",
        dailyLimit: "Daily limit",
        limitText: "You can complete two modules per day to keep learning sustainable.",
        practice: "Extra Nour questions",
        practiceText: "After today's modules, answer short practice questions for more XP without opening a new module.",
        courses: "My courses",
        continue: "Continue learning",
        locked: "Daily limit reached. Use Nour questions for practice.",
        noCourses: "No courses yet.",
        browse: "Browse courses",
        centerOnly: "Center accounts use the center dashboard only.",
      };

  if (isAr) {
    Object.assign(labels, {
      title: "لوحة تعلمي",
      subtitle: "تتبع هادئ وواضح للتقدم، النقاط، والتدريب اليومي.",
      xp: "نقاط XP",
      completed: "وحدات مكتملة",
      today: "وحدات اليوم",
      dailyLimit: "الحد اليومي",
      limitText: "يمكنك إنهاء وحدتين فقط يوميا للحفاظ على التعلم بدون إجهاد.",
      practice: "أسئلة نور الإضافية",
      practiceText: "بعد وحدات اليوم، أجب على أسئلة قصيرة لزيادة XP بدون فتح وحدة جديدة.",
      courses: "دوراتي",
      continue: "متابعة التعلم",
      locked: "تم الوصول للحد اليومي. استخدم أسئلة نور للتدريب.",
      noCourses: "لا توجد دورات بعد.",
      browse: "تصفح الدورات",
      centerOnly: "حساب المركز يستخدم لوحة المركز فقط.",
      starterPractice: "تدريب تمهيدي",
      unit: "وحدة",
      loading: "جاري التحميل...",
      left: "متبقي",
    });
  }
  Object.keys(labels).forEach((key) => {
    const value = labels[key as keyof typeof labels];
    if (typeof value === "string") {
      (labels as Record<string, string>)[key] = decodeMojibake(value);
    }
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activePracticePrompts = isAr
    ? ["اشرح الفكرة بجملة واحدة.", "اختر مثالا بسيطا من حياتك اليومية.", "ما الخطوة الأولى إذا كررت هذا الدرس غدا؟"]
    : practicePrompts.en;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    if (user.role === "center_admin") {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      const enrollmentRes = await fetch("/api/enrollments");
      const enrollmentData = await enrollmentRes.json();
      const list: Enrollment[] = enrollmentData.enrollments || [];
      setEnrollments(list);
      const progressLists = await Promise.all(
        list.map(async (enrollment) => {
          const res = await fetch(`/api/progress?courseSlug=${enrollment.course.slug}`);
          if (!res.ok) return [];
          const data = await res.json();
          return data.progress || [];
        })
      );
      setProgress(progressLists.flat());
      const xpRes = await fetch("/api/xp");
      if (xpRes.ok) {
        const xpData = await xpRes.json();
        setStoredXp(typeof xpData.totalXp === "number" ? xpData.totalXp : null);
      }
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [authLoading, user]);

  const todayKey = new Date().toDateString();
  const completedUnits = progress.filter((item) => item.quizPassed);
  const todayCompleted = completedUnits.filter((item) => new Date(item.updatedAt).toDateString() === todayKey);
  const extraPracticeXp = Math.min(todayCompleted.length * 3, 6) * 10;
  const computedXp = completedUnits.length * 120 + enrollments.filter((item) => item.completed).length * 300 + extraPracticeXp;
  const xp = Math.max(storedXp ?? 0, computedXp);
  const dailyLimitReached = todayCompleted.length >= 2;
  const recentModules = todayCompleted.slice(-2);

  const practiceCards = useMemo(() => {
    const source = recentModules.length ? recentModules : completedUnits.slice(-1);
    return source.flatMap((module) =>
      activePracticePrompts.map((prompt, index) => ({
        id: `${module.courseSlug}-${module.unitIndex}-${index}`,
        title: decodeMojibake(`${module.courseSlug} · ${isAr ? "وحدة" : "Unit"} ${module.unitIndex + 1}`),
        prompt: decodeMojibake(prompt),
      }))
    );
  }, [recentModules, completedUnits, activePracticePrompts, isAr]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <TopBar />
        <main className="mx-auto max-w-6xl px-6 py-10 text-[#2E5C8A]">{isAr ? "جاري التحميل..." : "Loading..."}</main>
      </div>
    );
  }

  if (user?.role === "center_admin") {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <TopBar />
        <main className="mx-auto max-w-3xl px-6 py-10 text-center">
          <h1 className="text-2xl font-semibold text-[#2E5C8A]">{labels.centerOnly}</h1>
          <Link href="/dashboard/center" className="mt-5 inline-flex min-h-12 items-center rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white">{labels.centerOnly}</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-[#212529]">
        <section>
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
          <p className="mt-2 max-w-2xl text-[#495057]">{labels.subtitle}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Stat icon={<Trophy size={20} />} label={labels.xp} value={xp} />
          <Stat icon={<CheckCircle2 size={20} />} label={labels.completed} value={completedUnits.length} />
          <Stat icon={<Flame size={20} />} label={labels.today} value={`${todayCompleted.length}/2`} />
          <Stat icon={dailyLimitReached ? <Lock size={20} /> : <Award size={20} />} label={labels.dailyLimit} value={dailyLimitReached ? "2/2" : `${2 - todayCompleted.length} left`} />
        </section>

        <section className="rounded-sm border border-[#DEE2E6] bg-white p-5">
          <div className="flex items-start gap-3">
            <Brain className="mt-1 text-[#2E5C8A]" size={22} />
            <div>
              <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.dailyLimit}</h2>
              <p className="mt-1 text-[#495057]">{dailyLimitReached ? labels.locked : labels.limitText}</p>
            </div>
          </div>
        </section>

        <section className="rounded-sm border border-[#DEE2E6] bg-white p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 text-[#2E5C8A]" size={22} />
            <div>
              <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.practice}</h2>
              <p className="mt-1 text-[#495057]">{labels.practiceText}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {(practiceCards.length ? practiceCards : practicePrompts[language].map((prompt, index) => ({ id: `starter-${index}`, title: isAr ? "تدريب تمهيدي" : "Starter practice", prompt }))).map((card) => (
              <div key={card.id} className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#2E5C8A]"><HelpCircle size={16} /> {card.title}</div>
                <p className="mt-2 text-[#212529]">{card.prompt}</p>
                <p className="mt-3 text-sm font-semibold text-[#2E7D32]">+10 XP</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-sm border border-[#DEE2E6] bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.courses}</h2>
            <Link href="/courses" className="text-sm font-semibold text-[#2E5C8A]">{labels.browse}</Link>
          </div>
          {enrollments.length === 0 ? <p className="text-[#495057]">{labels.noCourses}</p> : null}
          <div className="grid gap-4 md:grid-cols-2">
            {enrollments.map((enrollment) => (
              <article key={enrollment.id} className="rounded-sm border border-[#E2E8F0] p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-1 text-[#2E5C8A]" size={22} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2E5C8A]">{decodeMojibake(isAr ? enrollment.course.titleAr : enrollment.course.titleEn)}</h3>
                    <div className="mt-3 h-3 rounded-full bg-[#DEE2E6]"><div className="h-3 rounded-full bg-[#2E5C8A]" style={{ width: `${enrollment.progress}%` }} /></div>
                    <p className="mt-2 text-sm text-[#6C757D]">{enrollment.progress}%</p>
                    <Link href={`/courses/${enrollment.course.slug}/learn`} className={`mt-4 inline-flex min-h-11 items-center rounded-sm px-4 font-semibold ${dailyLimitReached ? "border border-[#DEE2E6] text-[#6C757D]" : "bg-[#2E5C8A] text-white"}`}>
                      {dailyLimitReached ? labels.locked : labels.continue}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-sm border border-[#DEE2E6] bg-white p-4">
      <div className="flex items-center gap-2 text-[#2E5C8A]">{icon}<span className="text-sm font-semibold">{label}</span></div>
      <div className="mt-3 text-2xl font-semibold text-[#212529]">{value}</div>
    </div>
  );
}
