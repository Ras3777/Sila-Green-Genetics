'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';
import { MarketplaceListingType } from '@/lib/bovine-marketplace-types';

interface StepCommercialTermsProps {
  listingType: MarketplaceListingType;
  setListingType: (type: MarketplaceListingType) => void;
  askingPrice: number;
  setAskingPrice: (p: number) => void;
  minimumPrice: number;
  setMinimumPrice: (p: number) => void;
  priceNegotiable: boolean;
  setPriceNegotiable: (neg: boolean) => void;
}

export function StepCommercialTerms({
  listingType,
  setListingType,
  askingPrice,
  setAskingPrice,
  minimumPrice,
  setMinimumPrice,
  priceNegotiable,
  setPriceNegotiable,
}: StepCommercialTermsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-stone-900">Commercial Pricing & Terms</h3>
        <p className="text-xs text-stone-600">Define asking price, negotiation terms, and minimum acceptable bid.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Pricing Model</label>
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="NEGOTIABLE">Negotiable (Offers Accepted)</option>
            <option value="FIXED_PRICE">Fixed Price (Buy Now Only)</option>
            <option value="PRIVATE_TREATY">Private Treaty</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
            Asking Price ($ USD)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-stone-600" />
            <input
              type="number"
              value={askingPrice}
              onChange={(e) => setAskingPrice(Number(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
            Minimum Acceptable Offer ($ USD)
          </label>
          <input
            type="number"
            value={minimumPrice}
            onChange={(e) => setMinimumPrice(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <span className="text-[11px] text-stone-700 mt-1 block">Offers below this will be automatically declined.</span>
        </div>

        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
            <input
              type="checkbox"
              checked={priceNegotiable}
              onChange={(e) => setPriceNegotiable(e.target.checked)}
              className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
            />
            <span>Allow counteroffers and custom buyer terms</span>
          </label>
        </div>
      </div>
    </div>
  );
}
