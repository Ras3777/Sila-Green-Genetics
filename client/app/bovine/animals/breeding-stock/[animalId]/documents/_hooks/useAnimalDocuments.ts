'use client';

import { use, useState, useMemo } from 'react';
import { useBovine } from '@/lib/bovine-store';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import { CertificateRecord, CertificateStatus } from '@/lib/bovine-trust-types';

export function useAnimalDocuments(params: Promise<{ animalId: string }>) {
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

  const farm = animal ? farms.find((f) => f.id === animal.farmId) : undefined;
  const herd = animal ? herds.find((h) => h.id === animal.herdId) : undefined;

  return {
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
  };
}
