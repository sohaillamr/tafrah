"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Brush, Bug, Code, Database, Lock } from "lucide-react";
import Link from "next/link";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { useLanguage } from "../components/LanguageProvider";
import { useAuth } from "../components/AuthProvider";
import { LoadingSpinner, EmptyState } from "../components/UIHelpers";

interface CourseData {
  id: number; slug: string; titleAr: string; titleEn: string;
  descAr: string; descEn: string; hours: number; modules: number;
  difficulty: string; category: string; available: boolean;
}

export default function CoursesPage() {
  const { user } = useAuth();
  const isGuest = !user;
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [duration, setDuration] = useState(10);
  const { language } = useLanguage();

  useEffect(() => {
    setLoadingCourses(true);
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []))
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, []);
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          courses: "الدورات",
          guestNote: "يمكنك تصفح الدورات كزائر. يلزم تسجيل الدخول للاشتراك والتنفيذ.",
          title: "مكتبة الدورات",
          intro: "اختر دورة واضحة من القائمة التالية.",
          search: "البحث",
          searchPlaceholder: "ابحث عن اسم الكورس أو المهارة...",
          category: "التصنيف",
          difficulty: "مستوى الصعوبة",
          duration: "المدة",
          hours: "ساعات",
          view: "عرض التفاصيل",
          comingSoon: "قريباً",
          categories: ["data-entry", "design", "qa", "programming"],
          categoryLabels: { "data-entry": "إدخال البيانات", "design": "التصميم", "qa": "اختبار البرمجيات", "programming": "البرمجة" } as Record<string, string>,
          difficulties: ["beginner", "intermediate", "advanced"],
          diffLabels: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم" } as Record<string, string>,
        }
      : {
          home: "Home",
          courses: "Courses",
          guestNote: "You can browse courses as a guest. Sign in is required to enroll.",
          title: "Course library",
          intro: "Choose a clear course from the list below.",
          search: "Search",
          searchPlaceholder: "Search by course name or skill...",
          category: "Category",
          difficulty: "Difficulty",
          duration: "Duration",
          hours: "hours",
          view: "View details",
          comingSoon: "Coming soon",
          categories: ["data-entry", "design", "qa", "programming"],
          categoryLabels: { "data-entry": "Data Entry", "design": "Design", "qa": "Software Testing", "programming": "Programming" } as Record<string, string>,
          difficulties: ["beginner", "intermediate", "advanced"],
          diffLabels: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as Record<string, string>,
        };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const title = language === "ar" ? course.titleAr : course.titleEn;
      const desc = language === "ar" ? course.descAr : course.descEn;
      const matchesSearch = !search || title.includes(search) || desc.includes(search);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(course.category);
      const matchesDifficulty =
        selectedDifficulties.length === 0 || selectedDifficulties.includes(course.difficulty);
      const matchesDuration = course.hours <= duration;
      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
    });
  }, [search, selectedCategories, selectedDifficulties, duration, courses, language]);

  const toggleSelection = (value: string, list: string[], setList: (fn: (prev: string[]) => string[]) => void) => {
    setList((prev: string[]) =>
      prev.includes(value) ? prev.filter((item: string) => item !== value) : [...prev, value]
    );
  };

  const iconForCategory = (category: string) => {
    if (category === "data-entry") return <Database size={32} />;
    if (category === "design") return <Brush size={32} />;
    if (category === "qa") return <Bug size={32} />;
    if (category === "programming") return <Code size={32} />;
    return <BookOpen size={32} />;
  };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.courses }]} />

        {isGuest ? (
          <section className="flex items-center gap-3 rounded-xl border border-[#D9E6F2] bg-[#F5F9FF] p-4">
            {labels.guestNote}
          </section>
        ) : null}

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold">{labels.title}</h1>
            <p>{labels.intro}</p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <label className="flex flex-col gap-2">
              {labels.search}
              <input
                type="text"
                placeholder={labels.searchPlaceholder}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-h-11 rounded-xl border border-[#E2E8F0] bg-[#F5F9FF] px-4 focus:border-[#2E5C8A] focus:outline-none focus:ring-1 focus:ring-[#2E5C8A]/20"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold">{labels.category}</h2>
                {labels.categories.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() =>
                        toggleSelection(category, selectedCategories, setSelectedCategories)
                      }
                    />
                    {labels.categoryLabels[category] || category}
                  </label>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold">{labels.difficulty}</h2>
                {labels.difficulties.map((difficulty) => (
                  <label key={difficulty} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDifficulties.includes(difficulty)}
                      onChange={() =>
                        toggleSelection(
                          difficulty,
                          selectedDifficulties,
                          setSelectedDifficulties
                        )
                      }
                    />
                    {labels.diffLabels[difficulty] || difficulty}
                  </label>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold">{labels.duration}</h2>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                />
                <p>
                  {language === "ar" ? "حتى" : "Up to"} {duration} {labels.hours}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {loadingCourses ? (
              <div className="md:col-span-2"><LoadingSpinner /></div>
            ) : filteredCourses.length === 0 ? (
              <div className="md:col-span-2">
                <EmptyState
                  icon={<BookOpen size={32} />}
                  title={language === "ar" ? "لا توجد دورات مطابقة" : "No matching courses"}
                  description={language === "ar" ? "جرب تعديل معايير البحث." : "Try adjusting your filters."}
                />
              </div>
            ) : (
            filteredCourses.map((course) => {
              const title = language === "ar" ? course.titleAr : course.titleEn;
              const desc = language === "ar" ? course.descAr : course.descEn;
              return (
              <div
                key={course.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E3EEF9] to-[#D9E6F2] text-[#2E5C8A]">
                    {iconForCategory(course.category)}
                  </div>
                  <h2 className="font-semibold">{title}</h2>
                </div>
                <p>{desc}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#E3EEF9] px-3 py-1 text-xs font-medium text-[#2E5C8A]">
                    {course.hours} {labels.hours}
                  </span>
                  <span className="rounded-full bg-[#E3EEF9] px-3 py-1 text-xs font-medium text-[#2E5C8A]">
                    {labels.diffLabels[course.difficulty] || course.difficulty}
                  </span>
                  <span className="rounded-full bg-[#E3EEF9] px-3 py-1 text-xs font-medium text-[#2E5C8A]">
                    {labels.categoryLabels[course.category] || course.category}
                  </span>
                </div>
                {course.available ? (
                  <Link
                    href={`/courses/${course.slug}`}
                    className="min-h-11 inline-flex items-center justify-center rounded-xl bg-[#2E5C8A] px-5 font-medium text-white shadow-sm"
                  >
                    {labels.view}
                  </Link>
                ) : (
                  <div className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8F9FA] px-5 text-sm text-[#6C757D]">
                    <Lock size={14} /> {labels.comingSoon}
                  </div>
                )}
              </div>
              );
            })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
