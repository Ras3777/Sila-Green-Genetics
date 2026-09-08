'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Users2,
  Users,
  Building2,
  Search,
  Plus,
  Filter,
  ArrowRight,
  Layers,
  Utensils,
  CalendarCheck2,
  X,
  Sparkles,
} from 'lucide-react';

export default function GroupsDirectoryPage() {
  const { groups, herds, farms, animals, addGroup } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [farmFilter, setFarmFilter] = useState<string>('ALL');
  const [herdFilter, setHerdFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [newFarmId, setNewFarmId] = useState(farms[0]?.id || '');
  const availableHerds = herds.filter((h) => h.farmId === newFarmId);
  const [newHerdId, setNewHerdId] = useState(availableHerds[0]?.id || herds[0]?.id || '');
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'CLOSED'>('ACTIVE');

  const filteredGroups = groups.filter((g) => {
    if (farmFilter !== 'ALL' && g.farmId !== farmFilter) return false;
    if (herdFilter !== 'ALL' && g.herdId !== herdFilter) return false;
    if (statusFilter !== 'ALL' && g.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = g.code.toLowerCase().includes(q);
      const matchName = g.name.toLowerCase().includes(q);
      const matchDesc = g.description.toLowerCase().includes(q);
      return matchCode || matchName || matchDesc;
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim() || !newFarmId || !newHerdId) return;

    addGroup({
      farmId: newFarmId,
      herdId: newHerdId,
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      description: newDesc.trim(),
      status: newStatus,
      startDate: new Date().toISOString().slice(0, 10),
    });

    setNewCode('');
    setNewName('');
    setNewDesc('');
    setIsCreateModalOpen(false);
  };

  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.status === 'ACTIVE').length;
  const totalHeadInGroups = groups.reduce((acc, g) => acc + g.headCount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Users2 className="w-3.5 h-3.5" />
            <span>Management & Pen Partitions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Management Groups Directory
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Operational cohorts, nutritional batches, contemporary groups, and pen management
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Management Group</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Groups</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">{totalGroups}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">{activeGroups} active cohorts</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Grouped Head</div>
          <div className="text-2xl font-bold text-emerald-950 mt-1 font-mono">{totalHeadInGroups}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Allocated to cohorts</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Herds Partitioned</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">{herds.length}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Production herds</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Facilities Represented</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">{farms.length}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Agricultural stations</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Farm filter */}
          <select
            value={farmFilter}
            onChange={(e) => {
              setFarmFilter(e.target.value);
              setHerdFilter('ALL');
            }}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          >
            <option value="ALL">All Stations</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Herd filter */}
          <select
            value={herdFilter}
            onChange={(e) => setHerdFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          >
            <option value="ALL">All Herds</option>
            {herds
              .filter((h) => (farmFilter === 'ALL' ? true : h.farmId === farmFilter))
              .map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.code})
                </option>
              ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="CLOSED">Closed Only</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search groups by code, name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <Users2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No Groups Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {groups.length === 0
              ? 'No management groups defined yet. Create a management group to partition herds.'
              : 'No groups match your current search and filter selections.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Management Group</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => {
            const farm = farms.find((f) => f.id === group.farmId);
            const herd = herds.find((h) => h.id === group.herdId);
            const groupAnimals = animals.filter((a) => a.managementGroupId === group.id);

            return (
              <div
                key={group.id}
                className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs hover:border-emerald-800/40 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {group.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            group.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                        >
                          {group.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 mt-1">{group.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                    {group.description}
                  </p>

                  <div className="space-y-1 text-xs text-stone-600">
                    {farm && (
                      <div className="flex items-center">
                        <Building2 className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                        <span className="truncate">{farm.name}</span>
                      </div>
                    )}
                    {herd && (
                      <div className="flex items-center">
                        <Users className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                        <span className="truncate">Herd: {herd.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="p-2 rounded-xl bg-stone-50">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Assigned</span>
                      <span className="font-bold text-stone-900 font-mono text-sm">{groupAnimals.length} head</span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-50">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Log Completion</span>
                      <span className="font-bold text-emerald-800 font-mono text-sm">{group.dailyLogCompletionPct}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Since {new Date(group.startDate).toLocaleDateString()}
                  </span>

                  <Link
                    href={`/bovine/groups/${group.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 hover:text-emerald-700"
                  >
                    <span>View Cohort</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Users2 className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900">Create Management Group</h3>
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
                    Station *
                  </label>
                  <select
                    required
                    value={newFarmId}
                    onChange={(e) => {
                      setNewFarmId(e.target.value);
                      const fHerds = herds.filter((h) => h.farmId === e.target.value);
                      if (fHerds.length > 0) setNewHerdId(fHerds[0].id);
                    }}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Parent Herd *
                  </label>
                  <select
                    required
                    value={newHerdId}
                    onChange={(e) => setNewHerdId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  >
                    {herds
                      .filter((h) => h.farmId === newFarmId)
                      .map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.code})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Group Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GRP-12"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Cows Transition Pen 3"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Description & Nutrition Plan
                </label>
                <textarea
                  rows={3}
                  placeholder="Operational purpose, target DMI, dry period timing..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
