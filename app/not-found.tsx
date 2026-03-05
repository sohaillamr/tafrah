"use client";

import Link from "next/link";
import TopBar from "./components/TopBar";
import { useLanguage } from "./components/LanguageProvider";

export default function NotFound() {
  const { language } = useLanguage();
  const labels =
    language === "ar"
      ? {
          title: "الصفحة غير موجودة",
          message:
            "الصفحة التي تبحث عنها غير متاحة حالياً أو تم نقلها. يمكنك العودة إلى الصفحة الرئيسية والمتابعة من هناك.",
          home: "العودة للرئيسية",
        }
      : {
          title: "Page not found",
          message:
            "The page you are looking for is unavailable or has been moved. You can go back to the home page and continue from there.",
          home: "Back to home",
        };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 text-[#212529]">
        <section className="flex flex-col items-center gap-4 rounded-sm border border-[#DEE2E6] bg-white p-8 text-center">
          <div className="text-4xl text-[#2E5C8A]">404</div>
          <h1 className="text-xl font-semibold">{labels.title}</h1>
          <p className="text-[#6C757D]">{labels.message}</p>
          <Link
            href="/"
            className="min-h-12 inline-flex items-center justify-center rounded-sm bg-[#2E5C8A] px-6 text-white"
          >
            {labels.home}
          </Link>
        </section>
      </main>
    </div>
  );
}
