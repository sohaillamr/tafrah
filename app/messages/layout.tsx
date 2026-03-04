import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طفرة – الرسائل | Messages",
  description:
    "الرسائل والمحادثات على منصة طفرة. Messages and conversations on Tafrah.",
};

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
