export const pythonUnit4Content = [
  {
  "id": 4,
  "title": "الشروط والقرارات",
  "focus": "توجيه مسار البرنامج باستخدام if و else",
  "chapters": [
    {
      "chapter_id": "py-ch-4-1",
      "chapter_title": "1. الجملة الشرطية if",
      "steps": [
        {
          "type": "info",
          "instruction": "جملة `if` تسمح لنا بتنفيذ الكود فقط إذا كان الشرط صحيحاً. تذكر أن تضيف مسافة قبل الكود الداخلي."
        },
        {
          "type": "task",
          "instruction": "اكتب شرطاً للتحقق من العمر:\nage = 20\nif age > 18:\n    print(\"بالغ\")",
          "action": {
            "kind": "writeCode",
            "expected": "age = 20\nif age > 18:\n    print(\"بالغ\")"
          }
        }
      ]
    },
    {
      "chapter_id": "py-ch-4-2",
      "chapter_title": "2. الجملة الشرطية else",
      "steps": [
        {
          "type": "info",
          "instruction": "نستخدم `else` كبديل عند عدم تحقق الشرط الأساسي. (في حال كان العمر أصغر من 18)"
        },
        {
          "type": "task",
          "instruction": "قم بإكمال مسار القرار لتشمل القاصر:\nage = 15\nif age > 18:\n    print(\"بالغ\")\nelse:\n    print(\"قاصر\")",
          "action": {
            "kind": "writeCode",
            "expected": "age = 15\nif age > 18:\n    print(\"بالغ\")\nelse:\n    print(\"قاصر\")"
          }
        }
      ]
    }
  ]
}
];