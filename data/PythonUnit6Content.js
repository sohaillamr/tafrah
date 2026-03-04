export const pythonUnit6Content = [
  {
    unit_id: "PY_UNIT_06",
    title: "الدوال (Functions)",
    focus: "Defining Functions, Parameters, Return Values, and Built-in Functions",
    chapters: [
      {
        chapter_id: "py-ch-6-1",
        chapter_title: "١. تعريف الدوال",
        steps: [
          {
            type: "info",
            instruction:
              "الدالة (Function) هي مجموعة أوامر مغلفة باسم واحد. تُعرّف بكلمة def ثم اسم الدالة ثم أقواس ونقطتين. الهدف: كتابة الكود مرة واحدة واستخدامه عدة مرات.",
          },
          {
            type: "task",
            instruction: "عرّف دالة تطبع تحية ثم نادها:\ndef greet():\n    print('مرحباً بك!')\n\ngreet()",
            action: { kind: "writeCode", expected: "def greet():\n    print('مرحباً بك!')\n\ngreet()" },
          },
          {
            type: "info",
            instruction:
              "لاحظ: تعريف الدالة لا ينفذها. الدالة تُنفذ فقط عندما تناديها باسمها متبوعاً بأقواس (). هذا يعني أنك تستطيع تعريف الدالة في الأعلى واستخدامها لاحقاً.",
          },
        ],
      },
      {
        chapter_id: "py-ch-6-2",
        chapter_title: "٢. المعاملات (Parameters)",
        steps: [
          {
            type: "info",
            instruction:
              "المعاملات هي قيم تمررها للدالة عند مناداتها. تُكتب داخل الأقواس. مثال: def greet(name): ثم تنادي greet('أحمد'). القيمة 'أحمد' ستُخزن في المتغير name داخل الدالة.",
          },
          {
            type: "task",
            instruction: "عرّف دالة تأخذ اسماً وتطبع تحية:\ndef greet(name):\n    print('مرحباً يا ' + name)\n\ngreet('سارة')",
            action: { kind: "writeCode", expected: "def greet(name):\n    print('مرحباً يا ' + name)\n\ngreet('سارة')" },
          },
          {
            type: "task",
            instruction: "عرّف دالة تأخذ رقمين وتطبع مجموعهما:\ndef add(a, b):\n    print(a + b)\n\nadd(10, 20)",
            action: { kind: "writeCode", expected: "def add(a, b):\n    print(a + b)\n\nadd(10, 20)" },
          },
          {
            type: "info",
            instruction:
              "يمكنك تمرير أي عدد من المعاملات. فقط افصل بينها بفواصل. ترتيب القيم عند المناداة يجب أن يطابق ترتيب المعاملات في التعريف.",
          },
        ],
      },
      {
        chapter_id: "py-ch-6-3",
        chapter_title: "٣. القيمة المُرجعة (return)",
        steps: [
          {
            type: "info",
            instruction:
              "كلمة return تُرجع قيمة من الدالة بدل طباعتها. هذا يسمح لك بحفظ النتيجة في متغير واستخدامها لاحقاً. مثال: def double(x): return x * 2 ثم result = double(5).",
          },
          {
            type: "task",
            instruction: "عرّف دالة تُرجع مربع الرقم:\ndef square(x):\n    return x * x\n\nresult = square(4)\nprint(result)",
            action: { kind: "writeCode", expected: "def square(x):\n    return x * x\n\nresult = square(4)\nprint(result)" },
          },
          {
            type: "info",
            instruction:
              "الفرق بين print و return: الدالة التي تستخدم print تعرض النتيجة فقط. الدالة التي تستخدم return تُرجع النتيجة ليستخدمها باقي البرنامج. الأفضل استخدام return في أغلب الحالات.",
          },
          {
            type: "task",
            instruction: "عرّف دالة تحسب مجموع رقمين وتُرجع النتيجة:\ndef add(a, b):\n    return a + b\n\nprint(add(15, 25))",
            action: { kind: "writeCode", expected: "def add(a, b):\n    return a + b\n\nprint(add(15, 25))" },
          },
        ],
      },
    ],
  },
];
