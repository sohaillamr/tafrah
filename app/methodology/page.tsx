"use client";

import Link from "next/link";
import TopBar from "../components/TopBar";
import { useLanguage } from "../components/LanguageProvider";

const sources = [
  {
    titleEn: "WHO autism Q&A and global prevalence estimate",
    titleAr: "منظمة الصحة العالمية: أسئلة وإجابات عن التوحد وتقديرات الانتشار",
    href: "https://www.who.int/news-room/questions-and-answers/item/autism-spectrum-disorders-%28asd%29%E2%9F%A9",
  },
  {
    titleEn: "Mapping autism in Egypt: population-based prevalence insights",
    titleAr: "دراسة عن انتشار التوحد في مصر بناءً على بيانات سكانية",
    href: "https://molecularautism.biomedcentral.com/articles/10.1186/s13229-025-00665-1",
  },
  {
    titleEn: "Participatory sensory-friendly design with autistic youth and mentors",
    titleAr: "تصميم تشاركي صديق للحواس مع شباب وموجهين من طيف التوحد",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9254619/",
  },
  {
    titleEn: "Assistive technology for autistic adults: user-centered design",
    titleAr: "التقنيات المساعدة للبالغين من طيف التوحد: تصميم يتمحور حول المستخدم",
    href: "https://pubmed.ncbi.nlm.nih.gov/38784821/",
  },
];

export default function MethodologyPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const labels = isAr
    ? {
        title: "منهجية طفرة",
        intro:
          "طفرة تبدأ بالتوحد الآن. تصميم الدورات، التفضيلات، وطريقة عمل نور مبنية على مقابلات واستبيانات وتجارب استخدام ومراجعة خبراء ومراجع علمية عن طيف التوحد والتعلم الحسي.",
        lived: "خبرة المستخدمين أنفسهم",
        livedText: "نتعامل مع الأشخاص على طيف التوحد كمشاركين في التصميم، لا كمستقبلين فقط. التفضيلات تعني راحة حسية وتحكم وتوقع واضح لما سيحدث.",
        mentor: "مراجعة خبراء وموجهين",
        mentorText: "نراجع الخطوات والأسئلة وطريقة التغذية الراجعة مع موجهين وخبراء حتى تبقى الدروس عملية وواضحة.",
        research: "تصميم مستند إلى البحث",
        researchText: "نستخدم ألواناً أهدأ، حركة أقل، نصوصاً أقصر، تقدم مرئي، وخيار قراءة النص لتقليل الحمل الحسي والمعرفي.",
        affects: "كيف يظهر ذلك داخل المنصة؟",
        bullets: [
          "كل طالب يبدأ باستبيان قصير ثم يختار تفضيلاته الحسية والقرائية.",
          "لوحة الطالب تعرض التقدم والخبرة المكتسبة بدون ازدحام بصري.",
          "الدروس تعرض خطوة واحدة بوضوح مع اختبارات قصيرة وشهادات تقدم.",
          "المركز يدير الطلاب ويرى الإحصاءات ولا يدخل الدورات بدلاً منهم.",
          "دعم الشلل الدماغي وصعوبات التعلم موجود في خارطة الطريق ويتم ذكره بوضوح.",
        ],
        sourceTitle: "مصادر مختارة",
        cta: "ابدأ مع طفرة",
      }
    : {
        title: "Tafrah methodology",
        intro:
          "Tafrah is autism-first today. Course design, preferences, and Nour's support model are informed by interviews, surveys, usability feedback, expert review, and scientific sources about autism and sensory learning.",
        lived: "Lived experience",
        livedText: "We treat autistic learners as co-designers. Preferences are about sensory comfort, control, and predictable learning.",
        mentor: "Mentor and expert review",
        mentorText: "Steps, questions, and feedback are reviewed with mentors and experts so lessons stay practical and clear.",
        research: "Research-informed design",
        researchText: "We use calmer colors, reduced motion, shorter text, visible progress, and optional read-aloud to lower sensory and cognitive load.",
        affects: "How this appears in the platform",
        bullets: [
          "Each student starts with a short survey, then chooses sensory and reading preferences.",
          "The learner dashboard shows progress and XP without visual overload.",
          "Lessons show one clear step at a time with short quizzes and progress certificates.",
          "Centers manage students and see insights, but do not take courses for them.",
          "CP and learning-difficulty support are clearly marked as roadmap work.",
        ],
        sourceTitle: "Selected sources",
        cta: "Start with Tafrah",
      };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <section className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-[#495057]">{labels.intro}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card title={labels.lived} text={labels.livedText} />
          <Card title={labels.mentor} text={labels.mentorText} />
          <Card title={labels.research} text={labels.researchText} />
        </section>

        <section className="rounded-sm border border-[#D9E6F2] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.affects}</h2>
          <ul className="mt-4 list-disc space-y-2 ps-6 text-[#495057]">
            {labels.bullets.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
          <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.sourceTitle}</h2>
          <div className="mt-4 grid gap-3">
            {sources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer" className="rounded-sm border border-[#D9E6F2] bg-white p-4 text-[#2E5C8A] hover:underline">
                {isAr ? source.titleAr : source.titleEn}
              </a>
            ))}
          </div>
        </section>

        <Link href="/auth/select" className="inline-flex min-h-12 w-fit items-center rounded-sm bg-[#2E5C8A] px-6 font-semibold text-white">
          {labels.cta}
        </Link>
      </main>
    </div>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-sm border border-[#D9E6F2] bg-white p-5">
      <h2 className="text-xl font-semibold text-[#2E5C8A]">{title}</h2>
      <p className="mt-2 leading-relaxed text-[#495057]">{text}</p>
    </article>
  );
}
