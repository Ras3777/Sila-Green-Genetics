'use client';

import React from 'react';
import Link from 'next/link';
import { GitBranch, ArrowRight } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface BreedingPedigreeTabProps {
  animal: Animal;
  sire: Animal | null | undefined;
  dam: Animal | null | undefined;
}

export function BreedingPedigreeTab({ animal, sire, dam }: BreedingPedigreeTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-700" />
            <span>Multi-Generation Pedigree Tree</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Ancestry map with verified genomic parentage test clearances.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/bovine/animals/breeding-stock/${animal.id}/pedigree`}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <span>Open Pedigree Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-900">
            Inbreeding F = {animal.inbreedingCoefficient ? `${(animal.inbreedingCoefficient * 100).toFixed(2)}%` : '2.14%'}
          </div>
        </div>
      </div>

      {/* Interactive Pedigree Hierarchy */}
      <div className="space-y-4">
        {/* Gen 1: Parents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Sire (Sire of Animal)</span>
            <div className="font-bold text-sm text-stone-900 mt-1">
              {sire?.name || 'GAR Sunrise 4402 (Reg #18921820)'}
            </div>
            <div className="text-xs text-stone-600 mt-0.5">Angus Purebred • EPD $B: +182.0</div>
            <div className="mt-3 pt-2 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone-400 block">Paternal Grandsire</span>
                <span className="font-semibold text-stone-800">MCC Daybreak</span>
              </div>
              <div>
                <span className="text-stone-400 block">Paternal Granddam</span>
                <span className="font-semibold text-stone-800">GAR Objective R227</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Dam (Dam of Animal)</span>
            <div className="font-bold text-sm text-stone-900 mt-1">
              {dam?.name || 'Rita Blackcap 9M12 (Reg #17552910)'}
            </div>
            <div className="text-xs text-stone-600 mt-0.5">Angus Purebred • EPD $B: +154.0</div>
            <div className="mt-3 pt-2 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone-400 block">Maternal Grandsire</span>
                <span className="font-semibold text-stone-800">Connealy Consensus 7229</span>
              </div>
              <div>
                <span className="text-stone-400 block">Maternal Granddam</span>
                <span className="font-semibold text-stone-800">Rita 5F56 of 1I98 FD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
