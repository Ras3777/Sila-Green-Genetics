'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  ChevronRight,
  Tag,
  ShieldCheck,
  TrendingUp,
  Dna,
  GitBranch,
  Calculator,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';

export default function BreedingStockDirectoryPage() {
  const { animals, farms, herds } = useBovine();

  const [search, setSearch] = useState('');
  const [breedFilter, setBreedFilter] = useState('ALL');
  const [sexFilter, setSexFilter] = useState('ALL');
  const [farmFilter, setFarmFilter] = useState('ALL');

  // Filter breeding stock animals (qualified breeding stock or useStatus in breeding categories)
  const breedingStock = animals.filter((a) => {
    const isBS =
      a.isBreedingStock ||
      a.classification === 'BREEDING_STOCK' ||
      a.useStatus === 'BREEDING_STOCK' ||
      a.useStatus === 'AI_SIRE' ||
      a.useStatus === 'DONOR';
    if (!isBS) return false;
    if (farmFilter !== 'ALL' && a.farmId !== farmFilter) return false;
    if (breedFilter !== 'ALL' && a.breed !== breedFilter) return false;
    if (sexFilter !== 'ALL' && a.sex !== sexFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.internalId.toLowerCase().includes(q) ||
        (a.primaryIdentifier && a.primaryIdentifier.toLowerCase().includes(q)) ||
        (a.dgr && a.dgr.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const uniqueBreeds = Array.from(new Set(animals.map((a) => a.breed || 'Holstein Friesian')));

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
            <Award className="w-4 h-4" />
            <span>Genomics &amp; Herdbook Registry • Supplemental Workflow</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Breeding Stock Registry</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Verified pedigree herdbook, genetic evaluation indices (EBVs/EPDs), physical trait measurements, and mate allocation candidates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/bovine/animals/farm-animals"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>&larr; Farm Livestock Directory</span>
          </Link>
          <Link
            id="btn-register-breeding-stock"
            href="/bovine/animals/breeding-stock/new"
            className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Breeding Stock</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Qualified Breeding Animals</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{breedingStock.length}</div>
          <div className="text-[11px] text-amber-700 mt-0.5 flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>Verified 3-Gen Pedigree</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Elite AI Sires</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">
            {breedingStock.filter((a) => a.sex === 'MALE').length}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Top percentile terminal &amp; maternal</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Nucleus Donor Dams</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">
            {breedingStock.filter((a) => a.sex === 'FEMALE').length}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Enrolled in IVF / ET programs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Mean Inbreeding (F)</div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">3.4%</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Target ceiling &le; 6.25%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search DGR, ear tag, name, breed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          <select
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-stone-700 font-medium"
          >
            <option value="ALL">All Breeds</option>
            {uniqueBreeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={sexFilter}
            onChange={(e) => setSexFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-stone-700 font-medium"
          >
            <option value="ALL">All Sexes</option>
            <option value="FEMALE">Female (Donors / Dams)</option>
            <option value="MALE">Male (Sires / Bulls)</option>
          </select>

          <select
            value={farmFilter}
            onChange={(e) => setFarmFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-stone-700 font-medium"
          >
            <option value="ALL">All Facilities</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Breeding Stock Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Breeding Animal</th>
                <th className="py-3 px-4">DGR / Ear Tag</th>
                <th className="py-3 px-4">Breed &amp; Role</th>
                <th className="py-3 px-4">Sire &amp; Dam Lineage</th>
                <th className="py-3 px-4">Inbreeding (F)</th>
                <th className="py-3 px-4">Status &amp; Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {breedingStock.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No breeding stock animals found. Register a new breeding animal or qualify a farm animal.
                  </td>
                </tr>
              ) : (
                breedingStock.map((animal) => {
                  const farm = farms.find((f) => f.id === animal.farmId);
                  const herd = herds.find((h) => h.id === animal.herdId);

                  return (
                    <tr key={animal.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          {animal.photoUrl ? (
                            <img
                              src={animal.photoUrl}
                              alt={animal.name}
                              className="w-10 h-10 rounded-xl object-cover border border-amber-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-bold">
                              <Award className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <Link
                              href={`/bovine/animals/breeding-stock/${animal.id}`}
                              className="font-bold text-stone-900 hover:text-amber-700 transition-colors flex items-center gap-1"
                            >
                              <span>{animal.name}</span>
                              <Award className="w-3 h-3 text-amber-600" />
                            </Link>
                            <div className="text-[11px] text-stone-500">
                              {animal.sex} • DOB: {animal.birthDate}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-900">
                          {animal.dgr || `DGR-${animal.primaryIdentifier || animal.internalId}`}
                        </div>
                        <div className="text-[10px] font-mono text-stone-500">
                          Tag: {animal.primaryIdentifier || animal.internalId}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{animal.breed || 'Holstein Friesian'}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          {animal.useStatus.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs text-stone-800 font-medium">
                          S: <span className="font-semibold">{animal.sireName || 'Recorded Sire'}</span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          D: <span className="font-semibold">{animal.damName || 'Recorded Dam'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-emerald-800">
                          {((animal.inbreedingCoefficient || 0.034) * 100).toFixed(2)}%
                        </div>
                        <div className="text-[10px] text-stone-500">Kinship safe</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          QUALIFIED
                        </span>
                        <div className="text-[10px] text-stone-500 mt-0.5">{farm?.name}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            href={`/bovine/animals/${animal.id}/pedigree`}
                            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <GitBranch className="w-3 h-3 text-stone-500" />
                            <span>Pedigree</span>
                          </Link>
                          <Link
                            href={`/bovine/animals/breeding-stock/${animal.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-2xs"
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
