'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface BreedingCompositionTabProps {
  animal: Animal;
}

export function BreedingCompositionTab({ animal }: BreedingCompositionTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Layers className="w-4 h-4 text-emerald-700" />
        <span>Genomic Breed Composition &amp; Purity</span>
      </h3>

      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-800">{animal.breed || 'Angus (Black Angus)'}</span>
          <span className="font-mono font-bold text-emerald-800">100.0% Purity</span>
        </div>
        <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
          <div className="h-full bg-emerald-700 rounded-full" style={{ width: '100%' }} />
        </div>
        <p className="text-[11px] text-stone-500">
          Verified by Neogen GGP panel with single-nucleotide polymorphism reference library alignment.
        </p>
      </div>
    </div>
  );
}
