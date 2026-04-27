export const financeUnit2Content = [
  {
    unit_id: 'FIN_UNIT_02',
    title: 'الوحدة ٢: قصة معاملة (Story of a Transaction)',
    focus: 'كيف نتتبع حركة المال خطوة بخطوة بالترتيب الزمني.',
    chapters: [
      {
        chapter_id: 'fin-ch-2-1',
        chapter_title: 'خطوة ١: قيود اليومية (Journal Entries)',
        steps: [
          { type: 'info', instruction: 'كما يكتب العلماء مذكراتهم يومياً، يكتب المحاسب قيود اليومية. قيد اليومية هو (تسجيل زمني) لكل ما يحدث في الشركة أولاً بأول.' },
          { type: 'info', instruction: 'القاعدة: كل قيد يجب أن يحتوي على طرفين (من وإلى). طرف يأخذ (Debit - مدين) وطرف يعطي (Credit - دائن).' },
          { type: 'task', instruction: 'ما هو الهدف الأساسي من دفتر اليومية؟', action: { kind: 'selectOption', label: 'التسجيل الزمني لكل ما يحدث تباعاً' } }
        ]
      },
      {
        chapter_id: 'fin-ch-2-2',
        chapter_title: 'خطوة ٢: المدين والدائن (Debit vs Credit)',
        steps: [
          { type: 'info', instruction: 'المدين (Debit) يعني دائماً: الجانب الأيمن. الدائن (Credit) يعني دائماً: الجانب الأيسر. لا تفكر فيهما كـ"زيادة" أو "نقصان"، فكر فيهما كمكانين.' },
          { type: 'info', instruction: 'الأصول طبيعتها (مدينة)، يعني تزيد في الجانب الأيمن وتقل في الجانب الأيسر. الخصوم طبيعتها (دائنة)، تزيد في الأيسر وتقل في الأيمن.' },
          { type: 'task', instruction: 'إذا زادت الأصول، في أي جانب نضعها؟', action: { kind: 'selectOption', label: 'في الجانب الأيمن (المدين)' } }
        ]
      },
      {
        chapter_id: 'fin-ch-2-3',
        chapter_title: 'خطوة ٣: دفتر الأستاذ المعظم (The Ledger)',
        steps: [
          { type: 'info', instruction: 'بعد كتابة الأحداث في دفتر اليومية، نحتاج لمعرفة الرصيد النهائي لكل حساب لوحده. هنا نستخدم دفتر الأستاذ (Ledger).' },
          { type: 'info', instruction: 'الدفتر يخصص صفحة كاملة لكل حساب (مثلاً صفحة كاملة لحساب النقد، صفحة كاملة للبنك) ليجمع حركاته.' },
          { type: 'task', instruction: 'أين نجد الرصيد المجمع الخاص بحساب (النقد) تحديداً؟', action: { kind: 'selectOption', label: 'في دفتر الأستاذ (Ledger)' } }
        ]
      },
      {
        chapter_id: 'fin-ch-2-4',
        chapter_title: 'خطوة ٤: ميزان المراجعة (Trial Balance)',
        steps: [
          { type: 'info', instruction: 'القاعدة الذهبية: إجمالي الأرقام في الجانب الأيمن (المدين) يجب أن يتطابق بدقة تامة مع الجانب الأيسر (الدائن). إذا اختلفا، يوجد خطأ.' },
          { type: 'info', instruction: 'نقوم بعمل كشف يسمى (ميزان المراجعة) قبل إصدار التقارير النهائية للتأكد من عدم وجود أخطاء في التسجيل.' },
          { type: 'task', instruction: 'إذا كان إجمالي الحسابات المدينة 50 ألفاً، وإجمالي الحسابات الدائنة 49 ألفاً. ماذا يعني ذلك؟', action: { kind: 'selectOption', label: 'يوجد خطأ في التسجيل ويجب مراجعته' } }
        ]
      }
    ]
  }
];
