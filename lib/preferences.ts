export type UserCategory = "AUTISM" | "CP" | "LEARNING_HARDENING" | "NONE";

export type UiPreferences = {
  highContrastText?: boolean;
  highContrast?: boolean;
  mutedColors?: boolean;
  darkMode?: boolean;
  reduceMotion?: boolean;
  reduceSound?: boolean;
  focusMode?: boolean;
  ttsEnabled?: boolean;
  largeText?: boolean;
  simplifiedText?: boolean;
  dyslexicFont?: boolean;
  largeTargets?: boolean;
  keyboardNav?: boolean;
  stickyKeys?: boolean;
  extraSpacing?: boolean;
  readingGuide?: boolean;
  scale?: "normal" | "large" | "giant";
  density?: "normal" | "spaced";
  computedAttrs?: Record<string, string>;
};

export const VALID_CATEGORIES: UserCategory[] = ["AUTISM", "CP", "LEARNING_HARDENING", "NONE"];

export function normalizeCategory(category: unknown): UserCategory {
  return VALID_CATEGORIES.includes(category as UserCategory) ? (category as UserCategory) : "NONE";
}

export function normalizePreferences(input: unknown, category: UserCategory = "AUTISM"): UiPreferences {
  const prefs = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const highContrastText = Boolean(prefs.highContrastText ?? prefs.highContrast);
  const simplifiedText = Boolean(prefs.simplifiedText);
  const largeText = Boolean(prefs.largeText) || prefs.scale === "large" || prefs.scale === "giant";

  const normalized: UiPreferences = {
    highContrastText,
    highContrast: highContrastText,
    mutedColors: Boolean(prefs.mutedColors),
    darkMode: Boolean(prefs.darkMode),
    reduceMotion: Boolean(prefs.reduceMotion),
    reduceSound: Boolean(prefs.reduceSound),
    focusMode: Boolean(prefs.focusMode),
    ttsEnabled: prefs.ttsEnabled === undefined ? true : Boolean(prefs.ttsEnabled),
    largeText,
    simplifiedText,
    dyslexicFont: Boolean(prefs.dyslexicFont),
    largeTargets: Boolean(prefs.largeTargets),
    keyboardNav: Boolean(prefs.keyboardNav),
    stickyKeys: Boolean(prefs.stickyKeys),
    extraSpacing: Boolean(prefs.extraSpacing),
    readingGuide: Boolean(prefs.readingGuide),
    scale: largeText ? "large" : "normal",
    density: simplifiedText ? "spaced" : "normal",
  };

  normalized.computedAttrs = derivePreferenceAttrs(category, normalized);
  return normalized;
}

export function derivePreferenceAttrs(category: UserCategory, prefs: UiPreferences) {
  return {
    "data-profile": category === "AUTISM" ? "autism" : category.toLowerCase(),
    "data-theme": prefs.highContrastText ? "high-contrast" : prefs.darkMode ? "dark" : prefs.mutedColors ? "muted" : "pastel",
    "data-density": prefs.simplifiedText || prefs.extraSpacing ? "spaced" : "normal",
    "data-scale": prefs.largeText ? "large" : "normal",
    "data-focus-mode": prefs.focusMode ? "true" : "false",
    "data-reduce-sound": prefs.reduceSound ? "true" : "false",
    "data-reduce-motion": prefs.reduceMotion ? "true" : "false",
    "data-font": prefs.dyslexicFont ? "dyslexia" : "default",
    "data-large-targets": prefs.largeTargets ? "true" : "false",
  };
}

export function mapPreferenceTheme(category: UserCategory, prefs: UiPreferences): string {
  if (category === "AUTISM") {
    if (prefs.highContrastText) return "high-contrast";
    if (prefs.darkMode) return "dark";
    if (prefs.mutedColors) return "muted";
    return "pastel";
  }
  return "light";
}
