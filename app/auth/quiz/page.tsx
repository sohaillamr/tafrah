"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";

const QUESTIONS = [
  "Bright light makes learning harder for me.",
  "Strong colors or busy screens make me tired.",
  "Movement or animation on screen can distract me.",
  "I prefer clear steps instead of long explanations.",
  "I feel safer when I know what will happen next.",
  "I focus better when the page has fewer elements.",
  "Reading text aloud helps me understand it.",
  "I prefer calm feedback instead of loud success/error effects.",
];

export default function QuizPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [answers, setAnswers] = useState<(null | number)[]>(Array(QUESTIONS.length).fill(null));
  const [error, setError] = useState("");
  const score = useMemo(() => answers.reduce((total, answer) => total + (answer ?? 0), 0), [answers]);
  const labels = isAr
    ? {
        home: "الرئيسية",
        portal: "الاستبيان",
        title: "استبيان قصير لفهم احتياجك",
        intro: "هذه ليست تشخيصاً طبياً. الهدف هو ضبط تجربة طفرة لتكون أهدأ وأسهل لك.",
        submit: "حفظ والمتابعة للتفضيلات",
        missing: "أجب عن كل الأسئلة للمتابعة.",
        options: ["لا", "أحياناً", "غالباً", "نعم"],
      }
    : {
        home: "Home",
        portal: "Survey",
        title: "Short survey to understand your needs",
        intro: "This is not a medical diagnosis. It only helps Tafrah adapt the learning experience.",
        submit: "Save and continue to preferences",
        missing: "Answer all questions to continue.",
        options: ["No", "Sometimes", "Often", "Yes"],
      };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (answers.some((answer) => answer === null)) {
      setError(labels.missing);
      return;
    }
    await fetch("/api/user/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "AUTISM",
        uiPreferences: {
          surveyScore: score,
          surveyAnswers: answers,
          mutedColors: score >= 8,
          reduceMotion: score >= 10,
          focusMode: score >= 12,
          ttsEnabled: answers[6] !== null && answers[6]! >= 2,
        },
      }),
    });
    router.push("/onboarding");
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.portal }]} />
        <section className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
          <p className="text-[#495057]">{labels.intro}</p>
        </section>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {QUESTIONS.map((question, index) => (
            <fieldset key={question} className="rounded-sm border border-[#DEE2E6] bg-white p-5">
              <legend className="font-semibold">{index + 1}. {question}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {labels.options.map((option, value) => (
                  <label key={option} className="flex min-h-12 items-center gap-2 rounded-sm border border-[#DEE2E6] px-3">
                    <input type="radio" name={`q-${index}`} checked={answers[index] === value} onChange={() => setAnswers((prev) => prev.map((item, i) => (i === index ? value : item)))} />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {error ? <p className="rounded-sm border border-[#FF9800] bg-[#FFF3E0] p-3">{error}</p> : null}
          <button type="submit" className="min-h-12 rounded-sm bg-[#2E5C8A] px-8 font-semibold text-white">{labels.submit}</button>
        </form>
      </main>
    </div>
  );
}
