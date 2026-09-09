'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Dna, FileSpreadsheet } from 'lucide-react';

interface VerifyParentageModalProps {
  isOpen: boolean;
  onClose: () => void;
  animalName?: string;
  onVerify: (method: 'DNA_CONFIRMED' | 'GENOMIC_INFERRED' | 'RECORD_ONLY') => void;
}

export function VerifyParentageModal({
  isOpen,
  onClose,
  animalName,
  onVerify,
}: VerifyParentageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-stone-900">Verify Parentage Pedigree</h3>
        </div>

        <p className="text-xs text-stone-600">
          Select verification standard for <strong>{animalName}</strong>.
          DNA confirmation requires a passing assay with zero mendelian exclusions.
        </p>

        <div className="space-y-2.5 text-xs">
          <button
            onClick={() => onVerify('DNA_CONFIRMED')}
            className="w-full text-left p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70 transition-colors cursor-pointer space-y-0.5"
          >
            <div className="font-bold text-emerald-950 flex items-center justify-between">
              <span>DNA Confirmed (ISAG / ICAR SNP Assay)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-[11px] text-emerald-800">
              Backed by Illumina 100K BeadChip or ISAG parentage panel with &gt; 200 SNPs.
            </div>
          </button>

          <button
            onClick={() => onVerify('GENOMIC_INFERRED')}
            className="w-full text-left p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer space-y-0.5"
          >
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>Genomic Inferred (Haplotype Prediction)</span>
              <Dna className="w-4 h-4 text-stone-600" />
            </div>
            <div className="text-[11px] text-stone-600">
              Pedigree reconstructed via single-step GBLUP relationship matrix.
            </div>
          </button>

          <button
            onClick={() => onVerify('RECORD_ONLY')}
            className="w-full text-left p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer space-y-0.5"
          >
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>Record Only (Breeding Slip / Pasture Log)</span>
              <FileSpreadsheet className="w-4 h-4 text-stone-600" />
            </div>
            <div className="text-[11px] text-stone-600">
              Mating recorded on paper log; no genetic confirmation available.
            </div>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
