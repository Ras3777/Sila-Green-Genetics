'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NewListingControlsProps {
  step: number;
  setStep: (step: number) => void;
  onPublish: () => void;
}

export function NewListingControls({
  step,
  setStep,
  onPublish,
}: NewListingControlsProps) {
  return (
    <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
      {step > 1 ? (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
      ) : (
        <div />
      )}

      {step < 6 ? (
        <button
          type="button"
          onClick={() => setStep(step + 1)}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Next Step <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onPublish}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" /> Publish Listing
        </button>
      )}
    </div>
  );
}
