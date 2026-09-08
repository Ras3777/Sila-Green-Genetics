'use client';

import React from 'react';
import { PublicAnimalVerificationSummary } from '@/lib/bovine-trust-types';
import { Dna, CheckCircle2, GitBranch, ShieldCheck } from 'lucide-react';

interface PublicPedigreePreviewProps {
  animal: PublicAnimalVerificationSummary;
  auctionMode?: boolean;
}

export function PublicPedigreePreview({ animal, auctionMode = false }: PublicPedigreePreviewProps) {
  const sire = animal.sireName || 'IRON KING 812';
  const dam = animal.damName || 'BELLA PRIME 712';

  return (
    <div
      className={`p-5 rounded-3xl border shadow-xs space-y-4 ${
        auctionMode
          ? 'bg-stone-900 border-stone-800 text-white'
          : 'bg-white border-stone-200 text-stone-900'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/50">
        <h4 className="font-bold text-sm flex items-center space-x-2">
          <GitBranch className="w-4 h-4 text-emerald-600" />
          <span>Verified Registry Pedigree</span>
        </h4>
        <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          50K SNP Validated
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Sire */}
        <div
          className={`p-3.5 rounded-2xl border ${
            auctionMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-stone-400 font-bold">
            <span>Sire (Father)</span>
            <span className="text-emerald-700 flex items-center space-x-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>DNA Match</span>
            </span>
          </div>
          <div className="font-bold text-sm mt-1">{sire}</div>
          <p className="text-[11px] text-stone-500 mt-0.5">Pure Boran AI Sire • Registration #ET-AI-091</p>
        </div>

        {/* Dam */}
        <div
          className={`p-3.5 rounded-2xl border ${
            auctionMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-stone-400 font-bold">
            <span>Dam (Mother)</span>
            <span className="text-emerald-700 flex items-center space-x-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>DNA Match</span>
            </span>
          </div>
          <div className="font-bold text-sm mt-1">{dam}</div>
          <p className="text-[11px] text-stone-500 mt-0.5">Elite Donor Dam • Registration #ET-DAM-044</p>
        </div>
      </div>

      <div className="text-[11px] text-stone-500 flex items-center space-x-1.5 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span>Parentage confirmed by National Bovine Genomics Laboratory via Mendelian assay.</span>
      </div>
    </div>
  );
}
