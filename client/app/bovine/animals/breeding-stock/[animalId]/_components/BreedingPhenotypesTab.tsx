'use client';

import React from 'react';
import { Activity } from 'lucide-react';

export function BreedingPhenotypesTab() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-700" />
        <span>Carcass &amp; Conformation Phenotypic Measurements</span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Scrotal Perimeter (SP)</span>
          <span className="text-lg font-bold font-mono text-stone-900">39.5 cm</span>
          <span className="text-[10px] text-stone-500 block mt-0.5">Adj for 365 days</span>
        </div>
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Ribeye Area (REA)</span>
          <span className="text-lg font-bold font-mono text-stone-900">88.4 cm²</span>
          <span className="text-[10px] text-stone-500 block mt-0.5">Real-time ultrasound</span>
        </div>
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Subcutaneous Fat (SFT)</span>
          <span className="text-lg font-bold font-mono text-stone-900">6.8 mm</span>
          <span className="text-[10px] text-stone-500 block mt-0.5">Optimal finish layer</span>
        </div>
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Intramuscular Fat (MAR)</span>
          <span className="text-lg font-bold font-mono text-stone-900">4.8%</span>
          <span className="text-[10px] text-stone-500 block mt-0.5">USDA Choice/Prime boundary</span>
        </div>
      </div>
    </div>
  );
}
