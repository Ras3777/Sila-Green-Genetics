'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function BreedingHealthTab() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-700" />
        <span>Biosecurity Clearances &amp; Health Tests</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Bovine TB (Tuberculosis)</span>
          <span className="font-bold text-sm text-emerald-900">Negative / Clean</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Tested: 2026-01-10</span>
        </div>
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Brucellosis</span>
          <span className="font-bold text-sm text-emerald-900">Official Vaccinate (OVS)</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Strain 19 Cleared</span>
        </div>
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">BVD-PI (Ear Notch)</span>
          <span className="font-bold text-sm text-emerald-900">Persistent Infection Free</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Antigen Capture ELISA</span>
        </div>
      </div>
    </div>
  );
}
