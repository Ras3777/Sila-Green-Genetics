'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Layers,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  Table as TableIcon,
  LayoutGrid,
  BarChart3,
  CheckSquare,
  Truck,
  Eye,
  SlidersHorizontal,
  X,
  Sparkles,
  GitCompare,
  Upload,
} from 'lucide-react';
import { Animal, AnimalSex, LifeStatus, LivestockUseStatus } from '@/lib/bovine-types';

export default function BovineAnimalsListPage() {
  const {
    animals,
    identifiers,
    breedCompositions,
    farms,
    herds,
    moveAnimals,
    addAnimalTask,
  } = useBovine();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewTab, setActiveViewTab] = useState<string>('ALL');
  const [filterSex, setFilterSex] = useState<string>('ALL');
  const [filterFarm, setFilterFarm] = useState<string>('ALL');
  const [filterHerd, setFilterHerd] = useState<string>('ALL');
  const [filterLifeStatus, setFilterLifeStatus] = useState<string>('ALIVE');
  const [density, setDensity] = useState<'compact' | 'normal' | 'relaxed'>('normal');
  const [displayMode, setDisplayMode] = useState<'table' | 'cards'>('table');

  // Sorting
  const [sortField, setSortField] = useState<'name' | 'birthDate' | 'internalId'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selection & Bulk Actions
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [isBulkMoveOpen, setIsBulkMoveOpen] = useState(false);
  const [bulkDestinationFarm, setBulkDestinationFarm] = useState(farms[0]?.id || '');
  const [bulkDestinationHerd, setBulkDestinationHerd] = useState('');
  const [bulkMoveReason, setBulkMoveReason] = useState('MANAGEMENT_ROTATION');

  // Analytics Drawer
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Saved Views configuration
  const handleSavedViewSelect = (view: string) => {
    setActiveViewTab(view);
    if (view === 'DONORS') {
      setFilterLifeStatus('ALIVE');
    } else if (view === 'RECIPIENTS') {
      setFilterLifeStatus('ALIVE');
    } else if (view === 'CULL') {
      setFilterLifeStatus('ALIVE');
    } else if (view === 'REVIEW') {
      setFilterLifeStatus('ALL');
    } else if (view === 'ALL') {
      setFilterLifeStatus('ALL');
      setFilterSex('ALL');
    }
  };

  // Filtered & Sorted Animals
  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      // Saved View Filter
      if (activeViewTab === 'DONORS' && animal.useStatus !== 'DONOR') return false;
      if (activeViewTab === 'RECIPIENTS' && animal.useStatus !== 'RECIPIENT') return false;
      if (activeViewTab === 'BREEDING_STOCK' && animal.useStatus !== 'BREEDING_STOCK') return false;
      if (activeViewTab === 'CULL' && animal.useStatus !== 'CULL_CANDIDATE') return false;
      if (activeViewTab === 'REVIEW' && !animal.requiresReview) return false;
      if (activeViewTab === 'MISSING_DATA' && animal.primaryIdentifier) return false;

      // Text Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = animal.name.toLowerCase().includes(q);
        const matchesId = animal.internalId.toLowerCase().includes(q);
        const matchesPrimary = animal.primaryIdentifier?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesPrimary) return false;
      }

      if (filterSex !== 'ALL' && animal.sex !== filterSex) return false;
      if (filterLifeStatus !== 'ALL' && animal.lifeStatus !== filterLifeStatus) return false;
      if (filterFarm !== 'ALL' && animal.farmId !== filterFarm) return false;
      if (filterHerd !== 'ALL' && animal.herdId !== filterHerd) return false;

      return true;
    }).sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortField === 'birthDate') {
        return sortOrder === 'asc' ? a.birthDate.localeCompare(b.birthDate) : b.birthDate.localeCompare(a.birthDate);
      }
      return sortOrder === 'asc' ? a.internalId.localeCompare(b.internalId) : b.internalId.localeCompare(a.internalId);
    });
  }, [
    animals,
    searchQuery,
    activeViewTab,
    filterSex,
    filterLifeStatus,
    filterFarm,
    filterHerd,
    sortField,
    sortOrder,
  ]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedAnimalIds.length === filteredAnimals.length) {
      setSelectedAnimalIds([]);
    } else {
      setSelectedAnimalIds(filteredAnimals.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedAnimalIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // CSV Export Generator
  const exportToCSV = () => {
    const headers = ['Internal ID', 'Name', 'Primary Identifier', 'Sex', 'Birth Date', 'Life Status', 'Use Status', 'Farm ID', 'Herd ID'];
    const rows = filteredAnimals.map((a) => [
      a.internalId,
      `"${a.name}"`,
      a.primaryIdentifier || '',
      a.sex,
      a.birthDate,
      a.lifeStatus,
      a.useStatus,
      a.farmId,
      a.herdId,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bovine_registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Execute Bulk Movement
  const handleBulkMoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimalIds.length === 0 || !bulkDestinationFarm) return;

    moveAnimals({
      animalIds: selectedAnimalIds,
      destinationFarmId: bulkDestinationFarm,
      destinationHerdId: bulkDestinationHerd || undefined,
      movementDate: '2026-09-04',
      reason: bulkMoveReason,
    });

    setIsBulkMoveOpen(false);
    setSelectedAnimalIds([]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Livestock Master Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Animals & Breeding Stock
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Individual animal identities, genealogical lineages, reproductive uses, and physical placements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            id="btn-nav-import-animals"
            href="/bovine/animals/import"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span>Import</span>
          </Link>

          <Link
            id="btn-nav-compare-animals"
            href={
              selectedAnimalIds.length >= 2
                ? `/bovine/animals/compare?ids=${selectedAnimalIds.slice(0, 4).join(',')}`
                : '/bovine/animals/compare'
            }
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5 text-stone-500" />
            <span>Compare {selectedAnimalIds.length > 0 && `(${selectedAnimalIds.length})`}</span>
          </Link>

          <button
            id="btn-export-animals-csv"
            onClick={exportToCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-800" />
            <span>Analytics</span>
          </button>

          <Link
            id="btn-enroll-new-animal"
            href="/bovine/animals/new"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Animal</span>
          </Link>
        </div>
      </div>

      {/* Saved Views Toolbar */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2 text-xs border-b border-stone-200">
        {[
          { id: 'ALL', label: 'All Animals' },
          { id: 'DONORS', label: 'Embryo Donors' },
          { id: 'RECIPIENTS', label: 'Recipients' },
          { id: 'BREEDING_STOCK', label: 'Breeding Stock' },
          { id: 'CULL', label: 'Cull Candidates' },
          { id: 'REVIEW', label: 'Requires Review' },
          { id: 'MISSING_DATA', label: 'Missing Primary ID' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSavedViewSelect(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeViewTab === tab.id
                ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter and Density Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, internal ID, ear tag, registration number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-2xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filterFarm}
              onChange={(e) => setFilterFarm(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-stone-800"
            >
              <option value="ALL">All Farms</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>

            <select
              value={filterSex}
              onChange={(e) => setFilterSex(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-stone-800"
            >
              <option value="ALL">All Sexes</option>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
            </select>

            {/* Density & Layout Toggle */}
            <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setDisplayMode('table')}
                className={`p-1.5 rounded-lg ${displayMode === 'table' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500'}`}
                title="Table"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDisplayMode('cards')}
                className={`p-1.5 rounded-lg ${displayMode === 'cards' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500'}`}
                title="Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar if items selected */}
        {selectedAnimalIds.length > 0 && (
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 animate-fade-in">
            <div className="font-semibold flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-emerald-700" />
              <span>{selectedAnimalIds.length} Livestock Selected</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="btn-bulk-move-modal"
                onClick={() => setIsBulkMoveOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition-colors shadow-2xs"
              >
                Transfer / Move Herds
              </button>

              <button
                onClick={() => {
                  selectedAnimalIds.forEach((id) => {
                    const anim = animals.find((a) => a.id === id);
                    if (anim) {
                      addAnimalTask({
                        animalId: anim.id,
                        animalName: anim.name,
                        animalIdentifier: anim.primaryIdentifier || anim.internalId,
                        title: `Bulk Check: ${anim.name}`,
                        taskType: 'HEALTH_CHECK',
                        priority: 'MEDIUM',
                        status: 'OPEN',
                        dueDate: '2026-09-05',
                        assigneeName: 'Unassigned',
                        farmId: anim.farmId,
                        herdId: anim.herdId,
                      });
                    }
                  });
                  setSelectedAnimalIds([]);
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50"
              >
                Create Tasks
              </button>

              <button
                onClick={() => setSelectedAnimalIds([])}
                className="text-stone-500 hover:text-stone-800 text-xs px-2"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Drawer (Collapsible) */}
      {isAnalyticsOpen && (
        <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">Population Dynamics Breakdown</h2>
            <button onClick={() => setIsAnalyticsOpen(false)} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white border border-stone-200">
              <span className="text-stone-500">Females</span>
              <div className="text-xl font-bold text-stone-900 mt-1">
                {filteredAnimals.filter((a) => a.sex === 'FEMALE').length} Head
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-stone-200">
              <span className="text-stone-500">Males</span>
              <div className="text-xl font-bold text-stone-900 mt-1">
                {filteredAnimals.filter((a) => a.sex === 'MALE').length} Head
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-stone-200">
              <span className="text-stone-500">Requires Review</span>
              <div className="text-xl font-bold text-amber-700 mt-1">
                {filteredAnimals.filter((a) => a.requiresReview).length} Head
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-stone-200">
              <span className="text-stone-500">Missing Primary Tag</span>
              <div className="text-xl font-bold text-stone-900 mt-1">
                {filteredAnimals.filter((a) => !a.primaryIdentifier).length} Head
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Animals Display */}
      {displayMode === 'table' ? (
        <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 pl-5 w-8">
                    <input
                      type="checkbox"
                      checked={selectedAnimalIds.length === filteredAnimals.length && filteredAnimals.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                    />
                  </th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-stone-900"
                    onClick={() => {
                      setSortField('name');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Animal Name / Primary ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Sex & DOB</th>
                  <th className="p-3.5">Breed</th>
                  <th className="p-3.5">Current Placement</th>
                  <th className="p-3.5">Role / Use</th>
                  <th className="p-3.5">Status & Alert</th>
                  <th className="p-3.5 pr-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredAnimals.map((animal) => {
                  const farm = farms.find((f) => f.id === animal.farmId);
                  const herd = herds.find((h) => h.id === animal.herdId);
                  const bcs = breedCompositions.filter((bc) => bc.animalId === animal.id);
                  const isSelected = selectedAnimalIds.includes(animal.id);

                  return (
                    <tr
                      key={animal.id}
                      className={`hover:bg-stone-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}
                    >
                      <td className="p-3.5 pl-5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(animal.id)}
                          className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                        />
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-stone-900 flex items-center space-x-2">
                          <Link href={`/bovine/animals/${animal.id}`} className="hover:text-emerald-800 hover:underline">
                            {animal.name}
                          </Link>
                          {animal.primaryIdentifier && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {animal.primaryIdentifier}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                          ID: {animal.internalId}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-stone-900">{animal.sex}</div>
                        <div className="text-[11px] text-stone-500">{animal.birthDate}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-stone-800">
                          {bcs.map((b) => `${b.percentage}% ${b.breedName}`).join(', ') || 'Unspecified'}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-stone-900">{farm?.name || 'Farm'}</div>
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
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Review Required
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <Link
                          href={`/bovine/animals/${animal.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-700 font-semibold transition-colors"
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
              No livestock found matching your current filter criteria.
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
            const isSelected = selectedAnimalIds.includes(animal.id);

            return (
              <div
                key={animal.id}
                className={`p-5 rounded-3xl bg-white border transition-all space-y-3 ${
                  isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs' : 'border-stone-200/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(animal.id)}
                      className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                    />
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
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                    {animal.useStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase">Sex & DOB</span>
                    <div className="font-semibold text-stone-800">{animal.sex} • {animal.birthDate}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase">Placement</span>
                    <div className="font-semibold text-stone-800 truncate">{farm?.name || 'Farm'}</div>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] text-stone-400 uppercase">Breed</span>
                  <div className="text-stone-700 truncate">
                    {bcs.map((b) => `${b.percentage}% ${b.breedName}`).join(', ') || 'Unspecified'}
                  </div>
                </div>

                {animal.requiresReview && (
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                    Review Alert: {animal.reviewReason || 'Veterinary check required'}
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

      {/* Bulk Movement Modal Wizard */}
      {isBulkMoveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleBulkMoveSubmit}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-emerald-800" />
                <h2 className="text-base font-bold text-stone-900">Transfer Livestock Group</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkMoveOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              You are executing a permanent or temporary placement transfer for <strong>{selectedAnimalIds.length}</strong> selected animals.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Destination Farm</label>
              <select
                value={bulkDestinationFarm}
                onChange={(e) => setBulkDestinationFarm(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.code}) - {f.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Destination Herd (Optional)</label>
              <select
                value={bulkDestinationHerd}
                onChange={(e) => setBulkDestinationHerd(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="">Keep / Default Herd</option>
                {herds
                  .filter((h) => h.farmId === bulkDestinationFarm)
                  .map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.purpose})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Movement Reason</label>
              <select
                value={bulkMoveReason}
                onChange={(e) => setBulkMoveReason(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="MANAGEMENT_ROTATION">Management Rotation</option>
                <option value="BREEDING_TRANSFER">Breeding Transfer / Nucleus</option>
                <option value="OPU_ET_COLLECTION">OPU / Embryo Transfer Collection</option>
                <option value="CALVING_RELOCATION">Calving Barn Relocation</option>
                <option value="QUARANTINE">Quarantine & Isolation</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkMoveOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
              >
                Confirm Transfer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
