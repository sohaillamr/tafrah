"use client";

import { Lock, MapPin, Target } from "lucide-react";

type Labels = Record<string, string>;

type UnitNavigationProps = {
  labels: Labels;
  unitNumber: number;
  unitTitle: string;
  quizzesPassed: Record<number, boolean>;
  handleUnitChange: (target: number) => void;
};

type ProgressSummaryProps = {
  labels: Labels;
  currentStep: number;
  stepsLength: number;
  completedUnits: number;
  courseProgressValue: number;
  unitProgressValue: number;
};

type CalmHeaderProps = ProgressSummaryProps & {
  labels: Labels;
  unitTitle: string;
  focusMode: boolean;
  onToggleFocus: () => void;
};

export function CalmCourseHeader({
  labels,
  unitTitle,
  focusMode,
  onToggleFocus,
  currentStep,
  stepsLength,
  unitProgressValue,
}: CalmHeaderProps) {
  return (
    <section className="border-b border-[#DEE2E6] bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#6C757D]">
            {labels.stepLabel} {currentStep + 1} {labels.of} {stepsLength}
          </p>
          <h1 className="mt-1 text-xl font-semibold text-[#2E5C8A] sm:text-2xl">{unitTitle}</h1>
        </div>
        <button
          type="button"
          onClick={onToggleFocus}
          className="min-h-11 rounded-sm border border-[#2E5C8A] bg-white px-4 text-sm font-semibold text-[#2E5C8A]"
        >
          {focusMode ? labels.focusOff : labels.focusOn}
        </button>
      </div>
      <div className="mx-auto mt-3 h-2 w-full max-w-[1180px] overflow-hidden rounded-full bg-[#E9ECEF]">
        <div className="h-2 rounded-full bg-[#2E5C8A]" style={{ width: `${unitProgressValue}%` }} />
      </div>
    </section>
  );
}

export function UnitNavigation({
  labels,
  unitNumber,
  unitTitle,
  quizzesPassed,
  handleUnitChange,
}: UnitNavigationProps) {
  const buttonLabels = [
    labels.unit1Button,
    labels.unit2Button,
    labels.unit3Button,
    labels.unit4Button,
    labels.unit5Button,
    labels.unit6Button,
    labels.unit7Button,
  ];

  return (
    <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-[#2E5C8A]">{labels.unitNav}</h2>
        <span className="rounded-sm bg-[#F8F9FA] px-3 py-1 text-sm text-[#495057]">
          {labels.currentUnit}: {unitTitle}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((num) => {
          const isActive = unitNumber === num;
          const isLocked = num > 1 && !quizzesPassed[num - 1];
          return (
            <button
              key={num}
              type="button"
              onClick={() => handleUnitChange(num)}
              disabled={isLocked}
              title={isLocked ? labels.quizLocked : buttonLabels[num - 1]}
              className={`min-h-10 rounded-sm px-4 text-sm font-medium ${
                isActive
                  ? "bg-[#2E5C8A] text-white"
                  : isLocked
                    ? "cursor-not-allowed border border-[#DEE2E6] bg-[#F8F9FA] text-[#ADB5BD]"
                    : "border border-[#DEE2E6] bg-white text-[#495057]"
              }`}
            >
              {isLocked ? <Lock size={12} className="me-1 inline" /> : null}
              {buttonLabels[num - 1]}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function ProgressSummary({
  labels,
  currentStep,
  stepsLength,
  completedUnits,
  courseProgressValue,
  unitProgressValue,
}: ProgressSummaryProps) {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      <ProgressBox
        icon={<Target size={18} />}
        title={labels.courseProgress}
        meta={`${completedUnits} / 7 ${labels.unitsCompleted}`}
        value={courseProgressValue}
      />
      <ProgressBox
        icon={<MapPin size={18} />}
        title={labels.unitProgress}
        meta={`${labels.stepLabel} ${currentStep + 1} ${labels.of} ${stepsLength}`}
        value={unitProgressValue}
      />
    </section>
  );
}

function ProgressBox({
  icon,
  title,
  meta,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
  value: number;
}) {
  return (
    <div className="rounded-sm border border-[#DEE2E6] bg-white p-4">
      <div className="flex items-center gap-2 text-[#2E5C8A]">
        {icon}
        <p className="font-semibold">{title}</p>
      </div>
      <p className="mt-1 text-sm text-[#6C757D]">{meta}</p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E9ECEF]">
        <div className="h-2 rounded-full bg-[#2E5C8A]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function StepProgressDots({
  stepsLength,
  currentStep,
  validatedSteps,
}: {
  stepsLength: number;
  currentStep: number;
  validatedSteps: Record<number, boolean>;
}) {
  const visibleIndexes = Array.from({ length: stepsLength }, (_, index) => index).filter(
    (index) => index === 0 || index === stepsLength - 1 || Math.abs(index - currentStep) <= 3
  );

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {visibleIndexes.map((index) => (
        <div
          key={index}
          className={`h-2 shrink-0 rounded-full ${
            index === currentStep
              ? "w-8 bg-[#2E5C8A]"
              : index < currentStep && validatedSteps[index]
                ? "w-2 bg-[#2E5C8A]"
                : "w-2 bg-[#DEE2E6]"
          }`}
        />
      ))}
    </div>
  );
}
