'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Layers,
  Sparkles,
  TestTubes,
  Award,
  ArrowRightLeft,
  Heart,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Calendar,
  Building,
  Check,
  ChevronRight,
  Filter,
  DollarSign,
  Activity,
  Flame,
  Clock,
  Eye,
  Plus,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';
import { MarketplaceAssetType } from '@/lib/bovine-marketplace-types';

export default function MarketplaceHomePage() {
  const router = useRouter();
  const { animals } = useBovine();
  const {
    listings,
    savedListingIds,
    compareListingIds,
    toggleSaveListing,
    toggleCompareListing,
    savedSearches,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeAssetType, setActiveAssetType] = useState<string>('ALL');
  const [selectedCollection, setSelectedCollection] = useState<string>('ALL');

  const categories = [
    { key: 'ALL', label: 'All Genetics', icon: ShoppingBag, count: listings.length },
    { key: 'LIVE_ANIMAL', label: 'Live Breeding Animals', icon: Layers, count: listings.filter((l) => l.assetType === 'LIVE_ANIMAL').length },
    { key: 'SEMEN', label: 'Semen Marketplace', icon: TestTubes, count: listings.filter((l) => l.assetType === 'SEMEN').length },
    { key: 'EMBRYO', label: 'Embryo Lots', icon: Sparkles, count: listings.filter((l) => l.assetType === 'EMBRYO').length },
    { key: 'BULLS', label: 'Breeding Bulls', icon: Award, count: 2 },
    { key: 'DONORS', label: 'Elite Donors', icon: Heart, count: 1 },
  ];

  const geneticsCollections = [
    { key: 'ALL', label: 'All Collections' },
    { key: 'TOP_INDEX', label: 'Top Selection Index ($B +160+)' },
    { key: 'LOW_BW', label: 'Heifer Safe / Low Birth Wt' },
    { key: 'HIGH_GROWTH', label: 'Extreme Weaning Growth' },
    { key: 'CARRIER_FREE', label: 'Carrier-Free Verified' },
    { key: 'A2A2', label: 'A2/A2 Protein Dairy' },
  ];

  const filteredListings = listings.filter((listing) => {
    if (activeAssetType === 'LIVE_ANIMAL' && listing.assetType !== 'LIVE_ANIMAL') return false;
    if (activeAssetType === 'SEMEN' && listing.assetType !== 'SEMEN') return false;
    if (activeAssetType === 'EMBRYO' && listing.assetType !== 'EMBRYO') return false;
    if (activeAssetType === 'BULLS') {
      const anim = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;
      if (listing.assetType !== 'LIVE_ANIMAL' || anim?.sex !== 'MALE') return false;
    }
    if (activeAssetType === 'DONORS') {
      const anim = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;
      if (listing.assetType !== 'LIVE_ANIMAL' || anim?.sex !== 'FEMALE') return false;
    }

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/bovine/marketplace/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Commercial Discovery Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-stone-900 to-stone-950 text-white p-6 lg:p-10 shadow-xl overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-10 opacity-10 pointer-events-none">
          <ShoppingBag className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Genomics-Backed Bovine Exchange</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Commercial Marketplace &amp; Breeding Stock Exchange
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
            Trade live breeding stock, cryopreserved semen straws, and IVF embryo lots with uncompromised provenance. Every listing links directly to verified pedigree, single-step GBLUP EPDs, and health certificates.
          </p>

          {/* Universal Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-2xl border border-stone-200 max-w-2xl">
              <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search Nelore Bull, A2/A2 Semen, IVF Embryo, DGR, or Seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-stone-900 text-xs sm:text-sm placeholder-stone-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Search</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick search tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-stone-400">
              <span className="font-semibold text-stone-300">Popular:</span>
              <button
                type="button"
                onClick={() => setSearchQuery('Angus')}
                className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer"
              >
                Angus Purebred
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('A2/A2')}
                className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer"
              >
                A2/A2 Semen
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('IVF')}
                className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer"
              >
                Grade 1 Embryos
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('CED')}
                className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer"
              >
                Heifer Calving Ease
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Commercial Quick Links & Dashboard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        <Link
          href="/bovine/marketplace/listings/new"
          className="p-3.5 rounded-2xl bg-emerald-800 text-white hover:bg-emerald-900 shadow-xs transition-colors flex items-center justify-between font-bold"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>List for Sale</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
        </Link>

        <Link
          href="/bovine/marketplace/compare"
          className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-800/40 text-stone-800 shadow-2xs transition-colors flex items-center justify-between font-semibold"
        >
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-700" />
            <span>Compare ({compareListingIds.length})</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </Link>

        <Link
          href="/bovine/marketplace/saved"
          className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-800/40 text-stone-800 shadow-2xs transition-colors flex items-center justify-between font-semibold"
        >
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>Saved ({savedListingIds.length})</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </Link>

        <Link
          href="/bovine/marketplace/orders"
          className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-800/40 text-stone-800 shadow-2xs transition-colors flex items-center justify-between font-semibold"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Orders &amp; Stepper</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </Link>

        <Link
          href="/bovine/marketplace/seller"
          className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-800/40 text-stone-800 shadow-2xs transition-colors flex items-center justify-between font-semibold"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Seller Workspace</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </Link>

        <Link
          href="/bovine/marketplace/buyer"
          className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-800/40 text-stone-800 shadow-2xs transition-colors flex items-center justify-between font-semibold"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span>Buyer Workspace</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </Link>
      </div>

      {/* Category Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeAssetType === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveAssetType(cat.key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-emerald-950/40 text-emerald-100' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Genetics Collections Strip */}
      <div className="bg-stone-100/70 p-3 rounded-2xl border border-stone-200 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider shrink-0 pl-1">
          Collections:
        </span>
        {geneticsCollections.map((col) => (
          <button
            key={col.key}
            onClick={() => setSelectedCollection(col.key)}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
              selectedCollection === col.key
                ? 'bg-stone-900 text-white font-bold'
                : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200/80'
            }`}
          >
            {col.label}
          </button>
        ))}
      </div>

      {/* Main Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <span>Featured Genetic Listings</span>
            </h2>
            <p className="text-xs text-stone-500">
              Showing {filteredListings.length} verified commercial asset{filteredListings.length === 1 ? '' : 's'}.
            </p>
          </div>

          <Link
            href="/bovine/marketplace/listings"
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>View All Listings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((item) => {
            const isSaved = savedListingIds.includes(item.id);
            const isComparing = compareListingIds.includes(item.id);
            const anim = item.animalId ? animals.find((a) => a.id === item.animalId) : null;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Media Image Header */}
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={item.media[0]?.url || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                        item.assetType === 'LIVE_ANIMAL'
                          ? 'bg-emerald-800/90 text-white'
                          : item.assetType === 'SEMEN'
                          ? 'bg-blue-800/90 text-white'
                          : 'bg-amber-700/90 text-white'
                      }`}
                    >
                      {item.assetType.replace('_', ' ')}
                    </span>
                    {item.priceNegotiable && (
                      <span className="px-2 py-0.5 rounded-full bg-stone-900/80 text-white text-[10px] font-semibold backdrop-blur-md">
                        Negotiable
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => toggleSaveListing(item.id)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer shadow-xs ${
                        isSaved
                          ? 'bg-amber-500 text-white'
                          : 'bg-white/80 hover:bg-white text-stone-700'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save listing'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleCompareListing(item.id)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer shadow-xs ${
                        isComparing
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white/80 hover:bg-white text-stone-700'
                      }`}
                      title={isComparing ? 'Remove from compare' : 'Compare asset'}
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-[11px] text-stone-500 flex items-center justify-between">
                      <span className="font-semibold text-stone-700">{item.sellerOrgName}</span>
                      <span>{item.region}</span>
                    </div>

                    <Link
                      href={`/bovine/marketplace/listings/${item.id}`}
                      className="font-bold text-stone-900 text-base hover:text-emerald-800 line-clamp-1"
                    >
                      {item.title}
                    </Link>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {item.trustBadges.parentageDnaVerified && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          DNA Parentage Verified
                        </span>
                      )}
                      {item.trustBadges.carrierFreeStatus && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                          Carrier Free
                        </span>
                      )}
                      {item.trustBadges.healthClearanceCurrent && (
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                          Health Clearance
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Highlights or Semen/Embryo Specs */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs space-y-1">
                    {item.assetType === 'LIVE_ANIMAL' && anim ? (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Selection Index:</span>
                        <span className="font-bold font-mono text-emerald-800">$B +178.4 (Top 2%)</span>
                      </div>
                    ) : item.assetType === 'SEMEN' && item.semenDetails ? (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Motility &amp; Stock:</span>
                        <span className="font-bold font-mono text-blue-800">
                          {item.semenDetails.motilityPercent}% • {item.semenDetails.availableDoses} Doses
                        </span>
                      </div>
                    ) : item.assetType === 'EMBRYO' && item.embryoDetails ? (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Grade &amp; Stock:</span>
                        <span className="font-bold font-mono text-amber-800">
                          {item.embryoDetails.grade} • {item.embryoDetails.quantity} Lots
                        </span>
                      </div>
                    ) : (
                      <div className="text-stone-500 truncate">{item.highlights[0]}</div>
                    )}
                  </div>

                  {/* Price & Action Hub */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        {item.assetType === 'SEMEN' ? 'Price / Dose' : item.assetType === 'EMBRYO' ? 'Price / Embryo' : 'Asking Price'}
                      </span>
                      <div className="text-lg font-bold font-mono text-stone-900">
                        ${item.askingPrice.toLocaleString()}
                        <span className="text-xs text-stone-400 font-normal ml-1">{item.currency}</span>
                      </div>
                    </div>

                    <Link
                      href={`/bovine/marketplace/listings/${item.id}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors shadow-2xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Searches Callout */}
      {savedSearches.length > 0 && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-stone-900">Your Saved Genetic Searches</h3>
            </div>
            <Link href="/bovine/marketplace/searches" className="text-xs font-bold text-emerald-800 hover:underline">
              Manage Searches &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {savedSearches.map((s) => (
              <Link
                key={s.id}
                href={`/bovine/marketplace/listings?q=${encodeURIComponent(s.query)}`}
                className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-stone-900">{s.name}</div>
                  <div className="text-stone-500 font-mono text-[11px]">&ldquo;{s.query}&rdquo;</div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
