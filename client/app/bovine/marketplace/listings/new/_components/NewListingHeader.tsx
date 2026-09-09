'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Plus } from 'lucide-react';

interface NewListingHeaderProps {
  step: number;
}

const STEPS = [
  { num: 1, title: 'Asset & Identity' },
  { num: 2, title: 'Commercial Terms' },
  { num: 3, title: 'Technical Specs' },
  { num: 4, title: 'Presentation & Media' },
  { num: 5, title: 'Documents & Vault' },
  { num: 6, title: 'Logistics & Review' },
];

export function NewListingHeader({ step }: NewListingHeaderProps) {
  return (
    <div className="bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
          <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-800 font-semibold">New Listing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
          <Plus className="w-8 h-8 text-emerald-800" />
          Publish Commercial Genetics Listing
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Back your commercial listing with verified canonical pedigree, EPDs, and health certificates from your herd.
        </p>

        {/* Stepper indicator */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-100 overflow-x-auto">
          {STEPS.map((s) => (
            <div key={s.num} className="flex items-center gap-2 pr-4">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs whitespace-nowrap font-medium ${step === s.num ? 'text-stone-900 font-bold' : 'text-stone-700'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
