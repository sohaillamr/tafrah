export const pythonUnit4Content = [
  {
    unit_id: "PY_UNIT_04",
    title: "الشروط واتخاذ القرارات",
    focus: "Conditional Statements, if/elif/else, and Decision Making",
    chapters: [
      {
        chapter_id: "py-ch-4-1",
        chapter_title: "١. جملة if الشرطية",
        steps: [
          {
            type: "info",
            instruction:
              "جملة if تسمح للبرنامج باتخاذ قرارات. إذا كان الشرط صحيحاً (True) يُنفذ الكود بداخلها. الكود الداخلي يجب أن يكون بمسافة بادئة (4 مسافات). مثال: if age >= 18: ثم في السطر التالي بمسافة print('بالغ').",
          },
          {
            type: "task",
            instruction: "اكتب شرطاً يتحقق إذا كان العمر أكبر من أو يساوي 18:\nage = 20\nif age >= 18:\n    print('بالغ')",
            action: { kind: "writeCode", expected: "age = 20\nif age >= 18:\n    print('بالغ')" },
          },
          {
            type: "info",
            instruction:
              "المسافة البادئة (indentation) مهمة جداً في بايثون. الكود بعد if يجب أن يبدأ بـ 4 مسافات. بدون المسافة سيظهر خطأ IndentationError.",
          },
        ],
      },
      {
        chapter_id: "py-ch-4-2",
        chapter_title: "٢. جملة else",
        steps: [
          {
            type: "info",
            instruction:
              "else تُنفذ عندما يكون شرط if غير صحيح (False). مثال: إذا كان العمر أقل من 18، اطبع 'قاصر'. هذا يعطي البرنامج مسارين: واحد إذا الشرط صح، وآخر إذا خطأ.",
          },
          {
            type: "task",
            instruction: "اكتب شرطاً مع else:\nage = 15\nif age >= 18:\n    print('بالغ')\nelse:\n    print('قاصر')",
            action: { kind: "writeCode", expected: "age = 15\nif age >= 18:\n    print('بالغ')\nelse:\n    print('قاصر')" },
          },
          {
            type: "info",
            instruction:
              "لاحظ أن else لا تحتاج شرطاً خاصاً بها. هي تعني (وإلا = في أي حالة أخرى). وتنتهي بنقطتين : مثل if تماماً.",
          },
        ],
      },
      {
        chapter_id: "py-ch-4-3",
        chapter_title: "٣. جملة elif (شروط متعددة)",
        steps: [
          {
            type: "info",
            instruction:
              "elif (اختصار else if) تضيف شروطاً إضافية بين if و else. تستخدم عندما يكون لديك أكثر من حالتين. مثال: إذا الدرجة ممتاز، أو جيد، أو ضعيف.",
          },
          {
            type: "task",
            instruction: "اكتب شروطاً متعددة لتصنيف الدرجة:\nscore = 85\nif score >= 90:\n    print('ممتاز')\nelif score >= 70:\n    print('جيد')\nelse:\n    print('يحتاج تحسين')",
            action: { kind: "writeCode", expected: "score = 85\nif score >= 90:\n    print('ممتاز')\nelif score >= 70:\n    print('جيد')\nelse:\n    print('يحتاج تحسين')" },
          },
          {
            type: "info",
            instruction:
              "يمكنك استخدام أكثر من elif واحدة. الترتيب مهم: بايثون تتحقق من الشروط بالترتيب وتنفذ أول شرط صحيح فقط ثم تتخطى الباقي.",
          },
          {
            type: "task",
            instruction: "اكتب شرطاً يتحقق من درجة الحرارة:\ntemp = 35\nif temp > 40:\n    print('حار جداً')\nelif temp > 25:\n    print('دافئ')\nelse:\n    print('بارد')",
            action: { kind: "writeCode", expected: "temp = 35\nif temp > 40:\n    print('حار جداً')\nelif temp > 25:\n    print('دافئ')\nelse:\n    print('بارد')" },
          },
        ],
      },
    ],
  },
];
