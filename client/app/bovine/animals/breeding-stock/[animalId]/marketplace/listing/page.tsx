'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  ChevronRight,
  DollarSign,
  Save,
  Pause,
  Play,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function AnimalListingConfigPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const { listings, updateListing, pauseListing, publishListing, withdrawListing } = useMarketplace();

  const animal = animals.find((a) => a.id === animalId);
  const listing = listings.find((l) => l.animalId === animalId);

  const [title, setTitle] = useState(listing?.title || '');
  const [askingPrice, setAskingPrice] = useState(listing?.askingPrice || 4500);
  const [minimumPrice, setMinimumPrice] = useState(listing?.minimumPrice || 4000);
  const [description, setDescription] = useState(listing?.description || '');

  if (!animal) {
    return <div className="p-8 text-center text-stone-500">Animal not found.</div>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (listing) {
      updateListing(listing.id, {
        title,
        askingPrice: Number(askingPrice),
        minimumPrice: Number(minimumPrice),
        description,
      });
      alert('Listing configuration updated successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
            <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/animals/breeding-stock" className="hover:underline">Breeding Stock</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/bovine/animals/breeding-stock/${animal.id}/marketplace`} className="hover:underline">
              Commercial Hub
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold">Listing Config</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <Layers className="w-8 h-8 text-emerald-800" />
            Commercial Listing Configuration
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Configure terms, prices, and publication status for {animal.name || animal.identifiers?.[0]?.value}.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!listing ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-600 space-y-4">
            <h3 className="text-base font-bold text-stone-900">No Active Listing Configured</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              This breeding animal has not yet been published to the commercial marketplace.
            </p>
            <Link
              href="/bovine/marketplace/listings/new"
              className="inline-block px-4 py-2 text-xs font-bold text-white bg-emerald-800 rounded-xl"
            >
              Create Listing Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs font-mono text-stone-700 uppercase">Current Status:</span>
                <span className="ml-2 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-emerald-100 text-emerald-800">
                  {listing.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {listing.status === 'ACTIVE' ? (
                  <button
                    type="button"
                    onClick={() => pauseListing(listing.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl flex items-center gap-1"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pause Listing
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => publishListing(listing.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" /> Publish
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => withdrawListing(listing.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Withdraw
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Commercial Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Asking Price ($ USD)</label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Minimum Acceptable Bid ($ USD)</label>
                <input
                  type="number"
                  value={minimumPrice}
                  onChange={(e) => setMinimumPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Marketing Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
