'use client';

import React from 'react';
import { FileCheck2 } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface StepReproReviewProps {
  selectedCow?: Animal;
  recipientDgr: string;
  bullPlaceholder: string;
  procedureType: 'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER';
  donorCowPlaceholder: string;
  embryoCode: string;
  procedureDate: string;
  technician: string;
  expectedCalvingDate: string;
}

export function StepReproReview({
  selectedCow,
  recipientDgr,
  bullPlaceholder,
  procedureType,
  donorCowPlaceholder,
  embryoCode,
  procedureDate,
  technician,
  expectedCalvingDate,
}: StepReproReviewProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-6">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <FileCheck2 className="w-5 h-5 text-emerald-700" />
        <span>Step 7: Review &amp; Schedule Pregnancy Audits</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Recipient Cow</span>
          <div className="font-bold text-sm text-stone-900">{selectedCow?.name}</div>
          <div className="text-stone-500 font-mono">
            Tag: {selectedCow?.primaryIdentifier || selectedCow?.internalId} • DGR: {recipientDgr}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Service Genetics</span>
          <div className="font-bold text-sm text-stone-900">
            Sire: {bullPlaceholder || 'Selected Bull'}
          </div>
          {procedureType === 'EMBRYO_TRANSFER' && (
            <div className="text-amber-800 font-medium">
              Donor: {donorCowPlaceholder || 'Donor Dam'} • Embryo: {embryoCode}
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Procedure &amp; Date</span>
          <div className="font-bold text-stone-900">{procedureType}</div>
          <div className="text-stone-500 font-mono">Date: {procedureDate} • Inseminator: {technician}</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
          <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Expected Calving Date</span>
          <div className="font-bold font-mono text-base text-emerald-900">{expectedCalvingDate}</div>
          <div className="text-emerald-700 text-[11px]">Calculated 283-day gestation schedule</div>
        </div>
      </div>
    </div>
  );
}
