export const financeUnit3Content = [
  {
    unit_id: 'FIN_UNIT_03',
    title: 'الوحدة ٣: الصورة الكبرى (The Big Picture)',
    focus: 'كيف نجمع الأرقام لنفهم حالة الشركة: القوائم المالية.',
    chapters: [
      {
        chapter_id: 'fin-ch-3-1',
        chapter_title: 'التقرير الأول: قائمة الدخل (Income Statement)',
        steps: [
          { type: 'info', instruction: 'قائمة الدخل تجيب على سؤال واحد بوضوح شديد: (هل كسبت الشركة أم خسرت) في فترة معينة؟' },
          { type: 'info', instruction: 'القاعدة: نأخذ كل الإيرادات (ما كسبناه Revenue) ونطرح منه المصروفات (ما دفعناه Expenses). ما يتبقى هو صافي الربح (Net Income).' },
          { type: 'task', instruction: 'إذا كان الإيراد 100 ألف، والمصاريف 60 ألفاً، كم يكون صافي النتيجة؟', action: { kind: 'selectOption', label: '40 ألف (ربح)' } }
        ]
      },
      {
        chapter_id: 'fin-ch-3-2',
        chapter_title: 'التقرير الثاني: قائمة الأرباح المحتجزة',
        steps: [
          { type: 'info', instruction: 'الأرباح التي حصلنا عليها (صافي الدخل) لا تُصرف كلها عادة. بل نحتجز جزءاً منها يُسمى (الأرباح المحتجزة - Retained Earnings).' },
          { type: 'info', instruction: 'هذه الأرباح تُعتبر من حقوق ملكية صاحب الشركة، ونستخدمها لتمويل مشاريع الشركة في المستقبل (إعادة الاستثمار).' },
          { type: 'task', instruction: 'ما الفائدة من الاحتفاظ بالأرباح؟', action: { kind: 'selectOption', label: 'تمويل مشاريع الشركة وإعادة الاستثمار' } }
        ]
      },
      {
        chapter_id: 'fin-ch-3-3',
        chapter_title: 'التقرير الثالث: الميزانية العمومية (Balance Sheet)',
        steps: [
          { type: 'info', instruction: 'بينما قائمة الدخل تتحدث عن (فترة) معينة مثل سنة كاملة، فإن الميزانية العمومية هي التقطا (صورة فوتوغرافية) ثابتة للشركة في يوم محدد (يوم 31 ديسمبر مثلاً).' },
          { type: 'info', instruction: 'تُظهر في جزء: كل ما نملكه (الأصول Assets)، وفي الجزء الآخر: من أين أتينا بثمنه (خصوم Liabilities) و (حقوق ملكية Equity).' },
          { type: 'task', instruction: 'أي قائمة تمثل لقطة ثابتة (صورة) ليوم محدد، بدلاً من فترة زمنية؟', action: { kind: 'selectOption', label: 'الميزانية العمومية (Balance Sheet)' } }
        ]
      },
      {
        chapter_id: 'fin-ch-3-4',
        chapter_title: 'التقرير الرابع: قائمة التدفقات النقدية (Cash Flows)',
        steps: [
          { type: 'info', instruction: 'هذه القائمة تركز حصراً على (السيولة). (كم دفعنا نقداً وكم استلمنا نقداً). لأن الربح في الورق لا يعني دائماً وجود سيولة (أموال سائلة في الخزنة).' },
          { type: 'info', instruction: 'تقسم التدفقات إلى ثلاث عمليات بدقة: تدفقات (تشغيلية)، تدفقات (استثمارية)، وتدفقات (تمويلية).' },
          { type: 'task', instruction: 'إذا باعت الشركة بضاعة (بالأجل - أي لم تستلم المال بعد). هل يظهر ذلك في قائمة التدفقات النقدية؟', action: { kind: 'selectOption', label: 'لا، لأننا لم نستلم النقد بعد' } }
        ]
      }
    ]
  }
];
