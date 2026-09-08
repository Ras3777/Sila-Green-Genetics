'use client';

import React from 'react';
import { Heart, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FunnelStage {
  stage: string;
  count: number;
  ratePct: number;
  conversionFromPrior: number;
  lossCount: number;
  statutoryStandard: number;
}

const defaultStages: FunnelStage[] = [
  { stage: 'Eligible Breeding Females', count: 68000, ratePct: 100, conversionFromPrior: 100, lossCount: 0, statutoryStandard: 100 },
  { stage: 'Insemination / Service Incurred', count: 54400, ratePct: 80.0, conversionFromPrior: 80.0, lossCount: 13600, statutoryStandard: 85.0 },
  { stage: 'Conception (21d Non-Return)', count: 36990, ratePct: 54.4, conversionFromPrior: 68.0, lossCount: 17410, statutoryStandard: 65.0 },
  { stage: 'Confirmed Pregnancy (60d)', count: 32920, ratePct: 48.4, conversionFromPrior: 89.0, lossCount: 4070, statutoryStandard: 90.0 },
  { stage: 'Full-Term Viable Calving', count: 30610, ratePct: 45.0, conversionFromPrior: 93.0, lossCount: 2310, statutoryStandard: 94.0 },
  { stage: '90-Day Calf Weaned Survival', count: 29080, ratePct: 42.8, conversionFromPrior: 95.0, lossCount: 1530, statutoryStandard: 96.0 },
];

export function ReproductiveFunnelChart({
  stages = defaultStages,
  title = 'National Reproductive Cascade & Conversion Funnel',
  subtitle = 'Statutory Breeding Milestones from Insemination to Weaning',
}: {
  stages?: FunnelStage[];
  title?: string;
  subtitle?: string;
}) {
  const maxCount = stages[0]?.count || 1;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
        <div>
          <h3 className="font-bold text-stone-900 text-sm">{title}</h3>
          <p className="text-xs text-stone-600 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
            Overall Conversion: 42.8%
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-semibold">
            Calf Loss Rate: 5.0%
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {stages.map((stage, idx) => {
          const widthPct = (stage.count / maxCount) * 100;
          const meetsStandard = stage.conversionFromPrior >= stage.statutoryStandard;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-stone-900">{stage.stage}</span>
                </div>
                <div className="flex items-center space-x-3 text-right">
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    {stage.count.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-stone-600">
                    ({stage.ratePct.toFixed(1)}% of eligible)
                  </span>
                  {idx > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        meetsStandard ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                      title={`Target Standard: ${stage.statutoryStandard}%`}
                    >
                      {stage.conversionFromPrior.toFixed(1)}% conv
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Funnel Bar */}
              <div className="w-full bg-stone-100 h-6 rounded-lg overflow-hidden flex items-center relative">
                <div
                  className="h-full bg-gradient-to-r from-emerald-700 to-emerald-600 transition-all rounded-lg flex items-center px-3"
                  style={{ width: `${Math.max(widthPct, 12)}%` }}
                >
                  <span className="text-[10px] font-bold text-white tracking-wide">
                    {stage.count.toLocaleString()}
                  </span>
                </div>
                {idx > 0 && stage.lossCount > 0 && (
                  <span className="absolute right-3 text-[10px] text-stone-600 font-mono">
                    Drop-off loss: -{stage.lossCount.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-600 flex items-center justify-between">
        <span>Standard: National Livestock Breeding Policy Guideline Sec 4.2</span>
        <span className="text-emerald-800 font-semibold">Reproductive Efficiency Index: 88.4 / 100</span>
      </div>
    </div>
  );
}
