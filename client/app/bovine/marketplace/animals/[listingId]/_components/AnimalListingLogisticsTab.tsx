'use client';

import React from 'react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';

interface AnimalListingLogisticsTabProps {
  listing: MarketplaceListing;
}

export function AnimalListingLogisticsTab({ listing }: AnimalListingLogisticsTabProps) {
  return (
    <div className="space-y-5 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="text-xs font-mono text-stone-700 uppercase">Farm Dispatch Location</div>
          <div className="font-bold text-stone-900 mt-1">{listing.farmName}</div>
          <div className="text-xs text-stone-600 mt-0.5">{listing.region}</div>
        </div>
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="text-xs font-mono text-stone-700 uppercase">Transport Arrangements</div>
          <div className="font-bold text-stone-900 mt-1">
            {listing.logistics.transportArrangedBy === 'BOTH'
              ? 'Buyer Pickup or Seller Hauling Available'
              : `${listing.logistics.transportArrangedBy} Arranged`}
          </div>
          <div className="text-xs text-stone-600 mt-0.5">
            Delivery radius: up to {listing.logistics.deliveryRadiusKm || 300} km
          </div>
        </div>
      </div>
      {listing.logistics.notes && (
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="text-xs font-mono text-stone-700 uppercase mb-1">Logistics Notes</div>
          <p className="text-xs text-stone-700">{listing.logistics.notes}</p>
        </div>
      )}
    </div>
  );
}
