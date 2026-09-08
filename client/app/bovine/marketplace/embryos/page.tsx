'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Filter,
  Heart,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Award,
  Building,
  Plus,
  ChevronRight,
  Eye,
  Activity,
  Layers,
  Dna,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function EmbryoMarketplacePage() {
  const {
    listings,
    savedListingIds,
    compareListingIds,
    toggleSaveListing,
    toggleCompareListing,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc'>('featured');

  const embryoListings = listings.filter((l) => l.assetType === 'EMBRYO');

  const filteredListings = embryoListings.filter((listing) => {
    const details = listing.embryoDetails;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = listing.title.toLowerCase().includes(q);
      const matchDonor = details?.donorName.toLowerCase().includes(q);
      const matchSire = details?.sireName.toLowerCase().includes(q);
      const matchCode = details?.embryoCode.toLowerCase().includes(q);
      if (!matchTitle && !matchDonor && !matchSire && !matchCode) return false;
    }

    if (selectedMethod !== 'ALL') {
      if (details?.ivfOrInVivo !== selectedMethod) return false;
    }

    if (selectedGrade !== 'ALL') {
      if (details?.grade !== selectedGrade) return false;
    }

    if (maxPrice !== '' && listing.askingPrice > maxPrice) {
      return false;
    }

    return true;
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
                <span className="text-emerald-800 font-semibold">Embryo Lots</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-emerald-800" />
                Embryo Lots & IVF Packages Catalog
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Direct-thaw frozen and fresh IVF/In-Vivo embryo packages with IETS sanitary compliance and high-indexing mating pairs.
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
                List Embryo Lot
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
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Semen Marketplace
            </Link>
            <Link
              href="/bovine/marketplace/embryos"
              className="px-3 py-1.5 text-emerald-800 bg-emerald-50 rounded-lg font-semibold whitespace-nowrap"
            >
              Embryo Lots ({embryoListings.length})
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
          {/* Sidebar Filter */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-bold text-stone-900 flex items-center gap-2 text-sm uppercase tracking-wider font-mono">
                  <Filter className="w-4 h-4 text-emerald-800" /> Filter Embryos
                </span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMethod('ALL');
                    setSelectedGrade('ALL');
                    setMaxPrice('');
                  }}
                  className="text-xs text-stone-700 hover:text-stone-900 underline"
                >
                  Reset
                </button>
              </div>

              {/* Keyword */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Donor, sire, code..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* IVF or In-Vivo */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Fertilization Method</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="ALL">All Methods</option>
                  <option value="IVF">IVF (In-Vitro Fertilization)</option>
                  <option value="IN_VIVO">In-Vivo Flush (Conventional)</option>
                </select>
              </div>

              {/* Embryo Grade */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">IETS Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="ALL">All Grades</option>
                  <option value="Grade 1">Grade 1 (Excellent / Direct Thaw)</option>
                  <option value="Grade 2">Grade 2 (Good)</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Max Package Price ($)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 3000"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div className="text-sm text-stone-600 font-mono">
                Showing <span className="font-bold text-stone-900">{filteredListings.length}</span> embryo packages
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredListings.map((listing) => {
                const details = listing.embryoDetails;
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
                          <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-purple-100 text-purple-800 rounded-md">
                            {details?.ivfOrInVivo || 'IVF'} Lot
                          </span>
                          <span className="px-2.5 py-0.5 text-xs font-mono bg-emerald-100 text-emerald-800 font-semibold rounded-md">
                            {details?.grade || 'Grade 1'}
                          </span>
                          <span className="px-2.5 py-0.5 text-xs font-mono bg-stone-100 text-stone-700 rounded-md">
                            {details?.stage || 'Stage 6'}
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

                      {/* Listing Title */}
                      <div>
                        <Link
                          href={`/bovine/marketplace/embryos/${listing.id}`}
                          className="font-bold text-lg text-stone-900 hover:text-emerald-800 transition-colors line-clamp-1"
                        >
                          {listing.title}
                        </Link>
                        <div className="text-xs text-stone-700 font-mono mt-0.5">
                          Lot Code: <strong>{details?.embryoCode || 'EMB-2025-01'}</strong> • Qty: <strong>{details?.quantity || 4} Embryos</strong>
                        </div>
                      </div>

                      {/* Sire x Dam Mating Box */}
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-700 font-mono text-[11px]">Donor Dam:</span>
                          <span className="font-bold text-stone-900">{details?.donorName || 'Highland Blackcap 8912'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-700 font-mono text-[11px]">Mating Sire:</span>
                          <span className="font-bold text-stone-900">{details?.sireName || 'GAR Sure Fire 6432'}</span>
                        </div>
                      </div>

                      {/* Storage facility & IETS */}
                      <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                        <span className="truncate max-w-[180px]">
                          Facility: {details?.storageCenter || 'Boviteq Cryo Vault'}
                        </span>
                        <span className="text-emerald-800 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> IETS Sanitary Cert
                        </span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-mono text-stone-700 uppercase">Package Price</div>
                        <div className="text-lg font-bold font-mono text-stone-900">
                          ${listing.askingPrice.toLocaleString()} <span className="text-xs font-normal text-stone-700">USD</span>
                        </div>
                        <div className="text-[10px] text-stone-700 font-mono">
                          (${Math.round(listing.askingPrice / (details?.quantity || 1))} / embryo)
                        </div>
                      </div>

                      <Link
                        href={`/bovine/marketplace/embryos/${listing.id}`}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs"
                      >
                        Inspect Lot
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
