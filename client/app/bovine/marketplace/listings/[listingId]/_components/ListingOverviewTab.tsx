'use client';

import React from 'react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';

interface ListingOverviewTabProps {
  listing: MarketplaceListing;
}

export function ListingOverviewTab({ listing }: ListingOverviewTabProps) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-700 uppercase">Asset Type</div>
          <div className="font-bold text-stone-900 mt-1">{listing.assetType}</div>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-700 uppercase">Status</div>
          <div className="font-bold text-emerald-800 mt-1">{listing.status}</div>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-700 uppercase">Available From</div>
          <div className="font-bold text-stone-900 mt-1">{listing.availableFrom}</div>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-700 uppercase">Inquiries Received</div>
          <div className="font-bold text-stone-900 mt-1">{listing.inquiryCount}</div>
        </div>
      </div>
    </div>
  );
}
