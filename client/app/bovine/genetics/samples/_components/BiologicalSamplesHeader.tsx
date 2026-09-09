'use client';

import React from 'react';
import { TestTube2, Plus } from 'lucide-react';

interface BiologicalSamplesHeaderProps {
  onRegisterSample: () => void;
}

export function BiologicalSamplesHeader({ onRegisterSample }: BiologicalSamplesHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Laboratory Logistics
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-xs text-stone-500">ISO 17025 Chain of Custody</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <TestTube2 className="w-5 h-5 text-emerald-700" />
          Biological Samples &amp; Custody Tracking
        </h2>
        <p className="text-xs text-stone-600 max-w-2xl">
          Strict tracking of tissue sampling units (TSU), EDTA blood vials, and semen straws.
          Maintains permanent audit log of handlers, temperatures, barcodes, and lab statuses.
        </p>
      </div>

      <button
        onClick={onRegisterSample}
        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>Register Sample</span>
      </button>
    </div>
  );
}
