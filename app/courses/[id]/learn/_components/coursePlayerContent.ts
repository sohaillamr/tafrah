"use client";

import { unit1Content } from "@/data/Unit1Content";
import { unit2Content } from "@/data/Unit2Content";
import { unit3Content } from "@/data/Unit3Content";
import { unit4Content } from "@/data/Unit4Content";
import { unit5Content } from "@/data/Unit5Content";
import { unit6Content } from "@/data/Unit6Content";
import { unit7Content } from "@/data/Unit7Content";
import { pythonUnit1Content } from "@/data/PythonUnit1Content";
import { pythonUnit2Content } from "@/data/PythonUnit2Content";
import { pythonUnit3Content } from "@/data/PythonUnit3Content";
import { pythonUnit4Content } from "@/data/PythonUnit4Content";
import { pythonUnit5Content } from "@/data/PythonUnit5Content";
import { pythonUnit6Content } from "@/data/PythonUnit6Content";
import { pythonUnit7Content } from "@/data/PythonUnit7Content";
import { financeUnit1Content } from "@/data/FinanceUnit1Content";
import { financeUnit2Content } from "@/data/FinanceUnit2Content";
import { financeUnit3Content } from "@/data/FinanceUnit3Content";
import { financeUnit4Content } from "@/data/FinanceUnit4Content";
import { financeUnit5Content } from "@/data/FinanceUnit5Content";
import { financeUnit6Content } from "@/data/FinanceUnit6Content";
import { financeUnit7Content } from "@/data/FinanceUnit7Content";
import { quizzes } from "@/data/quizzes";
import { pythonQuizzes } from "@/data/pythonQuizzes";
import { financeQuizzes } from "@/data/financeQuizzes";

export type StepActionKind =
  | "clickIcon"
  | "inputText"
  | "closeTabs"
  | "selectTab"
  | "selectOption"
  | "clickCell"
  | "typeCell"
  | "setFormat"
  | "styleRow"
  | "addBorders"
  | "filterNames"
  | "sortNumbers"
  | "writeCode";

export type UnitStep = {
  id: string;
  type: "info" | "task";
  instruction: string;
  action?: {
    kind: StepActionKind;
    label?: string;
    options?: string[];
    target?: string;
    expected?: string;
    value?: string;
  };
  extraAction?: {
    kind: StepActionKind;
    target?: string;
    value?: string;
  };
  chapterTitle: string;
};

export type CellData = { value: string; format: "text" | "number" | "date" };

export type QuizQuestion = {
  id: string;
  text: string;
  textEn: string;
  options: { id: string; text: string; textEn: string }[];
  correct: string;
};

export type QuizSet = {
  passingScore: number;
  questions: QuizQuestion[];
};

type RawUnit = { chapters: { steps: Record<string, unknown>[]; [key: string]: unknown }[]; [key: string]: unknown };

export const cleanArabicText = (value: string, language: string) => {
  if (!value || !/[Ã˜Ã™Ãƒ]/.test(value)) return value;
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
};

export const buildSteps = (unit: RawUnit): UnitStep[] => {
  return unit.chapters.flatMap((chapter, chapterIndex) =>
    chapter.steps.map((step, index) => {
      const interactiveOptions = Array.isArray(step.options) ? (step.options as string[]) : undefined;
      const interactiveCorrect =
        typeof step.correctIndex === "number" && interactiveOptions?.[step.correctIndex]
          ? interactiveOptions[step.correctIndex]
          : undefined;
      const action =
        (step.action as UnitStep["action"]) ||
        (interactiveCorrect
          ? { kind: "selectOption" as StepActionKind, label: interactiveCorrect, options: interactiveOptions }
          : undefined);

      return {
        id: `${(unit as { unit_id?: string; id?: string }).unit_id ?? (unit as { id?: string }).id}-${chapterIndex}-${index}`,
        type: action ? "task" : "info",
        instruction: (step as { text?: string; instruction?: string }).text ?? (step as { instruction?: string }).instruction ?? "",
        action,
        extraAction: step.extraAction as UnitStep["extraAction"],
        chapterTitle: (chapter as { title?: string; chapter_title?: string }).title ?? (chapter as { chapter_title?: string }).chapter_title ?? "",
      };
    })
  );
};

