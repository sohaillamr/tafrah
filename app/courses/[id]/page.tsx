"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, UserRound, Clock, BookOpen, BarChart3, ShieldCheck, Lock, FileText } from "lucide-react";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";

interface CourseData {
  id: number;
  slug: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  category: string;
  difficulty: string;
  hours: number;
  modules: number;
  available: boolean;
}

const skillsArabic: Record<string, string[]> = {
  "data-entry": ["إدخال بيانات الجداول", "تنسيق الأعمدة", "مراجعة الأخطاء"],
  design: ["المحاذاة", "اختيار الألوان", "ملفات التسليم الواضحة"],
  qa: ["كتابة حالات الاختبار", "التقاط الأخطاء", "توثيق النتائج"],
  programming: ["كتابة أوامر بايثون", "فهم المتغيرات والأنواع", "استخدام الشروط والحلقات", "تعريف الدوال", "بناء برنامج متكامل"], finance: ["فهم الأصول والخصوم", "معادلة المحاسبة", "قيود اليومية", "القوائم المالية", "استخدام أنظمة ERP"],
};

const skillsEnglish: Record<string, string[]> = {
  "data-entry": ["Table data entry", "Column formatting", "Error review"],
  design: ["Alignment", "Color selection", "Clear handoff files"],
  qa: ["Test case writing", "Bug capture", "Result documentation"],
  programming: ["Writing Python commands", "Variables and data types", "Conditions and loops", "Defining functions", "Building a complete program"], finance: ["Understanding Assets and Liabilities", "Accounting Equation", "Journal Entries and Ledger", "Financial Statements", "Working with ERP Systems"],
};

const syllabusArabic = [
  {
    title: "الوحدة ١: تأسيس البيئة الرقمية",
    lessons: ["فهم التخزين السحابي", "إدارة المجلدات المهنية", "التصفح الآمن والتركيز", "أمن كلمة المرور"],
    quiz: true,
  },
  {
    title: "الوحدة ٢: جداول البيانات الأساسية",
    lessons: ["تصميم جدول مرتب", "إدخال البيانات النصية والرقمية", "تنسيق الأعمدة والصفوف", "حفظ الملف"],
    quiz: true,
  },
  {
    title: "الوحدة ٣: تنظيف البيانات وتصحيح الأخطاء",
    lessons: ["اكتشاف التكرارات", "تصحيح الصيغ والأرقام", "التحقق من الاتساق"],
    quiz: true,
  },
  {
    title: "الوحدة ٤: إدارة البريد والملفات",
    lessons: ["تحميل الملفات", "تنظيم المرفقات", "إرسال المهام"],
    quiz: true,
  },
  {
    title: "الوحدة ٥: دقة الإنتاج وسرعة التنفيذ",
    lessons: ["قواعد السرعة الآمنة", "تتبع الأخطاء", "تحسين النتيجة"],
    quiz: true,
  },
  {
    title: "الوحدة ٦: العمل مع نماذج العملاء",
    lessons: ["تعبئة الاستمارات", "التحقق قبل الإرسال"],
    quiz: true,
  },
  {
    title: "الوحدة ٧: مشروع نهائي",
    lessons: ["تنفيذ مشروع بيانات كامل", "مراجعة الجودة والتسليم"],
    quiz: true,
  },
];

const pythonSyllabusArabic = [
  {
    title: "الوحدة ١: مقدمة في البرمجة وبيئة العمل",
    lessons: ["ما هي البرمجة؟", "أول برنامج: طباعة نص", "طباعة أكثر من سطر", "التعليقات في الكود"],
    quiz: true,
  },
  {
    title: "الوحدة ٢: المتغيرات وأنواع البيانات",
    lessons: ["ما هي المتغيرات؟", "الأرقام", "النصوص (Strings)", "التحويل بين الأنواع"],
    quiz: true,
  },
  {
    title: "الوحدة ٣: العمليات الحسابية والمقارنات",
    lessons: ["العمليات الحسابية الأساسية", "الأولويات والأقواس", "عمليات المقارنة"],
    quiz: true,
  },
  {
    title: "الوحدة ٤: الشروط واتخاذ القرارات",
    lessons: ["جملة if الشرطية", "جملة else", "جملة elif (شروط متعددة)"],
    quiz: true,
  },
  {
    title: "الوحدة ٥: الحلقات والتكرار",
    lessons: ["حلقة for", "التكرار على القوائم", "حلقة while"],
    quiz: true,
  },
  {
    title: "الوحدة ٦: الدوال (Functions)",
    lessons: ["تعريف الدوال", "المعاملات (Parameters)", "القيمة المُرجعة (return)"],
    quiz: true,
  },
  {
    title: "الوحدة ٧: مشروع نهائي: برنامج متكامل",
    lessons: ["التخطيط وإعداد البرنامج", "بناء الدوال الأساسية", "تشغيل البرنامج الكامل"],
    quiz: true,
  },
];

