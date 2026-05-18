"use client";

import Link from "next/link";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";

export default function AuthSelectPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const labels = isAr
    ? {
        home: "الرئيسية",
        portal: "اختيار الحساب",
        title: "اختر طريقة استخدام طفرة",
        intro: "طفرة الآن مصممة للأشخاص على طيف التوحد. اختر فرداً أو مركزاً.",
        user: "فرد يريد التعلم",
        userText: "إنشاء حساب باسمك ورقم هاتفك وبريدك، ثم استبيان ومعالج تفضيلات.",
        center: "مركز يدير طلابه",
        centerText: "إنشاء حساب مركز لتسجيل الطلاب ومتابعة تقدمهم وتوصيات نور.",
      }
    : {
        home: "Home",
        portal: "Account type",
        title: "Choose how you will use Tafrah",
        intro: "Tafrah is autism-first today. Choose an individual learner account or a center account.",
        user: "Individual learner",
        userText: "Create an account with your name, phone, email, and password, then complete the survey and preference wizard.",
        center: "Center account",
        centerText: "Create a center account to register students, track progress, and view Nour recommendations.",
      };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.portal }]} />
        <section className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
          <p className="text-lg text-[#495057]">{labels.intro}</p>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Link href="/auth/user-signup" className="flex min-h-48 flex-col justify-center gap-3 rounded-sm border border-[#D9E6F2] bg-white p-6 hover:border-[#2E5C8A]">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.user}</h2>
            <p className="text-[#495057]">{labels.userText}</p>
          </Link>
          <Link href="/auth/center-signup" className="flex min-h-48 flex-col justify-center gap-3 rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6 hover:border-[#2E5C8A]">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.center}</h2>
            <p className="text-[#495057]">{labels.centerText}</p>
          </Link>
        </section>
      </main>
    </div>
  );
}
