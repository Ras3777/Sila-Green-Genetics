'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRightLeft,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Dna,
  Check,
  Activity,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';
import { Animal } from '@/lib/bovine-types';

interface AnimalListingBioHeaderProps {
  listing: MarketplaceListing;
  animal: Animal | null | undefined;
  isSaved: boolean;
  isCompared: boolean;
  toggleSaveListing: (id: string) => void;
  toggleCompareListing: (id: string) => void;
}

export function AnimalListingBioHeader({
  listing,
  animal,
  isSaved,
  isCompared,
  toggleSaveListing,
  toggleCompareListing,
}: AnimalListingBioHeaderProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-lg">
              {listing.listingType.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-stone-100 text-stone-700 rounded-lg">
              {animal?.sex === 'MALE' ? 'Breeding Bull / Sire' : 'Breeding Cow / Donor'}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono text-stone-700 bg-stone-50 border border-stone-200 rounded-lg">
              {animal?.breed || 'Purebred Angus'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {listing.title}
          </h1>
          <div className="text-sm text-stone-600 font-mono mt-1 flex flex-wrap items-center gap-3">
            <span>Tag: <strong className="text-stone-900">{animal?.identifiers?.[0]?.value || 'TAG-601'}</strong></span>
            <span>•</span>
            <span>Reg #: <strong className="text-stone-900">AAA +19844201</strong></span>
            <span>•</span>
            <span>DOB: <strong className="text-stone-900">{animal?.birthDate || '2022-03-15'}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleCompareListing(listing.id)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isCompared
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
            }`}
            title={isCompared ? 'In Compare List' : 'Add to Compare'}
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => toggleSaveListing(listing.id)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
            }`}
            title={isSaved ? 'Saved' : 'Save Animal'}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Verified Trust Badges */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-950">
        <span className="font-mono uppercase font-bold text-emerald-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> System Trust Badges:
        </span>
        {listing.trustBadges.parentageDnaVerified && (
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> DNA Parentage Verified
          </span>
        )}
        {listing.trustBadges.genotyped && (
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
            <Dna className="w-3.5 h-3.5 text-blue-600" /> 100K HD Genotyped
          </span>
        )}
        {listing.trustBadges.carrierFreeStatus && (
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-800" /> Carrier Free (AM, NH, CA, DD)
          </span>
        )}
        {listing.trustBadges.healthClearanceCurrent && (
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-emerald-800" /> BSE &amp; Health Current
          </span>
        )}
        <Link
          href={`/verify?id=${listing.animalId || listing.id}&from=marketplace`}
          target="_blank"
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-3 py-1 rounded-lg shadow-2xs hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold"
        >
          <QrCode className="w-3.5 h-3.5 text-emerald-300" />
          <span>Public Digital Twin</span>
          <ExternalLink className="w-3 h-3 text-emerald-200" />
        </Link>
      </div>

      {/* Description & Marketing Highlights */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase text-stone-700">Breeder Remarks &amp; Highlights</h3>
        <p className="text-sm text-stone-700 leading-relaxed">{listing.description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
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
