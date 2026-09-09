'use client';

import React from 'react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';
import { Animal } from '@/lib/bovine-types';

interface AnimalListingPedigreeTabProps {
  listing: MarketplaceListing;
  animal: Animal | null | undefined;
}

export function AnimalListingPedigreeTab({ listing, animal }: AnimalListingPedigreeTabProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-mono uppercase text-stone-700 mb-3">Certified Ancestry Lineage</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        {/* Generation 1: Subject */}
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col justify-center">
          <div className="text-[10px] text-emerald-800 uppercase font-bold">Candidate Subject</div>
          <div className="text-sm font-bold text-stone-900 mt-1">{listing.title}</div>
          <div className="text-stone-700 mt-0.5">{animal?.identifiers?.[0]?.value || 'TAG-601'}</div>
        </div>

        {/* Generation 2: Parents */}
        <div className="space-y-3 flex flex-col justify-center">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-[10px] text-stone-700 uppercase font-semibold">Sire</div>
            <div className="font-bold text-stone-900 mt-0.5">GAR Sure Fire 6432</div>
            <div className="text-stone-700 text-[11px]">AAA +18652033</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-[10px] text-stone-700 uppercase font-semibold">Dam</div>
            <div className="font-bold text-stone-900 mt-0.5">Highland Blackcap 8912</div>
            <div className="text-stone-700 text-[11px]">AAA +19200451</div>
          </div>
        </div>

        {/* Generation 3: Grandparents */}
        <div className="space-y-2 flex flex-col justify-center">
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-[11px]">
            <span className="text-stone-700 text-[10px] uppercase">Sire's Sire:</span> Connealy In Sure 8524
          </div>
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-[11px]">
            <span className="text-stone-700 text-[10px] uppercase">Sire's Dam:</span> Chair Rock 5050 GAR 8086
          </div>
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-[11px]">
            <span className="text-stone-700 text-[10px] uppercase">Dam's Sire:</span> SydGen Enhance
          </div>
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-[11px]">
            <span className="text-stone-700 text-[10px] uppercase">Dam's Dam:</span> Highland Blackcap 5410
          </div>
        </div>
      </div>
    </div>
  );
}
