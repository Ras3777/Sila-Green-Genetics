'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { Animal, Farm } from '@/lib/bovine-types';

interface SectionRecipientIdentityProps {
  femaleAnimals: Animal[];
  cowAnimalId: string;
  onCowChange: (id: string) => void;
  earTag: string;
  onEarTagChange: (tag: string) => void;
  farms: Farm[];
  farmId: string;
  onFarmChange: (farmId: string) => void;
  breed: string;
  onBreedChange: (breed: string) => void;
}

export function SectionRecipientIdentity({
  femaleAnimals,
  cowAnimalId,
  onCowChange,
  earTag,
  onEarTagChange,
  farms,
  farmId,
  onFarmChange,
  breed,
  onBreedChange,
}: SectionRecipientIdentityProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Heart className="w-5 h-5 text-emerald-700" />
        <span>Section A: Recipient Identity &amp; Placement</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Select Candidate Cow *
          </label>
          <select
            value={cowAnimalId}
            onChange={(e) => onCowChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          >
            {femaleAnimals.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.primaryIdentifier || f.internalId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Ear Tag / Identifier *
          </label>
          <input
            type="text"
            value={earTag}
            onChange={(e) => onEarTagChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Farm / Facility
          </label>
          <select
            value={farmId}
            onChange={(e) => onFarmChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Breed / Cross
          </label>
          <input
            type="text"
            value={breed}
            onChange={(e) => onBreedChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
