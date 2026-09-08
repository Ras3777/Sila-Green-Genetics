'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Layers, Scale } from 'lucide-react';

interface WaterfallStep {
  label: string;
  type: 'OPENING' | 'ADDITION' | 'SUBTRACTION' | 'CLOSING';
  value: number;
  subtext: string;
}

const defaultSteps: WaterfallStep[] = [
  { label: 'Opening Inventory', type: 'OPENING', value: 136800, subtext: 'Beginning of period count' },
  { label: 'Registered Births', type: 'ADDITION', value: 14200, subtext: 'Birth registrations with ear tags' },
  { label: 'Inward Transit / Imports', type: 'ADDITION', value: 2100, subtext: 'Permitted incoming arrivals' },
  { label: 'Disease / Mortalities', type: 'SUBTRACTION', value: -4600, subtext: 'Reported farm deaths & culls' },
  { label: 'Certified Slaughters', type: 'SUBTRACTION', value: -5400, subtext: 'Abattoir throughput records' },
  { label: 'Outward Exports', type: 'SUBTRACTION', value: -840, subtext: 'Approved cross-border departures' },
  { label: 'Closing Net Inventory', type: 'CLOSING', value: 142260, subtext: 'Audited end of period count' },
];

export function PopulationGrowthWaterfall({
  steps = defaultSteps,
  title = 'National Cattle Inventory Reconciliation Waterfall',
  subtitle = 'Statutory Population Accounting Balance Sheet',
}: {
  steps?: WaterfallStep[];
  title?: string;
  subtitle?: string;
}) {
  const maxVal = 150000;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
        <div>
          <h3 className="font-bold text-stone-900 text-sm">{title}</h3>
          <p className="text-xs text-stone-600 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold">
            Net Change: +5,460 (+4.0%)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium">
            Turnover: 7.3%
          </span>
        </div>
      </div>

      {/* Waterfall Visual Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2.5 pt-2">
        {steps.map((step, idx) => {
          const isOpening = step.type === 'OPENING';
          const isClosing = step.type === 'CLOSING';
          const isAddition = step.type === 'ADDITION';
          const isSubtraction = step.type === 'SUBTRACTION';

          const colorClass = isOpening
            ? 'bg-stone-800 text-white border-stone-800'
            : isClosing
            ? 'bg-emerald-900 text-white border-emerald-900'
            : isAddition
            ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
            : 'bg-rose-50 text-rose-950 border-rose-200';

          const badgeColor = isOpening || isClosing
            ? 'bg-white/20 text-white'
            : isAddition
            ? 'bg-emerald-600 text-white'
            : 'bg-rose-600 text-white';

          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${colorClass}`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${badgeColor}`}>
                    {isAddition ? '+ INFLOW' : isSubtraction ? '- OUTFLOW' : 'BALANCE'}
                  </span>
                  <span className="text-[10px] opacity-75">#{idx + 1}</span>
                </div>
                <h4 className="font-bold text-xs mt-2 leading-tight">
                  {step.label}
                </h4>
              </div>

              <div className="mt-4">
                <div className="text-base lg:text-lg font-bold font-mono tabular-nums">
                  {step.value > 0 && !isOpening && !isClosing ? `+${step.value.toLocaleString()}` : step.value.toLocaleString()}
                </div>
                <p className="text-[10px] opacity-80 mt-0.5 line-clamp-2">
                  {step.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reconciliation Formula Footer */}
      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-600 gap-1">
        <span>Formula: Opening + (Births + Imports) - (Deaths + Slaughters + Exports) = Closing</span>
        <span className="font-mono text-emerald-800 font-semibold">Discrepancy Error Margin: 0.00% (Balanced)</span>
      </div>
    </div>
  );
}
