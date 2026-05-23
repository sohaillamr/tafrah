"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  HeartHandshake,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { useLanguage } from "../components/LanguageProvider";
import {
  evaluateServiceCardSimulation,
  needsCognitiveScreening,
  SERVICE_CARD_SOURCES,
  ServiceCardDisabilityType,
  ServiceCardDocuments,
  ServiceCardSimulationResult,
  ServiceCardSupportAnswers,
  CognitiveScreeningAnswers,
} from "@/lib/service-card";

const disabilityOptions: Array<{
  value: ServiceCardDisabilityType;
  en: string;
  ar: string;
}> = [
  { value: "autism", en: "Autism spectrum", ar: "طيف التوحد" },
  { value: "intellectual", en: "Intellectual or developmental disability", ar: "إعاقة ذهنية أو نمائية" },
  { value: "learning", en: "Learning disability", ar: "صعوبات تعلم" },
  { value: "cerebral_palsy", en: "Cerebral palsy or motor disability", ar: "شلل دماغي أو إعاقة حركية" },
  { value: "visual", en: "Visual disability", ar: "إعاقة بصرية" },
  { value: "hearing", en: "Hearing disability", ar: "إعاقة سمعية" },
  { value: "multiple", en: "Multiple disabilities", ar: "إعاقات متعددة" },
  { value: "other", en: "Other disability", ar: "إعاقة أخرى" },
];

const documentItems: Array<{
  key: keyof ServiceCardDocuments;
  en: string;
  ar: string;
  optional?: boolean;
}> = [
  {
    key: "nationalIdOrBirthCertificate",
    en: "National ID, or computerized birth certificate for a child",
    ar: "بطاقة الرقم القومي، أو شهادة ميلاد مميكنة للطفل",
  },
  { key: "personalPhoto", en: "Recent personal photo", ar: "صورة شخصية حديثة" },
  {
    key: "medicalReports",
    en: "Recent medical reports from an approved hospital or specialist",
    ar: "تقارير طبية حديثة من مستشفى أو طبيب متخصص",
  },
  {
    key: "guardianId",
    en: "Guardian ID or guardianship paper for a child or applicant who needs a legal guardian",
    ar: "بطاقة ولي الأمر أو مستند الوصاية عند الحاجة",
  },
  {
    key: "proofOfAddress",
    en: "Address details that match the nearest rehabilitation office",
    ar: "بيانات عنوان واضحة لتحديد مكتب التأهيل المختص",
  },
  {
    key: "previousAssessments",
    en: "Previous psychological, speech, hearing, vision, motor, or school assessments if available",
    ar: "تقييمات نفسية أو تخاطب أو سمع أو بصر أو حركة أو تقارير مدرسية إن وجدت",
    optional: true,
  },
];

const supportQuestions: Array<{
  key: keyof ServiceCardSupportAnswers;
  en: string;
  ar: string;
}> = [
  { key: "communication", en: "Communication with unfamiliar people", ar: "التواصل مع أشخاص غير مألوفين" },
  { key: "dailyLiving", en: "Eating, dressing, hygiene, and daily routine", ar: "الأكل واللبس والنظافة والروتين اليومي" },
  { key: "mobility", en: "Movement, transport, stairs, or hand use", ar: "الحركة والمواصلات والسلالم واستخدام اليد" },
  {
    key: "learning",
    en: "Learning, reading, writing, numbers, or following instructions",
    ar: "التعلم والقراءة والكتابة والأرقام واتباع التعليمات",
  },
  { key: "sensory", en: "Noise, light, crowds, transitions, or overload", ar: "الضوضاء والضوء والزحام والانتقال بين الأنشطة" },
  { key: "supervision", en: "Need for adult supervision to stay safe", ar: "الحاجة لإشراف بالغ للحفاظ على السلامة" },
];

