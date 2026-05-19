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
    descAr: "تعلم التعامل مع الجداول والبيانات بخطوات قصيرة، تدريب عملي، ومراجعة هادئة مناسبة للمتعلمين التوحديين.",
    descEn: "Learn tables and data entry through calm practical steps, source checks, and neurodivergent-friendly review.",
    category: "data-entry",
    difficulty: "beginner",
    hours: 6,
    modules: 7,
  },
  "programming-1": {
    titleAr: "أساسيات بايثون",
    titleEn: "Python Basics",
    descAr: "تعلم البرمجة بأسلوب منظم خطوة بخطوة، مع تركيز على بنية الكود وليس اختلافات الكتابة العربية داخل النصوص.",
    descEn: "Learn programming through a structured Python flow focused on code structure, prediction, testing, and calm debugging.",
    category: "programming",
    difficulty: "beginner",
    hours: 7,
    modules: 7,
  },
  "finance-1": {
    titleAr: "أساسيات المالية والمحاسبة",
    titleEn: "Finance and Accounting Fundamentals",
    descAr: "مبادئ مالية ومحاسبية مبسطة عبر سبع وحدات، مع مساحة تدريب مالية منفصلة عن بيئة إدخال البيانات.",
    descEn: "Simple finance and accounting fundamentals across seven units, with a dedicated finance practice workspace.",
    category: "finance",
    difficulty: "beginner",
    hours: 7,
    modules: 7,
  },
};

export function applyCourseOverride<T extends { slug: string }>(course: T): T {
  const override = courseOverrides[course.slug];
  return override ? { ...course, ...override } : course;
}
