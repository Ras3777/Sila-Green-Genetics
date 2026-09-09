'use client';

import React from 'react';

interface LiveAnimalsControlBarProps {
  listingCount: number;
  sortBy: 'featured' | 'priceAsc' | 'priceDesc' | 'indexDesc' | 'newest';
  setSortBy: (sort: 'featured' | 'priceAsc' | 'priceDesc' | 'indexDesc' | 'newest') => void;
}

export function LiveAnimalsControlBar({
  listingCount,
  sortBy,
  setSortBy,
}: LiveAnimalsControlBarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <div className="text-sm text-stone-600 font-mono">
        Showing <span className="font-bold text-stone-900">{listingCount}</span> live animals available
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-stone-700 text-xs font-mono uppercase">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="featured">Featured / Recommended</option>
            <option value="indexDesc">Highest Selection Index ($B)</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="newest">Recently Listed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
