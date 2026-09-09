'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface StepPedigreeProps {
  sireId: string;
  setSireId: (id: string) => void;
  externalSireName: string;
  setExternalSireName: (name: string) => void;
  damId: string;
  setDamId: (id: string) => void;
  externalDamName: string;
  setExternalDamName: (name: string) => void;
  potentialSires: Animal[];
  potentialDams: Animal[];
  selectedSire?: Animal;
  selectedDam?: Animal;
}

export function StepPedigree({
  sireId,
  setSireId,
  externalSireName,
  setExternalSireName,
  damId,
  setDamId,
  externalDamName,
  setExternalDamName,
  potentialSires,
  potentialDams,
  selectedSire,
  selectedDam,
}: StepPedigreeProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Users className="w-4 h-4 text-amber-700" />
        <span>Step 5 — Verified Pedigree &amp; Ancestry Linking</span>
      </div>
      <p className="text-xs text-stone-600">
        Selecting registered parents automatically resolves 3-generation depth (Grandparents &amp; Great-grandparents) from the registry database.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
          <label className="block text-xs font-bold text-stone-900">Sire (Father)</label>
          <select
            value={sireId}
            onChange={(e) => {
              setSireId(e.target.value);
              if (e.target.value) setExternalSireName('');
            }}
            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">-- Select Registered Sire Bull --</option>
            {potentialSires.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.primaryIdentifier || s.internalId})
              </option>
            ))}
          </select>
          {selectedSire && (
            <div className="text-[11px] bg-white p-2.5 rounded-lg border border-stone-200 text-stone-600">
              <div className="font-bold text-stone-900">{selectedSire.name}</div>
              <div>Breed: {selectedSire.breed || 'Holstein'}</div>
              <div className="font-mono text-stone-500">DGR: {selectedSire.dgr || selectedSire.internalId}</div>
            </div>
          )}
          <div className="text-[11px] text-stone-500 font-medium">Or enter external sire code:</div>
          <input
            type="text"
            value={externalSireName}
            onChange={(e) => {
              setExternalSireName(e.target.value);
              if (e.target.value) setSireId('');
            }}
            placeholder="External Sire Name / Registry Code"
            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
          <label className="block text-xs font-bold text-stone-900">Dam (Mother)</label>
          <select
            value={damId}
            onChange={(e) => {
              setDamId(e.target.value);
              if (e.target.value) setExternalDamName('');
            }}
            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">-- Select Registered Dam --</option>
            {potentialDams.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.primaryIdentifier || d.internalId})
              </option>
            ))}
          </select>
          {selectedDam && (
            <div className="text-[11px] bg-white p-2.5 rounded-lg border border-stone-200 text-stone-600">
              <div className="font-bold text-stone-900">{selectedDam.name}</div>
              <div>Breed: {selectedDam.breed || 'Holstein'}</div>
              <div className="font-mono text-stone-500">DGR: {selectedDam.dgr || selectedDam.internalId}</div>
            </div>
          )}
          <div className="text-[11px] text-stone-500 font-medium">Or enter external dam code:</div>
          <input
            type="text"
            value={externalDamName}
            onChange={(e) => {
              setExternalDamName(e.target.value);
              if (e.target.value) setDamId('');
            }}
            placeholder="External Dam Name / Registry Code"
            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
