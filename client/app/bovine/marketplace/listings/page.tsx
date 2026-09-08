'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Layers,
  TestTubes,
  Sparkles,
  Award,
  ArrowRightLeft,
  Heart,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Building,
  MapPin,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';
import { MarketplaceAssetType } from '@/lib/bovine-marketplace-types';

export default function AllListingsDirectoryPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  const { animals } = useBovine();
  const {
    listings,
    savedListingIds,
    compareListingIds,
    toggleSaveListing,
    toggleCompareListing,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'newest'>('featured');

  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
  }, [initialQuery]);

  const filteredListings = listings.filter((listing) => {
    if (selectedType !== 'ALL' && listing.assetType !== selectedType) return false;
    if (selectedStatus !== 'ALL' && listing.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = listing.title.toLowerCase().includes(q);
      const matchDesc = listing.description.toLowerCase().includes(q);
      const matchSeller = listing.sellerOrgName.toLowerCase().includes(q);
      const matchRegion = listing.region.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSeller && !matchRegion) return false;
    }

    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.askingPrice - b.askingPrice;
    if (sortBy === 'priceDesc') return b.askingPrice - a.askingPrice;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
                <span className="text-emerald-800 font-semibold">All Listings</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-emerald-800" />
                Marketplace Directory
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Explore all verified live breeding animals, cryogenic semen straws, and embryo lots.
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
                Create Listing
              </Link>
            </div>
          </div>

          {/* Type Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto border-t border-stone-100 pt-4 text-sm font-medium">
            {[
              { id: 'ALL', label: `All Stock (${listings.length})`, icon: ShoppingBag },
              { id: 'LIVE_ANIMAL', label: 'Live Animals', icon: Layers },
              { id: 'SEMEN', label: 'Semen Straws', icon: TestTubes },
              { id: 'EMBRYO', label: 'Embryo Lots', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    selectedType === tab.id
                      ? 'bg-emerald-800 text-white shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search & Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, breed, sire, farm, or location..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-stone-700 uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
            </select>

            <span className="text-stone-700 uppercase ml-2">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
            >
              <option value="featured">Featured</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">Recently Listed</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {sortedListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">No Listings Match Search</h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              Try adjusting your search keywords or clearing status filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('ALL');
                setSelectedStatus('ACTIVE');
              }}
              className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-xl hover:bg-emerald-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedListings.map((listing) => {
              const animal = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;
              const isSaved = savedListingIds.includes(listing.id);
              const isCompared = compareListingIds.includes(listing.id);

              const detailHref =
                listing.assetType === 'LIVE_ANIMAL'
                  ? `/bovine/marketplace/animals/${listing.id}`
                  : listing.assetType === 'SEMEN'
                  ? `/bovine/marketplace/semen/${listing.id}`
                  : listing.assetType === 'EMBRYO'
                  ? `/bovine/marketplace/embryos/${listing.id}`
                  : `/bovine/marketplace/listings/${listing.id}`;

              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative h-44 bg-stone-100 overflow-hidden">
                    {listing.media[0]?.url ? (
                      <img
                        src={listing.media[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600 font-mono text-xs">
                        {listing.assetType}
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white/95 text-stone-900 rounded-md shadow-xs backdrop-blur-sm">
                        {listing.assetType.replace('_', ' ')}
                      </span>
                      {listing.status !== 'ACTIVE' && (
                        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-500 text-white rounded-md shadow-xs">
                          {listing.status}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleCompareListing(listing.id)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                          isCompared
                            ? 'bg-emerald-800 text-white shadow-sm'
                            : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900'
                        }`}
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleSaveListing(listing.id)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                          isSaved
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'bg-white/90 text-stone-700 hover:bg-white hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link href={detailHref} className="font-bold text-base text-stone-900 hover:text-emerald-800 line-clamp-1">
                        {listing.title}
                      </Link>
                      <div className="text-xs text-stone-600 font-mono mt-0.5 flex items-center gap-1">
                        <Building className="w-3 h-3 text-stone-600" />
                        <span className="truncate">{listing.sellerOrgName}</span>
                        <span>•</span>
                        <span className="truncate">{listing.region}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {listing.highlights.slice(0, 2).map((h, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-800 rounded-md font-medium">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-stone-700">Price</div>
                        <div className="text-base font-bold font-mono text-stone-900">
                          ${listing.askingPrice.toLocaleString()}{' '}
                          <span className="text-xs font-normal text-stone-700">{listing.currency}</span>
                        </div>
                      </div>

                      <Link
                        href={detailHref}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
