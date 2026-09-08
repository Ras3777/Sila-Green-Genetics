'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  X,
  Search,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { ContemporaryGroup } from '@/lib/bovine-types';

export default function ContemporaryGroupsPage() {
  const { animals, farms, herds } = useBovine();
  const {
    contemporaryGroups,
    phenotypeObservations,
    addContemporaryGroup,
    closeContemporaryGroup,
  } = useGenetics();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(contemporaryGroups[0]?.id || '');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newFarmId, setNewFarmId] = useState(farms[0]?.id || '');
  const [newSexGroup, setNewSexGroup] = useState<'MALE' | 'FEMALE' | 'MIXED'>('MALE');
  const [newBirthSeason, setNewBirthSeason] = useState('Fall 2025');
  const [newFeedingGroup, setNewFeedingGroup] = useState('High Energy Total Mixed Ration');
  const [newDesc, setNewDesc] = useState('');

  const selectedGroup = contemporaryGroups.find((g) => g.id === selectedGroupId) || contemporaryGroups[0];

  // Phenotypes linked to selected group
  const groupPhenotypes = phenotypeObservations.filter(
    (p) => p.contemporaryGroupId === selectedGroup?.id
  );

  // Filtered groups
  const filteredGroups = contemporaryGroups.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q) ||
      (g.birthSeason || '').toLowerCase().includes(q)
    );
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;
    const farm = farms.find((f) => f.id === newFarmId);

    addContemporaryGroup({
      code: newCode.toUpperCase(),
      name: newName,
      farmId: newFarmId,
      farmName: farm?.name || 'Main Farm',
      sexGroup: newSexGroup,
      birthSeason: newBirthSeason,
      feedingGroup: newFeedingGroup,
      managementSystem: 'PASTURE_SUPPLEMENTED',
      status: 'ACTIVE',
      animalCount: 0,
      phenotypeCount: 0,
      description: newDesc || undefined,
      warnings: ['NEW_COHORT_BELOW_STATISTICAL_THRESHOLD'],
    });

    setCreateModalOpen(false);
    setNewCode('');
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Environmental Standardization
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">BLUP Cohort Grouping</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            Contemporary Groups (CG)
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Contemporary groups isolate environmental and management variance (herd, season, sex, nutrition) from genetic merit.
            Minimum cohort recommendation: ≥ 10 animals with at least 2 distinct sires to prevent bias.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Contemporary Group</span>
        </button>
      </div>

      {/* Main Grid: Groups List (Left) & Detail Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Group List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search contemporary groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
            />
          </div>

          <div className="space-y-2.5">
            {filteredGroups.map((cg) => {
              const isSelected = cg.id === selectedGroup?.id;
              return (
                <div
                  key={cg.id}
                  onClick={() => setSelectedGroupId(cg.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {cg.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cg.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {cg.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{cg.name}</h4>
                    <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                      <span>{cg.farmName}</span>
                      <span>•</span>
                      <span>{cg.birthSeason}</span>
                      <span>•</span>
                      <span>{cg.sexGroup}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px] text-stone-600">
                    <span className="font-semibold">{cg.animalCount} Animals Head</span>
                    <span>{cg.phenotypeCount} Observations</span>
                  </div>

                  {cg.warnings && cg.warnings.length > 0 && (
                    <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">{cg.warnings[0]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Group Inspection & Phenotype Cohort Breakdown */}
        <div className="lg:col-span-7">
          {selectedGroup ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      {selectedGroup.code}
                    </span>
                    <span className="text-xs text-stone-500">•</span>
                    <span className="text-xs text-stone-600">{selectedGroup.birthSeason}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">{selectedGroup.name}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedGroup.status === 'ACTIVE' && (
                    <button
                      onClick={() => closeContemporaryGroup(selectedGroup.id)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-stone-500" />
                      <span>Close Cohort</span>
                    </button>
                  )}
                  <Link
                    href={`/bovine/genetics/phenotypes?cg=${selectedGroup.id}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>Record in Group</span>
                  </Link>
                </div>
              </div>

              {/* Group Characteristics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Farm Location</span>
                  <span className="font-bold text-stone-900">{selectedGroup.farmName}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Sex Segregation</span>
                  <span className="font-bold text-stone-900">{selectedGroup.sexGroup}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Birth Window</span>
                  <span className="font-bold text-stone-900">{selectedGroup.birthSeason}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 sm:col-span-2">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Nutritional Ration</span>
                  <span className="font-bold text-stone-900">{selectedGroup.feedingGroup}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Management System</span>
                  <span className="font-bold text-stone-900">{selectedGroup.managementSystem}</span>
                </div>
              </div>

              {/* Statistical Integrity Warning banner if any */}
              {selectedGroup.warnings && selectedGroup.warnings.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-xs">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Genetic Evaluation Advisory</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    {selectedGroup.warnings.join('. ')}
                  </p>
                </div>
              )}

              {/* Phenotypes recorded in this CG */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Phenotype Records in this Cohort ({groupPhenotypes.length})
                  </h4>
                  <span className="text-[11px] text-stone-500">Standardized for National Base</span>
                </div>

                {groupPhenotypes.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 text-xs bg-stone-50 rounded-xl border border-stone-100">
                    No phenotype observations have been logged for this contemporary group yet.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                    {groupPhenotypes.map((obs) => (
                      <div
                        key={obs.id}
                        className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-stone-50/70"
                      >
                        <div>
                          <div className="font-bold text-stone-900">{obs.animalName}</div>
                          <div className="text-[11px] text-stone-500">
                            {obs.traitName} ({obs.traitCode}) • Age {obs.animalAgeDays}d
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-stone-900">
                            {obs.adjustedValue !== undefined ? obs.adjustedValue : obs.rawValue} {obs.unit}
                          </div>
                          <span
                            className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              obs.qualityStatus === 'VALIDATED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {obs.qualityStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
              Select a contemporary group from the left to view members and variance statistics.
            </div>
          )}
        </div>
      </div>

      {/* CREATE CONTEMPORARY GROUP MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Create Contemporary Group</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Group Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CG-2026-F01-BULLS"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 uppercase font-mono font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Sex Segregation</label>
                  <select
                    value={newSexGroup}
                    onChange={(e) => setNewSexGroup(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    <option value="MALE">Bulls Only (Male)</option>
                    <option value="FEMALE">Heifers Only (Female)</option>
                    <option value="MIXED">Mixed Cohort</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spring 2026 Bull Calves High-Pasture"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Farm Location</label>
                  <select
                    value={newFarmId}
                    onChange={(e) => setNewFarmId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Birth Season Window</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spring 2026 (Mar-May)"
                    value={newBirthSeason}
                    onChange={(e) => setNewBirthSeason(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Nutritional Ration / Feeding Regimen</label>
                <input
                  type="text"
                  placeholder="e.g. Total Mixed Ration + Free Choice Alfalfa Hay"
                  value={newFeedingGroup}
                  onChange={(e) => setNewFeedingGroup(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold cursor-pointer"
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
