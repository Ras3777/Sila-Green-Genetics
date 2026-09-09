'use client';

import React from 'react';
import { Sparkles, FileText, Plus } from 'lucide-react';
import { CertificateRecord } from '@/lib/bovine-trust-types';
import { CryptographicVerificationStamp } from '@/components/bovine/trust/CryptographicVerificationStamp';
import { CertificatePdfActions } from '@/components/bovine/trust/CertificatePdfActions';

interface ActiveCertificateSpotlightProps {
  activeCertificate?: CertificateRecord;
  onIssueCertificate: () => void;
  onOpenMetadata: (cert: CertificateRecord) => void;
  onRevoke: (cert: CertificateRecord) => void;
}

export function ActiveCertificateSpotlight({
  activeCertificate,
  onIssueCertificate,
  onOpenMetadata,
  onRevoke,
}: ActiveCertificateSpotlightProps) {
  if (!activeCertificate) {
    return (
      <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-3xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900">No Active Official Certificate On Record</h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto">
          This animal does not currently possess an active, sealed certificate. Authorized registrars can
          generate and cryptographically seal an official pedigree and genomics certificate.
        </p>
        <button
          onClick={onIssueCertificate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue Official Certificate</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Active Official Certificate
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-200 text-xs font-mono">
              v{activeCertificate.version}.0
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {activeCertificate.publicId}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
              Scope: <span className="font-semibold text-white">{activeCertificate.type.replace(/_/g, ' ')}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-300">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-mono">Issuing Authority</span>
              <span className="font-semibold text-white">{activeCertificate.issuer.name}</span>
              <span className="text-[10px] text-emerald-300 block">Trust Tier: {activeCertificate.issuer.trustLevel}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-mono">Effective Dates</span>
              <span className="text-white">Issued: {new Date(activeCertificate.issuedAt).toLocaleDateString()}</span>
              {activeCertificate.expiresAt && (
                <span className="text-stone-300 block text-[10px]">
                  Expires: {new Date(activeCertificate.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Monospace Digest */}
          <div className="pt-2">
            <span className="text-stone-400 text-[10px] font-mono uppercase block mb-1">
              Cryptographic SHA-256 Digest (Exact Binary Fingerprint)
            </span>
            <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 font-mono text-[11px] text-emerald-300 break-all">
              {activeCertificate.cryptography.sha256Digest}
            </div>
          </div>
        </div>

        {/* Right Side: Official Verification Seal & Quick Actions */}
        <div className="flex flex-col items-center sm:items-end gap-4 w-full lg:w-auto shrink-0">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col items-center">
            <CryptographicVerificationStamp status="VERIFIED" size="lg" />
            <span className="text-[10px] font-mono text-emerald-200 mt-2 text-center block">
              Authoritative Registry Binary Verified
            </span>
          </div>

          {/* Spotlight PDF Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <CertificatePdfActions
              certificate={activeCertificate}
              variant="compact"
            />
            <button
              onClick={() => onOpenMetadata(activeCertificate)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Metadata
            </button>
            <button
              onClick={() => onRevoke(activeCertificate)}
              className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
