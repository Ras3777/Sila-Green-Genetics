'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  TrendingUp,
  Milk,
  Scale,
  Calendar,
  Search,
  ArrowRight,
  Plus,
  Filter,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  BarChart2,
  Layers,
} from 'lucide-react';

export default function BovineProductionDashboard() {
  const {
    session,
    farms,
    animals,
    productionPeriods,
    productionRecords,
  } = useBovine();

  const [filterFarmId, setFilterFarmId] = useState<string>('ALL');

  const effectiveFarmId = session.activeFarmId !== 'ALL' ? session.activeFarmId : filterFarmId;
  const filteredAnimals = animals.filter(
    (a) => effectiveFarmId === 'ALL' || a.farmId === effectiveFarmId
  );
  const animalIds = new Set(filteredAnimals.map((a) => a.id));

  const scopedPeriods = productionPeriods.filter((p) => animalIds.has(p.animalId));
  const activePeriods = scopedPeriods.filter((p) => p.status === 'ACTIVE');
  const scopedRecords = productionRecords.filter((r) => animalIds.has(r.animalId));

  // Compute total milk yield from records
  const totalMilkKg = scopedRecords
    .filter((r) => {
      const recType = r.recordType || r.type;
      return (recType === 'MILK_TEST_DAY' || r.type === 'MILK_YIELD') && (r.milkYieldKg || (r.type === 'MILK_YIELD' ? r.value : 0));
    })
    .reduce((acc, curr) => acc + (curr.milkYieldKg || (curr.type === 'MILK_YIELD' ? curr.value : 0) || 0), 0);

  // Compute average daily gain from beef growth records
  const adgRecords = scopedRecords.filter(
    (r) => (r.dailyGainKg && r.dailyGainKg > 0) || (r.type === 'AVERAGE_DAILY_GAIN' && (r.value ?? 0) > 0)
  );
  const avgADG =
    adgRecords.length > 0
      ? (
          adgRecords.reduce(
            (acc, curr) => acc + (curr.dailyGainKg || (curr.type === 'AVERAGE_DAILY_GAIN' ? curr.value : 0) || 0),
            0
          ) / adgRecords.length
        ).toFixed(2)
      : '1.45';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Yield, Milk Recording & Growth</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Production & Performance
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Test day milk component analysis, lactation persistency cycles, beef feedlot average daily gain (ADG), and growth curves.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {session.activeFarmId === 'ALL' && (
            <select
              value={filterFarmId}
              onChange={(e) => setFilterFarmId(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="ALL">All Facilities</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}

          <Link
            href="/bovine/production/records"
            className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Log Production Record
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Active Lactations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Milk className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {activePeriods.filter((p) => (p.periodType || p.type) === 'LACTATION').length}
            </span>
            <span className="text-xs text-emerald-700 font-medium">milking</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Cows in active lactation curve</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Test Day Milk Yield</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {totalMilkKg.toFixed(1)}
            </span>
            <span className="text-xs text-stone-400 font-medium">kg recorded</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Sum across recent milk test days</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Beef Average Daily Gain</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {avgADG}
            </span>
            <span className="text-xs text-amber-800 font-medium">kg / day</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Feedlot cohort growth rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Production Records</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {scopedRecords.length}
            </span>
            <span className="text-xs text-purple-700 font-medium">logged</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Weights, milk samples & carcass data</p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/bovine/production/periods"
          className="bg-white p-5 rounded-3xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex items-center space-x-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Production Periods</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Lactations, backgrounding cycles, dry periods ({scopedPeriods.length} cycles)
            </p>
          </div>
        </Link>

        <Link
          href="/bovine/production/records"
          className="bg-white p-5 rounded-3xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex items-center space-x-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center shrink-0">
            <Milk className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Production Records</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Milk test day logs, component fat/protein %, scale weights
            </p>
          </div>
        </Link>

        <Link
          href="/bovine/production/trends"
          className="bg-white p-5 rounded-3xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex items-center space-x-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Yield & Growth Curves</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Lactation curves and feed conversion growth benchmarks
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Production Entries Table */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">Recent Test Day & Weight Logs</h2>
          <Link
            href="/bovine/production/records"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
          >
            <span>Full Ledger</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          {scopedRecords.slice(0, 5).map((r) => {
            const anim = animals.find((a) => a.id === r.animalId);
            const recordType = r.recordType || r.type || 'PRODUCTION_RECORD';
            const recordDate = r.recordDate || (r.recordedAt ? r.recordedAt.split('T')[0] : '—');
            const isMilk = recordType === 'MILK_TEST_DAY' || r.type === 'MILK_YIELD' || r.type === 'MILK_FAT_PCT' || r.type === 'SOMATIC_CELL_COUNT';
            const milkYield = r.milkYieldKg ?? (recordType === 'MILK_TEST_DAY' || r.type === 'MILK_YIELD' ? r.value : undefined);
            const bodyWeight = r.bodyWeightKg ?? (recordType === 'BEEF_WEIGHT' || r.type === 'BODY_WEIGHT' ? r.value : undefined);
            const dailyGain = r.dailyGainKg ?? (r.type === 'AVERAGE_DAILY_GAIN' ? r.value : undefined);
            const fatPct = r.fatPercentage ?? (r.type === 'MILK_FAT_PCT' ? r.value : undefined);
            const proPct = r.proteinPercentage ?? (r.type === 'MILK_PROTEIN_PCT' ? r.value : undefined);

            return (
              <div key={r.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold shrink-0">
                    {isMilk ? <Milk className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/bovine/animals/${r.animalId}/production`}
                        className="font-bold text-stone-900 hover:text-emerald-800"
                      >
                        {anim?.name}
                      </Link>
                      <span className="font-mono text-[11px] text-stone-400">
                        {anim?.primaryIdentifier}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 text-[10px] font-semibold">
                        {recordType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      Recorded: {recordDate} {r.daysInMilk ? `• ${r.daysInMilk} DIM` : ''}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {milkYield !== undefined && (
                    <div className="font-mono font-bold text-stone-900">
                      {milkYield} kg milk
                    </div>
                  )}
                  {bodyWeight !== undefined && (
                    <div className="font-mono font-bold text-stone-900">
                      {bodyWeight} kg body weight
                    </div>
                  )}
                  {fatPct !== undefined && (
                    <div className="text-[11px] text-stone-500">
                      Fat: {fatPct}% {proPct !== undefined ? `• Pro: ${proPct}%` : ''}
                    </div>
                  )}
                  {dailyGain !== undefined && (
                    <div className="text-[11px] text-emerald-800 font-semibold font-mono">
                      +{dailyGain} kg/d ADG
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
