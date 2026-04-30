"use client";

import { usePreferencesStore } from "@/lib/store/usePreferencesStore";
import { ReactNode } from "react";

export function FocusWrapper({ children }: { children: ReactNode }) {
  const { isFocusMode } = usePreferencesStore();

  if (isFocusMode) {
    return <></>;
  }

  return <>{children}</>;
}
