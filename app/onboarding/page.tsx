"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../components/LanguageProvider";
import TopBar from "../components/TopBar";
import {
  Brain,
  Hand,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Volume2,
  VolumeX,
  Eye,
  Type,
  MousePointerClick,
  Keyboard,
  Maximize,
  SunMedium,
  Palette,
  Loader2,
} from "lucide-react";

/* ──────────────────── types ──────────────────── */
type ProfileCategory = "AUTISM" | "CP" | "LEARNING_HARDENING" | "NONE";

interface UiPreferences {
  // Autism / sensory
  highContrast: boolean;
  mutedColors: boolean;
  reduceMotion: boolean;
  reduceSound: boolean;
  focusMode: boolean;
  // CP / motor
  largeTargets: boolean;
  keyboardNav: boolean;
  stickyKeys: boolean;
  extraSpacing: boolean;
  // LD / cognitive
  dyslexicFont: boolean;
  simplifiedText: boolean;
  readingGuide: boolean;
  ttsEnabled: boolean;
  // shared
  theme: "default" | "high-contrast" | "muted" | "pastel";
  scale: "normal" | "small" | "giant";
  density: "normal" | "spaced";
}

const DEFAULT_PREFS: UiPreferences = {
  highContrast: false,
  mutedColors: false,
  reduceMotion: false,
  reduceSound: false,
  focusMode: false,
  largeTargets: false,
  keyboardNav: false,
  stickyKeys: false,
  extraSpacing: false,
  dyslexicFont: false,
  simplifiedText: false,
  readingGuide: false,
  ttsEnabled: false,
  theme: "default",
  scale: "normal",
  density: "normal",
};

/* ──────────────── i18n dictionary ──────────────── */
function useLabels() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return {
    isAr,
    // Step 1 — Welcome
    welcomeTitle: isAr
      ? "مرحبًا بك في طفرة 🎉"
      : "Welcome to Tafrah 🎉",
    welcomeDesc: isAr
      ? "سنقوم بتخصيص تجربتك بناءً على احتياجاتك. اختر ملفك الشخصي أدناه — يمكنك تغييره لاحقًا في أي وقت."
      : "We'll personalize your experience based on your needs. Choose your profile below — you can change it anytime later.",
    profileAutism: isAr ? "طيف التوحد" : "Autism Spectrum",
    profileAutismDesc: isAr
      ? "بيئة هادئة، ألوان خافتة، بدون حركات مفاجئة"
      : "Calm environment, muted colors, no sudden animations",
    profileCp: isAr ? "الشلل الدماغي" : "Cerebral Palsy",
    profileCpDesc: isAr
      ? "أزرار كبيرة، تنقّل بالكيبورد، مسافات واسعة"
      : "Large buttons, keyboard navigation, extra spacing",
    profileLd: isAr ? "صعوبات التعلم / عسر القراءة" : "Learning Difficulty / Dyslexia",
    profileLdDesc: isAr
      ? "خطوط واضحة، نص مبسّط، قراءة بالصوت"
      : "Clear fonts, simplified text, text-to-speech",
    profileNone: isAr ? "الوضع الافتراضي" : "Standard Mode",
    profileNoneDesc: isAr
      ? "بدون تعديلات خاصة — الواجهة القياسية"
      : "No special adjustments — standard interface",

    // Step 2 — Profile-specific tuning
    step2TitleAutism: isAr ? "تفضيلات حسية" : "Sensory Preferences",
    step2TitleCp: isAr ? "تسهيلات حركية" : "Motor Accessibility",
    step2TitleLd: isAr ? "تفضيلات إدراكية" : "Cognitive Preferences",

    // Autism questions
    qHighContrast: isAr ? "هل تفضل نصًا عالي التباين؟" : "Do you prefer high-contrast text?",
    qMutedColors: isAr ? "هل تفضل الألوان الهادئة والخافتة؟" : "Do you prefer calm, muted colors?",
    qReduceMotion: isAr ? "إيقاف جميع الحركات والانتقالات؟" : "Disable all animations & transitions?",
    qReduceSound: isAr ? "إيقاف الأصوات والإشعارات الصوتية؟" : "Disable sound notifications?",
    qFocusMode: isAr ? "تفعيل وضع التركيز (إخفاء العناصر غير الأساسية)؟" : "Enable Focus Mode (hide non-essential UI)?",

    // CP questions
    qLargeTargets: isAr ? "هل تحتاج أزرار وعناصر تفاعلية أكبر؟" : "Do you need larger buttons & tap targets?",
    qKeyboardNav: isAr ? "هل تفضل التنقل بالكيبورد فقط؟" : "Do you prefer keyboard-only navigation?",
    qStickyKeys: isAr ? "هل تحتاج دعم المفاتيح اللاصقة؟" : "Do you need sticky-key support?",
    qExtraSpacing: isAr ? "هل تحتاج مسافات إضافية بين العناصر؟" : "Do you need extra spacing between elements?",

    // LD questions
    qDyslexicFont: isAr ? "استخدام خطوط صديقة لعسر القراءة؟" : "Use dyslexia-friendly fonts?",
    qSimplifiedText: isAr ? "تبسيط النصوص تلقائيًا (تلخيص بالذكاء الاصطناعي)؟" : "Auto-simplify text (AI summarization)?",
    qReadingGuide: isAr ? "تفعيل دليل القراءة (خط يتبع النص)؟" : "Enable reading guide (line tracker)?",
    qTts: isAr ? "تفعيل القراءة بالصوت (TTS)؟" : "Enable text-to-speech (TTS)?",

    // Controls
    yes: isAr ? "نعم" : "Yes",
    no: isAr ? "لا" : "No",
    next: isAr ? "التالي" : "Next",
    back: isAr ? "رجوع" : "Back",
    finish: isAr ? "إكمال الإعداد" : "Complete Setup",
    saving: isAr ? "جاري الحفظ..." : "Saving...",
    step: isAr ? "الخطوة" : "Step",
    of: isAr ? "من" : "of",

    // Step 3 — confirmation
    allSetTitle: isAr ? "تم الإعداد! ✅" : "You're All Set! ✅",
    allSetDesc: isAr
      ? "تم تخصيص واجهتك بنجاح. يمكنك تعديل هذه الإعدادات في أي وقت من صفحة الملف الشخصي."
      : "Your interface has been personalized. You can adjust these settings anytime from your profile page.",
    goToDashboard: isAr ? "الذهاب إلى لوحة التحكم" : "Go to Dashboard",
  };
}

