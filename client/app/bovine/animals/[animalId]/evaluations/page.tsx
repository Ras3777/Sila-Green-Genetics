'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  TrendingUp,
  Percent,
  Layers,
  ChevronRight,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';

export default function AnimalEvaluationsPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const {
    geneticTraitEstimates,
    geneticEvaluationRuns,
    traitDefinitions,
  } = useGenetics();

  const [selectedRunId, setSelectedRunId] = useState<string>(geneticEvaluationRuns[0]?.id || '');

  const animal = animals.find((a) => a.id === animalId);
  const estimates = geneticTraitEstimates.filter(
    (e) => e.animalId === animalId && (e.evaluationRunId === selectedRunId || e.runId === selectedRunId)
  );
  const activeRun = geneticEvaluationRuns.find((r) => r.id === selectedRunId) || geneticEvaluationRuns[0];

  if (!animal) {
    return <div className="p-8 text-stone-500">Animal record not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Genetic Evaluation Profile
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">Base: {activeRun?.geneticBase}</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-700" />
            EBVs, EPDs & Genomic Predictions
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Single-step genomic breeding values (GEBV) and expected progeny differences. Values are calculated relative to the active population base.
          </p>
        </div>

        {/* Evaluation Run Picker */}
        <div className="flex items-center space-x-2 text-xs shrink-0">
          <span className="font-semibold text-stone-600">Evaluation Run:</span>
          <select
            value={selectedRunId}
            onChange={(e) => setSelectedRunId(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 font-semibold cursor-pointer"
          >
            {geneticEvaluationRuns.map((run) => (
              <option key={run.id} value={run.id}>
                {run.runCode} ({run.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trait Estimates Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Trait</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Estimate Value</th>
                <th className="py-3 px-4">95% Confidence Interval</th>
                <th className="py-3 px-4">Reliability / Accuracy</th>
                <th className="py-3 px-4">Percentile Ranking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {estimates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    No trait estimates recorded for {animal.name} in evaluation run {activeRun?.runCode}.
                  </td>
                </tr>
              ) : (
                estimates.map((est) => {
                  const traitDef = traitDefinitions.find((t) => t.code === est.traitCode);
                  const isIntermediate = traitDef?.direction === 'INTERMEDIATE_OPTIMUM';

                  return (
                    <tr key={est.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{est.traitName}</div>
                        <div className="font-mono text-[10px] text-stone-500">
                          {est.traitCode} ({traitDef?.category})
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-stone-700">
                        {est.estimateType}
                      </td>

                      <td className="py-3.5 px-4">
                        <div
                          className={`font-mono font-bold text-base ${
                            isIntermediate
                              ? 'text-stone-900'
                              : est.value > 0
                              ? 'text-emerald-800'
                              : 'text-stone-700'
                          }`}
                        >
                          {est.value > 0 ? `+${est.value}` : est.value} {est.unit}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                        [{est.confidenceIntervalLower}, {est.confidenceIntervalUpper}] {est.unit}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">
                          {est.reliability ? `${est.reliability}% Rel` : `${(est.accuracy * 100).toFixed(0)}% Acc`}
                        </div>
                        <div className="w-24 bg-stone-200 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-700 h-full rounded-full"
                            style={{ width: `${est.reliability || est.accuracy * 100}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {est.percentile !== undefined ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              est.percentile <= 5
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : est.percentile <= 20
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            Top {est.percentile}%
                          </span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
