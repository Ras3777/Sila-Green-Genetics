'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CertificateVerificationResult,
  CertificateRecord,
} from '@/lib/bovine-trust-types';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import { CertificateStatusBadge } from '@/components/bovine/trust/CertificateStatusBadge';
import { CryptographicVerificationStamp } from '@/components/bovine/trust/CryptographicVerificationStamp';
import { CertificateTrustSummary } from '@/components/bovine/trust/CertificateTrustSummary';
import { Sha256DigestDisplay } from '@/components/bovine/trust/Sha256DigestDisplay';
import { VerificationBadges } from '@/components/bovine/trust/VerificationBadges';
import { CertificatePdfActions } from '@/components/bovine/trust/CertificatePdfActions';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Dna,
  FileText,
  Building2,
  Search,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';

interface CertificateVerificationResultViewProps {
  result: CertificateVerificationResult;
  onReset: () => void;
}

export function CertificateVerificationResultView({
  result,
  onReset,
}: CertificateVerificationResultViewProps) {
  const { openInvestigationFromSignal } = useBovineTrust();
  const [investigationCaseId, setInvestigationCaseId] = useState<string | null>(null);

  const cert = result.certificate;
  const animal = result.animal;

  const handleOpenInvestigation = () => {
    const caseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setInvestigationCaseId(caseId);
  };

  const getStatusBanner = () => {
    switch (result.status) {
      case 'VALID':
        return {
          title: 'AUTHENTIC CERTIFICATE',
          subtitle: 'The document matches the registered SHA-256 digest and digital signature in the National Bovine Registry.',
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          icon: CheckCircle2,
          iconColor: 'text-emerald-700',
          stampStatus: 'VERIFIED' as const,
        };
      case 'HASH_MISMATCH':
        return {
          title: 'DOCUMENT DOES NOT MATCH REGISTERED DIGEST',
          subtitle: 'The uploaded PDF does not match the authoritative SHA-256 digest registered for this certificate. File may have been edited or re-saved post-issuance.',
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          icon: ShieldAlert,
          iconColor: 'text-rose-700',
          stampStatus: 'INVALID' as const,
        };
      case 'SIGNATURE_INVALID':
        return {
          title: 'DIGITAL SIGNATURE INVALID',
          subtitle: 'The digital signature could not be verified against the trusted national issuing authority keys.',
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          icon: XCircle,
          iconColor: 'text-rose-700',
          stampStatus: 'INVALID' as const,
        };
      case 'REVOKED':
        return {
          title: 'AUTHENTIC BUT OFFICIALLY REVOKED',
          subtitle: `This certificate is authentic but was formally revoked by the Registry on ${cert?.revokedAt ? new Date(cert.revokedAt).toLocaleDateString() : 'recent date'}.`,
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          icon: AlertTriangle,
          iconColor: 'text-rose-700',
          stampStatus: 'REVOKED' as const,
        };
      case 'SUPERSEDED':
        return {
          title: 'AUTHENTIC BUT NOT CURRENT (SUPERSEDED)',
          subtitle: `Certificate Version ${cert?.version} is historically authentic, but a newer Version ${result.replacementCertificate?.version || '3'} is now the active official record.`,
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          icon: Clock,
          iconColor: 'text-amber-700',
          stampStatus: 'SUPERSEDED' as const,
        };
      case 'EXPIRED':
        return {
          title: 'AUTHENTIC BUT EXPIRED',
          subtitle: `The validity term for this certificate expired on ${cert?.expiresAt || 'recent date'}.`,
          bg: 'bg-stone-100 border-stone-300 text-stone-900',
          icon: AlertTriangle,
          iconColor: 'text-stone-600',
          stampStatus: 'UNKNOWN' as const,
        };
      case 'UNKNOWN_CERTIFICATE':
        return {
          title: 'CERTIFICATE NOT FOUND IN REGISTRY',
          subtitle: 'No official livestock certificate matching the supplied document could be resolved in the statutory registry.',
          bg: 'bg-stone-100 border-stone-300 text-stone-900',
          icon: AlertTriangle,
          iconColor: 'text-stone-600',
          stampStatus: 'UNKNOWN' as const,
        };
      case 'VERIFICATION_ERROR':
      default:
        return {
          title: 'VERIFICATION SERVICE UNAVAILABLE',
          subtitle: 'The registry verification service timed out or could not be reached. No authenticity determination was made.',
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          icon: AlertTriangle,
          iconColor: 'text-amber-700',
          stampStatus: 'UNKNOWN' as const,
        };
    }
  };

  const banner = getStatusBanner();
  const BannerIcon = banner.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Primary Result Banner */}
      <div className={`p-6 rounded-3xl border-2 shadow-xs ${banner.bg} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-white/80 shadow-xs shrink-0 mt-0.5">
              <BannerIcon className={`w-7 h-7 ${banner.iconColor}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500">
                  Verification Verdict • ID: {result.verificationId}
                </span>
                {cert && <CertificateStatusBadge status={cert.status} size="sm" />}
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">{banner.title}</h2>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90 max-w-3xl">
                {banner.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-stone-800 text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer border border-stone-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verify Another Document</span>
            </button>
          </div>
        </div>

        {/* Action Callouts for Revoked/Superseded/Mismatch */}
        {result.status === 'REVOKED' && result.replacementCertificate && (
          <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-200 flex items-center justify-between gap-3 text-xs">
            <span className="text-stone-700">
              A replacement certificate has been issued:{' '}
              <strong className="font-mono text-stone-900 font-bold">
                {result.replacementCertificate.publicId}
              </strong>
            </span>
            <Link
              href={`/bovine/animals/breeding-stock/${result.replacementCertificate.animalId}/documents`}
              className="px-3 py-1.5 rounded-lg bg-rose-800 text-white font-semibold hover:bg-rose-900 cursor-pointer shrink-0"
            >
              View Replacement &rarr;
            </Link>
          </div>
        )}

        {result.status === 'SUPERSEDED' && result.replacementCertificate && (
          <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200 flex items-center justify-between gap-3 text-xs">
            <span className="text-stone-700">
              Active Official Version {result.replacementCertificate.version}:{' '}
              <strong className="font-mono text-stone-900 font-bold">
                {result.replacementCertificate.publicId}
              </strong>
            </span>
            <Link
              href={`/bovine/animals/breeding-stock/${result.replacementCertificate.animalId}/documents`}
              className="px-3 py-1.5 rounded-lg bg-amber-800 text-white font-semibold hover:bg-amber-900 cursor-pointer shrink-0"
            >
              View Active Version &rarr;
            </Link>
          </div>
        )}

        {result.status === 'HASH_MISMATCH' && (
          <div className="p-4 rounded-2xl bg-white/90 border border-rose-200 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-rose-900 font-bold">
                Integrity Anomaly: File bytes do not match registered signature.
              </span>
              {!investigationCaseId ? (
                <button
                  onClick={handleOpenInvestigation}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Open Regulatory Investigation</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-950 font-mono font-bold text-xs border border-rose-300">
                  Case Docket Created: {investigationCaseId}
                </span>
              )}
            </div>

            <Sha256DigestDisplay
              digest={result.document.sha256 || ''}
              label="Uploaded Document Digest"
              match={false}
              expectedDigest={result.document.registrySha256}
            />
          </div>
        )}
      </div>

      {/* 2-Column Main Section: Left = Stamp + Summary, Right = Animal + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Stamp + Trust Summary */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <CryptographicVerificationStamp
              status={banner.stampStatus}
              issuer={cert?.issuer.name}
              digest={result.document.sha256}
              timestamp={result.timestamp}
              variant="seal"
            />
          </div>

          <CertificateTrustSummary result={result} certificate={cert} />
        </div>

        {/* Right Column (2 cols): Animal Details & Action Panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Animal Identity Crest */}
          {animal && (
            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={animal.photoUrl}
                    alt={animal.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                        DGR: {animal.dgr}
                      </span>
                      <span className="font-mono text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        Ear Tag: {animal.earTag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mt-1">{animal.name}</h3>
                    <p className="text-xs text-stone-500">
                      {animal.breed} • {animal.sex} • Born {animal.birthDate}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/bovine/animals/breeding-stock/${cert?.animalId || 'anim-001'}`}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <span>Animal Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  </Link>

                  <Link
                    href={`/bovine/animals/breeding-stock/${cert?.animalId || 'anim-001'}/pedigree`}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Dna className="w-3.5 h-3.5 text-stone-500" />
                    <span>Pedigree</span>
                  </Link>

                  <Link
                    href={`/bovine/animals/breeding-stock/${cert?.animalId || 'anim-001'}/documents`}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-stone-500" />
                    <span>Certificates</span>
                  </Link>
                </div>
              </div>

              {/* Verification Badges */}
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[10px] font-mono uppercase font-bold text-stone-400 block mb-1.5">
                  Registry Attestation Badges
                </span>
                <VerificationBadges animal={animal} certificateStatus={cert?.status} size="sm" />
              </div>
            </div>
          )}

          {/* Certificate Delivery & Official PDF Actions */}
          {cert && (
            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Signed Binary PDF Delivery</h4>
                  <p className="text-xs text-stone-500">
                    Fetch, preview, download, or print the exact authoritative signed certificate.
                  </p>
                </div>
                <span className="text-xs font-mono text-stone-500">{cert.fileSize}</span>
              </div>

              <CertificatePdfActions certificate={cert} variant="toolbar" />
            </div>
          )}

          {/* Cryptographic & Document Specs Accordion/Card */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-bold text-stone-900 text-sm flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-emerald-800" />
              <span>Cryptographic Chain of Custody</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 text-[10px] uppercase font-bold block">Authority</span>
                <span className="font-semibold text-stone-900 mt-0.5 block">{cert?.issuer.name}</span>
                <span className="text-[10px] font-mono text-emerald-800">Status: TRUSTED ROOT</span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 text-[10px] uppercase font-bold block">Signature Scheme</span>
                <span className="font-mono text-stone-900 font-semibold mt-0.5 block">
                  {cert?.cryptography.signatureAlgorithm || 'ECDSA_SHA256'}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Key: {cert?.cryptography.signingKeyId}</span>
              </div>
            </div>

            <Sha256DigestDisplay
              digest={result.document.sha256 || cert?.cryptography.sha256Digest || ''}
              label="Authoritative SHA-256 Ledger Digest"
              match={result.document.digestMatch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
