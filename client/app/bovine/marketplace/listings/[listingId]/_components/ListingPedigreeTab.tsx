'use client';

import React from 'react';

export function ListingPedigreeTab() {
  return (
    <div className="space-y-4 text-xs font-mono">
      <h4 className="text-xs uppercase text-stone-700">Pedigree Ancestry Lineage</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="text-[10px] text-stone-700 uppercase">Sire</div>
          <div className="font-bold text-stone-900 mt-1">GAR Sure Fire 6432</div>
          <div className="text-stone-700 text-[11px]">AAA +18652033</div>
        </div>
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="text-[10px] text-stone-700 uppercase">Dam</div>
          <div className="font-bold text-stone-900 mt-1">Highland Blackcap 8912</div>
          <div className="text-stone-700 text-[11px]">AAA +19200451</div>
        </div>
      </div>
    </div>
  );
}
