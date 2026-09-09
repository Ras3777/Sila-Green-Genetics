'use client';

import React from 'react';
import { Tag } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface BreedingIdentityTabProps {
  animal: Animal;
}

export function BreedingIdentityTab({ animal }: BreedingIdentityTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-700" />
          <span>Registered Identifiers &amp; Electronic Tags</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">DGR Number</span>
          <span className="text-base font-bold font-mono text-stone-900">{animal.dgr || 'DGR-BR-9904'}</span>
          <span className="block text-[10px] text-stone-500 mt-1">Official Breeder Registry Identity</span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Visual Ear Tag</span>
          <span className="text-base font-bold font-mono text-stone-900">{animal.primaryIdentifier || animal.internalId}</span>
          <span className="block text-[10px] text-stone-500 mt-1">Primary ranch management tag</span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Electronic RFID</span>
          <span className="text-base font-bold font-mono text-stone-900">982 000 128 473 992</span>
          <span className="block text-[10px] text-stone-500 mt-1">ISO 11784/11785 FDX-B Bolus</span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Breed Association Registry</span>
          <span className="text-base font-bold font-mono text-stone-900">{animal.registrationNumber || 'AAA #20491823'}</span>
          <span className="block text-[10px] text-stone-500 mt-1">Certified Stud Book Volume 84</span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">DNA Barcode Asset</span>
          <span className="text-base font-bold font-mono text-emerald-800">GEN-2026-X9921</span>
          <span className="block text-[10px] text-stone-500 mt-1">Neogen GeneSeek Sample Identifier</span>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Ranch Brand &amp; Tattoo</span>
          <span className="text-base font-bold font-mono text-stone-900">Right Hip / Ear Tattoo #492</span>
          <span className="block text-[10px] text-stone-500 mt-1">Permanent hot-iron branding verified</span>
        </div>
      </div>
    </div>
  );
}
