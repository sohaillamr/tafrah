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
          heroTitle: "إطلاق العنان للقدرات البشرية من خلال الذكاء الاصطناعي التكيفي.",
          heroText: "طفرة هي منظومة ذكاء اصطناعي تقدم تدريباً تقنياً مهنياً لمجتمع التنوع العصبي وذوي الشلل الدماغي، لتحويل الدمج المجتمعي إلى أصل اقتصادي استراتيجي.",
          heroCta: "ابدأ رحلتك الآن",
          whyTitle: "الركائز الأساسية",
          stat1: "التنوع العصبي (التوحد)",
          stat1Text: "تقديم واجهات تكيفية حسياً ومسارات عمل منظمة.",
          stat2: "التنوع الحركي (الشلل الدماغي)",
          stat2Text: "تصفح محسّن حركياً وتفاعل مدعوم بالصوت.",
          stat3: "احتياجات التعلم الإدراكية",
          stat3Text: "إدارة مبسطة للعبء المعرفي عبر ذكاء نور الاصطناعي.",
          techTitle: "المحرك التقني التكيفي (Neuro-Adaptive Engine)",
          techText: "محركنا التكيفي لا يقتصر على تغيير الألوان أو الخطوط؛ بل يعيد هيكلة المعلومات بالكامل بناءً على احتياجات المستخدم عبر (Nour AI). فإذا كان المستخدم يعاني من صعوبات التعلم، يقوم المحرك بتبسيط العبء المعرفي (Cognitive Buffering). وإذا كان المستخدم يعاني من الشلل الدماغي (CP)، يتم تفعيل واجهات تناسب القيود الحركية بمساعدة مدخلات مساعدة، مما يضمن بنية تحتية شاملة وداعمة (Inclusive Infrastructure).",
          howTitle: "مسار الـ 5% المهني",
          how1: "الربط المباشر: جسر بين التدريب التقني المتخصص وحصة التوظيف القانونية في الشركات والبنوك.",
          how2: "التعلم التكيفي: تخصيص التجربة للأنماط المعرفية المختلفة.",
          how3: "التمكين المهني: بيئة تمكينية لضمان تحويل القدرات إلى قيمة عملية.",
          partnersTitle: "شركاء النجاح",
          partnersSubtitle: "نفخر بالتعاون مع مؤسسات رائدة تشاركنا رؤيتنا في التمكين التقني الشامل",
          ershadName: "أكاديمية إرشاد",
          ershadDesc: "أكاديمية إرشاد هي منصة تعليمية رائدة متخصصة في تقديم برامج تدريبية متكاملة في مجالات التربية الخاصة، الإرشاد الأسري، والصحة النفسية. تهدف المنصة إلى تيسير الوصول إلى العلم النفسي والتربوي بأسلوب مبسط وعملي.",
          ershadCta: "زيارة أكاديمية إرشاد",
          helpTitle: "تحتاج مساعدة الآن؟",
          helpText:
            "تواصل مباشرة مع جمعية متخصصة للحصول على دعم واستشارات.",
          helpCta: "الجمعية المصرية للتوحد",
          helpNote: "يفتح الرابط في نافذة جديدة.",
          hrTitle: "هل أنت صاحب شركة؟",
          hrText: "حقق نسبة الـ 5% القانونية واستقطب كفاءات استثنائية من جميع الأطياف في مجالات التقنية وتحليل البيانات.",
          hrCta: "تواصل معنا كشركة",
          logoAlt: "شعار طفرة",
        }
      : {
          heroTitle: "Unlocking Human Potential Through Adaptive Intelligence.",
          heroText: "Tafrah is an AI-driven ecosystem providing professional technical training for the neurodivergent community and individuals with Cerebral Palsy, turning social inclusion into a strategic economic asset.",
          heroCta: "Start your journey now",
          whyTitle: "The Three Pillars",
          stat1: "Neurodivergence (Autism)",
          stat1Text: "Sensory-adaptive rendering and structured workflows.",
          stat2: "Physical Diversity (CP)",
          stat2Text: "Motor-optimized navigation and voice-assisted interaction.",
          stat3: "Cognitive Learning Needs",
          stat3Text: "Simplified cognitive load management through Nour AI.",
          techTitle: "The Neuro-Adaptive Engine",
          techText: "Our Neuro-Adaptive Engine goes beyond merely changing colors or fonts; it dynamically adapts the entire hierarchy of information through Nour AI. If a user has a learning disability, it provides cognitive buffering to simplify the load. For individuals with Cerebral Palsy (CP), it optimizes inputs for motor efficiency, creating a truly robust and inclusive infrastructure tailored for empowerment.",
          howTitle: "The 5% Pathway",
          how1: "Direct Link: A bridge between specialized technical training and the mandatory legal employment quota.",
          how2: "Adaptive Intelligence: Tailoring the learning experience to the specific cognitive profile of the user.",
          how3: "Professional Empowerment: Turning inclusion capabilities into strategic value for organizations.",
          partnersTitle: "Success Partners",
          partnersSubtitle: "We're proud to collaborate with leading organizations that share our vision",
          ershadName: "Ershad Academy",
          ershadDesc: "Ershad Academy is a leading educational platform specializing in comprehensive training programs in special education, family counseling, and mental health. The platform aims to facilitate access to psychological and educational knowledge in a simplified and practical approach.",
          ershadCta: "Visit Ershad Academy",
          helpTitle: "Need help now?",
          helpText:
            "Reach out directly to a specialized organization for support and guidance.",
          helpCta: "Visit the Egyptian Autistic Society",
          helpNote: "Opens in a new tab.",
          hrTitle: "Are you a company owner?",
          hrText: "Meet the 5% requirement by employing exceptional talent empowered by our inclusive digital infrastructure.",
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
            <h1 className="text-[#2E5C8A] font-semibold text-2xl md:text-3xl">
              {labels.heroTitle}
            </h1>
            <p className="text-lg">
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
          <h2 className="font-semibold text-[#2E5C8A] text-xl">{labels.whyTitle}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-6">
              <div className="text-[20px] font-semibold text-[#2E5C8A]">{labels.stat1}</div>
              <p>{labels.stat1Text}</p>
            </div>
            <div className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-6">
              <div className="text-[20px] font-semibold text-[#2E5C8A]">{labels.stat2}</div>
              <p>{labels.stat2Text}</p>
            </div>
            <div className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-6">
              <div className="text-[20px] font-semibold text-[#2E5C8A]">{labels.stat3}</div>
              <p>{labels.stat3Text}</p>
            </div>
          </div>
        </section>

        {/* Product / Technology Section */}
        <section className="flex flex-col gap-4 rounded-sm border border-[#D9E6F2] bg-white p-6 md:p-8">
          <h2 className="font-semibold text-[#2E5C8A] text-xl">{labels.techTitle}</h2>
          <p className="leading-relaxed text-[#495057]">{labels.techText}</p>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-semibold text-[#2E5C8A] text-xl">{labels.howTitle}</h2>
          <ul className="list-inside list-disc rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] px-6 py-4 space-y-2">
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
            <h2 className="font-semibold text-[#2E5C8A] text-xl">{labels.partnersTitle}</h2>
            <p className="text-sm text-[#495057]">{labels.partnersSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
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
                  {labels.ershadCta} &rarr;
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
