"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";

export default function HrAuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const { language } = useLanguage();
  const { login, signup } = useAuth();
  const router = useRouter();

  // Signup state
  const [companyName, setCompanyName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [commercialNumber, setCommercialNumber] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          portal: "بوابة الشركات",
          signupPage: "تسجيل الشركات",
          title: "تسجيل دخول أو إنشاء حساب",
          login: "تسجيل الدخول",
          signup: "إنشاء حساب",
          signupInfo: "بيانات إنشاء الحساب",
          companyName: "اسم الشركة",
          workEmail: "البريد الإلكتروني للعمل",
          commercialNumber: "رقم السجل التجاري",
          password: "كلمة المرور",
          required: "جميع الحقول مطلوبة قبل الإرسال.",
          loginInfo: "بيانات تسجيل الدخول",
          companyRequired: "يرجى إدخال اسم الشركة.",
          emailRequired: "يرجى إدخال البريد الإلكتروني.",
          emailInvalid: "صيغة البريد الإلكتروني غير صحيحة.",
          commercialRequired: "يرجى إدخال رقم السجل التجاري.",
          passwordRequired: "يرجى إدخال كلمة المرور.",
          passwordShort: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
          submitting: "جاري الإرسال...",
          forgotPassword: "نسيت كلمة المرور؟",
        }
      : {
          home: "Home",
          portal: "Company Portal",
          signupPage: "Company Registration",
          title: "Sign in or create an account",
          login: "Sign in",
          signup: "Create account",
          signupInfo: "Account creation details",
          companyName: "Company name",
          workEmail: "Work email",
          commercialNumber: "Commercial registration number",
          password: "Password",
          required: "All fields are required before submitting.",
          loginInfo: "Login details",
          companyRequired: "Please enter the company name.",
          emailRequired: "Please enter your email.",
          emailInvalid: "Invalid email format.",
          commercialRequired: "Please enter the commercial registration number.",
          passwordRequired: "Please enter a password.",
          passwordShort: "Password must be at least 8 characters.",
          submitting: "Submitting...",
          forgotPassword: "Forgot password?",
        };

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = labels.companyRequired;
    if (!signupEmail.trim()) errs.email = labels.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(signupEmail.trim()))
      errs.email = labels.emailInvalid;
    if (!commercialNumber.trim()) errs.commercial = labels.commercialRequired;
    if (!signupPassword) errs.password = labels.passwordRequired;
    else if (signupPassword.length < 8) errs.password = labels.passwordShort;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      const result = await signup({
        name: companyName.trim(),
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
        role: "hr",
        companyName: companyName.trim(),
        commercialReg: commercialNumber.trim(),
      });
      if (result.error) {
        setApiError(result.error);
      } else {
        router.push("/dashboard/hr");
      }
    } catch {
      setApiError(language === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    const errs: Record<string, string> = {};
    if (!loginEmail.trim()) errs.email = labels.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(loginEmail.trim()))
      errs.email = labels.emailInvalid;
    if (!loginPassword) errs.password = labels.passwordRequired;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      const result = await login(loginEmail.trim().toLowerCase(), loginPassword);
      if (result.error) {
        setApiError(result.error);
      } else {
        router.push("/dashboard/hr");
      }
    } catch {
      setApiError(language === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.portal, href: "/auth/select" },
            { label: labels.signupPage },
          ]}
        />
        <section className="flex flex-col gap-4">
          <h1 className="font-semibold">{labels.title}</h1>
          <div className="flex flex-wrap gap-3" role="tablist">
            <button
              type="button"
              onClick={() => { setMode("login"); setErrors({}); setApiError(""); }}
              role="tab"
              aria-selected={mode === "login"}
              className={`min-h-12 rounded-sm border px-6 ${
                mode === "login"
                  ? "border-[#2E5C8A] bg-[#2E5C8A] text-white"
                  : "border-[#DEE2E6] bg-white text-[#212529]"
              }`}
            >
              {labels.login}
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setErrors({}); setApiError(""); }}
              role="tab"
              aria-selected={mode === "signup"}
              className={`min-h-12 rounded-sm border px-6 ${
                mode === "signup"
                  ? "border-[#2E5C8A] bg-[#2E5C8A] text-white"
                  : "border-[#DEE2E6] bg-white text-[#212529]"
              }`}
            >
              {labels.signup}
            </button>
          </div>
        </section>

        {apiError && (
          <p role="alert" className="rounded-sm border border-[#DC3545] bg-[#FFEBEE] p-3 text-[#DC3545]">
            {apiError}
          </p>
        )}

        {mode === "signup" ? (
          <section className="flex flex-col gap-6">
            <h2 className="font-semibold">{labels.signupInfo}</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSignup} noValidate>
              <label className="flex flex-col gap-2">
                {labels.companyName}
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                />
                {errors.companyName && <span className="text-sm text-[#FF9800]">{errors.companyName}</span>}
              </label>
              <label className="flex flex-col gap-2">
                {labels.workEmail}
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                />
                {errors.email && <span className="text-sm text-[#FF9800]">{errors.email}</span>}
              </label>
              <label className="flex flex-col gap-2">
                {labels.commercialNumber}
                <input
                  type="text"
                  value={commercialNumber}
                  onChange={(e) => setCommercialNumber(e.target.value)}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                />
                {errors.commercial && <span className="text-sm text-[#FF9800]">{errors.commercial}</span>}
              </label>
              <label className="flex flex-col gap-2">
                {labels.password}
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                />
                {errors.password && <span className="text-sm text-[#FF9800]">{errors.password}</span>}
              </label>
              <p className="text-sm text-[#6C757D]">{labels.required}</p>
              <button
                type="submit"
                disabled={isLoading}
                className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
              >
                {isLoading ? labels.submitting : labels.signup}
              </button>
            </form>
          </section>
        ) : (
          <section className="flex flex-col gap-6">
            <h2 className="font-semibold">{labels.loginInfo}</h2>
            <form className="flex flex-col gap-4" onSubmit={handleLogin} noValidate>
              <label className="flex flex-col gap-2">
                {labels.workEmail}
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                />
                {errors.email && <span className="text-sm text-[#FF9800]">{errors.email}</span>}
              </label>
              <label className="flex flex-col gap-2">
                {labels.password}
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                />
                {errors.password && <span className="text-sm text-[#FF9800]">{errors.password}</span>}
              </label>
              <a href="/auth/recovery" className="text-sm text-[#2E5C8A] underline">
                {labels.forgotPassword}
              </a>
              <button
                type="submit"
                disabled={isLoading}
                className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
              >
                {isLoading ? labels.submitting : labels.login}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
