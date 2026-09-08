export type CertificateStatus =
  | 'DRAFT'
  | 'GENERATING'
  | 'SIGNING'
  | 'REGISTERING'
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'REVOKED'
  | 'EXPIRED'
  | 'FAILED';

export type VerificationStatus =
  | 'VALID'
  | 'INVALID'
  | 'HASH_MISMATCH'
  | 'SIGNATURE_INVALID'
  | 'UNKNOWN_CERTIFICATE'
  | 'REVOKED'
  | 'SUPERSEDED'
  | 'EXPIRED'
  | 'ISSUER_UNTRUSTED'
  | 'FILE_CORRUPTED'
  | 'VERIFICATION_ERROR';

export type CertificateScope =
  | 'GENETIC_REGISTRATION'
  | 'PEDIGREE_CERTIFICATE'
  | 'GENOMIC_CERTIFICATE'
  | 'BREEDING_STOCK_CERTIFICATE'
  | 'PARENTAGE_CERTIFICATE'
  | 'PERFORMANCE_CERTIFICATE'
  | 'OTHER_OFFICIAL_CERTIFICATE';

export type IssuerTrustStatus = 'TRUSTED' | 'UNTRUSTED' | 'REVOKED' | 'RETIRED';

export interface PublicAnimalVerificationSummary {
  publicId: string;
  name: string;
  dgr: string;
  earTag: string;
  rfid?: string;
  sex: string;
  breed: string;
  birthDate: string;
  photoUrl: string;
  farmName?: string;
  sellerName?: string;
  identityVerified: boolean;
  parentageVerified: boolean;
  genotyped: boolean;
  inbreedingPct?: number;
  sireName?: string;
  sireDnaVerified?: boolean;
  damName?: string;
  damDnaVerified?: boolean;
  selectionIndex?: number;
  geBvs?: Record<string, number>;
  marketplaceListingId?: string;
}

export interface IssuerRecord {
  id: string;
  name: string;
  authorityCode: string;
  keyId: string;
  algorithm: string;
  status: IssuerTrustStatus;
  validFrom: string;
  validTo: string;
  trustedRoots: string[];
}

export interface CertificateRecord {
  id: string;
  publicId: string;
  animalId: string;
  type: CertificateScope;
  title: string;
  version: number;
  status: CertificateStatus;
  issuedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  revocationReason?: string;
  replacementCertificateId?: string;
  supersedesCertificateId?: string;
  supersededByCertificateId?: string;
  issuer: {
    name: string;
    keyId: string;
    status: IssuerTrustStatus;
    trustLevel: string;
  };
  cryptography: {
    sha256Digest: string;
    signatureAlgorithm: string;
    signingKeyId: string;
    signedAt: string;
    signatureValid: boolean;
    signatureValuePreview?: string;
  };
  fileSize: string;
  fileSizeBytes: number;
  filename: string;
  pageCount: number;
  templateVersion: string;
  language: string;
  officialWatermark: string;
  includedSections: string[];
  animalSummary: PublicAnimalVerificationSummary;
  pdfDataUri?: string;
}

export interface CertificateVerificationResult {
  status: VerificationStatus;
  verificationId: string;
  timestamp: string;
  document: {
    filename?: string;
    fileSize?: number;
    sha256?: string;
    registrySha256?: string;
    digestMatch?: boolean;
    pageCount?: number;
  };
  cryptography: {
    signatureValid?: boolean;
    algorithm?: string;
    signingKeyId?: string;
    signedAt?: string;
    issuerTrusted?: boolean;
    issuerName?: string;
    trustChainStatus?: string;
  };
  certificate?: CertificateRecord;
  animal?: PublicAnimalVerificationSummary;
  replacementCertificate?: CertificateRecord;
  notes?: string;
}

export interface VerificationAuditEvent {
  id: string;
  certificateId?: string;
  result: VerificationStatus;
  providedDocumentDigest?: string;
  registryDigest?: string;
  verifiedAt: string;
  verifiedBy: string;
  source: 'INTERNAL_UPLOAD' | 'PUBLIC_QR' | 'MANUAL_LOOKUP' | 'API';
  notes?: string;
  investigationCaseId?: string;
}

export interface IntegritySignal {
  id: string;
  type: 'HASH_MISMATCH' | 'INVALID_SIGNATURE' | 'UNKNOWN_CERTIFICATE' | 'REVOKED_SCAN' | 'SUSPICIOUS_VOLUME';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  certificateId?: string;
  occurredAt: string;
  status: 'NEW' | 'INVESTIGATING' | 'DISMISSED' | 'RESOLVED';
  investigationCaseId?: string;
}

export interface IssueCertificatePayload {
  animalId: string;
  type: CertificateScope;
  templateVersion?: string;
  language?: string;
  issuerId?: string;
  includedSections?: string[];
  reason?: string;
}
