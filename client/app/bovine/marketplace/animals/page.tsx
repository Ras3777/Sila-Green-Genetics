'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Filter,
  Sliders,
  Heart,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Award,
  Sparkles,
  MapPin,
  Building,
  Plus,
  ChevronRight,
  Eye,
  X,
  Activity,
  Check,
  Calendar,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';

export default function LiveAnimalsMarketplacePage() {
  const { animals, herds } = useBovine();
  const {
    listings,
    savedListingIds,
    compareListingIds,
    toggleSaveListing,
    toggleCompareListing,
    getHerdFit,
  } = useMarketplace();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('ALL');
  const [selectedSex, setSelectedSex] = useState('ALL');
  const [listingTypeFilter, setListingTypeFilter] = useState('ALL');
  const [carrierFreeOnly, setCarrierFreeOnly] = useState(false);
  const [dnaVerifiedOnly, setDnaVerifiedOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minSelectionIndex, setMinSelectionIndex] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'indexDesc' | 'newest'>('featured');

  // Quick Herd Fit Modal State
  const [fitModalListing, setFitModalListing] = useState<MarketplaceListing | null>(null);
  const [selectedTargetHerd, setSelectedTargetHerd] = useState(herds[0]?.id || 'herd-1');

  // Live animal listings
  const liveAnimalListings = listings.filter((l) => l.assetType === 'LIVE_ANIMAL');

  // Filter logic
  const filteredListings = liveAnimalListings.filter((listing) => {
    const animal = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = listing.title.toLowerCase().includes(q);
      const matchDesc = listing.description.toLowerCase().includes(q);
      const matchSeller = listing.sellerOrgName.toLowerCase().includes(q);
      const matchTag = animal?.identifiers?.some((id: any) => id.value?.toLowerCase().includes(q));
      const matchBreed = animal?.breed?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSeller && !matchTag && !matchBreed) return false;
    }

    if (selectedBreed !== 'ALL') {
      if (animal && !animal.breed?.toLowerCase().includes(selectedBreed.toLowerCase())) {
        return false;
      }
    }

    if (selectedSex !== 'ALL') {
      if (animal && animal.sex !== selectedSex) return false;
    }

    if (listingTypeFilter !== 'ALL' && listing.listingType !== listingTypeFilter) {
      return false;
    }

    if (carrierFreeOnly && !listing.trustBadges.carrierFreeStatus) {
      return false;
    }

    if (dnaVerifiedOnly && !listing.trustBadges.parentageDnaVerified) {
      return false;
    }

    if (minPrice !== '' && listing.askingPrice < minPrice) return false;
    if (maxPrice !== '' && listing.askingPrice > maxPrice) return false;

    if (minSelectionIndex !== '') {
      const index = animal?.geneticProfile?.selectionIndex || 0;
      if (index < minSelectionIndex) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedListings = [...filteredListings].sort((a, b) => {
    const aAnim = a.animalId ? animals.find((an) => an.id === a.animalId) : null;
    const bAnim = b.animalId ? animals.find((an) => an.id === b.animalId) : null;

    if (sortBy === 'priceAsc') return a.askingPrice - b.askingPrice;
    if (sortBy === 'priceDesc') return b.askingPrice - a.askingPrice;
    if (sortBy === 'indexDesc') {
      const aIdx = aAnim?.geneticProfile?.selectionIndex || 0;
      const bIdx = bAnim?.geneticProfile?.selectionIndex || 0;
      return bIdx - aIdx;
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0; // featured default
  });

  const activeFitAnalysis = fitModalListing && fitModalListing.animalId
    ? getHerdFit(fitModalListing.animalId, selectedTargetHerd)
    : null;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Top Breadcrumb & Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
                <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-emerald-800 font-semibold">Live Animals</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Layers className="w-8 h-8 text-emerald-800" />
                Live Breeding Animals Catalog
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Verified registered breeding bulls, donors, heifers, and replacement stock backed by canonical genomic records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/bovine/marketplace/compare"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors relative"
              >
                <ArrowRightLeft className="w-4 h-4 text-emerald-800" />
                Compare Genetics
                {compareListingIds.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-mono font-bold bg-emerald-800 text-white rounded-full">
                    {compareListingIds.length}
                  </span>
                )}
              </Link>
              <Link
                href="/bovine/marketplace/listings/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                List an Animal
              </Link>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto border-t border-stone-100 pt-4 text-sm font-medium">
            <Link
              href="/bovine/marketplace"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Marketplace Hub
            </Link>
            <Link
              href="/bovine/marketplace/animals"
              className="px-3 py-1.5 text-emerald-800 bg-emerald-50 rounded-lg font-semibold whitespace-nowrap"
            >
              Live Animals ({liveAnimalListings.length})
            </Link>
            <Link
              href="/bovine/marketplace/semen"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Semen Marketplace
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
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-bold text-stone-900 flex items-center gap-2 text-sm uppercase tracking-wider font-mono">
                  <Filter className="w-4 h-4 text-emerald-800" /> Filter Animals
                </span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBreed('ALL');
                    setSelectedSex('ALL');
                    setListingTypeFilter('ALL');
                    setCarrierFreeOnly(false);
                    setDnaVerifiedOnly(false);
                    setMinPrice('');
                    setMaxPrice('');
                    setMinSelectionIndex('');
                  }}
                  className="text-xs text-stone-700 hover:text-stone-900 underline"
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
                  <option value="ALL">All Roles & Sexes</option>
                  <option value="MALE">Breeding Bulls / Sires (Male)</option>
                  <option value="FEMALE">Breeding Cows & Heifers (Female)</option>
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
          </div>

          {/* Listing Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-stone-600 font-mono">
                Showing <span className="font-bold text-stone-900">{sortedListings.length}</span> live animals available
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-stone-700 text-xs font-mono uppercase">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="featured">Featured / Recommended</option>
                    <option value="indexDesc">Highest Selection Index ($B)</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="newest">Recently Listed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {sortedListings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <Layers className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-stone-900">No animals match your filter criteria</h3>
                <p className="text-sm text-stone-600 mt-1 max-w-md mx-auto">
                  Try broadening your search term, clearing price bounds, or adjusting genetic index requirements.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBreed('ALL');
                    setSelectedSex('ALL');
                    setCarrierFreeOnly(false);
                    setDnaVerifiedOnly(false);
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="mt-4 px-4 py-2 text-sm font-medium text-emerald-800 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Grid of Animals */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedListings.map((listing) => {
                  const animal = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;
                  const isSaved = savedListingIds.includes(listing.id);
                  const isCompared = compareListingIds.includes(listing.id);
                  const selectionIndex = animal?.geneticProfile?.selectionIndex;

                  return (
                    <div
                      key={listing.id}
                      className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
                    >
                      {/* Card Image Header */}
                      <div className="relative h-48 bg-stone-100 overflow-hidden">
                        {listing.media[0]?.url ? (
                          <img
                            src={listing.media[0].url}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-600 font-mono text-xs">
                            No Media Available
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white/95 text-stone-800 rounded-md shadow-sm backdrop-blur-sm">
                            {listing.listingType.replace('_', ' ')}
                          </span>
                          {animal?.sex && (
                            <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-stone-900/80 text-white rounded-md backdrop-blur-sm">
                              {animal.sex === 'MALE' ? 'Bull / Sire' : 'Cow / Donor'}
                            </span>
                          )}
                        </div>

                        {/* Save & Compare Buttons */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={() => toggleCompareListing(listing.id)}
                            title={isCompared ? 'Remove from compare' : 'Add to compare'}
                            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                              isCompared
                                ? 'bg-emerald-800 text-white shadow-sm'
                                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900'
                            }`}
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleSaveListing(listing.id)}
                            title={isSaved ? 'Remove from saved' : 'Save to favorites'}
                            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                              isSaved
                                ? 'bg-red-500 text-white shadow-sm'
                                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Bottom overlay with Farm & Region */}
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white/90 bg-stone-900/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
                          <span className="flex items-center gap-1 truncate">
                            <Building className="w-3.5 h-3.5" />
                            {listing.sellerOrgName}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5" />
                            {listing.region}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={`/bovine/marketplace/animals/${listing.id}`}
                                className="font-bold text-base text-stone-900 hover:text-emerald-800 line-clamp-1 transition-colors"
                              >
                                {listing.title}
                              </Link>
                              <div className="text-xs text-stone-700 font-mono mt-0.5">
                                {animal?.identifiers?.[0]?.value || 'TAG-UNSPECIFIED'} • {animal?.breed || 'Purebred'}
                              </div>
                            </div>
                            {selectionIndex && (
                              <div className="text-right">
                                <div className="text-xs font-mono text-stone-700 uppercase">Index ($B)</div>
                                <div className="text-sm font-bold font-mono text-emerald-800">+{selectionIndex}</div>
                              </div>
                            )}
                          </div>

                          {/* Highlights pills */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {listing.highlights.slice(0, 2).map((h, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-medium">
                                {h}
                              </span>
                            ))}
                          </div>

                          {/* Trust Badges */}
                          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
                            {listing.trustBadges.parentageDnaVerified && (
                              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5" /> DNA Parentage
                              </span>
                            )}
                            {listing.trustBadges.genotyped && (
                              <span className="flex items-center gap-1 text-stone-700 font-medium">
                                <Activity className="w-3.5 h-3.5 text-blue-600" /> Genotyped
                              </span>
                            )}
                            {listing.trustBadges.carrierFreeStatus && (
                              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Carrier-Free
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price and Action Footer */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-mono text-stone-700 uppercase">Asking Price</div>
                            <div className="text-lg font-bold font-mono text-stone-900">
                              ${listing.askingPrice.toLocaleString()}{' '}
                              <span className="text-xs text-stone-700 font-normal">{listing.currency}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {listing.animalId && (
                              <button
                                onClick={() => setFitModalListing(listing)}
                                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Herd Fit
                              </button>
                            )}
                            <Link
                              href={`/bovine/marketplace/animals/${listing.id}`}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Herd Fit Modal */}
      {fitModalListing && fitModalListing.animalId && activeFitAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Commercial Herd Compatibility</h3>
                  <p className="text-xs text-stone-700">{fitModalListing.title}</p>
                </div>
              </div>
              <button
                onClick={() => setFitModalListing(null)}
                className="p-1.5 text-stone-600 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Target Herd Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">
                  Evaluate Against Target Herd
                </label>
                <select
                  value={selectedTargetHerd}
                  onChange={(e) => setSelectedTargetHerd(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                >
                  {herds.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.breed || 'Commercial Angus'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Compatibility Score Circle */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-stone-700 uppercase">Herd Genetic Fit Score</div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-800 mt-0.5">
                    {activeFitAnalysis.overallCompatibilityScore}%
                  </div>
                  <div className="text-xs text-stone-600 mt-1">
                    Expected inbreeding coefficient $F$: {(activeFitAnalysis.expectedInbreedingAvg * 100).toFixed(1)}% (
                    <span className="font-semibold text-emerald-800">{activeFitAnalysis.inbreedingRiskTier} RISK</span>)
                  </div>
                </div>

                <div className="text-right space-y-1 text-xs">
                  <div className="text-emerald-800 font-semibold">
                    {activeFitAnalysis.breakdown.excellentMatchPct}% Excellent Mating
                  </div>
                  <div className="text-stone-600">{activeFitAnalysis.breakdown.acceptablePct}% Acceptable Mating</div>
                  <div className="text-stone-600">{activeFitAnalysis.breakdown.avoidPct}% Avoid (Pedigree Conflict)</div>
                </div>
              </div>

              {/* Trait Complementarity Highlights */}
              <div>
                <h4 className="text-xs font-mono uppercase text-stone-700 mb-2">Key Trait Complementarity</h4>
                <div className="space-y-2">
                  {activeFitAnalysis.traitComplementarity.slice(0, 3).map((trait, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-100"
                    >
                      <div>
                        <span className="font-bold text-stone-900">{trait.trait}</span>
                        <div className="text-[11px] text-stone-700">
                          Herd Avg: {trait.herdAvg > 0 ? `+${trait.herdAvg}` : trait.herdAvg} → Candidate: {trait.candidateEstimate > 0 ? `+${trait.candidateEstimate}` : trait.candidateEstimate}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono font-bold ${
                            trait.impact === 'MAJOR_GAIN'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {trait.impact.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-stone-600 font-mono mt-0.5">
                          Exp. Progeny: {trait.expectedProgenyAvg > 0 ? `+${trait.expectedProgenyAvg}` : trait.expectedProgenyAvg}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <Link
                href={`/bovine/marketplace/animals/${fitModalListing.id}`}
                className="text-xs text-stone-600 hover:text-stone-900 underline font-medium"
              >
                Inspect Full Genetic Evaluation
              </Link>
              <button
                onClick={() => setFitModalListing(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
