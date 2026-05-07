"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../components/TopBar";
import { useLanguage } from "../components/LanguageProvider";

export default function AdaptiveOnboarding() {
  const { language } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [disabilityType, setDisabilityType] = useState<string | null>(null);
  
  // Adaptive settings
  const [uiPrefs, setUiPrefs] = useState({
    theme: "light",          // For Autism: light, high-contrast, muted, pastel
    textDensity: "standard", // For Autism: standard, spaced
    fontType: "sans",        // For Autism: sans, dyslexia
    scale: "medium",         // For CP: small, medium, giant
    voiceCommand: false,     // For CP
    summarization: false,    // For Learning Disabilities
    textToSpeech: false      // For Learning Disabilities
  });

  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => s - 1);

  const savePreferences = async () => {
    try {
      const res = await fetch("/api/users/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabilityType, uiSettings: uiPrefs })
      });
      
      // Update global theme/store implicitly if using Context or Zustand,
      // but here we simply navigate after saving.
      if (res.ok) {
        // Save to localStorage so a rapid theme engine (next-themes or equivalent) can pick it up.
        localStorage.setItem("uiPreferences", JSON.stringify(uiPrefs));
        document.documentElement.setAttribute('data-theme', uiPrefs.theme);
        // trigger global update or re-render
        window.dispatchEvent(new Event("ui-prefs-updated"));
        
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Failed to save preferences", err);
    }
  };

  const l = language === 'ar' ? {
    step1Title: "مرحباً بك في رحلتك",
    step1Desc: "لتقديم أفضل تجربة، يرجى اختيار ملفك المناسب:",
    types: {
      AUTISM: "التنوع العصبي (التوحد)",
      CP: "التنوع الحركي (الشلل الدماغي)",
      LEARNING_DIS: "صعوبات التعلم"
    },
    next: "التالي",
    back: "الخلف",
    finish: "إنهاء وبدء المعسكر",
    autismSettings: "إعدادات الراحة الحسية",
    cpSettings: "إعدادات الوصول الحركي",
    ldSettings: "إعدادات الدعم الإدراكي",
    visualSens: "الحساسية البصرية",
    mutedTones: "ألوان هادئة",
    highContrast: "تباين عالي",
    pastelTheme: "ألوان باستيل",
    textDensity: "كثافة النص",
    spaced: "متباعد (مبسط)",
    standard: "عادي",
    font: "الخط",
    dyslexia: "مُيسر لعسر القراءة",
    sans: "بدون تذييل",
    scale: "حجم الواجهة (الأزرار)",
    small: "صغير",
    medium: "متوسط",
    giant: "كبير جداً",
    voiceCommand: "الأوامر الصوتية",
    summarization: "التلخيص التلقائي (نور AI)",
    tts: "تحويل النص إلى كلام تلقائياً",
    on: "تشغيل",
    off: "إيقاف"
  } : {
    step1Title: "Welcome to Your Journey",
    step1Desc: "To provide the best experience, please select your profile:",
    types: {
      AUTISM: "Neurodivergence (Autism)",
      CP: "Physical Diversity (Cerebral Palsy)",
      LEARNING_DIS: "Learning Disabilities"
    },
    next: "Next",
    back: "Back",
    finish: "Finish and Start Boot-camp",
    autismSettings: "Sensory Comfort Settings",
    cpSettings: "Motor Accessibility Settings",
    ldSettings: "Cognitive Support Settings",
    visualSens: "Visual Sensitivity",
    mutedTones: "Muted Tones",
    highContrast: "High Contrast",
    pastelTheme: "Pastel Theme",
    textDensity: "Text Density",
    spaced: "Spaced / Simplified",
    standard: "Standard",
    font: "Font Type",
    dyslexia: "Dyslexia-friendly",
    sans: "Clean Sans-Serif",
    scale: "Interface Scale",
    small: "Small",
    medium: "Medium",
    giant: "Giant Buttons (XL)",
    voiceCommand: "Voice Command Support",
    summarization: "Automatic Summarization (Nour AI)",
    tts: "Text-to-Speech",
    on: "On",
    off: "Off"
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <TopBar />
      <main className="max-w-2xl mx-auto py-12 px-6">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#D9E6F2]">
          
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold text-[#2E5C8A] text-center" aria-live="polite">{l.step1Title}</h1>
              <p className="text-center text-gray-600">{l.step1Desc}</p>
              
              <div className="flex flex-col gap-4">
                {Object.entries(l.types).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setDisabilityType(key)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${disabilityType === key ? 'border-[#2E5C8A] bg-[#E9 EFF5]' : 'border-gray-200 hover:border-[#2E5C8A]'}`}
                    aria-pressed={disabilityType === key}
                  >
                    <span className="font-semibold text-lg">{label}</span>
                  </button>
                ))}
              </div>
              
              <button 
                disabled={!disabilityType}
                onClick={goNext}
                className="mt-6 bg-[#2E5C8A] text-white py-3 px-6 rounded disabled:opacity-50 font-bold"
              >
                {l.next}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold text-[#2E5C8A]" aria-live="polite">
                {disabilityType === 'AUTISM' && l.autismSettings}
                {disabilityType === 'CP' && l.cpSettings}
                {disabilityType === 'LEARNING_DIS' && l.ldSettings}
              </h1>

              {/* Autism Content */}
              {disabilityType === 'AUTISM' && (
                <div className="space-y-6">
                  <div>
                    <label className="font-semibold block mb-2">{l.visualSens}</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={uiPrefs.theme} 
                      onChange={e => setUiPrefs({...uiPrefs, theme: e.target.value})}
                    >
                      <option value="light">{l.standard}</option>
                      <option value="high-contrast">{l.highContrast}</option>
                      <option value="muted">{l.mutedTones}</option>
                      <option value="pastel">{l.pastelTheme}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-2">{l.textDensity}</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={uiPrefs.textDensity} 
                      onChange={e => setUiPrefs({...uiPrefs, textDensity: e.target.value})}
                    >
                      <option value="standard">{l.standard}</option>
                      <option value="spaced">{l.spaced}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-2">{l.font}</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={uiPrefs.fontType} 
                      onChange={e => setUiPrefs({...uiPrefs, fontType: e.target.value})}
                    >
                      <option value="sans">{l.sans}</option>
                      <option value="dyslexia">{l.dyslexia}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CP Content */}
              {disabilityType === 'CP' && (
                <div className="space-y-6">
                  <div>
                     <label className="font-semibold block mb-2">{l.scale}</label>
                     <select 
                      className="w-full p-2 border rounded"
                      value={uiPrefs.scale} 
                      onChange={e => setUiPrefs({...uiPrefs, scale: e.target.value})}
                    >
                      <option value="small">{l.small}</option>
                      <option value="medium">{l.medium}</option>
                      <option value="giant">{l.giant}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-2">{l.voiceCommand}</label>
                    <div className="flex gap-4">
                      <button onClick={() => setUiPrefs({...uiPrefs, voiceCommand: true})} className={`px-4 py-2 rounded ${uiPrefs.voiceCommand ? 'bg-[#2E5C8A] text-white' : 'bg-gray-200'}`}>{l.on}</button>
                      <button onClick={() => setUiPrefs({...uiPrefs, voiceCommand: false})} className={`px-4 py-2 rounded ${!uiPrefs.voiceCommand ? 'bg-[#2E5C8A] text-white' : 'bg-gray-200'}`}>{l.off}</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Dis Content */}
              {disabilityType === 'LEARNING_DIS' && (
                <div className="space-y-6">
                   <div>
                    <label className="font-semibold block mb-2">{l.summarization}</label>
                    <div className="flex gap-4">
                      <button onClick={() => setUiPrefs({...uiPrefs, summarization: true})} className={`px-4 py-2 rounded ${uiPrefs.summarization ? 'bg-[#2E5C8A] text-white' : 'bg-gray-200'}`}>{l.on}</button>
                      <button onClick={() => setUiPrefs({...uiPrefs, summarization: false})} className={`px-4 py-2 rounded ${!uiPrefs.summarization ? 'bg-[#2E5C8A] text-white' : 'bg-gray-200'}`}>{l.off}</button>
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold block mb-2">{l.tts}</label>
                    <div className="flex gap-4">
                      <button onClick={() => setUiPrefs({...uiPrefs, textToSpeech: true})} className={`px-4 py-2 rounded ${uiPrefs.textToSpeech ? 'bg-[#2E5C8A] text-white' : 'bg-gray-200'}`}>{l.on}</button>
                      <button onClick={() => setUiPrefs({...uiPrefs, textToSpeech: false})} className={`px-4 py-2 rounded ${!uiPrefs.textToSpeech ? 'bg-[#2E5C8A] text-white' : 'bg-gray-200'}`}>{l.off}</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button onClick={goBack} className="text-gray-500 py-3 px-6 hover:bg-gray-100 rounded">{l.back}</button>
                <button onClick={savePreferences} className="bg-[#2E5C8A] text-white py-3 px-6 rounded font-bold">{l.finish}</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
