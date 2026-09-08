'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Users2,
  Users,
  Building2,
  ArrowLeft,
  Layers,
  Utensils,
  Calendar,
  Search,
  Plus,
  ArrowRight,
  Dna,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface GroupProfilePageProps {
  params: Promise<{ groupId: string }>;
}

export default function GroupProfilePage({ params }: GroupProfilePageProps) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.groupId;

  const { groups, herds, farms, animals, identifiers, breedCompositions, groupFeedingLogs } = useBovine();
  const group = groups.find((g) => g.id === groupId);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'animals' | 'feeding'>('animals');

  if (!group) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-xl font-bold text-stone-900">Management Group Not Found</h1>
        <p className="text-xs text-stone-500">No management group matches ID &ldquo;{groupId}&rdquo;.</p>
        <Link
          href="/bovine/groups"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
        >
          Return to Groups Directory
        </Link>
      </div>
    );
  }

  const farm = farms.find((f) => f.id === group.farmId);
  const herd = herds.find((h) => h.id === group.herdId);
  const groupAnimals = animals.filter((a) => a.managementGroupId === group.id);
  const feedLogs = groupFeedingLogs.filter((f) => f.managementGroupId === group.id);

  const filteredAnimals = groupAnimals.filter((a) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchInternal = a.internalId.toLowerCase().includes(q);
      const matchPrimary = a.primaryIdentifier?.toLowerCase().includes(q);
      return matchName || matchInternal || matchPrimary;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/groups" className="hover:text-emerald-800 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Management Groups</span>
        </Link>
        <span>/</span>
        {herd && (
          <>
            <Link href={`/bovine/herds/${herd.id}`} className="hover:text-emerald-800">
              {herd.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-mono text-stone-700">{group.code}</span>
        <span>/</span>
        <span className="font-semibold text-stone-900">{group.name}</span>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              <Users2 className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {group.code}
                </span>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                    group.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  {group.status} Group
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {group.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                {farm && (
                  <Link
                    href={`/bovine/farms/${farm.id}`}
                    className="flex items-center text-stone-700 hover:text-emerald-800 font-medium"
                  >
                    <Building2 className="w-3.5 h-3.5 mr-1 text-stone-400" />
                    <span>Station: {farm.name}</span>
                  </Link>
                )}
                {herd && (
                  <>
                    <span>&bull;</span>
                    <Link
                      href={`/bovine/herds/${herd.id}`}
                      className="flex items-center text-stone-700 hover:text-emerald-800 font-medium"
                    >
                      <Users className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      <span>Herd: {herd.name}</span>
                    </Link>
                  </>
                )}
                <span>&bull;</span>
                <span>Active since {new Date(group.startDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Group Head</span>
              <span className="font-bold text-stone-900 text-base font-mono">{groupAnimals.length} head</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
              <span className="text-emerald-700 block text-[10px] uppercase font-bold">Daily Log Rate</span>
              <span className="font-bold text-emerald-900 text-base font-mono">{group.dailyLogCompletionPct}%</span>
            </div>
          </div>
        </div>

        {/* Group Description & Purpose */}
        {group.description && (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 leading-relaxed">
            <span className="font-bold text-stone-800 block text-[10px] uppercase tracking-wider mb-1">
              Nutritional & Operational Purpose
            </span>
            {group.description}
          </div>
        )}

        {/* Inner Tabs */}
        <div className="flex items-center space-x-2 border-t border-stone-100 pt-4">
          <button
            onClick={() => setActiveTab('animals')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'animals'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Assigned Cattle ({groupAnimals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('feeding')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'feeding'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Group Feeding Ledger ({feedLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Cattle List */}
      {activeTab === 'animals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search animals in cohort..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
              />
            </div>

            <Link
              href="/bovine/animals/new"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Animal</span>
            </Link>
          </div>

          {filteredAnimals.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
              <Layers className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-stone-800">No Animals in this Cohort</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                No cattle are currently assigned to this management group. You can assign animals from the Daily Operations workbench.
              </p>
              <Link
                href="/bovine/daily-operations"
                className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Go to Daily Operations Workbench</span>
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-stone-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Identity</th>
                      <th className="py-3 px-4">Sex / Age</th>
                      <th className="py-3 px-4">Breed</th>
                      <th className="py-3 px-4">Life / Use Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredAnimals.map((animal) => {
                      const breeds = breedCompositions.filter((b) => b.animalId === animal.id);
                      const primaryBreed = breeds[0]?.breedName || 'Holstein Friesian';

                      return (
                        <tr key={animal.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={animal.photoUrl || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=150&auto=format&fit=crop&q=80'}
                                alt={animal.name}
                                className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                  <span>{animal.name}</span>
                                  {animal.requiresReview && (
                                    <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                      Review
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono mt-0.5">
                                  <span>{animal.internalId}</span>
                                  {animal.primaryIdentifier && (
                                    <>
                                      <span>&bull;</span>
                                      <span className="text-emerald-800 font-semibold">{animal.primaryIdentifier}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-stone-800">{animal.sex}</div>
                            <div className="text-[11px] text-stone-500">Born {new Date(animal.birthDate).toLocaleDateString()}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-stone-900 flex items-center gap-1">
                              <Dna className="w-3.5 h-3.5 text-emerald-800" />
                              <span>{primaryBreed}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                                  animal.lifeStatus === 'ACTIVE'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : animal.lifeStatus === 'SICK'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                {animal.lifeStatus}
                              </span>
                              <span className="text-[10px] text-stone-500 capitalize">
                                {animal.useStatus.replace(/_/g, ' ').toLowerCase()}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/bovine/animals/${animal.id}`}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                            >
                              <span>Animal 360</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Feeding Records */}
      {activeTab === 'feeding' && (
        <div className="space-y-3">
          {feedLogs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
              <Utensils className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-stone-800">No Feeding Records for this Cohort</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                No nutrition drops have been assigned directly to this management group yet.
              </p>
            </div>
          ) : (
            feedLogs.map((log) => (
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
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{new Date(log.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-50">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Fed Head</span>
                    <span className="font-bold text-stone-900 font-mono text-sm">{log.animalsFedCount} head</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Consumed</span>
                    <span className="font-bold text-stone-900 font-mono text-sm">{log.feedConsumedKg} kg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/60">
                    <span className="text-blue-800 block text-[10px] uppercase font-bold">Dry Matter</span>
                    <span className="font-bold text-blue-950 font-mono text-sm">{log.dryMatterPct}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/60">
                    <span className="text-purple-800 block text-[10px] uppercase font-bold">DMI / Head</span>
                    <span className="font-bold text-purple-950 font-mono text-sm">{log.dmiKgPerHead} kg/hd</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
