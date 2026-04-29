"use client";

import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function CompetencyDashboard({ profileData }: { profileData: any }) {
  // Focus Mode reduces cognitive load by hiding non-essential UI elements
  const [focusMode, setFocusMode] = useState(false);

  const radarData = [
    { skill: "Logic", value: profileData.logicFlow || 10 },
    { skill: "Attention", value: profileData.attentionToDetail || 10 },
    { skill: "Syntax", value: profileData.syntaxAccuracy || 10 },
    { skill: "Patterns", value: profileData.patternRecognition || 10 },
    { skill: "Decomp.", value: profileData.problemDecomposition || 10 },
  ];

  return (
    <div className={`p-6 max-w-6xl mx-auto transition-colors duration-300 ${focusMode ? "bg-[#F9F9F9]" : "bg-white"}`}>
      
      {/* Dashboard Header & Focus Toggle */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2E5C8A]">Competency Profile</h1>
          <p className="text-[#6C757D]">Strength-based employment map</p>
        </div>
        <button 
          onClick={() => setFocusMode(!focusMode)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          {focusMode ? <EyeOff size={18} /> : <Eye size={18} />}
          {focusMode ? "Disable Focus Mode" : "Enable Focus Mode"}
        </button>
      </div>

      <div className={`grid gap-6 ${focusMode ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        
        {/* Career Readiness Tracker */}
        <section className="col-span-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-[#2E5C8A]">Career Readiness Tracker</h2>
          <div className="w-full bg-[#E9ECEF] rounded-full h-4 overflow-hidden mb-2">
            <div 
              className="bg-[#28A745] h-4 rounded-full transition-all duration-1000" 
              style={{ width: `${profileData.careerReadiness || 0}%` }} 
            />
          </div>
          {!focusMode && (
            <div className="flex justify-between text-sm text-[#6C757D]">
               <span>Foundation: 100%</span>
               <span>Portfolio Items: {profileData.verifiedProjects?.length || 0}</span>
               <span>Soft Skills: AI Verified</span>
            </div>
          )}
        </section>

        {/* Skill Radar Chart */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <h2 className="font-semibold text-lg mb-4 text-[#2E5C8A] w-full text-left">Cognitive Map</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 12 }} />
                <Radar name="Skills" dataKey="value" stroke="#8b5cf6" fill="#cbd5e1" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* AI Strengths Summary (Only visible if not in hyper-focus mode) */}
        {!focusMode && profileData.strengthsSummary && (
          <section className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h2 className="font-semibold text-lg mb-4 text-indigo-900">AI Strengths Summary</h2>
            <ul className="space-y-3">
              {profileData.strengthsSummary.strengths?.map((strength: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-indigo-800">
                  <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-indigo-700 italic">&quot;{profileData.strengthsSummary.workStyle}&quot;</p>
          </section>
        )}

        {/* Proof of Work Gallery */}
        <section className="col-span-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-[#2E5C8A]">My Digital Labs (Proof of Work)</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {profileData.verifiedProjects?.map((project: any) => (
              <div key={project.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-[#F8F9FA] p-4 relative">
                {project.aiVerified && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-2 py-1 rounded shadow" title="Verified independently by Nour AI">
                    <CheckCircle2 size={12} /> AI Verified
                  </div>
                )}
                <p className="font-semibold pr-24 text-gray-800">{project.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                <button className="mt-auto min-h-10 rounded text-sm font-medium border border-gray-300 hover:bg-gray-100 transition">
                  View Source
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

