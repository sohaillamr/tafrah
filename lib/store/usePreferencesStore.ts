import { create } from 'zustand';

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
  keyboardOnly?: boolean;
  // LD
  dyslexicFont?: boolean;
  simplifiedText?: boolean;
}

interface UserPreferencesState {
  category: string;
  preferences: UiPreferences;
  isLoaded: boolean;
  isFocusMode: boolean;
  setFocusMode: (val: boolean) => void;
  setPreferences: (prefs: UiPreferences) => void;
  loadPreferences: () => Promise<void>;
}

export const usePreferencesStore = create<UserPreferencesState>((set) => ({
  category: 'NONE',
  preferences: {},
  isLoaded: false,
  isFocusMode: false,
  setFocusMode: (val) => set({ isFocusMode: val }),
  setPreferences: (prefs) => set({ preferences: prefs, isLoaded: true }),
  loadPreferences: async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const { user } = await res.json();
        if (user) {
          set({
            category: user.category || 'NONE',
            preferences: user.uiPreferences || {},
            isLoaded: true
          });
        }
      }
    } catch (e) {
      console.error('Failed to load preferences:', e);
      set({ isLoaded: true });
    }
  }
}));
