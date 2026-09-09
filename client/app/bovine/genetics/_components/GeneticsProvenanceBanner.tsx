'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, TestTube2, Activity, GitBranch, ArrowRight } from 'lucide-react';

interface GeneticsProvenanceBannerProps {
  onOpenSampleModal: () => void;
  onOpenPhenotypeModal: () => void;
}

export function GeneticsProvenanceBanner({
  onOpenSampleModal,
  onOpenPhenotypeModal,
}: GeneticsProvenanceBannerProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 rounded-2xl p-6 text-white border border-emerald-900/50 shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700/60">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>Bovine Information Architecture Standard</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Genomic Architecture: Provenance Before Interpretation
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            In bovine breeding science, estimates (GEBV/EPD) are only valid within their specific evaluation base, methodology, and contemporary cohort. All observations and genetic conditions differentiate laboratory-certified results from pedigree inference.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-quick-sample"
            onClick={onOpenSampleModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <TestTube2 className="w-4 h-4" />
            <span>Register Sample</span>
          </button>
          <button
            id="btn-quick-phenotype"
            onClick={onOpenPhenotypeModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Log Phenotype</span>
          </button>
          <Link
            href="/bovine/genetics/pedigree"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <GitBranch className="w-4 h-4" />
            <span>Pedigree Explorer</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
