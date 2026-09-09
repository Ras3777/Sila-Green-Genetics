'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRightLeft,
  Heart,
  Building,
  MapPin,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';
import { Animal } from '@/lib/bovine-types';

interface LiveAnimalsCardProps {
  listing: MarketplaceListing;
  animal: Animal | null;
  isSaved: boolean;
  isCompared: boolean;
  onToggleCompare: () => void;
  onToggleSave: () => void;
  onOpenFitModal: () => void;
}

export function LiveAnimalsCard({
  listing,
  animal,
  isSaved,
  isCompared,
  onToggleCompare,
  onToggleSave,
  onOpenFitModal,
}: LiveAnimalsCardProps) {
  const selectionIndex = animal?.geneticProfile?.selectionIndex;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group">
      {/* Card Image Header */}
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        {listing.media[0]?.url ? (
          <img
            src={listing.media[0].url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-600 font-mono text-xs">
            No Media Available
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white/95 text-stone-800 rounded-md shadow-sm backdrop-blur-sm">
            {listing.listingType.replace('_', ' ')}
          </span>
          {animal?.sex && (
            <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-stone-900/80 text-white rounded-md backdrop-blur-sm">
              {animal.sex === 'MALE' ? 'Bull / Sire' : 'Cow / Donor'}
            </span>
          )}
        </div>

        {/* Save & Compare Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={onToggleCompare}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
              isCompared
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleSave}
            title={isSaved ? 'Remove from saved' : 'Save to favorites'}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
              isSaved
                ? 'bg-red-500 text-white shadow-sm'
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom overlay with Farm & Region */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white/90 bg-stone-900/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
          <span className="flex items-center gap-1 truncate">
            <Building className="w-3.5 h-3.5" />
            {listing.sellerOrgName}
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5" />
            {listing.region}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/bovine/marketplace/animals/${listing.id}`}
                className="font-bold text-base text-stone-900 hover:text-emerald-800 line-clamp-1 transition-colors"
              >
                {listing.title}
              </Link>
              <div className="text-xs text-stone-700 font-mono mt-0.5">
                {animal?.identifiers?.[0]?.value || 'TAG-UNSPECIFIED'} • {animal?.breed || 'Purebred'}
              </div>
            </div>
            {selectionIndex && (
              <div className="text-right">
                <div className="text-xs font-mono text-stone-700 uppercase">Index ($B)</div>
                <div className="text-sm font-bold font-mono text-emerald-800">+{selectionIndex}</div>
              </div>
            )}
          </div>

          {/* Highlights pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {listing.highlights.slice(0, 2).map((h, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-medium">
                {h}
              </span>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
            {listing.trustBadges?.parentageDnaVerified && (
              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> DNA Parentage
              </span>
            )}
            {listing.trustBadges?.genotyped && (
              <span className="flex items-center gap-1 text-stone-700 font-medium">
                <Activity className="w-3.5 h-3.5 text-blue-600" /> Genotyped
              </span>
            )}
            {listing.trustBadges?.carrierFreeStatus && (
              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Carrier-Free
              </span>
            )}
          </div>
        </div>

        {/* Price and Action Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-stone-700 uppercase">Asking Price</div>
            <div className="text-lg font-bold font-mono text-stone-900">
              ${listing.askingPrice.toLocaleString()}{' '}
              <span className="text-xs text-stone-700 font-normal">{listing.currency}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {listing.animalId && (
              <button
                onClick={onOpenFitModal}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Herd Fit
              </button>
            )}
            <Link
              href={`/bovine/marketplace/animals/${listing.id}`}
              className="px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
