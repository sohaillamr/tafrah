export const unit2Content = [
  {
    unit_id: "UNIT_02",
    title: "إتقان جداول البيانات",
    focus: "Accuracy, Cell Management, and Data Types",
    chapters: [
      {
        chapter_id: "chapter-1",
        chapter_title: "تشريح الجدول",
        steps: [
          {
            type: "info",
            instruction:
              "الجدول يتكون من أعمدة (حروف مثل A) وصفوف (أرقام مثل 1). تقاطعهم يسمى خلية. كل خلية لها عنوان فريد مثل C3، وهذا العنوان هو ما يجعل العمل منظمًا ودقيقًا.",
          },
          {
            type: "task",
            instruction:
              "اضغط على الخلية C3. ستلاحظ أن العمود C والصف 3 تلوّنا بالأزرق لتسهيل التتبع.",
            action: { kind: "clickCell", target: "C3" },
          },
          {
            type: "task",
            instruction: "اكتب كلمة (طفرة) داخل الخلية B2 ثم اضغط Enter.",
            action: { kind: "typeCell", target: "B2", value: "طفرة" },
          },
        ],
      },
      {
        chapter_id: "chapter-2",
        chapter_title: "أنواع البيانات",
        steps: [
          {
            type: "info",
            instruction:
              "الحاسوب يعامل الأرقام بشكل مختلف عن النصوص. الرقم يستخدم في الحسابات، والنص يستخدم للأسماء. خلط النوعين يؤدي لأخطاء في النتائج والتقارير.",
          },
          {
            type: "task",
            instruction: "في الخلية A1 اكتب (١٠٠). في الخلية A2 اكتب (أحمد).",
            action: { kind: "typeCell", target: "A1", value: "١٠٠" },
            extraAction: { kind: "typeCell", target: "A2", value: "أحمد" },
          },
          {
            type: "task",
            instruction: "اضغط على الخلية A3 وغير نوع البيانات إلى (التاريخ - Date).",
            action: { kind: "setFormat", target: "A3", value: "date" },
          },
        ],
      },
      {
        chapter_id: "chapter-3",
        chapter_title: "التنسيق من أجل الوضوح",
        steps: [
          {
            type: "info",
            instruction:
              "تلوين رأس الجدول يساعد العين على معرفة أماكن البيانات. هذا يقلل الأخطاء ويزيد سرعة المراجعة.",
          },
          {
            type: "task",
            instruction:
              "حدد الصف رقم 1 بالكامل، ثم اجعل لون الخلفية (أزرق فاتح) ولون الخط (أبيض).",
            action: { kind: "styleRow", target: "Row_1", value: "header" },
          },
          {
            type: "task",
            instruction:
              "أضف حدوداً (Borders) للخلايا من A1 إلى D10 لتفصل بين البيانات.",
            action: { kind: "addBorders", target: "A1:D10" },
          },
        ],
      },
      {
        chapter_id: "chapter-4",
        chapter_title: "الفرز والفلترة",
        steps: [
          {
            type: "info",
            instruction:
              "الفلترة تسمح لك برؤية بيانات محددة فقط وإخفاء الباقي مؤقتاً، وهذا يجعل العمل على القوائم الكبيرة أسرع وأسهل.",
          },
          {
            type: "task",
            instruction:
              "أمامك جدول به أسماء. استخدم زر (Filter) لإظهار الأسماء التي تبدأ بحرف (م) فقط.",
            action: { kind: "filterNames", target: "A2:A10", value: "م" },
          },
          {
            type: "task",
            instruction:
              "قم بترتيب الأرقام في العمود B من الأصغر إلى الأكبر (Sort A-Z).",
            action: { kind: "sortNumbers", target: "B2:B10", value: "asc" },
          },
        ],
      },
    ],
    challenge: {
      title: "تحدي الدقة",
      description:
        "أمامك جدول يحتوي على ٥ أخطاء متعمدة (اسم في خانة السعر، أو تاريخ بتنسيق خاطئ). المطلوب تصحيح الأخطاء وتنسيق الجدول ليصبح احترافياً.",
      successMessage:
        "أنت الآن تمتلك مهارة التدقيق التقني، وهي مهارة تطلبها شركات مثل (راية) و(أمازون).",
    },
  },
];
