const fs = require('fs');

const pythonUnits = [
  {
    id: 1, title: 'أساسيات بايثون العملية', focus: 'Practical Python Basics', desc: 'مقدمة في البرمجة',
    ch1: 'المتغيرات والطباعة',
    step1_info: 'في هذا الدرس سنتعلم كيف نطبع نصوصاً على الشاشة ونستخدم المتغيرات.',
    step2_code: 'name = \\'أحمد\\'\\nprint(\\'مرحباً\\', name)'
  },
  {
    id: 2, title: 'المتغيرات وأنواع البيانات', focus: 'Variables & Data Types', desc: 'استخدام المتغيرات',
    ch1: 'أنواع البيانات الأساسية',
    step1_info: 'سنتعلم أنواع البيانات مثل النصوص والأرقام.',
    step2_code: 'age = 25\\nprint(\\'العمر:\\', age)'
  },
  {
    id: 3, title: 'العمليات الحسابية والمنطقية', focus: 'Math & Logic', desc: 'حساب الفواتير والمرتبات برمجياً',
    ch1: 'العمليات الحسابية',
    step1_info: 'دعونا نقوم ببعض العمليات الحسابية.',
    step2_code: 'total = 100 + 50\\nprint(\\'الإجمالي:\\', total)'
  },
  {
    id: 4, title: 'التعامل مع النصوص (Strings)', focus: 'String Manipulation', desc: 'تنظيف وتنسيق قوائم الأسماء',
    ch1: 'التعامل مع النصوص',
    step1_info: 'كيفية تعديل النصوص ودمجها.',
    step2_code: 'first = \\'محمد\\'\\nlast = \\'علي\\'\\nprint(first + \\' \\' + last)'
  },
  {
    id: 5, title: 'القوائم (Lists) وهياكل البيانات', focus: 'Lists & Data Structures', desc: 'إدارة قوائم الموظفين والمنتجات',
    ch1: 'مقدمة عن القوائم',
    step1_info: 'القوائم تستخدم لحفظ أكثر من قيمة في متغير واحد.',
    step2_code: 'employees = [\\'أحمد\\', \\'سارة\\', \\'عمر\\']\\nprint(employees)'
  },
  {
    id: 6, title: 'الشروط والقرارات (If Statements)', focus: 'Conditional Logic', desc: 'فلترة البيانات وبناء قرارات آلية',
    ch1: 'الشروط الأساسية',
    step1_info: 'استخدام الجمل الشرطية لتنفيذ أكواد معينة بناءً على شرط.',
    step2_code: 'if age > 18:\\n    print(\\'مسموح\\')'
  },
  {
    id: 7, title: 'الحلقات التكرارية (Loops)', focus: 'Loops', desc: 'أتمتة المهام المتكررة في جداول البيانات',
    ch1: 'التكرار',
    step1_info: 'حلقات التكرار تستخدم لتنفيذ كود عدة مرات.',
    step2_code: 'for emp in employees:\\n    print(emp)'
  }
];

pythonUnits.forEach(u => {
  const content = \export const pythonUnit\Content = [
  {
    unit_id: "PY_UNIT_0\",
    title: "\",
    focus: "\",
    chapters: [
      {
        chapter_id: "py-ch-\-1",
        chapter_title: "1. \",
        steps: [
          {
            type: "info",
            instruction: "\"
          },
          {
            type: "code",
            instruction: "انسخ الكود التالي لتجربة التطبيق العملي:",
            codeTemplate: "\"
          }
        ]
      }
    ]
  }
];
\;
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
];
\;
fs.writeFileSync('data/Unit1Content.js', unit1, 'utf8');

console.log('Fixed encoding!');
