"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import TopBar from "@/app/components/TopBar";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useAuth } from "@/app/components/AuthProvider";
import { usePreferencesStore } from "@/lib/store/usePreferencesStore";
import { Lock, Target, MapPin, FileText, Trophy, Star, ArrowRight, RefreshCw, Monitor, FolderOpen, Lightbulb, Pencil, Bot, AlertTriangle, CheckCircle, Volume2, Sparkles, Loader2 } from "lucide-react";
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

type StepActionKind =
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

type UnitStep = {
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

type CellData = { value: string; format: "text" | "number" | "date" };
type QuizQuestion = {
  id: string;
  text: string;
  textEn: string;
  options: { id: string; text: string; textEn: string }[];
  correct: string;
};
type QuizSet = {
  passingScore: number;
  questions: QuizQuestion[];
};

const buildSteps = (unit: { chapters: { steps: Record<string, unknown>[]; [key: string]: unknown }[]; [key: string]: unknown }): UnitStep[] => {
  return unit.chapters.flatMap((chapter, chapterIndex) =>
    chapter.steps.map((step, index) => {
      const interactiveOptions = Array.isArray(step.options) ? (step.options as string[]) : undefined;
      const interactiveCorrect =
        typeof step.correctIndex === "number" && interactiveOptions?.[step.correctIndex]
          ? interactiveOptions[step.correctIndex]
          : undefined;
      const action = (step.action as UnitStep["action"]) || (
        interactiveCorrect
          ? { kind: "selectOption" as StepActionKind, label: interactiveCorrect, options: interactiveOptions }
          : undefined
      );
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

const cleanArabicText = (value: string, language: string) => {
  if (!value || !/[ØÙÃ]/.test(value)) return value;
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
};

const conceptPlans = {
  "data-entry-1": {
    en: [
      ["Source data", "Know where each row came from before editing it."],
      ["Cell type", "Separate names, numbers, dates, and notes so the table stays predictable."],
      ["Validation", "Check one rule at a time instead of trying to inspect the whole file."],
      ["Cleaning", "Fix blanks, duplicates, mixed formats, and impossible values calmly."],
      ["Sorting and filtering", "Ask one question, then use the tool that answers only that question."],
      ["Delivery", "Name files clearly and add a short note about what changed."],
      ["Quality log", "Record uncertain cells so you do not depend on memory."],
    ],
    ar: [
      ["مصدر البيانات", "اعرف من أين جاء كل صف قبل تعديله."],
      ["نوع الخلية", "افصل الأسماء والأرقام والتواريخ والملاحظات حتى يبقى الجدول متوقعا."],
      ["التحقق", "راجع قاعدة واحدة في كل مرة بدلا من فحص الملف كله دفعة واحدة."],
      ["تنظيف البيانات", "صحح الفراغات والتكرار والصيغ المختلطة والقيم غير المنطقية بهدوء."],
      ["الفرز والتصفية", "اسأل سؤالا واحدا ثم استخدم الأداة التي تجيب عنه فقط."],
      ["التسليم", "سم الملفات بوضوح وأضف ملاحظة قصيرة عما تغير."],
      ["سجل الجودة", "اكتب الخلايا غير المؤكدة حتى لا تعتمد على الذاكرة."],
    ],
  },
  "programming-1": {
    en: [
      ["Instruction order", "Python reads one line after another unless control flow changes it."],
      ["Variables", "A variable is a clear name attached to a value you can reuse."],
      ["Types", "Text, numbers, lists, and booleans behave differently."],
      ["Conditionals", "if and else choose one path from a clear question."],
      ["Loops", "Loops repeat a safe pattern without retyping the same code."],
      ["Functions", "A function packages steps so you can run them again."],
      ["Debugging", "Read the smallest error first: line, name, bracket, quote, or indentation."],
    ],
    ar: [
      ["ترتيب التعليمات", "بايثون يقرأ سطرا بعد سطر إلا إذا غير الشرط أو الحلقة المسار."],
      ["المتغيرات", "المتغير اسم واضح لقيمة محفوظة يمكن استخدامها مرة أخرى."],
      ["أنواع البيانات", "النصوص والأرقام والقوائم والقيم المنطقية تتصرف بطرق مختلفة."],
      ["الشروط", "if و else يختاران مسارا واحدا من سؤال واضح."],
      ["الحلقات", "الحلقة تكرر نمطا آمنا بدون إعادة كتابة نفس الكود."],
      ["الدوال", "الدالة تجمع خطوات يمكن تشغيلها مرة أخرى."],
      ["تصحيح الأخطاء", "اقرأ أصغر خطأ أولا: السطر أو الاسم أو القوس أو علامة الاقتباس أو المسافة."],
    ],
  },
  "finance-1": {
    en: [
      ["Accounting equation", "Assets, liabilities, and equity must stay balanced."],
      ["Journal entry", "Record what happened, when it happened, and which accounts changed."],
      ["Debit and credit", "Use sides as a rule system, not as emotional labels."],
      ["Ledger", "Group every account movement in one place for review."],
      ["Financial statements", "Income statement, balance sheet, and cash flow answer different questions."],
      ["Budgeting", "Plan income, essential expenses, variable expenses, and remaining amount."],
      ["ERP systems", "Modern finance tools standardize data across departments."],
    ],
    ar: [
      ["معادلة المحاسبة", "الأصول والخصوم وحقوق الملكية يجب أن تبقى متوازنة."],
      ["قيد اليومية", "سجل ما حدث ومتى حدث وأي حسابات تغيرت."],
      ["المدين والدائن", "استخدم الجانبين كنظام قواعد وليس ككلمات عاطفية."],
      ["دفتر الأستاذ", "اجمع حركة كل حساب في مكان واحد للمراجعة."],
      ["القوائم المالية", "قائمة الدخل والميزانية والتدفقات النقدية تجيب عن أسئلة مختلفة."],
      ["الميزانية", "خطط للدخل والمصروفات الأساسية والمتغيرة والمبلغ المتبقي."],
      ["أنظمة ERP", "أدوات المالية الحديثة توحد البيانات بين الأقسام."],
    ],
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

function getCoursePlan(courseSlug: string, language: string) {
  const key = courseSlug === "programming-1" ? "programming-1" : courseSlug === "finance-1" ? "finance-1" : "data-entry-1";
  const lang = language === "ar" ? "ar" : "en";
  return {
    key,
    concepts: conceptPlans[key][lang],
    unit: unitFocus[key][lang],
  };
}

const coursePracticeMap: Record<string, string[]> = {
  "finance-1": [
    "من OpenStax: المحاسبة تسجل وتلخص وتوصل المعلومات المالية. في طفرة نقرأها كقواعد واضحة لا كحفظ مصطلحات.",
    "من CFI: القوائم المالية ترتبط ببعضها. الدخل يؤثر على حقوق الملكية، والميزانية تعرض الوضع في لحظة محددة.",
    "خطوة بطيئة: اختر مصطلحا واحدا فقط من هذه الوحدة واكتب له مثالين: مثال صحيح ومثال غير صحيح.",
    "قاعدة تحقق: أي رقم مالي يجب أن يكون له مصدر. اسأل: هل جاء من أصل، خصم، حقوق ملكية، إيراد، أو مصروف؟",
    "تدريب جدول: اكتب ثلاثة أعمدة: البند، التصنيف، سبب التصنيف. املأ صفا واحدا فقط الآن.",
    "راجع المعادلة بصوت هادئ: الأصول = الخصوم + حقوق الملكية. لا تنتقل قبل أن تعرف الطرفين.",
    "إذا وجدت خطأ، لا تبدأ من جديد. ارجع خطوة واحدة وحدد أين اختل التوازن.",
    "من Dynamics 365 Finance: الأنظمة الحديثة تستخدم شجرة حسابات وأبعاد مالية لتوحيد التسجيل عبر الأقسام.",
    "تدريب ERP مبسط: تخيل فاتورة بيع. ما القسم الذي يتأثر؟ المبيعات، المخزون، المالية، أم الثلاثة؟",
    "اكتب جملة تلخيص: الهدف من هذه الوحدة هو ____.",
    "سؤال مراجعة: ما الكلمة التي تحتاج مثالا إضافيا؟ أصل، خصم، مدين، دائن، دفتر، أو تقرير.",
    "استراحة معرفية: توقف 30 ثانية، ثم راجع بطاقة واحدة فقط من بطاقات الدرس.",
  ],
  "programming-1": [
    "من Python Tutorial: البرنامج ينفذ التعليمات بالترتيب. اقرأ السطر الأول، ثم الثاني، ثم توقع الناتج.",
    "من Microsoft Learn: جرب تغييرا صغيرا واحدا في كل مرة. لا تغير الاسم والرقم والمنطق معا.",
    "اكتب الكود كما هو مرة واحدة. الهدف هنا بناء الذاكرة العضلية وليس السرعة.",
    "أضف تعليق يبدأ بعلامة # يشرح لماذا كتبت هذا السطر.",
    "افصل بين الاسم والقيمة: المتغير هو اسم يشير إلى قيمة محفوظة.",
    "إذا ظهر خطأ، اقرأ آخر سطر في رسالة الخطأ أولا. غالبا يخبرك بمكان البداية.",
    "لا نركز على اختلافات عربية داخل النص المطبوع مثل ة/ه. المهم هنا بنية الكود الصحيحة.",
    "تدريب توقع: قبل التشغيل، اكتب في ذهنك أو على ورقة: ماذا سيطبع البرنامج؟",
    "تدريب تعديل: غيّر قيمة واحدة فقط ثم شغل الكود.",
    "تدريب مراجعة: هل الأقواس مغلقة؟ هل علامات الاقتباس زوجية؟ هل اسم المتغير متطابق؟",
    "اكتب جملة تلخيص: هذا الكود يفعل ____.",
    "استراحة معرفية: توقف 30 ثانية ثم ارجع لسطر واحد فقط.",
  ],
  "data-entry-1": [
    "من Microsoft Excel: المصنف يحتوي أوراق عمل، والخلية لها عنوان من حرف عمود ورقم صف مثل B2.",
    "من Google Applied Digital Skills: الهدف العملي هو تنظيم البيانات حتى يسهل قراءتها ومراجعتها.",
    "راجع الصف أو الخلية قبل الانتقال. الدقة أهم من السرعة.",
    "اكتب قاعدة واحدة تمنع الخطأ: تنسيق رقم، تاريخ، اسم، أو عنوان خلية.",
    "افحص ثلاث خلايا فقط: هل كل خلية نص أم رقم أم تاريخ؟",
    "إذا كان الاسم فارغا، لا تخمن. ضع علامة مراجعة أو ارجع للمصدر.",
    "إذا كان الرقم يحتوي حروفا، افصله قبل إدخاله في عمود الأرقام.",
    "إذا كان التاريخ غير منطقي، مثل يوم 40، توقف وصحح قبل الفرز أو الفلترة.",
    "تدريب فلترة: اسأل سؤالا واحدا فقط للبيانات، مثل: من يبدأ اسمه بحرف م؟",
    "تدريب فرز: قبل الفرز، تأكد أن العمود كله أرقام وليس نصا مختلطا.",
    "اكتب جملة تلخيص: جودة البيانات تعني ____.",
    "استراحة معرفية: توقف 30 ثانية ثم راجع خلية واحدة فقط.",
  ],
};

const coursePracticeMapEn: Record<string, string[]> = {
  "finance-1": [
    "From OpenStax: accounting records, summarizes, and communicates financial information. In Tafrah, read it as clear rules, not memorized jargon.",
    "From CFI: financial statements connect to each other. Income affects equity, and the balance sheet shows a point in time.",
    "Slow practice: choose one term from this unit and write one correct example and one non-example.",
    "Check rule: every financial number needs a source. Ask whether it came from an asset, liability, equity, revenue, or expense.",
    "Table practice: write three columns: item, classification, reason. Fill one row only now.",
    "Read the equation calmly: Assets = Liabilities + Equity. Do not move forward until both sides make sense.",
    "If there is an error, do not restart. Go back one step and find where balance changed.",
    "From Dynamics 365 Finance: modern systems use charts of accounts and dimensions to standardize recording across departments.",
    "Simple ERP practice: imagine a sales invoice. Which departments are affected: sales, inventory, finance, or all three?",
    "Write one summary sentence: the goal of this unit is ____.",
    "Review question: which word needs another example: asset, liability, debit, credit, ledger, or report?",
    "Cognitive pause: stop for 30 seconds, then review one lesson card only.",
  ],
  "programming-1": [
    "From the Python tutorial: a program runs instructions in order. Read line one, then line two, then predict the output.",
    "From Microsoft Learn: change one small thing at a time. Do not change the name, number, and logic together.",
    "Copy the code once exactly. The goal is steady pattern memory, not speed.",
    "Add one comment that starts with # and says why this line exists.",
    "Separate name and value: a variable is a name pointing to a stored value.",
    "When an error appears, read the last line of the error message first.",
    "Do not focus on Arabic spelling differences inside printed text. Focus on correct code structure.",
    "Prediction practice: before running, write what the program will print.",
    "Edit practice: change one value only, then run the code.",
    "Review practice: check quotes, brackets, and matching variable names.",
    "Write one summary sentence: this code does ____.",
    "Cognitive pause: stop for 30 seconds, then return to one line only.",
  ],
  "data-entry-1": [
    "From Microsoft Excel: a workbook contains sheets, and each cell has an address like B2.",
    "From Google Applied Digital Skills: the practical goal is to organize data so it is easy to read and review.",
    "Review one row or one cell before moving forward. Accuracy matters more than speed.",
    "Write one rule that prevents error: number format, date format, name format, or cell address.",
    "Check three cells only: is each cell text, number, or date?",
    "If a name is empty, do not guess. Mark it for review or return to the source.",
    "If a number contains letters, separate the issue before entering it in a number column.",
    "If a date is impossible, stop and correct it before sorting or filtering.",
    "Filter practice: ask one question of the data, such as: who starts with M?",
    "Sort practice: before sorting, make sure the whole column is numbers, not mixed text.",
    "Write one summary sentence: data quality means ____.",
    "Cognitive pause: stop for 30 seconds, then review one cell only.",
  ],
};

const buildCoursePracticeSteps = (courseSlug: string, unitNumber: number, language: string): UnitStep[] => {
  const sourceMap = language === "ar" ? coursePracticeMap : coursePracticeMapEn;
  const prompts = sourceMap[courseSlug] || sourceMap["data-entry-1"];
  const sourceReviewSteps: UnitStep[] = prompts.map((instruction, index) => ({
    id: `${courseSlug}-unit-${unitNumber}-practice-${index}`,
    type: index % 3 === 2 ? "task" : "info",
    instruction,
    action:
      index % 3 === 2
        ? {
            kind: "selectOption",
            label: language === "ar" ? "فهمت الخطوة" : "I understand this step",
            options:
              language === "ar"
                ? ["فهمت الخطوة", "أحتاج مثالا آخر", "سأراجع لاحقا"]
                : ["I understand this step", "I need another example", "I will review later"],
          }
        : undefined,
    chapterTitle: "تدريب تطبيقي ومراجعة من المصادر",
  }));
  return [...sourceReviewSteps, ...buildDeepExpansionSteps(courseSlug, unitNumber, language)];
};

const buildDeepExpansionSteps = (courseSlug: string, unitNumber: number, language: string): UnitStep[] => {
  const plan = getCoursePlan(courseSlug, language);
  const unitTheme = cleanArabicText(plan.unit[unitNumber - 1] ?? plan.unit[0], language);
  const concepts = plan.concepts.map(([title, description]) => [
    cleanArabicText(title, language),
    cleanArabicText(description, language),
  ]);
  const chapterTitle = language === "ar" ? "توسيع معرفي بأسلوب طفرة" : "Tafrah deep learning expansion";
  const confirmLabel = language === "ar" ? "أستطيع شرحها بخطوة واحدة" : "I can explain it in one step";
  const helpLabel = language === "ar" ? "أحتاج مثالا أبطأ" : "I need a slower example";
  const reviewLabel = language === "ar" ? "سأراجعها بعد الاستراحة" : "I will review it after a pause";

  return concepts.flatMap<UnitStep>(([title, description], conceptIndex) => {
    const prefix = `${courseSlug}-unit-${unitNumber}-deep-${conceptIndex}`;
    const selectedSteps =
      language === "ar"
        ? [
            `المفهوم ${conceptIndex + 1}: ${title}. ${description} اربطه بموضوع هذه الوحدة: ${unitTheme}.`,
            "لماذا يهم؟ لأنه يقلل عدد القرارات في نفس اللحظة. اجعل قاعدة واحدة واضحة أمامك ثم طبقها قبل الانتقال للقاعدة التالية.",
            "ملاحظة من المصادر: قارن شرح الدورة بالمراجع الموثوقة، ثم اكتب أبسط صياغة بكلماتك.",
            `مثال محلول: اختر حالة صغيرة من ${unitTheme}. حدد ما تعرفه، وما ينقصك، وما يجب التحقق منه.`,
            "فعل خطوة واحدة: نفذ الخطوة المرئية التالية فقط. لا تحاول حل المهمة كلها في ذهنك قبل البداية.",
            "خطأ شائع: الاستعجال للإجابة قبل فحص المصدر أو النوع أو القاعدة. توقف وسم القاعدة أولا.",
            `مراجعة قصيرة: اشرح ${title} بجملة واحدة ومثال واحد ومثال عكسي واحد.`,
            "استراحة معرفية: انظر بعيدا 20 ثانية، خذ نفسا واحدا، ثم ارجع لنفس السطر أو الخلية.",
          ]
        : [
            `Concept ${conceptIndex + 1}: ${title}. ${description} Connect it to this unit theme: ${unitTheme}.`,
            "Why it matters: this idea helps you make fewer decisions at once. Keep one rule visible, then apply it before moving to the next rule.",
            "Source-based note: compare the course explanation with trusted references, then write the simplest version in your own words.",
            `Worked example: choose one small case from ${unitTheme}. Label what you know, what is missing, and what you must check.`,
            "One-step action: complete only the next visible action. Do not solve the whole task in your head before starting.",
            "Common mistake: rushing to the answer before checking the source, the type, or the rule. Pause and name the rule first.",
            `Reflection: explain ${title} using one sentence, one example, and one non-example.`,
            "Cognitive pause: look away for 20 seconds, breathe once, then return to the exact line or cell you were using.",
          ];

    return selectedSteps.map<UnitStep>((instruction, stepIndex) => ({
      id: `${prefix}-${stepIndex}`,
      type: stepIndex === 4 || stepIndex === 6 ? "task" : "info",
      instruction,
      action:
        stepIndex === 4 || stepIndex === 6
          ? {
              kind: "selectOption",
              label: confirmLabel,
              options: [confirmLabel, helpLabel, reviewLabel],
            }
          : undefined,
      chapterTitle,
    }));
  });
};

const buildExpandedQuiz = (courseSlug: string, unitNumber: number, language: string, baseQuiz: QuizSet): QuizSet => {
  const plan = getCoursePlan(courseSlug, language);
  const concepts = plan.concepts.map(([title]) => cleanArabicText(title, language));
  const unitTheme = cleanArabicText(plan.unit[unitNumber - 1] ?? plan.unit[0], language);
  const courseLabel =
    courseSlug === "programming-1"
      ? { en: "Python", ar: "بايثون" }
      : courseSlug === "finance-1"
        ? { en: "finance", ar: "المالية" }
        : { en: "data entry", ar: "إدخال البيانات" };
  const distractors =
    courseSlug === "programming-1"
      ? {
          en: ["Rewrite everything at once", "Ignore the error message", "Focus on Arabic letter spelling instead of code structure"],
          ar: ["إعادة كتابة كل شيء مرة واحدة", "تجاهل رسالة الخطأ", "التركيز على اختلافات الحروف العربية بدل بنية الكود"],
        }
      : courseSlug === "finance-1"
        ? {
            en: ["Guess the number", "Ignore the source document", "Hide the report if it feels hard"],
            ar: ["تخمين الرقم", "تجاهل مستند المصدر", "إخفاء التقرير إذا كان صعبا"],
          }
        : {
            en: ["Guess missing values", "Change all columns at once", "Skip the final review"],
            ar: ["تخمين القيم الناقصة", "تعديل كل الأعمدة مرة واحدة", "تخطي المراجعة النهائية"],
          };
  const extraQuestions: QuizQuestion[] = Array.from({ length: 12 }, (_, index) => {
    const concept = concepts[index % concepts.length];
    const qNumber = index + 1;
    const textEn =
      qNumber % 3 === 1
        ? `In ${courseLabel.en}, what is the safest first step when working with ${concept} in ${unitTheme}?`
        : qNumber % 3 === 2
          ? `Which habit best supports an autistic learner while practicing ${concept}?`
          : `What should you do before moving from ${concept} to the next idea?`;
    const textAr =
      qNumber % 3 === 1
        ? `في ${courseLabel.ar}، ما أول خطوة آمنة عند التعامل مع ${concept} داخل ${unitTheme}؟`
        : qNumber % 3 === 2
          ? `أي عادة تساعد المتعلم التوحدي أكثر أثناء تدريب ${concept}؟`
          : `ماذا تفعل قبل الانتقال من ${concept} إلى الفكرة التالية؟`;
    const correctEn =
      qNumber % 3 === 1
        ? "Check the source and apply one clear rule"
        : qNumber % 3 === 2
          ? "Use a predictable small step and a short pause"
          : "Explain it with one example and one non-example";
    const correctAr =
      qNumber % 3 === 1
        ? "فحص المصدر وتطبيق قاعدة واحدة واضحة"
        : qNumber % 3 === 2
          ? "استخدام خطوة صغيرة متوقعة مع استراحة قصيرة"
          : "شرحها بمثال واحد ومثال عكسي واحد";

    return {
      id: `expanded-${courseSlug}-${unitNumber}-${index}`,
      text: textAr,
      textEn,
      options: [
        { id: "a", text: correctAr, textEn: correctEn },
        { id: "b", text: distractors.ar[0], textEn: distractors.en[0] },
        { id: "c", text: distractors.ar[1], textEn: distractors.en[1] },
        { id: "d", text: distractors.ar[2], textEn: distractors.en[2] },
      ],
      correct: "a",
    };
  });
  const questions = [...baseQuiz.questions, ...extraQuestions];

  return {
    passingScore: Math.ceil(questions.length * 0.75),
    questions,
  };
};

type CourseState = {
  courseKey: string;
  currentStep: number;
  validatedSteps: Record<number, boolean>;
  needsSync: boolean;
  initCourse: (key: string) => void;
  markStepValid: (step: number) => void;
  nextStep: (totalSteps: number) => void;
  prevStep: () => void;
  reset: () => void;
  markSynced: () => void;
};

const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courseKey: "",
      currentStep: 0,
      validatedSteps: {},
      needsSync: false,
      initCourse: (key) =>
        set((state) => {
          if (state.courseKey !== key) {
            return { courseKey: key, currentStep: 0, validatedSteps: {}, needsSync: true };
          }
          return state;
        }),
      markStepValid: (step) =>
        set((state) => ({
          validatedSteps: { ...state.validatedSteps, [step]: true },
          needsSync: true,
        })),
      nextStep: (totalSteps) =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, totalSteps - 1),
          needsSync: true,
        })),
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
          needsSync: true,
        })),
      reset: () =>
        set({
          currentStep: 0,
          validatedSteps: {},
          needsSync: true,
        }),
      markSynced: () =>
        set({
          needsSync: false,
        }),
    }),
    {
      name: "tafrah-course-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const initialTabs = [
  { id: "instructions", label: "التعليمات" },
  { id: "sheet", label: "جدول البيانات" },
  { id: "reference", label: "المرجع" },
  { id: "youtube", label: "YouTube" },
  { id: "instagram", label: "Instagram" },
];

