'use client';

import React from 'react';
import Link from 'next/link';

export function AnimalListingNotFound() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] p-12 text-center">
      <h2 className="text-xl font-bold text-stone-900">Listing Not Found</h2>
      <p className="text-sm text-stone-600 mt-2">The animal listing requested does not exist or has been removed.</p>
      <Link
        href="/bovine/marketplace/animals"
        className="mt-4 inline-block px-4 py-2 bg-emerald-800 text-white text-sm font-medium rounded-xl"
      >
        Return to Animal Catalog
      </Link>
    </div>
  );
}
