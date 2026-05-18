"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../components/TopBar";
import { useLanguage } from "../components/LanguageProvider";

type Prefs = {
  mutedColors: boolean;
  highContrastText: boolean;
  reduceMotion: boolean;
  reduceSound: boolean;
  focusMode: boolean;
  ttsEnabled: boolean;
  simplifiedText: boolean;
  largeText: boolean;
};

const DEFAULT_PREFS: Prefs = {
  mutedColors: true,
  highContrastText: false,
  reduceMotion: true,
  reduceSound: true,
  focusMode: true,
  ttsEnabled: true,
  simplifiedText: true,
  largeText: false,
};

export default function OnboardingWizard() {
  const router = useRouter();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [saving, setSaving] = useState(false);
  const labels = isAr
    ? {
        title: "اختر تفضيلاتك",
        intro: "يمكنك تغيير هذه الإعدادات لاحقاً. اختر ما يجعل التعلم أهدأ وأسهل.",
        mutedColors: "ألوان هادئة",
        highContrastText: "تباين أعلى للنص",
        reduceMotion: "تقليل الحركة والانتقالات",
        reduceSound: "إيقاف الأصوات المفاجئة",
        focusMode: "وضع التركيز",
        ttsEnabled: "إظهار زر نور لقراءة النص المحدد",
        simplifiedText: "شرح مختصر وخطوات واضحة",
        largeText: "نص أكبر",
        finish: "حفظ وفتح لوحة التحكم",
        saving: "جاري الحفظ...",
        pipeline: "دعم CP و LD ضمن خارطة الطريق وليس جزءاً من هذا المعالج حالياً.",
      }
    : {
        title: "Choose your preferences",
        intro: "You can change these later. Pick what makes learning calmer and easier.",
        mutedColors: "Calm muted colors",
        highContrastText: "Higher text contrast",
        reduceMotion: "Reduce motion and transitions",
        reduceSound: "Disable sudden sounds",
        focusMode: "Focus mode",
        ttsEnabled: "Show Nour read-aloud button for selected text",
        simplifiedText: "Short explanations and clear steps",
        largeText: "Larger text",
        finish: "Save and open dashboard",
        saving: "Saving...",
        pipeline: "CP and LD support are on the roadmap and are not part of this wizard yet.",
      };

  async function save() {
    setSaving(true);
    await fetch("/api/user/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "AUTISM",
        uiPreferences: {
          ...prefs,
          computedAttrs: {
            "data-profile": "autism",
            "data-theme": prefs.highContrastText ? "high-contrast" : prefs.mutedColors ? "muted" : "pastel",
            "data-density": prefs.simplifiedText ? "spaced" : "normal",
            "data-scale": prefs.largeText ? "large" : "normal",
          },
        },
      }),
    });
    document.cookie = "tafrah_onboarded=true; path=/; max-age=31536000";
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12 text-[#212529]">
        <section className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
          <p className="mt-2 text-[#495057]">{labels.intro}</p>
          <p className="mt-3 rounded-sm border border-[#D9E6F2] bg-white p-3 text-sm text-[#495057]">{labels.pipeline}</p>
        </section>
        <section className="grid gap-3">
          {(Object.keys(DEFAULT_PREFS) as (keyof Prefs)[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))}
              className={`flex min-h-14 items-center justify-between rounded-sm border px-4 text-start ${
                prefs[key] ? "border-[#2E5C8A] bg-[#E3EEF9]" : "border-[#DEE2E6] bg-white"
              }`}
            >
              <span className="font-medium">{labels[key]}</span>
              <span className={`h-6 w-11 rounded-full p-1 ${prefs[key] ? "bg-[#2E5C8A]" : "bg-[#ADB5BD]"}`}>
                <span className={`block h-4 w-4 rounded-full bg-white ${prefs[key] ? "translate-x-5" : ""}`} />
              </span>
            </button>
          ))}
        </section>
        <button type="button" onClick={save} disabled={saving} className="min-h-12 rounded-sm bg-[#2E5C8A] px-8 font-semibold text-white disabled:opacity-60">
          {saving ? labels.saving : labels.finish}
        </button>
      </main>
    </div>
  );
}
