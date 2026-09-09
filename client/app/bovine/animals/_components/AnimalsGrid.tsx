'use client';

import React from 'react';
import Link from 'next/link';
import { Animal, Farm, Herd, AnimalBreedComposition } from '@/lib/bovine-types';

interface AnimalsGridProps {
  filteredAnimals: Animal[];
  farms: Farm[];
  herds: Herd[];
  breedCompositions: AnimalBreedComposition[];
  selectedAnimalIds: string[];
  onToggleSelectOne: (id: string) => void;
}

export function AnimalsGrid({
  filteredAnimals,
  farms,
  herds,
  breedCompositions,
  selectedAnimalIds,
  onToggleSelectOne,
}: AnimalsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredAnimals.map((animal) => {
        const farm = farms.find((f) => f.id === animal.farmId);
        const herd = herds.find((h) => h.id === animal.herdId);
        const bcs = breedCompositions.filter((bc) => bc.animalId === animal.id);
        const isSelected = selectedAnimalIds.includes(animal.id);

        return (
          <div
            key={animal.id}
            className={`p-5 rounded-3xl bg-white border transition-all space-y-3 ${
              isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs' : 'border-stone-200/80 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelectOne(animal.id)}
                  className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                />
                <div>
                  <Link
                    href={`/bovine/animals/${animal.id}`}
                    className="font-bold text-base text-stone-900 hover:text-emerald-800 hover:underline block"
                  >
                    {animal.name}
                  </Link>
                  <div className="text-[11px] font-mono text-emerald-800 font-semibold mt-0.5">
                    {animal.primaryIdentifier || animal.internalId}
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                {animal.useStatus.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
              <div>
                <span className="text-[10px] text-stone-400 uppercase">Sex &amp; DOB</span>
                <div className="font-semibold text-stone-800">{animal.sex} • {animal.birthDate}</div>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase">Placement</span>
                <div className="font-semibold text-stone-800 truncate">{farm?.name || 'Farm'}</div>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-[10px] text-stone-400 uppercase">Breed</span>
              <div className="text-stone-700 truncate">
                {bcs.map((b) => `${b.percentage}% ${b.breedName}`).join(', ') || 'Unspecified'}
              </div>
            </div>

            {animal.requiresReview && (
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                Review Alert: {animal.reviewReason || 'Veterinary check required'}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <span className="text-xs text-stone-500 font-mono">ID: {animal.internalId}</span>
              <Link
                href={`/bovine/animals/${animal.id}`}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold"
              >
                <span>View Profile</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
