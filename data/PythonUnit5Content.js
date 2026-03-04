export const pythonUnit5Content = [
  {
    unit_id: "PY_UNIT_05",
    title: "الحلقات والتكرار",
    focus: "For Loops, While Loops, and Iteration Patterns",
    chapters: [
      {
        chapter_id: "py-ch-5-1",
        chapter_title: "١. حلقة for",
        steps: [
          {
            type: "info",
            instruction:
              "حلقة for تكرر تنفيذ كود معين عدداً محدداً من المرات. تستخدم range() لتحديد عدد التكرارات. مثال: for i in range(5) تكرر 5 مرات (من 0 إلى 4).",
          },
          {
            type: "task",
            instruction: "اكتب حلقة تطبع الأرقام من 1 إلى 5:\nfor i in range(1, 6):\n    print(i)",
            action: { kind: "writeCode", expected: "for i in range(1, 6):\n    print(i)" },
          },
          {
            type: "info",
            instruction:
              "range(1, 6) تبدأ من 1 وتنتهي قبل 6 (أي 1، 2، 3، 4، 5). الرقم الأخير لا يُحتسب. هذه قاعدة مهمة في بايثون: النهاية دائماً غير مشمولة.",
          },
          {
            type: "task",
            instruction: "اكتب حلقة تطبع (مرحباً) 3 مرات:\nfor i in range(3):\n    print('مرحباً')",
            action: { kind: "writeCode", expected: "for i in range(3):\n    print('مرحباً')" },
          },
        ],
      },
      {
        chapter_id: "py-ch-5-2",
        chapter_title: "٢. التكرار على القوائم",
        steps: [
          {
            type: "info",
            instruction:
              "يمكنك استخدام for للمرور على عناصر قائمة (list). القائمة تُكتب بين أقواس مربعة []. مثال: ['أحمد', 'سارة', 'نور']. الحلقة تأخذ كل عنصر بالدور.",
          },
          {
            type: "task",
            instruction: "اطبع كل اسم في القائمة:\nnames = ['أحمد', 'سارة', 'نور']\nfor name in names:\n    print(name)",
            action: { kind: "writeCode", expected: "names = ['أحمد', 'سارة', 'نور']\nfor name in names:\n    print(name)" },
          },
          {
            type: "info",
            instruction:
              "المتغير name في الحلقة يأخذ قيمة مختلفة كل مرة: المرة الأولى 'أحمد'، ثم 'سارة'، ثم 'نور'. يمكنك تسمية المتغير بأي اسم تريده.",
          },
        ],
      },
      {
        chapter_id: "py-ch-5-3",
        chapter_title: "٣. حلقة while",
        steps: [
          {
            type: "info",
            instruction:
              "حلقة while تكرر الكود طالما الشرط صحيح (True). يجب تغيير الشرط داخل الحلقة وإلا ستستمر للأبد! مثال: count = 0 ثم while count < 3: اطبع count ثم count += 1.",
          },
          {
            type: "task",
            instruction: "اكتب حلقة while تطبع الأرقام من 1 إلى 3:\ncount = 1\nwhile count <= 3:\n    print(count)\n    count += 1",
            action: { kind: "writeCode", expected: "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1" },
          },
          {
            type: "info",
            instruction:
              "تحذير: إذا نسيت count += 1 ستستمر الحلقة للأبد (حلقة لانهائية). تأكد دائماً من تحديث المتغير الذي يتحكم في الشرط داخل الحلقة.",
          },
          {
            type: "task",
            instruction: "اكتب حلقة تعد تنازلياً من 5 إلى 1:\nnum = 5\nwhile num >= 1:\n    print(num)\n    num -= 1",
            action: { kind: "writeCode", expected: "num = 5\nwhile num >= 1:\n    print(num)\n    num -= 1" },
          },
        ],
      },
    ],
  },
];
