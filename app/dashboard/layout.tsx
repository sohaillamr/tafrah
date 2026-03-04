import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طفرة – لوحة التحكم | Dashboard",
  description:
    "لوحة التحكم الخاصة بك على منصة طفرة. Your dashboard on Tafrah platform.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