const cognitiveQuestions: Array<{
  key: keyof CognitiveScreeningAnswers;
  en: string;
  ar: string;
  promptEn: string;
  promptAr: string;
}> = [
  {
    key: "pattern",
    en: "Pattern",
    ar: "النمط",
    promptEn: "Can the learner complete a simple pattern such as 2, 4, 6, __?",
    promptAr: "هل يستطيع المتعلم إكمال نمط بسيط مثل ٢، ٤، ٦، __؟",
  },
  {
    key: "memory",
    en: "Memory",
    ar: "الذاكرة",
    promptEn: "After hearing three words, can the learner remember them after one minute?",
    promptAr: "بعد سماع ثلاث كلمات، هل يستطيع تذكرها بعد دقيقة؟",
  },
  {
    key: "everydayMath",
    en: "Everyday math",
    ar: "الحساب اليومي",
    promptEn: "Can the learner choose the correct money amount for a simple purchase?",
    promptAr: "هل يستطيع اختيار مبلغ مناسب لعملية شراء بسيطة؟",
  },
  {
    key: "comprehension",
    en: "Comprehension",
    ar: "الفهم",
    promptEn: "Can the learner explain one short instruction in their own way?",
    promptAr: "هل يستطيع شرح تعليمات قصيرة بطريقته؟",
  },
  {
    key: "attention",
    en: "Attention",
    ar: "الانتباه",
    promptEn: "Can the learner stay with a calm task for five minutes with limited help?",
    promptAr: "هل يستطيع الاستمرار في مهمة هادئة لخمس دقائق بمساعدة قليلة؟",
  },
];

const initialDocuments: ServiceCardDocuments = {
  nationalIdOrBirthCertificate: false,
  personalPhoto: false,
  medicalReports: false,
  guardianId: false,
  proofOfAddress: false,
  previousAssessments: false,
};

const initialSupport: ServiceCardSupportAnswers = {
  communication: 1,
  dailyLiving: 1,
  mobility: 0,
  learning: 1,
  sensory: 1,
  supervision: 1,
};

const initialCognitive: CognitiveScreeningAnswers = {
  pattern: 1,
  memory: 1,
  everydayMath: 1,
  comprehension: 1,
  attention: 1,
};

