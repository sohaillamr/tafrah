"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";

const MIN_SCORE = 24;

export default function QuizPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          portal: "بوابة التسجيل",
          title: "اختبار تقييم أولي (١٠ أسئلة)",
          intro:
            "من فضلك اختر الإجابة التي تصفك بدقة. هذا الاختبار يساعدنا على توجيهك للمسار الصحيح.",
          submit: "إرسال الإجابات",
          missing: "من فضلك أكمل جميع الأسئلة قبل الإرسال.",
          full: "نعتذر منك، جميع المقاعد في الكورسات الحالية مكتملة تماماً. شكراً لاهتمامك.",
          answerOptions: [
            { label: "دائماً", value: 4 },
            { label: "غالباً", value: 3 },
            { label: "أحياناً", value: 2 },
            { label: "نادراً", value: 1 },
            { label: "أبداً", value: 0 },
          ],
          questions: [
            "هل تجد صعوبة في فهم ما يقصده الناس عندما لا يقولونه بشكل مباشر؟",
            "هل تلاحظ تفاصيل دقيقة في الأشياء لا يلاحظها الآخرون عادةً؟",
            "هل تفضل الروتين اليومي الثابت وتشعر بالانزعاج إذا تغير فجأة؟",
            "هل تجد صعوبة في تكوين صداقات أو التفاعل الاجتماعي الطويل؟",
            "هل لديك اهتمامات محددة جداً تحب القراءة عنها أو العمل بها لساعات طويلة؟",
            "هل تنزعج من الأصوات العالية أو الأضواء الساطعة أكثر من غيرك؟",
            "هل تجد صعوبة في قراءة تعابير وجوه الناس لمعرفة مشاعرهم؟",
            "هل تميل إلى أخذ الكلام بمعناه الحرفي تماماً؟",
            "هل تلاحظ الأنماط في الأرقام أو الصور بسرعة؟",
            "هل تفضل العمل الفردي المركز على العمل الجماعي؟",
          ],
        }
      : {
          home: "Home",
          portal: "Registration Portal",
          title: "Initial assessment (10 questions)",
          intro:
            "Please choose the answer that describes you accurately. This assessment helps guide you to the right path.",
          submit: "Submit answers",
          missing: "Please complete all questions before submitting.",
          full:
            "We apologize, all seats in the current courses are fully booked. Thank you for your interest.",
          answerOptions: [
            { label: "Always", value: 4 },
            { label: "Often", value: 3 },
            { label: "Sometimes", value: 2 },
            { label: "Rarely", value: 1 },
            { label: "Never", value: 0 },
          ],
          questions: [
            "Do you find it hard to understand what people mean when they do not say it directly?",
            "Do you notice small details that others usually miss?",
            "Do you prefer a fixed daily routine and feel upset if it suddenly changes?",
            "Do you find it hard to make friends or handle long social interactions?",
            "Do you have very specific interests you can focus on for hours?",
            "Are you more bothered by loud sounds or bright lights than others?",
            "Do you find it hard to read facial expressions to know how people feel?",
            "Do you tend to take words very literally?",
            "Do you quickly notice patterns in numbers or images?",
            "Do you prefer focused individual work over group work?",
          ],
        };
  const [answers, setAnswers] = useState<(null | number)[]>(
    Array(labels.questions.length).fill(null)
  );
  const [resultMessage, setResultMessage] = useState("");

  const score = useMemo(
    () => answers.reduce((total, answer) => total + (answer ?? 0), 0),
    [answers]
  );

  const allAnswered = answers.every((answer) => answer !== null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!allAnswered) {
      setResultMessage(labels.missing);
      return;
    }
    if (score >= MIN_SCORE) {
      router.push("/auth/user-signup");
      return;
    }
    setResultMessage(labels.full);
  };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.portal, href: "/auth/select" },
            { label: labels.title },
          ]}
        />
        <section className="flex flex-col gap-3">
          <h1 className="font-semibold">{labels.title}</h1>
          <p>{labels.intro}</p>
        </section>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {labels.questions.map((question, index) => (
          <fieldset
            key={question}
            className="flex flex-col gap-3 rounded-sm border border-[#DEE2E6] bg-white px-5 py-4"
          >
            <legend className="font-semibold">
              {index + 1}. {question}
            </legend>
            <div className="flex flex-wrap gap-4">
              {labels.answerOptions.map((option) => (
                <label key={option.label} className="inline-flex min-h-12 items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option.value}
                    checked={answers[index] === option.value}
                    onChange={() => {
                      const next = [...answers];
                      next[index] = option.value;
                      setAnswers(next);
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

          <button
            type="submit"
            className="min-h-12 rounded-sm bg-[#2E5C8A] px-8 text-white"
          >
            {labels.submit}
          </button>
          {resultMessage ? <p aria-live="polite">{resultMessage}</p> : null}
        </form>
      </main>
    </div>
  );
}
