'use client';

import React from 'react';
import { Layers, Sparkles, Dna, FileText, Truck } from 'lucide-react';
import { UniversalListingTab } from '../_hooks/useUniversalListingDetail';

interface ListingTabsHeaderProps {
  activeTab: UniversalListingTab;
  setActiveTab: (tab: UniversalListingTab) => void;
  documentCount: number;
}

export function ListingTabsHeader({
  activeTab,
  setActiveTab,
  documentCount,
}: ListingTabsHeaderProps) {
  return (
    <div className="border-b border-stone-200 bg-stone-50 px-6 flex items-center gap-2 overflow-x-auto text-sm font-medium">
      <button
        onClick={() => setActiveTab('overview')}
        className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'overview'
            ? 'border-emerald-800 text-emerald-800'
            : 'border-transparent text-stone-600 hover:text-stone-900'
        }`}
      >
        <Layers className="w-4 h-4" /> Commercial Overview
      </button>
      <button
        onClick={() => setActiveTab('genetics')}
        className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'genetics'
            ? 'border-emerald-800 text-emerald-800'
            : 'border-transparent text-stone-600 hover:text-stone-900'
        }`}
      >
        <Sparkles className="w-4 h-4" /> Genetics &amp; EPDs
      </button>
      <button
        onClick={() => setActiveTab('pedigree')}
        className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'pedigree'
            ? 'border-emerald-800 text-emerald-800'
            : 'border-transparent text-stone-600 hover:text-stone-900'
        }`}
      >
        <Dna className="w-4 h-4" /> Certified Pedigree
      </button>
      <button
        onClick={() => setActiveTab('documents')}
        className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'documents'
            ? 'border-emerald-800 text-emerald-800'
            : 'border-transparent text-stone-600 hover:text-stone-900'
        }`}
      >
        <FileText className="w-4 h-4" /> Documents Vault ({documentCount})
      </button>
      <button
        onClick={() => setActiveTab('logistics')}
        className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'logistics'
            ? 'border-emerald-800 text-emerald-800'
            : 'border-transparent text-stone-600 hover:text-stone-900'
        }`}
      >
        <Truck className="w-4 h-4" /> Logistics &amp; Delivery
      </button>
    </div>
  );
}
