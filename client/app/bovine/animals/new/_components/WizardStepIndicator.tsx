'use client';

import React from 'react';

interface WizardStepIndicatorProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const STEPS = [
  { step: 1, label: 'Identity' },
  { step: 2, label: 'Identifiers' },
  { step: 3, label: 'Placement' },
  { step: 4, label: 'Breeds' },
  { step: 5, label: 'Pedigree' },
  { step: 6, label: 'Media' },
  { step: 7, label: 'Review' },
];

export function WizardStepIndicator({
  currentStep,
  setCurrentStep,
}: WizardStepIndicatorProps) {
  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {STEPS.map((s) => (
        <button
          key={s.step}
          onClick={() => setCurrentStep(s.step)}
          className={`p-2 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
            currentStep === s.step
              ? 'bg-emerald-800 text-white shadow-xs'
              : currentStep > s.step
              ? 'bg-emerald-100 text-emerald-900'
              : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
          }`}
        >
          <div className="hidden sm:block text-[10px] uppercase tracking-wider opacity-80">Step {s.step}</div>
          <div className="truncate">{s.label}</div>
        </button>
      ))}
    </div>
  );
}
