export const pythonUnit2Content = [
  {
  "id": 2,
  "title": "العمليات الحسابية",
  "focus": "المتغيرات الرقمية والعمليات الحسابية",
  "chapters": [
    {
      "chapter_id": "py-ch-2-1",
      "chapter_title": "1. الأرقام",
      "steps": [
        {
          "type": "info",
          "instruction": "في بايثون، يمكنك حفظ الأرقام في المتغيرات بدون علامات تنصيص لتتمكن من جمعها أو طرحها."
        },
        {
          "type": "task",
          "instruction": "قم بإنشاء متغير `age` واطبعه:\nage = 25\nprint(age)",
          "action": {
            "kind": "writeCode",
            "expected": "age = 25\nprint(age)"
          }
        }
      ]
    },
    {
      "chapter_id": "py-ch-2-2",
      "chapter_title": "2. الجمع والطرح",
      "steps": [
        {
          "type": "info",
          "instruction": "يمكنك استخدام الرموز الرياضية المعتادة مثل `+` للجمع و `-` للطرح."
        },
        {
          "type": "task",
          "instruction": "قم بوضع حاصل جمع 50 و 30 في متغير واعرض الناتج:\ntotal = 50 + 30\nprint(total)",
          "action": {
            "kind": "writeCode",
            "expected": "total = 50 + 30\nprint(total)"
          }
        }
      ]
    }
  ]
}
];