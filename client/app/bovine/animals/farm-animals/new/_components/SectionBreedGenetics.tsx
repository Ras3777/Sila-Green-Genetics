'use client';

import React from 'react';
import { Dna } from 'lucide-react';

interface SectionBreedGeneticsProps {
  primaryBreed: string;
  setPrimaryBreed: (v: string) => void;
  breedPercentage: string;
  setBreedPercentage: (v: string) => void;
  breedingType: string;
  setBreedingType: (v: string) => void;
}

export function SectionBreedGenetics({
  primaryBreed,
  setPrimaryBreed,
  breedPercentage,
  setBreedPercentage,
  breedingType,
  setBreedingType,
}: SectionBreedGeneticsProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Dna className="w-4 h-4 text-emerald-700" />
        <span>Section D — Breed &amp; Genetics</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Breed</label>
          <select
            value={primaryBreed}
            onChange={(e) => setPrimaryBreed(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
          >
            <option value="Holstein Friesian">Holstein Friesian</option>
            <option value="Aberdeen Angus">Aberdeen Angus</option>
            <option value="Red Angus">Red Angus</option>
            <option value="Jersey">Jersey</option>
            <option value="Gyr">Gyr</option>
            <option value="Simmental">Simmental</option>
            <option value="Nelore">Nelore</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Breed Percentage (%)</label>
          <input
            type="number"
            value={breedPercentage}
            onChange={(e) => setBreedPercentage(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Breeding Type</label>
          <select
            value={breedingType}
            onChange={(e) => setBreedingType(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="PUREBRED">Purebred</option>
            <option value="CROSSBRED">Crossbred</option>
            <option value="COMPOSITE">Synthetic Composite</option>
          </select>
        </div>
      </div>
    </div>
  );
}
