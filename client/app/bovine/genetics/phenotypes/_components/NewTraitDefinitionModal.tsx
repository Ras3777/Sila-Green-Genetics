'use client';

import React from 'react';
import { X } from 'lucide-react';
import { TraitDefinition } from '@/lib/bovine-types';

interface NewTraitDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newTraitCode: string;
  setNewTraitCode: (val: string) => void;
  newTraitCategory: TraitDefinition['category'];
  setNewTraitCategory: (val: TraitDefinition['category']) => void;
  newTraitName: string;
  setNewTraitName: (val: string) => void;
  newTraitUnit: string;
  setNewTraitUnit: (val: string) => void;
  newTraitHeritability: string;
  setNewTraitHeritability: (val: string) => void;
  newTraitDirection: TraitDefinition['direction'];
  setNewTraitDirection: (val: TraitDefinition['direction']) => void;
  newTraitMin: string;
  setNewTraitMin: (val: string) => void;
  newTraitMax: string;
  setNewTraitMax: (val: string) => void;
  newTraitDesc: string;
  setNewTraitDesc: (val: string) => void;
}

export function NewTraitDefinitionModal({
  isOpen,
  onClose,
  onSubmit,
  newTraitCode,
  setNewTraitCode,
  newTraitCategory,
  setNewTraitCategory,
  newTraitName,
  setNewTraitName,
  newTraitUnit,
  setNewTraitUnit,
  newTraitHeritability,
  setNewTraitHeritability,
  newTraitDirection,
  setNewTraitDirection,
  newTraitMin,
  setNewTraitMin,
  newTraitMax,
  setNewTraitMax,
  newTraitDesc,
  setNewTraitDesc,
}: NewTraitDefinitionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-base font-bold text-stone-900">Add Trait Definition</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Trait Code</label>
              <input
                type="text"
                required
                placeholder="e.g. IMF"
                value={newTraitCode}
                onChange={(e) => setNewTraitCode(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 uppercase font-mono font-bold text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Category</label>
              <select
                value={newTraitCategory}
                onChange={(e) => setNewTraitCategory(e.target.value as TraitDefinition['category'])}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              >
                <option value="GROWTH">GROWTH</option>
                <option value="EFFICIENCY">EFFICIENCY</option>
                <option value="MILK">MILK</option>
                <option value="CARCASS">CARCASS</option>
                <option value="REPRODUCTION">REPRODUCTION</option>
                <option value="HEALTH">HEALTH</option>
                <option value="CONFORMATION">CONFORMATION</option>
                <option value="TEMPERAMENT">TEMPERAMENT</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Trait Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Intramuscular Fat Percentage"
              value={newTraitName}
              onChange={(e) => setNewTraitName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Unit</label>
              <input
                type="text"
                required
                placeholder="e.g. % or kg"
                value={newTraitUnit}
                onChange={(e) => setNewTraitUnit(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Heritability (h²)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={newTraitHeritability}
                onChange={(e) => setNewTraitHeritability(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Desirable Direction</label>
              <select
                value={newTraitDirection}
                onChange={(e) => setNewTraitDirection(e.target.value as TraitDefinition['direction'])}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              >
                <option value="INCREASE">INCREASE</option>
                <option value="DECREASE">DECREASE</option>
                <option value="INTERMEDIATE_OPTIMUM">INTERMEDIATE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Min Valid Value</label>
              <input
                type="number"
                step="any"
                placeholder="Lower biological limit"
                value={newTraitMin}
                onChange={(e) => setNewTraitMin(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Max Valid Value</label>
              <input
                type="number"
                step="any"
                placeholder="Upper biological limit"
                value={newTraitMax}
                onChange={(e) => setNewTraitMax(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Description</label>
            <textarea
              rows={2}
              placeholder="Biological definition and standardization guidelines"
              value={newTraitDesc}
              onChange={(e) => setNewTraitDesc(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
            >
              Create Trait
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
