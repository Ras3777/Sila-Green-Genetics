'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TestTubes,
  Search,
  Filter,
  Heart,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Award,
  Sparkles,
  Building,
  Plus,
  ChevronRight,
  Eye,
  Activity,
  Check,
  PackageCheck,
  Layers,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export default function SemenMarketplacePage() {
  const { animals } = useBovine();
  const {
    listings,
    savedListingIds,
    compareListingIds,
    toggleSaveListing,
    toggleCompareListing,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSexedType, setSelectedSexedType] = useState('ALL');
  const [selectedBreed, setSelectedBreed] = useState('ALL');
  const [minMotility, setMinMotility] = useState<number | ''>('');
  const [maxPricePerStraw, setMaxPricePerStraw] = useState<number | ''>('');
  const [cssCertifiedOnly, setCssCertifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'motilityDesc'>('featured');

  const semenListings = listings.filter((l) => l.assetType === 'SEMEN');

  const filteredListings = semenListings.filter((listing) => {
    const details = listing.semenDetails;
    const sireAnimal = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = listing.title.toLowerCase().includes(q);
      const matchBatch = details?.batchNumber.toLowerCase().includes(q);
      const matchVault = details?.storageVault.toLowerCase().includes(q);
      const matchSeller = listing.sellerOrgName.toLowerCase().includes(q);
      if (!matchTitle && !matchBatch && !matchVault && !matchSeller) return false;
    }

    if (selectedSexedType !== 'ALL') {
      if (details?.sexedType !== selectedSexedType) return false;
    }

    if (selectedBreed !== 'ALL') {
      if (sireAnimal && !sireAnimal.breed?.toLowerCase().includes(selectedBreed.toLowerCase())) {
        return false;
      }
    }

    if (minMotility !== '' && (details?.motilityPercent || 0) < minMotility) {
      return false;
    }

    if (maxPricePerStraw !== '' && listing.askingPrice > maxPricePerStraw) {
      return false;
    }

    if (cssCertifiedOnly && !listing.trustBadges.healthClearanceCurrent) {
      return false;
    }

    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.askingPrice - b.askingPrice;
    if (sortBy === 'priceDesc') return b.askingPrice - a.askingPrice;
    if (sortBy === 'motilityDesc') {
      return (b.semenDetails?.motilityPercent || 0) - (a.semenDetails?.motilityPercent || 0);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
                <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-emerald-800 font-semibold">Semen Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <TestTubes className="w-8 h-8 text-emerald-800" />
                Semen Straws & Cryo Lots Catalog
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                CSS-certified frozen semen straws from elite AI sires with verified post-thaw motility, sexed options, and vault dispatch.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/bovine/marketplace/compare"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors relative"
              >
                <ArrowRightLeft className="w-4 h-4 text-emerald-800" />
                Compare ({compareListingIds.length})
              </Link>
              <Link
                href="/bovine/marketplace/listings/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                List Semen Batch
              </Link>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto border-t border-stone-100 pt-4 text-sm font-medium">
            <Link
              href="/bovine/marketplace"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Marketplace Hub
            </Link>
            <Link
              href="/bovine/marketplace/animals"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Live Animals
            </Link>
            <Link
              href="/bovine/marketplace/semen"
              className="px-3 py-1.5 text-emerald-800 bg-emerald-50 rounded-lg font-semibold whitespace-nowrap"
            >
              Semen Marketplace ({semenListings.length})
            </Link>
            <Link
              href="/bovine/marketplace/embryos"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Embryo Lots
            </Link>
            <Link
              href="/bovine/marketplace/breeding-services"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Breeding Services
            </Link>
            <Link
              href="/bovine/marketplace/orders"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Orders & Escrow
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-bold text-stone-900 flex items-center gap-2 text-sm uppercase tracking-wider font-mono">
                  <Filter className="w-4 h-4 text-emerald-800" /> Filter Semen
                </span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSexedType('ALL');
                    setSelectedBreed('ALL');
                    setMinMotility('');
                    setMaxPricePerStraw('');
                    setCssCertifiedOnly(false);
                  }}
                  className="text-xs text-stone-700 hover:text-stone-900 underline"
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sire name, batch, vault..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Sexed Sorting */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Sexed Type</label>
                <select
                  value={selectedSexedType}
                  onChange={(e) => setSelectedSexedType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="ALL">All Types</option>
                  <option value="CONVENTIONAL">Conventional (Unsexed)</option>
                  <option value="FEMALE_SEXED">SexedULTRA 4M (Female 90%+)</option>
                  <option value="MALE_SEXED">Male Sexed</option>
                </select>
              </div>

              {/* Breed */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Sire Breed</label>
                <select
                  value={selectedBreed}
                  onChange={(e) => setSelectedBreed(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="ALL">All Breeds</option>
                  <option value="Angus">Angus</option>
                  <option value="Hereford">Hereford</option>
                  <option value="Simmental">Simmental</option>
                  <option value="Holstein">Holstein</option>
                </select>
              </div>

              {/* Min Motility */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Min Progressive Motility (%)</label>
                <input
                  type="number"
                  value={minMotility}
                  onChange={(e) => setMinMotility(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 60%"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Max Price / Straw */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Max Price / Straw ($)</label>
                <input
                  type="number"
                  value={maxPricePerStraw}
                  onChange={(e) => setMaxPricePerStraw(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* CSS Toggle */}
              <div className="pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={cssCertifiedOnly}
                    onChange={(e) => setCssCertifiedOnly(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
                  />
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    CSS Health Certified Only
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-stone-600 font-mono">
                Showing <span className="font-bold text-stone-900">{sortedListings.length}</span> semen batch offerings
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-stone-700 text-xs font-mono uppercase">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="featured">Featured Offerings</option>
                  <option value="motilityDesc">Highest Motility %</option>
                  <option value="priceAsc">Price / Straw: Low to High</option>
                  <option value="priceDesc">Price / Straw: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedListings.map((listing) => {
                const details = listing.semenDetails;
                const sire = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;
                const isSaved = savedListingIds.includes(listing.id);
                const isCompared = compareListingIds.includes(listing.id);

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-blue-100 text-blue-800 rounded-md">
                            {details?.sexedType === 'FEMALE_SEXED' ? 'Sexed Female (90%+)' : 'Conventional Straws'}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-mono bg-stone-100 text-stone-700 rounded-md">
                            Batch #{details?.batchNumber || 'SM-9021'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleCompareListing(listing.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isCompared
                                ? 'bg-emerald-800 text-white border-emerald-800'
                                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                            }`}
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleSaveListing(listing.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isSaved
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Listing Title & Sire */}
                      <div>
                        <Link
                          href={`/bovine/marketplace/semen/${listing.id}`}
                          className="font-bold text-lg text-stone-900 hover:text-emerald-800 transition-colors line-clamp-1"
                        >
                          {listing.title}
                        </Link>
                        <div className="text-xs text-stone-700 font-mono mt-0.5">
                          Sire Reg: AAA +19844201 • {sire?.breed || 'Angus'}
                        </div>
                      </div>

                      {/* Batch Specifications Grid */}
                      <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-stone-700 uppercase">Motility</div>
                          <div className="font-bold text-emerald-800 text-sm mt-0.5">
                            {details?.motilityPercent || 65}%
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-700 uppercase">Concentration</div>
                          <div className="font-bold text-stone-900 text-sm mt-0.5">
                            {details?.concentrationMml || 30}M/ml
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-700 uppercase">Available</div>
                          <div className="font-bold text-stone-900 text-sm mt-0.5">
                            {details?.availableDoses || 120} straws
                          </div>
                        </div>
                      </div>

                      {/* Storage Vault & Health Badges */}
                      <div className="flex flex-wrap items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                        <span className="flex items-center gap-1 truncate max-w-[180px]">
                          <Building className="w-3.5 h-3.5 text-stone-600" />
                          {details?.storageVault || 'Hawkeye Cryo Vault'}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-800 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" /> CSS Certified
                        </span>
                      </div>
                    </div>

                    {/* Price & Action Footer */}
                    <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-mono text-stone-700 uppercase">Price per straw</div>
                        <div className="text-lg font-bold font-mono text-stone-900">
                          ${listing.askingPrice} <span className="text-xs font-normal text-stone-700">USD</span>
                        </div>
                      </div>

                      <Link
                        href={`/bovine/marketplace/semen/${listing.id}`}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs"
                      >
                        Order Straws
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
