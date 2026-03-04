"use client";

import { useState } from "react";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";

export default function RecoveryPage() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "reset" | "success">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          login: "تسجيل الدخول",
          title: "استعادة كلمة المرور",
          intro: "أدخل بريدك الإلكتروني وكلمة المرور الجديدة.",
          email: "البريد الإلكتروني",
          newPassword: "كلمة المرور الجديدة",
          submit: "إعادة تعيين كلمة المرور",
          submitting: "جاري الإرسال...",
          emailRequired: "يرجى إدخال البريد الإلكتروني.",
          emailInvalid: "صيغة البريد الإلكتروني غير صحيحة.",
          passwordRequired: "يرجى إدخال كلمة المرور الجديدة.",
          passwordShort: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
          successMsg: "تم إعادة تعيين كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.",
          breadcrumbAria: "مسار التنقل",
          backToLogin: "العودة لتسجيل الدخول",
        }
      : {
          home: "Home",
          login: "Login",
          title: "Password Recovery",
          intro: "Enter your email and a new password.",
          email: "Email",
          newPassword: "New Password",
          submit: "Reset Password",
          submitting: "Resetting...",
          emailRequired: "Please enter your email.",
          emailInvalid: "Invalid email format.",
          passwordRequired: "Please enter a new password.",
          passwordShort: "Password must be at least 6 characters.",
          successMsg: "Password has been reset successfully. You can now log in.",
          breadcrumbAria: "Breadcrumb",
          backToLogin: "Back to Login",
        };

  function validate() {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = labels.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim()))
      errs.email = labels.emailInvalid;
    if (!newPassword) errs.newPassword = labels.passwordRequired;
    else if (newPassword.length < 6) errs.newPassword = labels.passwordShort;
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || "Error");
      } else {
        setStatus("success");
      }
    } catch {
      setApiError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.login, href: "/auth/login" },
            { label: labels.title },
          ]}
          ariaLabel={labels.breadcrumbAria}
        />
        <section className="flex flex-col gap-3">
          <h1 className="font-semibold">{labels.title}</h1>
          <p>{labels.intro}</p>
        </section>
        {status === "success" ? (
          <div className="flex flex-col gap-4">
            <p className="rounded-sm border border-[#28A745] bg-[#E8F5E9] p-3 text-[#212529]">
              {labels.successMsg}
            </p>
            <a
              href="/auth/login"
              className="min-h-12 inline-flex items-center justify-center rounded-sm bg-[#2E5C8A] px-6 text-white"
            >
              {labels.backToLogin}
            </a>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-col gap-2">
              {labels.email}
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                aria-label={labels.email}
              />
              {errors.email && (
                <span className="text-sm text-[#FF9800]">{errors.email}</span>
              )}
            </label>
            <label className="flex flex-col gap-2">
              {labels.newPassword}
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                aria-label={labels.newPassword}
              />
              {errors.newPassword && (
                <span className="text-sm text-[#FF9800]">{errors.newPassword}</span>
              )}
            </label>
            {apiError && (
              <p className="rounded-sm border border-[#DC3545] bg-[#FFEBEE] p-3 text-[#DC3545]">
                {apiError}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
            >
              {submitting ? labels.submitting : labels.submit}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
