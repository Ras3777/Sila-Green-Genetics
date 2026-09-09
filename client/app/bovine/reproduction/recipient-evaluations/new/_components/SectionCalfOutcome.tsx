'use client';

import React from 'react';
import { Award } from 'lucide-react';

interface SectionCalfOutcomeProps {
  calfOutcome: string;
  onCalfOutcomeChange: (v: string) => void;
}

export function SectionCalfOutcome({
  calfOutcome,
  onCalfOutcomeChange,
}: SectionCalfOutcomeProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Award className="w-5 h-5 text-emerald-700" />
        <span>Section D: Maternal &amp; Calf Outcome Track Record</span>
      </h2>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          Historical Calving, Colostrum Quality &amp; Nursing Instinct
        </label>
        <textarea
          value={calfOutcome}
          onChange={(e) => onCalfOutcomeChange(e.target.value)}
          rows={2}
          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
        />
      </div>
    </div>
  );
}