const passwordOptions = ["123456", "Tafrah#2026!Success", "password", "tafrah2026"];

export default function CoursePlayerShell({ courseId, courseSlug, initialSteps, category }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [focusMode, setFocusMode] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationStatus, setValidationStatus] = useState<"success" | "error" | "">("");
  const [nourHelp, setNourHelp] = useState("");
  const [nourWarning, setNourWarning] = useState("");
  const [showNour, setShowNour] = useState(false);
  const [driveClicked, setDriveClicked] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderCreated, setFolderCreated] = useState(false);
  const [openTabs, setOpenTabs] = useState(initialTabs.map((tab) => tab.id));

  const { language } = useLanguage();
  const { user } = useAuth();
  const { category: userCategory, preferences } = usePreferencesStore();
  const [isSummarizing, setIsSummarizing] = useState(false);

  const {
    currentStep, validatedSteps, nextStep, prevStep, markStepValid, initCourse, reset,
    needsSync, markSynced
  } = useCourseStore();

  const unitIndexFromUrl = searchParams.get("unit");
  const unitIndex = unitIndexFromUrl ? parseInt(unitIndexFromUrl) : 0;
  const courseKey = courseSlug || String(courseId);
  const progressStorageKey = useCallback(
    (unit: number, suffix: "done" | "quiz_passed") => `${courseKey}:unit${unit}:${suffix}`,
    [courseKey]
  );

  // Initialize course explicitly so we don't mix progression between units or courses
  useEffect(() => {
    initCourse(`${courseKey}-${unitIndex}`);
  }, [courseKey, unitIndex, initCourse]);

  // Background Sync to API Endpoint (30s delay)
  useEffect(() => {
    if (!needsSync || !user) return;
    
    const syncProgress = async () => {
      try {
        const payload = {
          courseSlug,
          unitIndex,
          stepIndex: currentStep,
          quizPassed: validatedSteps[currentStep] || false,
        };
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        markSynced();
      } catch (err) {
        console.error("Delayed progression sync failed:", err);
      }
    };

    const timer = setTimeout(syncProgress, 30000);
    return () => clearTimeout(timer);
  }, [currentStep, validatedSteps, needsSync, user, courseSlug, unitIndex, markSynced]);
  const [activeTab, setActiveTab] = useState(initialTabs[0].id);
  const [selectedPassword, setSelectedPassword] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [cells, setCells] = useState<Record<string, CellData>>({});
  const [activeCell, setActiveCell] = useState("A1");
  const [rowStyles, setRowStyles] = useState<Record<number, { bg: string; color: string }>>({});
  const [bordersApplied, setBordersApplied] = useState(false);
  const [filterPrefix, setFilterPrefix] = useState<string | null>(null);
  const [sortApplied, setSortApplied] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [challengeActive, setChallengeActive] = useState(false);
  const [challengeFeedback, setChallengeFeedback] = useState("");
  const [challengeStatus, setChallengeStatus] = useState<"success" | "error" | "">("");
  const [unitsDone, setUnitsDone] = useState<Record<number, boolean>>({});
  const [quizzesPassed, setQuizzesPassed] = useState<Record<number, boolean>>({});
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [datasetSeeded, setDatasetSeeded] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [pythonSelectOption, setPythonSelectOption] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          courses: "الدورات",
          course: "الدورة",
          learn: "التعلم",
          title: "الدورة غير متاحة حالياً",
          unit1Title: "الوحدة ١: تأسيس البيئة الرقمية",
          unit2Title: "الوحدة ٢: إتقان جداول البيانات",
          unit3Title: "الوحدة ٣: تنظيف البيانات وتصحيح الأخطاء",
          unit4Title: "الوحدة ٤: إدارة البريد والملفات",
          unit5Title: "الوحدة ٥: دقة الإنتاج وسرعة التنفيذ",
          unit6Title: "الوحدة ٦: العمل مع نماذج العملاء",
          unit7Title: "الوحدة ٧: مشروع نهائي",
          focusOn: "تفعيل وضع التركيز",
          focusOff: "إلغاء وضع التركيز",
          unitNav: "تنقل الوحدات",
          unit1Button: "الوحدة ١",
          unit2Button: "الوحدة ٢",
          unit3Button: "الوحدة ٣",
          unit4Button: "الوحدة ٤",
          unit5Button: "الوحدة ٥",
          unit6Button: "الوحدة ٦",
          unit7Button: "الوحدة ٧",
          currentUnit: "الوحدة الحالية",
          courseProgress: "تقدم الدورة",
          unitsCompleted: "وحدات مكتملة",
          unitProgress: "تقدم الوحدة",
          stepsTitle: "الفصول",
          simulator: "المحاكاة المبسطة",
          gridSimulator: "محاكي الجدول",
          fileExplorer: "الملفات",
          passwordTitle: "كلمة المرور",
          createFolder: "إنشاء مجلد",
          workArea: "منطقة العمل",
          check: "تحقق",
          correct: "تمت الخطوة بنجاح. انتقل للخطوة التالية.",
          retry: "حاول مرة أخرى، راجع الحروف بدقة.",
          askNour: "اسأل نور",
          nourHelp: "الشرح المبسط: اقرأ المطلوب ونفذه خطوة خطوة.",
          nourNumberOnly: "هذه الخلية تقبل الأرقام فقط. يرجى مسح النص وكتابة رقم.",
          nourDateOnly: "هذه الخلية مخصصة للتاريخ. يرجى كتابة تاريخ صحيح.",
          nourPrefix: "هل تحتاج مساعدة؟ تذكر أن تضغط على",
          nourSuffix: "للمتابعة.",
          prev: "السابق",
          next: "التالي",
          completed: "تم إكمال الوحدة ١ بنجاح.",
          badgeUnit1: "شهادة الوحدة ١",
          badgeUnit2: "شهادة الوحدة ٢",
          badgeUnit3: "شهادة الوحدة ٣",
          badgeUnit4: "شهادة الوحدة ٤",
          badgeUnit5: "شهادة الوحدة ٥",
          badgeUnit6: "شهادة الوحدة ٦",
          badgeUnit7: "شهادة الوحدة ٧",
          quizTitle: "اختبار الوحدة",
          quizInstruction: "أجب على جميع الأسئلة لاجتياز الاختبار والانتقال للوحدة التالية.",
          quizSubmit: "إرسال الإجابات",
          quizRetry: "إعادة المحاولة",
          quizPassed: "تم اجتياز الاختبار بنجاح! يمكنك الآن الانتقال للوحدة التالية.",
          quizFailed: "لم تجتز الاختبار. راجع الدروس وحاول مرة أخرى.",
          quizScoreLabel: "النتيجة",
          quizLocked: "مقفلة - أكمل اختبار الوحدة السابقة أولاً",
          startQuiz: "ابدأ الاختبار",
          nextUnit: "ابدأ الوحدة التالية",
          comingSoon: "هذه الدورة متاحة قريباً.",
          lessonEnds: "ينتهي الدرس بعد إكمال كل الخطوات والحصول على الشارة.",
          stepLabel: "الخطوة",
          of: "من",
          infoOnly: "هذه معلومة للقراءة فقط.",
          taskLabel: "المطلوب",
          simpleTabs: "تبويبات العمل",
          closeExtraTabs: "إغلاق التبويبات غير الضرورية",
          openTab: "اختر التبويب النشط",
          gridHint: "نفذ المطلوب داخل الجدول فقط في هذا القسم.",
          formatLabel: "نوع البيانات",
          formatText: "نص",
          formatNumber: "رقم",
          formatDate: "تاريخ",
          headerStyle: "تنسيق رأس الجدول",
          applyHeader: "تطبيق لون الرأس",
          applyBorders: "إضافة حدود A1:D10",
          applyFilter: "تطبيق Filter (حرف م)",
          applySort: "ترتيب العمود B تصاعدياً",
          accuracyChallenge: "تحدي الدقة",
          startChallenge: "ابدأ التحدي",
          checkChallenge: "تحقق من التصحيحات",
          challengeSuccess:
            "أنت الآن تمتلك مهارة التدقيق التقني، وهي مهارة تطلبها شركات مثل (راية) و(أمازون).",
        }
      : {
          home: "Home",
          courses: "Courses",
          course: "Course",
          learn: "Learning",
          title: "Course unavailable",
          unit1Title: "Unit 1: Digital foundation",
          unit2Title: "Unit 2: Spreadsheet mastery",
          unit3Title: "Unit 3: Data cleaning and QA",
          unit4Title: "Unit 4: Email and files",
          unit5Title: "Unit 5: Accuracy and speed",
          unit6Title: "Unit 6: Client forms",
          unit7Title: "Unit 7: Final project",
          focusOn: "Enable focus mode",
          focusOff: "Disable focus mode",
          unitNav: "Unit navigation",
          unit1Button: "Unit 1",
          unit2Button: "Unit 2",
          unit3Button: "Unit 3",
          unit4Button: "Unit 4",
          unit5Button: "Unit 5",
          unit6Button: "Unit 6",
          unit7Button: "Unit 7",
          currentUnit: "Current unit",
          courseProgress: "Course progress",
          unitsCompleted: "Units completed",
          unitProgress: "Unit progress",
          stepsTitle: "Chapters",
          simulator: "Simple simulator",
          gridSimulator: "Grid simulator",
          fileExplorer: "Files",
          passwordTitle: "Password",
          createFolder: "Create folder",
          workArea: "Work area",
          check: "Check",
          correct: "Step completed. Move to the next step.",
          retry: "Try again. Check the letters carefully.",
          askNour: "Ask Nour",
          nourHelp: "Simple explanation: read the task and follow each step.",
          nourNumberOnly: "This cell accepts numbers only. Please clear the text and enter a number.",
          nourDateOnly: "This cell is for dates. Please enter a valid date.",
          nourPrefix: "Need help? Remember to press",
          nourSuffix: "to continue.",
          prev: "Previous",
          next: "Next",
          completed: "Unit 1 completed successfully.",
          badgeUnit1: "Unit 1 Certified",
          badgeUnit2: "Unit 2 Certified",
          badgeUnit3: "Unit 3 Certified",
          badgeUnit4: "Unit 4 Certified",
          badgeUnit5: "Unit 5 Certified",
          badgeUnit6: "Unit 6 Certified",
          badgeUnit7: "Unit 7 Certified",
          quizTitle: "Unit Quiz",
          quizInstruction: "Answer all questions to pass the quiz and unlock the next unit.",
          quizSubmit: "Submit answers",
          quizRetry: "Try again",
          quizPassed: "Quiz passed! You can now move to the next unit.",
          quizFailed: "Quiz not passed. Review the lessons and try again.",
          quizScoreLabel: "Score",
          quizLocked: "Locked - complete the previous unit's quiz first",
          startQuiz: "Start quiz",
          nextUnit: "Start next unit",
          comingSoon: "This course is available soon.",
          lessonEnds: "The lesson ends after completing all steps and earning the badge.",
          stepLabel: "Step",
          of: "of",
          infoOnly: "This is a reading-only step.",
          taskLabel: "Task",
          simpleTabs: "Work tabs",
          closeExtraTabs: "Close extra tabs",
          openTab: "Choose active tab",
          gridHint: "Use only the grid area to complete this step.",
          formatLabel: "Data type",
          formatText: "Text",
          formatNumber: "Number",
          formatDate: "Date",
          headerStyle: "Header styling",
          applyHeader: "Apply header color",
          applyBorders: "Apply borders A1:D10",
          applyFilter: "Apply Filter (starts with م)",
          applySort: "Sort column B ascending",
          accuracyChallenge: "Accuracy challenge",
          startChallenge: "Start the challenge",
          checkChallenge: "Check fixes",
          challengeSuccess:
            "You now have technical auditing skills, a skill requested by companies like Raya and Amazon.",
        };

  const unitParam = searchParams?.get("unit");
  const unitNumber = Math.max(1, Math.min(7, Number(unitParam) || 1));
  const activeCourseId = courseKey;
  const isPythonCourse = courseSlug === "programming-1" || category === "python" || category === "البرمجة";
  const dataEntryUnits: { chapters: { steps: Record<string, unknown>[]; [key: string]: unknown }[]; [key: string]: unknown }[] = [unit1Content[0], unit2Content[0], unit3Content[0], unit4Content[0], unit5Content[0], unit6Content[0], unit7Content[0]];
  const pythonUnits: { chapters: { steps: Record<string, unknown>[]; [key: string]: unknown }[]; [key: string]: unknown }[] = [pythonUnit1Content[0], pythonUnit2Content[0], pythonUnit3Content[0], pythonUnit4Content[0], pythonUnit5Content[0], pythonUnit6Content[0], pythonUnit7Content[0]];
  const isFinanceCourse = courseSlug === "finance-1" || category === "finance"; 
  const financeUnits: { chapters: { steps: Record<string, unknown>[]; [key: string]: unknown }[]; [key: string]: unknown }[] = [financeUnit1Content[0], financeUnit2Content[0], financeUnit3Content[0], financeUnit4Content[0], financeUnit5Content[0], financeUnit6Content[0], financeUnit7Content[0]];
  const allUnits = isPythonCourse ? pythonUnits : isFinanceCourse ? financeUnits : dataEntryUnits;
  const currentUnit = allUnits[unitNumber - 1];
  const steps = useMemo(() => [...buildSteps(currentUnit), ...buildCoursePracticeSteps(courseKey, unitNumber, language)], [currentUnit, courseKey, unitNumber, language]);
  const step = steps[currentStep];
  const canGoNext = validatedSteps[currentStep];
  const isAvailable = true; // previously: courseId === "data-entry-1" || courseId === "programming-1";
  const isLastStep = currentStep === steps.length - 1;
  const isCompleted = isLastStep && validatedSteps[currentStep];
  const nourTarget = step?.action?.label ?? labels.next;
  const dataEntryUnitTitles = [labels.unit1Title, labels.unit2Title, labels.unit3Title, labels.unit4Title, labels.unit5Title, labels.unit6Title, labels.unit7Title];
  const pythonUnitTitlesAr = ["الوحدة ١: مقدمة في البرمجة", "الوحدة ٢: المتغيرات وأنواع البيانات", "الوحدة ٣: العمليات والمقارنات", "الوحدة ٤: الشروط والقرارات", "الوحدة ٥: الحلقات والتكرار", "الوحدة ٦: الدوال", "الوحدة ٧: مشروع نهائي"];
  const pythonUnitTitlesEn = ["Unit 1: Intro to Programming", "Unit 2: Variables & Data Types", "Unit 3: Operations & Comparisons", "Unit 4: Conditions & Decisions", "Unit 5: Loops & Iteration", "Unit 6: Functions", "Unit 7: Final Project"];
  const financeUnitTitlesAr = ["الوحدة ١: لغة المال", "الوحدة ٢: قصة معاملة", "الوحدة ٣: الصورة الكبرى", "الوحدة ٤: المحاسبة في العالم التقني"];
  const financeUnitTitlesEn = ["Unit 1: Language of Money", "Unit 2: Story of a Transaction", "Unit 3: The Big Picture", "Unit 4: Tech World Accounting"];
  const financeUnitTitlesCleanAr = ["الوحدة ١: لغة المال", "الوحدة ٢: قصة معاملة", "الوحدة ٣: الصورة الكبرى", "الوحدة ٤: المحاسبة التقنية", "الوحدة ٥: قراءة التقارير", "الوحدة ٦: الميزانية", "الوحدة ٧: مشروع مالي"];
  const financeUnitTitlesCleanEn = ["Unit 1: Language of Money", "Unit 2: Story of a Transaction", "Unit 3: The Big Picture", "Unit 4: Tech Accounting", "Unit 5: Reading Reports", "Unit 6: Budgeting", "Unit 7: Finance Project"];
  const unitTitles = isPythonCourse ? (language === "ar" ? pythonUnitTitlesAr : pythonUnitTitlesEn) : isFinanceCourse ? (language === "ar" ? financeUnitTitlesCleanAr : financeUnitTitlesCleanEn) : dataEntryUnitTitles;
  const unitTitle = unitTitles[unitNumber - 1];
  const shouldShowCodeEditor = isPythonCourse;
  const shouldShowTabs =
    !isPythonCourse && (step?.action?.kind === "closeTabs" || step?.action?.kind === "selectTab");
  const shouldShowFiles =
    !isPythonCourse && (step?.action?.kind === "clickIcon" || step?.action?.kind === "inputText");
  const shouldShowPassword = !isPythonCourse && !isFinanceCourse && step?.action?.kind === "selectOption" && !step?.action?.options;
  const shouldShowChoiceOptions = !isPythonCourse && step?.action?.kind === "selectOption";
  const shouldShowPythonOptions = isPythonCourse && step?.action?.kind === "selectOption";
  const shouldShowGridControls = !isPythonCourse && !isFinanceCourse && unitNumber >= 2 && step?.type === "task" && !challengeActive;
  const shouldShowGrid = !isPythonCourse && !isFinanceCourse && unitNumber >= 2;
  const shouldShowFinanceSimulator = isFinanceCourse;
  const shouldShowFormat = unitNumber >= 2 && step?.action?.kind === "setFormat";
  const shouldShowHeaderStyle = unitNumber >= 2 && step?.action?.kind === "styleRow";
  const shouldShowBorders = unitNumber >= 2 && step?.action?.kind === "addBorders";
  const shouldShowFilter = unitNumber >= 2 && step?.action?.kind === "filterNames";
  const shouldShowSort = unitNumber >= 2 && step?.action?.kind === "sortNumbers";
  const safeStepCount = steps.length || 1;
  const unitProgressValue = Math.round(
    ((currentStep + (validatedSteps[currentStep] ? 1 : 0)) / safeStepCount) * 100
  );
  const completedUnits = Object.values(quizzesPassed).filter(Boolean).length;
  const courseProgressValue = Math.round((completedUnits / 7) * 100);
  const financeChoiceOptions = useMemo(() => {
    const correct = cleanArabicText(step?.action?.label ?? "", language);
    const decoys = language === "ar"
      ? ["الأصول", "الخصوم", "الإيرادات", "المصروفات", "قائمة الدخل", "الميزانية", "نظام ERP"]
      : ["Assets", "Liabilities", "Revenue", "Expenses", "Income statement", "Budget", "ERP system"];
    const explicitOptions = step?.action?.options?.map((option) => cleanArabicText(option, language));
    const instruction = cleanArabicText(step?.instruction ?? "", language);
    const targetedDecoys =
      /المحاسبة|accounting/i.test(instruction)
        ? language === "ar" ? ["مجموعة أرقام بلا قواعد", "رأي شخصي عن المال", "قائمة مشتريات يومية"] : ["Numbers without rules", "A personal money opinion", "A shopping list"]
      : /لابتوب|أصول|assets/i.test(instruction)
        ? language === "ar" ? ["لا، لأنه مصروف يومي", "خصوم لأنه جهاز إلكتروني", "إيراد لأنه يساعد على العمل"] : ["No, it is a daily expense", "Liability because it is electronic", "Revenue because it helps work"]
      : /استدانت|خصوم|liabilities/i.test(instruction)
        ? language === "ar" ? ["أصول (Assets)", "إيرادات (Revenue)", "مصروفات (Expenses)"] : ["Assets", "Revenue", "Expenses"]
      : /حقوق الملكية|تتوازن|equation/i.test(instruction)
        ? ["40", "100", "140"]
      : /1005|كوده|chart/i.test(instruction)
        ? language === "ar" ? ["الخصوم لأنه يبدأ بـ 2", "الإيرادات لأنه يبدأ بـ 4", "حساب غير مصنف"] : ["Liabilities because it starts with 2", "Revenue because it starts with 4", "Unclassified account"]
      : /دفتر اليومية|journal/i.test(instruction)
        ? language === "ar" ? ["حفظ الرصيد النهائي فقط", "إصدار التقرير السنوي فقط", "تلوين الجدول"] : ["Store final balance only", "Issue annual report only", "Color the table"]
      : /زادت الأصول|مدين|debit/i.test(instruction)
        ? language === "ar" ? ["في الجانب الأيسر (الدائن)", "في التقرير النهائي فقط", "لا نسجل الزيادة"] : ["Left side / credit", "Only in final report", "Do not record the increase"]
      : /النقد|ledger/i.test(instruction)
        ? language === "ar" ? ["في دفتر اليومية فقط", "في قائمة الدخل", "في فاتورة البيع"] : ["Only in journal", "Income statement", "Sales invoice"]
      : /49|المراجعة|trial/i.test(instruction)
        ? language === "ar" ? ["كل شيء صحيح", "الأرباح زادت", "لا نحتاج مراجعة"] : ["Everything is correct", "Profit increased", "No review needed"]
      : /ERP|Dynamics/i.test(instruction)
        ? language === "ar" ? ["بعد نهاية الشهر فقط", "بعد إدخالها يدويا مرة أخرى", "لن تظهر"] : ["At month end only", "After manual re-entry", "It will not appear"]
      : decoys;
    if (explicitOptions?.length) return explicitOptions;
    return [correct, ...targetedDecoys.filter((option) => option && option !== correct)].slice(0, 4);
  }, [step?.action?.label, step?.action?.options, step?.instruction, language]);

  const columns = useMemo(() => ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], []);
  const rows = useMemo(() => Array.from({ length: 10 }, (_, index) => index + 1), []);
  const numericCells = useMemo(() => new Set(["A1"]), []);
  const initialTableRows = useMemo(
    () => [
      { name: "محمود", value: 12 },
      { name: "سارة", value: 55 },
      { name: "مريم", value: 7 },
      { name: "علي", value: 25 },
      { name: "محمد", value: 41 },
      { name: "نور", value: 19 },
      { name: "مجد", value: 33 },
      { name: "هالة", value: 9 },
      { name: "مازن", value: 48 },
    ],
    []
  );
  const challengeTemplate = useMemo<{
    cells: Record<string, CellData>;
    fixes: { cell: string; expected: string | string[] }[];
  }>(() => {
    const nameHeader = language === "ar" ? "الاسم" : "Name";
    const valueHeader = language === "ar" ? "السعر" : "Value";
    const dateHeader = language === "ar" ? "التاريخ" : "Date";
    const nameFix = language === "ar" ? "أحمد" : "Ahmed";
    const emptyNameFix = language === "ar" ? "نور" : "Nour";
    return {
      cells: {
        A1: { value: nameHeader, format: "text" },
        B1: { value: valueHeader, format: "number" },
        C1: { value: dateHeader, format: "date" },
        A2: { value: language === "ar" ? "سارة" : "Sara", format: "text" },
        B2: { value: language === "ar" ? "مريم" : "Mariam", format: "number" },
        C2: { value: "2026-02-12", format: "date" },
        A3: { value: "200", format: "text" },
        B3: { value: "150", format: "number" },
        C3: { value: "2026-02-10", format: "date" },
        A4: { value: language === "ar" ? "ليلى" : "Laila", format: "text" },
        B4: { value: "175", format: "number" },
        C4: { value: "2026/02/40", format: "date" },
        A5: { value: "", format: "text" },
        B5: { value: "90", format: "number" },
        C5: { value: "2026-02-08", format: "date" },
        A6: { value: language === "ar" ? "محمود" : "Mahmoud", format: "text" },
        B6: { value: language === "ar" ? "مائة" : "One hundred", format: "number" },
        C6: { value: "2026-02-06", format: "date" },
      },
      fixes: [
        { cell: "B2", expected: ["120", "١٢٠"] },
        { cell: "A3", expected: nameFix },
        { cell: "C4", expected: ["2026-02-04", "04/02/2026", "4/2/2026"] },
        { cell: "A5", expected: emptyNameFix },
        { cell: "B6", expected: ["100", "١٠٠"] },
      ],
    };
  }, [language]);

  useEffect(() => {
    setValidationMessage("");
    setValidationStatus("");
    setShowHint(false);
    setShowNour(false);
    setNourWarning("");
    setCodeValue("");
    setCodeOutput("");
    setPythonSelectOption("");
    setSelectedChoice("");
    setSelectedPassword("");
    const timer = setTimeout(() => {
      setShowNour(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    if (!step || step.type !== "info") return;
    if (!validatedSteps[currentStep]) {
      markStepValid(currentStep);
    }
  }, [step, currentStep, markStepValid, validatedSteps]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isCompleted) {
      localStorage.setItem(progressStorageKey(unitNumber, "done"), "true");
      setUnitsDone((prev) => ({ ...prev, [unitNumber]: true }));
      // Save step progress to backend
      if (user) {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseSlug: courseKey,
            unitIndex: unitNumber - 1,
            stepIndex: steps.length - 1,
            quizPassed: false,
            quizScore: null,
          }),
        }).catch(() => {});
      }
    }
  }, [isCompleted, unitNumber, user, courseKey, steps.length, progressStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Load from API first, fallback to localStorage
    if (user) {
      fetch(`/api/progress?courseSlug=${courseKey}`)
        .then((r) => r.json())
        .then((d) => {
          const done: Record<number, boolean> = {};
          const passed: Record<number, boolean> = {};
          const progressList = d.progress || [];
          for (let i = 1; i <= 7; i++) {
            const p = progressList.find((pr: { unitIndex: number }) => pr.unitIndex === i - 1);
            done[i] = p ? p.quizPassed : localStorage.getItem(progressStorageKey(i, "done")) === "true";
            passed[i] = p ? p.quizPassed : localStorage.getItem(progressStorageKey(i, "quiz_passed")) === "true";
          }
          setUnitsDone(done);
          setQuizzesPassed(passed);
        })
        .catch(() => {
          const done: Record<number, boolean> = {};
          const passed: Record<number, boolean> = {};
          for (let i = 1; i <= 7; i++) {
            done[i] = localStorage.getItem(progressStorageKey(i, "done")) === "true";
            passed[i] = localStorage.getItem(progressStorageKey(i, "quiz_passed")) === "true";
          }
          setUnitsDone(done);
          setQuizzesPassed(passed);
        });
    } else {
      const done: Record<number, boolean> = {};
      const passed: Record<number, boolean> = {};
      for (let i = 1; i <= 7; i++) {
        done[i] = localStorage.getItem(progressStorageKey(i, "done")) === "true";
        passed[i] = localStorage.getItem(progressStorageKey(i, "quiz_passed")) === "true";
      }
      setUnitsDone(done);
      setQuizzesPassed(passed);
    }
  }, [user, courseKey, progressStorageKey]);

  useEffect(() => {
    if (unitNumber !== 2) return;
    if (datasetSeeded) return;
    if (step?.action?.kind !== "filterNames" && step?.action?.kind !== "sortNumbers") return;
    const seededCells: Record<string, { value: string; format: "text" | "number" | "date" }> = {
      A1: { value: language === "ar" ? "الاسم" : "Name", format: "text" },
      B1: { value: language === "ar" ? "السعر" : "Value", format: "number" },
    };
    initialTableRows.forEach((row, index) => {
      const rowIndex = index + 2;
      seededCells[`A${rowIndex}`] = { value: row.name, format: "text" };
      seededCells[`B${rowIndex}`] = { value: String(row.value), format: "number" };
    });
    setCells((prev) => ({ ...seededCells, ...prev }));
    setDatasetSeeded(true);
  }, [datasetSeeded, initialTableRows, unitNumber, language, step]);

  useEffect(() => {
    if (unitNumber < 2) return;
    setActiveCell("A1");
    setCells({});
    setRowStyles({});
    setBordersApplied(false);
    setFilterPrefix(null);
    setSortApplied(false);
    setChallengeCompleted(false);
    setChallengeActive(false);
    setChallengeFeedback("");
    setChallengeStatus("");
    setDatasetSeeded(false);
  }, [unitNumber]);

  useEffect(() => {
    reset();
    setQuizMode(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [unitNumber, reset]);

  const closeExtraTabs = () => {
    setOpenTabs(["instructions", "sheet", "reference"]);
    if (!["instructions", "sheet", "reference"].includes(activeTab)) {
      setActiveTab("instructions");
    }
  };

  const handleCellClick = (cellId: string) => {
    setActiveCell(cellId);
  };

  const normalizeDigits = (value: string) =>
    value.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

  const isNumericValue = (value: string) => /^[0-9]+$/.test(normalizeDigits(value.trim()));

  const isDateValue = (value: string) => {
    const normalized = normalizeDigits(value.trim());
    return (
      /^\d{4}[-/]\d{2}[-/]\d{2}$/.test(normalized) ||
      /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(normalized)
    );
  };

  const getTypeWarning = (value: string, format: "text" | "number" | "date") => {
    if (!value.trim()) return "";
    if (format === "number" && !isNumericValue(value)) return labels.nourNumberOnly;
    if (format === "date" && !isDateValue(value)) return labels.nourDateOnly;
    return "";
  };

  const updateCellValue = (cellId: string, value: string) => {
    const format = cells[cellId]?.format ?? "text";
    setCells((prev) => ({
      ...prev,
      [cellId]: { value, format: prev[cellId]?.format ?? "text" },
    }));
    const warning = numericCells.has(cellId)
      ? isNumericValue(value)
        ? ""
        : labels.nourNumberOnly
      : getTypeWarning(value, format);
    setNourWarning(warning);
  };

  const setCellFormat = (cellId: string, format: "text" | "number" | "date") => {
    const value = cells[cellId]?.value ?? "";
    setCells((prev) => ({
      ...prev,
      [cellId]: { value: prev[cellId]?.value ?? "", format },
    }));
    const warning = getTypeWarning(value, format);
    setNourWarning(warning);
  };

  const applyHeaderStyle = () => {
    setRowStyles((prev) => ({
      ...prev,
      1: { bg: "#8EC1E8", color: "#FFFFFF" },
    }));
  };

  const applyBorders = () => {
    setBordersApplied(true);
  };

  const applyFilter = () => {
    setFilterPrefix("م");
  };

  const applySort = () => {
    const entries = rows
      .filter((row) => row > 1)
      .map((row) => ({
        row,
        value: Number(cells[`B${row}`]?.value ?? 0),
        name: cells[`A${row}`]?.value ?? "",
      }))
      .sort((a, b) => a.value - b.value);
    const sortedCells: Record<string, { value: string; format: "text" | "number" | "date" }> = {};
    entries.forEach((entry, index) => {
      const targetRow = index + 2;
      sortedCells[`A${targetRow}`] = { value: entry.name, format: "text" };
      sortedCells[`B${targetRow}`] = { value: String(entry.value), format: "number" };
    });
    setCells((prev) => ({ ...prev, ...sortedCells }));
    setSortApplied(true);
  };

  const handleFolderCreate = () => {
    setFolderCreated(true);
  };

  const handleValidate = () => {
    if (!step) return;
    if (step.type === "info") {
      markStepValid(currentStep);
      return;
    }
    let isValid = false;
    if (step.action?.kind === "clickIcon") {
      isValid = driveClicked;
    }
    if (step.action?.kind === "inputText") {
      isValid = folderCreated && folderName.trim() === step.action.expected;
    }
    if (step.action?.kind === "closeTabs") {
      const required = ["instructions", "sheet", "reference"];
      isValid =
        required.every((id) => openTabs.includes(id)) &&
        openTabs.length === required.length;
    }
    if (step.action?.kind === "selectTab") {
      isValid = activeTab === "sheet";
    }
    if (step.action?.kind === "selectOption") {
      if (isPythonCourse) {
        isValid = pythonSelectOption === step.action.label;
      } else if (isFinanceCourse || step.action.options) {
        isValid = selectedChoice === cleanArabicText(step.action.label ?? "", language);
      } else {
        isValid = selectedPassword === "Tafrah#2026!Success";
      }
    }
    if (step.action?.kind === "writeCode") {
      const userCode = codeValue.trim().replace(/\r\n/g, "\n");
      const expectedCode = cleanArabicText(step.action.expected ?? "", language).trim().replace(/\r\n/g, "\n");
      const normalizeCodeForValidation = (s: string) =>
        normalizeDigits(s)
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/[ةه]/g, "ه")
          .replace(/[أإآ]/g, "ا")
          .replace(/\s+$/gm, "")
          .trim();
      isValid = normalizeCodeForValidation(userCode) === normalizeCodeForValidation(expectedCode);
      if (isValid) {
        setCodeOutput(language === "ar" ? "\u2714 \u062a\u0645 \u062a\u0646\u0641\u064a\u0630 \u0627\u0644\u0643\u0648\u062f \u0628\u0646\u062c\u0627\u062d" : "\u2714 Code executed successfully");
      }
    }
    if (step.action?.kind === "clickCell") {
      isValid = activeCell === step.action.target;
    }
    if (step.action?.kind === "typeCell") {
      const firstValue = cells[step.action.target ?? ""]?.value ?? "";
      const secondValue =
        step.extraAction?.kind === "typeCell"
          ? cells[step.extraAction.target ?? ""]?.value ?? ""
          : "";
      if (step.extraAction?.kind === "typeCell") {
        isValid = firstValue === step.action.value && secondValue === step.extraAction.value;
      } else {
        isValid = firstValue === step.action.value;
      }
    }
    if (step.action?.kind === "setFormat") {
      isValid = cells[step.action.target ?? ""]?.format === step.action.value;
    }
    if (step.action?.kind === "styleRow") {
      isValid = rowStyles[1]?.bg === "#8EC1E8" && rowStyles[1]?.color === "#FFFFFF";
    }
    if (step.action?.kind === "addBorders") {
      isValid = bordersApplied;
    }
    if (step.action?.kind === "filterNames") {
      const visibleRows = rows.filter((row) => row > 1).filter((row) => {
        const name = cells[`A${row}`]?.value ?? "";
        return name.startsWith("م");
      });
      isValid = filterPrefix === "م" && visibleRows.length > 0;
    }
    if (step.action?.kind === "sortNumbers") {
      const values = rows
        .filter((row) => row > 1)
        .map((row) => Number(cells[`B${row}`]?.value ?? 0));
      const sorted = [...values].sort((a, b) => a - b);
      isValid = sortApplied && values.every((value, index) => value === sorted[index]);
    }
    if (isValid) {
      markStepValid(currentStep);
      setValidationMessage(labels.correct);
      setValidationStatus("success");
      return;
    }
    setValidationMessage(labels.retry);
    setValidationStatus("error");
    setShowHint(true);
  };

  const badgeTexts = [labels.badgeUnit1, labels.badgeUnit2, labels.badgeUnit3, labels.badgeUnit4, labels.badgeUnit5, labels.badgeUnit6, labels.badgeUnit7];
  const badgeText = badgeTexts[unitNumber - 1];

  const handleUnitChange = (target: number) => {
    if (target > 1 && !quizzesPassed[target - 1]) return;
    const query = target > 1 ? `?unit=${target}` : "";
    router.push(`/courses/${courseKey}/learn${query}`);
  };

  const baseQuiz = isPythonCourse
    ? (pythonQuizzes as Record<number, QuizSet>)[unitNumber]
    : isFinanceCourse
      ? (financeQuizzes as Record<number, QuizSet>)[unitNumber]
      : (quizzes as Record<number, QuizSet>)[unitNumber];
  const currentQuiz = useMemo(
    () => (baseQuiz ? buildExpandedQuiz(courseKey, unitNumber, language, baseQuiz) : undefined),
    [baseQuiz, courseKey, unitNumber, language]
  );

  const handleQuizAnswer = (questionId: string, answerId: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleQuizSubmit = () => {
    if (!currentQuiz) return;
    const score = currentQuiz.questions.reduce((count: number, question: { id: string; correct: string }) => {
      return quizAnswers[question.id] === question.correct ? count + 1 : count;
    }, 0);
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= currentQuiz.passingScore) {
      localStorage.setItem(progressStorageKey(unitNumber, "quiz_passed"), "true");
      setQuizzesPassed((prev) => ({ ...prev, [unitNumber]: true }));
      // Save to backend
      if (user) {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseSlug: courseKey,
            unitIndex: unitNumber - 1,
            stepIndex: steps.length - 1,
            quizPassed: true,
            quizScore: score,
          }),
        }).catch(() => {});
      }
    }
  };

  const handleQuizRetry = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const requestCourseExplanation = async (tone: "detailed" | "simple" = "detailed") => {
    if (!step) return;
    setIsExplaining(true);
    setNourHelp("");
    try {
      const res = await fetch("/api/course-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "explain",
          language,
          courseSlug: courseKey,
          courseTitle: courseKey,
          unitNumber,
          unitTitle: cleanArabicText(unitTitle, language),
          chapterTitle: cleanArabicText(step.chapterTitle, language),
          instruction: cleanArabicText(step.instruction, language),
          tone,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "course_ai_failed");
      setNourHelp(data.explanation || labels.nourHelp);
    } catch {
      setNourHelp(language === "ar" ? "تعذر تشغيل شرح نور الآن. حاول مرة أخرى بعد لحظة." : "Nour could not explain this right now. Please try again in a moment.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleStartChallenge = () => {
    setChallengeActive(true);
    setChallengeCompleted(false);
    setChallengeFeedback("");
    setChallengeStatus("");
    setCells(challengeTemplate.cells);
    setActiveCell("A2");
  };

  const handleCheckChallenge = () => {
    const total = challengeTemplate.fixes.length;
    const fixed = challengeTemplate.fixes.filter((fix) => {
      const cellValue = cells[fix.cell]?.value ?? "";
      const normalizedValue = normalizeDigits(cellValue.trim());
      const expectedList = Array.isArray(fix.expected) ? fix.expected : [fix.expected];
      return expectedList.some(
        (expected) => normalizeDigits(String(expected)).trim() === normalizedValue
      );
    }).length;
    if (fixed === total) {
      setChallengeCompleted(true);
      setChallengeFeedback(labels.challengeSuccess);
      setChallengeStatus("success");
      return;
    }
    setChallengeCompleted(false);
    setChallengeFeedback(
      language === "ar"
        ? `تم تصحيح ${fixed} من ${total} أخطاء. أكمل حتى تصل إلى ${total}.`
        : `Fixed ${fixed} of ${total} errors. Keep going until ${total}.`
    );
    setChallengeStatus("error");
  };

  if (!isAvailable) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12 text-[#212529]">
          <Breadcrumbs
            items={[
              { label: labels.home, href: "/" },
              { label: labels.courses, href: "/courses" },
              { label: labels.learn },
            ]}
          />
          <section className="rounded-sm border border-[#DEE2E6] bg-white p-6">
            <h1 className="font-semibold">{labels.title}</h1>
            <p>{labels.comingSoon}</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {focusMode ? null : <TopBar />}
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-[#212529] sm:px-6 lg:gap-8 lg:py-12">
        {focusMode ? null : (
          <Breadcrumbs
            items={[
              { label: labels.home, href: "/" },
              { label: labels.courses, href: "/courses" },
              { label: courseKey ? `${labels.course} ${courseKey}` : labels.course },
              { label: labels.learn },
            ]}
          />
        )}

        <section className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-semibold">{cleanArabicText(unitTitle, language)}</h1>
          <button
            type="button"
            onClick={() => setFocusMode((prev) => !prev)}
            className={`min-h-10 rounded-full px-5 text-sm font-medium transition-all ${
              focusMode
                ? "bg-[#2E5C8A] text-white shadow-sm"
                : "border border-[#E2E8F0] bg-white text-[#495057] hover:bg-[#F5F9FF]"
            }`}
          >
            {focusMode ? labels.focusOff : labels.focusOn}
          </button>
        </section>
        <section className="flex flex-col gap-5 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">{labels.unitNav}</h2>
            <span className="rounded-full bg-[#F5F9FF] px-3 py-1 text-sm text-[#2E5C8A]">
              {labels.currentUnit}: {cleanArabicText(unitTitle, language)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => {
              const isActive = unitNumber === num;
              const isLocked = num > 1 && !quizzesPassed[num - 1];
              const buttonLabels = [labels.unit1Button, labels.unit2Button, labels.unit3Button, labels.unit4Button, labels.unit5Button, labels.unit6Button, labels.unit7Button];
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleUnitChange(num)}
                  disabled={isLocked}
                  title={isLocked ? labels.quizLocked : buttonLabels[num - 1]}
                  className={`min-h-10 rounded-full px-5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#2E5C8A] text-white shadow-sm"
                      : isLocked
                        ? "cursor-not-allowed border border-[#E2E8F0] bg-[#F8F9FA] text-[#ADB5BD]"
                        : "border border-[#E2E8F0] bg-white text-[#495057] hover:bg-[#F5F9FF]"
                  }`}
                >
                  {isLocked ? <><Lock size={12} className="inline me-1" /> </> : null}{buttonLabels[num - 1]}
                </button>
              );
            })}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-[#F5F9FF] to-white p-4">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-[#2E5C8A]" />
                <p className="font-semibold">{labels.courseProgress}</p>
              </div>
              <p className="mt-1 text-sm text-[#6C757D]">
                {completedUnits} / 7 {labels.unitsCompleted}
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#2E5C8A] to-[#4A90C4] progress-animate transition-all duration-500"
                  style={{ width: `${courseProgressValue}%` }}
                />
              </div>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-[#F5F9FF] to-white p-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#2E5C8A]" />
                <p className="font-semibold">{labels.unitProgress}</p>
              </div>
              <p className="mt-1 text-sm text-[#6C757D]">
                {labels.stepLabel} {currentStep + 1} {labels.of} {steps.length}
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#2E5C8A] to-[#4A90C4] progress-animate transition-all duration-500"
                  style={{ width: `${unitProgressValue}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {quizMode && currentQuiz ? (
          <section className="mx-auto w-full max-w-3xl">
            <div className="rounded-2xl border-2 border-[#2E5C8A]/20 bg-gradient-to-br from-[#F5F9FF] to-white p-6 md:p-10 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2E5C8A] text-white shadow-md"><FileText size={24} /></span>
                <div>
                  <h2 className="text-xl font-bold text-[#2E5C8A]">{labels.quizTitle} {unitNumber}</h2>
                  <p className="text-sm text-[#6C757D] mt-1">{labels.quizInstruction}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {currentQuiz.questions.map((question: { id: string; text: string; textEn: string; options: { id: string; text: string; textEn: string }[]; correct: string }, qIndex: number) => (
                  <div key={question.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                    <p className="mb-4 text-base font-semibold leading-relaxed">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2E5C8A] text-sm text-white me-3">{qIndex + 1}</span>
                      {cleanArabicText(language === "ar" ? question.text : question.textEn, language)}
                    </p>
                    <div className="flex flex-col gap-2.5">
                      {question.options.map((option: { id: string; text: string; textEn: string }) => {
                        const isSelected = quizAnswers[question.id] === option.id;
                        const isCorrect = quizSubmitted && option.id === question.correct;
                        const isWrong = quizSubmitted && isSelected && option.id !== question.correct;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => !quizSubmitted && handleQuizAnswer(question.id, option.id)}
                            disabled={quizSubmitted}
                            className={`min-h-12 rounded-xl px-5 py-3 text-start text-sm transition-all ${
                              isCorrect
                                ? "border-2 border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] font-semibold"
                                : isWrong
                                  ? "border-2 border-[#D32F2F] bg-[#FFEBEE] text-[#B71C1C]"
                                  : isSelected
                                    ? "border-2 border-[#2E5C8A] bg-[#E3EEF9] text-[#2E5C8A] font-semibold shadow-sm"
                                    : "border border-[#E2E8F0] bg-white text-[#495057] hover:bg-[#F8F9FA] hover:border-[#CBD5E1]"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                isSelected || isCorrect ? "bg-[#2E5C8A] text-white" : "bg-[#E2E8F0] text-[#6C757D]"
                              }`}>{option.id.toUpperCase()}</span>
                              {cleanArabicText(language === "ar" ? option.text : option.textEn, language)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {!quizSubmitted ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setQuizMode(false)}
                      className="min-h-11 rounded-xl border border-[#E2E8F0] bg-white px-5 font-medium text-[#495057] hover:bg-[#F8F9FA] transition-all"
                    >
                      {labels.prev}
                    </button>
                    <button
                      type="button"
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < currentQuiz.questions.length}
                      className={`min-h-11 rounded-xl px-8 font-medium transition-all ${
                        Object.keys(quizAnswers).length >= currentQuiz.questions.length
                          ? "bg-[#2E5C8A] text-white shadow-sm hover:bg-[#24496E] hover:shadow-md"
                          : "border border-[#E2E8F0] bg-[#F8F9FA] text-[#ADB5BD] cursor-not-allowed"
                      }`}
                    >
                      {labels.quizSubmit}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4 w-full">
                    <div className={`flex items-center gap-3 rounded-2xl border p-5 ${
                      quizScore >= currentQuiz.passingScore
                        ? "border-[#2E7D32]/20 bg-[#E8F5E9] text-[#1B5E20]"
                        : "border-[#FF9800]/30 bg-[#FFF3E0] text-[#212529]"
                    }`}>
                      <span className="text-2xl">{quizScore >= currentQuiz.passingScore ? <CheckCircle size={24} /> : <RefreshCw size={24} />}</span>
                      <div>
                        <p className="text-lg font-bold">
                          {labels.quizScoreLabel}: {quizScore} / {currentQuiz.questions.length}
                        </p>
                        <p className="text-sm mt-1">
                          {quizScore >= currentQuiz.passingScore ? labels.quizPassed : labels.quizFailed}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {quizScore >= currentQuiz.passingScore ? (
                        <>
                            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2E5C8A] to-[#3D7AB5] px-6 py-2 text-sm font-semibold text-white shadow-md">
                            <Star size={14} /> {badgeText}
                          </div>
                          {unitNumber < 7 ? (
                            <button
                              type="button"
                              onClick={() => handleUnitChange(unitNumber + 1)}
                              className="min-h-11 rounded-xl bg-[#2E7D32] px-6 font-medium text-white shadow-sm hover:bg-[#1B5E20] transition-all"
                            >
                              <ArrowRight size={14} className="inline me-1" /> {labels.nextUnit}
                            </button>
                          ) : null}
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={handleQuizRetry}
                          className="min-h-11 rounded-xl bg-[#2E5C8A] px-6 font-medium text-white shadow-sm hover:bg-[#24496E] transition-all"
                        >
                          <RefreshCw size={14} className="inline me-1" /> {labels.quizRetry}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
        <section
          className={`grid gap-5 ${
            focusMode ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]"
          }`}
        >
          {focusMode ? null : (
            <aside className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto self-start rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sim-scroll">
              <h2 className="mb-2 font-semibold">{labels.stepsTitle}</h2>
              {currentUnit.chapters.map((chapter, chapterIndex) => {
                const rawChTitle = (chapter as { title?: string; chapter_title?: string }).title ??
                  (chapter as { chapter_title?: string }).chapter_title ?? "";
                const chTitle = cleanArabicText(rawChTitle, language);
                const isActiveChapter = step?.chapterTitle === rawChTitle;
                return (
                  <div
                    key={(chapter as { id?: string; chapter_id?: string }).id ?? (chapter as { chapter_id?: string }).chapter_id}
                    className={`rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isActiveChapter
                        ? "border-s-[3px] border-[#2E5C8A] bg-[#E3EEF9] font-semibold text-[#2E5C8A]"
                        : "text-[#495057] hover:bg-[#F8F9FA]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isActiveChapter ? "bg-[#2E5C8A] text-white" : "bg-[#E2E8F0] text-[#6C757D]"
                      }`}>
                        {chapterIndex + 1}
                      </span>
                      {chTitle}
                    </span>
                  </div>
                );
              })}
            </aside>
          )}

          <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#E3EEF9] text-[#2E5C8A]"><Monitor size={16} /></span>
              <h2 className="font-semibold">
                {shouldShowCodeEditor
                  ? language === "ar" ? "محرر الكود" : "Code Editor"
                  : shouldShowGrid
                    ? labels.gridSimulator
                    : shouldShowFinanceSimulator
                      ? language === "ar" ? "مساحة التدريب المالي" : "Finance practice workspace"
                      : labels.simulator}
              </h2>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-4">
              {shouldShowCodeEditor ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[#6C757D]">{language === "ar" ? "اكتب الكود المطلوب في المحرر أدناه ثم اضغط تحقق." : "Write the required code in the editor below then press Check."}</p>
                  {step?.action?.kind === "writeCode" ? (
                    <div className="flex flex-col gap-3">
                      <div className="overflow-hidden rounded-xl border border-[#334155]">
                        <div className="flex items-center gap-2 bg-[#1E293B] px-4 py-2">
                          <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
                          <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                          <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
                          <span className="ms-2 text-xs text-[#94A3B8] font-mono">script.py</span>
                        </div>
                        <div className="relative bg-[#0F172A] p-4">
                          <textarea
                            value={codeValue}
                            onChange={(event) => setCodeValue(event.target.value)}
                            className="w-full min-h-[140px] bg-transparent text-[#A5F3FC] text-sm leading-relaxed focus:outline-none resize-y placeholder:text-[#475569]"
                            dir="ltr"
                            style={{ fontFamily: "'Fira Code', 'Courier New', 'Consolas', monospace", tabSize: 4 }}
                            placeholder={language === "ar" ? "اكتب الكود هنا..." : "Type your code here..."}
                            spellCheck={false}
                          />
                        </div>
                      </div>
                      {codeOutput ? (
                        <div className="rounded-xl border border-[#E2E8F0] bg-[#F0FDF4] p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-[#166534]">{language === "ar" ? "المخرجات:" : "Output:"}</span>
                          </div>
                          <pre className="text-sm text-[#166534] font-mono whitespace-pre-wrap" dir="ltr">{codeOutput}</pre>
                        </div>
                      ) : null}
                    </div>
                  ) : shouldShowPythonOptions ? (
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold">{language === "ar" ? "اختر الإجابة الصحيحة" : "Select the correct answer"}</h3>
                      {[
                        language === "ar" ? "رسم صورة على الشاشة" : "Drawing an image on screen",
                        step?.action?.label ?? "",
                        language === "ar" ? "تشغيل الكاميرا" : "Turning on the camera",
                        language === "ar" ? "حذف الملفات" : "Deleting files",
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setPythonSelectOption(option)}
                          className={`min-h-11 rounded-xl px-4 text-start text-sm transition-all ${
                            pythonSelectOption === option
                              ? "border-2 border-[#2E5C8A] bg-[#E3EEF9] text-[#2E5C8A] font-semibold shadow-sm"
                              : "border border-[#E2E8F0] bg-white text-[#495057] hover:bg-[#F8F9FA]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8">
                      <p className="text-center text-[#6C757D]">{language === "ar" ? "اقرأ المعلومة ثم انتقل للخطوة التالية." : "Read the information then proceed to the next step."}</p>
                    </div>
                  )}
                </div>
              ) : shouldShowGrid ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[#6C757D]">{labels.gridHint}</p>
                  {shouldShowGridControls ? (
                    <div className="flex flex-wrap gap-2">
                      {shouldShowFormat ? (
                        <label className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm">
                          <span className="font-medium">{labels.formatLabel}</span>
                          <select
                            value={cells[activeCell]?.format ?? "text"}
                            onChange={(event) =>
                              setCellFormat(activeCell, event.target.value as "text" | "number" | "date")
                            }
                            className="min-h-8 rounded-lg border border-[#E2E8F0] bg-[#F5F9FF] px-2 focus:border-[#2E5C8A] focus:outline-none"
                          >
                            <option value="text">{labels.formatText}</option>
                            <option value="number">{labels.formatNumber}</option>
                            <option value="date">{labels.formatDate}</option>
                          </select>
                        </label>
                      ) : null}
                      {shouldShowHeaderStyle ? (
                        <button
                          type="button"
                          onClick={applyHeaderStyle}
                          className="min-h-9 rounded-full border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#495057] hover:bg-[#F5F9FF] transition-all"
                        >
                          {labels.applyHeader}
                        </button>
                      ) : null}
                      {shouldShowBorders ? (
                        <button
                          type="button"
                          onClick={applyBorders}
                          className="min-h-9 rounded-full border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#495057] hover:bg-[#F5F9FF] transition-all"
                        >
                          {labels.applyBorders}
                        </button>
                      ) : null}
                      {shouldShowFilter ? (
                        <button
                          type="button"
                          onClick={applyFilter}
                          className="min-h-9 rounded-full border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#495057] hover:bg-[#F5F9FF] transition-all"
                        >
                          {labels.applyFilter}
                        </button>
                      ) : null}
                      {shouldShowSort ? (
                        <button
                          type="button"
                          onClick={applySort}
                          className="min-h-9 rounded-full border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#495057] hover:bg-[#F5F9FF] transition-all"
                        >
                          {labels.applySort}
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="overflow-auto rounded-xl border border-[#E2E8F0] bg-white sim-scroll">
                    <table className="w-full border-collapse text-center">
                      <thead>
                        <tr>
                          <th className="border border-[#DEE2E6] bg-[#F8F9FA] p-2 text-xs">#</th>
                          {columns.map((col) => (
                            <th key={col} className="border border-[#DEE2E6] bg-[#F8F9FA] p-2 text-xs">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => {
                          const rowStyle = rowStyles[row];
                          const isRowActive = Number(activeCell.slice(1)) === row;
                          const rowVisible =
                            !filterPrefix || row === 1
                              ? true
                              : (cells[`A${row}`]?.value ?? "").startsWith(filterPrefix);
                          return (
                            <tr key={row} className={rowVisible ? "" : "opacity-30"}>
                              <td className="border border-[#DEE2E6] bg-[#F8F9FA] p-2 text-xs">{row}</td>
                              {columns.map((col) => {
                                const cellId = `${col}${row}`;
                                const cell = cells[cellId];
                                const isActive = cellId === activeCell;
                                const isColActive = activeCell.startsWith(col);
                                const highlight =
                                  isActive || isRowActive || isColActive ? "bg-[#E3EEF9]" : "bg-white";
                                const borderClass =
                                  bordersApplied && ["A", "B", "C", "D"].includes(col)
                                    ? "border border-[#2E5C8A]"
                                    : "border border-[#DEE2E6]";
                                const style = rowStyle
                                  ? { backgroundColor: rowStyle.bg, color: rowStyle.color }
                                  : undefined;
                                return (
                                  <td
                                    key={cellId}
                                    className={`${borderClass} p-2 text-xs ${highlight}`}
                                    style={style}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleCellClick(cellId)}
                                      className={`min-h-8 w-full rounded-sm ${
                                        isActive ? "bg-[#2E5C8A] text-white" : ""
                                      }`}
                                    >
                                      {cell?.value ?? ""}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FF] p-2.5">
                    <span className="rounded-lg bg-[#2E5C8A] px-2.5 py-1 text-xs font-bold text-white">{activeCell}</span>
                    <input
                      type="text"
                      value={cells[activeCell]?.value ?? ""}
                      onChange={(event) => updateCellValue(activeCell, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          const row = Number(activeCell.slice(1));
                          const col = activeCell.slice(0, 1);
                          const nextRow = Math.min(row + 1, 10);
                          setActiveCell(`${col}${nextRow}`);
                        }
                        if (event.key === "Tab") {
                          event.preventDefault();
                          const row = Number(activeCell.slice(1));
                          const colIndex = columns.indexOf(activeCell.slice(0, 1));
                          const nextCol = columns[Math.min(colIndex + 1, columns.length - 1)];
                          setActiveCell(`${nextCol}${row}`);
                        }
                      }}
                      className="min-h-9 flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#2E5C8A] focus:outline-none focus:ring-1 focus:ring-[#2E5C8A]/20"
                      style={{ fontFamily: "Cairo, sans-serif" }}
                    />
                  </div>
                </div>
              ) : shouldShowFinanceSimulator ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[#6C757D]">
                    {language === "ar"
                      ? "هذه مساحة مالية مبسطة: اقرأ المستند، اختر التصنيف أو القرار، ثم تحقق من خطوة واحدة فقط."
                      : "This is a focused finance workspace: read the document, choose the classification or decision, then check one step only."}
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-[#D9E6F2] bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#6C757D]">
                        {language === "ar" ? "مستند المصدر" : "Source document"}
                      </p>
                      <div className="mt-3 rounded-lg border border-dashed border-[#BFD3E6] bg-[#F5F9FF] p-3 text-sm leading-relaxed">
                        {language === "ar"
                          ? "فاتورة تدريبية: عملية بيع أو شراء أو مصروف. المطلوب هو فهم الأثر المالي قبل تسجيله."
                          : "Training invoice: a sale, purchase, or expense. The goal is to understand the financial effect before recording it."}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#D9E6F2] bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#6C757D]">
                        {language === "ar" ? "قاعدة التحقق" : "Check rule"}
                      </p>
                      <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
                        {(language === "ar"
                          ? ["ما الحساب المتأثر؟", "هل هو أصل أو خصم أو إيراد أو مصروف؟", "هل يوجد مصدر واضح للرقم؟"]
                          : ["Which account changed?", "Is it an asset, liability, revenue, or expense?", "Is there a clear source for the number?"]
                        ).map((item) => (
                          <li key={item} className="rounded-lg bg-[#F8FAFC] px-3 py-2">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                    <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 text-center text-sm">
                      {(language === "ar"
                        ? ["الحساب", "التصنيف", "سبب القرار"]
                        : ["Account", "Classification", "Reason"]
                      ).map((header) => (
                        <div key={header} className="rounded-lg bg-[#E3EEF9] px-3 py-2 font-semibold text-[#2E5C8A]">
                          {header}
                        </div>
                      ))}
                      {(language === "ar"
                        ? ["النقدية / المبيعات / المصروف", "اختر من الإجابات", "راجع المصدر ثم القاعدة"]
                        : ["Cash / sales / expense", "Choose from the answers", "Review source, then rule"]
                      ).map((cell) => (
                        <div key={cell} className="rounded-lg border border-[#E2E8F0] px-3 py-3 text-[#495057]">
                          {cell}
                        </div>
                      ))}
                    </div>
                  </div>
                  {shouldShowChoiceOptions ? (
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                      <h3 className="font-semibold">{language === "ar" ? "اختر الإجابة الصحيحة" : "Choose the correct answer"}</h3>
                      <div className="mt-3 flex flex-col gap-2">
                        {financeChoiceOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setSelectedChoice(option)}
                            className={`min-h-11 rounded-xl px-4 text-start text-sm transition-all ${
                              selectedChoice === option
                                ? "border-2 border-[#2E5C8A] bg-[#E3EEF9] font-semibold text-[#2E5C8A] shadow-sm"
                                : "border border-[#E2E8F0] bg-white text-[#495057] hover:bg-[#F8F9FA]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {shouldShowTabs ? (
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                      <h3 className="font-semibold">{labels.simpleTabs}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["instructions", "sheet", "reference"].map((tabId) => (
                          <button
                            key={tabId}
                            type="button"
                            onClick={() => setActiveTab(tabId)}
                            className={`min-h-9 rounded-full px-4 text-sm font-medium transition-all ${
                              activeTab === tabId
                                ? "bg-[#2E5C8A] text-white shadow-sm"
                                : "border border-[#E2E8F0] bg-white text-[#495057] hover:bg-[#F5F9FF]"
                            }`}
                          >
                            {tabId === "instructions"
                              ? language === "ar"
                                ? "التعليمات"
                                : "Instructions"
                              : tabId === "sheet"
                              ? language === "ar"
                                ? "جدول البيانات"
                                : "Spreadsheet"
                              : language === "ar"
                              ? "المرجع"
                              : "Reference"}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-sm text-[#6C757D]">
                          {openTabs
                            .map((tabId) =>
                              tabId === "instructions"
                                ? language === "ar"
                                  ? "التعليمات"
                                  : "Instructions"
                                : tabId === "sheet"
                                ? language === "ar"
                                  ? "جدول البيانات"
                                  : "Spreadsheet"
                                : tabId === "reference"
                                ? language === "ar"
                                  ? "المرجع"
                                  : "Reference"
                                : tabId === "youtube"
                                ? "YouTube"
                                : "Instagram"
                            )
                            .join(" ، ")}
                        </span>
                        <button
                          type="button"
                          onClick={closeExtraTabs}
                          className="min-h-9 rounded-full border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#495057] hover:bg-[#F8F9FA] transition-all"
                        >
                          {labels.closeExtraTabs}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {shouldShowFiles ? (
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                      <h3 className="font-semibold">{labels.fileExplorer}</h3>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setDriveClicked(true)}
                          className={`min-h-11 rounded-xl px-5 font-medium transition-all ${
                            driveClicked
                              ? "bg-[#2E5C8A] text-white shadow-sm"
                              : "border border-[#E2E8F0] bg-white text-[#495057] hover:bg-[#F5F9FF]"
                          }`}
                        >
                          Google Drive
                        </button>
                        <button
                          type="button"
                          className="min-h-11 rounded-xl border border-[#E2E8F0] bg-white px-5 font-medium text-[#495057] hover:bg-[#F8F9FA] transition-all"
                        >
                          OneDrive
                        </button>
                      </div>
                      <div className="mt-3 flex flex-col gap-2">
                        <input
                          type="text"
                          value={folderName}
                          onChange={(event) => setFolderName(event.target.value)}
                          className={`min-h-11 rounded-xl border px-4 focus:outline-none focus:ring-1 focus:ring-[#2E5C8A]/20 ${
                            showHint && step?.action?.kind === "inputText"
                              ? "border-[#FF9800] bg-[#FFF3E0]"
                              : "border-[#E2E8F0] bg-white"
                          }`}
                          placeholder="تاسكات طفرة 2026"
                        />
                        <button
                          type="button"
                          onClick={handleFolderCreate}
                          className="min-h-11 rounded-xl bg-[#2E5C8A] px-5 font-medium text-white shadow-sm hover:bg-[#24496E] transition-all"
                        >
                          {labels.createFolder}
                        </button>
                      </div>
                      {folderCreated ? (
                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#2E7D32]/20 bg-[#E8F5E9] px-4 py-2.5 text-sm text-[#1B5E20]">
                          <FolderOpen size={16} className="text-[#1B5E20]" />
                          {folderName || "مجلد جديد"}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {shouldShowPassword ? (
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                      <h3 className="font-semibold">{labels.passwordTitle}</h3>
                      <div className="mt-3 flex flex-col gap-2">
                        {passwordOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setSelectedPassword(option)}
                            className={`min-h-11 rounded-xl px-4 text-start font-mono text-sm transition-all ${
                              selectedPassword === option
                                ? "border-2 border-[#2E5C8A] bg-[#E3EEF9] text-[#2E5C8A] font-semibold shadow-sm"
                                : "border border-[#E2E8F0] bg-white text-[#495057] hover:bg-[#F8F9FA]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {shouldShowChoiceOptions ? (
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                      <h3 className="font-semibold">{language === "ar" ? "اختر الإجابة الصحيحة" : "Choose the correct answer"}</h3>
                      <div className="mt-3 flex flex-col gap-2">
                        {financeChoiceOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setSelectedChoice(option)}
                            className={`min-h-11 rounded-xl px-4 text-start text-sm transition-all ${
                              selectedChoice === option
                                ? "border-2 border-[#2E5C8A] bg-[#E3EEF9] text-[#2E5C8A] font-semibold shadow-sm"
                                : "border border-[#E2E8F0] bg-white text-[#495057] hover:bg-[#F8F9FA]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3">
              {/* Step progress dots */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sim-scroll">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`shrink-0 rounded-full transition-all ${
                      i === currentStep
                        ? "h-2.5 w-7 bg-[#2E5C8A] step-active"
                        : i < currentStep && validatedSteps[i]
                        ? "h-2.5 w-2.5 bg-[#2E5C8A]"
                        : "h-2 w-2 bg-[#DEE2E6]"
                    }`}
                  />
                ))}
              </div>
              <h2 className="font-semibold">{cleanArabicText(step?.chapterTitle || "", language)}</h2>
              <p className="text-sm text-[#6C757D]">
                {labels.stepLabel} {currentStep + 1} {labels.of} {steps.length}
              </p>
              <div className={`rounded-xl p-4 ${
                step?.type === "info"
                  ? "border border-[#D9E6F2] bg-[#F5F9FF]"
                  : "border-2 border-[#2E5C8A]/20 bg-[#E3EEF9]"
              }`}>
                <div className="mb-2 flex items-center gap-2">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    step?.type === "info"
                      ? "bg-[#2E5C8A]/10 text-[#2E5C8A]"
                      : "bg-[#2E5C8A] text-white"
                  }`}>
                    {step?.type === "info" ? <Lightbulb size={16} /> : <Pencil size={16} />}
                  </span>
                  <span className="text-sm font-semibold text-[#2E5C8A]">
                    {step?.type === "info" ? labels.infoOnly : labels.taskLabel}
                  </span>
                </div>
                <p className="text-lg leading-relaxed">{cleanArabicText(step?.instruction || "", language)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                disabled={isExplaining}
                onClick={() => requestCourseExplanation("detailed")}
                className="min-h-11 rounded-xl border-2 border-[#2E5C8A]/30 bg-white px-4 font-semibold text-[#2E5C8A] hover:border-[#2E5C8A]/50 hover:bg-[#F5F9FF] transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  {isExplaining ? <Loader2 size={18} className="animate-spin text-[#2E5C8A]" /> : <Bot size={18} className="text-[#2E5C8A]" />}
                  {language === "ar" ? "لا أفهم، اشرحها لي بالتفصيل" : "I don't understand. Explain this in detail"}
                </span>
              </button>
              {(userCategory === 'LEARNING_HARDENING' || preferences?.simplifiedText) && (
                <button
                  type="button"
                  disabled={isSummarizing || isExplaining}
                  onClick={async () => {
                    setIsSummarizing(true);
                    await requestCourseExplanation("simple");
                    setIsSummarizing(false);
                  }}
                  className="min-h-11 rounded-xl border-2 border-dashed border-teal-500/30 bg-teal-50 px-4 font-medium text-teal-700 hover:border-teal-500/50 hover:bg-teal-100 transition-all text-left"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSummarizing ? <Loader2 size={18} className="animate-spin text-teal-700" /> : <Sparkles size={18} className="text-teal-700" />}
                    {language === "ar" ? "بسّط النص مع نور" : "Simplify text with Nour AI"}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setNourHelp(labels.nourHelp)}
                className="min-h-11 rounded-xl border-2 border-dashed border-[#2E5C8A]/25 bg-[#F5F9FF] px-4 font-medium text-[#2E5C8A] hover:border-[#2E5C8A]/40 hover:bg-[#E3EEF9] transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <Bot size={18} className="text-[#2E5C8A]" />
                  {labels.askNour}
                </span>
              </button>
              {nourHelp ? (
                <div className="rounded-xl border border-[#2E5C8A]/15 bg-[#F5F9FF] p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E5C8A] text-sm font-bold text-white">ن</span>
                    <p className="leading-relaxed text-[#212529]">{nourHelp}</p>
                  </div>
                </div>
              ) : null}
              {nourWarning ? (
                <div className="flex items-center gap-2 rounded-xl border border-[#FF9800]/30 bg-[#FFF3E0] p-3 text-[#212529]">
                  <AlertTriangle size={16} className="shrink-0 text-[#FF9800]" />
                  {nourWarning}
                </div>
              ) : null}
              {showNour ? (
                <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F5F9FF] p-3">
                  <Lightbulb size={16} className="shrink-0 text-[#2E5C8A]" />
                  {labels.nourPrefix} {nourTarget} {labels.nourSuffix}
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="min-h-11 rounded-xl border border-[#E2E8F0] bg-white px-5 font-medium text-[#495057] hover:bg-[#F8F9FA] transition-all"
              >
                {labels.prev}
              </button>
              <button
                type="button"
                onClick={handleValidate}
                className="min-h-11 rounded-xl bg-[#2E5C8A] px-6 font-medium text-white shadow-sm hover:bg-[#24496E] hover:shadow-md transition-all"
              >
                {labels.check}
              </button>
              <button
                type="button"
                onClick={() => nextStep(steps.length)}
                disabled={!canGoNext}
                className={`min-h-11 rounded-xl px-5 font-medium transition-all ${
                  canGoNext
                    ? "bg-[#2E5C8A] text-white shadow-sm hover:bg-[#24496E] hover:shadow-md"
                    : "border border-[#E2E8F0] bg-[#F8F9FA] text-[#ADB5BD] cursor-not-allowed"
                }`}
              >
                {labels.next}
              </button>
            </div>
            {validationMessage ? (
              <div
                className={`flex items-center gap-2 rounded-xl border p-4 ${
                  validationStatus === "success"
                    ? "border-[#2E7D32]/20 bg-[#E8F5E9] text-[#1B5E20]"
                    : "border-[#FF9800]/30 bg-[#FFF3E0] text-[#212529]"
                }`}
              >
                <span className="text-lg">{validationStatus === "success" ? <CheckCircle size={20} /> : <RefreshCw size={20} />}</span>
                {validationMessage}
              </div>
            ) : null}
            {isCompleted && !quizMode ? (
              <div className="rounded-2xl border border-[#2E7D32]/20 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] p-6">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-white shadow-md"><Trophy size={24} /></span>
                  <div>
                    <p className="text-lg font-semibold text-[#1B5E20]">
                      {cleanArabicText(unitTitle, language)} — {labels.completed}
                    </p>
                    {quizzesPassed[unitNumber] ? (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2E5C8A] to-[#3D7AB5] px-5 py-1.5 text-sm font-semibold text-white shadow-sm">
                        <Star size={14} /> {badgeText}
                      </div>
                    ) : null}
                  </div>
                </div>
                {unitNumber === 2 && !isPythonCourse && !isFinanceCourse ? (
                  <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
                    <p className="font-semibold text-[#2E5C8A]"><Target size={14} className="inline me-1" />{labels.accuracyChallenge}</p>
                    <p className="text-sm text-[#495057]">
                      {unit2Content[0].challenge.description}
                    </p>
                    <button
                      type="button"
                      onClick={handleStartChallenge}
                      className="min-h-10 rounded-xl bg-[#2E5C8A] px-5 font-medium text-white shadow-sm hover:bg-[#24496E] transition-all"
                    >
                      {labels.startChallenge}
                    </button>
                    {challengeActive ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleCheckChallenge}
                          className="min-h-10 rounded-xl border border-[#E2E8F0] bg-white px-4 font-medium hover:bg-[#F8F9FA] transition-all"
                        >
                          {labels.checkChallenge}
                        </button>
                        <span className="rounded-full bg-[#F5F9FF] px-3 py-1 text-sm text-[#2E5C8A]">
                          {challengeTemplate.fixes.length} {language === "ar" ? "أخطاء" : "errors"}
                        </span>
                      </div>
                    ) : null}
                    {challengeFeedback ? (
                      <div
                        className={`flex items-center gap-2 rounded-xl border p-4 ${
                          challengeStatus === "success"
                            ? "border-[#2E7D32]/20 bg-[#E8F5E9] text-[#1B5E20]"
                            : "border-[#FF9800]/30 bg-[#FFF3E0] text-[#212529]"
                        }`}
                      >
                        <span>{challengeStatus === "success" ? <CheckCircle size={16} /> : <RefreshCw size={16} />}</span>
                        {challengeFeedback}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-3">
                  {!quizzesPassed[unitNumber] ? (
                    <button
                      type="button"
                      onClick={() => setQuizMode(true)}
                      className="min-h-11 rounded-xl bg-[#2E5C8A] px-6 font-medium text-white shadow-sm hover:bg-[#24496E] hover:shadow-md transition-all"
                    >
                      <FileText size={14} className="inline me-1" /> {labels.startQuiz}
                    </button>
                  ) : unitNumber < 7 ? (
                    <button
                      type="button"
                      onClick={() => handleUnitChange(unitNumber + 1)}
                      className="min-h-11 rounded-xl bg-[#2E7D32] px-6 font-medium text-white shadow-sm hover:bg-[#1B5E20] hover:shadow-md transition-all"
                    >
                      <ArrowRight size={14} className="inline me-1" /> {labels.nextUnit}
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>
        )}
      </main>
    </div>
  );
}
