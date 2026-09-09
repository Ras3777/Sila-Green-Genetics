'use client';

import React from 'react';
import { Calculator } from 'lucide-react';

interface StepGeneticsEpdsProps {
  betaCasein: string;
  setBetaCasein: (val: string) => void;
  kappaCasein: string;
  setKappaCasein: (val: string) => void;
  betaLactoglobulin: string;
  setBetaLactoglobulin: (val: string) => void;
  bwEpd: string;
  setBwEpd: (val: string) => void;
  bwAcc: string;
  setBwAcc: (val: string) => void;
  bwDeca: string;
  wwEpd: string;
  setWwEpd: (val: string) => void;
  wwAcc: string;
  setWwAcc: (val: string) => void;
  wwDeca: string;
  ywEpd: string;
  setYwEpd: (val: string) => void;
  ywAcc: string;
  setYwAcc: (val: string) => void;
  ywDeca: string;
  reaEpd: string;
  setReaEpd: (val: string) => void;
  reaAcc: string;
  setReaAcc: (val: string) => void;
}

export function StepGeneticsEpds({
  betaCasein,
  setBetaCasein,
  kappaCasein,
  setKappaCasein,
  betaLactoglobulin,
  setBetaLactoglobulin,
  bwEpd,
  setBwEpd,
  bwAcc,
  setBwAcc,
  bwDeca,
  wwEpd,
  setWwEpd,
  wwAcc,
  setWwAcc,
  wwDeca,
  ywEpd,
  setYwEpd,
  ywAcc,
  setYwAcc,
  ywDeca,
  reaEpd,
  setReaEpd,
  reaAcc,
  setReaAcc,
}: StepGeneticsEpdsProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-5">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Calculator className="w-4 h-4 text-amber-700" />
        <span>Step 6 — Dairy Breeding Traits &amp; EPD / ACC / DECA Table</span>
      </div>

      {/* Protein & Milk Markers */}
      <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
        <div className="font-bold text-xs text-stone-900">Protein Variants &amp; Milk Markers</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Beta-Casein</label>
            <select
              value={betaCasein}
              onChange={(e) => setBetaCasein(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-mono font-bold"
            >
              <option value="A2A2">A2A2 (Homozygous Prime)</option>
              <option value="A1A2">A1A2 (Heterozygous)</option>
              <option value="A1A1">A1A1</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Kappa-Casein</label>
            <select
              value={kappaCasein}
              onChange={(e) => setKappaCasein(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-mono font-bold"
            >
              <option value="BB">BB (Superior Cheese Yield)</option>
              <option value="AB">AB</option>
              <option value="AA">AA</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Beta-Lactoglobulin</label>
            <select
              value={betaLactoglobulin}
              onChange={(e) => setBetaLactoglobulin(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-mono font-bold"
            >
              <option value="AB">AB</option>
              <option value="AA">AA</option>
              <option value="BB">BB</option>
            </select>
          </div>
        </div>
      </div>

      {/* EPD / ACC / DECA Table */}
      <div className="space-y-2">
        <div className="font-bold text-xs text-stone-900">Estimated Progeny Differences (EPDs)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-stone-200 rounded-xl">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase">
                <th className="py-2.5 px-3">Trait</th>
                <th className="py-2.5 px-3">EPD Value</th>
                <th className="py-2.5 px-3">Accuracy (ACC)</th>
                <th className="py-2.5 px-3">Percentile / DECA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="py-2 px-3 font-semibold">BW (Birth Weight)</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={bwEpd}
                    onChange={(e) => setBwEpd(e.target.value)}
                    className="w-24 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={bwAcc}
                    onChange={(e) => setBwAcc(e.target.value)}
                    className="w-20 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </td>
                <td className="py-2 px-3 font-semibold text-emerald-800">{bwDeca}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">WW (Weaning Weight)</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={wwEpd}
                    onChange={(e) => setWwEpd(e.target.value)}
                    className="w-24 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={wwAcc}
                    onChange={(e) => setWwAcc(e.target.value)}
                    className="w-20 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </td>
                <td className="py-2 px-3 font-semibold text-emerald-800">{wwDeca}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">YW (Yearling Weight)</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={ywEpd}
                    onChange={(e) => setYwEpd(e.target.value)}
                    className="w-24 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={ywAcc}
                    onChange={(e) => setYwAcc(e.target.value)}
                    className="w-20 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </td>
                <td className="py-2 px-3 font-semibold text-emerald-800">{ywDeca}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">REA (Ribeye Area)</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={reaEpd}
                    onChange={(e) => setReaEpd(e.target.value)}
                    className="w-24 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={reaAcc}
                    onChange={(e) => setReaAcc(e.target.value)}
                    className="w-20 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </td>
                <td className="py-2 px-3 font-semibold text-emerald-800">Top 10%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
