'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  CalendarCheck2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Utensils,
  Droplets,
  Activity,
  Baby,
  Skull,
  Layers,
} from 'lucide-react';
import { FarmDailyLog } from '@/lib/bovine-types';

export default function BovineFarmDailyLogPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const { farms, animals, farmDailyLogs, addFarmDailyLog, session } = useBovine();
  const farm = farms.find((f) => f.id === farmId);
  const logs = farmDailyLogs.filter((l) => l.farmId === farmId);
  const farmAnimals = animals.filter((a) => a.farmId === farmId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logDate, setLogDate] = useState('2026-09-04');
  const [totalHead, setTotalHead] = useState(farmAnimals.length);
  const [presentHead, setPresentHead] = useState(farmAnimals.length);
  const [sickCount, setSickCount] = useState(farmAnimals.filter((a) => a.requiresReview).length);
  const [treatmentCount, setTreatmentCount] = useState(1);
  const [quarantineCount, setQuarantineCount] = useState(1);
  const [criticalAlertCount, setCriticalAlertCount] = useState(0);
  const [birthsCount, setBirthsCount] = useState(0);
  const [deathsCount, setDeathsCount] = useState(0);
  const [weaningCount, setWeaningCount] = useState(0);
  const [heatObservedCount, setHeatObservedCount] = useState(3);
  const [breedingCount, setBreedingCount] = useState(2);
  const [pregnancyChecksCount, setPregnancyChecksCount] = useState(4);
  const [calvingsCount, setCalvingsCount] = useState(0);
  const [feedOfferedKg, setFeedOfferedKg] = useState(3200);
  const [feedRefusedKg, setFeedRefusedKg] = useState(130);
  const [waterConsumedL, setWaterConsumedL] = useState(6100);
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!farm) return null;

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();

    addFarmDailyLog({
      farmId: farm.id,
      date: logDate,
      totalHead: Number(totalHead),
      presentHead: Number(presentHead),
      sickCount: Number(sickCount),
      treatmentCount: Number(treatmentCount),
      quarantineCount: Number(quarantineCount),
      criticalAlertCount: Number(criticalAlertCount),
      birthsCount: Number(birthsCount),
      deathsCount: Number(deathsCount),
      weaningCount: Number(weaningCount),
      movementsInCount: 0,
      movementsOutCount: 0,
      heatObservedCount: Number(heatObservedCount),
      breedingCount: Number(breedingCount),
      pregnancyChecksCount: Number(pregnancyChecksCount),
      calvingsCount: Number(calvingsCount),
      feedOfferedKg: Number(feedOfferedKg),
      feedRefusedKg: Number(feedRefusedKg),
      feedConsumedKg: Number(feedOfferedKg) - Number(feedRefusedKg),
      waterConsumedL: Number(waterConsumedL),
      openHealthCases: Number(sickCount) + Number(quarantineCount),
      overdueTasks: 0,
      notes: notes.trim() || undefined,
      loggedBy: session.name,
    });

    setIsModalOpen(false);
    setSuccessMsg('Daily farm summary recorded successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Station Daily Operations &amp; Census Logs</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Daily consolidated presence, treatments, repro events, and aggregate feed/water intake for {farm.name}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Farm Daily Log</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Historical Logs Feed */}
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-base text-stone-900">{log.date}</span>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px] font-bold">
                  {log.presentHead} / {log.totalHead} Head Present
                </span>
                {log.criticalAlertCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-bold text-[10px] border border-rose-200">
                    {log.criticalAlertCount} Critical Alert{log.criticalAlertCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <span className="text-stone-400 text-[11px]">Recorded by: {log.loggedBy}</span>
            </div>

            {/* Categorized Metric Groups */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Health & Census */}
              <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-stone-900 text-[11px] uppercase tracking-wider text-emerald-800">
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Health & Census</span>
                </div>
                <div className="space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span>Sick / Treatments:</span>
                    <span className="font-bold text-stone-900">{log.sickCount} / {log.treatmentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quarantine Isolation:</span>
                    <span className="font-bold text-stone-900">{log.quarantineCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Births / Deaths:</span>
                    <span className="font-bold text-stone-900">{log.birthsCount} / {log.deathsCount}</span>
                  </div>
                </div>
              </div>

              {/* Reproduction Events */}
              <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-stone-900 text-[11px] uppercase tracking-wider text-purple-800">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Reproduction & Heat</span>
                </div>
                <div className="space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span>Heats Observed:</span>
                    <span className="font-bold text-stone-900">{log.heatObservedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breedings / AI:</span>
                    <span className="font-bold text-stone-900">{log.breedingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pregnancy Checks:</span>
                    <span className="font-bold text-stone-900">{log.pregnancyChecksCount}</span>
                  </div>
                </div>
              </div>

              {/* Nutrition & Intake */}
              <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-stone-900 text-[11px] uppercase tracking-wider text-amber-800">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Aggregate Nutrition</span>
                </div>
                <div className="space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span>Feed Consumed:</span>
                    <span className="font-bold text-stone-900">{log.feedConsumedKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feed Refusal:</span>
                    <span className="font-bold text-stone-900">{log.feedRefusedKg} kg ({Math.round((log.feedRefusedKg / (log.feedOfferedKg || 1)) * 100)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Consumed:</span>
                    <span className="font-bold text-stone-900">{log.waterConsumedL} L</span>
                  </div>
                </div>
              </div>
            </div>

            {log.notes && (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-stone-600">
                <span className="font-semibold text-stone-900">Notes:</span> {log.notes}
              </div>
            )}
          </div>
        ))}

        {logs.length === 0 && (
          <div className="p-12 text-center text-stone-400 text-xs bg-white rounded-3xl border border-stone-200">
            <CalendarCheck2 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            No daily operational logs filed for this farm station yet.
          </div>
        )}
      </div>

      {/* New Farm Daily Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleSaveLog}
            className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 text-xs my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">Record Farm Daily Summary Log</h3>
                <p className="text-xs text-stone-500">Consolidated operational report for {farm.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Log Date</label>
                <input
                  type="date"
                  required
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Total Head Count</label>
                <input
                  type="number"
                  value={totalHead}
                  onChange={(e) => setTotalHead(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Present Head Count</label>
                <input
                  type="number"
                  value={presentHead}
                  onChange={(e) => setPresentHead(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
                />
              </div>
            </div>

            {/* Health & Census Inputs */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider block">Health & Census</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Sick Count</label>
                  <input
                    type="number"
                    value={sickCount}
                    onChange={(e) => setSickCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Quarantine</label>
                  <input
                    type="number"
                    value={quarantineCount}
                    onChange={(e) => setQuarantineCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Births</label>
                  <input
                    type="number"
                    value={birthsCount}
                    onChange={(e) => setBirthsCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Deaths</label>
                  <input
                    type="number"
                    value={deathsCount}
                    onChange={(e) => setDeathsCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Reproduction Inputs */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider block">Reproduction & Calving</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Heats Observed</label>
                  <input
                    type="number"
                    value={heatObservedCount}
                    onChange={(e) => setHeatObservedCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Breedings</label>
                  <input
                    type="number"
                    value={breedingCount}
                    onChange={(e) => setBreedingCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Preg Checks</label>
                  <input
                    type="number"
                    value={pregnancyChecksCount}
                    onChange={(e) => setPregnancyChecksCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Calvings</label>
                  <input
                    type="number"
                    value={calvingsCount}
                    onChange={(e) => setCalvingsCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Nutrition & Water Inputs */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider block">Nutrition & Feed</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Feed Offered (kg)</label>
                  <input
                    type="number"
                    value={feedOfferedKg}
                    onChange={(e) => setFeedOfferedKg(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Feed Refused (kg)</label>
                  <input
                    type="number"
                    value={feedRefusedKg}
                    onChange={(e) => setFeedRefusedKg(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Water Consumed (L)</label>
                  <input
                    type="number"
                    value={waterConsumedL}
                    onChange={(e) => setWaterConsumedL(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Shift Notes & Observations</label>
              <textarea
                rows={3}
                placeholder="Remarks on parlor operations, weather impact, or veterinary visits..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs"
              >
                Save Daily Summary
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
