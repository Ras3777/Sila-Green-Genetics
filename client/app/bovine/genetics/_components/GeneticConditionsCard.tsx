'use client';

import React from 'react';
import Link from 'next/link';
import { Binary, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AnimalGeneticConditionResult } from '@/lib/bovine-types';

interface GeneticConditionsCardProps {
  carrierResults: AnimalGeneticConditionResult[];
  homozygousPolled: AnimalGeneticConditionResult[];
}

export function GeneticConditionsCard({
  carrierResults,
  homozygousPolled,
}: GeneticConditionsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Binary className="w-4 h-4 text-emerald-700" />
            Genetic Conditions & Carriers
          </h3>
          <p className="text-xs text-stone-500">
            Critical recessive defect surveillance (BLAD, CVM, HCD, Curly Calf AM).
          </p>
        </div>
        <Link
          href="/bovine/genetics/markers-conditions"
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
        >
          All
        </Link>
      </div>

      {/* Carrier List */}
      <div className="space-y-3">
        {carrierResults.map((res) => (
          <div
            key={res.id}
            className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1.5 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                {res.conditionName} ({res.conditionCode})
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                {res.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-700 text-[11px]">
              <span className="font-semibold">{res.animalName}</span>
              <span className="font-mono text-stone-500">{res.animalIdentifier}</span>
            </div>
            <div className="text-[11px] text-stone-600">
              Source: <span className="font-medium text-stone-800">{res.source}</span> • Tested {res.testedDate}
            </div>
            {res.notes && (
              <div className="text-[10px] text-amber-800 italic bg-white/70 p-1.5 rounded-md border border-amber-200/60">
                {res.notes}
              </div>
            )}
          </div>
        ))}

        {/* Polled Bulls Highlight */}
        {homozygousPolled.map((res) => (
          <div
            key={res.id}
            className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Homozygous Polled (P/P)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                PP Foundation
              </span>
            </div>
            <div className="text-[11px] text-stone-700">
              <span className="font-semibold">{res.animalName}</span> ({res.animalIdentifier})
            </div>
            <div className="text-[10px] text-emerald-800">
              100% hornless progeny guarantee. Dehorning surgery eliminated.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
