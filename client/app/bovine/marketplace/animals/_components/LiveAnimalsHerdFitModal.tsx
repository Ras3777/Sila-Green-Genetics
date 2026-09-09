'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, X } from 'lucide-react';
import { MarketplaceListing, HerdFitAnalysis } from '@/lib/bovine-marketplace-types';
import { Herd } from '@/lib/bovine-types';

interface LiveAnimalsHerdFitModalProps {
  listing: MarketplaceListing | null;
  onClose: () => void;
  selectedTargetHerd: string;
  setSelectedTargetHerd: (herdId: string) => void;
  herds: Herd[];
  activeFitAnalysis: HerdFitAnalysis | null;
}

export function LiveAnimalsHerdFitModal({
  listing,
  onClose,
  selectedTargetHerd,
  setSelectedTargetHerd,
  herds,
  activeFitAnalysis,
}: LiveAnimalsHerdFitModalProps) {
  if (!listing || !listing.animalId || !activeFitAnalysis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Commercial Herd Compatibility</h3>
              <p className="text-xs text-stone-700">{listing.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-600 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Target Herd Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">
              Evaluate Against Target Herd
            </label>
            <select
              value={selectedTargetHerd}
              onChange={(e) => setSelectedTargetHerd(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
            >
              {herds.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.breed || 'Commercial Angus'})
                </option>
              ))}
            </select>
          </div>

          {/* Compatibility Score Circle */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-stone-700 uppercase">Herd Genetic Fit Score</div>
              <div className="text-3xl font-extrabold font-mono text-emerald-800 mt-0.5">
                {activeFitAnalysis.overallCompatibilityScore}%
              </div>
              <div className="text-xs text-stone-600 mt-1">
                Expected inbreeding coefficient $F$: {(activeFitAnalysis.expectedInbreedingAvg * 100).toFixed(1)}% (
                <span className="font-semibold text-emerald-800">{activeFitAnalysis.inbreedingRiskTier} RISK</span>)
              </div>
            </div>

            <div className="text-right space-y-1 text-xs">
              <div className="text-emerald-800 font-semibold">
                {activeFitAnalysis.breakdown.excellentMatchPct}% Excellent Mating
              </div>
              <div className="text-stone-600">{activeFitAnalysis.breakdown.acceptablePct}% Acceptable Mating</div>
              <div className="text-stone-600">{activeFitAnalysis.breakdown.avoidPct}% Avoid (Pedigree Conflict)</div>
            </div>
          </div>

          {/* Trait Complementarity Highlights */}
          <div>
            <h4 className="text-xs font-mono uppercase text-stone-700 mb-2">Key Trait Complementarity</h4>
            <div className="space-y-2">
              {activeFitAnalysis.traitComplementarity.slice(0, 3).map((trait, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-100"
                >
                  <div>
                    <span className="font-bold text-stone-900">{trait.trait}</span>
                    <div className="text-[11px] text-stone-700">
                      Herd Avg: {trait.herdAvg > 0 ? `+${trait.herdAvg}` : trait.herdAvg} → Candidate: {trait.candidateEstimate > 0 ? `+${trait.candidateEstimate}` : trait.candidateEstimate}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono font-bold ${
                        trait.impact === 'MAJOR_GAIN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {trait.impact.replace('_', ' ')}
                    </span>
                    <div className="text-[11px] text-stone-600 font-mono mt-0.5">
                      Exp. Progeny: {trait.expectedProgenyAvg > 0 ? `+${trait.expectedProgenyAvg}` : trait.expectedProgenyAvg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <Link
            href={`/bovine/marketplace/animals/${listing.id}`}
            className="text-xs text-stone-600 hover:text-stone-900 underline font-medium"
          >
            Inspect Full Genetic Evaluation
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl cursor-pointer"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
