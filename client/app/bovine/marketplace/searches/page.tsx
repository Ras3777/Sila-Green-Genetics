'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bookmark,
  ChevronRight,
  Trash2,
  Search,
  Bell,
  BellOff,
  Plus,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Sliders,
  X,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { SavedSearch } from '@/lib/bovine-marketplace-types';

export default function SavedSearchesPage() {
  const router = useRouter();
  const { savedSearches, saveSearch, deleteSavedSearch } = useMarketplace();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [newSearchQuery, setNewSearchQuery] = useState('');
  const [newAssetType, setNewAssetType] = useState<string>('ALL');
  const [newBreed, setNewBreed] = useState('');
  const [newMinIndex, setNewMinIndex] = useState<number | ''>('');
  const [newCarrierFree, setNewCarrierFree] = useState(false);
  const [newAlerts, setNewAlerts] = useState(true);

  const handleCreateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    saveSearch({
      name: newSearchName,
      query: newSearchQuery,
      assetType: newAssetType === 'ALL' ? undefined : (newAssetType as any),
      breed: newBreed || undefined,
      minSelectionIndex: newMinIndex === '' ? undefined : Number(newMinIndex),
      carrierFreeOnly: newCarrierFree,
      emailAlerts: newAlerts,
    });
    setShowAddModal(false);
    setNewSearchName('');
    setNewSearchQuery('');
  };

  const executeSearch = (s: SavedSearch) => {
    let target = '/bovine/marketplace/listings';
    if (s.assetType === 'LIVE_ANIMAL') target = '/bovine/marketplace/animals';
    if (s.assetType === 'SEMEN') target = '/bovine/marketplace/semen';
    if (s.assetType === 'EMBRYO') target = '/bovine/marketplace/embryos';

    const params = new URLSearchParams();
    if (s.query) params.set('q', s.query);
    if (s.breed) params.set('breed', s.breed);
    if (s.minSelectionIndex) params.set('minIndex', String(s.minSelectionIndex));

    const finalUrl = `${target}?${params.toString()}`;
    router.push(finalUrl);
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
                <span className="text-emerald-800 font-semibold">Saved Searches</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Bookmark className="w-8 h-8 text-emerald-800" />
                Saved Search Alerts & Genetic Filters
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Save multi-clause criteria for genetic traits, breeds, and price ranges to receive automatic notifications when new stock is published.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Saved Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {savedSearches.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
            <Search className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">No Saved Searches Yet</h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Save your frequent searches or set up genetic trait alerts to stay ahead when elite breeding bulls or embryo packages are listed.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors"
            >
              Configure Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedSearches.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">{s.name}</h3>
                      <div className="text-xs text-stone-700 font-mono mt-0.5">
                        Created: {s.createdDate}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSavedSearch(s.id)}
                      className="p-1.5 text-stone-600 hover:text-red-500 rounded-lg hover:bg-stone-50"
                      title="Delete saved search"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Filter criteria chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {s.query && (
                      <span className="text-xs px-2.5 py-1 bg-stone-100 text-stone-800 rounded-lg font-mono">
                        Keyword: "{s.query}"
                      </span>
                    )}
                    {s.assetType && (
                      <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-mono font-medium">
                        {s.assetType.replace('_', ' ')}
                      </span>
                    )}
                    {s.breed && (
                      <span className="text-xs px-2.5 py-1 bg-stone-100 text-stone-800 rounded-lg font-mono">
                        Breed: {s.breed}
                      </span>
                    )}
                    {s.minSelectionIndex && (
                      <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg font-mono font-bold">
                        Index: ≥ +{s.minSelectionIndex}
                      </span>
                    )}
                    {s.carrierFreeOnly && (
                      <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg font-mono font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> Carrier Free
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    {s.emailAlerts ? (
                      <span className="text-emerald-800 font-medium flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5" /> Alerts Enabled
                      </span>
                    ) : (
                      <span className="text-stone-700 flex items-center gap-1">
                        <BellOff className="w-3.5 h-3.5" /> Alerts Paused
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => executeSearch(s)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    Run Search <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Search Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Create Saved Search Alert</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-stone-600 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Search Alert Name</label>
                <input
                  type="text"
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                  placeholder="e.g. Heifer Safe Angus Bulls"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Search Keywords</label>
                <input
                  type="text"
                  value={newSearchQuery}
                  onChange={(e) => setNewSearchQuery(e.target.value)}
                  placeholder="e.g. Low Birth Weight"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Asset Category</label>
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="ALL">All Assets</option>
                    <option value="LIVE_ANIMAL">Live Animals</option>
                    <option value="SEMEN">Semen</option>
                    <option value="EMBRYO">Embryos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Min Index ($B)</label>
                  <input
                    type="number"
                    value={newMinIndex}
                    onChange={(e) => setNewMinIndex(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 150"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={newCarrierFree}
                    onChange={(e) => setNewCarrierFree(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Carrier-Free Status Required</span>
                </label>

                <label className="flex items-center gap-2 text-xs cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={newAlerts}
                    onChange={(e) => setNewAlerts(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Send notifications when new matches appear</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl"
                >
                  Save Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
