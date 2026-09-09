'use client';

import React from 'react';
import { Filter, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LiveAnimalsFilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSex: string;
  setSelectedSex: (s: string) => void;
  selectedBreed: string;
  setSelectedBreed: (b: string) => void;
  listingTypeFilter: string;
  setListingTypeFilter: (l: string) => void;
  minPrice: number | '';
  setMinPrice: (p: number | '') => void;
  maxPrice: number | '';
  setMaxPrice: (p: number | '') => void;
  minSelectionIndex: number | '';
  setMinSelectionIndex: (i: number | '') => void;
  dnaVerifiedOnly: boolean;
  setDnaVerifiedOnly: (d: boolean) => void;
  carrierFreeOnly: boolean;
  setCarrierFreeOnly: (c: boolean) => void;
  onResetFilters: () => void;
}

export function LiveAnimalsFilterSidebar({
  searchQuery,
  setSearchQuery,
  selectedSex,
  setSelectedSex,
  selectedBreed,
  setSelectedBreed,
  listingTypeFilter,
  setListingTypeFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minSelectionIndex,
  setMinSelectionIndex,
  dnaVerifiedOnly,
  setDnaVerifiedOnly,
  carrierFreeOnly,
  setCarrierFreeOnly,
  onResetFilters,
}: LiveAnimalsFilterSidebarProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <span className="font-bold text-stone-900 flex items-center gap-2 text-sm uppercase tracking-wider font-mono">
          <Filter className="w-4 h-4 text-emerald-800" /> Filter Animals
        </span>
        <button
          onClick={onResetFilters}
          className="text-xs text-stone-700 hover:text-stone-900 underline cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Search Keywords</label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tag, name, breed, seller..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Sex / Role */}
      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Sex / Breeding Role</label>
        <select
          value={selectedSex}
          onChange={(e) => setSelectedSex(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          <option value="ALL">All Roles &amp; Sexes</option>
          <option value="MALE">Breeding Bulls / Sires (Male)</option>
          <option value="FEMALE">Breeding Cows &amp; Heifers (Female)</option>
        </select>
      </div>

      {/* Breed */}
      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Breed</label>
        <select
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          <option value="ALL">All Breeds</option>
          <option value="Angus">Angus / Black Angus</option>
          <option value="Hereford">Hereford</option>
          <option value="Simmental">Simmental</option>
          <option value="Charolais">Charolais</option>
          <option value="Holstein">Holstein</option>
          <option value="Brahman">Brahman</option>
        </select>
      </div>

      {/* Listing Type */}
      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Listing Pricing Type</label>
        <select
          value={listingTypeFilter}
          onChange={(e) => setListingTypeFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          <option value="ALL">All Terms</option>
          <option value="FIXED_PRICE">Fixed Price</option>
          <option value="NEGOTIABLE">Negotiable (Offers Accepted)</option>
          <option value="PRIVATE_TREATY">Private Treaty</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Price Range ($ USD)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
            placeholder="Min $"
            className="w-full px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            placeholder="Max $"
            className="w-full px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Minimum Selection Index ($B) */}
      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Min Selection Index ($B)</label>
        <input
          type="number"
          value={minSelectionIndex}
          onChange={(e) => setMinSelectionIndex(e.target.value ? Number(e.target.value) : '')}
          placeholder="e.g. 150"
          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />
      </div>

      {/* Trust & Quality Toggles */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
          <input
            type="checkbox"
            checked={dnaVerifiedOnly}
            onChange={(e) => setDnaVerifiedOnly(e.target.checked)}
            className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
          />
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            DNA Parentage Verified Only
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
          <input
            type="checkbox"
            checked={carrierFreeOnly}
            onChange={(e) => setCarrierFreeOnly(e.target.checked)}
            className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
          />
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            Carrier-Free Genetic Status
          </span>
        </label>
      </div>
    </div>
  );
}
