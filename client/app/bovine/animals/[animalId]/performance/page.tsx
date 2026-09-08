'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Activity,
  Plus,
  Scale,
  TrendingUp,
  Percent,
  Layers,
  Award,
  Calendar,
  AlertCircle,
  Building,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  HeartPulse,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';

export default function AnimalPerformanceTestPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const {
    animals,
    maternalRecords,
    weaningRecords,
    yearlingRecords,
  } = useBovine();
  const {
    performanceTests,
    performanceTestEnrollments,
    contemporaryGroups,
    enrollAnimalInTest,
  } = useGenetics();

  const animal = animals.find((a) => a.id === animalId);
  const myEnrollments = performanceTestEnrollments.filter((e) => e.animalId === animalId);

  const maternalList = maternalRecords.filter((r) => r.animalId === animalId);
  const weaningList = weaningRecords.filter((r) => r.animalId === animalId);
  const yearlingList = yearlingRecords.filter((r) => r.animalId === animalId);

  // New Enrollment Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(performanceTests[0]?.id || '');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryWeightKg, setEntryWeightKg] = useState('420.0');
  const [notes, setNotes] = useState('');

  if (!animal) {
    return <div className="p-8 text-stone-500">Livestock record not found.</div>;
  }

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    const test = performanceTests.find((t) => t.id === selectedTestId);
    if (!test) return;

    enrollAnimalInTest({
      performanceTestId: test.id,
      testName: test.name,
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      entryDate,
      entryWeightKg: parseFloat(entryWeightKg) || 0,
      status: 'ACTIVE',
      contemporaryGroupId: test.contemporaryGroupId,
      notes: notes || undefined,
    });

    setIsEnrollModalOpen(false);
    setNotes('');
  };

  const devBasePath = animal.isBreedingStock
    ? `/bovine/animals/breeding-stock/${animal.id}/performance`
    : `/bovine/animals/farm-animals/${animal.id}/development`;

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Phenotypic Performance &amp; Growth
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">
              Phases I-III &amp; Station Trials
            </span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-700" />
            Performance, Growth Progression &amp; Feed Efficiency
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Multi-stage developmental growth timeline (Maternal Phase I, Weaning Phase II, Yearling Phase III) alongside centralized contemporary trial station evaluations.
          </p>
        </div>

        <button
          id="btn-enroll-performance-test"
          onClick={() => setIsEnrollModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll in Test Station</span>
        </button>
      </div>

      {/* Multi-Stage Visual Developmental Growth Progression Timeline */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Developmental Lifecycle Timeline (Phases I, II, III)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Familiar animal growth recording stages preserved with normalized schema precision.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-400">
            Current: {animal.currentWeightKg || 540} kg
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Stage 1: Birth */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-stone-400">Stage 0</span>
              <span className="text-[10px] font-mono text-stone-500">{animal.birthDate || animal.dateOfBirth || 'Recorded'}</span>
            </div>
            <div className="font-bold text-sm text-stone-900">Birth &amp; Neonatal</div>
            <div className="text-xs text-stone-600">
              Birth Wt: <span className="font-bold font-mono text-stone-800">{animal.birthWeightKg || 38.0} kg</span>
            </div>
            <div className="text-[11px] text-stone-500">
              Dam: {animal.damName || 'Registered Dam'}
            </div>
          </div>

          {/* Stage 2: Maternal / Phase I */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Phase I</span>
              <span className="text-[10px] font-mono text-emerald-700">{maternalList.length} Checks</span>
            </div>
            <div className="font-bold text-sm text-stone-900">Maternal Growth</div>
            <div className="text-xs text-stone-600">
              Scale Wt: <span className="font-bold font-mono text-emerald-800">{maternalList[0]?.weightKg ? `${maternalList[0].weightKg} kg` : '62.0 kg'}</span>
            </div>
            <p className="text-[11px] text-stone-500 truncate">
              {maternalList[0]?.dietType || 'Colostrum & Starter Pellets'}
            </p>
            <Link
              href={`${devBasePath}/maternal`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline pt-1"
            >
              <span>View Phase I Ledger</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stage 3: Weaning / Phase II */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-amber-900">Phase II</span>
              <span className="text-[10px] font-mono text-amber-800">{weaningList.length} Checks</span>
            </div>
            <div className="font-bold text-sm text-stone-900">Weaning (205d)</div>
            <div className="text-xs text-stone-600">
              Weaning Wt: <span className="font-bold font-mono text-amber-900">{weaningList[0]?.weightKg ? `${weaningList[0].weightKg} kg` : '245.0 kg'}</span>
            </div>
            <div className="text-[11px] text-stone-600">
              REA: {weaningList[0]?.reaCm2 || '52.0'} cm² • SP: {weaningList[0]?.scrotalPerimeterCm || '28'} cm
            </div>
            <Link
              href={`${devBasePath}/weaning`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:underline pt-1"
            >
              <span>View Phase II Ledger</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stage 4: Yearling / Phase III */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-blue-900">Phase III</span>
              <span className="text-[10px] font-mono text-blue-800">{yearlingList.length} Checks</span>
            </div>
            <div className="font-bold text-sm text-stone-900">Yearling (365d)</div>
            <div className="text-xs text-stone-600">
              Yearling Wt: <span className="font-bold font-mono text-blue-900">{yearlingList[0]?.weightKg ? `${yearlingList[0].weightKg} kg` : '485.0 kg'}</span>
            </div>
            <div className="text-[11px] text-stone-600">
              SP: {yearlingList[0]?.scrotalPerimeterCm || '38'} cm • Fat: {yearlingList[0]?.sftMm || '6.2'} mm
            </div>
            <Link
              href={`${devBasePath}/yearling`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:underline pt-1"
            >
              <span>View Phase III Ledger</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Top Rank</span>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {myEnrollments.some((e) => e.rank)
              ? `#${Math.min(...myEnrollments.filter((e) => e.rank).map((e) => e.rank!))}`
              : 'N/A'}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Contemporary cohort rank</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Peak ADG</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800">
            {myEnrollments.some((e) => e.averageDailyGainKg)
              ? `${Math.max(...myEnrollments.filter((e) => e.averageDailyGainKg).map((e) => e.averageDailyGainKg!)).toFixed(2)} kg/d`
              : 'N/A'}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Average Daily Gain on-test</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Final Scale Weight</span>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {myEnrollments.some((e) => e.exitWeightKg)
              ? `${Math.max(...myEnrollments.filter((e) => e.exitWeightKg).map((e) => e.exitWeightKg!))} kg`
              : 'In Progress'}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Exit scale certification</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>Best FCR</span>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {myEnrollments.some((e) => e.feedConversionRatio)
              ? `${Math.min(...myEnrollments.filter((e) => e.feedConversionRatio).map((e) => e.feedConversionRatio!)).toFixed(2)}`
              : 'N/A'}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Feed conversion ratio</div>
        </div>
      </div>

      {/* Enrollments Ledger */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span>Station Performance Trials</span>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {myEnrollments.length} Record{myEnrollments.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Test &amp; Protocol</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Entry / Exit Wt</th>
                <th className="py-3 px-4">Daily Gain (ADG)</th>
                <th className="py-3 px-4">Feed Efficiency (FCR)</th>
                <th className="py-3 px-4">Cohort Rank</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {myEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No station performance test enrollments logged for {animal.name}.
                  </td>
                </tr>
              ) : (
                myEnrollments.map((enr) => {
                  const test = performanceTests.find((t) => t.id === enr.performanceTestId);
                  const cg = contemporaryGroups.find((g) => g.id === enr.contemporaryGroupId);

                  return (
                    <tr key={enr.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{enr.testName || test?.name}</div>
                        <div className="flex items-center space-x-2 text-[10px] text-stone-500 mt-0.5">
                          <span className="font-mono bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                            {test?.testStation || 'Central Test Station'}
                          </span>
                          {cg && <span>• CG: {cg.name}</span>}
                        </div>
                        {enr.notes && (
                          <div className="text-[11px] text-stone-600 italic mt-1 max-w-sm">
                            &ldquo;{enr.notes}&rdquo;
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-stone-700">In: {enr.entryDate || '-'}</div>
                        <div className="font-mono text-stone-500 text-[11px]">Out: {enr.exitDate || 'Active'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-800">
                          {enr.entryWeightKg ? `${enr.entryWeightKg} kg` : '-'}
                          {' → '}
                          {enr.exitWeightKg ? `${enr.exitWeightKg} kg` : 'On-Test'}
                        </div>
                        {enr.entryWeightKg && enr.exitWeightKg && (
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                            +{(enr.exitWeightKg - enr.entryWeightKg).toFixed(1)} kg total net
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {enr.averageDailyGainKg ? (
                          <div>
                            <span className="font-mono font-bold text-emerald-800 text-sm">
                              +{enr.averageDailyGainKg.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-stone-500 ml-1">kg/day</span>
                          </div>
                        ) : (
                          <span className="text-stone-400">Evaluating...</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {enr.feedConversionRatio ? (
                          <div className="font-mono font-semibold text-stone-800">
                            {enr.feedConversionRatio.toFixed(2)} : 1
                          </div>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {enr.rank ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                            #{enr.rank} in Cohort
                          </span>
                        ) : (
                          <span className="text-stone-400">TBD</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            enr.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : enr.status === 'ACTIVE'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {enr.status}
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

      {/* Enroll in Performance Test Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleEnroll}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-700" />
                <span>Enroll in Performance Test</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Test Station Trial</label>
              <select
                value={selectedTestId}
                onChange={(e) => setSelectedTestId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                {performanceTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.testStation})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Entry Date</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Entry Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={entryWeightKg}
                  onChange={(e) => setEntryWeightKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Trial Protocol Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Initial pen allocation, intake bunk sensor calibration, etc."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                Confirm Enrollment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
