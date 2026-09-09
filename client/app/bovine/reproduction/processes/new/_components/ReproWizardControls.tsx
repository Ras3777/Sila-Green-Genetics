'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface ReproWizardControlsProps {
  step: number;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export function ReproWizardControls({
  step,
  onPrevStep,
  onNextStep,
}: ReproWizardControlsProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      {step > 1 ? (
        <button
          type="button"
          onClick={onPrevStep}
          className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>
      ) : (
        <div />
      )}

      {step < 7 ? (
        <button
          type="button"
          onClick={onNextStep}
          className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>Next Step</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Check className="w-4 h-4" />
          <span>Confirm &amp; Register Process</span>
        </button>
      )}
    </div>
  );
}
