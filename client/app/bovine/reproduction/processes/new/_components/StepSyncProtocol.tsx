'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface StepSyncProtocolProps {
  syncProtocol: string;
  setSyncProtocol: (p: string) => void;
  syncStartDate: string;
  setSyncStartDate: (d: string) => void;
  syncDeviceRemovalDate: string;
  setSyncDeviceRemovalDate: (d: string) => void;
  syncTreatments: string;
  setSyncTreatments: (t: string) => void;
}

export function StepSyncProtocol({
  syncProtocol,
  setSyncProtocol,
  syncStartDate,
  setSyncStartDate,
  syncDeviceRemovalDate,
  setSyncDeviceRemovalDate,
  syncTreatments,
  setSyncTreatments,
}: StepSyncProtocolProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-emerald-700" />
        <span>Step 5: Estrus Synchronization Protocol</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Synchronization Protocol Name
          </label>
          <input
            type="text"
            value={syncProtocol}
            onChange={(e) => setSyncProtocol(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Device Insertion / Start Date
          </label>
          <input
            type="date"
            value={syncStartDate}
            onChange={(e) => setSyncStartDate(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            CIDR / Device Removal Date
          </label>
          <input
            type="date"
            value={syncDeviceRemovalDate}
            onChange={(e) => setSyncDeviceRemovalDate(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Administered Treatments &amp; Hormone Injections
          </label>
          <input
            type="text"
            value={syncTreatments}
            onChange={(e) => setSyncTreatments(e.target.value)}
            placeholder="GnRH, PGF2a, Estradiol..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
