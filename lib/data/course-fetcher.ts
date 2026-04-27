// lib/data/course-fetcher.ts
import { unit1Content } from "../../data/Unit1Content";
import { unit2Content } from "../../data/Unit2Content";
import { unit3Content } from "../../data/Unit3Content";
import { unit4Content } from "../../data/Unit4Content";
import { unit5Content } from "../../data/Unit5Content";
import { unit6Content } from "../../data/Unit6Content";
import { unit7Content } from "../../data/Unit7Content";
import { pythonUnit1Content } from "../../data/PythonUnit1Content";
import { pythonUnit2Content } from "../../data/PythonUnit2Content";
import { pythonUnit3Content } from "../../data/PythonUnit3Content";
import { pythonUnit4Content } from "../../data/PythonUnit4Content";
import { pythonUnit5Content } from "../../data/PythonUnit5Content";
import { pythonUnit6Content } from "../../data/PythonUnit6Content";
import { pythonUnit7Content } from "../../data/PythonUnit7Content";
import { financeUnit1Content } from "../../data/FinanceUnit1Content";
import { financeUnit2Content } from "../../data/FinanceUnit2Content";
import { financeUnit3Content } from "../../data/FinanceUnit3Content";
import { financeUnit4Content } from "../../data/FinanceUnit4Content";

const buildSteps = (unitParam: any): any[] => {
  const unit = Array.isArray(unitParam) ? unitParam[0] : unitParam;
  if (!unit || !unit.chapters) return [];
  return unit.chapters.flatMap((chapter: any, chapterIndex: number) =>
    chapter.steps.map((step: any, index: number) => ({
      id: `${unit.unit_id || unit.id}-${chapterIndex}-${index}`,
      type: step.type || (step.action ? "task" : "info"),
      instruction: step.text || step.instruction || "",
      action: step.action,
      extraAction: step.extraAction,
      chapterTitle: chapter.title || chapter.chapter_title || "",
    }))
  );
};

export async function fetchUnitStepsServerSide(courseSlug: string, category: string, activeUnit: number = 0) {
  // Simulate minor network delay for realism if needed, or just return straight async
  return new Promise<any[]>((resolve) => {
    let unitData: any = null;
    const isPython = courseSlug === "programming-1" || category === "python" || category === "البرمجة";
    const isFinance = courseSlug === "finance-1" || category === "finance" || category === "المالية والمحاسبة";

    if (isPython) {
      switch (activeUnit) {
        case 0: unitData = pythonUnit1Content; break;
        case 1: unitData = pythonUnit2Content; break;
        case 2: unitData = pythonUnit3Content; break;
        case 3: unitData = pythonUnit4Content; break;
        case 4: unitData = pythonUnit5Content; break;
        case 5: unitData = pythonUnit6Content; break;
        case 6: unitData = pythonUnit7Content; break;
      }
    } else if (isFinance) {
      switch (activeUnit) {
        case 0: unitData = financeUnit1Content; break;
        case 1: unitData = financeUnit2Content; break;
        case 2: unitData = financeUnit3Content; break;
        case 3: unitData = financeUnit4Content; break;
      }
    } else {
      switch (activeUnit) {
        case 0: unitData = unit1Content; break;
        case 1: unitData = unit2Content; break;
        case 2: unitData = unit3Content; break;
        case 3: unitData = unit4Content; break;
        case 4: unitData = unit5Content; break;
        case 5: unitData = unit6Content; break;
        case 6: unitData = unit7Content; break;
      }
    }

    resolve(buildSteps(unitData));
  });
}
