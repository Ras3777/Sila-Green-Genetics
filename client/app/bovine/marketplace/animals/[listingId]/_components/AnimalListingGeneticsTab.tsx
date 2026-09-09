'use client';

import React from 'react';
import { Animal } from '@/lib/bovine-types';

interface AnimalListingGeneticsTabProps {
  animal: Animal | null | undefined;
}

export function AnimalListingGeneticsTab({ animal }: AnimalListingGeneticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
        <div>
          <div className="text-xs font-mono uppercase text-stone-700">Official Economic Index ($B)</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-800">
            +{animal?.geneticProfile?.selectionIndex || 172}
          </div>
        </div>
        <div className="text-right text-xs font-mono text-stone-700">
          <div>Evaluation Run: <strong>Fall 2024 National Cattle Evaluation</strong></div>
          <div>Genomic Method: <strong>Single-Step GBLUP</strong></div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-mono uppercase text-stone-700 mb-3">Expected Progeny Differences (EPDs)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { trait: 'Calving Ease (CED)', val: '+12', acc: '0.84', pct: 'Top 10%' },
            { trait: 'Birth Weight (BW)', val: '-1.4', acc: '0.91', pct: 'Top 5%' },
            { trait: 'Weaning Weight (WW)', val: '+78', acc: '0.88', pct: 'Top 15%' },
            { trait: 'Yearling Weight (YW)', val: '+138', acc: '0.86', pct: 'Top 10%' },
            { trait: 'Marbling (MARB)', val: '+1.15', acc: '0.82', pct: 'Top 3%' },
            { trait: 'Ribeye Area (REA)', val: '+0.88', acc: '0.81', pct: 'Top 15%' },
            { trait: 'Maternal Milk (MILK)', val: '+28', acc: '0.79', pct: 'Top 25%' },
            { trait: 'Docility (DOC)', val: '+24', acc: '0.75', pct: 'Top 15%' },
          ].map((epd, idx) => (
            <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="text-[11px] text-stone-700 font-medium truncate">{epd.trait}</div>
              <div className="text-base font-bold font-mono text-stone-900 mt-1">{epd.val}</div>
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-700 mt-1">
                <span>Acc: {epd.acc}</span>
                <span className="text-emerald-800 font-semibold">{epd.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100">
        <h4 className="text-xs font-mono uppercase text-stone-700 mb-2">Genetic Defects &amp; Conditions</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
            Arthrogryposis (AM): <strong>Free</strong>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
            Neuropathic Hydrocephalus (NH): <strong>Free</strong>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
            Contractural Arachnodactyly (CA): <strong>Free</strong>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
            Developmental Duplications (DD): <strong>Free</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
