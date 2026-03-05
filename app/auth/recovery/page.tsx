"use client";

import { useState } from "react";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";

export default function RecoveryPage() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"email" | "token" | "success">("email");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          login: "تسجيل الدخول",
          title: "استعادة كلمة المرور",
          introEmail: "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.",
          introToken: "أدخل رمز التحقق الذي تلقيته وكلمة المرور الجديدة.",
          email: "البريد الإلكتروني",
          token: "رمز التحقق",
          newPassword: "كلمة المرور الجديدة",
          submitEmail: "إرسال رمز التحقق",
          submitToken: "إعادة تعيين كلمة المرور",
          submitting: "جاري الإرسال...",
          emailRequired: "يرجى إدخال البريد الإلكتروني.",
          emailInvalid: "صيغة البريد الإلكتروني غير صحيحة.",
          tokenRequired: "يرجى إدخال رمز التحقق.",
          passwordRequired: "يرجى إدخال كلمة المرور الجديدة.",
          passwordShort: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
          passwordComplexity: "يجب أن تحتوي على حرف كبير وحرف صغير ورقم.",
          emailSent: "تم إرسال رمز التحقق إلى بريدك الإلكتروني (تحقق من صندوق الوارد والبريد غير المرغوب).",
          successMsg: "تم إعادة تعيين كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.",
          breadcrumbAria: "مسار التنقل",
          backToLogin: "العودة لتسجيل الدخول",
        }
      : {
          home: "Home",
          login: "Login",
          title: "Password Recovery",
          introEmail: "Enter your email and we'll send you a reset code.",
          introToken: "Enter the verification code you received and your new password.",
          email: "Email",
          token: "Verification Code",
          newPassword: "New Password",
          submitEmail: "Send Reset Code",
          submitToken: "Reset Password",
          submitting: "Sending...",
          emailRequired: "Please enter your email.",
          emailInvalid: "Invalid email format.",
          tokenRequired: "Please enter the verification code.",
          passwordRequired: "Please enter a new password.",
          passwordShort: "Password must be at least 8 characters.",
          passwordComplexity: "Must contain uppercase, lowercase, and a number.",
          emailSent: "A verification code has been sent to your email (check inbox and spam).",
          successMsg: "Password has been reset successfully. You can now log in.",
          breadcrumbAria: "Breadcrumb",
          backToLogin: "Back to Login",
        };

  function validateEmail() {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = labels.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim()))
      errs.email = labels.emailInvalid;
    return errs;
  }

  function validateToken() {
    const errs: Record<string, string> = {};
    if (!token.trim()) errs.token = labels.tokenRequired;
    if (!newPassword) errs.newPassword = labels.passwordRequired;
    else if (newPassword.length < 8) errs.newPassword = labels.passwordShort;
    else {
      const hasUpper = /[A-Z]/.test(newPassword);
      const hasLower = /[a-z]/.test(newPassword);
      const hasNum = /[0-9]/.test(newPassword);
      if (!hasUpper || !hasLower || !hasNum) errs.newPassword = labels.passwordComplexity;
    }
    return errs;
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    const errs = validateEmail();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (res.ok) {
        setStep("token");
      } else {
        const data = await res.json();
        setApiError(data.error || "Error");
      }
    } catch {
      setApiError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    const errs = validateToken();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || "Error");
      } else {
        setStep("success");
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
          <p>{step === "email" ? labels.introEmail : step === "token" ? labels.introToken : ""}</p>
        </section>

        {apiError && (
          <p role="alert" className="rounded-sm border border-[#DC3545] bg-[#FFEBEE] p-3 text-[#DC3545]">
            {apiError}
          </p>
        )}

        {step === "success" ? (
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
        ) : step === "email" ? (
          <form className="flex flex-col gap-4" onSubmit={handleEmailSubmit} noValidate>
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
            <button
              type="submit"
              disabled={submitting}
              className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
            >
              {submitting ? labels.submitting : labels.submitEmail}
            </button>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleTokenSubmit} noValidate>
            <p className="rounded-sm border border-[#2E5C8A] bg-[#E3F2FD] p-3 text-[#212529]">
              {labels.emailSent}
            </p>
            <label className="flex flex-col gap-2">
              {labels.token}
              <input
                type="text"
                name="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4 font-mono"
                aria-label={labels.token}
              />
              {errors.token && (
                <span className="text-sm text-[#FF9800]">{errors.token}</span>
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
            <button
              type="submit"
              disabled={submitting}
              className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
            >
              {submitting ? labels.submitting : labels.submitToken}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
