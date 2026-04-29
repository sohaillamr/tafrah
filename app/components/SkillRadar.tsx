"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

interface SkillData {
  logicFlow: number;
  attentionToDetail: number;
  syntaxAccuracy: number;
  patternRecognition: number;
  problemDecomposition: number;
}

export function SkillRadar({ data }: { data?: SkillData }) {
  const defaultData = [
    { subject: "Logic Flow", A: data?.logicFlow ?? 10, fullMark: 100 },
    { subject: "Attention", A: data?.attentionToDetail ?? 10, fullMark: 100 },
    { subject: "Syntax", A: data?.syntaxAccuracy ?? 10, fullMark: 100 },
    { subject: "Patterns", A: data?.patternRecognition ?? 10, fullMark: 100 },
    { subject: "Decomposition", A: data?.problemDecomposition ?? 10, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 flex items-center justify-center shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={defaultData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#cbd5e1" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
