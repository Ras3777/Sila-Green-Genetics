'use client';

import React from 'react';
import Link from 'next/link';

export function CalvingBreadcrumb() {
  return (
    <div className="flex items-center space-x-2 text-xs text-stone-500">
      <Link href="/bovine/reproduction" className="hover:text-emerald-800">
        Reproduction &amp; AI
      </Link>
      <span>/</span>
      <Link href="/bovine/reproduction/calvings" className="hover:text-emerald-800">
        Calvings
      </Link>
      <span>/</span>
      <span className="font-semibold text-stone-900">New Calving Registration</span>
    </div>
  );
}
