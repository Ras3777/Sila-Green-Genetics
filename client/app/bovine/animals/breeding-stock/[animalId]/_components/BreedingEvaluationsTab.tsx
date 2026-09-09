'use client';

import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export function BreedingEvaluationsTab() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
        <span>Historical Genetic Evaluation Runs</span>
      </h3>

      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-stone-900">2026-Q1 National Single-Step GBLUP</div>
            <div className="text-xs text-stone-500">Run completed 2026-02-15 • Base Reference Population: 42,000 head</div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
            $B +168.4
          </span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-stone-900">2025-Q4 National Single-Step GBLUP</div>
            <div className="text-xs text-stone-500">Run completed 2025-11-20 • Base Reference Population: 40,500 head</div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-stone-200 text-stone-800 font-mono text-xs font-bold">
            $B +165.2
          </span>
        </div>
      </div>
    </div>
  );
}
