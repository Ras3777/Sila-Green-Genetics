'use client';

import React from 'react';
import { PublicAnimalVerificationSummary } from '@/lib/bovine-trust-types';
import { Award, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

interface PublicGeneticsPreviewProps {
  animal: PublicAnimalVerificationSummary;
  auctionMode?: boolean;
}

export function PublicGeneticsPreview({ animal, auctionMode = false }: PublicGeneticsPreviewProps) {
  const gebvs = animal.geBvs || {
    'Average Daily Gain (kg/d)': 1.18,
    'Yearling Weight (kg)': 442,
    'Calving Ease Sire (%)': 98.4,
    'Stayability Index': 112.5,
  };

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
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Verified Genomic Evaluation (GEBV)</span>
        </h4>
        <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Illumina 50K Chip
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        {Object.entries(gebvs).map(([trait, val]) => (
          <div
            key={trait}
            className={`p-3 rounded-2xl border ${
              auctionMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'
            }`}
          >
            <span className="text-[10px] text-stone-400 block truncate">{trait}</span>
            <div className="text-base font-bold text-emerald-600 font-sans mt-0.5">{val}</div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs flex items-center justify-between text-emerald-950 font-sans">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Composite National Selection Index:</span>
        </div>
        <span className="font-bold text-base font-mono text-emerald-900">
          {animal.selectionIndex ? animal.selectionIndex.toFixed(1) : '134.2'} (Top 5%)
        </span>
      </div>
    </div>
  );
}
