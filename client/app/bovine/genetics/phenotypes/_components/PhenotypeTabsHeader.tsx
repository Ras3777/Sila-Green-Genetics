'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { PhenotypeTab } from '../_hooks/usePhenotypesPage';

interface PhenotypeTabsHeaderProps {
  activeTab: PhenotypeTab;
  setActiveTab: (tab: PhenotypeTab) => void;
  observationsCount: number;
  traitsCount: number;
  methodsCount: number;
  onOpenRecordModal: () => void;
  onOpenTraitModal: () => void;
  onOpenMethodModal: () => void;
}

export function PhenotypeTabsHeader({
  activeTab,
  setActiveTab,
  observationsCount,
  traitsCount,
  methodsCount,
  onOpenRecordModal,
  onOpenTraitModal,
  onOpenMethodModal,
}: PhenotypeTabsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('OBSERVATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'OBSERVATIONS'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Phenotype Observations ({observationsCount})
        </button>
        <button
          onClick={() => setActiveTab('TRAITS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'TRAITS'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Trait Definitions ({traitsCount})
        </button>
        <button
          onClick={() => setActiveTab('METHODS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'METHODS'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Measurement Methods ({methodsCount})
        </button>
      </div>

      {/* Action button corresponding to active view */}
      <div>
        {activeTab === 'OBSERVATIONS' && (
          <button
            onClick={onOpenRecordModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Phenotype</span>
          </button>
        )}
        {activeTab === 'TRAITS' && (
          <button
            onClick={onOpenTraitModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Trait Definition</span>
          </button>
        )}
        {activeTab === 'METHODS' && (
          <button
            onClick={onOpenMethodModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Measurement S.O.P.</span>
          </button>
        )}
      </div>
    </div>
  );
}
