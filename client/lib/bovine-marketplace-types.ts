// ============================================================================
// Bovine Genetics Marketplace & Commercial Workspace Type Definitions
// ============================================================================

export type MarketplaceAssetType = 'LIVE_ANIMAL' | 'SEMEN' | 'EMBRYO' | 'BREEDING_SERVICE';

export type MarketplaceListingType = 'FIXED_PRICE' | 'NEGOTIABLE' | 'PRIVATE_TREATY' | 'AUCTION';

export type MarketplaceListingStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACTIVE'
  | 'RESERVED'
  | 'SOLD'
  | 'PAUSED'
  | 'EXPIRED'
  | 'WITHDRAWN';

export type OfferStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COUNTERED'
  | 'WITHDRAWN'
  | 'EXPIRED';

export type ReservationStatus =
  | 'PENDING_DEPOSIT'
  | 'CONFIRMED'
  | 'INSPECTION_PENDING'
  | 'CONVERTED_TO_SALE'
  | 'CANCELLED'
  | 'EXPIRED';

export type OrderStatus =
  | 'OFFER_ACCEPTED'
  | 'RESERVED'
  | 'INSPECTION'
  | 'DOCUMENTS'
  | 'PAYMENT'
  | 'TRANSFER'
  | 'MOVEMENT'
  | 'COMPLETED'
  | 'CANCELLED';

export type InspectionType =
  | 'BUYER_PHYSICAL'
  | 'VETERINARY_CLINICAL'
  | 'PREGNANCY_CONFIRMATION'
  | 'SEMEN_QUALITY'
  | 'GENOMIC_DOCUMENT_VERIFICATION'
  | 'IDENTITY_VERIFICATION';

export type InspectionResult = 'PASSED' | 'FAILED' | 'RECHECK_REQUIRED' | 'PENDING';

export type DocumentVisibility =
  | 'PUBLIC'
  | 'AFTER_INQUIRY'
  | 'AFTER_OFFER'
  | 'AFTER_RESERVATION'
  | 'PRIVATE';

export interface MarketplaceListingDocument {
  id: string;
  name: string;
  type: 'REGISTRY_CERT' | 'PEDIGREE_CERT' | 'GENOMIC_REPORT' | 'VET_HEALTH_CERT' | 'SEMEN_QUALITY_CERT' | 'EMBRYO_STAGE_CERT' | 'OWNERSHIP_TITLE';
  url: string;
  visibility: DocumentVisibility;
  issueDate?: string;
  verified: boolean;
}

export interface MarketplaceListingMedia {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'ULTRASOUND';
  url: string;
  title: string;
  isPrimary?: boolean;
}

export interface SemenBatchCommercialDetails {
  batchNumber: string;
  collectionDate: string;
  collectionCenter: string;
  cryoMethod: string;
  qualityGrade: string;
  motilityPercent: number;
  concentrationMml: number;
  availableDoses: number;
  storageVault: string;
  sexedType: 'CONVENTIONAL' | 'FEMALE_SEXED' | 'MALE_SEXED';
}

export interface EmbryoCommercialDetails {
  embryoCode: string;
  donorCowAnimalId: string;
  donorName: string;
  sireAnimalId: string;
  sireName: string;
  collectionDate: string;
  stage: string;
  grade: string;
  preservation: 'FROZEN' | 'FRESH';
  quantity: number;
  storageCenter: string;
  ivfOrInVivo: 'IVF' | 'IN_VIVO';
}

export interface MarketplaceListing {
  id: string;
  assetType: MarketplaceAssetType;
  animalId?: string; // Links to canonical Animal record
  semenDetails?: SemenBatchCommercialDetails;
  embryoDetails?: EmbryoCommercialDetails;

  // Seller & Organization
  sellerId: string;
  sellerName: string;
  sellerOrgId: string;
  sellerOrgName: string;
  sellerVerified: boolean;
  sellerRating?: number;
  farmId: string;
  farmName: string;
  region: string;

  // Commercial Pricing & Status
  listingType: MarketplaceListingType;
  status: MarketplaceListingStatus;
  currency: string;
  askingPrice: number;
  minimumPrice?: number;
  priceNegotiable: boolean;
  priceHistory?: Array<{ price: number; date: string; reason?: string }>;
  availableQuantity?: number;
  availableFrom: string;
  expiresAt?: string;

  // Presentation & Descriptions
  title: string;
  description: string;
  highlights: string[];
  media: MarketplaceListingMedia[];
  documents: MarketplaceListingDocument[];

  // Logistics & Terms
  logistics: {
    pickupAvailable: boolean;
    transportArrangedBy: 'SELLER' | 'BUYER' | 'BOTH';
    deliveryRadiusKm?: number;
    estimatedDeliveryCost?: number;
    notes?: string;
  };

  // Privacy & Access Rules
  privacy: {
    showExactLocation: boolean;
    showContactPhone: boolean;
    showContactEmail: boolean;
  };

  // System Trust Badges (derived from canonical records)
  trustBadges: {
    identityVerified: boolean;
    ownershipVerified: boolean;
    parentageDnaVerified: boolean;
    genotyped: boolean;
    carrierFreeStatus?: boolean;
    healthClearanceCurrent: boolean;
    registryCertified: boolean;
  };

