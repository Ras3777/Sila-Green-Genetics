'use client';

import React from 'react';
import { MarketplaceListingMedia } from '@/lib/bovine-marketplace-types';

interface ListingGalleryProps {
  media: MarketplaceListingMedia[];
  title: string;
  assetType: string;
  activeMediaIdx: number;
  setActiveMediaIdx: (idx: number) => void;
}

export function ListingGallery({
  media,
  title,
  assetType,
  activeMediaIdx,
  setActiveMediaIdx,
}: ListingGalleryProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
      <div className="relative h-96 bg-stone-900">
        {media[activeMediaIdx]?.url ? (
          <img
            src={media[activeMediaIdx].url}
            alt={title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-600 font-mono text-sm">
            {assetType}
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-white font-medium">
          {media[activeMediaIdx]?.title || 'Visual Media'}
        </div>
      </div>

      {media.length > 1 && (
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-3 overflow-x-auto">
          {media.map((med, idx) => (
            <button
              key={med.id}
              onClick={() => setActiveMediaIdx(idx)}
              className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                activeMediaIdx === idx ? 'border-emerald-800 scale-105' : 'border-stone-200 opacity-70'
              }`}
            >
              <img src={med.url} alt={med.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
