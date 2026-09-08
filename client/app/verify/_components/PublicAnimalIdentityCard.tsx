'use client';

import React from 'react';
import { PublicAnimalVerificationSummary } from '@/lib/bovine-trust-types';
import { VerificationBadges } from '@/components/bovine/trust/VerificationBadges';
import { CheckCircle2, Award, Dna, Calendar, MapPin, Building2 } from 'lucide-react';

interface PublicAnimalIdentityCardProps {
  animal: PublicAnimalVerificationSummary;
  auctionMode?: boolean;
}

export function PublicAnimalIdentityCard({ animal, auctionMode = false }: PublicAnimalIdentityCardProps) {
  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 transition-all ${
        auctionMode
          ? 'bg-stone-900 border-stone-800 text-white'
          : 'bg-white border-stone-200 text-stone-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={animal.photoUrl}
            alt={animal.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-200/50 shadow-md shrink-0"
          />

          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                Ear Tag: {animal.earTag}
              </span>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-800">
                DGR: {animal.dgr}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight">{animal.name}</h3>
            <p className={`text-xs mt-0.5 ${auctionMode ? 'text-stone-300' : 'text-stone-600'}`}>
              {animal.breed} • {animal.sex}
            </p>
          </div>
        </div>

        {animal.farmName && (
          <div className="text-right sm:border-l sm:border-stone-200/40 sm:pl-4 text-xs">
            <span className="text-stone-400 text-[10px] font-mono uppercase block">Origin Facility</span>
            <span className="font-semibold block">{animal.farmName}</span>
            {animal.sellerName && (
              <span className="text-[11px] text-stone-400 block mt-0.5">{animal.sellerName}</span>
            )}
          </div>
        )}
      </div>

      {/* Morphological Identity Attributes (Critical for physical tag matching) */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl text-xs font-mono ${
          auctionMode ? 'bg-stone-800/80 border border-stone-700' : 'bg-stone-50 border border-stone-200/80'
        }`}
      >
        <div>
          <span className="text-stone-400 text-[10px] uppercase block">Birth Date</span>
          <span className="font-bold">{animal.birthDate}</span>
        </div>
        <div>
          <span className="text-stone-400 text-[10px] uppercase block">National RFID</span>
          <span className="font-bold">{animal.rfid || '982-0000-029382'}</span>
        </div>
        <div>
          <span className="text-stone-400 text-[10px] uppercase block">Selection Index</span>
          <span className="font-bold text-emerald-600 font-sans">
            {animal.selectionIndex ? animal.selectionIndex.toFixed(1) : '134.2'}
          </span>
        </div>
        <div>
          <span className="text-stone-400 text-[10px] uppercase block">Genomic Inbreeding</span>
          <span className="font-bold text-emerald-600 font-sans">{animal.inbreedingPct || 3.8}%</span>
        </div>
      </div>

      {/* Verification Badges */}
      <div className="pt-2 border-t border-stone-200/40">
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1.5">
          Verified Registry Credentials
        </span>
        <VerificationBadges animal={animal} size="sm" />
      </div>
    </div>
  );
}
