'use client';

import React from 'react';

export function ListingGeneticsTab() {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-mono uppercase text-stone-700">Official EPD Evaluation</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="text-[10px] text-stone-700">Calving Ease (CED)</div>
          <div className="text-base font-bold text-stone-900 mt-0.5">+12</div>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="text-[10px] text-stone-700">Birth Weight (BW)</div>
          <div className="text-base font-bold text-stone-900 mt-0.5">-1.4</div>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="text-[10px] text-stone-700">Weaning Weight (WW)</div>
          <div className="text-base font-bold text-stone-900 mt-0.5">+78 lbs</div>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="text-[10px] text-stone-700">Marbling Score (MARB)</div>
          <div className="text-base font-bold text-stone-900 mt-0.5">+1.15</div>
        </div>
      </div>
    </div>
  );
}
