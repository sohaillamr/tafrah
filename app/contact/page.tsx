"use client";

import { useState } from "react";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { useLanguage } from "../components/LanguageProvider";

export default function ContactPage() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          contact: "تواصل معنا",
          title: "تواصل معنا",
          intro:
            "إذا كان لديك سؤال عن الدورات أو تجربة المنصة، أرسل لنا رسالة وسنرد خلال وقت العمل.",
          emailLabel: "البريد الإلكتروني",
          messageLabel: "رسالتك",
          send: "إرسال الرسالة",
          channelsTitle: "قنوات التواصل",
          channels: [
            "البريد: support@tafrah.com",
            "ساعات العمل: الأحد - الخميس من 9 ص إلى 5 م",
          ],
          emailRequired: "يرجى إدخال البريد الإلكتروني.",
          emailInvalid: "صيغة البريد الإلكتروني غير صحيحة.",
          messageRequired: "يرجى كتابة رسالتك.",
          successMsg: "تم إرسال رسالتك بنجاح. سنرد عليك في أقرب وقت.",
          errorMsg: "حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.",
          breadcrumbAria: "مسار التنقل",
        }
      : {
          home: "Home",
          contact: "Contact us",
          title: "Contact us",
          intro:
            "If you have a question about courses or the platform experience, send us a message and we will reply during business hours.",
          emailLabel: "Email",
          messageLabel: "Your message",
          send: "Send message",
          channelsTitle: "Contact channels",
          channels: [
            "Email: support@tafrah.com",
            "Business hours: Sun–Thu, 9 AM–5 PM",
          ],
          emailRequired: "Please enter your email.",
          emailInvalid: "Invalid email format.",
          messageRequired: "Please enter your message.",
          successMsg: "Your message was sent successfully. We will reply soon.",
          errorMsg: "Something went wrong. Please try again later.",
          breadcrumbAria: "Breadcrumb",
        };

  function validate() {
    const errs: { email?: string; message?: string } = {};
    if (!email.trim()) {
      errs.email = labels.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = labels.emailInvalid;
    }
    if (!message.trim()) {
      errs.message = labels.messageRequired;
    }
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: subject || (language === "ar" ? "رسالة تواصل" : "Contact message"), message, email }),
    })
      .then((res) => {
        if (res.ok) {
          setStatus("success");
          setEmail("");
          setSubject("");
          setMessage("");
          setErrors({});
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.contact },
          ]}
          ariaLabel={labels.breadcrumbAria}
        />

        <section className="flex flex-col gap-3 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h1 className="font-semibold">{labels.title}</h1>
          <p>{labels.intro}</p>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h2 className="font-semibold">{labels.channelsTitle}</h2>
          <ul className="list-inside list-disc">
            {labels.channels.map((channel) => (
              <li key={channel}>{channel}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          {status === "success" && (
            <p className="rounded-sm border border-[#28A745] bg-[#E8F5E9] p-3 text-[#212529]">
              {labels.successMsg}
            </p>
          )}
          {status === "error" && (
            <p className="rounded-sm border border-[#FF9800] bg-[#FFF3E0] p-3 text-[#212529]">
              {labels.errorMsg}
            </p>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-col gap-2">
              {labels.emailLabel}
              <input
                type="email"
                placeholder="name@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
              {errors.email && (
                <span className="text-sm text-[#FF9800]">{errors.email}</span>
              )}
            </label>
            <label className="flex flex-col gap-2">
              {labels.messageLabel}
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-sm border border-[#DEE2E6] bg-white px-4 py-3"
              />
              {errors.message && (
                <span className="text-sm text-[#FF9800]">{errors.message}</span>
              )}
            </label>
            <button
              type="submit"
              className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white"
            >
              {labels.send}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
