'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export function RecipientEvaluationActions() {
  return (
    <div className="flex items-center justify-end space-x-3">
      <Link
        href="/bovine/reproduction/recipient-evaluations"
        className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
      >
        Cancel
      </Link>
      <button
        type="submit"
        className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
      >
        <Check className="w-4 h-4" />
        <span>Save Recipient Evaluation</span>
      </button>
    </div>
  );
}
