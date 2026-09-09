'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';
import { Animal } from '@/lib/bovine-types';
import { LiveAnimalsCard } from './LiveAnimalsCard';

interface LiveAnimalsGridProps {
  sortedListings: MarketplaceListing[];
  animals: Animal[];
  savedListingIds: string[];
  compareListingIds: string[];
  onToggleCompare: (id: string) => void;
  onToggleSave: (id: string) => void;
  onOpenFitModal: (listing: MarketplaceListing) => void;
  onClearFilters: () => void;
}

export function LiveAnimalsGrid({
  sortedListings,
  animals,
  savedListingIds,
  compareListingIds,
  onToggleCompare,
  onToggleSave,
  onOpenFitModal,
  onClearFilters,
}: LiveAnimalsGridProps) {
  if (sortedListings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <Layers className="w-12 h-12 text-stone-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-stone-900">No animals match your filter criteria</h3>
        <p className="text-sm text-stone-600 mt-1 max-w-md mx-auto">
          Try broadening your search term, clearing price bounds, or adjusting genetic index requirements.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 text-sm font-medium text-emerald-800 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sortedListings.map((listing) => {
        const animal = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;
        const isSaved = savedListingIds.includes(listing.id);
        const isCompared = compareListingIds.includes(listing.id);

        return (
          <LiveAnimalsCard
            key={listing.id}
            listing={listing}
            animal={animal || null}
            isSaved={isSaved}
            isCompared={isCompared}
            onToggleCompare={() => onToggleCompare(listing.id)}
            onToggleSave={() => onToggleSave(listing.id)}
            onOpenFitModal={() => onOpenFitModal(listing)}
          />
        );
      })}
    </div>
  );
}
