export const unit6Content = [
  {
    unit_id: "UNIT_06",
    title: "العمل مع نماذج العملاء",
    focus: "Client Forms, Data Validation, and Pre-submission Checks",
    chapters: [
      {
        chapter_id: "chapter-1",
        chapter_title: "فهم نماذج العملاء",
        steps: [
          {
            type: "info",
            instruction:
              "نماذج العملاء هي استمارات تحتوي على حقول محددة يجب ملؤها بدقة. كل حقل له نوع بيانات معين: اسم (نص)، مبلغ (رقم)، تاريخ. قراءة التعليمات أولاً تمنع الأخطاء.",
          },
          {
            type: "task",
            instruction: "في الخلية A1، اكتب عنوان النموذج: نموذج بيانات العميل",
            action: { kind: "typeCell", target: "A1", value: "نموذج بيانات العميل" },
          },
          {
            type: "info",
            instruction:
              "القاعدة: اقرأ كل حقل بعناية قبل ملئه. لاحظ: هل المطلوب الاسم الأول فقط أم الاسم الكامل؟ هل التاريخ بالميلادي أم الهجري؟ هذه التفاصيل مهمة جداً.",
          },
          {
            type: "task",
            instruction: "اكتب رأس العمود الأول في الخلية A2: الاسم الكامل",
            action: { kind: "typeCell", target: "A2", value: "الاسم الكامل" },
          },
        ],
      },
      {
        chapter_id: "chapter-2",
        chapter_title: "تعبئة الاستمارات",
        steps: [
          {
            type: "info",
            instruction:
              "عند تعبئة الاستمارة، اتبع الترتيب من أعلى إلى أسفل. لا تقفز بين الحقول. أدخل كل معلومة بالتنسيق المطلوب تماماً.",
          },
          {
            type: "task",
            instruction: "أدخل اسم العميل في الخلية A3: أحمد محمود السيد",
            action: { kind: "typeCell", target: "A3", value: "أحمد محمود السيد" },
          },
          {
            type: "task",
            instruction: "أدخل رقم الهاتف في الخلية B3: 01098765432",
            action: { kind: "typeCell", target: "B3", value: "01098765432" },
          },
          {
            type: "task",
            instruction: "أدخل تاريخ التسجيل في الخلية C3: 2026-02-28",
            action: { kind: "typeCell", target: "C3", value: "2026-02-28" },
          },
        ],
      },
      {
        chapter_id: "chapter-3",
        chapter_title: "التحقق قبل الإرسال",
        steps: [
          {
            type: "info",
            instruction:
              "قائمة التحقق قبل الإرسال: ١) كل الحقول ممتلئة ٢) الأسماء مكتوبة بشكل صحيح ٣) الأرقام بدون أخطاء ٤) التواريخ بالتنسيق المطلوب ٥) لا توجد خلايا فارغة.",
          },
          {
            type: "task",
            instruction: "اكتب رأس العمود في B2: رقم الهاتف",
            action: { kind: "typeCell", target: "B2", value: "رقم الهاتف" },
          },
          {
            type: "task",
            instruction: "اكتب رأس العمود في C2: تاريخ التسجيل",
            action: { kind: "typeCell", target: "C2", value: "تاريخ التسجيل" },
          },
          {
            type: "info",
            instruction:
              "أحسنت! التحقق قبل الإرسال هو الفرق بين العمل الاحترافي والعمل العادي. هذه العادة ستجعلك موظفاً موثوقاً يعتمد عليه العملاء.",
          },
        ],
      },
    ],
  },
];
