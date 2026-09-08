'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import {
  TrendingUp,
  BarChart3,
  Dna,
  ShieldCheck,
  Download,
  Calendar,
  AlertTriangle,
  Activity,
  Layers,
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const { breedingPrograms } = useBreeding();
  const [selectedProgramId, setSelectedProgramId] = useState(breedingPrograms[0]?.id || '');

  // Year trends data
  const yearlyTrends = [
    { year: 2021, milkKg: 280, fatKg: 12.4, proteinKg: 9.8, inbreedingF: 2.1, ne: 92, carrierRate: 4.8 },
    { year: 2022, milkKg: 340, fatKg: 15.2, proteinKg: 12.1, inbreedingF: 2.5, ne: 88, carrierRate: 4.1 },
    { year: 2023, milkKg: 410, fatKg: 18.9, proteinKg: 14.6, inbreedingF: 2.9, ne: 84, carrierRate: 3.2 },
    { year: 2024, milkKg: 490, fatKg: 22.8, proteinKg: 17.5, inbreedingF: 3.2, ne: 82, carrierRate: 2.5 },
    { year: 2025, milkKg: 580, fatKg: 27.1, proteinKg: 20.8, inbreedingF: 3.5, ne: 79, carrierRate: 1.8 },
    { year: 2026, milkKg: 670, fatKg: 31.4, proteinKg: 24.2, inbreedingF: 3.8, ne: 77, carrierRate: 1.2 },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Strategic Population Genetics &amp; Analytics • Phase 4</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Breeding Intelligence &amp; Analytics</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Monitor population genetic gain, effective population size (Ne), inbreeding accumulation, and trait correlations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            className="text-xs border border-stone-300 rounded-xl px-3 py-2.5 bg-white font-semibold shadow-xs"
          >
            {breedingPrograms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              const headers = 'Year,MilkKg,FatKg,ProteinKg,InbreedingF,EffectiveNe,CarrierRate\n';
              const rows = yearlyTrends
                .map((y) => `${y.year},${y.milkKg},${y.fatKg},${y.proteinKg},${y.inbreedingF}%,${y.ne},${y.carrierRate}%`)
                .join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'genetic_trends_population.csv';
              a.click();
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>Export Analytics Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">5-Year Genetic Gain (Milk)</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">+390 kg</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">+78 kg/year annual progress</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Effective Population Size (Ne)</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">77</div>
          <div className="text-[11px] text-stone-500 mt-1">Sustainable threshold &gt; 50</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Annual &Delta;F Inbreeding Rate</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">+0.34%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Below 0.50% ceiling</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Lethal Carrier Frequency</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">1.2%</div>
          <div className="text-[11px] text-stone-500 mt-1">Down from 4.8% in 2021</div>
        </div>
      </div>

      {/* Population Trends Chart Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Annual Population Genetic Gain &amp; Diversity Trajectory
          </h2>
          <span className="text-xs text-stone-500">Standardized Base Year 2020 = 0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="p-3.5">Cohort Year</th>
                <th className="p-3.5 font-mono">Milk EBV (kg)</th>
                <th className="p-3.5 font-mono">Fat EBV (kg)</th>
                <th className="p-3.5 font-mono">Protein EBV (kg)</th>
                <th className="p-3.5 font-mono">Inbreeding (F)</th>
                <th className="p-3.5 font-mono">Effective Ne</th>
                <th className="p-3.5 font-mono">Carrier Rate</th>
                <th className="p-3.5 w-48">Gain Visualization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {yearlyTrends.map((t) => (
                <tr key={t.year} className="hover:bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-900">{t.year}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-900">+{t.milkKg} kg</td>
                  <td className="p-3.5 font-mono">+{t.fatKg} kg</td>
                  <td className="p-3.5 font-mono">+{t.proteinKg} kg</td>
                  <td className="p-3.5 font-mono text-stone-800">{t.inbreedingF}%</td>
                  <td className="p-3.5 font-mono text-stone-800">{t.ne}</td>
                  <td className="p-3.5 font-mono text-emerald-800 font-semibold">{t.carrierRate}%</td>
                  <td className="p-3.5">
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-800 h-full rounded-full"
                        style={{ width: `${(t.milkKg / 700) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trait Correlations & Genetic Diversity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trait correlation matrix */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Genetic Correlation Matrix (r_g)
          </h2>
          <p className="text-xs text-stone-500">
            Population-level pleiotropy and antagonistic trait dynamics.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-stone-900">Milk Yield &times; Fat Yield</span>
                <div className="text-[11px] text-stone-500">Strong positive genetic correlation</div>
              </div>
              <span className="font-mono font-bold text-emerald-800">+0.72</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-stone-900">Milk Yield &times; Somatic Cell Score (SCS)</span>
                <div className="text-[11px] text-stone-500">Slight antagonistic correlation (requires index balancing)</div>
              </div>
              <span className="font-mono font-bold text-amber-700">+0.18</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-stone-900">Milk Yield &times; Daughter Pregnancy Rate (DPR)</span>
                <div className="text-[11px] text-stone-500">Historical negative correlation managed by Selection Index</div>
              </div>
              <span className="font-mono font-bold text-stone-600">-0.24</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-stone-900">Productive Life &times; Livability</span>
                <div className="text-[11px] text-stone-500">High synergistic longevity correlation</div>
              </div>
              <span className="font-mono font-bold text-emerald-800">+0.84</span>
            </div>
          </div>
        </div>

        {/* Sire Dominance & Diversity Risk */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Sire Utilization Diversity &amp; Herfindahl Index
          </h2>
          <p className="text-xs text-stone-500">
            Monitoring sire concentration to avoid genetic bottlenecks.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">Top 3 Sires Share of Matings:</span>
                <span className="font-bold text-stone-900">28.4%</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div className="bg-emerald-800 h-full rounded-full" style={{ width: '28.4%' }} />
              </div>
              <div className="text-[10px] text-stone-400">Policy ceiling is &le; 35% to protect genetic variation.</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">Herfindahl-Hirschman Index (HHI):</span>
                <span className="font-mono font-bold text-emerald-800">412 (Low Risk)</span>
              </div>
              <div className="text-[11px] text-stone-500">
                Well-distributed pedigree usage across multiple independent ancestral founder lines.
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800 mt-0.5" />
              <div className="text-[11px] text-emerald-950">
                <strong>Genetic Health Status:</strong> Carrier eradication protocols have reduced active carrier cows by 75% over 5 years.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
