'use client';

import React from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { Sex, BirthOutcome } from '@/lib/bovine-types';
import { OffspringEntry } from '../_hooks/useNewCalvingWizard';

interface SectionNewbornOffspringProps {
  offspring: OffspringEntry[];
  onUpdateCalf: (idx: number, updates: Partial<OffspringEntry>) => void;
  onRemoveOffspring: (idx: number) => void;
}

export function SectionNewbornOffspring({
  offspring,
  onUpdateCalf,
  onRemoveOffspring,
}: SectionNewbornOffspringProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <span>3. Newborn Calf Registry ({offspring.length} {offspring.length === 1 ? 'Calf' : 'Calves'})</span>
        </h2>
      </div>

      {offspring.map((calf, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4 relative"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="font-bold text-sm text-stone-900">
                Offspring #{idx + 1} ({calf.sex})
              </span>
            </div>

            {offspring.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveOffspring(idx)}
                className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                title="Remove calf"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Calf Name / Registry Alias *
              </label>
              <input
                type="text"
                value={calf.name}
                onChange={(e) => onUpdateCalf(idx, { name: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ear Tag / Animal ID *
              </label>
              <input
                type="text"
                value={calf.tagNumber}
                onChange={(e) => onUpdateCalf(idx, { tagNumber: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Sex *
              </label>
              <select
                value={calf.sex}
                onChange={(e) => onUpdateCalf(idx, { sex: e.target.value as Sex })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
              >
                <option value="BULL">Bull (Male)</option>
                <option value="HEIFER">Heifer (Female)</option>
                <option value="STEER">Steer (Castrated)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Birth Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                value={calf.birthWeightKg}
                onChange={(e) => onUpdateCalf(idx, { birthWeightKg: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Coat Color
              </label>
              <input
                type="text"
                value={calf.coatColor}
                onChange={(e) => onUpdateCalf(idx, { coatColor: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Birth Outcome
              </label>
              <select
                value={calf.birthOutcome}
                onChange={(e) => onUpdateCalf(idx, { birthOutcome: e.target.value as BirthOutcome })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
              >
                <option value="LIVE">Live Birth</option>
                <option value="STILLBORN">Stillborn</option>
                <option value="DIED_NEONATAL">Died Neonatal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Classification / Purpose
              </label>
              <select
                value={calf.calfType}
                onChange={(e) => onUpdateCalf(idx, { calfType: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="Commercial Farm Stock">Commercial Farm Stock</option>
                <option value="Purebred Breeding Candidate">Purebred Breeding Candidate</option>
                <option value="Embryo Transfer Progeny">Embryo Transfer Progeny</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Neonatal Observations
              </label>
              <input
                type="text"
                value={calf.neonatalNotes}
                onChange={(e) => onUpdateCalf(idx, { neonatalNotes: e.target.value })}
                placeholder="Vigor, suckling response..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
