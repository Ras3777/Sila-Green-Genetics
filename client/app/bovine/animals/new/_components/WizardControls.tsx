'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface WizardControlsProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isBreedValid: boolean;
  onFinalSubmit: () => void;
}

export function WizardControls({
  currentStep,
  setCurrentStep,
  isBreedValid,
  onFinalSubmit,
}: WizardControlsProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      ) : <div />}

      {currentStep < 7 ? (
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => prev + 1)}
          className="inline-flex items-center space-x-1 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          id="btn-submit-new-animal"
          type="button"
          disabled={!isBreedValid}
          onClick={onFinalSubmit}
          className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Complete & Enroll Animal</span>
        </button>
      )}
    </div>
  );
}
