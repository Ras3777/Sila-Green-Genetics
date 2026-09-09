'use client';

import React from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface StepDonorCowProps {
  procedureType: 'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER';
  donorCowAnimalId: string;
  setDonorCowAnimalId: (id: string) => void;
  donorCowPlaceholder: string;
  setDonorCowPlaceholder: (placeholder: string) => void;
  donorWeightKg: string;
  setDonorWeightKg: (w: string) => void;
  donorBcs: string;
  setDonorBcs: (bcs: string) => void;
  donorBreed: string;
  setDonorBreed: (breed: string) => void;
  femaleAnimals: Animal[];
  onProceedToBull: () => void;
}

export function StepDonorCow({
  procedureType,
  donorCowAnimalId,
  setDonorCowAnimalId,
  donorCowPlaceholder,
  setDonorCowPlaceholder,
  donorWeightKg,
  setDonorWeightKg,
  donorBcs,
  setDonorBcs,
  donorBreed,
  setDonorBreed,
  femaleAnimals,
  onProceedToBull,
}: StepDonorCowProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Users className="w-5 h-5 text-amber-700" />
        <span>Step 2: Donor Cow Information (Embryo Source)</span>
      </h2>

      {procedureType === 'ARTIFICIAL_INSEMINATION' ? (
        <div className="p-6 text-center text-stone-500 space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto text-stone-400" />
          <p className="text-xs">
            Donor information is not required for standard Artificial Insemination (AI).
          </p>
          <button
            type="button"
            onClick={onProceedToBull}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
          >
            Proceed to Step 3: Bull &amp; Semen &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Select In-Herd Donor Cow
            </label>
            <select
              value={donorCowAnimalId}
              onChange={(e) => {
                setDonorCowAnimalId(e.target.value);
                if (e.target.value) setDonorCowPlaceholder('');
              }}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            >
              <option value="">-- Or enter external donor below --</option>
              {femaleAnimals.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.primaryIdentifier || f.internalId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Or External Donor Cow Name / Reg #
            </label>
            <input
              type="text"
              value={donorCowPlaceholder}
              onChange={(e) => {
                setDonorCowPlaceholder(e.target.value);
                if (e.target.value) setDonorCowAnimalId('');
              }}
              placeholder="e.g. GAR Early Bird 5092 (Reg #189218)"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Donor Weight at Day 0 (kg)
            </label>
            <input
              type="number"
              value={donorWeightKg}
              onChange={(e) => setDonorWeightKg(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Donor Body Condition Score (BCS 1-9)
            </label>
            <input
              type="number"
              step="0.5"
              value={donorBcs}
              onChange={(e) => setDonorBcs(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Donor Breed Composition
            </label>
            <input
              type="text"
              value={donorBreed}
              onChange={(e) => setDonorBreed(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>
        </div>
      )}
    </div>
  );
}
