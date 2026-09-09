'use client';

import React from 'react';
import { Animal } from '@/lib/bovine-types';

interface StepParentageProps {
  sireId: string;
  setSireId: (id: string) => void;
  damId: string;
  setDamId: (id: string) => void;
  candidateSires: Animal[];
  candidateDams: Animal[];
}

export function StepParentage({
  sireId,
  setSireId,
  damId,
  setDamId,
  candidateSires,
  candidateDams,
}: StepParentageProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
        5. Genealogical Lineage & Parentage
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Sire (Male Parent)</label>
          <select
            value={sireId}
            onChange={(e) => setSireId(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">No Sire Registered / Unknown</option>
            {candidateSires.map((bull) => (
              <option key={bull.id} value={bull.id}>
                {bull.name} ({bull.primaryIdentifier || bull.internalId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Dam (Female Parent)</label>
          <select
            value={damId}
            onChange={(e) => setDamId(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">No Dam Registered / Unknown</option>
            {candidateDams.map((cow) => (
              <option key={cow.id} value={cow.id}>
                {cow.name} ({cow.primaryIdentifier || cow.internalId})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
