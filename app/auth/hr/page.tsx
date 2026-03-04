"use client";

import { useState } from "react";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";

export default function HrAuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const { language } = useLanguage();
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
        };

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
            onClick={() => setMode("login")}
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
            onClick={() => setMode("signup")}
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

      {mode === "signup" ? (
        <section className="flex flex-col gap-6">
          <h2 className="font-semibold">{labels.signupInfo}</h2>
          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              {labels.companyName}
              <input
                type="text"
                name="companyName"
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
            </label>
            <label className="flex flex-col gap-2">
              {labels.workEmail}
              <input
                type="email"
                name="workEmail"
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
            </label>
            <label className="flex flex-col gap-2">
              {labels.commercialNumber}
              <input
                type="text"
                name="commercialNumber"
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
            </label>
            <label className="flex flex-col gap-2">
              {labels.password}
              <input
                type="password"
                name="password"
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
            </label>
            <p>{labels.required}</p>
            <button
              type="submit"
              className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white"
            >
              {labels.signup}
            </button>
          </form>
        </section>
      ) : (
        <section className="flex flex-col gap-6">
          <h2 className="font-semibold">{labels.loginInfo}</h2>
          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              {labels.workEmail}
              <input
                type="email"
                name="loginEmail"
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
            </label>
            <label className="flex flex-col gap-2">
              {labels.password}
              <input
                type="password"
                name="loginPassword"
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
            </label>
            <button
              type="submit"
              className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white"
            >
              {labels.login}
            </button>
          </form>
        </section>
      )}
      </main>
    </div>
  );
}