export function getCourseUnits(courseSlug: string, category?: string): RawUnit[] {
  const isPython = courseSlug === "programming-1" || category === "python" || category === "البرمجة";
  const isFinance = courseSlug === "finance-1" || category === "finance";
  if (isPython) {
    return [pythonUnit1Content[0], pythonUnit2Content[0], pythonUnit3Content[0], pythonUnit4Content[0], pythonUnit5Content[0], pythonUnit6Content[0], pythonUnit7Content[0]];
  }
  if (isFinance) {
    return [financeUnit1Content[0], financeUnit2Content[0], financeUnit3Content[0], financeUnit4Content[0], financeUnit5Content[0], financeUnit6Content[0], financeUnit7Content[0]];
  }
  return [unit1Content[0], unit2Content[0], unit3Content[0], unit4Content[0], unit5Content[0], unit6Content[0], unit7Content[0]];
}

const conceptPlans = {
  "data-entry-1": {
    en: ["Source data", "Cell type", "Validation", "Cleaning", "Sorting and filtering", "Delivery", "Quality log"],
    ar: ["مصدر البيانات", "نوع الخلية", "التحقق", "تنظيف البيانات", "الفرز والتصفية", "التسليم", "سجل الجودة"],
  },
  "programming-1": {
    en: ["Instruction order", "Variables", "Types", "Conditionals", "Loops", "Functions", "Debugging"],
    ar: ["ترتيب التعليمات", "المتغيرات", "أنواع البيانات", "الشروط", "الحلقات", "الدوال", "تصحيح الأخطاء"],
  },
  "finance-1": {
    en: ["Accounting equation", "Journal entry", "Debit and credit", "Ledger", "Financial statements", "Budgeting", "ERP systems"],
    ar: ["معادلة المحاسبة", "قيد اليومية", "المدين والدائن", "دفتر الأستاذ", "القوائم المالية", "الميزانية", "أنظمة ERP"],
  },
};

const unitFocus = {
  "data-entry-1": {
    en: ["digital setup", "spreadsheet structure", "data cleaning", "email and files", "accuracy and speed", "forms", "final data project"],
    ar: ["إعداد البيئة الرقمية", "بناء الجدول", "تنظيف البيانات", "البريد والملفات", "الدقة والسرعة", "النماذج", "مشروع البيانات النهائي"],
  },
  "programming-1": {
    en: ["printing and comments", "variables and numbers", "strings", "conditions", "lists", "loops", "functions"],
    ar: ["الطباعة والتعليقات", "المتغيرات والأرقام", "النصوص", "الشروط", "القوائم", "الحلقات", "الدوال"],
  },
  "finance-1": {
    en: ["language of money", "transactions", "financial statements", "finance systems", "report reading", "budgeting", "mini finance project"],
    ar: ["لغة المال", "المعاملات", "القوائم المالية", "أنظمة المالية", "قراءة التقارير", "الميزانية", "مشروع مالي مصغر"],
  },
};

const practicePrompts = {
  "data-entry-1": {
    en: [
      "Review one row or one cell before moving forward. Accuracy matters more than speed.",
      "Name the source of the data before changing it.",
      "Check whether the active cell should contain text, a number, or a date.",
      "If a value is missing, mark it for review instead of guessing.",
      "Before sorting or filtering, check that the whole column uses the same data type.",
      "Write one short quality note about what you changed.",
    ],
    ar: [
      "راجع صفا واحدا أو خلية واحدة قبل الانتقال. الدقة أهم من السرعة.",
      "سم مصدر البيانات قبل تعديلها.",
      "تحقق هل الخلية الحالية يجب أن تحتوي نصا أو رقما أو تاريخا.",
      "إذا كانت قيمة مفقودة، ضع علامة مراجعة بدلا من التخمين.",
      "قبل الفرز أو التصفية، تأكد أن العمود كله يستخدم نفس نوع البيانات.",
      "اكتب ملاحظة جودة قصيرة عما تغير.",
    ],
  },
  "programming-1": {
    en: [
      "Read the code one line at a time before running it.",
      "Change one small thing only, then test again.",
      "Check quotes, brackets, and matching variable names.",
      "When an error appears, read the smallest line reference first.",
      "Explain what the code prints before pressing check.",
      "Use a short pause before editing several lines.",
    ],
    ar: [
      "اقرأ الكود سطرا واحدا في كل مرة قبل تشغيله.",
      "غير شيئا صغيرا واحدا فقط، ثم اختبر مرة أخرى.",
      "راجع علامات الاقتباس والأقواس وتطابق أسماء المتغيرات.",
      "عند ظهور خطأ، اقرأ أصغر إشارة للسطر أولا.",
      "اشرح ماذا سيطبع الكود قبل الضغط على تحقق.",
      "خذ استراحة قصيرة قبل تعديل عدة أسطر.",
    ],
  },
  "finance-1": {
    en: [
      "Every number needs a source document or clear reason.",
      "Classify one item at a time: asset, liability, equity, revenue, or expense.",
      "Check that the accounting equation stays balanced.",
      "Use examples and non-examples before memorizing terms.",
      "Do not hide uncertainty. Write a review note.",
      "Connect each report to the question it answers.",
    ],
    ar: [
      "كل رقم يحتاج مستندا أو سببا واضحا.",
      "صنف بندا واحدا في كل مرة: أصل، خصم، حقوق ملكية، إيراد، أو مصروف.",
      "تحقق أن معادلة المحاسبة ما زالت متوازنة.",
      "استخدم مثالا ومثالا عكسيا قبل حفظ المصطلحات.",
      "لا تخف عدم اليقين. اكتب ملاحظة مراجعة.",
      "اربط كل تقرير بالسؤال الذي يجيب عنه.",
    ],
  },
};

