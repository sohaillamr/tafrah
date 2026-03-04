import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طفرة – تسجيل الدخول | Sign In",
  description:
    "سجل دخولك أو أنشئ حساباً على منصة طفرة. Sign in or create an account on Tafrah.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
