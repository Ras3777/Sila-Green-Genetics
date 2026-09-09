'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface DocumentBreadcrumbProps {
  animal: Animal;
}

export function DocumentBreadcrumb({ animal }: DocumentBreadcrumbProps) {
  return (
    <div className="flex items-center space-x-2 text-xs text-stone-500">
      <Link href="/bovine/animals/breeding-stock" className="hover:text-emerald-800 flex items-center">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        <span>Breeding Stock</span>
      </Link>
      <span>/</span>
      <Link
        href={`/bovine/animals/breeding-stock/${animal.id}`}
        className="font-mono hover:text-emerald-800 text-stone-700"
      >
        {animal.name} ({animal.primaryIdentifier || animal.internalId})
      </Link>
      <span>/</span>
      <span className="font-semibold text-stone-900 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
        Official Certificates &amp; Cryptographic Trust
      </span>
    </div>
  );
}