function courseKeyFor(courseSlug: string) {
  return courseSlug === "programming-1" || courseSlug === "finance-1" ? courseSlug : "data-entry-1";
}

const choiceStep = (
  id: string,
  chapterTitle: string,
  instruction: string,
  label: string,
  options: string[]
): UnitStep => ({
  id,
  type: "task",
  instruction,
  action: { kind: "selectOption", label, options },
  chapterTitle,
});

export function buildCourseInteractiveLabSteps(courseSlug: string, unitNumber: number, language: string): UnitStep[] {
  const key = courseKeyFor(courseSlug);
  const lang = language === "ar" ? "ar" : "en";
  const chapterTitle = lang === "ar" ? "مختبر تفاعلي هادئ" : "Calm interactive lab";
  const prefix = `${key}-unit-${unitNumber}-interactive-lab`;

  if (key === "data-entry-1") {
    if (unitNumber === 1) {
      return lang === "ar"
        ? [
            { id: `${prefix}-context`, type: "info", instruction: "ستتدرب الآن كموظف إدخال بيانات: تستقبل ملف عميل، تجهز مساحة العمل، تتحقق من رقم هاتف، ثم تكتب القيمة الصحيحة داخل الخلية. خذ خطوة واحدة فقط في كل مرة.", chapterTitle },
            { id: `${prefix}-close-tabs`, type: "task", instruction: "أغلق التبويبات المشتتة واترك فقط: التعليمات، جدول البيانات، والمرجع.", action: { kind: "closeTabs" }, chapterTitle },
            { id: `${prefix}-sheet-tab`, type: "task", instruction: "اختر تبويب جدول البيانات حتى تعمل داخل المكان الصحيح.", action: { kind: "selectTab" }, chapterTitle },
            { id: `${prefix}-drive`, type: "task", instruction: "افتح Google Drive في مساحة الملفات لأن ملف العميل سيحفظ هناك.", action: { kind: "clickIcon" }, chapterTitle },
            { id: `${prefix}-folder`, type: "task", instruction: "أنشئ مجلدا واضح الاسم: تاسكات طفرة 2026", action: { kind: "inputText", expected: "تاسكات طفرة 2026" }, chapterTitle },
            choiceStep(`${prefix}-phone-format`, chapterTitle, "العميل أرسل رقم هاتف. اختر النسخة النظيفة التي تصلح للإدخال في الجدول.", "0501234567", ["0501234 - riyadh", "0501234567", "050 1234567 - RIYADH"]),
            { id: `${prefix}-select-phone-cell`, type: "task", instruction: "اضغط على الخلية B2 لأنها مكان رقم الهاتف في سجل العميل.", action: { kind: "clickCell", target: "B2" }, chapterTitle },
            { id: `${prefix}-type-phone`, type: "task", instruction: "اكتب رقم الهاتف النظيف داخل B2: 0501234567", action: { kind: "typeCell", target: "B2", value: "0501234567" }, chapterTitle },
            choiceStep(`${prefix}-missing-value`, chapterTitle, "إذا كان تاريخ التسجيل غير موجود في المصدر، ما التصرف المهني الصحيح؟", "أضع علامة مراجعة ولا أخمن", ["أخمن تاريخا قريبا", "أضع علامة مراجعة ولا أخمن", "أترك الملف كله", "أحذف اسم العميل"]),
          ]
        : [
            { id: `${prefix}-context`, type: "info", instruction: "You will now work like a data-entry assistant: receive a client file, prepare the workspace, check a phone number, and enter the clean value into the right cell. One step at a time.", chapterTitle },
            { id: `${prefix}-close-tabs`, type: "task", instruction: "Close distracting tabs and keep only Instructions, Spreadsheet, and Reference.", action: { kind: "closeTabs" }, chapterTitle },
            { id: `${prefix}-sheet-tab`, type: "task", instruction: "Choose the Spreadsheet tab so you are working in the correct place.", action: { kind: "selectTab" }, chapterTitle },
            { id: `${prefix}-drive`, type: "task", instruction: "Open Google Drive in the file area because the client file will be saved there.", action: { kind: "clickIcon" }, chapterTitle },
            { id: `${prefix}-folder`, type: "task", instruction: "Create a clear folder named: Tafrah Tasks 2026", action: { kind: "inputText", expected: "Tafrah Tasks 2026" }, chapterTitle },
            choiceStep(`${prefix}-phone-format`, chapterTitle, "The client sent a phone number. Choose the clean version that belongs in the sheet.", "0501234567", ["0501234 - riyadh", "0501234567", "050 1234567 - RIYADH"]),
            { id: `${prefix}-select-phone-cell`, type: "task", instruction: "Click cell B2 because it is the phone-number cell in the client record.", action: { kind: "clickCell", target: "B2" }, chapterTitle },
            { id: `${prefix}-type-phone`, type: "task", instruction: "Type the clean phone number into B2: 0501234567", action: { kind: "typeCell", target: "B2", value: "0501234567" }, chapterTitle },
            choiceStep(`${prefix}-missing-value`, chapterTitle, "If the registration date is missing from the source, what is the professional action?", "Mark for review and do not guess", ["Guess a nearby date", "Mark for review and do not guess", "Stop the whole file", "Delete the client name"]),
          ];
    }

    const targetCell = unitNumber % 2 === 0 ? "D4" : "E3";
    const targetValue = lang === "ar" ? "تمت المراجعة" : "Reviewed";
    return [
      {
        id: `${prefix}-cell-note`,
        type: "task",
        instruction:
          lang === "ar"
            ? `اكتب ملاحظة جودة قصيرة في الخلية ${targetCell}: ${targetValue}`
            : `Type a short quality note in cell ${targetCell}: ${targetValue}`,
        action: { kind: "typeCell", target: targetCell, value: targetValue },
        chapterTitle,
      },
      choiceStep(
        `${prefix}-quality-choice`,
        chapterTitle,
        lang === "ar" ? "قبل تسليم ملف بيانات، ما أفضل فحص أخير؟" : "Before delivering a data file, what is the best final check?",
        lang === "ar" ? "أراجع المصدر ونوع البيانات وخانة فارغة واحدة على الأقل" : "Review the source, data type, and at least one empty cell",
        lang === "ar"
          ? ["أراجع المصدر ونوع البيانات وخانة فارغة واحدة على الأقل", "أغير كل التنسيقات دفعة واحدة", "أحذف الصفوف غير المفهومة", "أرسل الملف دون مراجعة"]
          : ["Review the source, data type, and at least one empty cell", "Change every format at once", "Delete unclear rows", "Send the file without review"]
      ),
    ];
  }

  if (key === "programming-1") {
    const codeLabs: Record<number, { instruction: string; expected: string }> = {
      1: { instruction: "اكتب رسالة واضحة ثم اطبعها:\nmessage = \"جاهز للتدريب\"\nprint(message)", expected: "message = \"جاهز للتدريب\"\nprint(message)" },
      2: { instruction: "احسب مجموع رقمين واحفظ النتيجة:\nfirst = 40\nsecond = 15\ntotal = first + second\nprint(total)", expected: "first = 40\nsecond = 15\ntotal = first + second\nprint(total)" },
      3: { instruction: "ادمج كلمتين برسالة مفهومة:\ncourse = \"Data\"\nskill = \"Entry\"\nprint(course + \" \" + skill)", expected: "course = \"Data\"\nskill = \"Entry\"\nprint(course + \" \" + skill)" },
      4: { instruction: "اكتب شرطا بسيطا للتأكد من النتيجة:\nscore = 85\nif score >= 80:\n    print(\"ناجح\")", expected: "score = 85\nif score >= 80:\n    print(\"ناجح\")" },
      5: { instruction: "اطبع أول عنصر في قائمة مهام:\ntasks = [\"مراجعة\", \"إدخال\", \"تسليم\"]\nprint(tasks[0])", expected: "tasks = [\"مراجعة\", \"إدخال\", \"تسليم\"]\nprint(tasks[0])" },
      6: { instruction: "استخدم حلقة لطباعة كل اسم:\nnames = [\"Sara\", \"Ali\"]\nfor name in names:\n    print(name)", expected: "names = [\"Sara\", \"Ali\"]\nfor name in names:\n    print(name)" },
      7: { instruction: "اكتب دالة تعطي رسالة جاهزية:\ndef ready():\n    print(\"Ready\")\n\nready()", expected: "def ready():\n    print(\"Ready\")\n\nready()" },
    };
    const lab = codeLabs[unitNumber] ?? codeLabs[1];
    return [
      { id: `${prefix}-code`, type: "task", instruction: lab.instruction, action: { kind: "writeCode", expected: lab.expected }, chapterTitle },
      choiceStep(
        `${prefix}-debug-choice`,
        chapterTitle,
        lang === "ar" ? "إذا لم يعمل الكود، ما أول فحص هادئ؟" : "If the code does not work, what is the first calm check?",
        lang === "ar" ? "أراجع سطرا واحدا: الأقواس أو علامات الاقتباس أو المسافات" : "Review one line: brackets, quotes, or indentation",
        lang === "ar"
          ? ["أراجع سطرا واحدا: الأقواس أو علامات الاقتباس أو المسافات", "أحذف الكود كله", "أضغط تحقق بسرعة", "أغير عدة أسطر معا"]
          : ["Review one line: brackets, quotes, or indentation", "Delete all the code", "Press check quickly", "Change several lines together"]
      ),
    ];
  }

  const financeCorrect = lang === "ar" ? "أقرأ المستند ثم أصنف بندا واحدا فقط" : "Read the document, then classify one item only";
  return [
    choiceStep(
      `${prefix}-scenario`,
      chapterTitle,
      lang === "ar" ? "وصل مستند مالي جديد. ما أول خطوة آمنة؟" : "A new finance document arrived. What is the first safe step?",
      financeCorrect,
      lang === "ar"
        ? [financeCorrect, "أسجل الرقم دون مصدر", "أغير اسم الحساب عشوائيا", "أجمع كل الأرقام مرة واحدة"]
        : [financeCorrect, "Record the number without a source", "Rename the account randomly", "Add every number at once"]
    ),
    choiceStep(
      `${prefix}-review-note`,
      chapterTitle,
      lang === "ar" ? "إذا لم تفهم تصنيف الرقم، ماذا تفعل؟" : "If you do not understand a number's classification, what should you do?",
      lang === "ar" ? "أكتب ملاحظة مراجعة وأطلب مثالا" : "Write a review note and ask for an example",
      lang === "ar"
        ? ["أكتب ملاحظة مراجعة وأطلب مثالا", "أخمن التصنيف", "أخفي الرقم", "أكرر نفس الخطأ"]
        : ["Write a review note and ask for an example", "Guess the classification", "Hide the number", "Repeat the same error"]
    ),
  ];
}

