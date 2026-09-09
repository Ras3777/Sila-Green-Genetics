'use client';

import React from 'react';
import { MarketplaceAssetType } from '@/lib/bovine-marketplace-types';

interface StepTechnicalSpecsProps {
  assetType: MarketplaceAssetType;
  semenBatch: string;
  setSemenBatch: (batch: string) => void;
  semenVault: string;
  setSemenVault: (vault: string) => void;
  semenMotility: number;
  setSemenMotility: (m: number) => void;
  semenDoses: number;
  setSemenDoses: (d: number) => void;
  embryoCode: string;
  setEmbryoCode: (c: string) => void;
  embryoQty: number;
  setEmbryoQty: (q: number) => void;
  embryoDonor: string;
  setEmbryoDonor: (d: string) => void;
  embryoSire: string;
  setEmbryoSire: (s: string) => void;
}

export function StepTechnicalSpecs({
  assetType,
  semenBatch,
  setSemenBatch,
  semenVault,
  setSemenVault,
  semenMotility,
  setSemenMotility,
  semenDoses,
  setSemenDoses,
  embryoCode,
  setEmbryoCode,
  embryoQty,
  setEmbryoQty,
  embryoDonor,
  setEmbryoDonor,
  embryoSire,
  setEmbryoSire,
}: StepTechnicalSpecsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-stone-900">Technical Specifications</h3>
        <p className="text-xs text-stone-600">Enter lot and preservation details specific to this asset category.</p>
      </div>

      {assetType === 'SEMEN' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Batch / Collection #</label>
            <input
              type="text"
              value={semenBatch}
              onChange={(e) => setSemenBatch(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Storage Cryo Vault</label>
            <input
              type="text"
              value={semenVault}
              onChange={(e) => setSemenVault(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Post-Thaw Motility (%)</label>
            <input
              type="number"
              value={semenMotility}
              onChange={(e) => setSemenMotility(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Available Straws</label>
            <input
              type="number"
              value={semenDoses}
              onChange={(e) => setSemenDoses(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>
      )}

      {assetType === 'EMBRYO' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Lot Code</label>
            <input
              type="text"
              value={embryoCode}
              onChange={(e) => setEmbryoCode(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Quantity in Lot</label>
            <input
              type="number"
              value={embryoQty}
              onChange={(e) => setEmbryoQty(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Donor Dam Name</label>
            <input
              type="text"
              value={embryoDonor}
              onChange={(e) => setEmbryoDonor(e.target.value)}
              placeholder="e.g. Highland Blackcap 8912"
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Mating Sire Name</label>
            <input
              type="text"
              value={embryoSire}
              onChange={(e) => setEmbryoSire(e.target.value)}
              placeholder="e.g. GAR Sure Fire 6432"
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>
        </div>
      )}

      {assetType === 'LIVE_ANIMAL' && (
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
          <div className="font-bold text-stone-900">Live Animal Verification Specs</div>
          <p>Physical inspection, quarantine facilities, and veterinary health clearances will be scheduled through the order stepper.</p>
        </div>
      )}
    </div>
  );
}
