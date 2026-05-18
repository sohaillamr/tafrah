export const courseOverrides: Record<string, {
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  category: string;
  difficulty: string;
  hours: number;
  modules: number;
}> = {
  "data-entry-1": {
    titleAr: "أساسيات إدخال البيانات",
    titleEn: "Data Entry Basics",
    descAr: "تعلم التعامل مع الجداول والبيانات بخطوات قصيرة وبيئة تدريب هادئة.",
    descEn: "Learn tables and data entry through short steps and a calm practical environment.",
    category: "data-entry",
    difficulty: "beginner",
    hours: 2,
    modules: 7,
  },
  "programming-1": {
    titleAr: "أساسيات بايثون",
    titleEn: "Python Basics",
    descAr: "تعلم البرمجة بأسلوب منظم ومناسب للتعلم خطوة بخطوة.",
    descEn: "Learn programming through a structured, step-by-step Python flow.",
    category: "programming",
    difficulty: "beginner",
    hours: 5,
    modules: 7,
  },
  "finance-1": {
    titleAr: "أساسيات المالية والمحاسبة",
    titleEn: "Finance and Accounting Fundamentals",
    descAr: "مبادئ مالية ومحاسبية مبسطة بتدرج واضح وبيئة تدريب هادئة.",
    descEn: "Simple finance and accounting fundamentals with a calm seven-unit progression.",
    category: "finance",
    difficulty: "beginner",
    hours: 6,
    modules: 7,
  },
};

export function applyCourseOverride<T extends { slug: string }>(course: T): T {
  const override = courseOverrides[course.slug];
  return override ? { ...course, ...override } : course;
}
