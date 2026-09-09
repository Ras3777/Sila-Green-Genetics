'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface SectionOvarianEvaluationProps {
  clQuality: string;
  onClQualityChange: (v: string) => void;
  clSide: 'LEFT' | 'RIGHT';
  onClSideChange: (v: 'LEFT' | 'RIGHT') => void;
  clDiameterMm: string;
  onClDiameterMmChange: (v: string) => void;
  gestationStatus: 'OPEN' | 'CONFIRMED_PREGNANT' | 'SUSPECT';
  onGestationStatusChange: (v: 'OPEN' | 'CONFIRMED_PREGNANT' | 'SUSPECT') => void;
}

export function SectionOvarianEvaluation({
  clQuality,
  onClQualityChange,
  clSide,
  onClSideChange,
  clDiameterMm,
  onClDiameterMmChange,
  gestationStatus,
  onGestationStatusChange,
}: SectionOvarianEvaluationProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-700" />
        <span>Section C: Ovarian &amp; Corpus Luteum (CL) Evaluation</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            CL Morphological Quality
          </label>
          <select
            value={clQuality}
            onChange={(e) => onClQualityChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="Grade 1 (Excellent / >20mm)">Grade 1 (Excellent / &gt;20mm)</option>
            <option value="Grade 2 (Good / 16-20mm)">Grade 2 (Good / 16-20mm)</option>
            <option value="Grade 3 (Marginal / <16mm)">Grade 3 (Marginal / &lt;16mm)</option>
            <option value="Cavitary CL">Cavitary CL (Fluid-filled)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            CL Ovary Side
          </label>
          <select
            value={clSide}
            onChange={(e) => onClSideChange(e.target.value as 'LEFT' | 'RIGHT')}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
          >
            <option value="RIGHT">Right Ovary</option>
            <option value="LEFT">Left Ovary</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            CL Diameter (mm)
          </label>
          <input
            type="number"
            step="0.1"
            value={clDiameterMm}
            onChange={(e) => onClDiameterMmChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Gestation Status
          </label>
          <select
            value={gestationStatus}
            onChange={(e) => onGestationStatusChange(e.target.value as any)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold"
          >
            <option value="OPEN">Open (Ready for ET Transfer)</option>
            <option value="CONFIRMED_PREGNANT">Confirmed Pregnant</option>
            <option value="SUSPECT">Suspect / Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
