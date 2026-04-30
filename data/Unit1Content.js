export const unit1Content = [
  {
  "unit_id": "UNIT_01",
  "title": "أساسيات إدخال البيانات ومراقبة الجودة",
  "focus": "Real-world Data Entry & Quality Assurance",
  "chapters": [
    {
      "chapter_id": "ch-1-1",
      "chapter_title": "1. تنظيف البيانات (Data Cleaning)",
      "steps": [
        {
          "type": "info",
          "instruction": "دقة البيانات هي حجر الزاوية. احرص دائماً على تنسيق الأرقام والأسماء."
        },
        {
          "type": "interactive",
          "instruction": "تحدي الجودة: اختبر الدقة: ما هو التنسيق الصحيح لكتابة رقم هاتف لتسجيل العميل؟",
          "options": [
            "0501234 - riyadh",
            "0501234567",
            "050 1234567 - RIYADH"
          ],
          "correctIndex": 1,
          "feedback": "ممتاز! الأرقام يجب أن تسجل بدون مسافات إضافية وبدون دمج النصوص مع الأرقام."
        }
      ]
    },
    {
      "chapter_id": "ch-1-2",
      "chapter_title": "2. التحقق والمراجعة (Accuracy)",
      "steps": [
        {
          "type": "info",
          "instruction": "اقرأ وتأكد من الدقة قبل الانتقال لتأكيد المهمة والانتقال للمرحلة التالية."
        }
      ]
    }
  ]
}
];