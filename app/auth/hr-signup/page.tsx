"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";

export default function HrSignupPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { signup } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [commercialNumber, setCommercialNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          portal: "بوابة الشركات",
          title: "إنشاء حساب شركة",
          header: "إنشاء حساب كشركة",
          intro: "يرجى إدخال بيانات الشركة بشكل واضح.",
          company: "اسم الشركة",
          email: "البريد الإلكتروني للعمل",
          commercial: "رقم السجل التجاري",
          password: "كلمة المرور",
          submit: "إنشاء حساب",
          companyRequired: "يرجى إدخال اسم الشركة.",
          emailRequired: "يرجى إدخال البريد الإلكتروني.",
          emailInvalid: "صيغة البريد الإلكتروني غير صحيحة.",
          commercialRequired: "يرجى إدخال رقم السجل التجاري.",
          passwordRequired: "يرجى إدخال كلمة المرور.",
          passwordShort: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
          successMsg: "تم إنشاء حساب الشركة بنجاح.",
          breadcrumbAria: "مسار التنقل",
        }
      : {
          home: "Home",
          portal: "Company Portal",
          title: "Create company account",
          header: "Create a company account",
          intro: "Please enter the company details clearly.",
          company: "Company name",
          email: "Work email",
          commercial: "Commercial registration number",
          password: "Password",
          submit: "Create account",
          companyRequired: "Please enter the company name.",
          emailRequired: "Please enter an email.",
          emailInvalid: "Invalid email format.",
          commercialRequired: "Please enter the commercial registration number.",
          passwordRequired: "Please enter a password.",
          passwordShort: "Password must be at least 8 characters.",
          successMsg: "Company account created successfully.",
          breadcrumbAria: "Breadcrumb",
        };

  function validate() {
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = labels.companyRequired;
    if (!companyEmail.trim()) errs.companyEmail = labels.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail.trim()))
      errs.companyEmail = labels.emailInvalid;
    if (!commercialNumber.trim())
      errs.commercialNumber = labels.commercialRequired;
    if (!password) errs.password = labels.passwordRequired;
    else if (password.length < 8) errs.password = labels.passwordShort;
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
      const result = await signup({ name: companyName.trim(), email: companyEmail.trim(), password, role: "hr", companyName: companyName.trim(), commercialReg: commercialNumber.trim() });
      if (result.error) {
        setStatus("error");
        setServerError(result.error);
        setIsLoading(false);
        return;
      }
      setStatus("success");
      setCompanyName("");
      setCompanyEmail("");
      setCommercialNumber("");
      setPassword("");
      setErrors({});
      setTimeout(() => { window.location.href = "/dashboard/hr"; }, 1500);
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
            {labels.company}
            <input
              type="text"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
            />
            {errors.companyName && (
              <span className="text-sm text-[#FF9800]">{errors.companyName}</span>
            )}
          </label>
          <label className="flex flex-col gap-2">
            {labels.email}
            <input
              type="email"
              name="companyEmail"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
            />
            {errors.companyEmail && (
              <span className="text-sm text-[#FF9800]">{errors.companyEmail}</span>
            )}
          </label>
          <label className="flex flex-col gap-2">
            {labels.commercial}
            <input
              type="text"
              name="commercialNumber"
              value={commercialNumber}
              onChange={(e) => setCommercialNumber(e.target.value)}
              className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
            />
            {errors.commercialNumber && (
              <span className="text-sm text-[#FF9800]">{errors.commercialNumber}</span>
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
      </main>
    </div>
  );
}
