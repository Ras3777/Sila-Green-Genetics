'use client';

import React from 'react';
import { Activity, X } from 'lucide-react';
import { Animal, TraitDefinition, MeasurementMethod, ContemporaryGroup } from '@/lib/bovine-types';

interface RecordPhenotypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  animals: Animal[];
  traitDefinitions: TraitDefinition[];
  measurementMethods: MeasurementMethod[];
  contemporaryGroups: ContemporaryGroup[];
  selectedTraitForObs?: TraitDefinition;
  obsAnimalId: string;
  setObsAnimalId: (id: string) => void;
  obsTraitId: string;
  setObsTraitId: (id: string) => void;
  obsRawValue: string;
  setObsRawValue: (val: string) => void;
  obsAdjustedValue: string;
  setObsAdjustedValue: (val: string) => void;
  obsAdjustmentReason: string;
  setObsAdjustmentReason: (val: string) => void;
  obsMethodId: string;
  setObsMethodId: (id: string) => void;
  obsCgId: string;
  setObsCgId: (id: string) => void;
  obsNotes: string;
  setObsNotes: (val: string) => void;
}

export function RecordPhenotypeModal({
  isOpen,
  onClose,
  onSubmit,
  animals,
  traitDefinitions,
  measurementMethods,
  contemporaryGroups,
  selectedTraitForObs,
  obsAnimalId,
  setObsAnimalId,
  obsTraitId,
  setObsTraitId,
  obsRawValue,
  setObsRawValue,
  obsAdjustedValue,
  setObsAdjustedValue,
  obsAdjustmentReason,
  setObsAdjustmentReason,
  obsMethodId,
  setObsMethodId,
  obsCgId,
  setObsCgId,
  obsNotes,
  setObsNotes,
}: RecordPhenotypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">Record Phenotypic Observation</h3>
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
              value={obsAnimalId}
              onChange={(e) => setObsAnimalId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.primaryIdentifier || a.internalId}) - {a.sex}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Trait</label>
              <select
                value={obsTraitId}
                onChange={(e) => setObsTraitId(e.target.value)}
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
              <label className="font-semibold text-stone-700">
                Raw Value ({selectedTraitForObs?.unit})
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder={`Expected: ${selectedTraitForObs?.minValidValue || ''} - ${selectedTraitForObs?.maxValidValue || ''}`}
                value={obsRawValue}
                onChange={(e) => setObsRawValue(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">
                Adjusted Value (Optional)
              </label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 205-day or ME adjusted"
                value={obsAdjustedValue}
                onChange={(e) => setObsAdjustedValue(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Adjustment Formula/Reason</label>
              <input
                type="text"
                placeholder="e.g. BIF 205-day Age of Dam +8.5kg"
                value={obsAdjustmentReason}
                onChange={(e) => setObsAdjustmentReason(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Measurement Method</label>
              <select
                value={obsMethodId}
                onChange={(e) => setObsMethodId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {measurementMethods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Contemporary Group</label>
              <select
                value={obsCgId}
                onChange={(e) => setObsCgId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {contemporaryGroups.map((cg) => (
                  <option key={cg.id} value={cg.id}>
                    {cg.code} - {cg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Assessor / Notes</label>
            <input
              type="text"
              placeholder="Technician initials and field conditions"
              value={obsNotes}
              onChange={(e) => setObsNotes(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
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
