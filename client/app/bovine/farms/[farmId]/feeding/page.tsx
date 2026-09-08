'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Utensils,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Scale,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { GroupFeedingLog } from '@/lib/bovine-types';

export default function BovineFarmFeedingPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const { farms, herds, groups, groupFeedingLogs, addGroupFeedingLog } = useBovine();
  const farm = farms.find((f) => f.id === farmId);
  const logs = groupFeedingLogs.filter((g) => g.farmId === farmId);
  const farmHerds = herds.filter((h) => h.farmId === farmId);
  const farmGroups = groups.filter((g) => g.farmId === farmId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState('2026-09-04');
  const [selectedHerdId, setSelectedHerdId] = useState(farmHerds[0]?.id || '');
  const [selectedGroupId, setSelectedGroupId] = useState(farmGroups[0]?.id || '');
  const [rationName, setRationName] = useState('Flushing Lactating TMR Premium');
  const [rationVersion, setRationVersion] = useState('v4.2');
  const [batchReference, setBatchReference] = useState(`BATCH-${Date.now().toString().slice(-6)}`);
  const [animalsFedCount, setAnimalsFedCount] = useState(12);
  const [feedOfferedKg, setFeedOfferedKg] = useState(600);
  const [feedRefusedKg, setFeedRefusedKg] = useState(24);
  const [dryMatterPct, setDryMatterPct] = useState(54.5);
  const [dmiKgPerHead, setDmiKgPerHead] = useState(26.2);
  const [concentrateKg, setConcentrateKg] = useState(240);
  const [forageKg, setForageKg] = useState(330);
  const [supplementsKg, setSupplementsKg] = useState(30);
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!farm) return null;

  const handleCreateFeedingLog = (e: React.FormEvent) => {
    e.preventDefault();
    const grp = farmGroups.find((g) => g.id === selectedGroupId);
    const refusalPct = (Number(feedRefusedKg) / (Number(feedOfferedKg) || 1)) * 100;

    addGroupFeedingLog({
      farmId: farm.id,
      herdId: selectedHerdId,
      managementGroupId: selectedGroupId || undefined,
      groupName: grp?.name || 'Milking Group',
      date,
      rationName: rationName.trim(),
      rationVersion: rationVersion.trim(),
      batchReference: batchReference.trim(),
      animalsFedCount: Number(animalsFedCount),
      feedOfferedKg: Number(feedOfferedKg),
      feedRefusedKg: Number(feedRefusedKg),
      feedConsumedKg: Number(feedOfferedKg) - Number(feedRefusedKg),
      dryMatterPct: Number(dryMatterPct),
      dmiKgPerHead: Number(dmiKgPerHead),
      concentrateKg: Number(concentrateKg),
      forageKg: Number(forageKg),
      supplementsKg: Number(supplementsKg),
      notes: notes.trim() || undefined,
      highRefusalFlag: refusalPct > 10,
    });

    setIsModalOpen(false);
    setSuccessMsg('Group feeding batch recorded successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Group Nutrition &amp; Feeding Manifests</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Ration versions, Dry Matter Intake (DMI), mix composition, and feed bunk refusal monitoring
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Feeding Log</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Feeding Logs List */}
      <div className="space-y-4">
        {logs.map((log) => {
          const consumedKg = log.feedOfferedKg - log.feedRefusedKg;
          const refusalPct = Math.round((log.feedRefusedKg / (log.feedOfferedKg || 1)) * 100);

          return (
            <div
              key={log.id}
              className={`p-6 rounded-3xl bg-white border shadow-2xs space-y-4 text-xs ${
                log.highRefusalFlag ? 'border-amber-300 ring-1 ring-amber-300' : 'border-stone-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-base text-stone-900">{log.groupName}</span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px] font-bold">
                    {log.batchReference}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium text-[11px]">
                    {log.rationName} ({log.rationVersion})
                  </span>
                  {log.highRefusalFlag && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold text-[10px] border border-amber-200 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>High Refusal Alert ({refusalPct}%)</span>
                    </span>
                  )}
                </div>
                <span className="text-stone-400 text-[11px]">{log.date}</span>
              </div>

              {/* Nutrition KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Animals Fed</span>
                  <div className="text-lg font-bold text-stone-900 mt-0.5">{log.animalsFedCount} Head</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Pen Bunk Load</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Dry Matter Intake</span>
                  <div className="text-lg font-bold text-emerald-800 mt-0.5">{log.dmiKgPerHead} kg / head</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{log.dryMatterPct}% Dry Matter</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Offered vs Consumed</span>
                  <div className="text-lg font-bold text-stone-900 mt-0.5">
                    {consumedKg} / {log.feedOfferedKg} kg
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{log.feedRefusedKg} kg refused ({refusalPct}%)</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Mix Distribution</span>
                  <div className="text-sm font-bold text-stone-800 mt-0.5">
                    {log.forageKg}kg Forage / {log.concentrateKg}kg Conc
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">+{log.supplementsKg}kg Mineral/Supp</div>
                </div>
              </div>

              {log.notes && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-stone-600">
                  <span className="font-semibold text-stone-900">Bunk Notes:</span> {log.notes}
                </div>
              )}
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="p-12 text-center text-stone-400 text-xs bg-white rounded-3xl border border-stone-200">
            <Utensils className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            No group feeding manifests logged for this farm station.
          </div>
        )}
      </div>

      {/* Record Feeding Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleCreateFeedingLog}
            className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 text-xs my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Record Group Feeding Batch</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Target Management Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  {farmGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ration Formula Name</label>
                <input
                  type="text"
                  required
                  value={rationName}
                  onChange={(e) => setRationName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Version &amp; Batch Ref</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={rationVersion}
                    onChange={(e) => setRationVersion(e.target.value)}
                    className="w-20 bg-stone-50 border border-stone-300 rounded-xl px-2 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={batchReference}
                    onChange={(e) => setBatchReference(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-2 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Head Count</label>
                <input
                  type="number"
                  value={animalsFedCount}
                  onChange={(e) => setAnimalsFedCount(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Offered (kg)</label>
                <input
                  type="number"
                  value={feedOfferedKg}
                  onChange={(e) => setFeedOfferedKg(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Refused (kg)</label>
                <input
                  type="number"
                  value={feedRefusedKg}
                  onChange={(e) => setFeedRefusedKg(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-0.5">DMI (kg/head)</label>
                <input
                  type="number"
                  step="0.1"
                  value={dmiKgPerHead}
                  onChange={(e) => setDmiKgPerHead(parseFloat(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold text-emerald-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Forage (kg)</label>
                <input
                  type="number"
                  value={forageKg}
                  onChange={(e) => setForageKg(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Concentrate (kg)</label>
                <input
                  type="number"
                  value={concentrateKg}
                  onChange={(e) => setConcentrateKg(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Supplements (kg)</label>
                <input
                  type="number"
                  value={supplementsKg}
                  onChange={(e) => setSupplementsKg(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Notes / Mix Behavior</label>
              <textarea
                rows={2}
                placeholder="Sorting observations, palatability remarks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
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
                Record Feeding Batch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
