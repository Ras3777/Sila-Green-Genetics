'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  Pin,
  Clock,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Layers,
} from 'lucide-react';

export default function BovineSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { animals, identifiers, breedCompositions, farms, herds } = useBovine();

  // Search States
  const [query, setQuery] = useState(initialQuery);
  const [exactMatchMode, setExactMatchMode] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filters
  const [selectedSex, setSelectedSex] = useState<string>('ALL');
  const [selectedLifeStatus, setSelectedLifeStatus] = useState<string>('ALL');
  const [selectedUseStatus, setSelectedUseStatus] = useState<string>('ALL');
  const [selectedFarm, setSelectedFarm] = useState<string>('ALL');
  const [selectedBreed, setSelectedBreed] = useState<string>('ALL');
  const [selectedRegistration, setSelectedRegistration] = useState<string>('ALL');

  // Recent & Pinned Searches
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'US-9941203',
    'Altair Supernova',
    'Holstein Donors',
    'Angus Bulls',
  ]);
  const [pinnedSearches, setPinnedSearches] = useState<string[]>([
    'Requires Veterinary Review',
    'Elite Genomic Donors',
  ]);

  // Calculate age from birth date
  const calculateAge = (birthDateStr: string) => {
    const birth = new Date(birthDateStr);
    const now = new Date('2026-09-04');
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (diffMonths < 12) return `${diffMonths} mo`;
    const years = Math.floor(diffMonths / 12);
    const remainingMo = diffMonths % 12;
    return remainingMo > 0 ? `${years}y ${remainingMo}m` : `${years} yrs`;
  };

  // Filtered Animals
  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      // Query filter
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const animIds = identifiers.filter((i) => i.animalId === animal.id);

        if (exactMatchMode) {
          const matchPrimary = animal.primaryIdentifier?.toLowerCase() === q;
          const matchInternal = animal.internalId.toLowerCase() === q;
          const matchAnyId = animIds.some((i) => i.value.toLowerCase() === q);
          if (!matchPrimary && !matchInternal && !matchAnyId) return false;
        } else {
          const matchName = animal.name.toLowerCase().includes(q);
          const matchInternal = animal.internalId.toLowerCase().includes(q);
          const matchPrimary = animal.primaryIdentifier?.toLowerCase().includes(q);
          const matchReg = animal.registrationNumber?.toLowerCase().includes(q);
          const matchAnyId = animIds.some((i) => i.value.toLowerCase().includes(q));
          if (!matchName && !matchInternal && !matchPrimary && !matchReg && !matchAnyId) {
            return false;
          }
        }
      }

      // Sex filter
      if (selectedSex !== 'ALL' && animal.sex !== selectedSex) return false;

      // Life Status filter
      if (selectedLifeStatus !== 'ALL' && animal.lifeStatus !== selectedLifeStatus) return false;

      // Use Status filter
      if (selectedUseStatus !== 'ALL' && animal.useStatus !== selectedUseStatus) return false;

      // Farm filter
      if (selectedFarm !== 'ALL' && animal.farmId !== selectedFarm) return false;

      // Registration status filter
      if (selectedRegistration !== 'ALL' && animal.registrationStatus !== selectedRegistration) return false;

      // Breed filter
      if (selectedBreed !== 'ALL') {
        const bcs = breedCompositions.filter((bc) => bc.animalId === animal.id);
        const hasBreed = bcs.some((bc) => bc.breedName.toLowerCase().includes(selectedBreed.toLowerCase()));
        if (!hasBreed) return false;
      }

      return true;
    });
  }, [
    animals,
    identifiers,
    breedCompositions,
    query,
    exactMatchMode,
    selectedSex,
    selectedLifeStatus,
    selectedUseStatus,
    selectedFarm,
    selectedBreed,
    selectedRegistration,
  ]);

  const resetFilters = () => {
    setQuery('');
    setSelectedSex('ALL');
    setSelectedLifeStatus('ALL');
    setSelectedUseStatus('ALL');
    setSelectedFarm('ALL');
    setSelectedBreed('ALL');
    setSelectedRegistration('ALL');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>Livestock Search Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Comprehensive Animal Lookup
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Query across electronic IDs, ear tags, national registries, and genealogical records
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
              viewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Table View"
          >
            <TableIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
              viewMode === 'cards' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Search Input & Quick Query Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="search-input-main"
              type="text"
              placeholder="Enter Ear Tag (US-...), RFID, DGR, Name, or Breed..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <label className="flex items-center space-x-2 px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 cursor-pointer select-none">
            <input
              id="checkbox-exact-match"
              type="checkbox"
              checked={exactMatchMode}
              onChange={(e) => setExactMatchMode(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-700"
            />
            <span>Exact ID Mode (RFID/DGR)</span>
          </label>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Sex</label>
            <select
              id="filter-sex"
              value={selectedSex}
              onChange={(e) => setSelectedSex(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="ALL">All Sexes</option>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Use Status</label>
            <select
              id="filter-use-status"
              value={selectedUseStatus}
              onChange={(e) => setSelectedUseStatus(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="ALL">All Uses</option>
              <option value="DONOR">Donor</option>
              <option value="RECIPIENT">Recipient</option>
              <option value="AI_SIRE">AI Sire</option>
              <option value="NATURAL_SERVICE_SIRE">Natural Sire</option>
              <option value="BREEDING_STOCK">Breeding Stock</option>
              <option value="TEST_ANIMAL">Test Animal</option>
              <option value="CULL_CANDIDATE">Cull Candidate</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Farm Scope</label>
            <select
              id="filter-farm"
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="ALL">All Farms</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code} - {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Breed</label>
            <select
              id="filter-breed"
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="ALL">All Breeds</option>
              <option value="Holstein">Holstein</option>
              <option value="Angus">Angus</option>
              <option value="Jersey">Jersey</option>
              <option value="Simmental">Simmental</option>
              <option value="Wagyu">Wagyu</option>
              <option value="Brown Swiss">Brown Swiss</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Life Status</label>
            <select
              id="filter-life-status"
              value={selectedLifeStatus}
              onChange={(e) => setSelectedLifeStatus(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ALIVE">Alive</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SOLD">Sold</option>
              <option value="DEAD">Dead / Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Registration</label>
            <select
              id="filter-registration"
              value={selectedRegistration}
              onChange={(e) => setSelectedRegistration(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        {/* Search chips (Recent & Pinned) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center mr-1">
            <Clock className="w-3 h-3 mr-1" /> Quick:
          </span>
          {recentSearches.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
          {(query || selectedSex !== 'ALL' || selectedFarm !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="text-emerald-800 font-semibold text-xs hover:underline ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>Found {filteredAnimals.length} matching livestock records</span>
        <span>Displaying live registry inventory</span>
      </div>

      {/* Results View */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 pl-6">Primary ID / Name</th>
                  <th className="p-3.5">Sex & Age</th>
                  <th className="p-3.5">Breed Composition</th>
                  <th className="p-3.5">Current Placement</th>
                  <th className="p-3.5">Use Status</th>
                  <th className="p-3.5">Status & Alert</th>
                  <th className="p-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredAnimals.map((animal) => {
                  const farm = farms.find((f) => f.id === animal.farmId);
                  const herd = herds.find((h) => h.id === animal.herdId);
                  const bcs = breedCompositions.filter((bc) => bc.animalId === animal.id);
                  const breedSummary = bcs.map((b) => `${b.percentage}% ${b.breedName}`).join(', ');

                  return (
                    <tr key={animal.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3.5 pl-6">
                        <div className="font-bold text-stone-900 flex items-center space-x-2">
                          <Link href={`/bovine/animals/${animal.id}`} className="hover:text-emerald-800 hover:underline">
                            {animal.name}
                          </Link>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {animal.primaryIdentifier || animal.internalId}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                          {animal.internalId} {animal.registrationNumber && `• ${animal.registrationNumber}`}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-stone-900">{animal.sex}</div>
                        <div className="text-[11px] text-stone-500">{calculateAge(animal.birthDate)}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-stone-800 truncate max-w-xs">
                          {breedSummary || 'Unspecified'}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {bcs[0]?.source?.replace(/_/g, ' ') || 'Registered'}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-stone-900">{farm?.name || 'Unknown Farm'}</div>
                        <div className="text-[11px] text-stone-500">{herd?.name || 'Unassigned Herd'}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                          {animal.useStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${animal.lifeStatus === 'ALIVE' ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                          <span className="text-stone-700 font-medium">{animal.lifeStatus}</span>
                        </div>
                        {animal.requiresReview && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Requires Review
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <Link
                          href={`/bovine/animals/${animal.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-700 font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>360</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAnimals.length === 0 && (
            <div className="p-12 text-center text-stone-500 text-xs">
              <Layers className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              No livestock found matching your current query and filters.
            </div>
          )}
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnimals.map((animal) => {
            const farm = farms.find((f) => f.id === animal.farmId);
            const herd = herds.find((h) => h.id === animal.herdId);
            const bcs = breedCompositions.filter((bc) => bc.animalId === animal.id);
            const breedSummary = bcs.map((b) => `${b.percentage}% ${b.breedName}`).join(', ');

            return (
              <div
                key={animal.id}
                className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/bovine/animals/${animal.id}`}
                      className="font-bold text-base text-stone-900 hover:text-emerald-800 hover:underline block"
                    >
                      {animal.name}
                    </Link>
                    <div className="text-[11px] font-mono text-emerald-800 font-semibold mt-0.5">
                      {animal.primaryIdentifier || animal.internalId}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                    {animal.useStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase">Sex & Age</span>
                    <div className="font-semibold text-stone-800">{animal.sex} • {calculateAge(animal.birthDate)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase">Placement</span>
                    <div className="font-semibold text-stone-800 truncate">{farm?.name || 'Farm'}</div>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] text-stone-400 uppercase">Breed</span>
                  <div className="text-stone-700 truncate">{breedSummary || 'Unspecified'}</div>
                </div>

                {animal.requiresReview && (
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                    Attention: {animal.reviewReason || 'Flagged for veterinary review'}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <span className="text-xs text-stone-500 font-mono">ID: {animal.internalId}</span>
                  <Link
                    href={`/bovine/animals/${animal.id}`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold"
                  >
                    <span>View Profile</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