export function buildCoursePracticeSteps(courseSlug: string, unitNumber: number, language: string): UnitStep[] {
  const key = courseKeyFor(courseSlug);
  const lang = language === "ar" ? "ar" : "en";
  const prompts = practicePrompts[key][lang];
  const concepts = conceptPlans[key][lang];
  const unitTheme = unitFocus[key][lang][unitNumber - 1] ?? unitFocus[key][lang][0];
  const confirmLabel = lang === "ar" ? "فهمت الخطوة" : "I understand this step";
  const helpLabel = lang === "ar" ? "أحتاج مثالا أبطأ" : "I need a slower example";
  const reviewLabel = lang === "ar" ? "سأراجع لاحقا" : "I will review later";
  const chapterTitle = lang === "ar" ? "تدريب هادئ ومراجعة" : "Calm practice and review";

  return prompts.flatMap<UnitStep>((prompt, index) => {
    const concept = concepts[index % concepts.length];
    const prefix = `${key}-unit-${unitNumber}-practice-${index}`;
    const reflection =
      lang === "ar"
        ? `اربط هذه الخطوة بموضوع الوحدة: ${unitTheme}. اكتب مثالا واحدا عن ${concept}.`
        : `Connect this step to the unit theme: ${unitTheme}. Write one example for ${concept}.`;

    return [
      {
        id: `${prefix}-read`,
        type: "info",
        instruction: prompt,
        chapterTitle,
      },
      {
        id: `${prefix}-confirm`,
        type: "task",
        instruction: reflection,
        action: { kind: "selectOption", label: confirmLabel, options: [confirmLabel, helpLabel, reviewLabel] },
        chapterTitle,
      },
    ];
  });
}

