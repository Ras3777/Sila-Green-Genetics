'use client';

import React from 'react';
import { Sparkles, Layers, FileText, Truck, Dna } from 'lucide-react';
import { AnimalListingTab } from '../_hooks/useAnimalListingDetail';

interface AnimalListingTabsProps {
  activeTab: AnimalListingTab;
  setActiveTab: (tab: AnimalListingTab) => void;
  documentCount: number;
}

export function AnimalListingTabs({
  activeTab,
  setActiveTab,
  documentCount,
}: AnimalListingTabsProps) {
  return (
    <div className="border-b border-stone-200 bg-stone-50 px-6 flex items-center gap-2 overflow-x-auto text-sm font-medium">
      <button
        onClick={() => setActiveTab('genetics')}
        className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'genetics'
            ? 'border-emerald-800 text-emerald-800'
            : 'border-transparent text-stone-600 hover:text-stone-900'
        }`}
      >
        <Sparkles className="w-4 h-4" /> Genetic Evaluation &amp; EPDs
      </button>
      <button
        onClick={() => setActiveTab('pedigree')}
        className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'pedigree'
            ? 'border-emerald-800 text-emerald-800'
            : 'border-transparent text-stone-600 hover:text-stone-900'
        }`}
      >
        <Layers className="w-4 h-4" /> 3-Generation Pedigree
      </button>
      <button
        onClick={() => setActiveTab('health_docs')}
        className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'health_docs'
            ? 'border-emerald-800 text-emerald-800'
            : 'border-transparent text-stone-600 hover:text-stone-900'
        }`}
      >
        <FileText className="w-4 h-4" /> Certificates &amp; Documents ({documentCount})
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
      <button
        onClick={() => setActiveTab('progeny')}
        className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'progeny'
            ? 'border-emerald-800 text-emerald-800'
            : 'border-transparent text-stone-600 hover:text-stone-900'
        }`}
      >
        <Dna className="w-4 h-4" /> Progeny Simulation
      </button>
    </div>
  );
}
