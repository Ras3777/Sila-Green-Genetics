'use client';

import React from 'react';
import {
  Award,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { MarketplaceListing, HerdFitAnalysis } from '@/lib/bovine-marketplace-types';

interface AnimalListingCommercialSidebarProps {
  listing: MarketplaceListing;
  herdFit: HerdFitAnalysis | null;
  onOpenReserveModal: () => void;
  onOpenOfferModal: () => void;
  onOpenInquiryModal: () => void;
}

export function AnimalListingCommercialSidebar({
  listing,
  herdFit,
  onOpenReserveModal,
  onOpenOfferModal,
  onOpenInquiryModal,
}: AnimalListingCommercialSidebarProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 sticky top-6">
      <div>
        <div className="text-xs font-mono text-stone-700 uppercase">Commercial Asking Price</div>
        <div className="text-3xl font-extrabold font-mono text-stone-900 mt-1">
          ${listing.askingPrice.toLocaleString()} <span className="text-sm font-normal text-stone-700">{listing.currency}</span>
        </div>
        {listing.priceNegotiable && (
          <div className="text-xs text-emerald-800 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Open to commercial offers &amp; negotiations
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={onOpenReserveModal}
          className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <Award className="w-4 h-4" /> Reserve Animal (14-Day Hold)
        </button>

        {listing.priceNegotiable && (
          <button
            onClick={onOpenOfferModal}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-emerald-800" /> Make Commercial Offer
          </button>
        )}

        <button
          onClick={onOpenInquiryModal}
          className="w-full py-2.5 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" /> Contact Breeder / Inquire
        </button>
      </div>

      {/* Herd Fit Score Widget */}
      {herdFit && (
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-700 uppercase">
            <span>Herd Compatibility</span>
            <span className="text-emerald-800 font-bold">{herdFit.overallCompatibilityScore}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-800 h-full rounded-full transition-all duration-500"
              style={{ width: `${herdFit.overallCompatibilityScore}%` }}
            />
          </div>
          <div className="text-[11px] text-stone-600 flex items-center justify-between">
            <span>Inbreeding: {(herdFit.expectedInbreedingAvg * 100).toFixed(1)}%</span>
            <span className="text-emerald-800 font-semibold">{herdFit.inbreedingRiskTier} RISK</span>
          </div>
        </div>
      )}

      {/* Seller Information */}
      <div className="pt-4 border-t border-stone-100 space-y-3">
        <div className="text-xs font-mono text-stone-700 uppercase">Breeder &amp; Farm</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold font-mono text-sm">
            {listing.sellerOrgName.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              {listing.sellerOrgName}
              {listing.sellerVerified && <CheckCircle2 className="w-4 h-4 text-emerald-800" />}
            </div>
            <div className="text-xs text-stone-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {listing.region}
            </div>
          </div>
        </div>
      </div>

      {/* Listing Metadata */}
      <div className="pt-4 border-t border-stone-100 space-y-1 text-xs text-stone-600 font-mono">
        <div>Listing ID: <strong>{listing.id}</strong></div>
        <div>Published: <strong>{listing.publishedAt || '2025-01-15'}</strong></div>
        <div>Views: <strong>{listing.viewCount}</strong> • Saves: <strong>{listing.saveCount}</strong></div>
      </div>
    </div>
  );
}
