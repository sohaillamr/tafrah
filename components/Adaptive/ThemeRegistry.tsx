"use client";

import { useEffect, useState } from "react";
import { Volume2, X } from "lucide-react";
import { usePreferencesStore } from "../../lib/store/usePreferencesStore";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { preferences, category, isLoaded, loadPreferences } = usePreferencesStore();
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    if (!isLoaded) return;
    document.documentElement.setAttribute("data-profile", category === "AUTISM" ? "autism" : category.toLowerCase());
    document.documentElement.setAttribute("data-theme", preferences?.highContrastText ? "high-contrast" : preferences?.mutedColors ? "muted" : "pastel");
    document.documentElement.setAttribute("data-density", preferences?.simplifiedText ? "spaced" : "normal");
    document.documentElement.setAttribute("data-scale", preferences?.largeText ? "large" : "normal");
    if (preferences?.reduceMotion) document.documentElement.setAttribute("data-reduce-motion", "true");
    else document.documentElement.removeAttribute("data-reduce-motion");
  }, [category, preferences, isLoaded]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onSelection = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const selected = window.getSelection();
        const text = selected?.toString().trim() || "";
        if (!text || text.length < 2 || !selected || selected.rangeCount === 0) {
          setSelection(null);
          return;
        }
        const rect = selected.getRangeAt(0).getBoundingClientRect();
        setSelection({
          text: text.slice(0, 500),
          x: Math.min(rect.left + rect.width / 2, window.innerWidth - 80),
          y: Math.max(rect.top - 52, 72),
        });
      }, 450);
    };
    document.addEventListener("mouseup", onSelection);
    document.addEventListener("keyup", onSelection);
    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener("mouseup", onSelection);
      document.removeEventListener("keyup", onSelection);
    };
  }, []);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  const wrapperClasses = [
    "theme-wrapper",
    preferences?.highContrastText ? "contrast-125 saturate-150" : "",
    preferences?.simplifiedText ? "simplified-mode" : "",
    preferences?.largeText ? "text-[112%]" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={wrapperClasses}>
      {children}
      {selection && (preferences?.ttsEnabled ?? true) ? (
        <div
          className="fixed z-50 flex items-center gap-2 rounded-full border border-[#D9E6F2] bg-white p-2 shadow-lg"
          style={{ left: selection.x, top: selection.y, transform: "translateX(-50%)" }}
        >
          <button type="button" onClick={() => speak(selection.text)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#2E5C8A] px-4 text-sm font-semibold text-white" aria-label="Nour read selected text">
            <Volume2 size={16} /> Nour
          </button>
          <button type="button" onClick={() => setSelection(null)} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#495057]" aria-label="Close Nour read button">
            <X size={16} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
