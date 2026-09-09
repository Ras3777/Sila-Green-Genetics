'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Step {
  num: number;
  label: string;
}

interface WizardStepIndicatorProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export function WizardStepIndicator({
  steps,
  currentStep,
  setCurrentStep,
}: WizardStepIndicatorProps) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs overflow-x-auto">
      <div className="flex items-center justify-between min-w-[640px] px-2">
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <button
              type="button"
              onClick={() => setCurrentStep(step.num)}
              className="flex items-center space-x-2 group text-left cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === step.num
                    ? 'bg-amber-600 text-white shadow-xs'
                    : currentStep > step.num
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {currentStep > step.num ? <CheckCircle2 className="w-4 h-4" /> : step.num}
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  currentStep === step.num ? 'text-amber-900' : 'text-stone-500 group-hover:text-stone-800'
                }`}
              >
                {step.label}
              </span>
            </button>
            {idx < steps.length - 1 && <div className="w-6 h-0.5 bg-stone-200" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
