'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Award,
  ChevronRight,
  Tag,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';

export default function FarmAnimalsDirectoryPage() {
  const { animals, farms, herds, groups, promoteToBreedingStock } = useBovine();

  const [search, setSearch] = useState('');
  const [farmFilter, setFarmFilter] = useState('ALL');
  const [herdFilter, setHerdFilter] = useState('ALL');
  const [sexFilter, setSexFilter] = useState('ALL');

  // Filter farm animals (include unclassified or FARM_ANIMAL)
  const farmAnimals = animals.filter((a) => {
    if (a.classification === 'BREEDING_STOCK' && !a.isBreedingStock) return false;
    if (farmFilter !== 'ALL' && a.farmId !== farmFilter) return false;
    if (herdFilter !== 'ALL' && a.herdId !== herdFilter) return false;
    if (sexFilter !== 'ALL' && a.sex !== sexFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.internalId.toLowerCase().includes(q) ||
        (a.primaryIdentifier && a.primaryIdentifier.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <Layers className="w-4 h-4" />
            <span>Farm Livestock Operations • Supplemental Workflow</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Farm Animals Directory</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Operational livestock tracking, nursery development, daily management, and breeding stock qualification.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/bovine/animals/breeding-stock"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>View Breeding Stock Registry &rarr;</span>
          </Link>
          <Link
            id="btn-new-farm-animal"
            href="/bovine/animals/farm-animals/new"
            className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Farm Animal</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Farm Inventory</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{animals.length}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Active across all facilities</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Eligible for Qualification</div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
            {animals.filter((a) => !a.isBreedingStock && a.latestConditionScore >= 3.5).length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">High vigor & complete pedigree</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Female Cohort</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">
            {animals.filter((a) => a.sex === 'FEMALE').length}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Dams & prospective recipients</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Sire Candidates</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">
            {animals.filter((a) => a.sex === 'MALE').length}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Young bulls & steer stock</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search ear tag, name, internal ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          <select
            value={farmFilter}
            onChange={(e) => {
              setFarmFilter(e.target.value);
              setHerdFilter('ALL');
            }}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-stone-700 font-medium"
          >
            <option value="ALL">All Farms</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={herdFilter}
            onChange={(e) => setHerdFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-stone-700 font-medium"
          >
            <option value="ALL">All Herds</option>
            {herds
              .filter((h) => farmFilter === 'ALL' || h.farmId === farmFilter)
              .map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
          </select>

          <select
            value={sexFilter}
            onChange={(e) => setSexFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-stone-700 font-medium"
          >
            <option value="ALL">All Sexes</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
          </select>
        </div>
      </div>

      {/* Farm Animals Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Animal / Identifier</th>
                <th className="py-3 px-4">Sex &amp; Age</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Use &amp; Status</th>
                <th className="py-3 px-4">Breed Info</th>
                <th className="py-3 px-4">Breeding Classification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {farmAnimals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No farm animals found matching the filters.
                  </td>
                </tr>
              ) : (
                farmAnimals.map((animal) => {
                  const farm = farms.find((f) => f.id === animal.farmId);
                  const herd = herds.find((h) => h.id === animal.herdId);

                  return (
                    <tr key={animal.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          {animal.photoUrl ? (
                            <img
                              src={animal.photoUrl}
                              alt={animal.name}
                              className="w-9 h-9 rounded-xl object-cover border border-stone-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 font-bold">
                              <Layers className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <Link
                              href={`/bovine/animals/farm-animals/${animal.id}`}
                              className="font-bold text-stone-900 hover:text-emerald-800 transition-colors"
                            >
                              {animal.name}
                            </Link>
                            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-stone-500 mt-0.5">
                              <span className="bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                                {animal.primaryIdentifier || animal.internalId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-800">{animal.sex}</div>
                        <div className="text-[11px] text-stone-500">DOB: {animal.birthDate}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-800">{farm?.name || 'Unassigned Farm'}</div>
                        <div className="text-[11px] text-stone-500">{herd?.name || 'Main Herd'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                          {animal.useStatus.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-800">{animal.breed || 'Purebred'}</div>
                        <div className="text-[10px] text-stone-500">Reg: {animal.registrationStatus}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {animal.isBreedingStock || animal.classification === 'BREEDING_STOCK' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                            <Award className="w-3 h-3 mr-1 text-amber-700" />
                            Qualified Breeding Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                            Farm Livestock
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {!animal.isBreedingStock && animal.classification !== 'BREEDING_STOCK' && (
                            <Link
                              href={`/bovine/animals/farm-animals/${animal.id}/qualify-breeding-stock`}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300 transition-colors"
                            >
                              Qualify
                            </Link>
                          )}
                          <Link
                            href={`/bovine/animals/farm-animals/${animal.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                          >
                            <span>Profile</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
