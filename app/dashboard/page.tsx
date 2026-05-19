"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Award, BookOpen, Brain, CheckCircle2, Flame, HelpCircle, Lock, Save, Sparkles, Trophy } from "lucide-react";
import TopBar from "@/app/components/TopBar";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useAuth } from "@/app/components/AuthProvider";
import { usePreferencesStore } from "@/lib/store/usePreferencesStore";

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

type AiPracticeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
  const { preferences, category, setPreferences, loadPreferences } = usePreferencesStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [storedXp, setStoredXp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [practiceQuestions, setPracticeQuestions] = useState<AiPracticeQuestion[]>([]);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, string>>({});
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceCourseSlug, setPracticeCourseSlug] = useState("");
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefMessage, setPrefMessage] = useState("");
  const isAr = language === "ar";

  const labels = isAr
    ? {
        title: "لوحة تعلمي",
        subtitle: "تتبع هادئ وواضح للتقدم، النقاط، التدريب اليومي، وتفضيلاتك.",
        xp: "نقاط XP",
        completed: "وحدات مكتملة",
        today: "وحدات اليوم",
        dailyLimit: "الحد اليومي",
        limitText: "يمكنك إنهاء وحدتين فقط يوميا للحفاظ على التعلم بدون إجهاد.",
        practice: "أسئلة نور الإضافية",
        practiceText: "نور يولد أسئلة من الدورة والوحدة التي تعمل عليها الآن. الإجابة الصحيحة تضيف XP.",
        generatePractice: "توليد أسئلة نور",
        generatingPractice: "نور يجهز الأسئلة...",
        correctAnswer: "إجابة صحيحة. حصلت على XP إضافية.",
        wrongAnswer: "ليست الإجابة الأفضل. اقرأ التفسير وجرب سؤالا آخر.",
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
        preferences: "تفضيلات التعلم",
        savePreferences: "حفظ التفضيلات",
        savingPreferences: "جاري الحفظ...",
        prefsSaved: "تم حفظ التفضيلات.",
        mutedColors: "ألوان هادئة",
        reduceMotion: "تقليل الحركة",
        ttsEnabled: "قراءة النص المحدد بصوت نور",
        largeText: "نص أكبر",
        simplifiedText: "شرح مختصر وخطوات واضحة",
        largeTargets: "أزرار ومساحات ضغط أكبر",
        highContrastText: "تباين أعلى للنص",
        dyslexicFont: "خط أسهل للقراءة",
      }
    : {
        title: "My Learning Dashboard",
        subtitle: "A calm, clear view of progress, XP, daily practice, and preferences.",
        xp: "XP points",
        completed: "Completed units",
        today: "Units today",
        dailyLimit: "Daily limit",
        limitText: "You can complete two modules per day to keep learning sustainable.",
        practice: "Extra Nour questions",
        practiceText: "Nour generates questions from the course and unit you are working on now. Correct answers add XP.",
        generatePractice: "Generate Nour questions",
        generatingPractice: "Nour is preparing questions...",
        correctAnswer: "Correct. Extra XP added.",
        wrongAnswer: "Not the best answer. Read the explanation and try another question.",
        courses: "My courses",
        continue: "Continue learning",
        locked: "Daily limit reached. Use Nour questions for practice.",
        noCourses: "No courses yet.",
        browse: "Browse courses",
        centerOnly: "Center accounts use the center dashboard only.",
        starterPractice: "Starter practice",
        unit: "Unit",
        loading: "Loading...",
        left: "left",
        preferences: "Learning preferences",
        savePreferences: "Save preferences",
        savingPreferences: "Saving...",
        prefsSaved: "Preferences saved.",
        mutedColors: "Calmer colors",
        reduceMotion: "Reduce motion",
        ttsEnabled: "Read selected text with Nour",
        largeText: "Larger text",
        simplifiedText: "Shorter explanations and clear steps",
        largeTargets: "Larger buttons and touch targets",
        highContrastText: "Higher text contrast",
        dyslexicFont: "Easier reading font",
      };

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role === "center_admin") {
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
  const activeEnrollment = enrollments.find((item) => !item.completed) || enrollments[0];
  const latestModule = completedUnits.slice(-1)[0];

  const activeCourseTitle = useMemo(() => {
    if (!activeEnrollment) return "";
    return decodeMojibake(isAr ? activeEnrollment.course.titleAr : activeEnrollment.course.titleEn);
  }, [activeEnrollment, isAr]);

  async function generatePractice() {
    setPracticeLoading(true);
    setPracticeFeedback({});
    const courseSlug = activeEnrollment?.course.slug || latestModule?.courseSlug || "";
    const unitNumber = latestModule ? latestModule.unitIndex + 1 : 1;
    const res = await fetch("/api/course-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "practice",
        language,
        courseSlug,
        courseTitle: activeCourseTitle || courseSlug,
        unitNumber,
        unitTitle: `${labels.unit} ${unitNumber}`,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setPracticeQuestions(Array.isArray(data.questions) ? data.questions : []);
    setPracticeCourseSlug(data.courseSlug || courseSlug);
    setPracticeLoading(false);
  }

  async function answerPractice(question: AiPracticeQuestion, answerIndex: number) {
    setPracticeAnswers((prev) => ({ ...prev, [question.id]: answerIndex }));
    const correct = answerIndex === question.correctIndex;
    setPracticeFeedback((prev) => ({
      ...prev,
      [question.id]: correct ? labels.correctAnswer : `${labels.wrongAnswer} ${question.explanation}`,
    }));
    if (correct) {
      const res = await fetch("/api/course-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "awardPracticeXp",
          questionId: question.id,
          correct,
          courseSlug: practiceCourseSlug,
          unitNumber: latestModule ? latestModule.unitIndex + 1 : 1,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.awarded) setStoredXp((prev) => (prev ?? xp) + Number(data.xp || 0));
    }
  }

  async function savePreference(key: string, value: boolean) {
    const nextPrefs = {
      ...preferences,
      [key]: value,
      ...(key === "largeText" ? { scale: value ? "large" : "normal" } : {}),
    };
    setPreferences(nextPrefs as any, category);
    setPrefSaving(true);
    setPrefMessage("");
    const res = await fetch("/api/users/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, uiPreferences: nextPrefs }),
    });
    setPrefSaving(false);
    setPrefMessage(res.ok ? labels.prefsSaved : "");
    loadPreferences();
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <TopBar />
        <main className="mx-auto max-w-6xl px-6 py-10 text-[#2E5C8A]">{labels.loading}</main>
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
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-[#212529] sm:px-6 lg:py-10">
        <section>
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
          <p className="mt-2 max-w-2xl text-[#495057]">{labels.subtitle}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Stat icon={<Trophy size={20} />} label={labels.xp} value={xp} />
          <Stat icon={<CheckCircle2 size={20} />} label={labels.completed} value={completedUnits.length} />
          <Stat icon={<Flame size={20} />} label={labels.today} value={`${todayCompleted.length}/2`} />
          <Stat icon={dailyLimitReached ? <Lock size={20} /> : <Award size={20} />} label={labels.dailyLimit} value={dailyLimitReached ? "2/2" : `${2 - todayCompleted.length} ${labels.left}`} />
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
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 text-[#2E5C8A]" size={22} />
              <div>
                <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.practice}</h2>
                <p className="mt-1 text-[#495057]">{labels.practiceText}</p>
              </div>
            </div>
            <button type="button" onClick={generatePractice} disabled={practiceLoading || !activeEnrollment} className="min-h-11 rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white disabled:opacity-60">
              {practiceLoading ? labels.generatingPractice : labels.generatePractice}
            </button>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {practiceQuestions.map((question) => (
              <div key={question.id} className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#2E5C8A]"><HelpCircle size={16} /> {activeCourseTitle || labels.starterPractice}</div>
                <p className="mt-2 font-semibold text-[#212529]">{question.prompt}</p>
                <div className="mt-3 flex flex-col gap-2">
                  {question.options.map((option, index) => {
                    const selected = practiceAnswers[question.id] === index;
                    return (
                      <button key={option} type="button" onClick={() => answerPractice(question, index)} className={`min-h-10 rounded-sm border px-3 text-start text-sm ${selected ? "border-[#2E5C8A] bg-white font-semibold text-[#2E5C8A]" : "border-[#D9E6F2] bg-white text-[#212529]"}`}>
                        {option}
                      </button>
                    );
                  })}
                </div>
                {practiceFeedback[question.id] ? <p className="mt-3 rounded-sm bg-white p-2 text-sm">{practiceFeedback[question.id]}</p> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-sm border border-[#DEE2E6] bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Save className="text-[#2E5C8A]" size={20} />
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.preferences}</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["mutedColors", labels.mutedColors],
              ["reduceMotion", labels.reduceMotion],
              ["ttsEnabled", labels.ttsEnabled],
              ["largeText", labels.largeText],
              ["simplifiedText", labels.simplifiedText],
              ["largeTargets", labels.largeTargets],
              ["highContrastText", labels.highContrastText],
              ["dyslexicFont", labels.dyslexicFont],
            ].map(([key, label]) => (
              <label key={key} className="flex min-h-12 items-center justify-between gap-3 rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] px-4">
                <span>{label}</span>
                <input type="checkbox" checked={Boolean((preferences as Record<string, unknown>)?.[key])} onChange={(event) => savePreference(key, event.target.checked)} />
              </label>
            ))}
          </div>
          <p className="mt-3 text-sm text-[#6C757D]">{prefSaving ? labels.savingPreferences : prefMessage}</p>
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
