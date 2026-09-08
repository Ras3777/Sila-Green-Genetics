'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Plus,
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';

export default function AnimalPhenotypesPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const { phenotypeObservations, traitDefinitions, contemporaryGroups } = useGenetics();

  const animal = animals.find((a) => a.id === animalId);
  const observations = phenotypeObservations.filter((p) => p.animalId === animalId);

  if (!animal) {
    return <div className="p-8 text-stone-500">Animal record not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Phenotype Provenance
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">{observations.length} Recorded Traits</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            Phenotypes & Performance Observations
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Certified phenotypic records with contemporary group stratification, technician provenance, and environmental adjustment factors.
          </p>
        </div>

        <Link
          href="/bovine/genetics/phenotypes"
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Phenotype</span>
        </Link>
      </div>

      {/* Observations Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Trait</th>
                <th className="py-3 px-4">Raw Measured Value</th>
                <th className="py-3 px-4">Standardized / Adjusted</th>
                <th className="py-3 px-4">Contemporary Group</th>
                <th className="py-3 px-4">Measurement Method / SOP</th>
                <th className="py-3 px-4">Date & Technician</th>
                <th className="py-3 px-4">Data Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {observations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No phenotype observations logged yet for {animal.name}.
                  </td>
                </tr>
              ) : (
                observations.map((obs) => {
                  const traitDef = traitDefinitions.find((t) => t.code === obs.traitCode);
                  return (
                    <tr key={obs.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{obs.traitName}</div>
                        <div className="font-mono text-[10px] text-stone-500">
                          {obs.traitCode} ({traitDef?.category})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-900 text-sm">
                          {obs.rawValue} {obs.unit}
                        </div>
                        {obs.deviceModel && (
                          <div className="text-[10px] text-stone-500">
                            Device: {obs.deviceModel}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {obs.adjustedValue !== undefined ? (
                          <div>
                            <div className="font-mono font-bold text-emerald-800">
                              {obs.adjustedValue} {obs.unit}
                            </div>
                            <div className="text-[10px] text-stone-500">
                              {obs.adjustmentReason || 'Age/Season Adjusted'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">Unadjusted</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {obs.contemporaryGroupName || obs.contemporaryGroupCode ? (
                          <span className="font-mono font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                            {obs.contemporaryGroupName || obs.contemporaryGroupCode}
                          </span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800">
                          {obs.measurementMethodName || obs.methodName || obs.measurementMethodCode}
                        </div>
                        <div className="text-[10px] text-stone-500">SOP Standardized</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-stone-900">
                          {obs.observedDate || obs.observationDate}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          By {obs.observerName || obs.recordedBy}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            obs.qualityStatus === 'VALIDATED' || obs.qualityStatus === 'CERTIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : obs.qualityStatus === 'SUSPECT' || obs.qualityStatus === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {obs.qualityStatus}
                        </span>
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
