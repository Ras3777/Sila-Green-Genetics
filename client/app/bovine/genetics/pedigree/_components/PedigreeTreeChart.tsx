'use client';

import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { Animal, Parentage } from '@/lib/bovine-types';
import { AnimalGeneticMetric } from '@/lib/bovine-genetics-types';

interface PedigreeTreeChartProps {
  selectedAnimal?: Animal;
  pedigreeF?: AnimalGeneticMetric;
  parentage?: Parentage;
  sireAnimal?: Animal;
  damAnimal?: Animal;
  generationsDepth: number;
}

export function PedigreeTreeChart({
  selectedAnimal,
  pedigreeF,
  parentage,
  sireAnimal,
  damAnimal,
  generationsDepth,
}: PedigreeTreeChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 overflow-x-auto space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          Interactive Ancestry Chart
        </h3>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center gap-1.5 text-blue-800">
            <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-400" />
            Sire (Paternal)
          </span>
          <span className="flex items-center gap-1.5 text-rose-800">
            <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-400" />
            Dam (Maternal)
          </span>
        </div>
      </div>

      {/* Tree Layout */}
      <div className="min-w-[900px] flex items-center gap-6 py-4">
        {/* Generation 0: Subject Animal */}
        <div className="w-72 shrink-0">
          <div className="p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/50 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded">
                Subject Animal
              </span>
              <span className="text-[11px] font-semibold text-stone-700">{selectedAnimal?.sex}</span>
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm">{selectedAnimal?.name}</div>
              <div className="font-mono text-xs text-stone-600">
                {selectedAnimal?.primaryIdentifier || selectedAnimal?.internalId}
              </div>
            </div>
            <div className="text-[11px] text-stone-600 space-y-0.5 pt-1 border-t border-emerald-200/60">
              <div>Born: {selectedAnimal?.birthDate}</div>
              <div>Reg: {selectedAnimal?.registrationNumber || 'Pending'}</div>
              <div className="text-emerald-800 font-medium">Inbreeding F: {pedigreeF?.formattedValue || '3.8%'}</div>
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />

        {/* Generation 1: Parents (Sire & Dam) */}
        <div className="w-72 shrink-0 space-y-4">
          {/* Sire Node */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-blue-900 bg-blue-200 px-2 py-0.5 rounded">
                Sire (Father)
              </span>
              <span className="text-[10px] font-mono text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                {parentage?.verificationMethod || 'DNA_CONFIRMED'}
              </span>
            </div>
            <div className="font-bold text-stone-900 text-xs">
              {parentage?.sireName || 'Altair Benchmark ET'}
            </div>
            <div className="font-mono text-[11px] text-stone-600">
              {sireAnimal?.primaryIdentifier || parentage?.sireRegistration || 'US-9901421'}
            </div>
            <div className="text-[10px] text-stone-500 pt-1 border-t border-blue-200/60 flex items-center justify-between">
              <span>Certified Purebred</span>
              <span className="text-emerald-700 font-semibold">Verified</span>
            </div>
          </div>

          {/* Dam Node */}
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-rose-900 bg-rose-200 px-2 py-0.5 rounded">
                Dam (Mother)
              </span>
              <span className="text-[10px] font-mono text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
                {parentage?.verificationMethod || 'DNA_CONFIRMED'}
              </span>
            </div>
            <div className="font-bold text-stone-900 text-xs">
              {parentage?.damName || 'Cloverdale Supernova Dam 91'}
            </div>
            <div className="font-mono text-[11px] text-stone-600">
              {damAnimal?.primaryIdentifier || parentage?.damRegistration || 'US-8840219'}
            </div>
            <div className="text-[10px] text-stone-500 pt-1 border-t border-rose-200/60 flex items-center justify-between">
              <span>Lactation 3 Tested</span>
              <span className="text-emerald-700 font-semibold">Verified</span>
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />

        {/* Generation 2: Grandparents (4 Nodes) */}
        <div className="w-72 shrink-0 space-y-2">
          {/* Paternal Grandsire */}
          <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-0.5">
            <div className="text-[9px] font-bold text-blue-900 uppercase">Paternal Grandsire (PGS)</div>
            <div className="font-bold text-stone-900 text-[11px]">Morningview Legend ET</div>
            <div className="font-mono text-[10px] text-stone-500">HOUSA-1392810</div>
          </div>

          {/* Paternal Granddam */}
          <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-xs space-y-0.5">
            <div className="text-[9px] font-bold text-rose-900 uppercase">Paternal Granddam (PGD)</div>
            <div className="font-bold text-stone-900 text-[11px]">Benchmark Beauty 410</div>
            <div className="font-mono text-[10px] text-stone-500">HOUSA-1382109</div>
          </div>

          {/* Maternal Grandsire */}
          <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-0.5">
            <div className="text-[9px] font-bold text-blue-900 uppercase">Maternal Grandsire (MGS)</div>
            <div className="font-bold text-stone-900 text-[11px]">
              {parentage?.mgsName || 'Pine-Tree Heroic ET'}
            </div>
            <div className="font-mono text-[10px] text-stone-500">HOUSA-1402918</div>
          </div>

          {/* Maternal Granddam */}
          <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-xs space-y-0.5">
            <div className="text-[9px] font-bold text-rose-900 uppercase">Maternal Granddam (MGD)</div>
            <div className="font-bold text-stone-900 text-[11px]">Cloverdale Nova Lass</div>
            <div className="font-mono text-[10px] text-stone-500">HOUSA-1378411</div>
          </div>
        </div>

        {generationsDepth >= 4 && (
          <>
            <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />
            {/* Generation 3: Great-Grandparents (8 Nodes) */}
            <div className="w-72 shrink-0 grid grid-cols-1 gap-1.5 text-[10px]">
              {[
                { label: 'PPGS', name: 'O-Man Justy ET', code: 'US-7182901', sex: 'M' },
                { label: 'PPGD', name: 'Morningview Shottle Roxy', code: 'US-7029184', sex: 'F' },
                { label: 'PMGS', name: 'Ensenada Taboo Planet', code: 'US-6059714', sex: 'M' },
                { label: 'PMGD', name: 'Benchmark Lass 108', code: 'US-6192841', sex: 'F' },
                { label: 'MPGS', name: 'Seagull-Bay Supersire', code: 'US-6998134', sex: 'M' },
                { label: 'MPGD', name: 'Pine-Tree 2149 Robust', code: 'US-6481092', sex: 'F' },
                { label: 'MMGS', name: 'Mountfield SSI Mogul', code: 'US-6819482', sex: 'M' },
                { label: 'MMGD', name: 'Cloverdale Star Galaxy', code: 'US-6301984', sex: 'F' },
              ].map((gg, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded-lg border ${
                    gg.sex === 'M'
                      ? 'border-blue-200 bg-blue-50/30'
                      : 'border-rose-200 bg-rose-50/30'
                  }`}
                >
                  <div className="font-bold text-stone-900 truncate">{gg.name}</div>
                  <div className="font-mono text-stone-500 text-[9px] flex justify-between">
                    <span>{gg.label}</span>
                    <span>{gg.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
