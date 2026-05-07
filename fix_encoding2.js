const fs = require('fs');

const courses = [
  { id: 1, title: 'أساسيات بايثون العملية', code: 'name = "أحمد"\\nprint("مرحباً", name)' },
  { id: 2, title: 'المتغيرات وأنواع البيانات', code: 'age = 25\\nprint("العمر", age)' },
  { id: 3, title: 'العمليات الحسابية والمنطقية', code: 'total = 100 + 50\\nprint(total)' },
  { id: 4, title: 'التعامل مع النصوص (Strings)', code: 'print("محمد" + " علي")' },
  { id: 5, title: 'القوائم (Lists)', code: 'emp = ["أحمد", "سارة"]\\nprint(emp)' },
  { id: 6, title: 'الشروط والقرارات', code: 'if age > 18:\\n    print("مسموح")' },
  { id: 7, title: 'الحلقات التكرارية', code: 'for x in emp:\\n    print(x)' }
];

courses.forEach(u => {
  const content = \export const pythonUnit\Content = [
  {
    unit_id: "PY_UNIT_0\",
    title: "\",
    focus: "Basic Concepts",
    chapters: [
      {
        chapter_id: "py-ch-\-1",
        chapter_title: "1. مقدمة عملية",
        steps: [
          {
            type: "info",
            instruction: "في هذا التدريب العملي سنتعلم هذا المفهوم برمجياً."
          },
          {
            type: "code",
            instruction: "انسخ الكود التالي لتجربة التطبيق العملي:",
            codeTemplate: \\\
          }
        ]
      }
    ]
  }
];\;
  fs.writeFileSync(\data/PythonUnit\Content.js\, content, 'utf8');
});

const unit1 = \export const unit1Content = [
  {
    unit_id: "UNIT_01",
    title: "أساسيات إدخال البيانات",
    focus: "Real-world Data Entry",
    chapters: [
      {
        chapter_id: "ch-1-1",
        chapter_title: "1. تنظيف البيانات (Data Cleaning)",
        steps: [
          {
            type: "info",
            instruction: "في هذا الدرس سنتعلم كيف ننظف البيانات بشكل صحيح."
          },
          {
            type: "code",
            instruction: "اكتب الكود التالي:",
            codeTemplate: "console.log('تنظيف البيانات')"
          }
        ]
      }
    ]
  }
];\;
fs.writeFileSync('data/Unit1Content.js', unit1, 'utf8');

console.log('Fixed encoding!');
