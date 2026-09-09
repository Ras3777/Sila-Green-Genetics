'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowLeft } from 'lucide-react';

export function WizardHeader() {
  return (
    <div className="flex items-center space-x-3 pb-4 border-b border-stone-200">
      <Link
        href="/bovine/animals/breeding-stock"
        className="p-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4" />
      </Link>
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-0.5">
          <Award className="w-3.5 h-3.5" />
          <span>Breeding Stock Registry Workflow</span>
        </div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Register Breeding Stock Candidate</h1>
      </div>
    </div>
  );
}
