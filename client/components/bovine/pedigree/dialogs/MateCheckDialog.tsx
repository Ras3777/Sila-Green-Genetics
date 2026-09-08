'use client';

import React, { useState } from 'react';
import {
  X,
  Heart,
  AlertTriangle,
  ShieldCheck,
  Crown,
  Dna,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Animal, Parentage } from '@/lib/bovine-types';
import { analyzePotentialMating } from '@/lib/bovine-pedigree-utils';

interface MateCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rootAnimal: Animal;
  allAnimals: Animal[];
  parentages: Record<string, Parentage>;
}

export default function MateCheckDialog({
  isOpen,
  onClose,
  rootAnimal,
  allAnimals,
  parentages,
}: MateCheckDialogProps) {
  const isMale = rootAnimal.sex === 'MALE';
  const eligibleMates = allAnimals.filter(
    (a) => a.sex !== rootAnimal.sex && a.id !== rootAnimal.id
  );

  const [selectedMateId, setSelectedMateId] = useState<string>(
    eligibleMates[0]?.id || ''
  );

  if (!isOpen) return null;

  const mateAnimal = allAnimals.find((a) => a.id === selectedMateId);
  const sire = isMale ? rootAnimal : mateAnimal;
  const dam = isMale ? mateAnimal : rootAnimal;

  const analysis =
    sire && dam
      ? analyzePotentialMating(sire, dam, allAnimals, parentages)
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-800">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Potential Mating & Inbreeding Compatibility
              </h3>
              <p className="text-stone-500 text-xs">
                Pairing analysis for {rootAnimal.name} ({rootAnimal.sex})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
          {/* Mate Selector */}
          <div>
            <label className="block font-bold text-stone-900 mb-1.5">
              Select Proposed {isMale ? 'Dam (Cow/Heifer)' : 'Sire (Bull)'}:
            </label>
            <select
              value={selectedMateId}
              onChange={(e) => setSelectedMateId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 cursor-pointer focus:ring-2 focus:ring-purple-600/30"
            >
              {eligibleMates.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.primaryIdentifier || m.internalId}) — {(m as any).breed || 'Purebred'}
                </option>
              ))}
            </select>
          </div>

          {analysis && (
            <>
              {/* Top KPI Box: Projected Inbreeding F */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  analysis.inbreedingRisk === 'HIGH'
                    ? 'bg-red-50 border-red-200 text-red-950'
                    : analysis.inbreedingRisk === 'ELEVATED'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                    Projected Offspring Inbreeding (F)
                  </div>
                  <div className="text-2xl font-bold font-mono mt-0.5">
                    {(analysis.projectedInbreedingF * 100).toFixed(2)}%
                  </div>
                  <div className="text-[11px] font-semibold mt-1">
                    Risk Level: {analysis.inbreedingRisk}
                  </div>
                </div>

                <div className="text-right text-[11px] space-y-1">
                  <div>
                    Sire: <span className="font-bold">{analysis.sire.name}</span>
                  </div>
                  <div>
                    Dam: <span className="font-bold">{analysis.dam.name}</span>
                  </div>
                </div>
              </div>

              {/* Genetic Condition Collision Check */}
              <div className="space-y-2">
                <div className="font-bold text-stone-900 flex items-center justify-between">
                  <span>Recessive Lethal Defect Collisions</span>
                  <span className="text-[10px] text-stone-400">Carrier × Carrier Check</span>
                </div>

                <div className="space-y-1.5">
                  {analysis.conditionCollisions.map((c) => (
                    <div
                      key={c.conditionCode}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        c.riskLevel === 'CRITICAL'
                          ? 'bg-red-50 border-red-300 text-red-950'
                          : c.riskLevel === 'WARNING'
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-stone-50 border-stone-200/80 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1.5">
                          {c.riskLevel === 'CRITICAL' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          <span>
                            {c.conditionCode} — {c.conditionName}
                          </span>
                        </div>
                        <div className="text-[10px] opacity-75 mt-0.5">
                          Sire: {c.sireStatus} • Dam: {c.damStatus}
                        </div>
                      </div>

                      <div className="text-right">
                        {c.affectedProbabilityPct > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[10px]">
                            {c.affectedProbabilityPct}% Affected Risk!
                          </span>
                        ) : c.carrierProbabilityPct > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                            50% Carrier Calf
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            0% Risk (Free)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trait Complementarity Mid-Parent Projection */}
              <div className="space-y-2">
                <div className="font-bold text-stone-900">Projected Offspring EPD Values</div>
                <div className="grid grid-cols-2 gap-2">
                  {analysis.complementarityTraits.map((t) => (
                    <div
                      key={t.traitCode}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80"
                    >
                      <div className="font-bold text-stone-900">{t.traitName}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-stone-400 text-[10px]">Mid-Parent:</span>
                        <span className="font-mono font-bold text-emerald-800">
                          {t.projectedValue > 0 ? '+' : ''}
                          {t.projectedValue} {t.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
