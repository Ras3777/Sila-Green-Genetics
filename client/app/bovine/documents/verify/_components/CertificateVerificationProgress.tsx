'use client';

import React from 'react';
import { VerificationStepState } from '@/lib/bovine-trust-store';
import { Check, X, Loader2, Circle, ShieldCheck } from 'lucide-react';

interface CertificateVerificationProgressProps {
  uploadProgress: number;
  steps: VerificationStepState[];
}

export function CertificateVerificationProgress({
  uploadProgress,
  steps,
}: CertificateVerificationProgressProps) {
  const isUploading = uploadProgress < 100;

  return (
    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Authoritative Verification Pipeline</h4>
            <p className="text-xs text-stone-500">
              Executing cryptographic signature inspection and registry ledger lookup.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-stone-600 bg-stone-100 px-3 py-1 rounded-full w-fit">
          {isUploading ? `Uploading: ${uploadProgress}%` : 'Validating Cryptography...'}
        </div>
      </div>

      {/* Upload Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-stone-500">
          <span>Upload Transfer</span>
          <span>{uploadProgress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full bg-emerald-700 transition-all duration-150 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>

      {/* 9-Step Verification Stepper */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-2">
          Statutory Verification Sequence
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-2.5 rounded-xl border flex items-center space-x-2.5 transition-all ${
                step.status === 'DONE'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                  : step.status === 'IN_PROGRESS'
                  ? 'bg-sky-50 border-sky-300 text-sky-950 font-bold shadow-xs'
                  : step.status === 'FAILED'
                  ? 'bg-rose-50 border-rose-200 text-rose-950 font-medium'
                  : 'bg-stone-50/50 border-stone-200/80 text-stone-500'
              }`}
            >
              <div className="shrink-0">
                {step.status === 'DONE' ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : step.status === 'IN_PROGRESS' ? (
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </span>
                ) : step.status === 'FAILED' ? (
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center">
                    <X className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : (
                  <Circle className="w-4 h-4 text-stone-300" />
                )}
              </div>
              <span className="truncate">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
