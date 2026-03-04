export const pythonUnit2Content = [
  {
    unit_id: "PY_UNIT_02",
    title: "المتغيرات وأنواع البيانات",
    focus: "Variables, Data Types, and Type Conversion",
    chapters: [
      {
        chapter_id: "py-ch-2-1",
        chapter_title: "١. ما هي المتغيرات؟",
        steps: [
          {
            type: "info",
            instruction:
              "المتغير هو صندوق يحفظ فيه الحاسوب قيمة. تعطيه اسماً وتضع فيه بيانات. مثال: name = 'أحمد' يعني أنشأنا صندوقاً اسمه name ووضعنا فيه كلمة أحمد.",
          },
          {
            type: "task",
            instruction: "أنشئ متغيراً اسمه name وضع فيه اسمك ثم اطبعه:\nname = 'أحمد'\nprint(name)",
            action: { kind: "writeCode", expected: "name = 'أحمد'\nprint(name)" },
          },
          {
            type: "info",
            instruction:
              "لاحظ أننا لم نضع name بين علامتي تنصيص عند الطباعة. لأننا نريد طباعة محتوى المتغير وليس كلمة name نفسها. هذا فرق مهم جداً.",
          },
          {
            type: "task",
            instruction: "أنشئ متغيراً اسمه city وضع فيه (القاهرة) ثم اطبعه:\ncity = 'القاهرة'\nprint(city)",
            action: { kind: "writeCode", expected: "city = 'القاهرة'\nprint(city)" },
          },
        ],
      },
      {
        chapter_id: "py-ch-2-2",
        chapter_title: "٢. الأرقام",
        steps: [
          {
            type: "info",
            instruction:
              "في بايثون، الأرقام الصحيحة تُسمى int (مثل 5 أو 100) والأرقام العشرية تُسمى float (مثل 3.14 أو 99.9). الأرقام لا تحتاج علامات تنصيص.",
          },
          {
            type: "task",
            instruction: "أنشئ متغيراً اسمه age وضع فيه رقم 25 ثم اطبعه:\nage = 25\nprint(age)",
            action: { kind: "writeCode", expected: "age = 25\nprint(age)" },
          },
          {
            type: "task",
            instruction: "أنشئ متغيراً اسمه price وضع فيه 19.99 ثم اطبعه:\nprice = 19.99\nprint(price)",
            action: { kind: "writeCode", expected: "price = 19.99\nprint(price)" },
          },
          {
            type: "info",
            instruction:
              "تذكّر: الرقم 25 بدون تنصيص هو عدد صحيح (int). لكن '25' بتنصيص هو نص (string) ولا يمكن استخدامه في العمليات الحسابية مباشرة.",
          },
        ],
      },
      {
        chapter_id: "py-ch-2-3",
        chapter_title: "٣. النصوص (Strings)",
        steps: [
          {
            type: "info",
            instruction:
              "النص في بايثون يُسمى String ويُكتب بين علامتي تنصيص. يمكنك دمج نصين معاً باستخدام علامة +. مثال: 'مرحباً' + ' يا ' + 'أحمد' ينتج 'مرحباً يا أحمد'.",
          },
          {
            type: "task",
            instruction: "ادمج نصين واطبع النتيجة:\ngreeting = 'مرحباً يا ' + 'طفرة'\nprint(greeting)",
            action: { kind: "writeCode", expected: "greeting = 'مرحباً يا ' + 'طفرة'\nprint(greeting)" },
          },
          {
            type: "info",
            instruction:
              "يمكنك معرفة طول النص باستخدام دالة len(). مثال: len('بايثون') تُرجع 6 لأن الكلمة تتكون من ٦ أحرف. هذه الدالة مفيدة جداً للتحقق من البيانات.",
          },
          {
            type: "task",
            instruction: "اطبع طول كلمة (بايثون):\nprint(len('بايثون'))",
            action: { kind: "writeCode", expected: "print(len('بايثون'))" },
          },
        ],
      },
      {
        chapter_id: "py-ch-2-4",
        chapter_title: "٤. التحويل بين الأنواع",
        steps: [
          {
            type: "info",
            instruction:
              "أحياناً تحتاج تحويل نوع البيانات. مثلاً: str(25) يحول الرقم إلى نص، و int('10') يحول النص إلى رقم. هذا مفيد عند دمج أرقام مع نصوص.",
          },
          {
            type: "task",
            instruction: "حوّل رقم العمر إلى نص وادمجه مع جملة:\nage = 25\nprint('عمري ' + str(age) + ' سنة')",
            action: { kind: "writeCode", expected: "age = 25\nprint('عمري ' + str(age) + ' سنة')" },
          },
          {
            type: "info",
            instruction:
              "دالة type() تخبرك بنوع أي قيمة. مثال: type(5) تُرجع int و type('مرحباً') تُرجع str. استخدمها عندما تشك في نوع البيانات.",
          },
        ],
      },
    ],
  },
];
