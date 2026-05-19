"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CourseState = {
  courseKey: string;
  currentStep: number;
  validatedSteps: Record<number, boolean>;
  needsSync: boolean;
  initCourse: (key: string) => void;
  markStepValid: (step: number) => void;
  nextStep: (totalSteps: number) => void;
  prevStep: () => void;
  reset: () => void;
  markSynced: () => void;
};

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courseKey: "",
      currentStep: 0,
      validatedSteps: {},
      needsSync: false,
      initCourse: (key) =>
        set((state) => {
          if (state.courseKey !== key) {
            return { courseKey: key, currentStep: 0, validatedSteps: {}, needsSync: true };
          }
          return state;
        }),
      markStepValid: (step) =>
        set((state) => ({
          validatedSteps: { ...state.validatedSteps, [step]: true },
          needsSync: true,
        })),
      nextStep: (totalSteps) =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, totalSteps - 1),
          needsSync: true,
        })),
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
          needsSync: true,
        })),
      reset: () =>
        set({
          currentStep: 0,
          validatedSteps: {},
          needsSync: true,
        }),
      markSynced: () =>
        set({
          needsSync: false,
        }),
    }),
    {
      name: "tafrah-course-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
