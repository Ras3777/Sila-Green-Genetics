'use client';

import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

interface StepEmbryoInfoProps {
  procedureType: 'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER';
  embryoCode: string;
  setEmbryoCode: (code: string) => void;
  embryoBreed: string;
  setEmbryoBreed: (breed: string) => void;
  embryoStage: string;
  setEmbryoStage: (stage: string) => void;
  embryoGrade: string;
  setEmbryoGrade: (grade: string) => void;
  embryoPreservation: 'FRESH' | 'FROZEN';
  setEmbryoPreservation: (preservation: 'FRESH' | 'FROZEN') => void;
  onProceedToSync: () => void;
}

export function StepEmbryoInfo({
  procedureType,
  embryoCode,
  setEmbryoCode,
  embryoBreed,
  setEmbryoBreed,
  embryoStage,
  setEmbryoStage,
  embryoGrade,
  setEmbryoGrade,
  embryoPreservation,
  setEmbryoPreservation,
  onProceedToSync,
}: StepEmbryoInfoProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-700" />
        <span>Step 4: Embryo Information (Cryo &amp; Morphological Quality)</span>
      </h2>

      {procedureType === 'ARTIFICIAL_INSEMINATION' ? (
        <div className="p-6 text-center text-stone-500 space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto text-stone-400" />
          <p className="text-xs">
            Embryo data is only applicable for Embryo Transfer (ET) procedures.
          </p>
          <button
            type="button"
            onClick={onProceedToSync}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
          >
            Proceed to Step 5: Synchronization &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Embryo Barcode / Code *
            </label>
            <input
              type="text"
              value={embryoCode}
              onChange={(e) => setEmbryoCode(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Embryo Breed Purity
            </label>
            <input
              type="text"
              value={embryoBreed}
              onChange={(e) => setEmbryoBreed(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              IETS Stage (1-9)
            </label>
            <input
              type="text"
              value={embryoStage}
              onChange={(e) => setEmbryoStage(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              IETS Quality Grade (1-4)
            </label>
            <input
              type="text"
              value={embryoGrade}
              onChange={(e) => setEmbryoGrade(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Preservation Method
            </label>
            <select
              value={embryoPreservation}
              onChange={(e) => setEmbryoPreservation(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            >
              <option value="FROZEN">Frozen / Vitrified (Liquid N2)</option>
              <option value="FRESH">Fresh Transfer (Direct)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
