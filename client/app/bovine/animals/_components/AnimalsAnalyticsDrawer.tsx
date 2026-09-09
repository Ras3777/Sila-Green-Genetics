'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface AnimalsAnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filteredAnimals: Animal[];
}

export function AnimalsAnalyticsDrawer({
  isOpen,
  onClose,
  filteredAnimals,
}: AnimalsAnalyticsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">Population Dynamics Breakdown</h2>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-700 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-white border border-stone-200">
          <span className="text-stone-500">Females</span>
          <div className="text-xl font-bold text-stone-900 mt-1">
            {filteredAnimals.filter((a) => a.sex === 'FEMALE').length} Head
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-stone-200">
          <span className="text-stone-500">Males</span>
          <div className="text-xl font-bold text-stone-900 mt-1">
            {filteredAnimals.filter((a) => a.sex === 'MALE').length} Head
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-stone-200">
          <span className="text-stone-500">Requires Review</span>
          <div className="text-xl font-bold text-amber-700 mt-1">
            {filteredAnimals.filter((a) => a.requiresReview).length} Head
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-stone-200">
          <span className="text-stone-500">Missing Primary Tag</span>
          <div className="text-xl font-bold text-stone-900 mt-1">
            {filteredAnimals.filter((a) => !a.primaryIdentifier).length} Head
          </div>
        </div>
      </div>
    </div>
  );
}
