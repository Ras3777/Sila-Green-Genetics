'use client';

import React from 'react';
import { Award, DollarSign, ShieldCheck, MessageSquare } from 'lucide-react';
import { MarketplaceListing, HerdFitAnalysis } from '@/lib/bovine-marketplace-types';

interface ListingCommercialSidebarProps {
  listing: MarketplaceListing;
  herdFit: HerdFitAnalysis | null;
  onOpenReserve: () => void;
  onOpenOffer: () => void;
  onOpenInspection: () => void;
  onOpenInquiry: () => void;
}

export function ListingCommercialSidebar({
  listing,
  herdFit,
  onOpenReserve,
  onOpenOffer,
  onOpenInspection,
  onOpenInquiry,
}: ListingCommercialSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 sticky top-6">
        <div>
          <div className="text-xs font-mono text-stone-700 uppercase">Asking Price</div>
          <div className="text-3xl font-extrabold font-mono text-stone-900 mt-1">
            ${listing.askingPrice.toLocaleString()} <span className="text-xs font-normal text-stone-700">{listing.currency}</span>
          </div>
          {listing.priceNegotiable && (
            <div className="text-xs text-emerald-800 font-medium mt-1">
              ✓ Open to commercial negotiation
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onOpenReserve}
            className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Award className="w-4 h-4" /> Reserve Asset
          </button>

          {listing.priceNegotiable && (
            <button
              onClick={onOpenOffer}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-emerald-800" /> Make Offer
            </button>
          )}

          <button
            onClick={onOpenInspection}
            className="w-full py-2.5 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-800" /> Request Inspection
          </button>

          <button
            onClick={onOpenInquiry}
            className="w-full py-2 px-3 text-xs text-stone-600 hover:text-stone-900 hover:underline flex items-center justify-center gap-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Send Commercial Inquiry
          </button>
        </div>

        {/* Herd Fit score */}
        {herdFit && (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-stone-700 uppercase">
              <span>Herd Compatibility</span>
              <span className="text-emerald-800 font-bold">{herdFit.overallCompatibilityScore}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div className="bg-emerald-800 h-full rounded-full" style={{ width: `${herdFit.overallCompatibilityScore}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
