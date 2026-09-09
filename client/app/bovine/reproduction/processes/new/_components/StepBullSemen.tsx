'use client';

import React from 'react';
import { TestTubes } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface StepBullSemenProps {
  bullAnimalId: string;
  setBullAnimalId: (id: string) => void;
  bullPlaceholder: string;
  setBullPlaceholder: (name: string) => void;
  bullDgr: string;
  setBullDgr: (dgr: string) => void;
  semenBatch: string;
  setSemenBatch: (batch: string) => void;
  maleAnimals: Animal[];
}

export function StepBullSemen({
  bullAnimalId,
  setBullAnimalId,
  bullPlaceholder,
  setBullPlaceholder,
  bullDgr,
  setBullDgr,
  semenBatch,
  setSemenBatch,
  maleAnimals,
}: StepBullSemenProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <TestTubes className="w-5 h-5 text-emerald-700" />
        <span>Step 3: Bull / Semen Service Information</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Select Herd Sire (if on-farm)
          </label>
          <select
            value={bullAnimalId}
            onChange={(e) => {
              setBullAnimalId(e.target.value);
              if (e.target.value) setBullPlaceholder('');
            }}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">-- Or enter semen straw / AI sire below --</option>
            {maleAnimals.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.primaryIdentifier || m.internalId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Or Sire Name / NAAB Code *
          </label>
          <input
            type="text"
            value={bullPlaceholder}
            onChange={(e) => {
              setBullPlaceholder(e.target.value);
              if (e.target.value) setBullAnimalId('');
            }}
            placeholder="e.g. SAV Raindance 6848 (29AN1922)"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required={!bullAnimalId}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Bull DGR Identifier
          </label>
          <input
            type="text"
            value={bullDgr}
            onChange={(e) => setBullDgr(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Semen Batch / Canister Straw ID
          </label>
          <input
            type="text"
            value={semenBatch}
            onChange={(e) => setSemenBatch(e.target.value)}
            placeholder="BATCH-2026-US-48"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
