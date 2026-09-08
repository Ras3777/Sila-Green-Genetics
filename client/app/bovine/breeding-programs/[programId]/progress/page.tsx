'use client';

import React, { useState, use } from 'react';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { ProgramHeaderNav } from '../program-nav';
import { TrendingUp, Award, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ProgramProgressPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;

  const { breedingPrograms } = useBreeding();
  const program = breedingPrograms.find((p) => p.id === programId);

  const [selectedTrait, setSelectedTrait] = useState<'INDEX' | 'MILK' | 'FAT' | 'STAYABILITY'>('INDEX');

  if (!program) return <div className="p-8 text-center text-stone-500">Program Not Found</div>;

  // Annual genetic trend data points
  const annualTrends = [
    { year: 2021, index: 610, milk: 120, fat: 8.5, stayability: 68.2, inbreeding: 3.1 },
    { year: 2022, index: 665, milk: 195, fat: 12.1, stayability: 70.1, inbreeding: 3.3 },
    { year: 2023, index: 720, milk: 280, fat: 16.4, stayability: 71.9, inbreeding: 3.5 },
    { year: 2024, index: 785, milk: 360, fat: 21.0, stayability: 73.4, inbreeding: 3.7 },
    { year: 2025, index: 840, milk: 445, fat: 25.8, stayability: 75.1, inbreeding: 3.8 },
    { year: 2026, index: 895, milk: 520, fat: 30.2, stayability: 76.8, inbreeding: 3.9 },
  ];

  const minVal = selectedTrait === 'INDEX' ? 500 : selectedTrait === 'MILK' ? 50 : selectedTrait === 'FAT' ? 0 : 60;
  const maxVal = selectedTrait === 'INDEX' ? 1000 : selectedTrait === 'MILK' ? 600 : selectedTrait === 'FAT' ? 35 : 85;

  const annualGain = +(
    (annualTrends[annualTrends.length - 1].index - annualTrends[0].index) /
    (annualTrends.length - 1)
  ).toFixed(1);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <ProgramHeaderNav program={program} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Genetic Gain &amp; Population Trends</h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Realized annual genetic progress across generations and monitored consanguinity rate (&Delta;F) for {program.name}.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-stone-200 shadow-xs text-xs">
          <button
            onClick={() => setSelectedTrait('INDEX')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedTrait === 'INDEX'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Index Points
          </button>
          <button
            onClick={() => setSelectedTrait('MILK')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedTrait === 'MILK'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Milk Yield (kg)
          </button>
          <button
            onClick={() => setSelectedTrait('FAT')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedTrait === 'FAT'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Fat (kg)
          </button>
          <button
            onClick={() => setSelectedTrait('STAYABILITY')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedTrait === 'STAYABILITY'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Stayability (%)
          </button>
        </div>
      </div>

      {/* Gain Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Annual Genetic Gain (&Delta;G)</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1 flex items-center space-x-1">
            <span>+{annualGain}</span>
            <span className="text-xs font-normal text-stone-500">pts/yr</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Exceeding 2.1% population goal</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Inbreeding Accumulation (&Delta;F)</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            +0.16% <span className="text-xs font-normal text-stone-500">/yr</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Safe below FAO 0.5% limit</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Generation Interval (L)</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">2.35 yrs</div>
          <div className="text-[11px] text-stone-500 mt-1">Accelerated via genomic selection</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Evaluation Reference Base</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">2020 Fixed</div>
          <div className="text-[11px] text-stone-500 mt-1">Zero-centered on 2020 cow cohort</div>
        </div>
      </div>

      {/* Clean SVG Trend Chart */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Trend Line: {selectedTrait === 'INDEX' ? 'Selection Index Points' : selectedTrait} (2021 – 2026)
          </h3>
          <span className="text-xs text-stone-500">GBLUP Evaluation Normalized</span>
        </div>

        <div className="w-full h-64 relative flex items-end justify-between pt-8 pb-6 px-4">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-6 border-b border-stone-200 text-[10px] text-stone-400">
            <div className="border-b border-stone-100 w-full flex justify-between pr-2">
              <span>{maxVal}</span>
            </div>
            <div className="border-b border-stone-100 w-full flex justify-between pr-2">
              <span>{Math.round((maxVal + minVal) / 2)}</span>
            </div>
            <div className="w-full flex justify-between pr-2">
              <span>{minVal}</span>
            </div>
          </div>

          {/* Trend Data Columns */}
          {annualTrends.map((pt) => {
            const val =
              selectedTrait === 'INDEX'
                ? pt.index
                : selectedTrait === 'MILK'
                ? pt.milk
                : selectedTrait === 'FAT'
                ? pt.fat
                : pt.stayability;

            const heightPct = Math.min(100, Math.max(10, ((val - minVal) / (maxVal - minVal)) * 100));

            return (
              <div key={pt.year} className="flex flex-col items-center z-10 w-16">
                <div className="text-[11px] font-mono font-bold text-emerald-900 mb-1.5">{val}</div>
                <div className="w-9 bg-emerald-100 border border-emerald-300 rounded-t-lg relative transition-all duration-300 hover:bg-emerald-200 flex flex-col justify-end" style={{ height: `${heightPct * 1.8}px` }}>
                  <div
                    className="w-full bg-emerald-800 rounded-t-md"
                    style={{ height: `${heightPct * 0.7}px` }}
                  />
                </div>
                <div className="text-xs font-semibold text-stone-700 mt-2">{pt.year}</div>
                <div className="text-[10px] text-stone-400">F: {pt.inbreeding}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
