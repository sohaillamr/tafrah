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
          "تجربة هادئة ومنظمة تتغير حسب احتياج كل متعلم: الإضاءة، الألوان، الحركة، كثافة النص، وطريقة عرض الدروس.",
        individual: "ابدأ كفرد",
        center: "ابدأ كمركز",
        active: "متاح الآن",
        pipeline: "قيد التطوير",
        autism: "دعم التوحد",
        autismText: "استبيان بسيط، معالج تفضيلات، لوحة تقدم، ومساعدة نور أثناء التعلم.",
        cp: "الشلل الدماغي",
        cpText: "تحسينات الحركة، الأزرار الكبيرة، والتنقل المساعد ضمن خارطة الطريق.",
        ld: "صعوبات التعلم",
        ldText: "تبسيط النصوص، دعم القراءة، وتقليل العبء المعرفي ضمن خارطة الطريق.",
        centerTitle: "للمراكز التعليمية والتأهيلية",
        centerText:
          "حساب المركز لا يدخل الدورات بدلاً من الطلاب. دوره هو تسجيل الطلاب، متابعة تقدمهم، قراءة الإحصاءات، والحصول على توصيات نور من البيانات.",
        nourTitle: "نور يقرأ ويساعد",
        nourText:
          "داخل المنصة، يمكن للطالب تحديد نص والانتظار لحظة ليظهر زر نور لقراءة النص بصوت واضح أو طلب مساعدة مختصرة.",
        scienceTitle: "منهجية مبنية على بحث ومقابلات",
        scienceText:
          "تصميم طفرة مبني على مقابلات، استبيانات، مراجعات خبراء، ومراجع علمية عن طيف التوحد والتعلم الحسي.",
        scienceCta: "اقرأ منهجيتنا",
        logoAlt: "شعار طفرة",
      }
    : {
        title: "Tafrah: adaptive learning for autistic learners",
        subtitle:
          "A calm, structured learning platform that adapts to each learner's light, color, motion, text-density, and lesson-display preferences.",
        individual: "Start as an individual",
        center: "Start as a center",
        active: "Live now",
        pipeline: "In the pipeline",
        autism: "Autism support",
        autismText: "A short survey, preference wizard, progress dashboard, and Nour support during learning.",
        cp: "Cerebral palsy",
        cpText: "Motor-friendly controls, larger targets, and assisted navigation are on the roadmap.",
        ld: "Learning difficulties",
        ldText: "Text simplification, reading support, and cognitive-load tools are on the roadmap.",
        centerTitle: "For learning and therapy centers",
        centerText:
          "Centers do not take courses for students. They create connected student accounts, monitor progress, review statistics, and receive Nour recommendations from the data.",
        nourTitle: "Nour reads and supports",
        nourText:
          "Students can select text and pause briefly to reveal Nour's read-aloud button for clear text-to-speech and short support.",
        scienceTitle: "Built from research and lived experience",
        scienceText:
          "Tafrah's design is informed by surveys, interviews, expert review, and scientific sources about autism and sensory learning.",
        scienceCta: "Read our methodology",
        logoAlt: "Tafrah logo",
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

        <section className="grid gap-5 md:grid-cols-2">
          <article className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
            <h2 className="mb-3 text-xl font-semibold text-[#2E5C8A]">{labels.centerTitle}</h2>
            <p className="leading-relaxed text-[#495057]">{labels.centerText}</p>
          </article>
          <article className="rounded-sm border border-[#D9E6F2] bg-white p-6">
            <h2 className="mb-3 text-xl font-semibold text-[#2E5C8A]">{labels.nourTitle}</h2>
            <p className="leading-relaxed text-[#495057]">{labels.nourText}</p>
          </article>
        </section>

        <section className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.scienceTitle}</h2>
          <p className="max-w-4xl leading-relaxed text-[#495057]">{labels.scienceText}</p>
          <Link href="/methodology" className="inline-flex min-h-12 w-fit items-center justify-center rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white">
            {labels.scienceCta}
          </Link>
        </section>
      </main>
    </div>
  );
}
