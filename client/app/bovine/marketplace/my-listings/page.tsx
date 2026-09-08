'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  ChevronRight,
  Plus,
  Search,
  Sliders,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Award,
  Pause,
  Play,
  Trash2,
  Edit,
  CheckCircle2,
  Building,
  TrendingUp,
  X,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { MarketplaceListingStatus } from '@/lib/bovine-marketplace-types';

export default function MyListingsPage() {
  const {
    listings,
    pauseListing,
    publishListing,
    withdrawListing,
    updateListing,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Edit price modal
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  // Filter listings
  const filteredListings = listings.filter((l) => {
    if (selectedStatus !== 'ALL' && l.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchType = l.assetType.toLowerCase().includes(q);
      if (!matchTitle && !matchType) return false;
    }
    return true;
  });

  const activeCount = listings.filter((l) => l.status === 'ACTIVE').length;
  const reservedCount = listings.filter((l) => l.status === 'RESERVED').length;
  const soldCount = listings.filter((l) => l.status === 'SOLD').length;
  const pausedCount = listings.filter((l) => l.status === 'PAUSED').length;

  const totalValue = listings.reduce((acc, curr) => acc + curr.askingPrice, 0);
  const totalInquiries = listings.reduce((acc, curr) => acc + curr.inquiryCount, 0);
  const totalOffers = listings.reduce((acc, curr) => acc + curr.offerCount, 0);

  const handleOpenEditPrice = (listingId: string, currentPrice: number) => {
    setEditingListingId(listingId);
    setNewPrice(currentPrice);
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingListingId) {
      updateListing(editingListingId, { askingPrice: Number(newPrice) });
      setEditingListingId(null);
    }
  };

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
                <span className="text-emerald-800 font-semibold">Seller Listings</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Layers className="w-8 h-8 text-emerald-800" />
                My Commercial Genetics Inventory
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Manage your active farm offerings, adjust asking prices, monitor buyer engagement, and convert reservations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/bovine/marketplace/seller"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Seller Dashboard
              </Link>
              <Link
                href="/bovine/marketplace/listings/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                New Listing
              </Link>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100 text-xs font-mono">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Active Listings</div>
              <div className="text-xl font-bold text-stone-900 mt-0.5">{activeCount}</div>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Active Holds / Reservations</div>
              <div className="text-xl font-bold text-amber-700 mt-0.5">{reservedCount}</div>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Total Buyer Inquiries</div>
              <div className="text-xl font-bold text-emerald-800 mt-0.5">{totalInquiries}</div>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Total Inventory Value</div>
              <div className="text-xl font-bold text-stone-900 mt-0.5">${totalValue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Controls */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'ALL', label: `All (${listings.length})` },
              { id: 'ACTIVE', label: `Active (${activeCount})` },
              { id: 'RESERVED', label: `Reserved (${reservedCount})` },
              { id: 'PAUSED', label: `Paused (${pausedCount})` },
              { id: 'SOLD', label: `Sold (${soldCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                  selectedStatus === tab.id
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Listings List */}
        <div className="space-y-4">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0">
                  {item.media[0]?.url ? (
                    <img src={item.media[0].url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-stone-600">
                      {item.assetType}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-stone-100 text-stone-700 rounded-md">
                      {item.assetType.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-mono font-bold rounded-md ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'RESERVED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <Link
                    href={`/bovine/marketplace/listings/${item.id}`}
                    className="text-base font-bold text-stone-900 hover:text-emerald-800 transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>

                  <div className="text-xs text-stone-600 font-mono flex items-center gap-3">
                    <span>Views: <strong>{item.viewCount}</strong></span>
                    <span>•</span>
                    <span>Saves: <strong>{item.saveCount}</strong></span>
                    <span>•</span>
                    <span>Inquiries: <strong>{item.inquiryCount}</strong></span>
                    <span>•</span>
                    <span>Offers: <strong>{item.offerCount}</strong></span>
                  </div>
                </div>
              </div>

              {/* Pricing and Quick Actions */}
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-xs font-mono text-stone-700 uppercase">Asking Price</div>
                  <div className="text-lg font-bold font-mono text-stone-900">
                    ${item.askingPrice.toLocaleString()} {item.currency}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditPrice(item.id, item.askingPrice)}
                    className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl"
                    title="Edit asking price"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {item.status === 'ACTIVE' ? (
                    <button
                      onClick={() => pauseListing(item.id)}
                      className="p-2 text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl"
                      title="Pause listing"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : item.status === 'PAUSED' ? (
                    <button
                      onClick={() => publishListing(item.id)}
                      className="p-2 text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl"
                      title="Publish listing"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    onClick={() => withdrawListing(item.id)}
                    className="p-2 text-stone-600 hover:text-red-600 bg-stone-50 hover:bg-red-50 rounded-xl"
                    title="Withdraw listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {item.animalId && (
                    <Link
                      href={`/bovine/animals/breeding-stock/${item.animalId}/marketplace`}
                      className="px-3 py-2 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap"
                    >
                      Commercial Workspace
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Price Modal */}
      {editingListingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Adjust Asking Price</h3>
              <button onClick={() => setEditingListingId(null)} className="p-1 text-stone-600 hover:text-stone-700">✕</button>
            </div>
            <form onSubmit={handleSavePrice} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">New Asking Price ($ USD)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditingListingId(null)} className="px-3 py-1.5 text-xs text-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded-xl">Save Price</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
