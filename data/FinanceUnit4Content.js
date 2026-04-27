export const financeUnit4Content = [
  {
    unit_id: 'FIN_UNIT_04',
    title: 'الوحدة ٤: المحاسبة في العالم التقني (Tech World)',
    focus: 'كيف تحولت الدفاتر الورقية إلى خوارزميات إلكترونية ذكية.',
    chapters: [
      {
        chapter_id: 'fin-ch-4-1',
        chapter_title: '١. البرامج المحاسبية: وداعاً للورق',
        steps: [
          { type: 'info', instruction: 'في العصر الحديث، لا أحد يكتب القيود المحاسبية في دفاتر ورقية ضخمة (لأن الورق بطيء وعرضة للخطأ البشري). بدلاً من ذلك، نستخدم (البرامج المحاسبية).' },
          { type: 'info', instruction: 'هذه البرامج (مثل إكسيل، وكويك بوكس، وDynamics 365) تنفذ معادلة الميزان (Assets = Liabilities + Equity) أوتوماتيكياً كلما أدخلنا رقماً.' },
          { type: 'task', instruction: 'ما الميزة الأساسية للبرامج المحاسبية؟', action: { kind: 'selectOption', label: 'تنفيذ المعادلات والتوازن أوتوماتيكياً وتقليل الخطأ' } }
        ]
      },
      {
        chapter_id: 'fin-ch-4-2',
        chapter_title: '٢. أنظمة التخطيط الشاملة (ERP)',
        steps: [
          { type: 'info', instruction: '(ERP) تعني: أنظمة تخطيط موارد المؤسسة. وهي برامج ضخمة تربط كل أقسام الشركة (HR، المبيعات، المخازن،، المالية) في نظام وقاعدة بيانات واحدة (Single Source of Truth).' },
          { type: 'info', instruction: 'مثال: عندما يبيع قسم المبيعات قطعة، ينقص المخزون تلقائياً (في قسم المخازن)، وتزيد الإيرادات أو تتغير الخصوم تلقائياً (في قسم المالية) بدون إعادة إدخالها!' },
          { type: 'task', instruction: 'إذا أدخل قسم (أ) معلومة في الـ ERP، متى ستظهر في قسم (ب)؟', action: { kind: 'selectOption', label: 'فوراً (تحديث تلقائي)' } }
        ]
      },
      {
        chapter_id: 'fin-ch-4-3',
        chapter_title: '٣. مايكروسوفت دايناميكس Dynamics 365',
        steps: [
          { type: 'info', instruction: 'برنامج (مايكروسوفت دايناميكس 365) هو أحد أقوى وأشهر أنظمة الـ ERP في العالم ويحظى بحصة سوقية هائلة للشركات الكبرى.' },
          { type: 'info', instruction: 'كمحاسب معتمد، احتراف واجهات (Dynamics 365)، وكيف يربط شجرة الحسابات بالفواتير تلقائياً، يجعلك شخصاً لا غنى عنه.' },
          { type: 'task', instruction: 'ما هو Dynamics 365؟', action: { kind: 'selectOption', label: 'نظام ERP من مايكروسوفت' } }
        ]
      },
      {
        chapter_id: 'fin-ch-4-4',
        chapter_title: '٤. الإكسيل (Excel) الحاضر الدائم',
        steps: [
          { type: 'info', instruction: 'رغم وجود الـ ERP القوي، سيظل برنامج الجداول الإلكترونية (Excel) أداة رئيسية لنقل وتحليل البيانات المؤقتة وعمل معادلات سريعة.' },
          { type: 'info', instruction: 'قاعدة: الـ ERP يكون للتسجيل الحقيقي الدقيق، بينما الإكسيل يكون للتحليل وحساب التوقعات للمستقبل.' },
          { type: 'task', instruction: 'هل يعني وجود ERP أننا استغنينا عن Excel نهائياً؟', action: { kind: 'selectOption', label: 'لا، الـ Excel يستخدم للتحليل المستمر' } }
        ]
      }
    ]
  }
];
