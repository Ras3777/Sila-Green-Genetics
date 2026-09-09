'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export function BreedingNotFoundState() {
  return (
    <div className="p-8 text-center text-stone-500">
      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-stone-300" />
      <h2 className="text-lg font-bold text-stone-900">Breeding Stock Not Found</h2>
      <p className="text-xs text-stone-500 mt-1">The requested breeding animal record does not exist.</p>
      <Link
        href="/bovine/animals/breeding-stock"
        className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
      >
        Return to Breeding Directory
      </Link>
    </div>
  );
}
