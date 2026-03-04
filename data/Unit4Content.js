export const unit4Content = [
  {
    unit_id: "UNIT_04",
    title: "إدارة البريد والملفات",
    focus: "Email Management, Attachments, and File Delivery",
    chapters: [
      {
        chapter_id: "chapter-1",
        chapter_title: "تحميل الملفات بأمان",
        steps: [
          {
            type: "info",
            instruction:
              "عند استلام ملف من العميل أو المشرف، تأكد من امتداد الملف قبل فتحه. الامتدادات الآمنة تشمل: .xlsx و .csv و .pdf. تجنب فتح ملفات بامتدادات غريبة مثل .exe أو .bat.",
          },
          {
            type: "task",
            instruction: "سجّل اسم الملف المستلم في الخلية A2. اكتب: تقرير_المبيعات.xlsx",
            action: { kind: "typeCell", target: "A2", value: "تقرير_المبيعات.xlsx" },
          },
          {
            type: "info",
            instruction:
              "بعد التحميل، انقل الملف فوراً إلى المجلد المخصص للمشروع. لا تترك الملفات في مجلد التنزيلات لأنها ستضيع بين الملفات الأخرى.",
          },
          {
            type: "task",
            instruction: "سجّل مسار الحفظ في الخلية B2. اكتب: تاسكات طفرة 2026/تقارير",
            action: { kind: "typeCell", target: "B2", value: "تاسكات طفرة 2026/تقارير" },
          },
        ],
      },
      {
        chapter_id: "chapter-2",
        chapter_title: "تنظيم المرفقات",
        steps: [
          {
            type: "info",
            instruction:
              "عند إرسال أو استلام مرفقات، استخدم أسماء واضحة ومنظمة. القاعدة: اسم_المهمة_التاريخ.xlsx. مثال: بيانات_العملاء_2026-02-28.xlsx. هذا يسهل البحث والمتابعة.",
          },
          {
            type: "task",
            instruction: "في الخلية A3، اكتب اسم الملف بالتنسيق الصحيح: بيانات_العملاء_2026-02-28.xlsx",
            action: { kind: "typeCell", target: "A3", value: "بيانات_العملاء_2026-02-28.xlsx" },
          },
          {
            type: "info",
            instruction:
              "نظّم المرفقات في مجلدات فرعية حسب النوع: تقارير، بيانات خام، نتائج نهائية. هذا يساعد المشرف على مراجعة عملك بسرعة.",
          },
          {
            type: "task",
            instruction: "في الخلية B3، اكتب اسم المجلد الفرعي المناسب: بيانات خام",
            action: { kind: "typeCell", target: "B3", value: "بيانات خام" },
          },
        ],
      },
      {
        chapter_id: "chapter-3",
        chapter_title: "إرسال المهام المكتملة",
        steps: [
          {
            type: "info",
            instruction:
              "عند إرسال مهمة مكتملة بالبريد، اكتب عنوان واضح يحتوي على: اسم المهمة + الحالة. مثال: 'مكتمل - إدخال بيانات العملاء - فبراير 2026'. هذا يساعد المستلم على فهم المحتوى فوراً.",
          },
          {
            type: "task",
            instruction: "في الخلية A5، اكتب عنوان البريد: مكتمل - إدخال بيانات العملاء",
            action: { kind: "typeCell", target: "A5", value: "مكتمل - إدخال بيانات العملاء" },
          },
          {
            type: "info",
            instruction:
              "قبل الضغط على إرسال، تحقق من: ١) المرفق موجود ٢) اسم المستلم صحيح ٣) العنوان واضح ٤) لا توجد أخطاء إملائية. هذه القائمة تمنع أخطاء التسليم.",
          },
          {
            type: "task",
            instruction: "في الخلية A6، اكتب حالة التحقق: تم التحقق - جاهز للإرسال",
            action: { kind: "typeCell", target: "A6", value: "تم التحقق - جاهز للإرسال" },
          },
        ],
      },
    ],
  },
];
