'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Users2,
  Plus,
  Search,
  ArrowRight,
  Sparkles,
  Calendar,
  X,
  CheckCircle2,
  Utensils,
} from 'lucide-react';

interface HerdGroupsPageProps {
  params: Promise<{ herdId: string }>;
}

export default function HerdGroupsPage({ params }: HerdGroupsPageProps) {
  const resolvedParams = use(params);
  const herdId = resolvedParams.herdId;

  const { herds, groups, animals, addGroup, groupFeedingLogs } = useBovine();
  const herd = herds.find((h) => h.id === herdId);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'CLOSED'>('ACTIVE');

  if (!herd) return null;

  const herdGroups = groups.filter((g) => g.herdId === herd.id);

  const filteredGroups = herdGroups.filter((g) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return g.name.toLowerCase().includes(q) || g.code.toLowerCase().includes(q) || g.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    addGroup({
      farmId: herd.farmId,
      herdId: herd.id,
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

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search management groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Management Group</span>
        </button>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <Users2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No Management Groups in this Herd</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Management groups partition cattle for specific diets, breeding synchronizations, or developmental tiers.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Group</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => {
            const groupAnimals = animals.filter((a) => a.managementGroupId === group.id);
            const feedLogs = groupFeedingLogs.filter((f) => f.managementGroupId === group.id);
            const latestFeed = feedLogs[0];

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

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="p-2 rounded-xl bg-stone-50">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Assigned</span>
                      <span className="font-bold text-stone-900 font-mono">{groupAnimals.length} head</span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-50">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Ration</span>
                      <span className="font-bold text-stone-900 font-mono truncate block">
                        {latestFeed ? latestFeed.rationName : 'TMR Standard'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Active since {new Date(group.startDate).toLocaleDateString()}
                  </span>

                  <Link
                    href={`/bovine/groups/${group.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 hover:text-emerald-700"
                  >
                    <span>Inspect Group</span>
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
                    Group Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GRP-10"
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
                    <option value="CLOSED">Closed / Disbanded</option>
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
                  placeholder="e.g. High Yielding Early Lactation Pen 1"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Description & Nutritional Strategy
                </label>
                <textarea
                  rows={3}
                  placeholder="Target production, ration requirements, breeding protocol..."
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
