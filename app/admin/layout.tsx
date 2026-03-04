import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طفرة – لوحة الأدمن | Admin Panel",
  description:
    "لوحة إدارة منصة طفرة. Tafrah platform admin panel.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
