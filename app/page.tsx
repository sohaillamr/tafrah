"use client";

import Image from "next/image";
import Link from "next/link";
import TopBar from "./components/TopBar";
import { useLanguage } from "./components/LanguageProvider";

export default function HomePage() {
  const { language } = useLanguage();
  const labels =
    language === "ar"
      ? {
          heroTitle: "طفرة: منصة التدريب والتوظيف المتخصصة لذوي التوحد في مصر.",
          heroText: "نحن نوفر بيئة عمل هادئة، تعليمات مباشرة، وفرص عمل حقيقية تضمن حقوقك.",
          heroCta: "ابدأ رحلتك الآن",
          whyTitle: "لماذا طفرة؟",
          stat1: "٨٠٠,٠٠٠",
          stat1Text: "شخص من ذوي التوحد في مصر يحتاجون لفرصة عمل تناسبهم.",
          stat2: "٥٪",
          stat2Text: "النسبة القانونية التي نساعد الشركات على تحقيقها باحترافية.",
          stat3: "صفر مشتتات",
          stat3Text: "منهجية العمل والتدريب لدينا تضمن أعلى درجات التركيز.",
          howTitle: "كيف نغير حياتك المهنية؟",
          how1: "تقييم ذكي: اختبار بسيط لتحديد نقاط قوتك.",
          how2: "تعلم مهني: دورات مصغرة في البيانات، التصميم، واختبار البرمجيات.",
          how3: "عمل حقيقي: استلام تاسكات من شركات كبرى بمقابل مادي عادل.",
          partnersTitle: "شركاء النجاح",
          partnersSubtitle: "نفخر بالتعاون مع مؤسسات رائدة تشاركنا رؤيتنا",
          ershadName: "أكاديمية إرشاد",
          ershadDesc: "أكاديمية إرشاد هي منصة تعليمية رائدة متخصصة في تقديم برامج تدريبية متكاملة في مجالات التربية الخاصة، الإرشاد الأسري، والصحة النفسية. تهدف المنصة إلى تيسير الوصول إلى العلم النفسي والتربوي بأسلوب مبسط وعملي يلامس الاحتياجات اليومية للأفراد والأسر وذوي الاحتياجات الخاصة، مما يساهم في بناء مجتمع أكثر تماسكاً ووعياً وتوازناً.",
          ershadCta: "زيارة أكاديمية إرشاد",
          helpTitle: "تحتاج مساعدة الآن؟",
          helpText:
            "تواصل مباشرة مع جمعية متخصصة للحصول على دعم واستشارات لذوي التوحد وأسرهم.",
          helpCta: "الانتقال إلى الجمعية المصرية للتوحد",
          helpNote: "يفتح الرابط في نافذة جديدة.",
          hrTitle: "هل أنت صاحب شركة؟",
          hrText: "حقق نسبة الـ ٥٪ ووظف كفاءات استثنائية في تدقيق البيانات والبرمجيات.",
          hrCta: "تواصل معنا كشركة",
          logoAlt: "شعار طفرة",
        }
      : {
          heroTitle:
            "Tafrah: A training and employment platform specialized for autistic people in Egypt.",
          heroText:
            "We provide a calm work environment, direct instructions, and real job opportunities that protect your rights.",
          heroCta: "Start your journey now",
          whyTitle: "Why Tafrah?",
          stat1: "800,000",
          stat1Text: "Autistic people in Egypt who need a suitable job opportunity.",
          stat2: "5%",
          stat2Text: "The legal ratio we help companies achieve professionally.",
          stat3: "Zero distractions",
          stat3Text: "Our training approach ensures maximum focus.",
          howTitle: "How we change your career",
          how1: "Smart assessment: a simple test to identify your strengths.",
          how2: "Professional learning: short courses in data, design, and software testing.",
          how3: "Real work: tasks from major companies with fair pay.",
          partnersTitle: "Success Partners",
          partnersSubtitle: "We're proud to collaborate with leading organizations that share our vision",
          ershadName: "Ershad Academy",
          ershadDesc: "Ershad Academy is a leading educational platform specializing in comprehensive training programs in special education, family counseling, and mental health. The platform aims to facilitate access to psychological and educational knowledge in a simplified and practical approach that addresses the daily needs of individuals, families, and people with special needs, contributing to building a more cohesive, aware, and balanced society.",
          ershadCta: "Visit Ershad Academy",
          helpTitle: "Need help now?",
          helpText:
            "Reach out directly to a specialized organization for support and guidance.",
          helpCta: "Visit the Egyptian Autistic Society",
          helpNote: "Opens in a new tab.",
          hrTitle: "Are you a company owner?",
          hrText: "Meet the 5% requirement and hire exceptional talent in data and software QA.",
          hrCta: "Contact us as a company",
          logoAlt: "Tafrah logo",
        };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 text-[#212529]">
        <section className="flex flex-col items-center gap-6 rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] px-6 py-10 text-center">
          <Image
            src="/logo.png"
            alt={labels.logoAlt}
            width={220}
            height={220}
            priority
          />
          <div className="flex max-w-4xl flex-col gap-4">
            <h1 className="text-[#2E5C8A] font-semibold">
              {labels.heroTitle}
            </h1>
            <p>
              {labels.heroText}
            </p>
          </div>
          <Link
            href="/auth/select"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#2E5C8A] px-8 text-white"
          >
            {labels.heroCta}
          </Link>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-semibold text-[#2E5C8A]">{labels.whyTitle}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-6">
              <div className="text-[24px] font-semibold text-[#2E5C8A]">{labels.stat1}</div>
              <p>{labels.stat1Text}</p>
            </div>
            <div className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-6">
              <div className="text-[24px] font-semibold text-[#2E5C8A]">{labels.stat2}</div>
              <p>{labels.stat2Text}</p>
            </div>
            <div className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-6">
              <div className="text-[24px] font-semibold text-[#2E5C8A]">{labels.stat3}</div>
              <p>{labels.stat3Text}</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-semibold text-[#2E5C8A]">{labels.howTitle}</h2>
          <ul className="list-inside list-disc rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] px-6 py-4">
            <li>{labels.how1}</li>
            <li>{labels.how2}</li>
            <li>{labels.how3}</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
          <h2 className="font-semibold text-[#2E5C8A]">{labels.helpTitle}</h2>
          <p>{labels.helpText}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.autismegypt.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#2E5C8A] px-6 text-white"
            >
              {labels.helpCta}
            </a>
          </div>
          <p className="text-sm text-[#495057]">{labels.helpNote}</p>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-[#2E5C8A]">{labels.partnersTitle}</h2>
            <p className="text-sm text-[#495057]">{labels.partnersSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {/* Ershad Academy */}
            <a
              href="https://www.ershadacademy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-5 rounded-lg border border-[#D9E6F2] bg-white p-8 transition-all hover:border-[#2E5C8A] hover:shadow-md md:flex-row md:items-start"
            >
              <div className="flex-shrink-0 overflow-hidden rounded-lg border border-[#E9EFF5] bg-white p-3">
                <Image
                  src="/ershad-logo.png"
                  alt={labels.ershadName}
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-3 text-center md:text-start">
                <h3 className="text-lg font-semibold text-[#2E5C8A]">{labels.ershadName}</h3>
                <p className="text-sm leading-relaxed text-[#495057]">{labels.ershadDesc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#2E5C8A] group-hover:underline">
                  {labels.ershadCta} ←
                </span>
              </div>
            </a>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
          <h2 className="font-semibold text-[#2E5C8A]">{labels.hrTitle}</h2>
          <p>{labels.hrText}</p>
          <Link
            href="/auth/hr"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#2E5C8A] px-8 text-white"
          >
            {labels.hrCta}
          </Link>
        </section>
      </main>

    </div>
  );
}
