'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Layers,
  Search,
  Plus,
  Filter,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Dna,
} from 'lucide-react';

interface HerdAnimalsPageProps {
  params: Promise<{ herdId: string }>;
}

export default function HerdAnimalsPage({ params }: HerdAnimalsPageProps) {
  const resolvedParams = use(params);
  const herdId = resolvedParams.herdId;

  const { herds, animals, identifiers, groups, breedCompositions } = useBovine();
  const herd = herds.find((h) => h.id === herdId);

  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('ALL');
  const [sexFilter, setSexFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  if (!herd) return null;

  const herdAnimals = animals.filter((a) => a.herdId === herd.id);
  const herdGroups = groups.filter((g) => g.herdId === herd.id);

  const filteredAnimals = herdAnimals.filter((a) => {
    if (groupFilter !== 'ALL' && a.managementGroupId !== groupFilter) return false;
    if (sexFilter !== 'ALL' && a.sex !== sexFilter) return false;
    if (statusFilter !== 'ALL' && a.lifeStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchInternal = a.internalId.toLowerCase().includes(q);
      const matchReg = a.registrationNumber?.toLowerCase().includes(q);
      const matchPrimary = a.primaryIdentifier?.toLowerCase().includes(q);
      const animIds = identifiers.filter((i) => i.animalId === a.id);
      const matchIds = animIds.some((i) => i.value.toLowerCase().includes(q));
      return matchName || matchInternal || matchReg || matchPrimary || matchIds;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Management Group filter */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          >
            <option value="ALL">All Groups ({herdGroups.length})</option>
            {herdGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.code})
              </option>
            ))}
          </select>

          {/* Sex filter */}
          <select
            value={sexFilter}
            onChange={(e) => setSexFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          >
            <option value="ALL">All Sexes</option>
            <option value="FEMALE">Female / Heifers</option>
            <option value="MALE">Male / Bulls</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          >
            <option value="ALL">All Life Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SICK">Sick / Care</option>
            <option value="CULLED">Culled</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search animals in herd..."
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
            <span>Enroll Cattle</span>
          </Link>
        </div>
      </div>

      {/* Cattle Table / Cards */}
      {filteredAnimals.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <Layers className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No Cattle Found in this Herd</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {herdAnimals.length === 0
              ? 'No animals are assigned to this herd yet. Enroll a new animal or reassign cattle from the workbench.'
              : 'No cattle match your selected filter criteria.'}
          </p>
          <Link
            href="/bovine/animals/new"
            className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll New Animal</span>
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Animal Identity</th>
                  <th className="py-3 px-4">Sex / DOB</th>
                  <th className="py-3 px-4">Breed Profile</th>
                  <th className="py-3 px-4">Assigned Group</th>
                  <th className="py-3 px-4">Life / Use Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredAnimals.map((animal) => {
                  const animIds = identifiers.filter((i) => i.animalId === animal.id);
                  const group = groups.find((g) => g.id === animal.managementGroupId);
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
                        <div className="text-[11px] text-stone-500">
                          {breeds.length > 1 ? `${breeds.length} breed composition` : '100% Purebred'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {group ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                            {group.name}
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">Unassigned</span>
                        )}
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
  );
}
