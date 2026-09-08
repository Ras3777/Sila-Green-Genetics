'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  TrendingUp,
  Milk,
  Scale,
  Calendar,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ animalId: string }>;
}

export default function Animal360ProductionPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const {
    animals,
    productionPeriods,
    productionRecords,
  } = useBovine();

  const animal = animals.find((a) => a.id === animalId);
  const myPeriods = productionPeriods.filter((p) => p.animalId === animalId);
  const myRecords = productionRecords.filter((r) => r.animalId === animalId);

  const activePeriod = myPeriods.find((p) => p.status === 'ACTIVE');

  if (!animal) return null;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Yield & Growth Trajectory</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900">Production Performance: {animal.name}</h2>
          <p className="text-xs text-stone-500">
            Official milk test day component records, lactation persistency, and body weight scale logs.
          </p>
        </div>

        <Link
          href="/bovine/production/records"
          className="inline-flex items-center px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Log Production
        </Link>
      </div>

      {/* Active Lactation Summary (if milking) */}
      {activePeriod && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 text-sm flex items-center">
              <Milk className="w-4 h-4 mr-1.5 text-emerald-700" />
              Active {(activePeriod.periodType || activePeriod.type || 'LACTATION').replace(/_/g, ' ')} #{activePeriod.cycleNumber ?? activePeriod.sequence ?? 1}
            </span>
            <span className="font-mono text-xs font-bold text-emerald-800">
              Started: {activePeriod.startDate || (activePeriod.startedAt ? activePeriod.startedAt.split('T')[0] : '—')}
            </span>
          </div>
          <p className="text-xs text-emerald-800">
            Currently on test in high-production dairy milking string.
          </p>
        </div>
      )}

      {/* Records Ledger */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900">
          Recorded Production Samples ({myRecords.length})
        </h3>

        {myRecords.length === 0 ? (
          <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <Milk className="w-8 h-8 text-stone-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-stone-800">No Production Samples Recorded</p>
            <p className="text-[11px] text-stone-400">Click Log Production to enter test day milk yields or weights.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Yield / Weight</th>
                  <th className="py-3 px-3">Fat %</th>
                  <th className="py-3 px-3">Protein %</th>
                  <th className="py-3 px-3">SCC (x1000)</th>
                  <th className="py-3 px-3">DIM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {myRecords.map((r) => {
                  const recordType = r.recordType || r.type || 'RECORD';
                  const recordDate = r.recordDate || (r.recordedAt ? r.recordedAt.split('T')[0] : '—');
                  const milkYield = r.milkYieldKg ?? (recordType === 'MILK_TEST_DAY' || r.type === 'MILK_YIELD' ? r.value : undefined);
                  const bodyWeight = r.bodyWeightKg ?? (recordType === 'BEEF_WEIGHT' || r.type === 'BODY_WEIGHT' ? r.value : undefined);
                  const fatPct = r.fatPercentage ?? (r.type === 'MILK_FAT_PCT' ? r.value : undefined);
                  const proPct = r.proteinPercentage ?? (r.type === 'MILK_PROTEIN_PCT' ? r.value : undefined);
                  const scc = r.somaticCellCount ?? (r.type === 'SOMATIC_CELL_COUNT' ? r.value : undefined);

                  return (
                    <tr key={r.id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3 font-mono text-stone-500">{recordDate}</td>
                      <td className="py-2.5 px-3 font-semibold text-stone-800">
                        {recordType.replace(/_/g, ' ')}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                        {milkYield !== undefined ? `${milkYield} kg` : bodyWeight !== undefined ? `${bodyWeight} kg` : '—'}
                      </td>
                      <td className="py-2.5 px-3 font-mono">{fatPct !== undefined ? `${fatPct}%` : '—'}</td>
                      <td className="py-2.5 px-3 font-mono">{proPct !== undefined ? `${proPct}%` : '—'}</td>
                      <td className="py-2.5 px-3 font-mono">{scc || '—'}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-600">{r.daysInMilk ? `${r.daysInMilk}d` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
