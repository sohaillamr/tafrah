"use client";

import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";

export default function AuthSelectPage() {
  const { language } = useLanguage();
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          portal: "بوابة التسجيل",
          title: "مرحباً بك في طفرة. من فضلك اختر نوع الحساب:",
          hr: "أنا صاحب عمل / مسؤول موارد بشرية (HR)",
          user: "أنا مستخدم / باحث عن فرصة",
        }
      : {
          home: "Home",
          portal: "Registration Portal",
          title: "Welcome to Tafrah. Please choose your account type:",
          hr: "I am an employer / HR representative",
          user: "I am a user / opportunity seeker",
        };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.portal },
          ]}
        />
        <section className="flex flex-col gap-4">
          <h1 className="font-semibold">{labels.title}</h1>
        </section>

        <section className="flex flex-col gap-4">
          <a
            href="/auth/hr"
            className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[#2E5C8A] px-6 text-center text-white"
          >
            {labels.hr}
          </a>
          <a
            href="/auth/quiz"
            className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[#2E5C8A] px-6 text-center text-white"
          >
            {labels.user}
          </a>
        </section>
      </main>
    </div>
  );
}
