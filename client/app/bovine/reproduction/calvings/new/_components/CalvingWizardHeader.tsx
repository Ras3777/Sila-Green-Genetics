'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface CalvingWizardHeaderProps {
  onAddTwinCalf: () => void;
}

export function CalvingWizardHeader({ onAddTwinCalf }: CalvingWizardHeaderProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          Birth Event &amp; Newborn Registry
        </span>
        <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
          Register Calving &amp; Newborn Offspring
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Recording birth immediately generates canonical animal records for offspring, links dam and sire parentage, and transitions maternity states.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddTwinCalf}
        className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
      >
        <Plus className="w-4 h-4 text-emerald-700" />
        <span>Add Twin Calf</span>
      </button>
    </div>
  );
}
