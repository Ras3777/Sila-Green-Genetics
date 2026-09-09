'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface StepRecipientCowProps {
  cowAnimalId: string;
  setCowAnimalId: (id: string) => void;
  recipientDgr: string;
  setRecipientDgr: (dgr: string) => void;
  branding: string;
  setBranding: (branding: string) => void;
  managementGroup: string;
  setManagementGroup: (group: string) => void;
  femaleAnimals: Animal[];
  selectedCow?: Animal;
}

export function StepRecipientCow({
  cowAnimalId,
  setCowAnimalId,
  recipientDgr,
  setRecipientDgr,
  branding,
  setBranding,
  managementGroup,
  setManagementGroup,
  femaleAnimals,
  selectedCow,
}: StepRecipientCowProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Heart className="w-5 h-5 text-emerald-700" />
        <span>Step 1: Recipient / Inseminated Cow Information</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Select Recipient Cow *
          </label>
          <select
            value={cowAnimalId}
            onChange={(e) => setCowAnimalId(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          >
            {femaleAnimals.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.primaryIdentifier || f.internalId}) • {f.breed || 'Angus'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Recipient DGR Identifier
          </label>
          <input
            type="text"
            value={recipientDgr}
            onChange={(e) => setRecipientDgr(e.target.value)}
            placeholder="Official Recipient DGR"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Branding &amp; Permanent Marks
          </label>
          <input
            type="text"
            value={branding}
            onChange={(e) => setBranding(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Management Group
          </label>
          <input
            type="text"
            value={managementGroup}
            onChange={(e) => setManagementGroup(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>
      </div>

      {selectedCow && (
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-emerald-950">Active Recipient Selected:</span>{' '}
            <span className="text-emerald-900 font-medium">
              {selectedCow.name} • Status: {selectedCow.useStatus} • Breed: {selectedCow.breed || 'Angus'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-800">
            {selectedCow.primaryIdentifier}
          </span>
        </div>
      )}
    </div>
  );
}
