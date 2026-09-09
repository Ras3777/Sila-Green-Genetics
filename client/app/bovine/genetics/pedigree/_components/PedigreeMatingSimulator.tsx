'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface PedigreeMatingSimulatorProps {
  animals: Animal[];
  matingSireId: string;
  onSelectSire: (id: string) => void;
  matingDamId: string;
  onSelectDam: (id: string) => void;
  simulatedInbreeding: {
    f: string;
    risk: string;
    reason: string;
  };
}

export function PedigreeMatingSimulator({
  animals,
  matingSireId,
  onSelectSire,
  matingDamId,
  onSelectDam,
  simulatedInbreeding,
}: PedigreeMatingSimulatorProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Simulated Mating Inbreeding Predictor
            </h3>
            <p className="text-xs text-stone-500">
              Evaluate prospective mating coefficient (F) and carrier clash risks before breeding.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          Wright-Meuwissen Coancestry
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-stone-700">Proposed Sire (Paternal)</label>
          <select
            value={matingSireId}
            onChange={(e) => onSelectSire(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            {animals
              .filter((a) => a.sex === 'MALE')
              .map((sire) => (
                <option key={sire.id} value={sire.id}>
                  {sire.name} ({sire.primaryIdentifier || sire.internalId})
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-stone-700">Proposed Dam (Maternal)</label>
          <select
            value={matingDamId}
            onChange={(e) => onSelectDam(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            {animals
              .filter((a) => a.sex === 'FEMALE')
              .map((dam) => (
                <option key={dam.id} value={dam.id}>
                  {dam.name} ({dam.primaryIdentifier || dam.internalId})
                </option>
              ))}
          </select>
        </div>

        {/* Outcome card */}
        <div
          className={`p-3 rounded-xl border ${
            simulatedInbreeding.risk === 'HIGH'
              ? 'border-rose-200 bg-rose-50'
              : simulatedInbreeding.risk === 'MODERATE'
              ? 'border-amber-200 bg-amber-50'
              : 'border-emerald-200 bg-emerald-50'
          } space-y-1`}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[11px]">Projected Offspring F</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                simulatedInbreeding.risk === 'HIGH'
                  ? 'bg-rose-200 text-rose-900'
                  : simulatedInbreeding.risk === 'MODERATE'
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}
            >
              {simulatedInbreeding.risk} RISK
            </span>
          </div>
          <div className="text-xl font-bold text-stone-900">
            {simulatedInbreeding.f}
          </div>
          <p className="text-[10px] text-stone-600 leading-tight">
            {simulatedInbreeding.reason}
          </p>
        </div>
      </div>
    </div>
  );
}
