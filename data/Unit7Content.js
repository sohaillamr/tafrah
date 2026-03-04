export const unit7Content = [
  {
    unit_id: "UNIT_07",
    title: "مشروع نهائي",
    focus: "Complete Data Project, QA, and Professional Delivery",
    chapters: [
      {
        chapter_id: "chapter-1",
        chapter_title: "تخطيط المشروع وإعداد بيئة العمل",
        steps: [
          {
            type: "info",
            instruction:
              "المشروع النهائي يختبر كل المهارات التي تعلمتها. ستنشئ جدول بيانات كامل من الصفر: الهيكل، البيانات، التنظيف، والتسليم. ابدأ دائماً بقراءة المطلوب كاملاً قبل أي عمل.",
          },
          {
            type: "task",
            instruction: "أنشئ عنوان المشروع في الخلية A1: سجل موظفي شركة طفرة 2026",
            action: { kind: "typeCell", target: "A1", value: "سجل موظفي شركة طفرة 2026" },
          },
          {
            type: "task",
            instruction: "اكتب رأس العمود الأول في A2: الاسم الكامل",
            action: { kind: "typeCell", target: "A2", value: "الاسم الكامل" },
          },
          {
            type: "task",
            instruction: "اكتب رأس العمود الثاني في B2: القسم",
            action: { kind: "typeCell", target: "B2", value: "القسم" },
          },
        ],
      },
      {
        chapter_id: "chapter-2",
        chapter_title: "إدخال البيانات ومعالجتها",
        steps: [
          {
            type: "task",
            instruction: "اكتب رأس العمود الثالث في C2: تاريخ التعيين",
            action: { kind: "typeCell", target: "C2", value: "تاريخ التعيين" },
          },
          {
            type: "task",
            instruction: "أدخل بيانات الموظف الأول في A3: سارة محمد عبدالله",
            action: { kind: "typeCell", target: "A3", value: "سارة محمد عبدالله" },
          },
          {
            type: "task",
            instruction: "أدخل قسم الموظف الأول في B3: إدخال البيانات",
            action: { kind: "typeCell", target: "B3", value: "إدخال البيانات" },
          },
          {
            type: "task",
            instruction: "أدخل تاريخ تعيين الموظف الأول في C3: 2026-01-15",
            action: { kind: "typeCell", target: "C3", value: "2026-01-15" },
          },
        ],
      },
      {
        chapter_id: "chapter-3",
        chapter_title: "مراجعة الجودة والتسليم",
        steps: [
          {
            type: "task",
            instruction: "أدخل بيانات الموظف الثاني في A4: أحمد خالد حسن",
            action: { kind: "typeCell", target: "A4", value: "أحمد خالد حسن" },
          },
          {
            type: "task",
            instruction: "أدخل قسم الموظف الثاني في B4: اختبار البرمجيات",
            action: { kind: "typeCell", target: "B4", value: "اختبار البرمجيات" },
          },
          {
            type: "task",
            instruction: "أدخل تاريخ تعيين الموظف الثاني في C4: 2026-02-01",
            action: { kind: "typeCell", target: "C4", value: "2026-02-01" },
          },
          {
            type: "info",
            instruction:
              "تهانينا! لقد أكملت المشروع النهائي بنجاح. أنت الآن تمتلك المهارات الأساسية لإدخال البيانات باحترافية: التنظيم، الدقة، التنظيف، والتسليم. أنت جاهز للعمل الحقيقي!",
          },
        ],
      },
    ],
  },
];
