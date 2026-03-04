"use client";

import { useLanguage } from "./LanguageProvider";

export function LoadingSpinner({ text }: { text?: string }) {
  const { language } = useLanguage();
  const defaultText = language === "ar" ? "جارٍ التحميل..." : "Loading...";

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12" role="status" aria-live="polite">
      <div className="h-8 w-8 rounded-full border-4 border-[#DEE2E6] border-t-[#2E5C8A]" style={{ animation: "spin 1s linear infinite" }} />
      <p className="text-[#6C757D]">{text || defaultText}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon?: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] px-6 py-12 text-center">
      {icon && <div className="text-[#6C757D]">{icon}</div>}
      <p className="font-semibold text-[#212529]">{title}</p>
      {description && <p className="text-sm text-[#6C757D]">{description}</p>}
    </div>
  );
}