const copy = {
  en: {
    home: "Home",
    breadcrumb: "Integrated Services Card",
    badge: "Egypt service card readiness",
    title: "Integrated Services Card guide and preparation simulation",
    intro:
      "This page helps families prepare for Egypt's Integrated Services Card process. It summarizes the official path, checks document readiness, and gives a calm practice screen for functional and cognitive evidence.",
    warning:
      "Tafrah does not issue the card, diagnose disability, or calculate an official IQ. The official decision belongs to the authorized medical and functional assessment committees.",
    important: "Important:",
    processSteps: [
      "Register or follow up through the official medical/social process.",
      "Attend medical assessment by the competent medical committee.",
      "Complete functional assessment through MOSS rehabilitation office or merged committee.",
      "Follow printing, delivery, complaint, or appeal status through official channels.",
    ],
    cards: [
      {
        title: "What the official process checks",
        text: "Official sources describe proof of disability through medical assessment and functional assessment. Recent ministry updates also describe combining both assessments in one committee in some workflows to reduce waiting.",
      },
      {
        title: "About IQ and cognitive tests",
        text: "For intellectual, developmental, autism, or learning cases, specialists may look at cognitive ability, adaptive behavior, communication, and daily independence. This simulator uses gentle screening practice, not an IQ test.",
      },
      {
        title: "What Tafrah can do safely",
        text: "Tafrah can help a family organize evidence, list support needs, print notes, and reduce anxiety before the appointment. It cannot predict acceptance with certainty.",
      },
    ],
    officialTitle: "Official links and verified notes",
    officialLinks: {
      service: "Ministry of Social Solidarity service details",
      portal: "MOSS Integrated Services Card portal",
      merged: "MOSS update on medical and functional assessment",
      sis: "State Information Service report on medical committees",
      health: "Ministry of Health medical assessment portal",
    },
    documentsTitle: "Document readiness",
    runTitle: "Run the simulation",
    runHint: "Answer slowly. The score means preparation readiness, not eligibility.",
    applicantName: "Applicant name",
    age: "Age",
    governorate: "Governorate",
    optional: "Optional",
    disabilityArea: "Main disability area",
    supportTitle: "Functional support needs",
    supportLevels: ["No support", "Some support", "Frequent support", "Full support"],
    cognitiveTitle: "Gentle cognitive screening practice",
    cognitiveNote:
      "This is only a practice checklist for evidence planning. A licensed specialist must perform any real IQ, adaptive behavior, or diagnostic assessment.",
    cognitiveOptions: ["Not yet", "Sometimes", "Usually"],
    preview: "Live readiness preview",
    runButton: "Run simulation",
    savingFailed: "Saved copy failed, but the local simulation is shown.",
    resultTitle: "Simulation result",
    saved: "Saved",
    local: "Local result",
    totalReadiness: "Total readiness",
    documentReadiness: "Document readiness",
    supportEvidence: "Functional support evidence",
    cognitiveScore: "Practice cognitive independence score, not IQ",
    committeeFocus: "Committee may focus on",
    missingDocs: "Missing documents",
    noMissing: "No required item is missing from this simulation.",
    nextSteps: "Next steps",
    familyTitle: "Family preparation note",
    familyText:
      "Before the appointment, write one page that explains what the learner can do independently, what requires help, what causes overload, and what support works. Bring reports, school notes, therapy notes, and any previous assessment. The official committee can ask for additional documents or re-assessment.",
    askHelp: "Ask Tafrah for preparation help",
    pathways: [
      "Strong preparation for official review",
      "Partial preparation - collect missing evidence before the appointment",
      "Early preparation - start with medical documentation and functional notes",
    ],
    next: [
      "Book or follow the medical-assessment path through the Ministry of Health portal or the competent medical committee.",
      "After the medical result, follow the Ministry of Social Solidarity portal instructions and attend the rehabilitation office or merged committee for functional assessment.",
      "Keep the hotline 15044 and the official MOSS portal for follow-up, complaints, or appeals.",
    ],
    collectMissing: "Collect the missing documents listed in the result before attending the committee.",
    bringCopies: "Bring printed copies of the documents and keep originals available for review.",
    noDiagnosis: "Do not use this simulation as a diagnosis, IQ score, or final eligibility decision.",
    disclaimer:
      "This is a Tafrah readiness simulation only. The Integrated Services Card is decided by authorized medical and functional assessment committees in Egypt.",
  },
  ar: {
    home: "الرئيسية",
    breadcrumb: "بطاقة الخدمات المتكاملة",
    badge: "جاهزية بطاقة الخدمات في مصر",
    title: "دليل بطاقة الخدمات المتكاملة ومحاكاة الاستعداد",
    intro:
      "هذه الصفحة تساعد الأسرة على فهم خطوات بطاقة الخدمات المتكاملة في مصر، وتجهيز المستندات، وتسجيل ملاحظات وظيفية ومعرفية بهدوء قبل الموعد الرسمي.",
    warning:
      "طفرة لا تصدر البطاقة، ولا تشخص الإعاقة، ولا تحسب درجة ذكاء رسمية. القرار الرسمي يكون فقط من اللجان الطبية والوظيفية المختصة.",
    important: "تنبيه مهم:",
    processSteps: [
      "التسجيل أو المتابعة من خلال المسار الرسمي الطبي والاجتماعي.",
      "حضور الكشف الطبي أمام اللجنة الطبية المختصة.",
      "استكمال التقييم الوظيفي من خلال مكتب التأهيل أو اللجنة المدمجة التابعة للتضامن.",
      "متابعة الطباعة أو التسليم أو التظلم من خلال القنوات الرسمية.",
    ],
    cards: [
      {
        title: "ما الذي تفحصه الإجراءات الرسمية؟",
        text: "المصادر الرسمية تذكر أن إثبات الإعاقة يعتمد على تقييم طبي وتقييم وظيفي. وتوجد تحديثات وزارية لدمج التقييمين في لجنة واحدة في بعض المسارات لتقليل الانتظار.",
      },
      {
        title: "عن اختبارات الذكاء والتقييم المعرفي",
        text: "في حالات الإعاقة الذهنية أو النمائية أو التوحد أو صعوبات التعلم، قد ينظر المختصون إلى القدرات المعرفية والسلوك التكيفي والتواصل والاستقلال اليومي. هذه المحاكاة تدريب لطيف فقط وليست اختبار ذكاء.",
      },
      {
        title: "ما الذي تستطيع طفرة فعله بأمان؟",
        text: "تستطيع طفرة مساعدة الأسرة في ترتيب الأدلة، وكتابة احتياجات الدعم، وتجهيز ملاحظات قابلة للطباعة، وتقليل القلق قبل الموعد. لكنها لا تتنبأ بالقبول بشكل مؤكد.",
      },
    ],
    officialTitle: "روابط رسمية وملاحظات موثقة",
    officialLinks: {
      service: "تفاصيل الخدمة من وزارة التضامن الاجتماعي",
      portal: "بوابة خدمات بطاقة الخدمات المتكاملة",
      merged: "خبر دمج التقييم الطبي والوظيفي",
      sis: "تقرير الهيئة العامة للاستعلامات عن اللجان الطبية",
      health: "بوابة وزارة الصحة للكشف الطبي",
    },
    documentsTitle: "جاهزية المستندات",
    runTitle: "تشغيل المحاكاة",
    runHint: "أجب بهدوء. النتيجة تعني جاهزية التحضير وليست قرار استحقاق.",
    applicantName: "اسم المتقدم",
    age: "العمر",
    governorate: "المحافظة",
    optional: "اختياري",
    disabilityArea: "مجال الإعاقة الأساسي",
    supportTitle: "احتياجات الدعم الوظيفي",
    supportLevels: ["لا يحتاج دعم", "دعم بسيط", "دعم متكرر", "دعم كامل"],
    cognitiveTitle: "تدريب معرفي لطيف",
    cognitiveNote:
      "هذا مجرد تدريب لتجهيز الأدلة. أي اختبار ذكاء أو سلوك تكيفي أو تشخيص رسمي يجب أن يقوم به مختص مرخص.",
    cognitiveOptions: ["ليس بعد", "أحياناً", "غالباً"],
    preview: "معاينة الجاهزية الحالية",
    runButton: "تشغيل المحاكاة",
    savingFailed: "تعذر حفظ النسخة، لكن نتيجة المحاكاة المحلية ظاهرة.",
    resultTitle: "نتيجة المحاكاة",
    saved: "تم الحفظ",
    local: "نتيجة محلية",
    totalReadiness: "إجمالي الجاهزية",
    documentReadiness: "جاهزية المستندات",
    supportEvidence: "دليل الاحتياج الوظيفي",
    cognitiveScore: "درجة تدريب الاستقلال المعرفي، وليست IQ",
    committeeFocus: "قد تركز اللجنة على",
    missingDocs: "المستندات الناقصة",
    noMissing: "لا يوجد مستند أساسي ناقص في هذه المحاكاة.",
    nextSteps: "الخطوات التالية",
    familyTitle: "ملاحظة تجهيز للأسرة",
    familyText:
      "قبل الموعد، اكتب صفحة واحدة توضح ما يستطيع المتعلم فعله باستقلال، وما يحتاج فيه مساعدة، وما يسبب له إنهاكاً أو تحميلًا حسياً، وما نوع الدعم الذي يساعده. أحضر التقارير الطبية والمدرسية والعلاجية وأي تقييمات سابقة. قد تطلب اللجنة الرسمية مستندات إضافية أو إعادة تقييم.",
    askHelp: "اطلب مساعدة طفرة في التجهيز",
    pathways: [
      "تحضير قوي للمراجعة الرسمية",
      "تحضير متوسط - اجمع الأدلة الناقصة قبل الموعد",
      "مرحلة تجهيز مبكرة - ابدأ بالتقارير الطبية والملاحظات الوظيفية",
    ],
    next: [
      "احجز أو تابع مسار الكشف الطبي من بوابة وزارة الصحة أو اللجنة الطبية المختصة.",
      "بعد نتيجة الكشف الطبي، اتبع تعليمات بوابة وزارة التضامن وتوجه إلى مكتب التأهيل أو اللجنة المدمجة للتقييم الوظيفي.",
      "احتفظ بالخط الساخن 15044 وبوابة التضامن الرسمية للمتابعة أو الشكاوى أو التظلمات.",
    ],
    collectMissing: "اجمع المستندات الناقصة المذكورة في النتيجة قبل حضور اللجنة.",
    bringCopies: "أحضر نسخاً مطبوعة من المستندات واحتفظ بالأصول للمراجعة.",
    noDiagnosis: "لا تستخدم هذه المحاكاة كتشخيص أو درجة ذكاء أو قرار استحقاق نهائي.",
    disclaimer:
      "هذه محاكاة استعداد من طفرة فقط. بطاقة الخدمات المتكاملة تقررها اللجان الطبية والوظيفية المختصة في مصر.",
  },
};

