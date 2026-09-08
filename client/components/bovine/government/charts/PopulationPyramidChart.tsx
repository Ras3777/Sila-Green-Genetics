'use client';

import React from 'react';

interface AgeCohort {
  ageGroup: string;
  malesCount: number;
  femalesCount: number;
  malesPct: number;
  femalesPct: number;
}

interface PopulationPyramidChartProps {
  cohorts?: AgeCohort[];
  totalPopulation?: number;
  title?: string;
  subtitle?: string;
}

const defaultCohorts: AgeCohort[] = [
  { ageGroup: '8+ Years (Aged)', malesCount: 1240, femalesCount: 8400, malesPct: 0.9, femalesPct: 5.9 },
  { ageGroup: '5–8 Years (Mature)', malesCount: 3820, femalesCount: 22900, malesPct: 2.7, femalesPct: 16.1 },
  { ageGroup: '2–5 Years (Prime Adult)', malesCount: 11400, femalesCount: 38700, malesPct: 8.0, femalesPct: 27.2 },
  { ageGroup: '1–2 Years (Yearlings)', malesCount: 15300, femalesCount: 18200, malesPct: 10.7, femalesPct: 12.8 },
  { ageGroup: '6–12 Mo (Weaners)', malesCount: 8900, femalesCount: 9400, malesPct: 6.2, femalesPct: 6.6 },
  { ageGroup: '0–6 Mo (Calves)', malesCount: 6100, femalesCount: 6800, malesPct: 4.3, femalesPct: 4.8 },
];

export function PopulationPyramidChart({
  cohorts = defaultCohorts,
  totalPopulation = 142260,
  title = 'National Cattle Demographics Pyramid',
  subtitle = 'Age-Sex Structure across Registered National Herd',
}: PopulationPyramidChartProps) {
  const maxPct = Math.max(
    ...cohorts.map((c) => Math.max(c.malesPct, c.femalesPct)),
    30
  );

  const totalMales = cohorts.reduce((sum, c) => sum + c.malesCount, 0);
  const totalFemales = cohorts.reduce((sum, c) => sum + c.femalesCount, 0);
  const maleOverallPct = ((totalMales / totalPopulation) * 100).toFixed(1);
  const femaleOverallPct = ((totalFemales / totalPopulation) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <h3 className="font-bold text-stone-900 text-sm">{title}</h3>
          <p className="text-xs text-stone-600 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
            <span className="font-medium text-stone-800">Males: {totalMales.toLocaleString()} ({maleOverallPct}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
            <span className="font-medium text-stone-800">Females: {totalFemales.toLocaleString()} ({femaleOverallPct}%)</span>
          </div>
        </div>
      </div>

      {/* Pyramid Rows */}
      <div className="py-4 space-y-2.5">
        {cohorts.map((cohort, index) => {
          const maleBarWidth = `${(cohort.malesPct / maxPct) * 100}%`;
          const femaleBarWidth = `${(cohort.femalesPct / maxPct) * 100}%`;

          return (
            <div key={index} className="grid grid-cols-12 items-center gap-2 text-xs">
              {/* Left: Male Bar */}
              <div className="col-span-5 flex items-center justify-end space-x-2">
                <span className="text-[11px] font-mono text-stone-600 tabular-nums hidden sm:inline">
                  {cohort.malesCount.toLocaleString()} ({cohort.malesPct}%)
                </span>
                <div className="w-full bg-stone-100 h-6 rounded-l-md flex items-center justify-end overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 hover:bg-indigo-700 transition-all rounded-l-md flex items-center justify-end px-2"
                    style={{ width: maleBarWidth }}
                  >
                    <span className="text-[10px] font-bold text-white sm:hidden">{cohort.malesPct}%</span>
                  </div>
                </div>
              </div>

              {/* Center: Cohort Label */}
              <div className="col-span-2 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block truncate px-1">
                  {cohort.ageGroup}
                </span>
              </div>

              {/* Right: Female Bar */}
              <div className="col-span-5 flex items-center justify-start space-x-2">
                <div className="w-full bg-stone-100 h-6 rounded-r-md flex items-center justify-start overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 hover:bg-emerald-700 transition-all rounded-r-md flex items-center justify-start px-2"
                    style={{ width: femaleBarWidth }}
                  >
                    <span className="text-[10px] font-bold text-white sm:hidden">{cohort.femalesPct}%</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-stone-600 tabular-nums hidden sm:inline">
                  {cohort.femalesCount.toLocaleString()} ({cohort.femalesPct}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Axis Description */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
        <span>◀ Left: Sires / Bulls / Steers</span>
        <span className="font-semibold text-stone-700">Cohort Sex-Ratio Equilibrium Index: 1.34 : 1</span>
        <span>Right: Breeding Cows / Replacements ▶</span>
      </div>
    </div>
  );
}
