export const financeUnit6Content = [
  {
    unit_id: "FIN_UNIT_06",
    title: "الوحدة ٦: الميزانية الشخصية والمهنية",
    focus: "تخطيط المصروفات والدخل بطريقة واضحة وقابلة للتوقع.",
    chapters: [
      {
        chapter_id: "fin-ch-6-1",
        chapter_title: "١. معنى الميزانية",
        steps: [
          { type: "info", instruction: "الميزانية خطة بسيطة: كم يدخل؟ كم يخرج؟ وكم يتبقى؟" },
          { type: "info", instruction: "الهدف ليس الكمال. الهدف أن نرى الأرقام بوضوح ونقلل المفاجآت." },
          { type: "task", instruction: "ما السؤال الأول في الميزانية؟", action: { kind: "selectOption", label: "كم يدخل؟" } }
        ]
      },
      {
        chapter_id: "fin-ch-6-2",
        chapter_title: "٢. ترتيب المصروفات",
        steps: [
          { type: "info", instruction: "نقسم المصروفات إلى أساسية، متغيرة، واختيارية. هذا يقلل التشتت عند اتخاذ القرار." },
          { type: "task", instruction: "أي نوع من المصروفات نبدأ به؟", action: { kind: "selectOption", label: "المصروفات الأساسية" } }
        ]
      }
    ]
  }
];