const committeeFocus: Record<ServiceCardDisabilityType, { en: string[]; ar: string[] }> = {
  autism: {
    en: ["medical diagnosis and developmental history", "communication, social interaction, sensory regulation, and daily independence", "functional assessment at the rehabilitation office or merged committee"],
    ar: ["التشخيص الطبي والتاريخ النمائي", "التواصل والتفاعل الاجتماعي والتنظيم الحسي والاستقلال اليومي", "التقييم الوظيفي في مكتب التأهيل أو اللجنة المدمجة"],
  },
  intellectual: {
    en: ["medical and psychological documentation", "adaptive behavior and daily living skills", "cognitive testing may be requested by the specialist committee"],
    ar: ["التقارير الطبية والنفسية", "السلوك التكيفي ومهارات الحياة اليومية", "قد تطلب اللجنة المختصة تقييماً معرفياً"],
  },
  learning: {
    en: ["school reports and specialist learning assessments", "reading, writing, calculation, and classroom functioning", "functional impact on independent learning"],
    ar: ["التقارير المدرسية وتقييمات صعوبات التعلم", "القراءة والكتابة والحساب والأداء داخل الفصل", "أثر الصعوبة على التعلم باستقلال"],
  },
  cerebral_palsy: {
    en: ["neurology or orthopedic report", "mobility, fine-motor use, speech, and self-care impact", "assistive devices and rehabilitation history"],
    ar: ["تقرير مخ وأعصاب أو عظام", "الحركة والمهارات الدقيقة والكلام والعناية الذاتية", "الأجهزة التعويضية وتاريخ التأهيل"],
  },
  visual: {
    en: ["ophthalmology report and visual acuity or field measurements", "functional impact on reading, movement, and daily activities"],
    ar: ["تقرير رمد وقياسات حدة أو مجال الإبصار", "أثر الإعاقة على القراءة والحركة والأنشطة اليومية"],
  },
  hearing: {
    en: ["audiology report and hearing measurements", "speech-language impact and assistive hearing device history"],
    ar: ["تقرير سمعيات وقياسات السمع", "أثر السمع على اللغة والكلام وتاريخ السماعات أو الأجهزة"],
  },
  multiple: {
    en: ["reports for each disability area", "combined functional impact on daily living, mobility, learning, and communication"],
    ar: ["تقارير لكل مجال إعاقة", "الأثر الوظيفي المشترك على الحياة اليومية والحركة والتعلم والتواصل"],
  },
  other: {
    en: ["medical report that documents diagnosis and stability", "functional impact on daily living and participation"],
    ar: ["تقرير طبي يوضح التشخيص واستقرار الحالة", "الأثر الوظيفي على الحياة اليومية والمشاركة"],
  },
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-[#212529]">{label}</span>
        <span className="font-bold text-[#2E5C8A]">{value}%</span>
      </div>
      <div className="h-3 rounded-sm bg-[#E9EEF5]">
        <div className="h-3 rounded-sm bg-[#2E5C8A]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function requiredMissingDocuments(documents: ServiceCardDocuments, age: string, isAr: boolean) {
  const numericAge = Number(age);
  return documentItems
    .filter((item) => {
      if (item.optional) return false;
      if (item.key === "guardianId" && !(Number.isFinite(numericAge) && numericAge < 18)) return false;
      return !documents[item.key];
    })
    .map((item) => (isAr ? item.ar : item.en));
}

function localizedPathway(score: number, t: typeof copy.en) {
  if (score >= 78) return t.pathways[0];
  if (score >= 55) return t.pathways[1];
  return t.pathways[2];
}

export default function ServicesCardPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const t = isAr ? copy.ar : copy.en;
  const langKey = isAr ? "ar" : "en";

  const [applicantName, setApplicantName] = useState("");
  const [age, setAge] = useState("12");
  const [governorate, setGovernorate] = useState(isAr ? "القاهرة" : "Cairo");
  const [disabilityType, setDisabilityType] = useState<ServiceCardDisabilityType>("autism");
  const [documents, setDocuments] = useState<ServiceCardDocuments>(initialDocuments);
  const [supportAnswers, setSupportAnswers] = useState<ServiceCardSupportAnswers>(initialSupport);
  const [cognitiveAnswers, setCognitiveAnswers] = useState<CognitiveScreeningAnswers>(initialCognitive);
  const [result, setResult] = useState<ServiceCardSimulationResult | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "local">("idle");
  const [error, setError] = useState("");

  const showCognitive = needsCognitiveScreening(disabilityType);
  const preview = useMemo(
    () =>
      evaluateServiceCardSimulation({
        applicantName,
        age: Number(age) || undefined,
        governorate,
        disabilityType,
        documents,
        supportAnswers,
        cognitiveAnswers,
      }),
    [applicantName, age, governorate, disabilityType, documents, supportAnswers, cognitiveAnswers]
  );

  const missingDocuments = useMemo(
    () => requiredMissingDocuments(documents, age, isAr),
    [documents, age, isAr]
  );

  const resultNextSteps = useMemo(() => {
    const list = [...t.next, missingDocuments.length ? t.collectMissing : t.bringCopies, t.noDiagnosis];
    return list;
  }, [missingDocuments.length, t]);

  async function runSimulation() {
    setStatus("loading");
    setError("");
    setSavedId(null);

    const payload = {
      applicantName,
      age: Number(age) || undefined,
      governorate,
      disabilityType,
      documents,
      supportAnswers,
      cognitiveAnswers,
    };

    try {
      const response = await fetch("/api/service-card/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || t.savingFailed);
      }
      setResult(data.result);
      setSavedId(data.savedId || null);
      setStatus(data.savedId ? "saved" : "local");
    } catch (err) {
      setResult(evaluateServiceCardSimulation(payload));
      setStatus("local");
      setError(err instanceof Error ? err.message : t.savingFailed);
    }
  }

  const officialTitles = [
    t.officialLinks.service,
    t.officialLinks.portal,
    t.officialLinks.merged,
    t.officialLinks.sis,
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <TopBar />
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 text-[#212529] md:px-8">
        <Breadcrumbs
          ariaLabel={t.breadcrumb}
          items={[
            { label: t.home, href: "/" },
            { label: t.breadcrumb },
          ]}
        />

        <section className="grid gap-6 rounded-sm border border-[#D9E6F2] bg-white p-6 md:grid-cols-[1.15fr_0.85fr] md:p-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-[#E8F5E9] px-3 py-2 text-sm font-semibold text-[#1B5E20]">
              <ShieldCheck size={18} />
              {t.badge}
            </span>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-[#2E5C8A] md:text-4xl">
              {t.title}
            </h1>
            <p className="max-w-4xl text-lg leading-relaxed text-[#495057]">{t.intro}</p>
            <div className="rounded-sm border border-[#F4C7C3] bg-[#FFF8F7] p-4 text-sm leading-relaxed text-[#7A271A]">
              <strong>{t.important}</strong> {t.warning}
            </div>
          </div>

          <div className="grid gap-3">
            {t.processSteps.map((text, index) => (
              <div key={text} className="flex gap-3 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#2E5C8A] font-semibold text-white">
                  {index + 1}
                </span>
                <p className="leading-relaxed text-[#495057]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {[FileText, Brain, HeartHandshake].map((Icon, index) => (
            <article key={t.cards[index].title} className="rounded-sm border border-[#D9E6F2] bg-white p-5">
              <Icon className="mb-3 text-[#2E5C8A]" />
              <h2 className="text-xl font-semibold text-[#2E5C8A]">{t.cards[index].title}</h2>
              <p className="mt-2 leading-relaxed text-[#495057]">{t.cards[index].text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col gap-6">
            <article className="rounded-sm border border-[#D9E6F2] bg-white p-6">
              <h2 className="mb-4 text-2xl font-semibold text-[#2E5C8A]">{t.officialTitle}</h2>
              <div className="grid gap-3">
                {SERVICE_CARD_SOURCES.map((source, index) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-between gap-4 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] px-4 py-3 font-semibold text-[#2E5C8A]"
                  >
                    <span>{officialTitles[index]}</span>
                    <ExternalLink size={18} />
                  </a>
                ))}
                <a
                  href="http://pod.mohp.gov.eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-between gap-4 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] px-4 py-3 font-semibold text-[#2E5C8A]"
                >
                  <span>{t.officialLinks.health}</span>
                  <ExternalLink size={18} />
                </a>
              </div>
            </article>

            <article className="rounded-sm border border-[#D9E6F2] bg-white p-6">
              <h2 className="mb-4 text-2xl font-semibold text-[#2E5C8A]">{t.documentsTitle}</h2>
              <div className="grid gap-3">
                {documentItems.map((item) => (
                  <label key={item.key} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] px-4 py-3">
                    <input
                      type="checkbox"
                      checked={Boolean(documents[item.key])}
                      onChange={(event) => setDocuments((current) => ({ ...current, [item.key]: event.target.checked }))}
                      className="h-5 w-5"
                    />
                    <span className="text-sm leading-relaxed text-[#495057]">{item[langKey]}</span>
                  </label>
                ))}
              </div>
            </article>
          </div>

          <article className="rounded-sm border border-[#D9E6F2] bg-white p-6">
            <div className="mb-5 flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-[#2E5C8A]">{t.runTitle}</h2>
              <p className="text-sm leading-relaxed text-[#6C757D]">{t.runHint}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#212529]">{t.applicantName}</span>
                <input
                  value={applicantName}
                  onChange={(event) => setApplicantName(event.target.value)}
                  className="min-h-12 rounded-sm border border-[#B8CBDD] bg-white px-3"
                  placeholder={t.optional}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#212529]">{t.age}</span>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className="min-h-12 rounded-sm border border-[#B8CBDD] bg-white px-3"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#212529]">{t.governorate}</span>
                <input
                  value={governorate}
                  onChange={(event) => setGovernorate(event.target.value)}
                  className="min-h-12 rounded-sm border border-[#B8CBDD] bg-white px-3"
                />
              </label>
            </div>

            <label className="mt-4 flex flex-col gap-2">
              <span className="text-sm font-semibold text-[#212529]">{t.disabilityArea}</span>
              <select
                value={disabilityType}
                onChange={(event) => setDisabilityType(event.target.value as ServiceCardDisabilityType)}
                className="min-h-12 rounded-sm border border-[#B8CBDD] bg-white px-3"
              >
                {disabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option[langKey]}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold text-[#2E5C8A]">{t.supportTitle}</h3>
              <div className="grid gap-3">
                {supportQuestions.map((question) => (
                  <label key={question.key} className="grid gap-2 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4 md:grid-cols-[1fr_180px] md:items-center">
                    <span className="text-sm font-semibold text-[#212529]">{question[langKey]}</span>
                    <select
                      value={supportAnswers[question.key]}
                      onChange={(event) =>
                        setSupportAnswers((current) => ({ ...current, [question.key]: Number(event.target.value) }))
                      }
                      className="min-h-11 rounded-sm border border-[#B8CBDD] bg-white px-3"
                    >
                      {t.supportLevels.map((label, index) => (
                        <option key={label} value={index}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>

            {showCognitive ? (
              <div className="mt-6 rounded-sm border border-[#CFE5F8] bg-[#F5F9FF] p-4">
                <div className="mb-3 flex items-start gap-3">
                  <AlertCircle className="mt-1 shrink-0 text-[#2E5C8A]" size={20} />
                  <div>
                    <h3 className="text-lg font-semibold text-[#2E5C8A]">{t.cognitiveTitle}</h3>
                    <p className="text-sm leading-relaxed text-[#495057]">{t.cognitiveNote}</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {cognitiveQuestions.map((question) => (
                    <label key={question.key} className="grid gap-2 rounded-sm border border-[#D9E6F2] bg-white p-4 md:grid-cols-[1fr_180px] md:items-center">
                      <span>
                        <span className="block text-sm font-semibold text-[#212529]">{question[langKey]}</span>
                        <span className="block text-sm leading-relaxed text-[#6C757D]">{isAr ? question.promptAr : question.promptEn}</span>
                      </span>
                      <select
                        value={cognitiveAnswers[question.key]}
                        onChange={(event) =>
                          setCognitiveAnswers((current) => ({ ...current, [question.key]: Number(event.target.value) }))
                        }
                        className="min-h-11 rounded-sm border border-[#B8CBDD] bg-white px-3"
                      >
                        {t.cognitiveOptions.map((label, index) => (
                          <option key={label} value={index}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
              <ScoreBar label={t.preview} value={preview.readinessScore} />
              <button
                type="button"
                onClick={runSimulation}
                disabled={status === "loading"}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#2E5C8A] px-6 font-semibold text-white disabled:opacity-70"
              >
                {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : <ClipboardCheck size={18} />}
                {t.runButton}
              </button>
              {error ? <p className="text-sm text-[#9A3412]">{error}</p> : null}
            </div>
          </article>
        </section>

        {result ? (
          <section className="rounded-sm border border-[#D9E6F2] bg-white p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[#2E5C8A]">{t.resultTitle}</h2>
                <p className="mt-1 text-[#495057]">{localizedPathway(result.readinessScore, t)}</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-[#E8F5E9] px-3 py-2 text-sm font-semibold text-[#1B5E20]">
                <CheckCircle2 size={18} />
                {status === "saved" ? `${t.saved} #${savedId}` : t.local}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <ScoreBar label={t.totalReadiness} value={result.readinessScore} />
              <ScoreBar label={t.documentReadiness} value={result.documentReadiness} />
              <ScoreBar label={t.supportEvidence} value={result.supportNeedScore} />
            </div>

            {typeof result.cognitiveScore === "number" ? (
              <div className="mt-4 rounded-sm border border-[#F4C7C3] bg-[#FFF8F7] p-4">
                <ScoreBar label={t.cognitiveScore} value={result.cognitiveScore} />
              </div>
            ) : null}

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <div className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
                <h3 className="font-semibold text-[#2E5C8A]">{t.committeeFocus}</h3>
                <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[#495057]">
                  {committeeFocus[disabilityType][langKey].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
                <h3 className="font-semibold text-[#2E5C8A]">{t.missingDocs}</h3>
                {missingDocuments.length ? (
                  <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[#495057]">
                    {missingDocuments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-[#495057]">{t.noMissing}</p>
                )}
              </div>
              <div className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
                <h3 className="font-semibold text-[#2E5C8A]">{t.nextSteps}</h3>
                <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[#495057]">
                  {resultNextSteps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-5 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4 text-sm leading-relaxed text-[#495057]">
              {t.disclaimer}
            </p>
          </section>
        ) : null}

        <section className="rounded-sm border border-[#D9E6F2] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#2E5C8A]">{t.familyTitle}</h2>
          <p className="mt-3 max-w-4xl leading-relaxed text-[#495057]">{t.familyText}</p>
          <Link
            href="/contact"
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-sm border border-[#2E5C8A] bg-white px-5 font-semibold text-[#2E5C8A]"
          >
            {t.askHelp}
          </Link>
        </section>
      </main>
    </div>
  );
}
