'use client';

import React from 'react';
import { CertificateRecord } from '@/lib/bovine-trust-types';
import { CertificateStatusBadge } from './CertificateStatusBadge';
import { Sha256DigestDisplay } from './Sha256DigestDisplay';
import { X, ShieldCheck, FileText, Dna, Database, KeyRound, Clock, AlertCircle } from 'lucide-react';

interface CertificateMetadataDrawerProps {
  certificate: CertificateRecord;
  isOpen: boolean;
  onClose: () => void;
  onOpenReplacement?: (certId: string) => void;
}

export function CertificateMetadataDrawer({
  certificate,
  isOpen,
  onClose,
  onOpenReplacement,
}: CertificateMetadataDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-xs text-stone-500">{certificate.publicId}</span>
              <CertificateStatusBadge status={certificate.status} size="sm" />
            </div>
            <h2 className="text-base font-bold text-stone-900 mt-0.5">{certificate.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Status Alert if Revoked or Superseded */}
          {certificate.status === 'REVOKED' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Certificate Officially Revoked</span>
              </div>
              <p className="text-xs text-rose-800">
                Reason: {certificate.revocationReason || 'Pedigree data correction'}
              </p>
              {certificate.revokedAt && (
                <div className="text-[11px] font-mono text-rose-700">
                  Revoked on: {new Date(certificate.revokedAt).toLocaleString()}
                </div>
              )}
              {certificate.replacementCertificateId && onOpenReplacement && (
                <button
                  onClick={() => onOpenReplacement(certificate.replacementCertificateId!)}
                  className="mt-2 text-xs font-bold text-rose-900 underline hover:text-rose-950 cursor-pointer block"
                >
                  View Current Replacement Certificate ({certificate.replacementCertificateId}) &rarr;
                </button>
              )}
            </div>
          )}

          {certificate.status === 'SUPERSEDED' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Historical Version Superseded</span>
              </div>
              <p className="text-xs text-amber-800">
                Version {certificate.version} is authentic but has been superseded by a newer registered version.
              </p>
              {certificate.supersededByCertificateId && onOpenReplacement && (
                <button
                  onClick={() => onOpenReplacement(certificate.supersededByCertificateId!)}
                  className="mt-2 text-xs font-bold text-amber-900 underline hover:text-amber-950 cursor-pointer block"
                >
                  View Active Version ({certificate.supersededByCertificateId}) &rarr;
                </button>
              )}
            </div>
          )}

          {/* Cryptographic Ledger Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-800" />
              <span>Authoritative Cryptography</span>
            </h3>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Digital Signature:</span>
                <span className="font-mono font-bold text-emerald-800">
                  {certificate.cryptography.signatureValid ? 'VALID (FIPS-186)' : 'INVALID'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Signing Key ID:</span>
                <span className="font-mono text-stone-800">{certificate.cryptography.signingKeyId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Algorithm:</span>
                <span className="font-mono text-stone-800">{certificate.cryptography.signatureAlgorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Timestamp Signed:</span>
                <span className="font-mono text-stone-800">
                  {new Date(certificate.cryptography.signedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <Sha256DigestDisplay
              digest={certificate.cryptography.sha256Digest}
              label="Authoritative Ledger Digest"
              truncate={true}
            />
          </div>

          {/* Issuing Authority */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
              <span>Issuing Authority</span>
            </h3>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="font-bold text-stone-900">{certificate.issuer.name}</div>
              <div className="text-[11px] text-stone-600">
                Accreditation Level: <strong className="text-stone-800">{certificate.issuer.trustLevel}</strong>
              </div>
              <div className="text-[11px] text-stone-600">
                Issuer Trust Status: <span className="font-mono font-bold text-emerald-800">{certificate.issuer.status}</span>
              </div>
            </div>
          </div>

          {/* Attached Animal */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 flex items-center space-x-1.5">
              <Dna className="w-3.5 h-3.5 text-emerald-800" />
              <span>Animal Identity Record</span>
            </h3>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Name:</span>
                <strong className="text-stone-900">{certificate.animalSummary.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">National DGR:</span>
                <span className="font-mono font-bold text-stone-800">{certificate.animalSummary.dgr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Ear Tag:</span>
                <span className="font-mono text-stone-800">{certificate.animalSummary.earTag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Breed &amp; Sex:</span>
                <span className="text-stone-800">{certificate.animalSummary.breed} • {certificate.animalSummary.sex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Birth Date:</span>
                <span className="font-mono text-stone-800">{certificate.animalSummary.birthDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">DNA Parentage:</span>
                <span className="font-semibold text-emerald-800">
                  {certificate.animalSummary.parentageVerified ? '50K SNP Verified' : 'Recorded'}
                </span>
              </div>
            </div>
          </div>

          {/* Document Properties */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-800" />
              <span>Document Specification</span>
            </h3>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-stone-500">Filename:</span>
                <span className="text-stone-800 truncate max-w-[200px]">{certificate.filename}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">File Size:</span>
                <span className="text-stone-800">{certificate.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Template Version:</span>
                <span className="text-stone-800">{certificate.templateVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Language:</span>
                <span className="text-stone-800">{certificate.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Watermark:</span>
                <span className="text-stone-800">{certificate.officialWatermark}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
