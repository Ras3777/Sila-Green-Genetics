'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface SectionParentSelectionProps {
  potentialSires: Animal[];
  potentialDams: Animal[];
  sireId: string;
  setSireId: (v: string) => void;
  externalSireName: string;
  setExternalSireName: (v: string) => void;
  damId: string;
  setDamId: (v: string) => void;
  externalDamName: string;
  setExternalDamName: (v: string) => void;
  parentageNotes: string;
  setParentageNotes: (v: string) => void;
}

export function SectionParentSelection({
  potentialSires,
  potentialDams,
  sireId,
  setSireId,
  externalSireName,
  setExternalSireName,
  damId,
  setDamId,
  externalDamName,
  setExternalDamName,
  parentageNotes,
  setParentageNotes,
}: SectionParentSelectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Users className="w-4 h-4 text-emerald-700" />
        <span>Section E — Pedigree &amp; Parent Selection</span>
      </div>
      <p className="text-xs text-stone-500">
        Select existing registered animals to automatically build parent, grandparent, and great-grandparent lineage from verified records.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
          <label className="block text-xs font-bold text-stone-800">Sire (Father)</label>
          <select
            value={sireId}
            onChange={(e) => {
              setSireId(e.target.value);
              if (e.target.value) setExternalSireName('');
            }}
            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">-- Choose Registered Sire --</option>
            {potentialSires.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.primaryIdentifier || s.internalId})
              </option>
            ))}
          </select>
          <div className="text-[11px] text-stone-500 font-medium">Or enter external sire reference:</div>
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
          <label className="block text-xs font-bold text-stone-800">Dam (Mother)</label>
          <select
            value={damId}
            onChange={(e) => {
              setDamId(e.target.value);
              if (e.target.value) setExternalDamName('');
            }}
            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">-- Choose Registered Dam --</option>
            {potentialDams.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.primaryIdentifier || d.internalId})
              </option>
            ))}
          </select>
          <div className="text-[11px] text-stone-500 font-medium">Or enter external dam reference:</div>
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

        {setParentageNotes && (
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">Parentage Notes</label>
            <input
              type="text"
              value={parentageNotes}
              onChange={(e) => setParentageNotes(e.target.value)}
              placeholder="Additional pedigree details, registration lineage certificates, etc."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>
        )}
      </div>
    </div>
  );
}
