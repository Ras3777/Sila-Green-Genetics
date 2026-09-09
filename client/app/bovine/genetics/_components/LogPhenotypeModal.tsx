'use client';

import React from 'react';
import { Activity, X } from 'lucide-react';
import { Animal, TraitDefinition, ContemporaryGroup } from '@/lib/bovine-types';

interface LogPhenotypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  animals: Animal[];
  traitDefinitions: TraitDefinition[];
  contemporaryGroups: ContemporaryGroup[];
  newPhenoAnimalId: string;
  setNewPhenoAnimalId: (id: string) => void;
  newPhenoTraitId: string;
  setNewPhenoTraitId: (id: string) => void;
  newPhenoValue: string;
  setNewPhenoValue: (val: string) => void;
  newPhenoCgId: string;
  setNewPhenoCgId: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LogPhenotypeModal({
  isOpen,
  onClose,
  animals,
  traitDefinitions,
  contemporaryGroups,
  newPhenoAnimalId,
  setNewPhenoAnimalId,
  newPhenoTraitId,
  setNewPhenoTraitId,
  newPhenoValue,
  setNewPhenoValue,
  newPhenoCgId,
  setNewPhenoCgId,
  onSubmit,
}: LogPhenotypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">Record Phenotype Observation</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Animal</label>
            <select
              value={newPhenoAnimalId}
              onChange={(e) => setNewPhenoAnimalId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.primaryIdentifier || a.internalId})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Trait Definition</label>
              <select
                value={newPhenoTraitId}
                onChange={(e) => setNewPhenoTraitId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {traitDefinitions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code} - {t.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Raw Value</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 42.5"
                value={newPhenoValue}
                onChange={(e) => setNewPhenoValue(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Contemporary Group</label>
            <select
              value={newPhenoCgId}
              onChange={(e) => setNewPhenoCgId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {contemporaryGroups.map((cg) => (
                <option key={cg.id} value={cg.id}>
                  {cg.name} ({cg.code})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 shadow-sm cursor-pointer"
            >
              Save Observation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
