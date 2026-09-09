'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ListingBreadcrumbProps {
  title: string;
}

export function ListingBreadcrumb({ title }: ListingBreadcrumbProps) {
  return (
    <div className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider">
          <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/bovine/marketplace/listings" className="hover:underline">Directory</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-800 font-semibold truncate max-w-xs">{title}</span>
        </div>
      </div>
    </div>
  );
}
