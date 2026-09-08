'use client';

import React, { useState, use } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  CalendarCheck2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Utensils,
  User,
  Calendar,
  X,
  FileText,
} from 'lucide-react';

interface HerdDailyLogPageProps {
  params: Promise<{ herdId: string }>;
}

export default function HerdDailyLogPage({ params }: HerdDailyLogPageProps) {
  const resolvedParams = use(params);
  const herdId = resolvedParams.herdId;

  const { herds, herdDailyLogs, animals, addHerdDailyLog, session } = useBovine();
  const herd = herds.find((h) => h.id === herdId);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const herdAnimals = herd ? animals.filter((a) => a.herdId === herd.id) : [];
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newHeadCount, setNewHeadCount] = useState<number>(herdAnimals.length || 50);
  const [newNormalCount, setNewNormalCount] = useState<number>(herdAnimals.length ? herdAnimals.length - 2 : 48);
  const [newAbnormalCount, setNewAbnormalCount] = useState<number>(2);
  const [newFeedIntake, setNewFeedIntake] = useState<number>(1200);
  const [newWaterIntake, setNewWaterIntake] = useState<number>(3500);
  const [newNotes, setNewNotes] = useState('');
  const [newLoggedBy, setNewLoggedBy] = useState(session.userName || 'Herd Manager');

  if (!herd) return null;

  const logs = herdDailyLogs.filter((l) => l.herdId === herd.id);

  const filteredLogs = logs.filter((l) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return l.date.includes(q) || l.loggedBy.toLowerCase().includes(q) || l.notes?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addHerdDailyLog({
      herdId: herd.id,
      farmId: herd.farmId,
      date: newDate,
      headCount: Number(newHeadCount),
      normalCount: Number(newNormalCount),
      abnormalCount: Number(newAbnormalCount),
      logsCompleted: Number(newNormalCount) + Number(newAbnormalCount),
      logsMissing: Math.max(0, Number(newHeadCount) - (Number(newNormalCount) + Number(newAbnormalCount))),
      feedIntakeKg: Number(newFeedIntake),
      waterIntakeL: Number(newWaterIntake),
      notes: newNotes.trim() || undefined,
      loggedBy: newLoggedBy.trim() || 'Herd Lead',
    });

    setNewNotes('');
    setIsCreateModalOpen(false);
  };

  const avgNormalPct = logs.length > 0
    ? Math.round(
        (logs.reduce((acc, l) => acc + (l.headCount > 0 ? (l.normalCount / l.headCount) * 100 : 100), 0) /
          logs.length)
      )
    : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Logs Logged</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">{logs.length}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Historical shift audits</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Avg Normal Rate</div>
          <div className="text-2xl font-bold text-emerald-950 mt-1 font-mono">{avgNormalPct}%</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Physical health baseline</div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Water Intake</div>
          <div className="text-2xl font-bold text-blue-950 mt-1 font-mono">
            {logs[0] ? logs[0].waterIntakeL : 0} L
          </div>
          <div className="text-[11px] text-blue-700 mt-0.5">Latest 24h consumption</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Feed Consumed</div>
          <div className="text-2xl font-bold text-amber-950 mt-1 font-mono">
            {logs[0] ? logs[0].feedIntakeKg : 0} kg
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Latest ration intake</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search logs by date, operator, notes..."
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
          <span>Record Herd Shift Log</span>
        </button>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <CalendarCheck2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No Daily Logs for this Herd</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {logs.length === 0
              ? 'No daily shift reports have been recorded for this herd yet.'
              : 'No logs match your current search query.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Today&apos;s Herd Log</span>
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Head Count</th>
                  <th className="py-3 px-4">Health Status</th>
                  <th className="py-3 px-4">Feed Intake</th>
                  <th className="py-3 px-4">Water Intake</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {new Date(log.date).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-stone-800">
                      {log.headCount} head
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2 font-mono">
                        <span className="flex items-center text-emerald-800 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          {log.normalCount}
                        </span>
                        {log.abnormalCount > 0 && (
                          <span className="flex items-center text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {log.abnormalCount}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-stone-700">
                      {log.feedIntakeKg} kg
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-stone-700">
                      {log.waterIntakeL} L
                    </td>

                    <td className="py-3 px-4 text-stone-600">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-stone-400" />
                        <span>{log.loggedBy}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                      {log.notes || <span className="text-stone-300 italic">No notes</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Daily Log Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <CalendarCheck2 className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900">Record Herd Shift Log</h3>
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
                    Log Date *
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
                    Head Present *
                  </label>
                  <input
                    type="number"
                    required
                    value={newHeadCount}
                    onChange={(e) => setNewHeadCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Normal Head
                  </label>
                  <input
                    type="number"
                    value={newNormalCount}
                    onChange={(e) => setNewNormalCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Abnormal / Flagged
                  </label>
                  <input
                    type="number"
                    value={newAbnormalCount}
                    onChange={(e) => setNewAbnormalCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-rose-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Feed Intake (kg)
                  </label>
                  <input
                    type="number"
                    value={newFeedIntake}
                    onChange={(e) => setNewFeedIntake(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Water Intake (L)
                  </label>
                  <input
                    type="number"
                    value={newWaterIntake}
                    onChange={(e) => setNewWaterIntake(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Operator Name
                </label>
                <input
                  type="text"
                  value={newLoggedBy}
                  onChange={(e) => setNewLoggedBy(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Shift Observations & Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Note rumination activity, heat signs, waterer pressure, manure score..."
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
                  Save Shift Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
