import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طفرة – تواصل معنا | Contact Us",
  description:
    "تواصل مع فريق طفرة للاستفسارات والدعم. Contact the Tafrah team for inquiries and support.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
