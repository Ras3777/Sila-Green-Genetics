'use client';

import React, { useState } from 'react';
import { CertificateRecord } from '@/lib/bovine-trust-types';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import { X, AlertTriangle, Ban, ShieldAlert } from 'lucide-react';

interface CertificateRevokeModalProps {
  certificate: CertificateRecord;
  isOpen: boolean;
  onClose: () => void;
  onRevokedSuccess?: () => void;
}

export function CertificateRevokeModal({
  certificate,
  isOpen,
  onClose,
  onRevokedSuccess,
}: CertificateRevokeModalProps) {
  const { revokeCertificate } = useBovineTrust();

  const [reasonCategory, setReasonCategory] = useState('PEDIGREE_CORRECTION');
  const [detailedNotes, setDetailedNotes] = useState('');
  const [hasReplacement, setHasReplacement] = useState(false);
  const [replacementId, setReplacementId] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const fullReason = `${reasonCategory}: ${detailedNotes || 'Formal revocation ordered by Registry'}`;
      await revokeCertificate(certificate.publicId, fullReason, hasReplacement ? replacementId : undefined);
      if (onRevokedSuccess) onRevokedSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-900">
              <Ban className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Revoke Official Certificate</h3>
              <p className="text-xs text-stone-500 font-mono">{certificate.publicId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>Permanent Statutory Registry Action</span>
          </div>
          <p className="leading-relaxed text-rose-800">
            Revoking this certificate will mark it permanently as <strong>VOID</strong> in the registry ledger.
            Any public QR scans or internal validation attempts will immediately report the revocation status.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Revocation Taxonomy Category</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none"
            >
              <option value="PEDIGREE_CORRECTION">Pedigree / Parentage Conflict Exclusion</option>
              <option value="IDENTITY_CORRECTION">Animal Physical Identification Error</option>
              <option value="REGISTRY_ADMIN_ORDER">Administrative Regulatory Order / Court Directive</option>
              <option value="ISSUED_IN_ERROR">Issued in Error / Duplicate Issuance</option>
              <option value="GENOTYPE_DISCREPANCY">Genomic Assay Discrepancy</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Statutory Justification &amp; Notes</label>
            <textarea
              rows={3}
              required
              value={detailedNotes}
              onChange={(e) => setDetailedNotes(e.target.value)}
              placeholder="Provide exact case numbers, lab assay IDs, or regulatory directives..."
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none focus:border-rose-600"
            />
          </div>

          {/* Replacement linkage */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReplacement}
                onChange={(e) => setHasReplacement(e.target.checked)}
                className="rounded text-rose-700 focus:ring-rose-600"
              />
              <span className="font-bold text-stone-800 text-[11px]">
                Link Replacement Certificate for Public Resolution
              </span>
            </label>

            {hasReplacement && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="e.g. CERT-2026-0031892"
                  value={replacementId}
                  onChange={(e) => setReplacementId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 bg-white font-mono text-xs text-stone-900 outline-none"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Public QR scans will inform the user of revocation and point directly to this replacement.
                </p>
              </div>
            )}
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start space-x-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded text-rose-700 focus:ring-rose-600 mt-0.5"
            />
            <span className="text-stone-700 font-medium text-[11px] leading-tight">
              I certify that I am an authorized registrar and that this revocation complies with National Bovine
              Genetics Registry standards.
            </span>
          </label>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmed || isSubmitting}
              className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold shadow-xs cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Revoking...' : 'Execute Revocation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
