'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ReproStepProgressBarProps {
  step: number;
  setStep: (step: number) => void;
  procedureType: 'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER';
}

const STEPS = [
  { num: 1, label: 'Recipient Cow' },
  { num: 2, label: 'Donor Info' },
  { num: 3, label: 'Bull & Semen' },
  { num: 4, label: 'Embryo Info' },
  { num: 5, label: 'Synchronization' },
  { num: 6, label: 'AI / ET Service' },
  { num: 7, label: 'Review & Confirm' },
];

export function ReproStepProgressBar({
  step,
  setStep,
  procedureType,
}: ReproStepProgressBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[600px] space-x-2">
        {STEPS.map((s, idx) => {
          const isDone = s.num < step;
          const isCurrent = s.num === step;
          const isETOnly = (s.num === 2 || s.num === 4) && procedureType !== 'EMBRYO_TRANSFER';

          return (
            <React.Fragment key={s.num}>
              <button
                type="button"
                onClick={() => setStep(s.num)}
                disabled={isETOnly}
                className={`flex items-center space-x-2 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  isCurrent
                    ? 'text-emerald-900 bg-emerald-50 border border-emerald-300'
                    : isDone
                    ? 'text-stone-800'
                    : isETOnly
                    ? 'text-stone-300 line-through'
                    : 'text-stone-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone
                      ? 'bg-emerald-800 text-white'
                      : isCurrent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : s.num}
                </span>
                <span>{s.label}</span>
              </button>
              {idx < STEPS.length - 1 && <div className="h-px w-6 bg-stone-200 shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