const lengthBalancingStepCounts: Record<string, number[]> = {
  "programming-1": [0, 8, 10, 8, 9, 10, 7],
  "finance-1": [0, 0, 0, 0, 3, 3, 2],
};

const lengthBalancingPrompts = {
  "programming-1": {
    en: [
      ["Trace the code slowly", "Before typing, say what each line will do in order."],
      ["Name the stored value", "Point to the variable name and the value it is holding."],
      ["Check the data type", "Decide whether the value is text, number, list, or a true/false result."],
      ["Predict the output", "Write the printed result in your mind before pressing check."],
      ["Find one tiny error", "Look only for quotes, brackets, capital letters, or indentation."],
      ["Change one input", "Change one number or word, then notice what result changes."],
      ["Explain in plain words", "Describe the code as a short everyday instruction."],
      ["Keep the step small", "Do one edit, test it, then continue to the next edit."],
      ["Review the rule", "Connect the example to one rule from this unit."],
      ["Prepare the next attempt", "If it does not work, return to the last correct line first."],
    ],
    ar: [
      ["تتبع الكود بهدوء", "قبل الكتابة، قل ماذا سيفعل كل سطر بالترتيب."],
      ["سم القيمة المحفوظة", "حدد اسم المتغير والقيمة التي يحتفظ بها."],
      ["راجع نوع البيانات", "قرر هل القيمة نص، رقم، قائمة، أو نتيجة صح/خطأ."],
      ["توقع الناتج", "اكتب الناتج المتوقع في ذهنك قبل الضغط على تحقق."],
      ["ابحث عن خطأ صغير", "راجع علامات الاقتباس، الأقواس، الحروف، أو المسافات فقط."],
      ["غير مدخلا واحدا", "غير رقما أو كلمة واحدة، ثم لاحظ ماذا تغير في الناتج."],
      ["اشرح بكلمات بسيطة", "صف الكود كتعليمة يومية قصيرة وواضحة."],
      ["اجعل الخطوة صغيرة", "نفذ تعديلا واحدا، اختبره، ثم انتقل للتعديل التالي."],
      ["راجع القاعدة", "اربط المثال بقاعدة واحدة من هذه الوحدة."],
      ["استعد للمحاولة التالية", "إذا لم يعمل الكود، ارجع إلى آخر سطر صحيح أولا."],
    ],
  },
  "finance-1": {
    en: [
      ["Read the source first", "Name the document before classifying the number."],
      ["Classify one item", "Choose one category only: asset, liability, equity, revenue, or expense."],
      ["Check the balance", "Make sure the accounting equation still makes sense."],
      ["Use one example", "Compare the term with a simple real-life example."],
      ["Mark uncertainty", "If the number is unclear, write a review note instead of guessing."],
      ["Connect to a report", "Decide which report will use this number later."],
      ["Separate cash from profit", "Ask whether money was received now or only recorded on paper."],
      ["Review the final story", "Say what happened, what changed, and what should be checked next."],
    ],
    ar: [
      ["اقرأ المصدر أولا", "سم المستند قبل تصنيف الرقم."],
      ["صنف بندا واحدا", "اختر فئة واحدة فقط: أصل، خصم، حقوق ملكية، إيراد، أو مصروف."],
      ["راجع التوازن", "تأكد أن معادلة المحاسبة ما زالت منطقية."],
      ["استخدم مثالا واحدا", "قارن المصطلح بمثال بسيط من الحياة اليومية."],
      ["ضع علامة مراجعة", "إذا كان الرقم غير واضح، اكتب ملاحظة مراجعة بدلا من التخمين."],
      ["اربطه بتقرير", "حدد أي تقرير سيستخدم هذا الرقم لاحقا."],
      ["افصل النقد عن الربح", "اسأل هل تم استلام المال الآن أم تم تسجيله فقط."],
      ["راجع القصة النهائية", "قل ماذا حدث، ماذا تغير، وما الذي يجب فحصه بعد ذلك."],
    ],
  },
};

