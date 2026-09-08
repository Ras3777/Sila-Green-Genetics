'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ShieldAlert,
  GitCompare,
  Percent,
  X,
  HelpCircle,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { GeneticEvaluationRun, GeneticTraitEstimate } from '@/lib/bovine-types';

export default function GeneticEvaluationsPage() {
  const { animals } = useBovine();
  const {
    geneticEvaluationRuns,
    geneticTraitEstimates,
    traitDefinitions,
    publishEvaluationRun,
  } = useGenetics();

  const [selectedRunId, setSelectedRunId] = useState<string>(geneticEvaluationRuns[0]?.id || '');
  const [estimateTypeFilter, setEstimateTypeFilter] = useState('ALL');
  const [traitFilter, setTraitFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [compareRunId, setCompareRunId] = useState<string>(geneticEvaluationRuns[1]?.id || '');

  const selectedRun = geneticEvaluationRuns.find((r) => r.id === selectedRunId) || geneticEvaluationRuns[0];
  const comparisonRun = geneticEvaluationRuns.find((r) => r.id === compareRunId);

  // Estimates filtered for the active run
  const runEstimates = useMemo(() => {
    return geneticTraitEstimates.filter((est) => {
      const matchesRun = (est.evaluationRunId || est.runId) === selectedRun?.id;
      if (!matchesRun) return false;
      if (estimateTypeFilter !== 'ALL' && est.estimateType !== estimateTypeFilter) return false;
      if (traitFilter !== 'ALL' && est.traitCode !== traitFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return Boolean(
          est.animalName?.toLowerCase().includes(q) ||
          est.traitName?.toLowerCase().includes(q) ||
          est.traitCode?.toLowerCase().includes(q) ||
          est.animalIdentifier?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [geneticTraitEstimates, selectedRun, estimateTypeFilter, traitFilter, searchQuery]);

  // Check if compared runs have incompatible bases
  const hasBaseMismatch = compareMode && selectedRun && comparisonRun && selectedRun.geneticBase !== comparisonRun.geneticBase;

  return (
    <div className="space-y-6">
      {/* Top Banner Notice: Genetic Base Principle */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Genetic Evaluation Engine
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">SSGBLUP / Interbull MACE</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-700" />
            Genetic Evaluations, EBVs, EPDs & GEBVs
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            National and in-herd genetic predictions. Enforces strict base provenance:
            every estimated breeding value reflects its methodology (Single-Step GBLUP vs Pedigree BLUP), genetic base year, and reliability.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              compareMode
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>{compareMode ? 'Exit Run Comparison' : 'Compare Two Runs'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Warning if incompatible bases */}
      {hasBaseMismatch && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start space-x-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Incompatible Evaluation Genetic Bases Detected</span>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              <strong>{selectedRun?.runCode}</strong> uses base <code>{selectedRun?.geneticBase}</code> while{' '}
              <strong>{comparisonRun?.runCode}</strong> uses base <code>{comparisonRun?.geneticBase}</code>.
              Directly plotting or ranking these values without statistical normalization creates false breeding conclusions.
            </p>
          </div>
        </div>
      )}

      {/* Runs Selector Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {geneticEvaluationRuns.map((run) => {
          const isSelected = run.id === selectedRun?.id;
          return (
            <div
              key={run.id}
              onClick={() => setSelectedRunId(run.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2.5 ${
                isSelected
                  ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                  : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                  {run.runCode}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    run.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {run.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm">{run.name}</h4>
                <div className="text-[11px] text-stone-500 mt-0.5 font-mono">
                  Base: {run.geneticBase}
                </div>
              </div>

              <div className="text-[11px] text-stone-600 pt-1 border-t border-stone-100 flex items-center justify-between">
                <span>{run.methodology}</span>
                <span className="font-semibold">{run.traitsEvaluated?.length ?? run.traitCount} Traits</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimates Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by animal or trait..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <select
            value={estimateTypeFilter}
            onChange={(e) => setEstimateTypeFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-stone-800 font-medium cursor-pointer"
          >
            <option value="ALL">All Estimate Types (GEBV / EPD / EBV)</option>
            <option value="GEBV">Genomic EBV (GEBV)</option>
            <option value="EPD">Expected Progeny Difference (EPD)</option>
            <option value="EBV">Estimated Breeding Value (EBV)</option>
            <option value="DGV">Direct Genomic Value (DGV)</option>
          </select>

          <select
            value={traitFilter}
            onChange={(e) => setTraitFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-stone-800 font-medium cursor-pointer"
          >
            <option value="ALL">All Traits</option>
            {traitDefinitions.map((t) => (
              <option key={t.id} value={t.code}>
                {t.name} ({t.code})
              </option>
            ))}
          </select>
        </div>

        {compareMode && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-600">Compare Against:</span>
            <select
              value={compareRunId}
              onChange={(e) => setCompareRunId(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-stone-800 font-medium cursor-pointer"
            >
              {geneticEvaluationRuns
                .filter((r) => r.id !== selectedRun?.id)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.runCode} ({r.name})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Trait Estimates Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Animal</th>
                <th className="py-3 px-4">Trait</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Estimate Value</th>
                <th className="py-3 px-4">Accuracy / Reliability</th>
                <th className="py-3 px-4">Percentile Rank</th>
                <th className="py-3 px-4">Evaluation Run</th>
                {compareMode && <th className="py-3 px-4">Comparison Run Estimate</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {runEstimates.length === 0 ? (
                <tr>
                  <td colSpan={compareMode ? 8 : 7} className="py-8 text-center text-stone-500">
                    No trait estimates found matching your filters for this evaluation run.
                  </td>
                </tr>
              ) : (
                runEstimates.map((est) => {
                  const traitDef = traitDefinitions.find((t) => t.code === est.traitCode);
                  const isIntermediate = traitDef?.direction === 'INTERMEDIATE_OPTIMUM';

                  // If compare mode is active, search for animal's estimate in comparison run
                  const compEstimate = compareMode
                    ? geneticTraitEstimates.find(
                        (ce) =>
                          (ce.evaluationRunId === compareRunId || ce.runId === compareRunId) &&
                          ce.animalId === est.animalId &&
                          ce.traitCode === est.traitCode
                      )
                    : null;

                  const ciLower = est.confidenceIntervalLower ?? Number((est.value - 1.96 * (1 - est.accuracy) * 2).toFixed(2));
                  const ciUpper = est.confidenceIntervalUpper ?? Number((est.value + 1.96 * (1 - est.accuracy) * 2).toFixed(2));
                  const relPct = est.reliabilityPct ?? est.reliability ?? Math.round(est.accuracy * 100);

                  return (
                    <tr key={est.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Animal */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{est.animalName}</div>
                        <div className="font-mono text-[10px] text-stone-500">
                          {est.animalIdentifier}
                        </div>
                      </td>

                      {/* Trait */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{est.traitName}</div>
                        <div className="font-mono text-[10px] text-stone-500">
                          {est.traitCode} ({traitDef?.unit || est.unit})
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4 font-mono font-bold text-stone-700">
                        {est.estimateType}
                      </td>

                      {/* Estimate Value */}
                      <td className="py-3 px-4">
                        <div
                          className={`font-mono text-sm font-bold ${
                            isIntermediate
                              ? 'text-stone-900'
                              : est.value > 0
                              ? 'text-emerald-800'
                              : 'text-stone-700'
                          }`}
                        >
                          {est.value > 0 ? `+${est.value}` : est.value} {est.unit}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          95% CI: [{ciLower}, {ciUpper}]
                        </div>
                      </td>

                      {/* Accuracy / Reliability */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">
                          {relPct}% Rel
                        </div>
                        <div className="w-24 bg-stone-200 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-700 h-full rounded-full"
                            style={{ width: `${relPct}%` }}
                          />
                        </div>
                      </td>

                      {/* Percentile Rank */}
                      <td className="py-3 px-4">
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

                      {/* Run Code */}
                      <td className="py-3 px-4 font-mono text-[10px] text-stone-600">
                        {selectedRun?.runCode}
                      </td>

                      {/* Comparison Run Estimate Column */}
                      {compareMode && (
                        <td className="py-3 px-4">
                          {compEstimate ? (
                            <div>
                              <div className="font-mono font-bold text-stone-900">
                                {compEstimate.value > 0 ? `+${compEstimate.value}` : compEstimate.value}{' '}
                                {compEstimate.unit}
                              </div>
                              <div className="text-[10px] text-stone-500">
                                Shift:{' '}
                                <span
                                  className={`font-bold ${
                                    est.value - compEstimate.value >= 0
                                      ? 'text-emerald-800'
                                      : 'text-rose-800'
                                  }`}
                                >
                                  {(est.value - compEstimate.value).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-stone-400 italic">Not evaluated in this run</span>
                          )}
                        </td>
                      )}
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