const syllabusEnglish = [
  {
    title: "Module 1: Digital foundation",
    lessons: ["Cloud storage basics", "Professional folder management", "Safe browsing and focus", "Password security"],
    quiz: true,
  },
  {
    title: "Module 2: Spreadsheet essentials",
    lessons: ["Structured table design", "Text and number entry", "Formatting rows and columns", "Saving files"],
    quiz: true,
  },
  {
    title: "Module 3: Data cleaning and QA",
    lessons: ["Duplicate checks", "Fixing errors", "Consistency review"],
    quiz: true,
  },
  {
    title: "Module 4: Email and files",
    lessons: ["Downloading files", "Organizing attachments", "Sending tasks"],
    quiz: true,
  },
  {
    title: "Module 5: Accuracy and speed",
    lessons: ["Safe speed rules", "Error tracking", "Improving results"],
    quiz: true,
  },
  {
    title: "Module 6: Client forms",
    lessons: ["Form completion", "Verify before submit"],
    quiz: true,
  },
  {
    title: "Module 7: Final project",
    lessons: ["Complete data project", "QA and delivery"],
    quiz: true,
  },
];


const financeSyllabusArabic = [
  { title: 'الوحدة ١: لغة المال', lessons: ['ما هي المحاسبة؟', 'الأصول', 'الخصوم', 'معادلة الميزان', 'شجرة الحسابات'], quiz: true },
  { title: 'الوحدة ٢: قصة معاملة', lessons: ['قيود اليومية', 'المدين والدائن', 'دفتر الأستاذ', 'ميزان المراجعة'], quiz: true },
  { title: 'الوحدة ٣: الصورة الكبرى', lessons: ['قائمة الدخل', 'الأرباح المحتجزة', 'الميزانية العمومية', 'التدفقات النقدية'], quiz: true },
  { title: 'الوحدة ٤: المحاسبة التقنية', lessons: ['البرامج المحاسبية', 'نظام ERP', 'Dynamics 365', 'Excel'], quiz: true }
];

const financeSyllabusEnglish = [
  { title: 'Module 1: Language of Money', lessons: ['What is Accounting?', 'Assets', 'Liabilities', 'The Equation', 'Chart of Accounts'], quiz: true },
  { title: 'Module 2: Story of a Transaction', lessons: ['Journal Entries', 'Debit and Credit', 'The Ledger', 'Trial Balance'], quiz: true },
  { title: 'Module 3: The Big Picture', lessons: ['Income Statement', 'Retained Earnings', 'Balance Sheet', 'Cash Flows'], quiz: true },
  { title: 'Module 4: Tech Accounting', lessons: ['Accounting Software', 'ERP Systems', 'Dynamics 365', 'Excel'], quiz: true }
];

