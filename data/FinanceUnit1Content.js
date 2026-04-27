export const financeUnit1Content = [
  {
    unit_id: 'FIN_UNIT_01',
    title: 'الوحدة ١: لغة المال (The Language of Money)',
    focus: 'نظام القواعد الصارم: كيف نصف الأموال بطريقة علمية ودقيقة.',
    chapters: [
      {
        chapter_id: 'fin-ch-1-1',
        chapter_title: 'القاعدة الأولى: ما هي المحاسبة؟',
        steps: [
          { type: 'info', instruction: 'المحاسبة ليست مجرد أرقام، هي نظام قواعد (System of Rules) يتبعه الجميع لنقل الحقيقة بوضوح تام بدون غموض. لكل عملية مالية اسم محدد ومكان محدد.' },
          { type: 'info', instruction: 'الشركات تتواصل باستخدام هذا النظام لكي تفهم البنوك والضرائب والحكومات وضعها المالي دون الحاجة لترجمة شخصية.' },
          { type: 'task', instruction: 'أكمل الجملة: المحاسبة هي...', action: { kind: 'selectOption', label: 'نظام قواعد لنقل الحقيقة بوضوح' } },
        ]
      },
      {
        chapter_id: 'fin-ch-1-2',
        chapter_title: 'القاعدة الثانية: الأشياء الملموسة وقيمتها (الأصول - Assets)',
        steps: [
          { type: 'info', instruction: 'الأصول (Assets) تعني حرفياً: كل شيء تملكه الشركة وله قيمة مالية ويساعد في توليد المزيد من الأموال في المستقبل. الأمثلة يجب أن تكون ملموسة.' },
          { type: 'info', instruction: 'أمثلة الأصول: (١) النقد في الخزنة (Cash). (٢) أجهزة الكمبيوتر (Equipment). (٣) المبنى (Building).' },
          { type: 'task', instruction: 'هل يعتبر جهاز اللابتوب الخاص بالشركة الذي يعمل عليه الموظف من الأصول؟', action: { kind: 'selectOption', label: 'نعم لأنه مملوك للشركة وله قيمة' } }
        ]
      },
      {
        chapter_id: 'fin-ch-1-3',
        chapter_title: 'القاعدة الثالثة: الديون والالتزامات (الخصوم - Liabilities)',
        steps: [
          { type: 'info', instruction: 'الخصوم (Liabilities) تعني حرفياً: الديون أو الالتزامات التي يجب على الشركة أن تدفعها للآخرين في المستقبل.' },
          { type: 'info', instruction: 'أمثلة الخصوم: (١) قرض من البنك (Bank Loan). (٢) فواتير كهرباء لم يتم دفعها بعد (Accounts Payable).' },
          { type: 'task', instruction: 'إذا استدانت الشركة مبلغ 10 آلاف من البنك لشراء معدات، المبلغ المستدان يصنف كـ...', action: { kind: 'selectOption', label: 'خصوم (Liabilities)' } }
        ]
      },
      {
        chapter_id: 'fin-ch-1-4',
        chapter_title: 'القاعدة الرابعة: معادلة الميزان (The Equation)',
        steps: [
          { type: 'info', instruction: 'الكون المالي يجب أن يتوازن دائماً. القاعدة الصارمة تقول: كل أصل تملكه الشركة (Assets)، لابد أن يقابله مصدر لتمويله.' },
          { type: 'info', instruction: 'المصادر نوعين: إما أن مالك الشركة دفع ثمنه (حقوق الملكية - Equity)، أو استدانة من الغير (خصوم - Liabilities).' },
          { type: 'info', instruction: 'المعادلة الأساسية هي: الأصول = الخصوم + حقوق الملكية.\n(Assets = Liabilities + Equity).' },
          { type: 'task', instruction: 'إذا كان لدى الشركة أصول بـ 100، وديون بـ 40، كم تبلغ حقوق الملكية لتتوازن المعادلة؟', action: { kind: 'selectOption', label: '60' } }
        ]
      },
      {
        chapter_id: 'fin-ch-1-5',
        chapter_title: 'القاعدة الخامسة: شجرة الحسابات العصبية (Chart of Accounts)',
        steps: [
          { type: 'info', instruction: 'لا نعتمد على الأسماء العشوائية. شجرة الحسابات (Chart of Accounts) هي قائمة موحدة مرقمة. كل حساب له رقم فريد يسمى كود الحساب (Account Code).' },
          { type: 'info', instruction: 'مثال: حساب الأصول يبدأ دائماً بالرقم 1. (النقد = 1001، البنك = 1002، المعدات = 1003).' },
          { type: 'info', instruction: 'الخصوم تبدأ دائماً بالرقم 2. (كقرض البنك = 2001).' },
          { type: 'task', instruction: 'في هذا النظام المنطقي، إذا رأيت حساباً كوده (1005)، فهذا الحساب يصنف تحت:', action: { kind: 'selectOption', label: 'الأصول (لأنه يبدأ بـ 1)' } }
        ]
      }
    ]
  }
];
