'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  TrendingUp,
  Milk,
  Scale,
  ArrowLeft,
  Calendar,
  BarChart2,
  Sparkles,
  Info,
} from 'lucide-react';

export default function BovineProductionTrendsPage() {
  const {
    session,
    farms,
    animals,
    productionRecords,
  } = useBovine();

  const [metricMode, setMetricMode] = useState<'DAIRY' | 'BEEF'>('DAIRY');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <Link href="/bovine/production" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Production Hub</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Yield & Growth Curves</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Production Analytics & Benchmarks</h1>
          <p className="text-xs text-stone-500 mt-1">
            Lactation persistency trajectories, component yield ratios, and beef weight gain curves.
          </p>
        </div>

        <div className="flex items-center p-1 bg-stone-100 rounded-2xl">
          <button
            onClick={() => setMetricMode('DAIRY')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              metricMode === 'DAIRY'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Dairy Lactation Curves
          </button>
          <button
            onClick={() => setMetricMode('BEEF')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              metricMode === 'BEEF'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Beef Weight Trajectories
          </button>
        </div>
      </div>

      {metricMode === 'DAIRY' ? (
        <div className="space-y-6">
          {/* Lactation Curve Benchmark Box */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900">Standard 305-Day Lactation Curve Model</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Herd average milk production (kg/day) by Days in Milk (DIM) vs peak persistency benchmark.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                Persistency 94.2%
              </span>
            </div>

            {/* Visual Bar Representation */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-10 gap-2 h-44 items-end border-b border-stone-200 pb-2">
                {[
                  { dim: '30d', kg: 42.5, height: '85%' },
                  { dim: '60d', kg: 48.2, height: '98%', peak: true },
                  { dim: '90d', kg: 46.0, height: '92%' },
                  { dim: '120d', kg: 43.8, height: '87%' },
                  { dim: '150d', kg: 40.5, height: '81%' },
                  { dim: '180d', kg: 37.0, height: '74%' },
                  { dim: '210d', kg: 34.2, height: '68%' },
                  { dim: '240d', kg: 31.0, height: '62%' },
                  { dim: '270d', kg: 27.5, height: '55%' },
                  { dim: '305d', kg: 23.0, height: '46%' },
                ].map((point, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      {point.kg}k
                    </span>
                    <div
                      style={{ height: point.height }}
                      className={`w-full rounded-t-xl transition-all ${
                        point.peak
                          ? 'bg-emerald-800 shadow-xs'
                          : 'bg-emerald-200/80 group-hover:bg-emerald-400'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-stone-500 mt-2">{point.dim}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded bg-emerald-800 mr-1.5" /> Peak Production (DIM 60)
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded bg-emerald-200 mr-1.5" /> Normal Persistency Drop (6-8%/mo)
                </span>
              </div>
              <span className="font-mono text-stone-700 font-semibold">Herd 305d Projected: 11,450 kg</span>
            </div>
          </div>

          {/* Component Ratios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">Fat-to-Protein Ratio (FPR)</h3>
              <p className="text-xs text-stone-500">
                Current herd ratio is <strong className="text-stone-900 font-mono">1.19</strong> (Optimal range: 1.15 – 1.25). Indicates healthy ruminal fiber digestion with no subacute acidosis risk.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">Bulk Tank Somatic Cell Count (SCC)</h3>
              <p className="text-xs text-stone-500">
                30-day geometric average: <strong className="text-emerald-800 font-mono font-bold">118,000 / mL</strong>. Premium milk quality tier with 98.4% udder quarters uninfected.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Beef Growth Curve Benchmark Box */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900">Beef Cohort Weight Progression & Target</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Body weight progression from birth to 400-day harvest finish.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">
                ADG 1.48 kg/d
              </span>
            </div>

            <div className="pt-4 pb-2">
              <div className="grid grid-cols-8 gap-3 h-44 items-end border-b border-stone-200 pb-2">
                {[
                  { stage: 'Birth', wt: 39, height: '15%' },
                  { stage: '60d', wt: 110, height: '28%' },
                  { stage: 'Wean (205d)', wt: 285, height: '52%' },
                  { stage: '270d', wt: 380, height: '65%' },
                  { stage: 'Yearling', wt: 480, height: '80%' },
                  { stage: '400d Finish', wt: 610, height: '96%', peak: true },
                ].map((point, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      {point.wt}kg
                    </span>
                    <div
                      style={{ height: point.height }}
                      className={`w-full rounded-t-xl transition-all ${
                        point.peak
                          ? 'bg-blue-800 shadow-xs'
                          : 'bg-blue-200/80 group-hover:bg-blue-400'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-stone-500 mt-2 text-center">{point.stage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
              <span>Target Finish Target: 600 - 640 kg</span>
              <span className="font-mono text-stone-700 font-semibold">Residual Feed Intake (RFI): -0.42 kg/d (Superior)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
