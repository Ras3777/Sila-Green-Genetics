'use client';

import React from 'react';
import { CertificateRecord } from '@/lib/bovine-trust-types';
import { CertificateStatusBadge } from './CertificateStatusBadge';
import { X, ArrowRightLeft, Check, AlertCircle } from 'lucide-react';

interface CertificateVersionComparisonProps {
  olderCert: CertificateRecord;
  newerCert: CertificateRecord;
  onClose: () => void;
}

export function CertificateVersionComparison({
  olderCert,
  newerCert,
  onClose,
}: CertificateVersionComparisonProps) {
  const comparisonRows = [
    {
      field: 'Version Number',
      oldVal: `Version ${olderCert.version}`,
      newVal: `Version ${newerCert.version}`,
      changed: true,
    },
    {
      field: 'Public Certificate ID',
      oldVal: olderCert.publicId,
      newVal: newerCert.publicId,
      changed: true,
    },
    {
      field: 'Registry Status',
      oldVal: olderCert.status,
      newVal: newerCert.status,
      changed: olderCert.status !== newerCert.status,
    },
    {
      field: 'Sire Record',
      oldVal: olderCert.animalSummary.sireName || 'Unknown / Unrecorded',
      newVal: newerCert.animalSummary.sireName || 'Unknown / Unrecorded',
      changed: olderCert.animalSummary.sireName !== newerCert.animalSummary.sireName,
    },
    {
      field: 'Parentage Verification',
      oldVal: olderCert.animalSummary.parentageVerified ? 'DNA 50K Verified' : 'Owner Reported / Unverified',
      newVal: newerCert.animalSummary.parentageVerified ? 'DNA 50K Verified' : 'Owner Reported / Unverified',
      changed: olderCert.animalSummary.parentageVerified !== newerCert.animalSummary.parentageVerified,
    },
    {
      field: 'Selection Index',
      oldVal: olderCert.animalSummary.selectionIndex ? String(olderCert.animalSummary.selectionIndex) : 'N/A',
      newVal: newerCert.animalSummary.selectionIndex ? String(newerCert.animalSummary.selectionIndex) : 'N/A',
      changed: olderCert.animalSummary.selectionIndex !== newerCert.animalSummary.selectionIndex,
    },
    {
      field: '50K Genotype Status',
      oldVal: olderCert.animalSummary.genotyped ? 'Genotyped (50K)' : 'Pending Assay',
      newVal: newerCert.animalSummary.genotyped ? 'Genotyped (50K)' : 'Pending Assay',
      changed: olderCert.animalSummary.genotyped !== newerCert.animalSummary.genotyped,
    },
    {
      field: 'Authoritative Digest',
      oldVal: `${olderCert.cryptography.sha256Digest.slice(0, 16)}...`,
      newVal: `${newerCert.cryptography.sha256Digest.slice(0, 16)}...`,
      changed: true,
    },
    {
      field: 'Issuing Key ID',
      oldVal: olderCert.cryptography.signingKeyId,
      newVal: newerCert.cryptography.signingKeyId,
      changed: olderCert.cryptography.signingKeyId !== newerCert.cryptography.signingKeyId,
    },
    {
      field: 'Template Specification',
      oldVal: olderCert.templateVersion,
      newVal: newerCert.templateVersion,
      changed: olderCert.templateVersion !== newerCert.templateVersion,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Certificate Version Comparison</h3>
              <p className="text-xs text-stone-500">
                Evaluating changes between historical v{olderCert.version} and current v{newerCert.version}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-stone-100 font-bold text-xs text-stone-700">
          <div>Attribute Field</div>
          <div>Version {olderCert.version} (Historical)</div>
          <div>Version {newerCert.version} (Current)</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-stone-100 max-h-[50vh] overflow-y-auto text-xs">
          {comparisonRows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-3 gap-3 py-2.5 px-3 rounded-lg transition-colors ${
                row.changed ? 'bg-amber-50/70 font-medium' : 'hover:bg-stone-50'
              }`}
            >
              <div className="font-semibold text-stone-700 flex items-center space-x-1">
                <span>{row.field}</span>
                {row.changed && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </div>
              <div className="font-mono text-stone-600 truncate">{row.oldVal}</div>
              <div className="font-mono text-stone-900 font-bold truncate flex items-center space-x-1">
                <span>{row.newVal}</span>
                {row.changed && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
          <strong className="text-stone-800 font-semibold">Supersession Audit Note:</strong> Version{' '}
          {newerCert.version} incorporates verified DNA parentage and updated genomic evaluations. The older
          Version {olderCert.version} binary remains historically valid for prior transactions.
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
