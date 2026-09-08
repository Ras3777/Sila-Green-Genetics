'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ChevronRight,
  Trash2,
  ExternalLink,
  ArrowRightLeft,
  DollarSign,
  Building,
  Sparkles,
  ShoppingBag,
  FileEdit,
  Save,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export default function SavedListingsPage() {
  const { animals } = useBovine();
  const {
    listings,
    savedListingIds,
    toggleSaveListing,
    toggleCompareListing,
    compareListingIds,
  } = useMarketplace();

  // Private buyer notes state
  const [buyerNotes, setBuyerNotes] = useState<Record<string, string>>({
    'list-101': 'Evaluating for Fall 2025 heifer breeding group. Need BSE confirmation.',
    'list-104': 'Top tier donor candidate for high-marbling Angus program.',
  });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const savedListings = listings.filter((l) => savedListingIds.includes(l.id));

  const handleStartEditNote = (listingId: string) => {
    setEditingNoteId(listingId);
    setTempNote(buyerNotes[listingId] || '');
  };

  const handleSaveNote = (listingId: string) => {
    setBuyerNotes((prev) => ({ ...prev, [listingId]: tempNote }));
    setEditingNoteId(null);
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
                <span className="text-emerald-800 font-semibold">Saved Genetics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                Saved Genetics & Watchlist
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Your private watchlist of live breeding animals, semen sires, and embryo packages with personal evaluation notes.
              </p>
            </div>

            <Link
              href="/bovine/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {savedListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
            <Heart className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">Your Watchlist is Empty</h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Save breeding animals, semen straws, and embryo lots to monitor pricing updates and keep personal notes for upcoming breeding seasons.
            </p>
            <div className="pt-2">
              <Link
                href="/bovine/marketplace"
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors inline-block"
              >
                Discover Genetics
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedListings.map((listing) => {
              const animal = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;
              const isCompared = compareListingIds.includes(listing.id);
              const note = buyerNotes[listing.id];

              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0">
                          {listing.media[0]?.url ? (
                            <img src={listing.media[0].url} alt={listing.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-stone-600">
                              {listing.assetType}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-stone-100 text-stone-700 rounded-md">
                            {listing.assetType.replace('_', ' ')}
                          </span>
                          <h3 className="font-bold text-base text-stone-900 line-clamp-1 mt-1">
                            {listing.title}
                          </h3>
                          <div className="text-xs text-stone-600 font-mono">
                            {listing.sellerOrgName} • {listing.region}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveListing(listing.id)}
                        className="p-2 text-stone-600 hover:text-red-500 rounded-xl hover:bg-stone-50"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price & EPD highlight */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="text-[10px] text-stone-700 uppercase">Commercial Value</div>
                        <div className="text-base font-bold text-stone-900">
                          ${listing.askingPrice.toLocaleString()} {listing.currency}
                        </div>
                      </div>
                      {animal?.geneticProfile?.selectionIndex && (
                        <div className="text-right">
                          <div className="text-[10px] text-stone-700 uppercase">Selection Index</div>
                          <div className="text-base font-bold text-emerald-800">
                            +{animal.geneticProfile.selectionIndex}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Private Buyer Note Box */}
                    <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/70 text-xs">
                      <div className="flex items-center justify-between mb-1 text-amber-900 font-semibold font-mono uppercase text-[10px]">
                        <span>Private Farm Note</span>
                        {editingNoteId !== listing.id && (
                          <button
                            onClick={() => handleStartEditNote(listing.id)}
                            className="text-amber-800 hover:underline flex items-center gap-1"
                          >
                            <FileEdit className="w-3 h-3" /> Edit
                          </button>
                        )}
                      </div>

                      {editingNoteId === listing.id ? (
                        <div className="space-y-2 mt-1">
                          <textarea
                            rows={2}
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            placeholder="Add your evaluation thoughts, target herd, or timeline..."
                            className="w-full p-2 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(listing.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-700 rounded-lg flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" /> Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-stone-700 italic">
                          {note || 'No private note added yet. Click edit to add evaluation details.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleCompareListing(listing.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${
                        isCompared
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      {isCompared ? 'In Compare List' : 'Compare'}
                    </button>

                    <Link
                      href={
                        listing.assetType === 'LIVE_ANIMAL'
                          ? `/bovine/marketplace/animals/${listing.id}`
                          : listing.assetType === 'SEMEN'
                          ? `/bovine/marketplace/semen/${listing.id}`
                          : listing.assetType === 'EMBRYO'
                          ? `/bovine/marketplace/embryos/${listing.id}`
                          : `/bovine/marketplace/listings/${listing.id}`
                      }
                      className="px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1"
                    >
                      View Listing <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
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
