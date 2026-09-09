'use client';

import React from 'react';
import { Animal } from '@/lib/bovine-types';
import { ExpectedProgenyPreview } from '@/lib/bovine-marketplace-types';

interface AnimalListingProgenyTabProps {
  potentialMates: Animal[];
  selectedMateId: string;
  setSelectedMateId: (id: string) => void;
  progenyPreview: ExpectedProgenyPreview | null;
}

export function AnimalListingProgenyTab({
  potentialMates,
  selectedMateId,
  setSelectedMateId,
  progenyPreview,
}: AnimalListingProgenyTabProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-stone-900">Virtual In-Silico Breeding Simulation</h4>
          <p className="text-xs text-stone-600">Simulate expected parent averages and inbreeding coefficients by mating this animal with a female from your herd.</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">
          Select Dam from Your Herd
        </label>
        <select
          value={selectedMateId}
          onChange={(e) => setSelectedMateId(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          {potentialMates.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name || m.identifiers?.[0]?.value} ({m.breed || 'Angus'} - {m.sex})
            </option>
          ))}
        </select>
      </div>

      {progenyPreview && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-[11px] text-stone-700">Exp. Inbreeding $F$</div>
              <div className="text-base font-bold font-mono text-emerald-800 mt-0.5">
                {(progenyPreview.expectedInbreedingF * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-stone-600">Safe pedigree threshold</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-[11px] text-stone-700">Parent Avg CED</div>
              <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
                +{progenyPreview.parentAverageCED}
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-[11px] text-stone-700">Parent Avg WW</div>
              <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
                +{progenyPreview.parentAverageWW} lbs
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-[11px] text-stone-700">Parent Avg Marbling</div>
              <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
                +{progenyPreview.parentAverageMARB}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="text-xs font-mono uppercase text-stone-700 mb-2">Genetic Condition Offspring Risk</div>
            <div className="space-y-1.5 text-xs">
              {progenyPreview.geneticConditionRisks.map((cond: { condition: string; offspringRisk: string }, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-none">
                  <span className="font-semibold text-stone-900">{cond.condition}</span>
                  <span className="font-mono text-emerald-800 font-bold">{cond.offspringRisk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
