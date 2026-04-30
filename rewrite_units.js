const fs = require('fs');

const units = [
  { id: 2, title: 'المتغيرات وأنواع البيانات - تطبيقات عملية', focus: 'Variables & Data Types', desc: 'استخدام المتغيرات في سيناريوهات إدخال البيانات' },
  { id: 3, title: 'العمليات الحسابية والمنطقية', focus: 'Math & Logic', desc: 'حساب الفواتير والمرتبات برمجياً' },
  { id: 4, title: 'التعامل مع النصوص (Strings)', focus: 'String Manipulation', desc: 'تنظيف وتنسيق قوائم الأسماء' },
  { id: 5, title: 'القوائم (Lists) وهياكل البيانات', focus: 'Lists & Data Structures', desc: 'إدارة قوائم الموظفين والمنتجات' },
  { id: 6, title: 'الشروط والقرارات (If Statements)', focus: 'Conditional Logic', desc: 'فلترة البيانات وبناء قرارات آلية' },
  { id: 7, title: 'الحلقات التكرارية (Loops)', focus: 'Loops', desc: 'أتمتة المهام المتكررة في جداول البيانات' }
];

units.forEach(u => {
  const content = export const pythonUnitContent = [
  {
    unit_id: "PY_UNIT_0",
    title: "",
    focus: "",
    chapters: [
      {
        chapter_id: "py-ch--1",
        chapter_title: "1.  - خطوة بخطوة",
        steps: [
          {
            type: "info",
            instruction: "في هذا التدريب العملي سنتعلم كيفية  بطريقة مبسطة وتطبيقية."
          },
          {
            type: "code",
            instruction: "انسخ الكود التالي لتجربة أول خطوة تطبيقية:",
            codeTemplate: "#  Example\\nprint('تطبيق عملي: ')"
          }
        ]
      }
    ]
  }
];
;
  fs.writeFileSync(data/PythonUnitContent.js, content, 'utf8');
});

console.log('Done generating Python Units 2-7');
