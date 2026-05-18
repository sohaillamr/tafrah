export const financeUnit5Content = [
  {
    unit_id: "FIN_UNIT_05",
    title: "الوحدة ٥: قراءة التقارير المالية",
    focus: "فهم التقارير المالية بدون ضغط وبخطوات قصيرة.",
    chapters: [
      {
        chapter_id: "fin-ch-5-1",
        chapter_title: "١. ما هو التقرير المالي؟",
        steps: [
          { type: "info", instruction: "التقرير المالي هو ملخص منظم يخبرنا بما حدث في الشركة خلال فترة محددة." },
          { type: "info", instruction: "نقرأ التقرير بهدوء: الإيرادات أولا، ثم المصروفات، ثم النتيجة النهائية." },
          { type: "task", instruction: "ما أفضل طريقة لقراءة التقرير؟", action: { kind: "selectOption", label: "خطوة واحدة في كل مرة" } }
        ]
      },
      {
        chapter_id: "fin-ch-5-2",
        chapter_title: "٢. مؤشرات بسيطة",
        steps: [
          { type: "info", instruction: "المؤشر المالي رقم يساعدنا نلاحظ نمطا. مثال: هل المصروفات تزيد بسرعة أكبر من الإيرادات؟" },
          { type: "task", instruction: "ما وظيفة المؤشر المالي؟", action: { kind: "selectOption", label: "ملاحظة نمط في الأرقام" } }
        ]
      }
    ]
  }
];
