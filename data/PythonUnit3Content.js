export const pythonUnit3Content = [
  {
    unit_id: "PY_UNIT_03",
    title: "العمليات الحسابية والمقارنات",
    focus: "Arithmetic Operations, Comparisons, and Expressions",
    chapters: [
      {
        chapter_id: "py-ch-3-1",
        chapter_title: "١. العمليات الحسابية الأساسية",
        steps: [
          {
            type: "info",
            instruction:
              "بايثون تدعم العمليات الحسابية الأساسية: الجمع (+)، الطرح (-)، الضرب (*)، والقسمة (/). يمكنك استخدامها مباشرة مع الأرقام أو المتغيرات.",
          },
          {
            type: "task",
            instruction: "اكتب كوداً لحساب مجموع 15 + 30 واطبع النتيجة:\nresult = 15 + 30\nprint(result)",
            action: { kind: "writeCode", expected: "result = 15 + 30\nprint(result)" },
          },
          {
            type: "task",
            instruction: "احسب ناتج ضرب 7 في 8 واطبع النتيجة:\nresult = 7 * 8\nprint(result)",
            action: { kind: "writeCode", expected: "result = 7 * 8\nprint(result)" },
          },
          {
            type: "info",
            instruction:
              "القسمة / تُعطي دائماً عدداً عشرياً (مثل 10 / 3 = 3.333). إذا أردت قسمة صحيحة بدون كسور استخدم // (مثل 10 // 3 = 3). وباقي القسمة يُحسب بـ % (مثل 10 % 3 = 1).",
          },
        ],
      },
      {
        chapter_id: "py-ch-3-2",
        chapter_title: "٢. الأولويات والأقواس",
        steps: [
          {
            type: "info",
            instruction:
              "مثل الرياضيات، الضرب والقسمة يُنفذان قبل الجمع والطرح. لتغيير الترتيب استخدم الأقواس (). مثال: (2 + 3) * 4 = 20 لكن 2 + 3 * 4 = 14.",
          },
          {
            type: "task",
            instruction: "احسب (10 + 5) * 2 واطبع النتيجة:\nresult = (10 + 5) * 2\nprint(result)",
            action: { kind: "writeCode", expected: "result = (10 + 5) * 2\nprint(result)" },
          },
          {
            type: "info",
            instruction:
              "نصيحة: استخدم الأقواس دائماً عندما تكون غير متأكد من أولوية العمليات. الأقواس تجعل الكود أوضح وتمنع الأخطاء الحسابية.",
          },
          {
            type: "task",
            instruction: "احسب سعر 3 منتجات بسعر 45.5 للواحد واطبع المجموع:\ntotal = 3 * 45.5\nprint(total)",
            action: { kind: "writeCode", expected: "total = 3 * 45.5\nprint(total)" },
          },
        ],
      },
      {
        chapter_id: "py-ch-3-3",
        chapter_title: "٣. عمليات المقارنة",
        steps: [
          {
            type: "info",
            instruction:
              "عمليات المقارنة تقارن بين قيمتين وتُرجع True (صح) أو False (خطأ). العمليات: == (يساوي)، != (لا يساوي)، > (أكبر من)، < (أصغر من)، >= (أكبر من أو يساوي)، <= (أصغر من أو يساوي).",
          },
          {
            type: "task",
            instruction: "قارن بين رقمين واطبع النتيجة:\nprint(10 > 5)\nprint(3 == 3)",
            action: { kind: "writeCode", expected: "print(10 > 5)\nprint(3 == 3)" },
          },
          {
            type: "info",
            instruction:
              "مهم جداً: علامة = الواحدة تعني (ضع القيمة في المتغير)، وعلامة == المزدوجة تعني (هل القيمتان متساويتان؟). هذا أكثر خطأ شائع عند المبتدئين.",
          },
          {
            type: "task",
            instruction: "قارن بين متغيرين واطبع هل هما متساويان:\nx = 10\ny = 20\nprint(x == y)",
            action: { kind: "writeCode", expected: "x = 10\ny = 20\nprint(x == y)" },
          },
        ],
      },
    ],
  },
];
