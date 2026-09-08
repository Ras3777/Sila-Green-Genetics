'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Users,
  Building2,
  Layers,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CalendarCheck2,
  Utensils,
  ChevronRight,
  X,
} from 'lucide-react';

export default function HerdsDirectoryPage() {
  const { herds, farms, animals, groups, herdDailyLogs, addHerd } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [farmFilter, setFarmFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [newFarmId, setNewFarmId] = useState(farms[0]?.id || '');
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newPurpose, setNewPurpose] = useState('DAIRY_PRODUCTION');

  const filteredHerds = herds.filter((h) => {
    if (farmFilter !== 'ALL' && h.farmId !== farmFilter) return false;
    if (statusFilter === 'ACTIVE' && !h.active) return false;
    if (statusFilter === 'ARCHIVED' && h.active) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = h.code.toLowerCase().includes(q);
      const matchName = h.name.toLowerCase().includes(q);
      const matchPurpose = h.purpose.toLowerCase().includes(q);
      return matchCode || matchName || matchPurpose;
    }
    return true;
  });

  const totalHerds = herds.length;
  const activeHerds = herds.filter((h) => h.active).length;
  const totalAnimalsInHerds = herds.reduce((acc, h) => acc + h.headCount, 0);
  const totalAlerts = herds.reduce((acc, h) => acc + h.alertsCount, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim() || !newFarmId) return;

    addHerd({
      farmId: newFarmId,
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      purpose: newPurpose,
      active: true,
    });

    setNewCode('');
    setNewName('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Livestock Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Production Herds & Batches
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Cross-facility herd registries, operational daily log tracking, and group hierarchy
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Herd</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Herds</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">{totalHerds}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">{activeHerds} active production units</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Head Count</div>
          <div className="text-2xl font-bold text-emerald-950 mt-1 font-mono">{totalAnimalsInHerds}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Distributed across herds</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Stations Represented</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">{farms.length}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Agricultural facilities</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Review Alerts</div>
          <div className="text-2xl font-bold text-amber-950 mt-1 font-mono">{totalAlerts}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Vitals & health alerts</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Farm filter */}
          <select
            value={farmFilter}
            onChange={(e) => setFarmFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          >
            <option value="ALL">All Stations / Farms</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.code})
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="ARCHIVED">Inactive / Archived</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search herds by code, name, purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>
      </div>

      {/* Herds Grid */}
      {filteredHerds.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No Herds Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {herds.length === 0
              ? 'No herds have been defined yet. Create your first production herd to organize cattle.'
              : 'No herds match your current search and station filter criteria.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Production Herd</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHerds.map((herd) => {
            const farm = farms.find((f) => f.id === herd.farmId);
            const herdAnimals = animals.filter((a) => a.herdId === herd.id);
            const herdGroups = groups.filter((g) => g.herdId === herd.id);

            return (
              <div
                key={herd.id}
                className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs hover:border-emerald-800/40 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {herd.code}
                        </span>
                        {herd.active ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                            Inactive
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-stone-900 mt-1">{herd.name}</h3>
                    </div>

                    {herd.alertsCount > 0 && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        {herd.alertsCount} alerts
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-500 font-medium capitalize">
                    {herd.purpose.replace(/_/g, ' ').toLowerCase()}
                  </p>

                  {farm && (
                    <div className="flex items-center text-xs text-stone-600 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                      <span className="truncate">{farm.name}</span>
                    </div>
                  )}

                  {/* Operational Metrics Strip */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    <div className="p-2 rounded-xl bg-stone-50 text-xs">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Animals</span>
                      <span className="font-bold text-stone-800 font-mono text-sm">{herdAnimals.length} head</span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-50 text-xs">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Groups</span>
                      <span className="font-bold text-stone-800 font-mono text-sm">{herdGroups.length} batches</span>
                    </div>
                  </div>

                  {/* Daily Log Progress */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500 font-medium">Today&apos;s Daily Log</span>
                      <span className="font-bold text-emerald-800 font-mono">{herd.dailyLogCompletionPct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${herd.dailyLogCompletionPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/bovine/herds/${herd.id}/daily-log`}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-800 hover:bg-stone-100 transition-colors"
                      title="Herd Daily Log"
                    >
                      <CalendarCheck2 className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/bovine/herds/${herd.id}/feeding`}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-800 hover:bg-stone-100 transition-colors"
                      title="Herd Feeding Log"
                    >
                      <Utensils className="w-4 h-4" />
                    </Link>
                  </div>

                  <Link
                    href={`/bovine/herds/${herd.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 hover:text-emerald-700"
                  >
                    <span>View Herd</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Herd Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900">Create Production Herd</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Target Station / Farm *
                </label>
                <select
                  required
                  value={newFarmId}
                  onChange={(e) => setNewFarmId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Herd Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HRD-04"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Purpose / Type
                  </label>
                  <select
                    value={newPurpose}
                    onChange={(e) => setNewPurpose(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  >
                    <option value="DAIRY_PRODUCTION">Dairy Production</option>
                    <option value="BEEF_FINISHING">Beef Finishing</option>
                    <option value="HEIFER_DEVELOPMENT">Heifer Development</option>
                    <option value="BREEDING_SEEDSTOCK">Breeding Seedstock</option>
                    <option value="CALVES_NURSERY">Calves / Nursery</option>
                    <option value="QUARANTINE_HOLD">Quarantine Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Herd Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Pasture Holstein Heifers"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
                  Create Herd
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
