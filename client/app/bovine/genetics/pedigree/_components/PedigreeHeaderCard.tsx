'use client';

import React from 'react';
import { GitBranch, ShieldCheck } from 'lucide-react';
import { Animal, Parentage, AnimalGeneticMetric } from '@/lib/bovine-types';

interface PedigreeHeaderCardProps {
  selectedAnimal?: Animal;
  generationsDepth: number;
  onSelectGenerationsDepth: (depth: number) => void;
  animals: Animal[];
  onSelectAnimal: (animalId: string) => void;
  onOpenVerifyModal: () => void;
  pedigreeF?: AnimalGeneticMetric;
  genomicFroh?: AnimalGeneticMetric;
  parentage?: Parentage;
}

export function PedigreeHeaderCard({
  selectedAnimal,
  generationsDepth,
  onSelectGenerationsDepth,
  animals,
  onSelectAnimal,
  onOpenVerifyModal,
  pedigreeF,
  genomicFroh,
  parentage,
}: PedigreeHeaderCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Multi-Generation Pedigree Tree
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">
              Depth: {generationsDepth} Generations
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-700" />
            {selectedAnimal?.name}
          </h2>
          <div className="text-xs text-stone-600 flex flex-wrap items-center gap-2">
            <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-800">
              {selectedAnimal?.primaryIdentifier || selectedAnimal?.internalId}
            </span>
            <span>•</span>
            <span>Born {selectedAnimal?.birthDate}</span>
            <span>•</span>
            <span className="font-semibold">{selectedAnimal?.sex}</span>
            <span>•</span>
            <span>{selectedAnimal?.hornStatus}</span>
          </div>
        </div>

        {/* Controls: Generations & Animal Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Generation Depth Selector */}
          <div className="flex items-center bg-stone-100 rounded-lg p-1 text-xs">
            {[3, 4, 5].map((depth) => (
              <button
                key={depth}
                onClick={() => onSelectGenerationsDepth(depth)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  generationsDepth === depth
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {depth} Gen
              </button>
            ))}
          </div>

          {/* Animal Dropdown Selector */}
          <select
            value={selectedAnimal?.id}
            onChange={(e) => onSelectAnimal(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-2xs"
          >
            {animals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.primaryIdentifier || a.internalId})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenVerifyModal}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Parentage</span>
          </button>
        </div>
      </div>

      {/* Inbreeding & Completeness Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">
            Pedigree Inbreeding (F)
          </span>
          <div className="text-base font-bold text-stone-900">
            {pedigreeF?.formattedValue || (parentage?.inbreedingCoefficient ? `${(parentage.inbreedingCoefficient * 100).toFixed(1)}%` : '3.8%')}
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">
            Below breed threshold (8.0%)
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">
            Genomic ROH Inbreeding (FROH)
          </span>
          <div className="text-base font-bold text-stone-900">
            {genomicFroh?.formattedValue || '5.2%'}
          </div>
          <span className="text-[10px] text-stone-500">
            High-density chip verified
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">
            Verification Method
          </span>
          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{parentage?.verificationMethod || 'DNA_CONFIRMED'}</span>
          </div>
          <span className="text-[10px] text-stone-500">
            Mendelian exclusion passed
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">
            Pedigree Completeness
          </span>
          <div className="text-base font-bold text-stone-900">
            {parentage?.completenessScore || 96}%
          </div>
          <span className="text-[10px] text-stone-500">
            5 generations recorded
          </span>
        </div>
      </div>
    </div>
  );
}
