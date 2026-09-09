'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { CertificateViewerModal } from '@/components/bovine/trust/CertificateViewerModal';
import { CertificateMetadataDrawer } from '@/components/bovine/trust/CertificateMetadataDrawer';
import { CertificateQrModal } from '@/components/bovine/trust/CertificateQrModal';
import { CertificateIssueModal } from '@/components/bovine/trust/CertificateIssueModal';
import { CertificateRevokeModal } from '@/components/bovine/trust/CertificateRevokeModal';
import { CertificateVersionComparison } from '@/components/bovine/trust/CertificateVersionComparison';
import { useAnimalDocuments } from './_hooks/useAnimalDocuments';
import {
  DocumentBreadcrumb,
  DocumentHeroHeader,
  ActiveCertificateSpotlight,
  CertificateHistoryTable,
  CertificateHistoryModal,
} from './_components';

export default function AnimalCertificatesPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const {
    animalId,
    animal,
    farm,
    herd,
    viewerCert,
    setViewerCert,
    metadataCert,
    setMetadataCert,
    qrCert,
    setQrCert,
    showHistoryModal,
    setShowHistoryModal,
    comparisonCerts,
    setComparisonCerts,
    isIssueModalOpen,
    setIsIssueModalOpen,
    revokingCert,
    setRevokingCert,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    animalCertificates,
    activeCertificate,
    filteredCertificates,
  } = useAnimalDocuments(params);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb Navigation */}
      <DocumentBreadcrumb animal={animal} />

      {/* Hero Header Card */}
      <DocumentHeroHeader
        animal={animal}
        farm={farm}
        herd={herd}
        activeCertificate={activeCertificate}
        animalCertificatesCount={animalCertificates.length}
        onIssueCertificate={() => setIsIssueModalOpen(true)}
        onShowHistory={() => setShowHistoryModal(true)}
      />

      {/* Active Certificate Spotlight */}
      <ActiveCertificateSpotlight
        activeCertificate={activeCertificate}
        onIssueCertificate={() => setIsIssueModalOpen(true)}
        onOpenMetadata={(cert) => setMetadataCert(cert)}
        onRevoke={(cert) => setRevokingCert(cert)}
      />

      {/* Certificate Lifecycle History & Registry Table */}
      <CertificateHistoryTable
        filteredCertificates={filteredCertificates}
        activeCertificate={activeCertificate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onCompare={(older, newer) => setComparisonCerts({ older, newer })}
        onOpenMetadata={(cert) => setMetadataCert(cert)}
        onRevoke={(cert) => setRevokingCert(cert)}
      />

      {/* Binary PDF Viewer Modal */}
      {viewerCert && (
        <CertificateViewerModal
          certificate={viewerCert}
          onClose={() => setViewerCert(null)}
        />
      )}

      {/* Cryptographic Metadata Drawer */}
      {metadataCert && (
        <CertificateMetadataDrawer
          certificate={metadataCert}
          isOpen={!!metadataCert}
          onClose={() => setMetadataCert(null)}
        />
      )}

      {/* QR Modal */}
      {qrCert && (
        <CertificateQrModal
          certificate={qrCert}
          onClose={() => setQrCert(null)}
        />
      )}

      {/* Issue Certificate Modal */}
      <CertificateIssueModal
        animalId={animal.id}
        animalName={animal.name}
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssuedSuccess={(issuedCert) => {
          setViewerCert(issuedCert);
        }}
      />

      {/* Revoke Certificate Modal */}
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

      {/* Version History Timeline Modal */}
      <CertificateHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        certificates={animalCertificates}
        currentCertId={activeCertificate?.publicId}
        onSelectCertificate={(c) => setViewerCert(c)}
        onCompareVersions={(older, newer) => setComparisonCerts({ older, newer })}
      />

      {/* Version Comparison Side-by-Side Modal */}
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
