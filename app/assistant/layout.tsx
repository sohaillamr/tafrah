"use client";

import { useEffect } from "react";

/**
 * Assistant layout — hides the global Footer on this full-screen chat page
 * and prevents the body from scrolling so the chat fills the viewport.
 */
export default function AssistantLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    /* Hide the footer rendered by the root layout */
    const footer = document.querySelector("footer");
    if (footer) (footer as HTMLElement).style.display = "none";

    /* Prevent body scroll so the chat container controls its own scroll */
    document.body.style.overflow = "hidden";

    return () => {
      if (footer) (footer as HTMLElement).style.display = "";
      document.body.style.overflow = "";
    };
  }, []);

  return <>{children}</>;
}
