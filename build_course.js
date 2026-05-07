const fs = require('fs');

const pythonUnits = [
  {
    id: 1,
    title: "أساسيات بايثون العملية",
    focus: "تأسيس البرمجة وعرض المخرجات",
    chapters: [
      {
        chapter_id: "py-ch-1-1",
        chapter_title: "1. أول برنامج لك",
        steps: [
          {
            type: "info",
            instruction: "مرحباً بك في عالم بايثون! أول أمر نتعلمه هو `print()` والذي يقوم بعرض النصوص والأرقام على الشاشة."
          },
          {
            type: "task",
            instruction: "جرب الآن كتابة الكود التالي لطباعة رسالة ترحيبية:\nprint(\"مرحباً طفرة\")",
            action: { kind: "writeCode", expected: "print(\"مرحباً طفرة\")" }
          }
        ]
      },
      {
        chapter_id: "py-ch-1-2",
        chapter_title: "2. المتغيرات",
        steps: [
          {
            type: "info",
            instruction: "المتغير هو مثل الصندوق الذي يحفظ البيانات. نقوم بتسمية الصندوق ونضع فيه القيمة لتذكرها لاحقاً."
          },
          {
            type: "task",
            instruction: "أبقِ الكود بسيطاً. قم بإنشاء متغير اسمه `name` يحمل اسمك، ثم اطبعه:\nname = \"أحمد\"\nprint(name)",
            action: { kind: "writeCode", expected: "name = \"أحمد\"\nprint(name)" }
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "العمليات الحسابية",
    focus: "المتغيرات الرقمية والعمليات الحسابية",
    chapters: [
      {
        chapter_id: "py-ch-2-1",
        chapter_title: "1. الأرقام",
        steps: [
          {
            type: "info",
            instruction: "في بايثون، يمكنك حفظ الأرقام في المتغيرات بدون علامات تنصيص لتتمكن من جمعها أو طرحها."
          },
          {
            type: "task",
            instruction: "قم بإنشاء متغير `age` واطبعه:\nage = 25\nprint(age)",
            action: { kind: "writeCode", expected: "age = 25\nprint(age)" }
          }
        ]
      },
      {
        chapter_id: "py-ch-2-2",
        chapter_title: "2. الجمع والطرح",
        steps: [
          {
            type: "info",
            instruction: "يمكنك استخدام الرموز الرياضية المعتادة مثل `+` للجمع و `-` للطرح."
          },
          {
            type: "task",
            instruction: "قم بوضع حاصل جمع 50 و 30 في متغير واعرض الناتج:\ntotal = 50 + 30\nprint(total)",
            action: { kind: "writeCode", expected: "total = 50 + 30\nprint(total)" }
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "التعامل مع النصوص بالتفصيل",
    focus: "دمج النصوص (Strings) ومعالجتها",
    chapters: [
      {
        chapter_id: "py-ch-3-1",
        chapter_title: "1. دمج النصوص",
        steps: [
          {
            type: "info",
            instruction: "يمكننا دمج كلمتين معاً باستخدام رمز الزائد `+`."
          },
          {
            type: "task",
            instruction: "قم بدمج اسمين مع مسافة بينهما:\nfirst = \"طفرة\"\nlast = \"بلاس\"\nprint(first + \" \" + last)",
            action: { kind: "writeCode", expected: "first = \"طفرة\"\nlast = \"بلاس\"\nprint(first + \" \" + last)" }
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "الشروط والقرارات",
    focus: "توجيه مسار البرنامج باستخدام if و else",
    chapters: [
      {
        chapter_id: "py-ch-4-1",
        chapter_title: "1. الجملة الشرطية if",
        steps: [
          {
            type: "info",
            instruction: "جملة `if` تسمح لنا بتنفيذ الكود فقط إذا كان الشرط صحيحاً. تذكر أن تضيف مسافة قبل الكود الداخلي."
          },
          {
            type: "task",
            instruction: "اكتب شرطاً للتحقق من العمر:\nage = 20\nif age > 18:\n    print(\"بالغ\")",
            action: { kind: "writeCode", expected: "age = 20\nif age > 18:\n    print(\"بالغ\")" }
          }
        ]
      },
      {
        chapter_id: "py-ch-4-2",
        chapter_title: "2. الجملة الشرطية else",
        steps: [
          {
            type: "info",
            instruction: "نستخدم `else` كبديل عند عدم تحقق الشرط الأساسي. (في حال كان العمر أصغر من 18)"
          },
          {
            type: "task",
            instruction: "قم بإكمال مسار القرار لتشمل القاصر:\nage = 15\nif age > 18:\n    print(\"بالغ\")\nelse:\n    print(\"قاصر\")",
            action: { kind: "writeCode", expected: "age = 15\nif age > 18:\n    print(\"بالغ\")\nelse:\n    print(\"قاصر\")" }
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "القوائم (Lists)",
    focus: "حفظ عدة عناصر في متغير واحد",
    chapters: [
      {
        chapter_id: "py-ch-5-1",
        chapter_title: "1. إنشاء قائمة",
        steps: [
          {
            type: "info",
            instruction: "للاحتفاظ بقائمة من الأسماء أو الأرقام، نستخدم الأقواس المربعة `[]`."
          },
          {
            type: "task",
            instruction: "مطلوب منك إنشاء قائمة لأسماء الموظفين وطباعتها:\nemp = [\"أحمد\", \"سارة\", \"علي\"]\nprint(emp)",
            action: { kind: "writeCode", expected: "emp = [\"أحمد\", \"سارة\", \"علي\"]\nprint(emp)" }
          },
          {
            type: "task",
            instruction: "يمكننا طباعة عنصر محدد بإعطاء رقم ترتيبه (حيث يبدأ العد من الصفر):\nprint(emp[1])",
            action: { kind: "writeCode", expected: "emp = [\"أحمد\", \"سارة\", \"علي\"]\nprint(emp[1])" }
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "التكرار والحلقات (Loops)",
    focus: "المرور على القوائم بأتمتة المهام",
    chapters: [
      {
        chapter_id: "py-ch-6-1",
        chapter_title: "1. استخدام for loop",
        steps: [
          {
            type: "info",
            instruction: "التكرار مفيد جداً عندما تريد إعطاء أوامر لمجموعة كبيرة من البيانات دفعة واحدة، مثل المرور على الأسماء في قائمة."
          },
          {
            type: "task",
            instruction: "قم بكتابة حلقة للمرور على قائمة الموظفين وطباعتهم:\nemp = [\"أحمد\", \"سارة\"]\nfor x in emp:\n    print(x)",
            action: { kind: "writeCode", expected: "emp = [\"أحمد\", \"سارة\"]\nfor x in emp:\n    print(x)" }
          }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "الدوال (Functions)",
    focus: "كتابة تعليمات برمجية قابلة لإعادة الاستخدام",
    chapters: [
      {
        chapter_id: "py-ch-7-1",
        chapter_title: "1. تعريف دالة",
        steps: [
          {
            type: "info",
            instruction: "الدوال تتيح لنا تجميع الأكواد تحت اسم واحد لمنع التكرار وتسهيل الصيانة. نقوم بتعريفها باستخدام عبارة `def`."
          },
          {
            type: "task",
            instruction: "أنشئ دالة للتحية ثم قم بمناداتها:\ndef greet():\n    print(\"أهلاً وسهلاً\")\n\ngreet()",
            action: { kind: "writeCode", expected: "def greet():\n    print(\"أهلاً وسهلاً\")\n\ngreet()" }
          }
        ]
      },
      {
        chapter_id: "py-ch-7-2",
        chapter_title: "2. المعاملات في الدوال (Parameters)",
        steps: [
          {
            type: "info",
            instruction: "يمكن للدالة استقبال مدخلات خاصة عند تشغيلها للقيام بمعالجة ديناميكية."
          },
          {
            type: "task",
            instruction: "أنشئ دالة تجمع رقمين وتطبع النتيجة:\ndef add(a, b):\n    print(a + b)\n\nadd(10, 5)",
            action: { kind: "writeCode", expected: "def add(a, b):\n    print(a + b)\n\nadd(10, 5)" }
          }
        ]
      }
    ]
  }
];

pythonUnits.forEach(u => {
  const content = `export const pythonUnit${u.id}Content = [
  ${JSON.stringify(u, null, 2)}
];`;
  fs.writeFileSync(`data/PythonUnit${u.id}Content.js`, content, 'utf8');
});

const unit1Entry = {
    unit_id: "UNIT_01",
    title: "أساسيات إدخال البيانات ومراقبة الجودة",
    focus: "Real-world Data Entry & Quality Assurance",
    chapters: [
      {
        chapter_id: "ch-1-1",
        chapter_title: "1. تنظيف البيانات (Data Cleaning)",
        steps: [
          {
            type: "info",
            instruction: "دقة البيانات هي حجر الزاوية. احرص دائماً على تنسيق الأرقام والأسماء."
          },
          {
            type: "interactive",
            instruction: "تحدي الجودة: اختبر الدقة: ما هو التنسيق الصحيح لكتابة رقم هاتف لتسجيل العميل؟",
            options: [
              "0501234 - riyadh",
              "0501234567",
              "050 1234567 - RIYADH"
            ],
            correctIndex: 1,
            feedback: "ممتاز! الأرقام يجب أن تسجل بدون مسافات إضافية وبدون دمج النصوص مع الأرقام."
          }
        ]
      },
      {
        chapter_id: "ch-1-2",
        chapter_title: "2. التحقق والمراجعة (Accuracy)",
        steps: [
          {
            type: "info",
            instruction: "اقرأ وتأكد من الدقة قبل الانتقال لتأكيد المهمة والانتقال للمرحلة التالية."
          }
        ]
      }
    ]
};

fs.writeFileSync('data/Unit1Content.js', `export const unit1Content = [\n  ${JSON.stringify(unit1Entry, null, 2)}\n];`, 'utf8');

console.log('Course content fully audited and rewritten with proper schema structure!');
