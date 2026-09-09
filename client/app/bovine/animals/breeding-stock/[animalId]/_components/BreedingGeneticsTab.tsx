'use client';

import React from 'react';
import { Dna } from 'lucide-react';

export function BreedingGeneticsTab() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <Dna className="w-5 h-5 text-emerald-700" />
            <span>Expected Progeny Differences (EPD) &amp; DECA Scores</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Official National Cattle Evaluation (NCE) estimates and accuracies.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-mono font-bold">
          Run: 2026-Q1-BLUP
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
              <th className="py-2.5 px-3">Trait</th>
              <th className="py-2.5 px-3">EPD Value</th>
              <th className="py-2.5 px-3">Accuracy (Acc)</th>
              <th className="py-2.5 px-3">DECA Score</th>
              <th className="py-2.5 px-3">Percentile Rank</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            <tr>
              <td className="py-2.5 px-3 font-semibold text-stone-800">Calving Ease Direct (CED)</td>
              <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">+12</td>
              <td className="py-2.5 px-3 font-mono text-stone-600">0.78</td>
              <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 1</td>
              <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 5%</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-stone-800">Birth Weight (BW)</td>
              <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">-0.8 kg</td>
              <td className="py-2.5 px-3 font-mono text-stone-600">0.85</td>
              <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 2</td>
              <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 10%</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-stone-800">Weaning Weight (WW)</td>
              <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">+78 kg</td>
              <td className="py-2.5 px-3 font-mono text-stone-600">0.81</td>
              <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 1</td>
              <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 3%</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-stone-800">Yearling Weight (YW)</td>
              <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">+136 kg</td>
              <td className="py-2.5 px-3 font-mono text-stone-600">0.79</td>
              <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 1</td>
              <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 2%</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-stone-800">Scrotal Circumference (SC)</td>
              <td className="py-2.5 px-3 font-mono font-bold text-stone-900">+1.65 cm</td>
              <td className="py-2.5 px-3 font-mono text-stone-600">0.72</td>
              <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 2</td>
              <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 8%</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-stone-800">Marbling (MARB)</td>
              <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">+1.12</td>
              <td className="py-2.5 px-3 font-mono text-stone-600">0.74</td>
              <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 1</td>
              <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 1%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
