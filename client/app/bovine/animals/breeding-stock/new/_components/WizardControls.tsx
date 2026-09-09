'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
}

export function WizardControls({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
}: WizardControlsProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      ) : (
        <Link
          href="/bovine/animals/breeding-stock"
          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
        >
          Cancel
        </Link>
      )}

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          Confirm &amp; Register Breeding Stock
        </button>
      )}
    </div>
  );
}
