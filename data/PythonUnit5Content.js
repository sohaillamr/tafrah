export const pythonUnit5Content = [
  {
  "id": 5,
  "title": "القوائم (Lists)",
  "focus": "حفظ عدة عناصر في متغير واحد",
  "chapters": [
    {
      "chapter_id": "py-ch-5-1",
      "chapter_title": "1. إنشاء قائمة",
      "steps": [
        {
          "type": "info",
          "instruction": "للاحتفاظ بقائمة من الأسماء أو الأرقام، نستخدم الأقواس المربعة `[]`."
        },
        {
          "type": "task",
          "instruction": "مطلوب منك إنشاء قائمة لأسماء الموظفين وطباعتها:\nemp = [\"أحمد\", \"سارة\", \"علي\"]\nprint(emp)",
          "action": {
            "kind": "writeCode",
            "expected": "emp = [\"أحمد\", \"سارة\", \"علي\"]\nprint(emp)"
          }
        },
        {
          "type": "task",
          "instruction": "يمكننا طباعة عنصر محدد بإعطاء رقم ترتيبه (حيث يبدأ العد من الصفر):\nprint(emp[1])",
          "action": {
            "kind": "writeCode",
            "expected": "emp = [\"أحمد\", \"سارة\", \"علي\"]\nprint(emp[1])"
          }
        }
      ]
    }
  ]
}
];