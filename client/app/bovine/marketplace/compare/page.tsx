'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightLeft,
  ChevronRight,
  Trash2,
  Plus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Heart,
  X,
  ExternalLink,
  Award,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export default function CompareGeneticsPage() {
  const { animals, herds } = useBovine();
  const {
    listings,
    compareListingIds,
    toggleCompareListing,
    clearCompareList,
    getHerdFit,
  } = useMarketplace();

  const [selectedTargetHerd, setSelectedTargetHerd] = useState(herds[0]?.id || 'herd-1');
  const [showAddModal, setShowAddModal] = useState(false);

  // Items currently being compared
  const comparedListings = listings.filter((l) => compareListingIds.includes(l.id));

  // Trait rows to compare
  const epdRows = [
    { key: 'ced', label: 'Calving Ease Direct (CED)', higherIsBetter: true },
    { key: 'bw', label: 'Birth Weight (BW)', higherIsBetter: false },
    { key: 'ww', label: 'Weaning Weight (WW)', higherIsBetter: true },
    { key: 'yw', label: 'Yearling Weight (YW)', higherIsBetter: true },
    { key: 'marb', label: 'Marbling Score (MARB)', higherIsBetter: true },
    { key: 'rea', label: 'Ribeye Area (REA)', higherIsBetter: true },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-24">
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
                <span className="text-emerald-800 font-semibold">Compare Genetics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <ArrowRightLeft className="w-8 h-8 text-emerald-800" />
                Side-by-Side Genetic & Commercial Comparison
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Benchmark up to 10 live animals, semen straws, or embryo lots across EPDs, inbreeding risk, selection indices, and herd compatibility.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {comparedListings.length > 0 && (
                <button
                  onClick={clearCompareList}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Clear All
                </button>
              )}
              {comparedListings.length < 10 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Item ({comparedListings.length}/10)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {comparedListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
            <ArrowRightLeft className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">No Genetics in Comparison Tray</h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Select at least 2 breeding animals, semen sires, or embryo lots from the marketplace to analyze their genetic and commercial differences side-by-side.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors"
              >
                Pick from Marketplace Listings
              </button>
              <Link
                href="/bovine/marketplace/animals"
                className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Browse Animals
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Target Herd Selector for comparative compatibility */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-800" />
                <div>
                  <span className="text-xs font-mono uppercase text-stone-700 font-semibold">
                    Evaluate Herd Fit Against:
                  </span>
                  <div className="text-sm font-bold text-stone-900">
                    Calculates compatibility score & expected inbreeding for each column
                  </div>
                </div>
              </div>

              <select
                value={selectedTargetHerd}
                onChange={(e) => setSelectedTargetHerd(e.target.value)}
                className="px-3 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {herds.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.breed || 'Angus'})
                  </option>
                ))}
              </select>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="p-4 sm:p-6 w-60 min-w-48 font-mono text-xs text-stone-700 uppercase sticky left-0 bg-stone-50 z-10">
                      Genetic Asset
                    </th>
                    {comparedListings.map((item) => {
                      const anim = item.animalId ? animals.find((a) => a.id === item.animalId) : null;
                      return (
                        <th key={item.id} className="p-4 sm:p-6 min-w-64 w-72 align-top border-l border-stone-100">
                          <div className="relative space-y-3">
                            <button
                              onClick={() => toggleCompareListing(item.id)}
                              className="absolute -top-2 -right-2 p-1 text-stone-600 hover:text-red-500 rounded-lg hover:bg-stone-100"
                              title="Remove from comparison"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            <div className="h-28 rounded-xl overflow-hidden bg-stone-100">
                              {item.media[0]?.url ? (
                                <img src={item.media[0].url} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-mono text-xs text-stone-600">
                                  {item.assetType}
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="text-[10px] font-mono uppercase font-bold text-emerald-800">
                                {item.assetType.replace('_', ' ')}
                              </div>
                              <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{item.title}</h4>
                              <div className="text-xs text-stone-700 font-mono mt-0.5">
                                {item.sellerOrgName}
                              </div>
                            </div>

                            <Link
                              href={
                                item.assetType === 'LIVE_ANIMAL'
                                  ? `/bovine/marketplace/animals/${item.id}`
                                  : item.assetType === 'SEMEN'
                                  ? `/bovine/marketplace/semen/${item.id}`
                                  : item.assetType === 'EMBRYO'
                                  ? `/bovine/marketplace/embryos/${item.id}`
                                  : `/bovine/marketplace/listings/${item.id}`
                              }
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"
                            >
                              View Listing <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-sm">
                  {/* Asking Price */}
                  <tr>
                    <td className="p-4 font-mono text-xs uppercase text-stone-700 bg-stone-50/70 sticky left-0 z-10">
                      Asking Price
                    </td>
                    {comparedListings.map((item) => (
                      <td key={item.id} className="p-4 border-l border-stone-100 font-mono font-bold text-stone-900">
                        ${item.askingPrice.toLocaleString()} {item.currency}
                        {item.assetType === 'SEMEN' && <span className="text-xs font-normal text-stone-700"> / straw</span>}
                      </td>
                    ))}
                  </tr>

                  {/* Herd Fit Compatibility Score */}
                  <tr className="bg-emerald-50/40">
                    <td className="p-4 font-mono text-xs uppercase text-emerald-950 font-bold bg-emerald-50 sticky left-0 z-10 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-800" /> Herd Compatibility Fit
                    </td>
                    {comparedListings.map((item) => {
                      const fit = item.animalId ? getHerdFit(item.animalId, selectedTargetHerd) : null;
                      return (
                        <td key={item.id} className="p-4 border-l border-stone-100">
                          {fit ? (
                            <div>
                              <span className="text-lg font-extrabold font-mono text-emerald-800">
                                {fit.overallCompatibilityScore}%
                              </span>
                              <div className="text-[11px] text-stone-600 font-mono">
                                Inbreeding F: {(fit.expectedInbreedingAvg * 100).toFixed(1)}% ({fit.inbreedingRiskTier})
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-stone-600 italic">Mating lot preview</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Selection Index ($B) */}
                  <tr>
                    <td className="p-4 font-mono text-xs uppercase text-stone-700 bg-stone-50/70 sticky left-0 z-10">
                      Selection Index ($B)
                    </td>
                    {comparedListings.map((item) => {
                      const anim = item.animalId ? animals.find((a) => a.id === item.animalId) : null;
                      const idx = anim?.geneticProfile?.selectionIndex || (item.assetType === 'SEMEN' ? 172 : 165);
                      return (
                        <td key={item.id} className="p-4 border-l border-stone-100 font-mono font-bold text-emerald-800">
                          +{idx}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Breed & Registration */}
                  <tr>
                    <td className="p-4 font-mono text-xs uppercase text-stone-700 bg-stone-50/70 sticky left-0 z-10">
                      Breed & Origin
                    </td>
                    {comparedListings.map((item) => {
                      const anim = item.animalId ? animals.find((a) => a.id === item.animalId) : null;
                      return (
                        <td key={item.id} className="p-4 border-l border-stone-100 text-xs text-stone-700">
                          <div><strong>{anim?.breed || 'Angus'}</strong></div>
                          <div className="text-stone-700 font-mono">{item.region}</div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* EPD Trait Comparisons */}
                  {epdRows.map((trait) => (
                    <tr key={trait.key}>
                      <td className="p-4 font-mono text-xs text-stone-700 bg-stone-50/70 sticky left-0 z-10">
                        {trait.label}
                      </td>
                      {comparedListings.map((item) => {
                        return (
                          <td key={item.id} className="p-4 border-l border-stone-100 font-mono text-xs">
                            {trait.key === 'ced' && '+12'}
                            {trait.key === 'bw' && '-1.4'}
                            {trait.key === 'ww' && '+78 lbs'}
                            {trait.key === 'yw' && '+138 lbs'}
                            {trait.key === 'marb' && '+1.15'}
                            {trait.key === 'rea' && '+0.88'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Trust Badges */}
                  <tr>
                    <td className="p-4 font-mono text-xs uppercase text-stone-700 bg-stone-50/70 sticky left-0 z-10">
                      Verified Badges
                    </td>
                    {comparedListings.map((item) => (
                      <td key={item.id} className="p-4 border-l border-stone-100 text-xs space-y-1">
                        {item.trustBadges.parentageDnaVerified && (
                          <div className="text-emerald-800 flex items-center gap-1 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" /> DNA Parentage
                          </div>
                        )}
                        {item.trustBadges.genotyped && (
                          <div className="text-stone-700 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Genotyped
                          </div>
                        )}
                        {item.trustBadges.carrierFreeStatus && (
                          <div className="text-emerald-800 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Carrier-Free
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-stone-200 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Add Item to Comparison Tray</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-stone-600 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {listings.map((item) => {
                const isSelected = compareListingIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-200 overflow-hidden flex-shrink-0">
                        {item.media[0]?.url && (
                          <img src={item.media[0].url} alt={item.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 line-clamp-1">{item.title}</div>
                        <div className="text-xs text-stone-700 font-mono">
                          {item.assetType} • ${item.askingPrice.toLocaleString()} {item.currency}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCompareListing(item.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                        isSelected
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-800 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isSelected ? 'Remove' : 'Add to Compare'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
