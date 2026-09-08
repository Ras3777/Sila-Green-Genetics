'use client';

import React, { useState, use } from 'react';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { ProgramHeaderNav } from '../program-nav';
import { Target, Sliders, CheckCircle2, AlertTriangle, Save, DollarSign } from 'lucide-react';

export default function ProgramObjectivesPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;

  const { breedingPrograms, updateBreedingProgram } = useBreeding();
  const program = breedingPrograms.find((p) => p.id === programId);

  const [objectiveType, setObjectiveType] = useState(program?.objectiveType || 'ECONOMIC');
  const [description, setDescription] = useState(program?.objectiveDescription || '');
  const [inbreedingPenaltyThreshold, setInbreedingPenaltyThreshold] = useState(6.25);
  const [maxCalvingDifficultyThreshold, setMaxCalvingDifficultyThreshold] = useState(8.0);
  const [targetGenerationIntervalYears, setTargetGenerationIntervalYears] = useState(2.4);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!program) return <div className="p-8 text-center text-stone-500">Program Not Found</div>;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBreedingProgram(program.id, {
      objectiveType: objectiveType as any,
      objectiveDescription: description,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <ProgramHeaderNav program={program} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Selection Objectives &amp; Optimization Bounds</h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Configure breeding goals, economic trait penalties, inbreeding safety ceilings, and targeted generation turn times.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Core Objective Configuration */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-stone-900">
            <Target className="w-4 h-4 text-emerald-800" />
            <span>1. Objective Paradigm</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Objective Type</label>
              <select
                value={objectiveType}
                onChange={(e) => setObjectiveType(e.target.value as any)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-700"
              >
                <option value="ECONOMIC">Economic Profitability (Net Lifetime Return)</option>
                <option value="TERMINAL">Terminal Carcass (Efficiency &amp; Grid Pricing)</option>
                <option value="MATERNAL">Maternal Stayability (Longevity &amp; Calving Ease)</option>
                <option value="BALANCED">Balanced Multi-Trait (Milk, Solids, Udder)</option>
                <option value="HEALTH_EFFICIENCY">Health &amp; Low Emission / Feed Efficiency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Target Generation Interval (Years)
              </label>
              <input
                type="number"
                step="0.1"
                value={targetGenerationIntervalYears}
                onChange={(e) => setTargetGenerationIntervalYears(Number(e.target.value))}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Objective Specification &amp; Selection Goals
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the multi-year genetic selection focus, targeted traits, and economic weighting rationale..."
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Penalty & Threshold Bounds */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-stone-900">
            <Sliders className="w-4 h-4 text-emerald-800" />
            <span>2. Optimization Constraints &amp; Hard Penalty Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                <span>Consanguinity / Inbreeding Threshold (F %)</span>
                <span className="font-mono text-emerald-800 font-bold">{inbreedingPenaltyThreshold}%</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Mating plans will reject or require manual technician override for any proposed mate pairing with expected F exceeding this threshold.
              </p>
              <input
                type="range"
                min="2.0"
                max="12.5"
                step="0.25"
                value={inbreedingPenaltyThreshold}
                onChange={(e) => setInbreedingPenaltyThreshold(Number(e.target.value))}
                className="w-full accent-emerald-800"
              />
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                <span>Max Sire Calving Difficulty EPD (% SCE)</span>
                <span className="font-mono text-emerald-800 font-bold">{maxCalvingDifficultyThreshold}%</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Sires exceeding this calving difficulty threshold cannot be allocated to maiden heifers in automated mate recommendation runs.
              </p>
              <input
                type="range"
                min="3.0"
                max="15.0"
                step="0.5"
                value={maxCalvingDifficultyThreshold}
                onChange={(e) => setMaxCalvingDifficultyThreshold(Number(e.target.value))}
                className="w-full accent-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="flex items-center space-x-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Program objectives updated successfully!</span>
            </span>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Objective Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
