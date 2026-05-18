export const financeUnit7Content = [
  {
    unit_id: "FIN_UNIT_07",
    title: "الوحدة ٧: مشروع مالي مصغر",
    focus: "تجميع ما تعلمته في نموذج بسيط يمكن عرضه أو مراجعته.",
    chapters: [
      {
        chapter_id: "fin-ch-7-1",
        chapter_title: "١. اختيار مشروع صغير",
        steps: [
          { type: "info", instruction: "اختر مثالا واحدا: متجر صغير، خدمة تدريب، أو مشروع منزلي. لا نحتاج تفاصيل كثيرة." },
          { type: "task", instruction: "ما حجم المشروع المناسب للتدريب؟", action: { kind: "selectOption", label: "مشروع صغير وواضح" } }
        ]
      },
      {
        chapter_id: "fin-ch-7-2",
        chapter_title: "٢. عرض النتيجة",
        steps: [
          { type: "info", instruction: "اكتب ثلاثة أرقام فقط: الإيرادات، المصروفات، والنتيجة. ثم اشرح ماذا تعني النتيجة بجملة واحدة." },
          { type: "task", instruction: "ما الأرقام الثلاثة المطلوبة؟", action: { kind: "selectOption", label: "الإيرادات والمصروفات والنتيجة" } }
        ]
      }
    ]
  }
];
