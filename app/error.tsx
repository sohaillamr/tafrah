"use client";

import TopBar from "./components/TopBar";
import { useLanguage } from "./components/LanguageProvider";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  const { language } = useLanguage();
  const labels =
    language === "ar"
      ? {
          title: "حدث خطأ غير متوقع",
          text: "تعذر تحميل هذه الصفحة الآن. يمكنك إعادة المحاولة أو العودة للرئيسية.",
          retry: "إعادة المحاولة",
          home: "العودة للرئيسية",
        }
      : {
          title: "Something went wrong",
          text: "This page could not load. You can try again or return home.",
          retry: "Try again",
          home: "Go to home",
        };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16 text-[#212529]">
        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h1 className="text-xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
          <p>{labels.text}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#2E5C8A] px-6 text-white"
            >
              {labels.retry}
            </button>
            <a
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#DEE2E6] px-6"
            >
              {labels.home}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
