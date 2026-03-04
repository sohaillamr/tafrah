import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طفرة – الدورات التدريبية | Courses",
  description:
    "تصفّح الدورات المتاحة على منصة طفرة. Browse available courses on Tafrah platform.",
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