const pythonSyllabusEnglish = [
  {
    title: "Module 1: Introduction to Programming",
    lessons: ["What is programming?", "First program: printing text", "Printing multiple lines", "Comments in code"],
    quiz: true,
  },
  {
    title: "Module 2: Variables and Data Types",
    lessons: ["What are variables?", "Numbers", "Strings", "Type conversion"],
    quiz: true,
  },
  {
    title: "Module 3: Operations and Comparisons",
    lessons: ["Basic arithmetic", "Priorities and parentheses", "Comparison operators"],
    quiz: true,
  },
  {
    title: "Module 4: Conditions and Decision Making",
    lessons: ["if statement", "else statement", "elif (multiple conditions)"],
    quiz: true,
  },
  {
    title: "Module 5: Loops and Iteration",
    lessons: ["for loop", "Iterating over lists", "while loop"],
    quiz: true,
  },
  {
    title: "Module 6: Functions",
    lessons: ["Defining functions", "Parameters", "Return values"],
    quiz: true,
  },
  {
    title: "Module 7: Final Project",
    lessons: ["Planning the program", "Building core functions", "Running the complete program"],
    quiz: true,
  },
];

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const { language } = useLanguage();

  const courseSlug = useMemo(() => {
    return Array.isArray(params?.id) ? params.id[0] : params?.id;
  }, [params]);

  const isGuest = !authLoading && !user;

  useEffect(() => {
    if (!courseSlug) return;
    fetch(`/api/courses/${courseSlug}`)
      .then((r) => r.json())
      .then((d) => {
        setCourse(d.course || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseSlug]);

  useEffect(() => {
    if (!user || !course) return;
    fetch("/api/enrollments")
      .then((r) => r.json())
      .then((d) => {
        const enrolled = (d.enrollments || []).some(
          (e: { courseId: number }) => e.courseId === course.id
        );
        setIsEnrolled(enrolled);
      })
      .catch(() => {});
  }, [user, course]);

  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          courses: "الدورات",
          loading: "جارٍ التحميل...",
          notAvailable: "الدورة غير متاحة حالياً",
          guestNote: "أنت تتصفح كزائر. سجل الدخول للاشتراك في الدورة.",
          duration: "المدة",
          hours: "ساعات",
          modules: "عدد الوحدات",
          level: "المستوى",
          accredited: "معتمد من: المركز المصري للتوحد",
          loginToEnroll: "سجل الدخول للاشتراك",
          goToLesson: "ابدأ الدرس",
          enroll: "اشترك الآن - مجاني",
          enrolling: "جاري الاشتراك...",
          learn: "ماذا ستتعلم؟",
          syllabus: "منهج الدورة",
          quiz: "اختبار قصير بعد هذه الوحدة.",
          trainer: "معلومات المدرب",
          trainerName: course?.category === "programming" ? "أستاذ محمد" : course?.category === "finance" ? "أستاذ أحمد (محاسب معتمد)" : "أستاذة سارة",
          trainerBio: course?.category === "programming" ? "خبير في برمجة بايثون معتمد لتدريب ذوي التوحد." : course?.category === "finance" ? "خبير مالي ومحاسب معتمد لتدريب ذوي التوحد." : "خبير في إدخال البيانات معتمد لتدريب ذوي التوحد.",
          comingSoon: "قريباً",
          comingSoonNote: "هذه الدورة ستكون متاحة قريباً.",
          syllabusData: course?.slug === "programming-1" || course?.category === "programming" ? pythonSyllabusArabic : course?.category === "finance" ? financeSyllabusArabic : syllabusArabic,
        }
      : {
          home: "Home",
          courses: "Courses",
          loading: "Loading...",
          notAvailable: "Course is not available right now",
          guestNote: "You are browsing as a guest. Sign in to enroll in this course.",
          duration: "Duration",
          hours: "hours",
          modules: "Modules",
          level: "Level",
          accredited: "Accredited by: Egyptian Autism Center",
          loginToEnroll: "Sign in to enroll",
          goToLesson: "Start Lesson",
          enroll: "Enroll now - free",
          enrolling: "Enrolling...",
          learn: "What will you learn?",
          syllabus: "Course syllabus",
          quiz: "A short quiz after this module.",
          trainer: "Trainer info",
          trainerName: course?.category === "programming" ? "أستاذ محمد" : course?.category === "finance" ? "أستاذ أحمد (محاسب معتمد)" : "أستاذة سارة",
          trainerBio: course?.category === "programming" ? "A certified Python programming expert training autistic learners." : course?.category === "finance" ? "خبير مالي ومحاسب معتمد لتدريب ذوي التوحد." : "A certified data entry expert training autistic learners.",
          comingSoon: "Coming soon",
          comingSoonNote: "This course will be available soon.",
          syllabusData: course?.slug === "programming-1" || course?.category === "programming" ? pythonSyllabusEnglish : course?.category === "finance" ? financeSyllabusEnglish : syllabusEnglish,
        };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12 text-[#212529]">
          <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.courses, href: "/courses" }]} />
          <p className="text-center text-[#6C757D]">{labels.loading}</p>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12 text-[#212529]">
          <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.courses, href: "/courses" }]} />
          <h1 className="font-semibold">{labels.notAvailable}</h1>
        </main>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (isGuest) {
      router.push("/auth/login");
      return;
    }
    if (isEnrolled) {
      router.push(`/courses/${course.slug}/learn`);
      return;
    }
    setEnrolling(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      if (res.ok) {
        setIsEnrolled(true);
        router.push(`/courses/${course.slug}/learn`);
      }
    } catch {
      // silent
    } finally {
      setEnrolling(false);
    }
  };

  const title = language === "ar" ? course.titleAr : course.titleEn;
  const description = language === "ar" ? course.descAr : course.descEn;
  const skills = language === "ar"
    ? (skillsArabic[course.category] || skillsArabic["data-entry"])
    : (skillsEnglish[course.category] || skillsEnglish["data-entry"]);
  const isAvailable = course.available;
  const syllabusData = isAvailable ? labels.syllabusData : [];
  const difficultyLabel = language === "ar"
    ? (course.difficulty === "beginner" ? "مبتدئ" : course.difficulty === "intermediate" ? "متوسط" : "متقدم")
    : (course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1));

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.courses, href: "/courses" },
            { label: title },
          ]}
        />

        <section className="flex flex-col gap-5 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#2E5C8A] to-[#3D7AB5] px-6 py-8">
            <h1 className="font-semibold text-white">{title}</h1>
            <p className="mt-2 text-white/80">{description}</p>
          </div>
          <div className="flex flex-col gap-4 px-6 pb-6">
          {isGuest ? (
            <div className="flex items-center gap-3 rounded-xl border border-[#D9E6F2] bg-[#F5F9FF] p-4">
              <span>{labels.guestNote}</span>
            </div>
          ) : null}
          {!isAvailable ? (
            <div className="flex items-center gap-3 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] p-4">
              <Lock size={18} className="shrink-0 text-[#6C757D]" />
              <span>{labels.comingSoonNote}</span>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9E6F2] bg-[#F5F9FF] px-4 py-2 text-sm font-medium text-[#2E5C8A]">
              <Clock size={14} /> {labels.duration}: {course.hours} {labels.hours}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9E6F2] bg-[#F5F9FF] px-4 py-2 text-sm font-medium text-[#2E5C8A]">
              <BookOpen size={14} /> {labels.modules}: {course.modules}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9E6F2] bg-[#F5F9FF] px-4 py-2 text-sm font-medium text-[#2E5C8A]">
              <BarChart3 size={14} /> {labels.level}: {difficultyLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#2E7D32]/20 bg-[#E8F5E9] p-4 text-[#1B5E20]">
            <ShieldCheck size={20} className="shrink-0" />
            {labels.accredited}
          </div>
          <button
            type="button"
            onClick={handleEnroll}
            disabled={!isAvailable || enrolling}
            className={`min-h-12 rounded-xl px-8 text-lg font-semibold ${
              !isAvailable
                ? "border border-[#DEE2E6] bg-[#F8F9FA] text-[#6C757D] cursor-not-allowed"
                : "bg-[#2E5C8A] text-white shadow-md"
            }`}
          >
            {!isAvailable
              ? labels.comingSoon
              : enrolling
              ? labels.enrolling
              : isEnrolled
              ? labels.goToLesson
              : isGuest
              ? labels.loginToEnroll
              : labels.enroll}
          </button>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h2 className="font-semibold">{labels.learn}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center gap-3 rounded-xl border border-[#D9E6F2] bg-[#F5F9FF] p-4">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E5C8A] text-white">
                  <Check size={16} />
                </span>
                <span className="font-medium text-[#2E5C8A]">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h2 className="font-semibold">{labels.syllabus}</h2>
          <div className="flex flex-col gap-3">
            {syllabusData.map((module, moduleIndex) => (
              <details key={module.title} className="group rounded-xl border border-[#E2E8F0] bg-[#FAFBFC]">
                <summary className="flex cursor-pointer items-center gap-3 p-4 font-semibold">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E5C8A] text-sm text-white">
                    {moduleIndex + 1}
                  </span>
                  <span className="flex-1">{module.title}</span>
                </summary>
                <div className="border-t border-[#E2E8F0] px-4 pb-4 pt-3">
                  <ol className="flex flex-col gap-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lesson} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[#495057]">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E3EEF9] text-xs font-semibold text-[#2E5C8A]">{lessonIndex + 1}</span>
                        {lesson}
                      </li>
                    ))}
                  </ol>
                  {module.quiz ? (
                    <p className="mt-3 flex items-center gap-2 text-sm text-[#2E5C8A]">
                      <FileText size={14} /> {labels.quiz}
                    </p>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h2 className="font-semibold">{labels.trainer}</h2>
          <div className="flex items-center gap-4 rounded-xl bg-[#F5F9FF] p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2E5C8A] to-[#3D7AB5] text-white shadow-sm">
              <UserRound size={24} />
            </div>
            <div>
              <p className="font-semibold text-[#2E5C8A]">{labels.trainerName}</p>
              <p className="text-[#495057]">{labels.trainerBio}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