/* ──────────────── toggle component ──────────────── */
function Toggle({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex min-h-14 w-full items-center gap-4 rounded-lg border-2 px-5 py-3 text-start transition-colors ${
        checked
          ? "border-[#2E5C8A] bg-[#E9F0F8]"
          : "border-[#DEE2E6] bg-white hover:border-[#ADB5BD]"
      }`}
    >
      <span className="shrink-0 text-[#2E5C8A]">{icon}</span>
      <span className="flex-1 font-medium text-[#212529]">{label}</span>
      <span
        className={`flex h-7 w-12 items-center rounded-full px-1 transition-colors ${
          checked ? "bg-[#2E5C8A]" : "bg-[#DEE2E6]"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

/* ──────────────── main component ──────────────── */
export default function OnboardingWizard() {
  const router = useRouter();
  const L = useLabels();

  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [category, setCategory] = useState<ProfileCategory>("NONE");
  const [prefs, setPrefs] = useState<UiPreferences>({ ...DEFAULT_PREFS });
  const [saving, setSaving] = useState(false);

  const updatePref = useCallback(
    <K extends keyof UiPreferences>(key: K, value: UiPreferences[K]) => {
      setPrefs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /* derived CSS attributes the ThemeRegistry will read */
  function computeThemeAttrs(): Record<string, string> {
    const attrs: Record<string, string> = {};

    if (category === "AUTISM") {
      attrs["data-profile"] = "autism";
      if (prefs.highContrast) attrs["data-theme"] = "high-contrast";
      else if (prefs.mutedColors) attrs["data-theme"] = "muted";
      else attrs["data-theme"] = "pastel";
    } else if (category === "CP") {
      attrs["data-profile"] = "cp";
      attrs["data-scale"] = prefs.largeTargets ? "giant" : "normal";
    } else if (category === "LEARNING_HARDENING") {
      if (prefs.dyslexicFont) attrs["data-font"] = "dyslexia";
      if (prefs.readingGuide || prefs.simplifiedText)
        attrs["data-density"] = "spaced";
    }

    return attrs;
  }

  /* pick a category and auto-set sensible defaults */
  function selectProfile(cat: ProfileCategory) {
    const newPrefs = { ...DEFAULT_PREFS };

    if (cat === "AUTISM") {
      newPrefs.mutedColors = true;
      newPrefs.reduceMotion = true;
      newPrefs.focusMode = true;
      newPrefs.theme = "pastel";
    } else if (cat === "CP") {
      newPrefs.largeTargets = true;
      newPrefs.keyboardNav = true;
      newPrefs.extraSpacing = true;
      newPrefs.scale = "giant";
    } else if (cat === "LEARNING_HARDENING") {
      newPrefs.dyslexicFont = true;
      newPrefs.readingGuide = true;
      newPrefs.density = "spaced";
    }

    setCategory(cat);
    setPrefs(newPrefs);

    if (cat === "NONE") {
      // skip straight to save
      setStep(3);
    } else {
      setStep(2);
    }
  }

  /* save to backend */
  async function saveOnboarding() {
    setSaving(true);
    try {
      const themeAttrs = computeThemeAttrs();
      await fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          uiPreferences: {
            ...prefs,
            computedAttrs: themeAttrs,
          },
        }),
      });
      document.cookie = "tafrah_onboarded=true; path=/; max-age=31536000";
      setStep(3);
    } catch (e) {
      console.error("Onboarding save failed:", e);
      // still let them through
      document.cookie = "tafrah_onboarded=true; path=/; max-age=31536000";
      setStep(3);
    } finally {
      setSaving(false);
    }
  }

  /* ──────────────── profile cards ──────────────── */
  const profiles: {
    id: ProfileCategory;
    label: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
  }[] = [
    {
      id: "AUTISM",
      label: L.profileAutism,
      desc: L.profileAutismDesc,
      icon: <Brain size={28} />,
      color: "#6366F1",
      bg: "#EEF2FF",
    },
    {
      id: "CP",
      label: L.profileCp,
      desc: L.profileCpDesc,
      icon: <Hand size={28} />,
      color: "#F59E0B",
      bg: "#FFFBEB",
    },
    {
      id: "LEARNING_HARDENING",
      label: L.profileLd,
      desc: L.profileLdDesc,
      icon: <BookOpen size={28} />,
      color: "#10B981",
      bg: "#ECFDF5",
    },
    {
      id: "NONE",
      label: L.profileNone,
      desc: L.profileNoneDesc,
      icon: <Sparkles size={28} />,
      color: "#6B7280",
      bg: "#F9FAFB",
    },
  ];

  /* ──────────────── slide animation ──────────────── */
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
  };
  const [direction, setDirection] = useState(1);

  function goNext() {
    setDirection(1);
    if (step === 2) {
      saveOnboarding();
    } else {
      setStep((s) => Math.min(s + 1, totalSteps));
    }
  }
  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }

  /* ──────────────── render ──────────────── */
  return (
    <div className="min-h-screen" dir={L.isAr ? "rtl" : "ltr"}>
      <TopBar />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
        {/* progress bar */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`h-2 w-full rounded-full transition-colors ${
                  s <= step ? "bg-[#2E5C8A]" : "bg-[#DEE2E6]"
                }`}
              />
              <span className="text-xs text-[#6C757D]">
                {L.step} {s} {L.of} {totalSteps}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {/* ─── STEP 1: Profile Selection ─── */}
          {step === 1 && (
            <motion.section
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold text-[#2E5C8A] sm:text-3xl">
                  {L.welcomeTitle}
                </h1>
                <p className="text-[#495057]">{L.welcomeDesc}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProfile(p.id)}
                    className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all hover:shadow-md ${
                      category === p.id
                        ? "border-[#2E5C8A] shadow-md"
                        : "border-[#DEE2E6] hover:border-[#ADB5BD]"
                    }`}
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ backgroundColor: p.bg, color: p.color }}
                    >
                      {p.icon}
                    </div>
                    <span className="text-lg font-semibold text-[#212529]">
                      {p.label}
                    </span>
                    <span className="text-sm text-[#6C757D]">{p.desc}</span>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {/* ─── STEP 2: Profile-specific tuning ─── */}
          {step === 2 && (
            <motion.section
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold text-[#2E5C8A] sm:text-3xl">
                  {category === "AUTISM"
                    ? L.step2TitleAutism
                    : category === "CP"
                    ? L.step2TitleCp
                    : L.step2TitleLd}
                </h1>
              </div>

              <div className="flex flex-col gap-3">
                {/* ── Autism gates ── */}
                {category === "AUTISM" && (
                  <>
                    <Toggle
                      label={L.qHighContrast}
                      checked={prefs.highContrast}
                      onChange={(v) => {
                        updatePref("highContrast", v);
                        if (v) updatePref("mutedColors", false);
                      }}
                      icon={<Eye size={20} />}
                    />
                    <Toggle
                      label={L.qMutedColors}
                      checked={prefs.mutedColors}
                      onChange={(v) => {
                        updatePref("mutedColors", v);
                        if (v) updatePref("highContrast", false);
                      }}
                      icon={<Palette size={20} />}
                    />
                    <Toggle
                      label={L.qReduceMotion}
                      checked={prefs.reduceMotion}
                      onChange={(v) => updatePref("reduceMotion", v)}
                      icon={<SunMedium size={20} />}
                    />
                    <Toggle
                      label={L.qReduceSound}
                      checked={prefs.reduceSound}
                      onChange={(v) => updatePref("reduceSound", v)}
                      icon={prefs.reduceSound ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    />
                    <Toggle
                      label={L.qFocusMode}
                      checked={prefs.focusMode}
                      onChange={(v) => updatePref("focusMode", v)}
                      icon={<Maximize size={20} />}
                    />
                  </>
                )}

                {/* ── CP gates ── */}
                {category === "CP" && (
                  <>
                    <Toggle
                      label={L.qLargeTargets}
                      checked={prefs.largeTargets}
                      onChange={(v) => updatePref("largeTargets", v)}
                      icon={<MousePointerClick size={20} />}
                    />
                    <Toggle
                      label={L.qKeyboardNav}
                      checked={prefs.keyboardNav}
                      onChange={(v) => updatePref("keyboardNav", v)}
                      icon={<Keyboard size={20} />}
                    />
                    <Toggle
                      label={L.qStickyKeys}
                      checked={prefs.stickyKeys}
                      onChange={(v) => updatePref("stickyKeys", v)}
                      icon={<Hand size={20} />}
                    />
                    <Toggle
                      label={L.qExtraSpacing}
                      checked={prefs.extraSpacing}
                      onChange={(v) => updatePref("extraSpacing", v)}
                      icon={<Maximize size={20} />}
                    />
                  </>
                )}

                {/* ── LD gates ── */}
                {category === "LEARNING_HARDENING" && (
                  <>
                    <Toggle
                      label={L.qDyslexicFont}
                      checked={prefs.dyslexicFont}
                      onChange={(v) => updatePref("dyslexicFont", v)}
                      icon={<Type size={20} />}
                    />
                    <Toggle
                      label={L.qSimplifiedText}
                      checked={prefs.simplifiedText}
                      onChange={(v) => updatePref("simplifiedText", v)}
                      icon={<BookOpen size={20} />}
                    />
                    <Toggle
                      label={L.qReadingGuide}
                      checked={prefs.readingGuide}
                      onChange={(v) => updatePref("readingGuide", v)}
                      icon={<Eye size={20} />}
                    />
                    <Toggle
                      label={L.qTts}
                      checked={prefs.ttsEnabled}
                      onChange={(v) => updatePref("ttsEnabled", v)}
                      icon={<Volume2 size={20} />}
                    />
                  </>
                )}
              </div>

              {/* nav buttons */}
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-[#DEE2E6] px-5 text-[#212529] transition-colors hover:bg-[#F8F9FA]"
                >
                  {L.isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                  {L.back}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={saving}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#2E5C8A] px-6 text-white transition-colors hover:bg-[#24496E] disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {L.saving}
                    </>
                  ) : (
                    <>
                      {L.finish}
                      {L.isAr ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}

          {/* ─── STEP 3: Confirmation ─── */}
          {step === 3 && (
            <motion.section
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-6 py-10 text-center"
            >
              <CheckCircle size={64} className="text-[#28A745]" />
              <h1 className="text-2xl font-bold text-[#2E5C8A] sm:text-3xl">
                {L.allSetTitle}
              </h1>
              <p className="max-w-md text-[#495057]">{L.allSetDesc}</p>
              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#2E5C8A] px-8 text-white transition-colors hover:bg-[#24496E]"
              >
                {L.goToDashboard}
                {L.isAr ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
