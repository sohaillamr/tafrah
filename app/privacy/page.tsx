"use client";

import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { useLanguage } from "../components/LanguageProvider";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          privacy: "سياسات الخصوصية",
          title: "سياسات الخصوصية",
          intro:
            "نحترم خصوصيتك ونتعامل مع بياناتك بأمان. هذه الصفحة توضح كيف نستخدم البيانات داخل منصة طفرة.",
          collectTitle: "ما البيانات التي نجمعها؟",
          collectItems: [
            "بيانات الحساب الأساسية مثل الاسم والبريد الإلكتروني.",
            "بيانات الاستخدام لتحسين التجربة مثل خطوات التعلم والتقدم.",
          ],
          useTitle: "كيف نستخدم البيانات؟",
          useItems: [
            "تشغيل المنصة وتقديم تجربة تعلم مخصصة.",
            "تحسين المحتوى والواجهة بناءً على الاستخدام.",
          ],
          shareTitle: "مشاركة البيانات",
          shareText:
            "لا نشارك بياناتك مع أطراف ثالثة إلا عند الحاجة لتشغيل الخدمة أو إذا تطلب القانون ذلك.",
          safetyTitle: "حماية البيانات",
          safetyText:
            "نستخدم إجراءات أمان مناسبة لحماية بياناتك من الوصول غير المصرح به.",
        }
      : {
          home: "Home",
          privacy: "Privacy Policy",
          title: "Privacy Policy",
          intro:
            "We respect your privacy and handle your data securely. This page explains how Tafrah uses data.",
          collectTitle: "What data do we collect?",
          collectItems: [
            "Basic account data such as name and email.",
            "Usage data to improve the learning experience such as steps and progress.",
          ],
          useTitle: "How do we use data?",
          useItems: [
            "Operate the platform and deliver a personalized learning experience.",
            "Improve content and interface based on usage.",
          ],
          shareTitle: "Data sharing",
          shareText:
            "We do not share your data with third parties except to operate the service or when required by law.",
          safetyTitle: "Data security",
          safetyText:
            "We use appropriate security measures to protect your data from unauthorized access.",
        };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.privacy }]} />

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h1 className="font-semibold">{labels.title}</h1>
          <p>{labels.intro}</p>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h2 className="font-semibold">{labels.collectTitle}</h2>
          <ul className="list-inside list-disc">
            {labels.collectItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h2 className="font-semibold">{labels.useTitle}</h2>
          <ul className="list-inside list-disc">
            {labels.useItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h2 className="font-semibold">{labels.shareTitle}</h2>
          <p>{labels.shareText}</p>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h2 className="font-semibold">{labels.safetyTitle}</h2>
          <p>{labels.safetyText}</p>
        </section>
      </main>
    </div>
  );
}
