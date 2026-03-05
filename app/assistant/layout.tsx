"use client";

import { useEffect } from "react";

/**
 * Assistant layout — hides the global Footer on this full-screen chat page
 * and prevents the body from scrolling so the chat fills the viewport.
 * Uses a CSS class on <html> so the Footer component can hide itself.
 */
export default function AssistantLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("assistant-active");
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.classList.remove("assistant-active");
      document.body.style.overflow = "";
    };
  }, []);

  return <>{children}</>;
}
