'use client';

import React, { useState, use } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  Utensils,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X,
  PieChart,
} from 'lucide-react';

interface HerdFeedingPageProps {
  params: Promise<{ herdId: string }>;
}

export default function HerdFeedingPage({ params }: HerdFeedingPageProps) {
  const resolvedParams = use(params);
  const herdId = resolvedParams.herdId;

  const { herds, groups, animals, groupFeedingLogs, addGroupFeedingLog } = useBovine();
  const herd = herds.find((h) => h.id === herdId);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const herdAnimals = herd ? animals.filter((a) => a.herdId === herd.id) : [];
  const herdGroups = herd ? groups.filter((g) => g.herdId === herd.id) : [];

  const [newGroupId, setNewGroupId] = useState(herdGroups[0]?.id || '');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newRationName, setNewRationName] = useState('Lactation TMR Standard');
  const [newRationVersion, setNewRationVersion] = useState('v2.4');
  const [newBatchRef, setNewBatchRef] = useState(`BTH-${Date.now().toString().slice(-4)}`);
  const [newFedCount, setNewFedCount] = useState<number>(herdAnimals.length || 45);
  const [newOfferedKg, setNewOfferedKg] = useState<number>(2250);
  const [newRefusedKg, setNewRefusedKg] = useState<number>(90);
  const [newDryMatterPct, setNewDryMatterPct] = useState<number>(48);
  const [newForageKg, setNewForageKg] = useState<number>(1300);
  const [newConcentrateKg, setNewConcentrateKg] = useState<number>(850);
  const [newSupplementsKg, setNewSupplementsKg] = useState<number>(100);
  const [newNotes, setNewNotes] = useState('');

  if (!herd) return null;

  const logs = groupFeedingLogs.filter((l) => l.herdId === herd.id);

  const filteredLogs = logs.filter((l) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.rationName.toLowerCase().includes(q) ||
        l.batchReference.toLowerCase().includes(q) ||
        l.groupName.toLowerCase().includes(q) ||
        l.date.includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const offered = Number(newOfferedKg);
    const refused = Number(newRefusedKg);
    const consumed = Math.max(0, offered - refused);
    const fedCount = Math.max(1, Number(newFedCount));
    const dmRatio = Number(newDryMatterPct) / 100;
    const dmi = Number(((consumed * dmRatio) / fedCount).toFixed(2));
    const refusalPct = offered > 0 ? (refused / offered) * 100 : 0;
    const isHighRefusal = refusalPct > 5;

    const matchedGroup = groups.find((g) => g.id === newGroupId);

    addGroupFeedingLog({
      farmId: herd.farmId,
      herdId: herd.id,
      managementGroupId: newGroupId || undefined,
      groupName: matchedGroup ? matchedGroup.name : herd.name,
      date: newDate,
      rationName: newRationName.trim(),
      rationVersion: newRationVersion.trim(),
      batchReference: newBatchRef.trim(),
      animalsFedCount: fedCount,
      feedOfferedKg: offered,
      feedRefusedKg: refused,
      feedConsumedKg: consumed,
      dryMatterPct: Number(newDryMatterPct),
      dmiKgPerHead: dmi,
      concentrateKg: Number(newConcentrateKg),
      forageKg: Number(newForageKg),
      supplementsKg: Number(newSupplementsKg),
      highRefusalFlag: isHighRefusal,
      notes: newNotes.trim() || undefined,
    });

    setNewNotes('');
    setIsCreateModalOpen(false);
  };

  const totalConsumed = logs.reduce((acc, l) => acc + l.feedConsumedKg, 0);
  const avgDmi = logs.length > 0 ? (logs.reduce((acc, l) => acc + l.dmiKgPerHead, 0) / logs.length).toFixed(1) : '0';
  const highRefusalCount = logs.filter((l) => l.highRefusalFlag).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Feed Logs</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">{logs.length}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Recorded ration drops</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Avg DMI / Head</div>
          <div className="text-2xl font-bold text-emerald-950 mt-1 font-mono">{avgDmi} kg</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Dry matter intake target</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Consumed</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">{totalConsumed} kg</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Net dry ration intake</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Refusal Alerts</div>
          <div className="text-2xl font-bold text-amber-950 mt-1 font-mono">{highRefusalCount}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">&gt;5% weighback flags</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search feed logs by ration, batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Feeding Run</span>
        </button>
      </div>

      {/* Feeding Logs Table */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <Utensils className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No Feeding Records for this Herd</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {logs.length === 0
              ? 'Record dietary rations, DM percentage, and weighbacks to monitor nutritional conversion efficiency.'
              : 'No feeding records match your current search.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record First Feed Drop</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {log.batchReference}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900">{log.rationName}</h4>
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                    {log.rationVersion}
                  </span>
                  {log.highRefusalFlag && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      High Refusal (&gt;5%)
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs text-stone-500">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{new Date(log.date).toLocaleDateString()}</span>
                  <span>&bull;</span>
                  <span className="font-semibold text-stone-800">{log.animalsFedCount} head fed</span>
                </div>
              </div>

              {/* Feed metrics row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Offered</span>
                  <span className="font-bold text-stone-900 font-mono text-sm">{log.feedOfferedKg} kg</span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Refused</span>
                  <span className="font-bold text-stone-900 font-mono text-sm">{log.feedRefusedKg} kg</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/60">
                  <span className="text-emerald-800 block text-[10px] uppercase font-bold">Consumed</span>
                  <span className="font-bold text-emerald-950 font-mono text-sm">{log.feedConsumedKg} kg</span>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/60">
                  <span className="text-blue-800 block text-[10px] uppercase font-bold">Dry Matter</span>
                  <span className="font-bold text-blue-950 font-mono text-sm">{log.dryMatterPct}%</span>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50/60 col-span-2 sm:col-span-1">
                  <span className="text-purple-800 block text-[10px] uppercase font-bold">DMI / Head</span>
                  <span className="font-bold text-purple-950 font-mono text-sm">{log.dmiKgPerHead} kg/hd</span>
                </div>
              </div>

              {/* Composition Breakdown */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500 pt-1">
                <div className="flex items-center gap-4">
                  <span>Forage: <strong className="text-stone-800">{log.forageKg} kg</strong></span>
                  <span>Concentrate: <strong className="text-stone-800">{log.concentrateKg} kg</strong></span>
                  <span>Supplements: <strong className="text-stone-800">{log.supplementsKg} kg</strong></span>
                </div>

                {log.notes && (
                  <span className="italic text-stone-600 max-w-md truncate">
                    Note: &ldquo;{log.notes}&rdquo;
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Feeding Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Utensils className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900">Record Herd Feeding Run</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Feed Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Batch Reference *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatchRef}
                    onChange={(e) => setNewBatchRef(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Ration Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRationName}
                    onChange={(e) => setNewRationName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Ration Version
                  </label>
                  <input
                    type="text"
                    value={newRationVersion}
                    onChange={(e) => setNewRationVersion(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Animals Fed *
                  </label>
                  <input
                    type="number"
                    required
                    value={newFedCount}
                    onChange={(e) => setNewFedCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Offered (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newOfferedKg}
                    onChange={(e) => setNewOfferedKg(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Refused (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newRefusedKg}
                    onChange={(e) => setNewRefusedKg(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    Dry Matter %
                  </label>
                  <input
                    type="number"
                    value={newDryMatterPct}
                    onChange={(e) => setNewDryMatterPct(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    Forage (kg)
                  </label>
                  <input
                    type="number"
                    value={newForageKg}
                    onChange={(e) => setNewForageKg(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    Concentrate
                  </label>
                  <input
                    type="number"
                    value={newConcentrateKg}
                    onChange={(e) => setNewConcentrateKg(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    Supplements
                  </label>
                  <input
                    type="number"
                    value={newSupplementsKg}
                    onChange={(e) => setNewSupplementsKg(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Feeding Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Silage moisture slightly elevated; mineral premix included."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  Save Feed Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
