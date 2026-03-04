"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../../components/TopBar";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";

export default function UserSignupPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          portal: "بوابة التسجيل",
          title: "إنشاء حساب متدرب",
          header: "إنشاء حساب مستخدم",
          intro: "يرجى إدخال بياناتك بشكل واضح وبسيط.",
          name: "الاسم بالكامل",
          email: "البريد الإلكتروني",
          password: "كلمة المرور",
          submit: "إنشاء الحساب",
          login: "لديك حساب بالفعل؟ تسجيل الدخول",
          nameRequired: "يرجى إدخال الاسم.",
          emailRequired: "يرجى إدخال البريد الإلكتروني.",
          emailInvalid: "صيغة البريد الإلكتروني غير صحيحة.",
          passwordRequired: "يرجى إدخال كلمة المرور.",
          passwordShort: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
          successMsg: "تم إنشاء الحساب بنجاح.",
          breadcrumbAria: "مسار التنقل",
        }
      : {
          home: "Home",
          portal: "Registration Portal",
          title: "Create trainee account",
          header: "Create user account",
          intro: "Please enter your details clearly and simply.",
          name: "Full name",
          email: "Email",
          password: "Password",
          submit: "Create account",
          login: "Already have an account? Sign in",
          nameRequired: "Please enter your name.",
          emailRequired: "Please enter your email.",
          emailInvalid: "Invalid email format.",
          passwordRequired: "Please enter a password.",
          passwordShort: "Password must be at least 6 characters.",
          successMsg: "Account created successfully.",
          breadcrumbAria: "Breadcrumb",
        };

  function validate() {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = labels.nameRequired;
    if (!email.trim()) errs.email = labels.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = labels.emailInvalid;
    if (!password) errs.password = labels.passwordRequired;
    else if (password.length < 6) errs.password = labels.passwordShort;
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsLoading(true);
    try {
      const result = await signup({ name: fullName.trim(), email: email.trim(), password, role: "student" });
      if (result.error) {
        setStatus("error");
        setServerError(result.error);
        setIsLoading(false);
        return;
      }
      setStatus("success");
      setFullName("");
      setEmail("");
      setPassword("");
      setErrors({});
      setTimeout(() => router.push("/dashboard/student"), 1500);
    } catch {
      setStatus("error");
      setServerError(language === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Try again.");
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
            { label: labels.title },
          ]}
          ariaLabel={labels.breadcrumbAria}
        />
        <section className="flex flex-col gap-3">
          <h1 className="font-semibold">{labels.header}</h1>
          <p>{labels.intro}</p>
        </section>

        <section className="flex flex-col gap-6">
          {status === "success" && (
            <p className="rounded-sm border border-[#28A745] bg-[#E8F5E9] p-3 text-[#212529]">
              {labels.successMsg}
            </p>
          )}
          {status === "error" && serverError && (
            <p className="rounded-sm border border-[#FF9800] bg-[#FFF3E0] p-3 text-[#212529]">
              {serverError}
            </p>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-col gap-2">
              {labels.name}
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
              {errors.fullName && (
                <span className="text-sm text-[#FF9800]">{errors.fullName}</span>
              )}
            </label>
            <label className="flex flex-col gap-2">
              {labels.email}
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
              {errors.email && (
                <span className="text-sm text-[#FF9800]">{errors.email}</span>
              )}
            </label>
            <label className="flex flex-col gap-2">
              {labels.password}
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
              {errors.password && (
                <span className="text-sm text-[#FF9800]">{errors.password}</span>
              )}
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
            >
              {isLoading ? "..." : labels.submit}
            </button>
          </form>

          <div>
            <Link href="/auth/login" className="min-h-12 inline-flex items-center">
              {labels.login}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
