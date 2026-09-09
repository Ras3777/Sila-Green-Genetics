'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Layers, ArrowRightLeft, Plus } from 'lucide-react';

interface LiveAnimalsHeaderProps {
  compareCount: number;
  liveAnimalCount: number;
}

export function LiveAnimalsHeader({
  compareCount,
  liveAnimalCount,
}: LiveAnimalsHeaderProps) {
  return (
    <div className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
              <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-emerald-800 font-semibold">Live Animals</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
              <Layers className="w-8 h-8 text-emerald-800" />
              Live Breeding Animals Catalog
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Verified registered breeding bulls, donors, heifers, and replacement stock backed by canonical genomic records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/bovine/marketplace/compare"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors relative"
            >
              <ArrowRightLeft className="w-4 h-4 text-emerald-800" />
              Compare Genetics
              {compareCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-mono font-bold bg-emerald-800 text-white rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link
              href="/bovine/marketplace/listings/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              List an Animal
            </Link>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto border-t border-stone-100 pt-4 text-sm font-medium">
          <Link
            href="/bovine/marketplace"
            className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
          >
            Marketplace Hub
          </Link>
          <Link
            href="/bovine/marketplace/animals"
            className="px-3 py-1.5 text-emerald-800 bg-emerald-50 rounded-lg font-semibold whitespace-nowrap"
          >
            Live Animals ({liveAnimalCount})
          </Link>
          <Link
            href="/bovine/marketplace/semen"
            className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
          >
            Semen Marketplace
          </Link>
          <Link
            href="/bovine/marketplace/embryos"
            className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
          >
            Embryo Lots
          </Link>
          <Link
            href="/bovine/marketplace/breeding-services"
            className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
          >
            Breeding Services
          </Link>
          <Link
            href="/bovine/marketplace/orders"
            className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
          >
            Orders &amp; Escrow
          </Link>
        </div>
      </div>
    </div>
  );
}
