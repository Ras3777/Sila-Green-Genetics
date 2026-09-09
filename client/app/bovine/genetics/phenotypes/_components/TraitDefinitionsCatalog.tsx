'use client';

import React from 'react';
import { TraitDefinition } from '@/lib/bovine-types';

interface TraitDefinitionsCatalogProps {
  traitDefinitions: TraitDefinition[];
}

export function TraitDefinitionsCatalog({ traitDefinitions }: TraitDefinitionsCatalogProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {traitDefinitions.map((trait) => (
        <div
          key={trait.id}
          className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3 text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              {trait.code}
            </span>
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
              {trait.category}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-sm">{trait.name}</h4>
            <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
              {trait.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px]">
            <div>
              <span className="text-stone-500 block">Heritability (h²):</span>
              <span className="font-bold text-stone-900">{trait.heritability}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Unit:</span>
              <span className="font-bold text-stone-900">{trait.unit}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Desirable Direction:</span>
              <span
                className={`font-semibold ${
                  trait.direction === 'INCREASE'
                    ? 'text-emerald-700'
                    : trait.direction === 'DECREASE'
                    ? 'text-blue-700'
                    : 'text-amber-700'
                }`}
              >
                {trait.direction}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block">Valid Bounds:</span>
              <span className="font-mono text-stone-800">
                {trait.minValidValue} - {trait.maxValidValue} {trait.unit}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>{trait.phenotypeCount || 0} observations</span>
            <span>{trait.isSexLimited ? `Female Only` : 'Both Sexes'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
