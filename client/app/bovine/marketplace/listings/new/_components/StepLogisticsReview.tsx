'use client';

import React from 'react';
import { MarketplaceAssetType } from '@/lib/bovine-marketplace-types';

interface StepLogisticsReviewProps {
  transportArrangedBy: 'SELLER' | 'BUYER' | 'BOTH';
  setTransportArrangedBy: (t: 'SELLER' | 'BUYER' | 'BOTH') => void;
  deliveryRadius: number;
  setDeliveryRadius: (r: number) => void;
  title: string;
  assetType: MarketplaceAssetType;
  askingPrice: number;
}

export function StepLogisticsReview({
  transportArrangedBy,
  setTransportArrangedBy,
  deliveryRadius,
  setDeliveryRadius,
  title,
  assetType,
  askingPrice,
}: StepLogisticsReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-stone-900">Logistics & Final Review</h3>
        <p className="text-xs text-stone-600">Review all terms before publishing to the live marketplace.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Transport Arrangement</label>
          <select
            value={transportArrangedBy}
            onChange={(e) => setTransportArrangedBy(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
          >
            <option value="BOTH">Both Pickup and Delivery Available</option>
            <option value="SELLER">Seller Hauling Only</option>
            <option value="BUYER">Buyer Pickup Only</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Delivery Radius (km)</label>
          <input
            type="number"
            value={deliveryRadius}
            onChange={(e) => setDeliveryRadius(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono"
          />
        </div>
      </div>

      {/* Review Summary Card */}
      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
        <div className="text-xs font-mono uppercase text-stone-700 font-bold">Summary Preview</div>
        <div className="flex justify-between">
          <span className="text-stone-600">Title:</span>
          <span className="font-bold text-stone-900">{title || 'Registered Genetic Offering'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Asset Category:</span>
          <span className="font-mono text-emerald-800 font-bold">{assetType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Asking Price:</span>
          <span className="font-mono text-stone-900 font-bold">${askingPrice.toLocaleString()} USD</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Seller Organization:</span>
          <span className="font-semibold text-stone-900">Highland Cattle Co.</span>
        </div>
      </div>
    </div>
  );
}
