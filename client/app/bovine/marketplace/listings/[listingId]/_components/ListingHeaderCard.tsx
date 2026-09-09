'use client';

import React from 'react';
import {
  ArrowRightLeft,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Dna,
  Check,
} from 'lucide-react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';
import { Animal } from '@/lib/bovine-types';

interface ListingHeaderCardProps {
  listing: MarketplaceListing;
  animal?: Animal | null;
  isSaved: boolean;
  isCompared: boolean;
  onToggleCompare: () => void;
  onToggleSave: () => void;
}

export function ListingHeaderCard({
  listing,
  animal,
  isSaved,
  isCompared,
  onToggleCompare,
  onToggleSave,
}: ListingHeaderCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-lg">
              {listing.assetType.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-stone-100 text-stone-700 rounded-lg">
              {listing.listingType.replace('_', ' ')}
            </span>
            {animal?.breed && (
              <span className="px-2.5 py-1 text-xs font-mono text-stone-700 bg-stone-50 border border-stone-200 rounded-lg">
                {animal.breed}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {listing.title}
          </h1>
          <div className="text-xs text-stone-600 font-mono mt-1 flex items-center gap-2">
            <span>Seller: <strong>{listing.sellerOrgName}</strong></span>
            <span>•</span>
            <span>Location: <strong>{listing.region}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCompare}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isCompared
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
            }`}
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleSave}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-950">
        <span className="font-mono uppercase font-bold text-emerald-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> System Trust Badges:
        </span>
        {listing.trustBadges?.parentageDnaVerified && (
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> DNA Parentage Verified
          </span>
        )}
        {listing.trustBadges?.genotyped && (
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
            <Dna className="w-3.5 h-3.5 text-blue-600" /> Genotyped 100K
          </span>
        )}
        {listing.trustBadges?.carrierFreeStatus && (
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
            <Check className="w-3.5 h-3.5 text-emerald-800" /> Carrier-Free
          </span>
        )}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase text-stone-700">Description &amp; Highlights</h3>
        <p className="text-sm text-stone-700 leading-relaxed">{listing.description}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {listing.highlights.map((h, i) => (
            <span key={i} className="text-xs px-3 py-1 bg-stone-100 text-stone-800 rounded-lg font-medium">
              ✓ {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
