import { create } from 'zustand';
import { normalizeCategory, normalizePreferences, type UserCategory } from '@/lib/preferences';

interface UiPreferences {
  // Autism
  highContrastText?: boolean;
  mutedColors?: boolean;
  reduceMotion?: boolean;
  reduceSound?: boolean;
  focusMode?: boolean;
  ttsEnabled?: boolean;
  largeText?: boolean;
  soundNotifications?: boolean;
  // CP
  largeButtons?: boolean;
  largeTargets?: boolean;
  keyboardOnly?: boolean;
  keyboardNav?: boolean;
  stickyKeys?: boolean;
  // LD
  dyslexicFont?: boolean;
  simplifiedText?: boolean;
  extraSpacing?: boolean;
  readingGuide?: boolean;
  highContrast?: boolean;
  scale?: "normal" | "large" | "giant";
  density?: "normal" | "spaced";
  computedAttrs?: Record<string, string>;
}

interface UserPreferencesState {
  category: UserCategory;
  preferences: UiPreferences;
  isLoaded: boolean;
  isFocusMode: boolean;
  setFocusMode: (val: boolean) => void;
  setPreferences: (prefs: UiPreferences, category?: UserCategory) => void;
  loadPreferences: () => Promise<void>;
}

export const usePreferencesStore = create<UserPreferencesState>((set) => ({
  category: 'NONE',
  preferences: {},
  isLoaded: false,
  isFocusMode: false,
  setFocusMode: (val) => set({ isFocusMode: val }),
  setPreferences: (prefs, category = 'AUTISM') => {
    const normalized = normalizePreferences(prefs, category);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uiPreferences', JSON.stringify(normalized));
    }
    set({ category, preferences: normalized, isLoaded: true });
  },
  loadPreferences: async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const { user } = await res.json();
        if (user) {
          const category = normalizeCategory(user.category);
          const preferences = normalizePreferences(user.uiPreferences || {}, category);
          if (typeof window !== 'undefined') {
            localStorage.setItem('uiPreferences', JSON.stringify(preferences));
          }
          set({
            category,
            preferences,
            isLoaded: true
          });
          return;
        }
      }
      const stored = typeof window !== 'undefined' ? localStorage.getItem('uiPreferences') : null;
      if (stored) {
        set({ preferences: normalizePreferences(JSON.parse(stored)), isLoaded: true });
        return;
      }
      set({ isLoaded: true });
    } catch (e) {
      console.error('Failed to load preferences:', e);
      set({ isLoaded: true });
    }
  }
}));
