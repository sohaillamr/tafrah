export const unit5Content = [
  {
    unit_id: "UNIT_05",
    title: "دقة الإنتاج وسرعة التنفيذ",
    focus: "Production Accuracy, Safe Speed, and Error Reduction",
    chapters: [
      {
        chapter_id: "chapter-1",
        chapter_title: "قواعد السرعة الآمنة",
        steps: [
          {
            type: "info",
            instruction:
              "القاعدة الذهبية: الدقة أولاً، ثم السرعة. لا تحاول أن تكون سريعاً قبل أن تكون دقيقاً. ابدأ ببطء وتأكد من صحة كل إدخال، ثم زِد سرعتك تدريجياً مع الممارسة.",
          },
          {
            type: "task",
            instruction: "أدخل الاسم التالي بدقة في الخلية A2: محمد أحمد إبراهيم",
            action: { kind: "typeCell", target: "A2", value: "محمد أحمد إبراهيم" },
          },
          {
            type: "info",
            instruction:
              "نصيحة: بعد إدخال كل ٥ صفوف، توقف وراجع ما كتبته. هذه المراجعة القصيرة توفر وقتاً كبيراً لأنها تكتشف الأخطاء مبكراً قبل أن تتراكم.",
          },
          {
            type: "task",
            instruction: "أدخل رقم الهاتف في الخلية B2 بدقة: 01012345678",
            action: { kind: "typeCell", target: "B2", value: "01012345678" },
          },
        ],
      },
      {
        chapter_id: "chapter-2",
        chapter_title: "تتبع الأخطاء",
        steps: [
          {
            type: "info",
            instruction:
              "تتبع الأخطاء يعني تسجيل كل خطأ تجده أثناء المراجعة: نوع الخطأ، مكانه، وسببه. هذا يساعدك على اكتشاف الأنماط المتكررة وتجنبها في المستقبل.",
          },
          {
            type: "task",
            instruction: "سجّل خطأ في الخلية A4. اكتب: خطأ إملائي - الخلية C3",
            action: { kind: "typeCell", target: "A4", value: "خطأ إملائي - الخلية C3" },
          },
          {
            type: "task",
            instruction: "سجّل سبب الخطأ في الخلية B4. اكتب: سرعة الكتابة",
            action: { kind: "typeCell", target: "B4", value: "سرعة الكتابة" },
          },
          {
            type: "info",
            instruction:
              "عند تتبع الأخطاء لمدة أسبوع، ستلاحظ أن معظم أخطائك من نوع واحد (مثل الأرقام المتشابهة أو الحروف المتقاربة). ركّز على هذا النوع تحديداً لتحسين أدائك.",
          },
        ],
      },
      {
        chapter_id: "chapter-3",
        chapter_title: "تحسين النتيجة",
        steps: [
          {
            type: "info",
            instruction:
              "المراجعة الذاتية هي مهارة المحترفين. قبل تسليم أي عمل: ١) راجع كل صف ٢) تحقق من تطابق الأرقام ٣) تأكد من عدم وجود خلايا فارغة ٤) قارن مع المصدر الأصلي.",
          },
          {
            type: "task",
            instruction: "أدخل الاسم في الخلية A6 بدقة: فاطمة حسن علي",
            action: { kind: "typeCell", target: "A6", value: "فاطمة حسن علي" },
          },
          {
            type: "task",
            instruction: "أدخل المبلغ في الخلية B6 بدقة: ١٥٧٥٠",
            action: { kind: "typeCell", target: "B6", value: "١٥٧٥٠" },
          },
          {
            type: "info",
            instruction:
              "مبروك! تحسين النتيجة يأتي بالممارسة. كل يوم ستصبح أسرع وأدق. تذكر: الشركات تبحث عن الدقة أولاً. إذا كنت دقيقاً، ستأتي السرعة تلقائياً.",
          },
        ],
      },
    ],
  },
];
