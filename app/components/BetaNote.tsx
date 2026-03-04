"use client";

import { useLanguage } from "./LanguageProvider";

export default function BetaNote() {
  const { language } = useLanguage();
  const text =
    language === "ar" ? "نسخة تجريبية - هذا هو الإصدار الخامس" : "Beta - this is the 5th version";

  return (
    <div className="border-b border-[#D9E6F2] bg-[#F5F9FF]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-sm text-[#2E5C8A]">
        <span suppressHydrationWarning>{text}</span>
      </div>
    </div>
  );
}
