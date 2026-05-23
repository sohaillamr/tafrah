"use client";

import Image from "next/image";
import Link from "next/link";
import TopBar from "./components/TopBar";
import { useLanguage } from "./components/LanguageProvider";

export default function HomePage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const labels = isAr
    ? {
        title: "طفرة: منصة تعلم تكيفية للأشخاص على طيف التوحد",
        subtitle:
          "منصة تدريب هادئة ومنظمة تتكيف مع احتياج كل متعلم: الإضاءة، الألوان، الحركة، كثافة النص، وطريقة عرض الخطوات.",
        individual: "ابدأ كفرد",
        center: "ابدأ كمركز",
        active: "متاح الآن",
        pipeline: "قيد التطوير",
        statTitle: "لماذا نبدأ بالتوحد؟",
        egyptStat: "دراسات حديثة في مصر وجدت انتشاراً ملحوظاً للتوحد بين الأطفال، مع اختلاف النسب حسب العمر والجنس والمنهجية.",
        globalStat: "منظمة الصحة العالمية تقدر أن شخصاً واحداً من كل 127 شخصاً حول العالم على طيف التوحد.",
        statNote: "نستخدم هذه الأرقام كإشارة لحجم الاحتياج، وليست بديلاً عن التشخيص الفردي أو البيانات الرسمية المحلية.",
        autism: "دعم التوحد",
        autismText: "استبيان بسيط، معالج تفضيلات، لوحة تقدم، ومساعدة نور أثناء التعلم.",
        cp: "الشلل الدماغي",
        cpText: "تحسينات الحركة، الأزرار الكبيرة، والتنقل المساعد ضمن خارطة الطريق.",
        ld: "صعوبات التعلم",
        ldText: "تبسيط النصوص، دعم القراءة، وتقليل العبء المعرفي ضمن خارطة الطريق.",
        serviceTitle: "هل تحتاج مساعدة في بطاقة الخدمات المتكاملة؟",
        serviceText:
          "طفرة لا تقدم بديلاً عن الجهات الرسمية، لكنها تساعدك على فهم الخطوات، تجهيز الأسئلة، والوصول إلى جهات دعم متخصصة.",
        serviceCta: "افتح دليل البطاقة",
        centerTitle: "للمراكز التعليمية والتأهيلية",
        centerText:
          "حساب المركز لا يدخل الدورات بدلاً من الطلاب. دوره تسجيل الطلاب، متابعة تقدمهم، قراءة الإحصاءات، والحصول على توصيات نور من البيانات.",
        nourTitle: "تحدث مع نور",
        nourText:
          "نور مساعد هادئ ومباشر. يعطي خطوة واحدة واضحة، يتجنب العبارات الغامضة، ويقرأ النص المحدد عند الحاجة.",
        nourCta: "افتح محادثة نور",
        scienceTitle: "منهجية مبنية على بحث ومقابلات",
        scienceText:
          "تصميم طفرة مبني على مقابلات، استبيانات، مراجعات خبراء، ومراجع علمية عن طيف التوحد والتعلم الحسي.",
        scienceCta: "اقرأ منهجيتنا",
        partnersTitle: "شركاء النجاح",
        partnersSubtitle: "نحافظ على الشراكات التي تضيف خبرة تربوية ونفسية حقيقية للتجربة.",
        ershadName: "أكاديمية إرشاد",
        ershadDesc:
          "منصة تعليمية متخصصة في التربية الخاصة، الإرشاد الأسري، والصحة النفسية، وتدعم تقديم المعرفة بأسلوب عملي وواضح.",
        ershadCta: "زيارة أكاديمية إرشاد",
        pioneersName: "مؤسسة ولاء جمال للتنمية والرعاية - أكاديمية بيونيرز",
        pioneersDesc:
          "تقدم رعاية متميزة وتعليما شاملا، وتنمي مهارات وقدرات الأطفال من خلال برامج متخصصة تناسب احتياجات كل طفل، مع تعزيز ثقتهم بأنفسهم وتحقيق إمكانياتهم الكاملة.",
        pioneersCta: "شريك تعليمي ورعائي",
        logoAlt: "شعار طفرة",
        sourceWho: "مصدر عالمي: WHO",
        sourceEgypt: "دراسة مصرية حديثة",
      }
    : {
        title: "Tafrah: adaptive learning for autistic learners",
        subtitle:
          "A calm, structured training platform that adapts to each learner's light, color, motion, text density, and step display preferences.",
        individual: "Start as an individual",
        center: "Start as a center",
        active: "Live now",
        pipeline: "In the pipeline",
        statTitle: "Why autism first?",
        egyptStat: "Recent Egyptian research reports meaningful autism prevalence among children, with rates varying by age, sex, and study method.",
        globalStat: "The World Health Organization estimates that about 1 in 127 people worldwide is autistic.",
        statNote: "We use these figures to show scale of need, not as a replacement for individual diagnosis or official local data.",
        autism: "Autism support",
        autismText: "A short survey, preference wizard, progress dashboard, and Nour support during learning.",
        cp: "Cerebral palsy",
        cpText: "Motor-friendly controls, larger targets, and assisted navigation are on the roadmap.",
        ld: "Learning difficulties",
        ldText: "Text simplification, reading support, and cognitive-load tools are on the roadmap.",
        serviceTitle: "Need help with the Integrated Services Card?",
        serviceText:
          "Tafrah does not replace official channels, but helps learners understand steps, prepare questions, and reach specialized support.",
        serviceCta: "Open the service card guide",
        centerTitle: "For learning and therapy centers",
        centerText:
          "Centers do not take courses for students. They create connected student accounts, monitor progress, review statistics, and receive Nour recommendations from the data.",
        nourTitle: "Chat with Nour",
        nourText:
          "Nour is calm and direct. It gives one clear step, avoids vague phrasing, and can read selected text when needed.",
        nourCta: "Open Nour chat",
        scienceTitle: "Built from research and lived experience",
        scienceText:
          "Tafrah's design is informed by surveys, interviews, expert review, and scientific sources about autism and sensory learning.",
        scienceCta: "Read our methodology",
        partnersTitle: "Success partners",
        partnersSubtitle: "We keep partnerships that add real educational and psychological expertise to the experience.",
        ershadName: "Ershad Academy",
        ershadDesc:
          "An education platform focused on special education, family counseling, and mental health, with clear and practical learning methods.",
        ershadCta: "Visit Ershad Academy",
        pioneersName: "Pioneers Academy",
        pioneersDesc:
          "A child development and care partner focused on comprehensive education, specialized programs matched to each child's needs, and building children's confidence and full potential.",
        pioneersCta: "Education and care partner",
        logoAlt: "Tafrah logo",
        sourceWho: "Global source: WHO",
        sourceEgypt: "Recent Egyptian study",
      };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 text-[#212529]">
        <section className="grid items-center gap-8 rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6 md:grid-cols-[220px_1fr] md:p-10">
          <Image src="/logo.png" alt={labels.logoAlt} width={200} height={200} priority />
          <div className="flex flex-col gap-5">
            <div className="inline-flex w-fit rounded-full bg-[#E8F5E9] px-3 py-1 text-sm font-semibold text-[#1B5E20]">
              {labels.active}: {labels.autism}
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-[#2E5C8A] md:text-4xl">
              {labels.title}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-[#495057]">{labels.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/user-signup" className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[#2E5C8A] px-6 font-semibold text-white">
                {labels.individual}
              </Link>
              <Link href="/auth/center-signup" className="inline-flex min-h-12 items-center justify-center rounded-sm border border-[#2E5C8A] bg-white px-6 font-semibold text-[#2E5C8A]">
                {labels.center}
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            [labels.autism, labels.autismText, labels.active],
            [labels.cp, labels.cpText, labels.pipeline],
            [labels.ld, labels.ldText, labels.pipeline],
          ].map(([title, text, badge]) => (
            <article key={title} className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-5">
              <span className="w-fit rounded-full bg-[#E3EEF9] px-3 py-1 text-sm font-semibold text-[#2E5C8A]">{badge}</span>
              <h2 className="text-xl font-semibold text-[#2E5C8A]">{title}</h2>
              <p className="leading-relaxed text-[#495057]">{text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-sm border border-[#D9E6F2] bg-white p-6">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.statTitle}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-sm bg-[#F5F9FF] p-4">
                <p className="text-2xl font-semibold text-[#2E5C8A]">1 / 127</p>
                <p className="mt-2 text-sm leading-relaxed text-[#495057]">{labels.globalStat}</p>
                <a href="https://www.who.int/news-room/questions-and-answers/item/autism-spectrum-disorders-%28asd%29%E2%9F%A9" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-sm font-semibold text-[#2E5C8A]">
                  {labels.sourceWho}
                </a>
              </div>
              <div className="rounded-sm bg-[#F5F9FF] p-4">
                <p className="text-2xl font-semibold text-[#2E5C8A]">{isAr ? "احتياج واضح" : "Clear need"}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#495057]">{labels.egyptStat}</p>
                <a href="https://molecularautism.biomedcentral.com/articles/10.1186/s13229-025-00665-1" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-sm font-semibold text-[#2E5C8A]">
                  {labels.sourceEgypt}
                </a>
              </div>
            </div>
            <p className="mt-3 text-sm text-[#6C757D]">{labels.statNote}</p>
          </article>

          <article className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.serviceTitle}</h2>
            <p className="mt-3 leading-relaxed text-[#495057]">{labels.serviceText}</p>
            <Link href="/services-card" className="mt-4 inline-flex min-h-12 items-center justify-center rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white">
              {labels.serviceCta}
            </Link>
          </article>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <article className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
            <h2 className="mb-3 text-xl font-semibold text-[#2E5C8A]">{labels.centerTitle}</h2>
            <p className="leading-relaxed text-[#495057]">{labels.centerText}</p>
          </article>
          <article className="rounded-sm border border-[#D9E6F2] bg-white p-6">
            <h2 className="mb-3 text-xl font-semibold text-[#2E5C8A]">{labels.nourTitle}</h2>
            <p className="leading-relaxed text-[#495057]">{labels.nourText}</p>
            <Link href="/assistant" className="mt-4 inline-flex min-h-12 items-center justify-center rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white">
              {labels.nourCta}
            </Link>
          </article>
        </section>

        <section className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.scienceTitle}</h2>
          <p className="max-w-4xl leading-relaxed text-[#495057]">{labels.scienceText}</p>
          <Link href="/methodology" className="inline-flex min-h-12 w-fit items-center justify-center rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white">
            {labels.scienceCta}
          </Link>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.partnersTitle}</h2>
            <p className="text-sm text-[#495057]">{labels.partnersSubtitle}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <a href="https://www.ershadacademy.com" target="_blank" rel="noopener noreferrer" className="partner-card group flex flex-col gap-5 rounded-sm border border-[#D9E6F2] bg-white p-6 hover:border-[#2E5C8A] md:flex-row md:items-center">
              <div className="w-fit rounded-sm border border-[#D9E6F2] bg-white p-3">
                <Image src="/ershad-logo.png" alt={labels.ershadName} width={120} height={120} className="object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="partner-card-title text-lg font-semibold text-[#2E5C8A]">{labels.ershadName}</h3>
                <p className="leading-relaxed text-[#495057]">{labels.ershadDesc}</p>
                <span className="partner-card-link font-semibold text-[#2E5C8A] group-hover:underline">{labels.ershadCta}</span>
              </div>
            </a>

            <article className="partner-card flex flex-col gap-5 rounded-sm border border-[#D9E6F2] bg-white p-6 md:flex-row md:items-center">
              <div className="w-fit rounded-sm border border-[#D9E6F2] bg-white p-3">
                <Image src="/pioneers-academy-logo.png" alt={labels.pioneersName} width={120} height={120} className="object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="partner-card-title text-lg font-semibold text-[#2E5C8A]">{labels.pioneersName}</h3>
                <p className="leading-relaxed text-[#495057]">{labels.pioneersDesc}</p>
                <span className="partner-card-link font-semibold text-[#2E5C8A]">{labels.pioneersCta}</span>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
