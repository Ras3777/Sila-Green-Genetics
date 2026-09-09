'use client';

import React from 'react';
import { Animal, Farm, Herd, IdentifierType } from '@/lib/bovine-types';

interface StepReviewProps {
  name: string;
  sex: string;
  identifierList: Array<{ type: IdentifierType; value: string; isPrimary: boolean }>;
  farmId: string;
  herdId: string;
  farms: Farm[];
  herds: Herd[];
  breedList: Array<{ breedName: string; percentage: number; source: any }>;
  sireId: string;
  damId: string;
  animals: Animal[];
  isBreedValid: boolean;
}

export function StepReview({
  name,
  sex,
  identifierList,
  farmId,
  herdId,
  farms,
  herds,
  breedList,
  sireId,
  damId,
  animals,
  isBreedValid,
}: StepReviewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
        7. Validation & Final Confirmation
      </h2>

      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-stone-500">Animal Name:</span>
          <span className="font-bold text-stone-900">{name || 'Unnamed'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Biological Sex:</span>
          <span className="font-bold text-stone-900">{sex}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Primary Identifier:</span>
          <span className="font-mono font-bold text-emerald-800">
            {identifierList.find((i) => i.isPrimary)?.value || identifierList[0]?.value}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Placement:</span>
          <span className="font-bold text-stone-900">
            {farms.find((f) => f.id === farmId)?.name} • {herds.find((h) => h.id === herdId)?.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Breed Composition:</span>
          <span className="font-bold text-stone-900">
            {breedList.map((b) => `${b.percentage}% ${b.breedName}`).join(', ')}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Parentage:</span>
          <span className="font-bold text-stone-900">
            Sire: {animals.find((a) => a.id === sireId)?.name || 'None'} • Dam: {animals.find((a) => a.id === damId)?.name || 'None'}
          </span>
        </div>
      </div>

      {!isBreedValid && (
        <div className="p-3 rounded-2xl bg-rose-50 text-rose-900 border border-rose-200 text-xs font-semibold">
          Warning: Breed composition must total exactly 100% before registration can proceed.
        </div>
      )}
    </div>
  );
}
