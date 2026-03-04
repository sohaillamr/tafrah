export const pythonUnit7Content = [
  {
    unit_id: "PY_UNIT_07",
    title: "مشروع نهائي: برنامج متكامل",
    focus: "Final Project: Building a Complete Program with All Concepts",
    chapters: [
      {
        chapter_id: "py-ch-7-1",
        chapter_title: "١. التخطيط وإعداد البرنامج",
        steps: [
          {
            type: "info",
            instruction:
              "المشروع النهائي يجمع كل ما تعلمته: المتغيرات، العمليات، الشروط، الحلقات، والدوال. ستبني برنامج حاسبة درجات الطلاب. ابدأ دائماً بالتخطيط قبل كتابة الكود.",
          },
          {
            type: "task",
            instruction: "ابدأ بكتابة تعليق يوضح هدف البرنامج:\n# برنامج حاسبة درجات الطلاب\n# يحسب المعدل ويحدد التقدير\nprint('حاسبة الدرجات')",
            action: { kind: "writeCode", expected: "# برنامج حاسبة درجات الطلاب\n# يحسب المعدل ويحدد التقدير\nprint('حاسبة الدرجات')" },
          },
          {
            type: "info",
            instruction:
              "التخطيط الجيد يوفر الوقت. فكّر أولاً: ما المدخلات؟ (درجات الطلاب). ما العمليات؟ (حساب المعدل). ما المخرجات؟ (التقدير). هذا النمط يسمى IPO: Input → Process → Output.",
          },
        ],
      },
      {
        chapter_id: "py-ch-7-2",
        chapter_title: "٢. بناء الدوال الأساسية",
        steps: [
          {
            type: "task",
            instruction: "عرّف دالة لحساب المعدل:\ndef calculate_average(scores):\n    total = 0\n    for score in scores:\n        total += score\n    return total / len(scores)",
            action: { kind: "writeCode", expected: "def calculate_average(scores):\n    total = 0\n    for score in scores:\n        total += score\n    return total / len(scores)" },
          },
          {
            type: "task",
            instruction: "عرّف دالة لتحديد التقدير بناءً على المعدل:\ndef get_grade(average):\n    if average >= 90:\n        return 'ممتاز'\n    elif average >= 75:\n        return 'جيد جداً'\n    elif average >= 60:\n        return 'جيد'\n    else:\n        return 'يحتاج تحسين'",
            action: { kind: "writeCode", expected: "def get_grade(average):\n    if average >= 90:\n        return 'ممتاز'\n    elif average >= 75:\n        return 'جيد جداً'\n    elif average >= 60:\n        return 'جيد'\n    else:\n        return 'يحتاج تحسين'" },
          },
          {
            type: "info",
            instruction:
              "ممتاز! لقد كتبت دالتين: واحدة تحسب المعدل والأخرى تحدد التقدير. كل دالة تؤدي مهمة واحدة محددة. هذا التنظيم يجعل الكود سهل الفهم والصيانة.",
          },
        ],
      },
      {
        chapter_id: "py-ch-7-3",
        chapter_title: "٣. تشغيل البرنامج الكامل",
        steps: [
          {
            type: "task",
            instruction: "اكتب الكود الذي يستخدم الدوال لحساب وطباعة النتيجة:\nscores = [85, 90, 78, 92, 88]\naverage = calculate_average(scores)\ngrade = get_grade(average)\nprint('المعدل: ' + str(average))\nprint('التقدير: ' + grade)",
            action: { kind: "writeCode", expected: "scores = [85, 90, 78, 92, 88]\naverage = calculate_average(scores)\ngrade = get_grade(average)\nprint('المعدل: ' + str(average))\nprint('التقدير: ' + grade)" },
          },
          {
            type: "info",
            instruction:
              "تهانينا! لقد أكملت المشروع النهائي وبنيت برنامجاً متكاملاً يستخدم كل المفاهيم: المتغيرات، القوائم، الحلقات، الشروط، والدوال. أنت الآن تمتلك أساسيات البرمجة بلغة بايثون وجاهز للمستوى التالي!",
          },
          {
            type: "task",
            instruction: "اكتب تعليقاً ختامياً وطباعة رسالة إنهاء:\n# تم إنهاء البرنامج بنجاح\nprint('شكراً لاستخدام حاسبة الدرجات!')",
            action: { kind: "writeCode", expected: "# تم إنهاء البرنامج بنجاح\nprint('شكراً لاستخدام حاسبة الدرجات!')" },
          },
        ],
      },
    ],
  },
];
