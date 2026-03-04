import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طفرة – فرص العمل | Jobs",
  description:
    "فرص العمل المتاحة لذوي التوحد على منصة طفرة. Job opportunities for individuals with autism on Tafrah.",
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
