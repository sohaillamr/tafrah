import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طفرة – سياسة الخصوصية | Privacy Policy",
  description:
    "سياسة الخصوصية لمنصة طفرة. Tafrah platform privacy policy.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
