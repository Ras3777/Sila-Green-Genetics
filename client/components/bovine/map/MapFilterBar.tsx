'use client';

import React from 'react';
import { useBovineMap } from '@/lib/bovine-map-store';
import { Filter, X, RotateCcw } from 'lucide-react';

export function MapFilterBar() {
  const {
    filters,
    setFilter,
    resetFilters,
    filteredFarms,
    filteredAnimalLocations,
  } = useBovineMap();

  const activeFilterCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'radiusKm' || key === 'searchQuery') return false;
    return val !== 'ALL' && val !== '';
  }).length;

  return (
    <div className="bg-stone-50 border-b border-stone-200/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 font-mono">
          <Filter className="w-3 h-3" /> Filters:
        </span>

        {/* Farm Type */}
        <select
          value={filters.farmType}
          onChange={(e) => setFilter('farmType', e.target.value)}
          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-700 shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Farm Types</option>
          <option value="GENOMIC_HUB">Genomic Nucleus</option>
          <option value="SEEDSTOCK">Seedstock Breeding</option>
          <option value="BEEF">Beef Station</option>
          <option value="DAIRY">Dairy Facility</option>
        </select>

        {/* Region */}
        <select
          value={filters.region}
          onChange={(e) => setFilter('region', e.target.value)}
          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-700 shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Regions</option>
          <option value="Tigray Regional State">Tigray</option>
          <option value="Amhara Regional State">Amhara</option>
          <option value="Sidama Regional State">Sidama</option>
        </select>

        {/* Breed */}
        <select
          value={filters.breed}
          onChange={(e) => setFilter('breed', e.target.value)}
          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-700 shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Breeds</option>
          <option value="Nelore">Nelore</option>
          <option value="Borana">Borana</option>
          <option value="Black Angus">Black Angus</option>
          <option value="Brahman">Brahman</option>
        </select>

        {/* Sex */}
        <select
          value={filters.sex}
          onChange={(e) => setFilter('sex', e.target.value)}
          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-700 shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Sexes</option>
          <option value="MALE">Bulls / Sires (♂)</option>
          <option value="FEMALE">Cows / Donors (♀)</option>
        </select>

        {/* Clear All Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Matching Count Badge */}
      <div className="text-[11px] text-stone-500 font-mono">
        Visible: <strong className="text-stone-900 font-semibold">{filteredFarms.length}</strong> farms •{' '}
        <strong className="text-stone-900 font-semibold">{filteredAnimalLocations.length}</strong> tracked animals
      </div>
    </div>
  );
}