export function buildCourseLengthBalancingSteps(courseSlug: string, unitNumber: number, language: string): UnitStep[] {
  const key = courseKeyFor(courseSlug);
  const extraCount = lengthBalancingStepCounts[key]?.[unitNumber - 1] ?? 0;
  if (extraCount === 0) return [];

  const lang = language === "ar" ? "ar" : "en";
  const prompts = lengthBalancingPrompts[key][lang];
  const chapterTitle = lang === "ar" ? "مراجعة تطبيقية إضافية" : "Additional applied review";
  const doneLabel = lang === "ar" ? "تمت المراجعة" : "Review complete";
  const slowerLabel = lang === "ar" ? "أحتاج مثالا أبطأ" : "I need a slower example";
  const repeatLabel = lang === "ar" ? "سأكرر الخطوة" : "I will repeat the step";

  return Array.from({ length: extraCount }, (_, index) => {
    const [title, prompt] = prompts[index % prompts.length];
    return {
      id: `${key}-unit-${unitNumber}-length-review-${index}`,
      type: "task",
      instruction: `${title}: ${prompt}`,
      action: { kind: "selectOption", label: doneLabel, options: [doneLabel, slowerLabel, repeatLabel] },
      chapterTitle,
    };
  });
}

export function getBaseQuiz(courseSlug: string, unitNumber: number, isPythonCourse: boolean, isFinanceCourse: boolean): QuizSet | undefined {
  if (isPythonCourse) return (pythonQuizzes as Record<number, QuizSet>)[unitNumber];
  if (isFinanceCourse) return (financeQuizzes as Record<number, QuizSet>)[unitNumber];
  return (quizzes as Record<number, QuizSet>)[unitNumber];
}