  // Engagement Metrics
  viewCount: number;
  saveCount: number;
  inquiryCount: number;
  offerCount: number;

  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface MarketplaceOffer {
  id: string;
  listingId: string;
  listingTitle: string;
  assetType: MarketplaceAssetType;
  buyerId: string;
  buyerName: string;
  buyerOrgName: string;
  sellerId: string;
  sellerName: string;
  sellerOrgName?: string;
  amount: number;
  currency: string;
  status: OfferStatus;
  message?: string;
  counterAmount?: number;
  counterMessage?: string;
  counterDate?: string;
  expiresAt: string;
  createdAt: string;
  respondedAt?: string;
}

export interface MarketplaceInquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  buyerOrgName: string;
  sellerId: string;
  sellerName: string;
  sellerOrgName?: string;
  subject: string;
  message: string;
  inquiryType:
    | 'GENERAL'
    | 'PEDIGREE'
    | 'HEALTH_DOCUMENTS'
    | 'GENOMICS'
    | 'INSPECTION_REQUEST'
    | 'TRANSPORT'
    | 'PRICE';
  status: 'OPEN' | 'AWAITING_REPLY' | 'RESOLVED' | 'CLOSED';
  replies: Array<{
    senderId: string;
    senderName: string;
    message: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export interface MarketplaceReservation {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  reservedAt: string;
  expiresAt: string;
  depositRequired: boolean;
  depositAmount?: number;
  depositStatus: 'PAID' | 'PENDING' | 'WAIVED';
  inspectionRequired: boolean;
  status: ReservationStatus;
  conditions?: string;
  notes?: string;
}

export interface MarketplaceInspection {
  id: string;
  orderId: string;
  listingId: string;
  type: InspectionType;
  requestedBy: string;
  inspectorName?: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  result: InspectionResult;
  findings?: string;
  vetRegistrationNo?: string;
  photos?: string[];
  certificateUrl?: string;
}

export interface MarketplaceOrder {
  id: string;
  listingId: string;
  listingTitle: string;
  assetType: MarketplaceAssetType;
  animalId?: string;
  quantity: number;

  buyerId: string;
  buyerName: string;
  buyerOrgName: string;
  buyerFarmId?: string;
  buyerHerdId?: string;

  sellerId: string;
  sellerName: string;
  sellerOrgName: string;

  totalAmount: number;
  currency: string;
  status: OrderStatus;
  currentStep: number; // 1 to 8

  // Lifecycle stage tracking
  offerId?: string;
  reservationId?: string;
  inspectionId?: string;
  inspectionStatus: 'PENDING' | 'PASSED' | 'FAILED' | 'WAIVED';

  paymentDetails?: {
    paymentMethod: 'ESCROW' | 'BANK_WIRE' | 'DIRECT_SETTLEMENT';
    depositPaid: boolean;
    depositAmount?: number;
    finalPaymentPaid: boolean;
    paidAt?: string;
    transactionReference?: string;
  };

  ownershipTransferDetails?: {
    priorOwnerOrgId: string;
    newOwnerOrgId: string;
    transferEffectiveDate?: string;
    registryTransferCertificateUrl?: string;
    transferAuthorized: boolean;
  };

  movementDetails?: {
    originFarmName: string;
    destinationFarmName: string;
    departureDate?: string;
    arrivalDate?: string;
    transporterName?: string;
    healthClearanceCertNumber?: string;
    quarantineDaysRequired?: number;
    receivingConfirmed: boolean;
  };

  timeline: Array<{
    step: number;
    title: string;
    status: 'COMPLETED' | 'CURRENT' | 'UPCOMING';
    completedAt?: string;
    actor?: string;
    notes?: string;
  }>;

  createdAt: string;
  completedAt?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  assetType?: MarketplaceAssetType;
  minPrice?: number;
  maxPrice?: number;
  breed?: string;
  minSelectionIndex?: number;
  carrierFreeOnly?: boolean;
  createdDate: string;
  emailAlerts: boolean;
}

export interface HerdFitAnalysis {
  animalId: string;
  targetHerdId: string;
  overallCompatibilityScore: number; // 0 - 100
  breakdown: {
    excellentMatchPct: number;
    acceptablePct: number;
    avoidPct: number;
  };
  expectedInbreedingAvg: number; // e.g. 0.024 (2.4%)
  inbreedingRiskTier: 'LOW' | 'MODERATE' | 'HIGH';
  carrierRiskWarnings: string[];
  keyStrengths: string[];
  potentialWeaknesses: string[];
  traitComplementarity: Array<{
    trait: string;
    herdAvg: number;
    candidateEstimate: number;
    expectedProgenyAvg: number;
    impact: 'MAJOR_GAIN' | 'MODERATE_GAIN' | 'NEUTRAL' | 'CAUTION';
  }>;
}

export interface ExpectedProgenyPreview {
  sireAnimalId: string;
  sireName: string;
  damAnimalId: string;
  damName: string;
  expectedBreedComposition: string;
  expectedInbreedingF: number;
  parentAverageCED: number;
  parentAverageBW: number;
  parentAverageWW: number;
  parentAverageYW: number;
  parentAverageMARB: number;
  parentAverageREA: number;
  geneticConditionRisks: Array<{
    condition: string;
    sireStatus: string;
    damStatus: string;
    offspringRisk: string;
  }>;
  breedingObjectiveFitScore: number;
}
