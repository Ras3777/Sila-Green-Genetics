'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import {
  Sliders,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  ArrowRight,
} from 'lucide-react';

export default function SelectionIndexDetailPage({
  params,
}: {
  params: Promise<{ indexId: string }>;
}) {
  const resolvedParams = use(params);
  const { indexId } = resolvedParams;

  const { selectionIndexes, animalIndexResults } = useBreeding();
  const { animals } = useBovine();

  const indexObj = selectionIndexes.find((idx) => idx.id === indexId);
  const [selectedVersionIdx, setSelectedVersionIdx] = useState(0);

  if (!indexObj) {
    return (
      <div className="p-8 text-center text-stone-500">
        <h2 className="text-lg font-bold text-stone-900">Index Not Found</h2>
        <Link href="/bovine/selection-indexes" className="text-emerald-800 text-xs font-semibold mt-2 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const currentVer = indexObj.versions[selectedVersionIdx] || indexObj.versions[0];
  const components = currentVer?.components || [];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/bovine/selection-indexes"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Index Catalog</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {indexObj.code}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {indexObj.activeVersion}
              </span>
              <span className="text-xs text-stone-500">• Base Year: {currentVer?.baseYear || 2020}</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mt-1">{indexObj.name}</h1>
            <p className="text-xs text-stone-600 max-w-3xl leading-relaxed mt-0.5">{indexObj.purpose}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-500">Version:</span>
            <select
              value={selectedVersionIdx}
              onChange={(e) => setSelectedVersionIdx(Number(e.target.value))}
              className="text-xs border border-stone-300 rounded-lg p-2 bg-stone-50 font-semibold"
            >
              {indexObj.versions.map((v, i) => (
                <option key={v.id} value={i}>
                  {v.version} ({v.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Component Breakdown Cards */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Trait Weights &amp; Economic Values ({components.length} components)
          </h2>
          <span className="text-xs text-stone-500">
            Effective Date: {currentVer?.effectiveDate || '2026-01-01'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {components.map((comp) => {
            const pct = Math.round((comp.standardizedWeight || 0.2) * 100);
            return (
              <div
                key={comp.id}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-900 text-sm">{comp.traitName}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        comp.category === 'PRODUCTION'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comp.category === 'HEALTH'
                          ? 'bg-blue-100 text-blue-800'
                          : comp.category === 'FERTILITY'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {comp.category}
                    </span>
                  </div>

                  <div className="font-mono font-bold text-stone-900 text-sm">
                    {comp.direction === 'INCREASE' ? '+' : comp.direction === 'DECREASE' ? '-' : 'opt'}
                    {comp.weight}
                  </div>
                </div>

                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-800 rounded-full"
                    style={{ width: `${Math.max(pct, 8)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Economic Value: <strong>${comp.economicValue}/unit</strong></span>
                  <span>Standardized Emphasis: <strong>{pct}%</strong></span>
                  <span>Direction: <strong>{comp.direction}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evaluated Animal Candidates Table */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-800" />
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Top Ranked Animals on {indexObj.code}
            </h2>
          </div>
          <span className="text-xs text-stone-500">Live Evaluation Roster</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="p-3">Rank</th>
                <th className="p-3">Animal</th>
                <th className="p-3">Sex / Breed</th>
                <th className="p-3 font-mono">Index Score</th>
                <th className="p-3">Percentile</th>
                <th className="p-3">Reliability</th>
                <th className="p-3 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {animals.slice(0, 6).map((animal, rank) => {
                const res = animalIndexResults.find((r) => r.animalId === animal.id);
                const score = res?.score || (animal.sex === 'MALE' ? 880 - rank * 15 : 820 - rank * 12);
                const pct = res?.percentile || 99 - rank * 2;
                const rel = res?.reliability || 0.88;

                return (
                  <tr key={animal.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-stone-900">#{rank + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{animal.name}</div>
                      <div className="text-[11px] font-mono text-stone-500">{animal.primaryIdentifier}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-stone-800">{animal.sex}</span>
                      <span className="text-stone-400 ml-1.5">• {animal.breed}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-900 text-sm">
                      {score}
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                        Top {100 - pct}% ({pct}th)
                      </span>
                    </td>
                    <td className="p-3 font-mono text-stone-600">{(rel * 100).toFixed(0)}% Rel</td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/bovine/animals/${animal.id}`}
                        className="inline-flex items-center space-x-1 text-emerald-800 hover:text-emerald-700 font-semibold text-xs"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
