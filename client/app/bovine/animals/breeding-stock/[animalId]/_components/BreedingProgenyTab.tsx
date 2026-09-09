'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ChevronRight } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface BreedingProgenyTabProps {
  progenyList: Animal[];
}

export function BreedingProgenyTab({ progenyList }: BreedingProgenyTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Users className="w-4 h-4 text-emerald-700" />
        <span>Offspring &amp; Progeny Records ({progenyList.length})</span>
      </h3>

      {progenyList.length === 0 ? (
        <p className="text-xs text-stone-500 py-6 text-center">
          No progeny recorded in registry. Progeny will link here automatically when newborn calves or parentage tests reference this animal.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {progenyList.map((offspring) => (
            <Link
              key={offspring.id}
              href={`/bovine/animals/${offspring.id}`}
              className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-sm text-stone-900">{offspring.name}</div>
                <div className="text-xs text-stone-500 font-mono">
                  {offspring.primaryIdentifier || offspring.internalId} • {offspring.sex}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
