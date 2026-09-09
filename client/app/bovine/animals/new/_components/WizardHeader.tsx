'use client';

import React from 'react';
import Link from 'next/link';
import { Layers } from 'lucide-react';

interface WizardHeaderProps {
  currentStep: number;
}

export function WizardHeader({ currentStep }: WizardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Livestock Enrollment Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Register New Livestock Record
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Step {currentStep} of 7 • Standardized identity, biosecurity pedigree & lineage mapping
        </p>
      </div>

      <Link
        href="/bovine/animals"
        className="text-xs font-semibold text-stone-500 hover:text-stone-800"
      >
        Cancel Enrollment
      </Link>
    </div>
  );
}
