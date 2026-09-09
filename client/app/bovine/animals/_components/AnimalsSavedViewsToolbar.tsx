'use client';

import React from 'react';

interface AnimalsSavedViewsToolbarProps {
  activeViewTab: string;
  onSelectView: (view: string) => void;
}

const VIEWS = [
  { id: 'ALL', label: 'All Animals' },
  { id: 'DONORS', label: 'Embryo Donors' },
  { id: 'RECIPIENTS', label: 'Recipients' },
  { id: 'BREEDING_STOCK', label: 'Breeding Stock' },
  { id: 'CULL', label: 'Cull Candidates' },
  { id: 'REVIEW', label: 'Requires Review' },
  { id: 'MISSING_DATA', label: 'Missing Primary ID' },
];

export function AnimalsSavedViewsToolbar({
  activeViewTab,
  onSelectView,
}: AnimalsSavedViewsToolbarProps) {
  return (
    <div className="flex items-center space-x-1 overflow-x-auto pb-2 text-xs border-b border-stone-200">
      {VIEWS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectView(tab.id)}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeViewTab === tab.id
              ? 'bg-emerald-800 text-white shadow-xs font-semibold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