export function getAccuracyChallengeDescription() {
  return unit2Content[0].challenge.description;
}

export function buildExpandedQuiz(courseSlug: string, unitNumber: number, language: string, baseQuiz: QuizSet): QuizSet {
  const key = courseKeyFor(courseSlug);
  const lang = language === "ar" ? "ar" : "en";
  const concepts = conceptPlans[key][lang];
  const unitTheme = unitFocus[key][lang][unitNumber - 1] ?? unitFocus[key][lang][0];
  const extraQuestions: QuizQuestion[] = concepts.slice(0, 6).map((concept, index) => {
    const id = `review-${key}-${unitNumber}-${index}`;
    const text =
      lang === "ar"
        ? `ما أفضل خطوة هادئة عند مراجعة ${concept} داخل ${unitTheme}؟`
        : `What is the best calm step when reviewing ${concept} in ${unitTheme}?`;
    const correct =
      lang === "ar"
        ? "أراجع قاعدة واحدة ومثالا واحدا"
        : "Review one rule and one example";
    return {
      id,
      text,
      textEn: `What is the best calm step when reviewing ${concept} in ${unitTheme}?`,
      options: [
        { id: "a", text: correct, textEn: "Review one rule and one example" },
        { id: "b", text: lang === "ar" ? "أغير كل شيء مرة واحدة" : "Change everything at once", textEn: "Change everything at once" },
        { id: "c", text: lang === "ar" ? "أتجاهل مصدر الخطأ" : "Ignore the source of the error", textEn: "Ignore the source of the error" },
        { id: "d", text: lang === "ar" ? "أسرع قبل الفهم" : "Go faster before understanding", textEn: "Go faster before understanding" },
      ],
      correct: "a",
    };
  });

  const questions = [...baseQuiz.questions, ...extraQuestions];
  return {
    passingScore: Math.ceil(questions.length * 0.75),
    questions,
  };
}
