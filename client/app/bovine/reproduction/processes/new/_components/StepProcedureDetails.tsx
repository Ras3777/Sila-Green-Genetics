'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface StepProcedureDetailsProps {
  procedureDate: string;
  setProcedureDate: (d: string) => void;
  technician: string;
  setTechnician: (t: string) => void;
}

export function StepProcedureDetails({
  procedureDate,
  setProcedureDate,
  technician,
  setTechnician,
}: StepProcedureDetailsProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-700" />
        <span>Step 6: Insemination / Transfer Service Details</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Procedure Date *
          </label>
          <input
            type="date"
            value={procedureDate}
            onChange={(e) => setProcedureDate(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Certified Inseminator / Embryologist *
          </label>
          <input
            type="text"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          />
        </div>
      </div>
    </div>
  );
}
