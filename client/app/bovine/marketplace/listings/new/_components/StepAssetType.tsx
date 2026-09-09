'use client';

import React from 'react';
import { Layers, TestTubes, Sparkles, Award, Dna, CheckCircle2 } from 'lucide-react';
import { MarketplaceAssetType } from '@/lib/bovine-marketplace-types';
import { Animal } from '@/lib/bovine-types';

interface StepAssetTypeProps {
  assetType: MarketplaceAssetType;
  setAssetType: (type: MarketplaceAssetType) => void;
  selectedAnimalId: string;
  onSelectAnimal: (animalId: string) => void;
  animals: Animal[];
}

const ASSET_TYPES = [
  { id: 'LIVE_ANIMAL', label: 'Live Breeding Animal', icon: Layers, desc: 'Bulls, donors, heifers' },
  { id: 'SEMEN', label: 'Semen Straws', icon: TestTubes, desc: 'CSS certified cryo doses' },
  { id: 'EMBRYO', label: 'Embryo Lots', icon: Sparkles, desc: 'IVF & in-vivo packages' },
  { id: 'BREEDING_SERVICE', label: 'Breeding Service', icon: Award, desc: 'Flushing, recipient sync' },
];

export function StepAssetType({
  assetType,
  setAssetType,
  selectedAnimalId,
  onSelectAnimal,
  animals,
}: StepAssetTypeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-stone-900">Select Commercial Asset Type</h3>
        <p className="text-xs text-stone-600">Choose the classification of bovine genetics you wish to offer.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ASSET_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setAssetType(type.id as any)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                assetType === type.id
                  ? 'border-emerald-800 bg-emerald-50/50 shadow-xs'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
              }`}
            >
              <Icon className={`w-6 h-6 ${assetType === type.id ? 'text-emerald-800' : 'text-stone-700'}`} />
              <div>
                <div className="font-bold text-sm text-stone-900">{type.label}</div>
                <div className="text-[11px] text-stone-600">{type.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Link to Canonical Animal */}
      <div className="pt-4 border-t border-stone-100 space-y-3">
        <div>
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Dna className="w-4 h-4 text-emerald-800" /> Connect to Canonical Herd Record (Recommended)
          </h4>
          <p className="text-xs text-stone-600">
            Auto-imports official pedigree, EPDs, genomic evaluations, and health badges.
          </p>
        </div>

        <select
          value={selectedAnimalId}
          onChange={(e) => onSelectAnimal(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
        >
          <option value="">-- Select Animal from Your Herd Registry --</option>
          {animals.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name || a.identifiers?.[0]?.value} ({a.breed} - {a.sex}) • Index +{a.geneticProfile?.selectionIndex || 160}
            </option>
          ))}
        </select>

        {selectedAnimalId && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            <span>Canonical DNA parentage, 100K genotype, and EPDs connected automatically.</span>
          </div>
        )}
      </div>
    </div>
  );
}
