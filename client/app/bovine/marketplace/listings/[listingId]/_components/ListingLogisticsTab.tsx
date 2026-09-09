'use client';

import React from 'react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';

interface ListingLogisticsTabProps {
  logistics: MarketplaceListing['logistics'];
}

export function ListingLogisticsTab({ logistics }: ListingLogisticsTabProps) {
  return (
    <div className="space-y-3 text-xs">
      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
        <div className="font-bold text-stone-900 text-sm">Transport &amp; Fulfillment</div>
        <div className="text-stone-700 mt-1">
          Transport arrangement: <strong>{logistics.transportArrangedBy}</strong>
        </div>
        <div className="text-stone-700 mt-0.5">
          Delivery radius: <strong>{logistics.deliveryRadiusKm || 300} km</strong>
        </div>
        {logistics.notes && (
          <p className="mt-2 text-stone-700 italic">{logistics.notes}</p>
        )}
      </div>
    </div>
  );
}
