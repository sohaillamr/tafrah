import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طفرة – من نحن | About Us",
  description:
    "تعرّف على منصة طفرة: بيئة عمل وتدريب متخصصة لذوي التوحد. Learn about Tafrah: a work and training platform for individuals with autism.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
