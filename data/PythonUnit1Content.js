export const pythonUnit1Content = [
  {
  "id": 1,
  "title": "أساسيات بايثون العملية",
  "focus": "تأسيس البرمجة وعرض المخرجات",
  "chapters": [
    {
      "chapter_id": "py-ch-1-1",
      "chapter_title": "1. أول برنامج لك",
      "steps": [
        {
          "type": "info",
          "instruction": "مرحباً بك في عالم بايثون! أول أمر نتعلمه هو `print()` والذي يقوم بعرض النصوص والأرقام على الشاشة."
        },
        {
          "type": "task",
          "instruction": "جرب الآن كتابة الكود التالي لطباعة رسالة ترحيبية:\nprint(\"مرحباً طفرة\")",
          "action": {
            "kind": "writeCode",
            "expected": "print(\"مرحباً طفرة\")"
          }
        }
      ]
    },
    {
      "chapter_id": "py-ch-1-2",
      "chapter_title": "2. المتغيرات",
      "steps": [
        {
          "type": "info",
          "instruction": "المتغير هو مثل الصندوق الذي يحفظ البيانات. نقوم بتسمية الصندوق ونضع فيه القيمة لتذكرها لاحقاً."
        },
        {
          "type": "task",
          "instruction": "أبقِ الكود بسيطاً. قم بإنشاء متغير اسمه `name` يحمل اسمك، ثم اطبعه:\nname = \"أحمد\"\nprint(name)",
          "action": {
            "kind": "writeCode",
            "expected": "name = \"أحمد\"\nprint(name)"
          }
        }
      ]
    }
  ]
}
];