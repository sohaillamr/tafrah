export const pythonUnit7Content = [
  {
  "id": 7,
  "title": "الدوال (Functions)",
  "focus": "كتابة تعليمات برمجية قابلة لإعادة الاستخدام",
  "chapters": [
    {
      "chapter_id": "py-ch-7-1",
      "chapter_title": "1. تعريف دالة",
      "steps": [
        {
          "type": "info",
          "instruction": "الدوال تتيح لنا تجميع الأكواد تحت اسم واحد لمنع التكرار وتسهيل الصيانة. نقوم بتعريفها باستخدام عبارة `def`."
        },
        {
          "type": "task",
          "instruction": "أنشئ دالة للتحية ثم قم بمناداتها:\ndef greet():\n    print(\"أهلاً وسهلاً\")\n\ngreet()",
          "action": {
            "kind": "writeCode",
            "expected": "def greet():\n    print(\"أهلاً وسهلاً\")\n\ngreet()"
          }
        }
      ]
    },
    {
      "chapter_id": "py-ch-7-2",
      "chapter_title": "2. المعاملات في الدوال (Parameters)",
      "steps": [
        {
          "type": "info",
          "instruction": "يمكن للدالة استقبال مدخلات خاصة عند تشغيلها للقيام بمعالجة ديناميكية."
        },
        {
          "type": "task",
          "instruction": "أنشئ دالة تجمع رقمين وتطبع النتيجة:\ndef add(a, b):\n    print(a + b)\n\nadd(10, 5)",
          "action": {
            "kind": "writeCode",
            "expected": "def add(a, b):\n    print(a + b)\n\nadd(10, 5)"
          }
        }
      ]
    }
  ]
}
];