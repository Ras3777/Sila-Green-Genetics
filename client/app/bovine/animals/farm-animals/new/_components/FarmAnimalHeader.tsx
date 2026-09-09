'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers } from 'lucide-react';

export function FarmAnimalHeader() {
  return (
    <div className="flex items-center space-x-3 pb-4 border-b border-stone-200">
      <Link
        href="/bovine/animals/farm-animals"
        className="p-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4" />
      </Link>
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
          <Layers className="w-3.5 h-3.5" />
          <span>Farm Livestock Registration Form</span>
        </div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Register Farm / Herd Animal</h1>
      </div>
    </div>
  );
}
