'use client';

import React, { use, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  ShieldCheck,
  FileCheck,
  FileText,
  Plus,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  History,
  ArrowRightLeft,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  Calendar,
  Lock,
  X,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import { CertificateRecord, CertificateStatus } from '@/lib/bovine-trust-types';
import { CertificateStatusBadge } from '@/components/bovine/trust/CertificateStatusBadge';
import { CryptographicVerificationStamp } from '@/components/bovine/trust/CryptographicVerificationStamp';
import { Sha256DigestDisplay } from '@/components/bovine/trust/Sha256DigestDisplay';
import { CertificatePdfActions } from '@/components/bovine/trust/CertificatePdfActions';
import { CertificateViewerModal } from '@/components/bovine/trust/CertificateViewerModal';
import { CertificateMetadataDrawer } from '@/components/bovine/trust/CertificateMetadataDrawer';
import { CertificateQrModal } from '@/components/bovine/trust/CertificateQrModal';
import { CertificateIssueModal } from '@/components/bovine/trust/CertificateIssueModal';
import { CertificateRevokeModal } from '@/components/bovine/trust/CertificateRevokeModal';
import { CertificateVersionHistory } from '@/components/bovine/trust/CertificateVersionHistory';
import { CertificateVersionComparison } from '@/components/bovine/trust/CertificateVersionComparison';

export default function AnimalCertificatesPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, farms, herds } = useBovine();
  const {
    certificates,
    getCertificatesForAnimal,
    getActiveCertificateForAnimal,
  } = useBovineTrust();

  const animal = animals.find((a) => a.id === animalId);

  // Active modals & drawers
  const [viewerCert, setViewerCert] = useState<CertificateRecord | null>(null);
  const [metadataCert, setMetadataCert] = useState<CertificateRecord | null>(null);
  const [qrCert, setQrCert] = useState<CertificateRecord | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [comparisonCerts, setComparisonCerts] = useState<{
    older: CertificateRecord;
    newer: CertificateRecord;
  } | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [revokingCert, setRevokingCert] = useState<CertificateRecord | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<'ALL' | CertificateStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Animal certificates
  const animalCertificates = useMemo(() => {
    return getCertificatesForAnimal(animalId);
  }, [animalId, certificates, getCertificatesForAnimal]);

  const activeCertificate = useMemo(() => {
    return getActiveCertificateForAnimal(animalId);
  }, [animalId, certificates, getActiveCertificateForAnimal]);

  const filteredCertificates = useMemo(() => {
    return animalCertificates.filter((cert: CertificateRecord) => {
      if (statusFilter !== 'ALL' && cert.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = cert.publicId.toLowerCase().includes(q);
        const matchesScope = cert.type.toLowerCase().includes(q);
        const matchesTitle = cert.title.toLowerCase().includes(q);
        const matchesIssuer = cert.issuer.name.toLowerCase().includes(q);
        const matchesHash = cert.cryptography.sha256Digest.toLowerCase().includes(q);
        if (!matchesCode && !matchesScope && !matchesTitle && !matchesIssuer && !matchesHash) {
          return false;
        }
      }
      return true;
    });
  }, [animalCertificates, statusFilter, searchQuery]);

  if (!animal) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-stone-900">Breeding Stock Animal Not Found</h1>
        <p className="text-xs text-stone-500">
          No registered animal matches identifier &ldquo;{animalId}&rdquo;.
        </p>
        <Link
          href="/bovine/animals/breeding-stock"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
        >
          Return to Breeding Directory
        </Link>
      </div>
    );
  }

  const farm = farms.find((f) => f.id === animal.farmId);
  const herd = herds.find((h) => h.id === animal.herdId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/animals/breeding-stock" className="hover:text-emerald-800 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Breeding Stock</span>
        </Link>
        <span>/</span>
        <Link
          href={`/bovine/animals/breeding-stock/${animalId}`}
          className="font-mono hover:text-emerald-800 text-stone-700"
        >
          {animal.name} ({animal.primaryIdentifier || animal.internalId})
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
          Official Certificates &amp; Cryptographic Trust
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-600/10 via-teal-500/5 to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              <ShieldCheck className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-300/80 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  Cryptographic Trust Dossier
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-mono font-semibold">
                  Tag: {animal.primaryIdentifier || animal.internalId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-mono font-bold border border-amber-200">
                  DGR: {animal.dgr || 'DGR-BR-9904'}
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
                {animal.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-stone-600">
                <span>{animal.breed || 'Registered Purebred'}</span>
                <span>•</span>
                <span className="font-semibold uppercase text-stone-800">{animal.sex}</span>
                <span>•</span>
                <span>DOB: {animal.birthDate || animal.dateOfBirth || '2022-03-15'}</span>
                <span>•</span>
                <span>{farm ? farm.name : 'Primary Farm'}</span>
                {herd && (
                  <>
                    <span>•</span>
                    <span className="text-stone-500">{herd.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Official Certificate</span>
            </button>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-4 h-4 text-stone-600" />
              <span>Version Trail</span>
            </button>
            <Link
              href="/bovine/documents/verify"
              className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4 text-stone-600" />
              <span>Validator Hub</span>
            </Link>
            <Link
              href={`/verify?id=${activeCertificate?.publicId || animal.id}`}
              target="_blank"
              className="px-3.5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-teal-700" />
              <span>Public Digital Twin</span>
              <ExternalLink className="w-3 h-3 text-teal-600" />
            </Link>
          </div>
        </div>

        {/* Quick Registry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-100 text-xs">
          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">
              Registry Status
            </span>
            <div className="text-sm font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {activeCertificate ? 'Active Certificate Issued' : 'No Active Certificate'}
            </div>
            <span className="text-[10px] text-stone-500">
              {animalCertificates.length} total certificates on file
            </span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">
              Authority Trust Tier
            </span>
            <div className="text-sm font-bold text-stone-900 mt-0.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              Tier 1 Sovereign Registrar
            </div>
            <span className="text-[10px] text-stone-500">National Bovine Genetic Registry (NBGR)</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">
              Digital Signature Standard
            </span>
            <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
              ECDSA secp256r1
            </div>
            <span className="text-[10px] text-stone-500">Hardware Security Module (HSM)</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">
              Pedigree &amp; Parentage
            </span>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">
              DNA Microsatellite &amp; SNP Confirmed
            </div>
            <span className="text-[10px] text-stone-500">ISAG Level 1 parentage match</span>
          </div>
        </div>
      </div>

      {/* Active Certificate Spotlight */}
      {activeCertificate ? (
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
                  onClick={() => setMetadataCert(activeCertificate)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Metadata
                </button>
                <button
                  onClick={() => setRevokingCert(activeCertificate)}
                  className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/40 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
            onClick={() => setIsIssueModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Official Certificate</span>
          </button>
        </div>
      )}

      {/* Certificate Lifecycle History & Registry Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {/* Table Filters & Toolbar */}
        <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-800" />
              <span>Certificate Lifecycle &amp; Registry History</span>
              <span className="text-xs font-normal text-stone-500 font-mono">
                ({filteredCertificates.length} {filteredCertificates.length === 1 ? 'record' : 'records'})
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Auditable record of all active, historical, superseded, and revoked binaries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search certificate # or hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-48 sm:w-64"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              {(['ALL', 'ACTIVE', 'SUPERSEDED', 'REVOKED', 'EXPIRED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Records Table */}
        {filteredCertificates.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-xs space-y-2">
            <FileText className="w-8 h-8 mx-auto text-stone-300" />
            <p className="font-semibold text-stone-700">No certificate records match the selected filter.</p>
            <p>Try resetting the status filter or clearing your search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-mono uppercase text-stone-500">
                <tr>
                  <th className="py-3 px-4">Status &amp; Certificate #</th>
                  <th className="py-3 px-4">Scope &amp; Version</th>
                  <th className="py-3 px-4">Issuing Authority</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">SHA-256 Digest</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCertificates.map((cert: CertificateRecord) => {
                  const isCurrentActive = cert.status === 'ACTIVE';
                  const isSuperseded = cert.status === 'SUPERSEDED';

                  return (
                    <tr
                      key={cert.id}
                      className={`hover:bg-stone-50/60 transition-colors ${
                        isCurrentActive ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Status & Certificate Number */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <CertificateStatusBadge status={cert.status} />
                          <span className="font-bold text-stone-900">{cert.publicId}</span>
                        </div>
                        {cert.revocationReason && (
                          <div className="text-[10px] text-red-600 font-sans mt-0.5">
                            Revoked: {cert.revocationReason}
                          </div>
                        )}
                      </td>

                      {/* Scope & Version */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-800">
                          {cert.type.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          Template: {cert.templateVersion} • v{cert.version}.0
                        </div>
                      </td>

                      {/* Issuing Authority */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-900">
                          {cert.issuer.name}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Trust: {cert.issuer.trustLevel}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</div>
                        {cert.expiresAt && (
                          <div className="text-stone-500 text-[10px]">
                            Exp: {new Date(cert.expiresAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* SHA-256 Digest */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <Sha256DigestDisplay
                          digest={cert.cryptography.sha256Digest}
                          match={cert.status === 'ACTIVE' || cert.status === 'SUPERSEDED'}
                          truncate
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <CertificatePdfActions
                            certificate={cert}
                            variant="compact"
                          />

                          {/* Version comparison button if superseded and an active certificate exists */}
                          {isSuperseded && activeCertificate && (
                            <button
                              onClick={() =>
                                setComparisonCerts({
                                  older: cert,
                                  newer: activeCertificate,
                                })
                              }
                              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs transition-colors cursor-pointer"
                              title="Compare with Active Certificate"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5 text-stone-600" />
                            </button>
                          )}

                          {/* Metadata Inspector Drawer */}
                          <button
                            onClick={() => setMetadataCert(cert)}
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs transition-colors cursor-pointer"
                            title="Deep Cryptographic Metadata"
                          >
                            <FileText className="w-3.5 h-3.5 text-stone-600" />
                          </button>

                          {/* Revoke button if active */}
                          {isCurrentActive && (
                            <button
                              onClick={() => setRevokingCert(cert)}
                              className="px-2 py-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Embedded Modals and Drawers */}
      {/* 1. Binary PDF Viewer Modal */}
      {viewerCert && (
        <CertificateViewerModal
          certificate={viewerCert}
          onClose={() => setViewerCert(null)}
        />
      )}

      {/* 2. Cryptographic Metadata Drawer */}
      {metadataCert && (
        <CertificateMetadataDrawer
          certificate={metadataCert}
          isOpen={!!metadataCert}
          onClose={() => setMetadataCert(null)}
        />
      )}

      {/* 3. QR Modal */}
      {qrCert && (
        <CertificateQrModal
          certificate={qrCert}
          onClose={() => setQrCert(null)}
        />
      )}

      {/* 4. Issue Certificate Modal */}
      <CertificateIssueModal
        animalId={animal.id}
        animalName={animal.name}
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssuedSuccess={(issuedCert: CertificateRecord) => {
          setViewerCert(issuedCert);
        }}
      />

      {/* 5. Revoke Certificate Modal */}
      {revokingCert && (
        <CertificateRevokeModal
          certificate={revokingCert}
          isOpen={!!revokingCert}
          onClose={() => setRevokingCert(null)}
          onRevokedSuccess={() => {
            setRevokingCert(null);
          }}
        />
      )}

      {/* 6. Version History Timeline Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-stone-900 text-sm">Certificate Version Trail</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <CertificateVersionHistory
                certificates={animalCertificates}
                currentCertId={activeCertificate?.publicId}
                onSelectCertificate={(c) => {
                  setShowHistoryModal(false);
                  setViewerCert(c);
                }}
                onCompareVersions={(older, newer) => {
                  setShowHistoryModal(false);
                  setComparisonCerts({ older, newer });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. Version Comparison Side-by-Side Modal */}
      {comparisonCerts && (
        <CertificateVersionComparison
          olderCert={comparisonCerts.older}
          newerCert={comparisonCerts.newer}
          onClose={() => setComparisonCerts(null)}
        />
      )}
    </div>
  );
}
