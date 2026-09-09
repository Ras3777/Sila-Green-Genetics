'use client';

import React from 'react';
import { History } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface BreedingAuditTabProps {
  animal: Animal;
}

export function BreedingAuditTab({ animal }: BreedingAuditTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <History className="w-4 h-4 text-emerald-700" />
        <span>Breeding Stock Certification &amp; Promotion Audit</span>
      </h3>

      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-stone-900">Promoted to Breeding Stock</span>
            <p className="text-stone-500 text-[11px]">Qualified through Phenotypic &amp; Pedigree Review Board</p>
          </div>
          <span className="font-mono text-stone-400">2026-02-01</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-stone-900">GGP HD 100K Genomic Panel Run</span>
            <p className="text-stone-500 text-[11px]">Laboratory: Neogen GeneSeek • Call Rate: 99.4%</p>
          </div>
          <span className="font-mono text-stone-400">2026-01-15</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-stone-900">Original Birth Registration</span>
            <p className="text-stone-500 text-[11px]">Created as Canonical Animal Record #{animal.id}</p>
          </div>
          <span className="font-mono text-stone-400">2025-03-12</span>
        </div>
      </div>
    </div>
  );
}
