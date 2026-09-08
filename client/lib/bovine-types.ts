export type Sex = 'MALE' | 'FEMALE' | 'BULL' | 'HEIFER' | string;
export type AnimalSex = Sex;

export type LifeStatus = 'ALIVE' | 'INACTIVE' | 'SOLD' | 'SLAUGHTERED' | 'DEAD' | 'ACTIVE' | 'SICK' | string;

export type UseStatus =
  | 'BREEDING_STOCK'
  | 'DONOR'
  | 'RECIPIENT'
  | 'AI_SIRE'
  | 'NATURAL_SERVICE_SIRE'
  | 'TEST_ANIMAL'
  | 'CULL_CANDIDATE'
  | 'RETIRED'
  | 'GENERAL';
export type LivestockUseStatus = UseStatus;

export type BirthType = 'SINGLE' | 'TWIN' | 'TRIPLET' | 'EMBRYO_TRANSFER' | 'CLONE' | 'OTHER';

export type HornStatus = 'POLLED' | 'HORNED' | 'DEHORNED' | 'SCURRED' | 'UNKNOWN';

export type RegistrationStatus = 'APPROVED' | 'PENDING' | 'DRAFT' | 'REJECTED';

export type IdentifierType =
  | 'EAR_TAG'
  | 'RFID_EID'
  | 'RFID'
  | 'DGR'
  | 'NATIONAL_LIVESTOCK_ID'
  | 'NATIONAL_ID'
  | 'REGISTRY_NUMBER'
  | 'INTERNAL_ID'
  | 'TATTOO'
  | 'BRAND';

export interface AnimalIdentifier {
  id: string;
  animalId: string;
  type: IdentifierType;
  value: string;
  issuer: string;
  country: string;
  isPrimary: boolean;
  issueDate: string;
  retirementDate?: string;
  status: 'ACTIVE' | 'RETIRED';
  location?: string;
  assignedDate?: string;
}

export interface AnimalBreedComposition {
  id: string;
  animalId: string;
  breedId: string;
  breedName: string;
  percentage: number;
  source: 'OWNER_REPORTED' | 'REGISTRY' | 'PEDIGREE_DERIVED' | 'GENOMIC_INFERRED';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  recordedDate: string;
  breedCode?: string;
}

export type ParentageStatus = 'PROPOSED' | 'RECORDED' | 'VERIFIED' | 'EXCLUDED' | 'DISPUTED';

export interface Parentage {
  sireId?: string;
  sireName?: string;
  sireIdentifier?: string;
  sireRegistration?: string;
  sireStatus?: ParentageStatus;
  sireBreed?: string;
  damId?: string;
  damName?: string;
  damIdentifier?: string;
  damRegistration?: string;
  damStatus?: ParentageStatus;
  damBreed?: string;
  source?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationMethod?: string;
  verificationStatus?: 'VERIFIED' | 'PENDING_TEST' | 'UNVERIFIED' | 'DISPUTED' | string;
  supportingAssayId?: string;
  inbreedingCoefficient?: number;
  completenessScore?: number;
  genomicConsistency?: 'CONSISTENT' | 'CONFLICT' | 'UNTESTED';
  lastUpdated?: string;
  notes?: string;
  sirePlaceholder?: string;
  damPlaceholder?: string;
  paternalGrandsireId?: string;
  paternalGrandsireName?: string;
  pgsName?: string;
  paternalGranddamId?: string;
  paternalGranddamName?: string;
  maternalGrandsireId?: string;
  maternalGrandsireName?: string;
  mgsName?: string;
  maternalGranddamId?: string;
  maternalGranddamName?: string;
}

export type OwnershipType = 'SOLE' | 'SYNDICATE' | 'CO_OWNER' | 'LEASED';

export interface AnimalOwnership {
  id: string;
  animalId: string;
  ownerName: string;
  ownerOrgId: string;
  ownershipType: OwnershipType;
  sharePercentage: number;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  transferNotes?: string;
}

export type MovementType =
  | 'INTER_FARM_TRANSFER'
  | 'HERD_REASSIGNMENT'
  | 'SALE'
  | 'QUARANTINE_ADMISSION'
  | 'SHOW_OR_EXPO'
  | 'VETERINARY_HOSPITAL';

export interface AnimalMovement {
  id: string;
  animalId: string;
  animalIds?: string[];
  status?: string;
  fromFarmId: string;
  fromFarmName: string;
  toFarmId: string;
  toFarmName: string;
  movementType: MovementType;
  movementDate: string;
  reason: string;
  referenceNumber: string;
  operatorName: string;
  notes?: string;
}

export type OperationalStatus =
  | 'NORMAL'
  | 'HEALTHY'
  | 'SICK'
  | 'QUARANTINE'
  | 'RECOVERY'
  | 'OFF_FEED'
  | 'OBSERVATION';

export interface DailyAnimalLog {
  id: string;
  animalId: string;
  date: string;
  operationalStatus: OperationalStatus;
  overallCondition?: number; // 1-5
  temperature?: number;
  temperatureC?: number;
  weight?: number;
  weightKg?: number;
  bcs?: number; // 1-5 body condition score
  appetiteScore?: number; // 1-5
  appetite?: string;
  activityScore?: number; // 1-5
  activity?: string;
  hydrationScore?: number; // 1-5
  hydration?: string;
  manureScore?: number; // 1-5
  lamenessScore?: number; // 1-5 (1=normal, 5=severely lame)
  ruminationMinutes?: number;
  lyingHours?: number;
  standingHours?: number;
  stepCount?: number;
  feedIntakeKg?: number;
  waterIntakeL?: number;
  heartRate?: number;
  heartRateBpm?: number;
  respirationRate?: number;
  respirationRateBpm?: number;
  isAbnormal: boolean;
  requiresReview?: boolean;
  requiresSupervisorReview?: boolean;
  reviewReason?: string;
  notes?: string;
  loggedBy: string;
}

export type DailyLog = DailyAnimalLog;

export type ObservationType =
  | 'TEMPERATURE'
  | 'APPETITE'
  | 'MANURE'
  | 'LAMENESS'
  | 'COUGH'
  | 'NASAL_DISCHARGE'
  | 'INJURY'
  | 'PARASITES'
  | 'BEHAVIOR'
  | 'HEAT_SIGNS'
  | 'BODY_CONDITION'
  | 'WEIGHT'
  | 'OTHER';

export type ObservationValueType = 'NUMERIC' | 'TEXT' | 'BOOLEAN' | 'SCORE';
export type ObservationSource = 'MANUAL' | 'SENSOR' | 'IMPORTED' | 'DERIVED' | 'SYSTEM';
export type ObservationSeverity = 'INFO' | 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL' | 'WARNING';
export type ObservationCategory = 'HEALTH' | 'BEHAVIOR' | 'FEEDING' | 'REPRODUCTION' | 'ENVIRONMENT' | 'GENETICS' | 'OTHER';

export interface AnimalObservation {
  id: string;
  animalId: string;
  date: string;
  type: ObservationType;
  valueType: ObservationValueType;
  numericValue?: number;
  textValue?: string;
  booleanValue?: boolean;
  scoreValue?: number;
  unit?: string;
  source: ObservationSource;
  severity: ObservationSeverity;
  isAbnormal: boolean;
  requiresReview: boolean;
  notes?: string;
  farmId?: string;
  herdId?: string;
  recordedBy?: string;
  loggedBy?: string;
  category?: string;
  summary?: string;
  details?: string;
  time?: string;
  observedBy?: string;
  status?: string;
}

export type TaskType =
  | 'HEALTH_CHECK'
  | 'VACCINATION'
  | 'SAMPLING'
  | 'WEIGHT_RECORDING'
  | 'HOOF_TRIMMING'
  | 'HEAT_CHECK'
  | 'MOVEMENT'
  | 'REVIEW'
  | 'TREATMENT'
  | 'OPU_PREPARATION'
  | 'PREGNANCY_CHECK'
  | 'HOOF_TRIM'
  | 'WEIGHING';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PENDING';

export interface AnimalTask {
  id: string;
  animalId: string;
  animalName: string;
  animalIdentifier: string;
  title: string;
  description?: string;
  notes?: string;
  taskType: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assigneeName: string;
  recurrence?: string;
  farmId: string;
  herdId: string;
  completedAt?: string;
  completedBy?: string;
  originEventId?: string;
}

export type MediaCategory =
  | 'PROFILE'
  | 'IDENTIFICATION'
  | 'BODY_CONDITION'
  | 'GROWTH'
  | 'MATERNAL_PHASE'
  | 'WEANING_PHASE'
  | 'YEARLING_PHASE'
  | 'PHENOTYPE'
  | 'CONFORMATION'
  | 'ULTRASOUND'
  | 'HEALTH'
  | 'WOUND'
  | 'TREATMENT'
  | 'LAMENESS'
  | 'HOOF'
  | 'VACCINATION'
  | 'REPRODUCTION'
  | 'ESTRUS'
  | 'AI'
  | 'EMBRYO_TRANSFER'
  | 'PREGNANCY'
  | 'CALVING'
  | 'NEWBORN'
  | 'PROGENY'
  | 'SEMEN'
  | 'EMBRYO'
  | 'GENETICS'
  | 'LAB_RESULT'
  | 'CERTIFICATE'
  | 'MARKETPLACE'
  | 'INSPECTION'
  | 'MOVEMENT'
  | 'FARM_VISIT'
  | 'MARKETPLACE_HERO'
  | 'WALKING_VIDEO'
  | 'HEALTH_CLINICAL'
  | 'SEMEN_ANALYSIS'
  | 'OTHER'
  | string;

export type MediaVisibility =
  | 'PRIVATE'
  | 'FARM_TEAM'
  | 'ORGANIZATION'
  | 'SUPERVISOR'
  | 'GOVERNMENT_AUTHORIZED'
  | 'MARKETPLACE_PUBLIC'
  | 'PUBLIC'
  | 'INTERNAL'
  | 'RESTRICTED';

export type MediaVerificationStatus =
  | 'UNVERIFIED'
  | 'PENDING_REVIEW'
  | 'VERIFIED'
  | 'REJECTED';

export type MarketplaceMediaStatus =
  | 'PRIVATE'
  | 'SELECTED_FOR_LISTING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLIC'
  | 'NOT_LISTED'
  | 'APPROVED_FOR_PUBLIC'
  | string;

export interface MediaLink {
  id: string;
  mediaAssetId: string;
  entityType:
    | 'DAILY_ANIMAL_LOG'
    | 'HEALTH_EVENT'
    | 'TREATMENT'
    | 'MEDICATION_ADMINISTRATION'
    | 'VACCINATION_EVENT'
    | 'PREVENTIVE_CARE_EVENT'
    | 'PHENOTYPE_OBSERVATION'
    | 'PERFORMANCE_TEST'
    | 'BREEDING_EVENT'
    | 'PREGNANCY_CHECK'
    | 'PREGNANCY'
    | 'CALVING_EVENT'
    | 'RECIPIENT_EVALUATION'
    | 'SEMEN_COLLECTION'
    | 'EMBRYO'
    | 'MARKETPLACE_LISTING'
    | 'MARKETPLACE_INSPECTION'
    | 'ANIMAL_MOVEMENT'
    | 'OTHER'
    | string;
  entityId: string;
  relationType?:
    | 'EVIDENCE'
    | 'BEFORE'
    | 'AFTER'
    | 'PROFILE'
    | 'IDENTIFICATION'
    | 'SUPPORTING'
    | 'INSPECTION'
    | 'PUBLIC_LISTING'
    | 'ULTRASOUND'
    | 'PROGRESS'
    | string;
  label?: string;
  linkedAt?: string;
}

export interface MediaComment {
  id: string;
  mediaId?: string;
  authorName: string;
  authorRole?: string;
  date: string;
  message?: string;
  text?: string;
  isResolved?: boolean;
}

export interface MediaAuditEntry {
  id: string;
  mediaId?: string;
  mediaAssetId?: string;
  action:
    | 'UPLOADED'
    | 'METADATA_EDITED'
    | 'LINKED_TO_RECORD'
    | 'UNLINKED'
    | 'VISIBILITY_CHANGED'
    | 'PROFILE_IMAGE_CHANGED'
    | 'MARKETPLACE_SELECTED'
    | 'MARKETPLACE_APPROVED'
    | 'VERIFIED'
    | 'REJECTED'
    | 'ARCHIVED'
    | 'RESTORED'
    | 'DELETED'
    | string;
  actorName: string;
  timestamp: string;
  details?: string;
}

export interface MediaAlbum {
  id: string;
  animalId: string;
  name?: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  isSystem?: boolean;
  isSystemAlbum?: boolean;
  category?: MediaCategory | 'CUSTOM';
  mediaIds: string[];
  createdAt: string;
  archived?: boolean;
}

export interface AnimalMedia {
  id: string;
  animalId: string;
  title: string;
  caption?: string;
  description?: string;
  mediaType: 'PHOTO' | 'DOCUMENT' | 'REGISTRATION_CERT' | 'GENOMIC_REPORT' | 'VIDEO' | 'IMAGE' | 'DOCUMENT_PREVIEW';
  url: string;
  thumbnailUrl?: string;
  takenAt?: string;
  capturedAt?: string;
  uploadedAt?: string;
  capturedBy?: string;
  uploadedBy: string;
  isIdentityPhoto: boolean;
  isProfile?: boolean;
  category: MediaCategory;
  visibility: MediaVisibility;
  verificationStatus: MediaVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNote?: string;
  marketplaceStatus?: MarketplaceMediaStatus;
  marketplaceSelected?: boolean;
  marketplaceOrder?: number;
  stage?: 'BIRTH' | 'MATERNAL' | 'WEANING' | 'YEARLING' | 'MATURE' | string;
  tags?: string[];
  links?: MediaLink[];
  comments?: MediaComment[];
  auditHistory?: MediaAuditEntry[];
  fileSize: string;
  checksum: string;
  mimeType?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  videoDurationSeconds?: number;
  ageMonthsAtCapture?: number;
  cameraModel?: string;
  isArchived?: boolean;
  farmId?: string;
  herdId?: string;
  notes?: string;
  videoChapters?: Array<{ timestamp: string; label: string; timestampSeconds?: number; title?: string }>;
}

export interface Animal {
  id: string;
  internalId: string;
  name: string;
  sex: Sex;
  birthDate: string;
  dateOfBirth?: string;
  birthWeightKg?: number;
  birthType?: string;
  lifeStatus: LifeStatus;
  useStatus: UseStatus;
  coatColor: string;
  hornStatus: HornStatus;
  ownerOrgId: string;
  ownerOrganizationId?: string;
  farmId: string;
  herdId: string;
  managementGroupId?: string;
  registrationStatus: RegistrationStatus;
  registrationNumber?: string;
  photoUrl: string;
  requiresReview: boolean;
  reviewReason?: string;
  latestConditionScore: number;
  openTaskCount: number;
  operationalStatus?: OperationalStatus;
  createdAt: string;
  updatedAt: string;
  primaryIdentifier?: string;
  primaryIdentifierType?: IdentifierType;
  sireId?: string;
  sireName?: string;
  damId?: string;
  damName?: string;
  classification?: 'FARM_ANIMAL' | 'BREEDING_STOCK';
  isBreedingStock?: boolean;
  frameSize?: string;
  dgr?: string;
  breed?: string;
  currentWeightKg?: number;
  adgKg?: number;
  inbreedingCoefficient?: number;
  ebvSummary?: Record<string, number>;
  geneticProfile?: any;
  identifiers?: any[];
  status?: string;
  avatarUrl?: string;
}

export interface Farm {
  id: string;
  code: string;
  name: string;
  type: 'DAIRY' | 'BEEF' | 'SEEDSTOCK' | 'GENOMIC_HUB' | 'COMMERCIAL' | 'RESEARCH';
  organizationId: string;
  country: string;
  region: string;
  district: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  elevation: number;
  active: boolean;
  headCount: number;
  herdCount: number;
  sickCount: number;
  reviewCount: number;
  openTasks: number;
  birthsThisMonth: number;
  deathsThisMonth: number;
  movementsThisMonth: number;
  capacity?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  environmentSummary: {
    airTempC: number;
    humidityPct: number;
    thi: number;
    heatStressRisk: 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE';
    beddingScore: number;
    mudScore: number;
    waterScore: number;
  };
  feedSummary: {
    offeredKg: number;
    consumedKg: number;
    refusalPct: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  country: string;
  headquarters?: string;
  primaryContact?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  activeFarmsCount?: number;
}

export interface Herd {
  id: string;
  farmId: string;
  code: string;
  name: string;
  purpose: string;
  breed?: string;
  headCount: number;
  groupCount: number;
  reviewCount: number;
  active: boolean;
  dailyLogCompletionPct: number;
  alertsCount: number;
}

export interface ManagementGroup {
  id: string;
  farmId: string;
  herdId: string;
  code: string;
  name: string;
  description: string;
  headCount: number;
  status: 'ACTIVE' | 'CLOSED';
  startDate: string;
  endDate?: string;
  dailyLogCompletionPct: number;
}

export interface FarmDailyLog {
  id: string;
  farmId: string;
  date: string;
  totalHead: number;
  presentHead: number;
  sickCount: number;
  treatmentCount: number;
  quarantineCount: number;
  criticalAlertCount: number;
  birthsCount: number;
  deathsCount: number;
  weaningCount: number;
  movementsInCount: number;
  movementsOutCount: number;
  heatObservedCount: number;
  breedingCount: number;
  pregnancyChecksCount: number;
  calvingsCount: number;
  feedOfferedKg: number;
  feedRefusedKg: number;
  feedConsumedKg: number;
  waterConsumedL: number;
  openHealthCases: number;
  overdueTasks: number;
  notes?: string;
  loggedBy: string;
}

export interface HerdDailyLog {
  id: string;
  herdId: string;
  farmId: string;
  date: string;
  headCount: number;
  normalCount: number;
  abnormalCount: number;
  logsCompleted: number;
  logsMissing: number;
  feedIntakeKg: number;
  waterIntakeL: number;
  notes?: string;
  loggedBy: string;
}

export interface GroupFeedingLog {
  id: string;
  farmId: string;
  herdId: string;
  managementGroupId?: string;
  groupName: string;
  date: string;
  rationName: string;
  rationVersion: string;
  batchReference: string;
  animalsFedCount: number;
  feedOfferedKg: number;
  feedRefusedKg: number;
  feedConsumedKg: number;
  dryMatterPct: number;
  dmiKgPerHead: number;
  concentrateKg: number;
  forageKg: number;
  supplementsKg: number;
  notes?: string;
  highRefusalFlag: boolean;
}

export interface FarmEnvironmentLog {
  id: string;
  farmId: string;
  date: string;
  airTempC: number;
  relativeHumidityPct: number;
  thi: number;
  heatStressRisk: 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE';
  rainfallMm: number;
  windSpeedKmh: number;
  barnTempC: number;
  ventilationStatus: 'OPTIMAL' | 'FAIR' | 'POOR';
  beddingScore: number;
  mudScore: number;
  pastureScore: number;
  shadeScore: number;
  waterAvailabilityScore: number;
  source: 'MANUAL' | 'SENSOR' | 'IMPORTED';
}

export interface FarmOperationalEvent {
  id: string;
  farmId: string;
  farmName: string;
  title: string;
  eventType:
    | 'BIOSECURITY'
    | 'DISEASE_OUTBREAK'
    | 'FEED_SHORTAGE'
    | 'WATER_SUPPLY'
    | 'EQUIPMENT_FAILURE'
    | 'WEATHER_EXTREME'
    | 'PASTURE_EVENT'
    | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  occurrenceTime: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  resolutionTime?: string;
  notes?: string;
  reportedBy: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'TASK' | 'MOVEMENT' | 'REVIEW' | 'SYSTEM' | 'REGISTRATION' | 'HEALTH' | 'BREEDING' | 'INFO' | string;
  entityType: 'ANIMAL' | 'FARM' | 'TASK' | 'INCIDENT' | string;
  entityId: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  linkUrl: string;
}

export type SystemRole =
  | 'FARMER'
  | 'TECHNICIAN'
  | 'HERD_MANAGER'
  | 'FARM_MANAGER'
  | 'REGISTRAR'
  | 'SUPERVISOR'
  | 'AUDITOR'
  | 'GOVERNMENT_OBSERVER'
  | 'ADMIN';

export type UserRole = SystemRole;

export interface UserSession {
  userId: string;
  name: string;
  userName?: string;
  email: string;
  role: SystemRole;
  organizationId: string;
  activeFarmId: string | 'ALL';
  activeHerdId: string | 'ALL';
}

// ==========================================
// PHASE 3 — GENETICS, PHENOTYPES & EVALUATION
// ==========================================

export interface Breed {
  id: string;
  code: string;
  name: string;
  origin?: string;
  originCountry?: string;
  purpose?: 'DAIRY' | 'BEEF' | 'DUAL_PURPOSE' | string;
  description?: string;
  active: boolean;
  populationCount?: number;
  registryStandardUrl?: string;
  registryStandards?: string;
  isDairy?: boolean;
  isBeef?: boolean;
  primaryColor?: string;
}

export type BreedDefinition = Breed;

export type TraitCategory =
  | 'GROWTH'
  | 'CARCASS'
  | 'REPRODUCTION'
  | 'EFFICIENCY'
  | 'CONFORMATION'
  | 'HEALTH'
  | 'MILK'
  | 'TEMPERAMENT'
  | 'CALVING'
  | 'PRODUCTION'
  | 'HEALTH_FERTILITY'
  | 'FERTILITY'
  | string;

export type TraitSelectionDirection =
  | 'INCREASE'
  | 'DECREASE'
  | 'INTERMEDIATE_OPTIMUM'
  | 'CONTEXT_DEPENDENT';

export interface TraitDefinition {
  id: string;
  code: string;
  name: string;
  category: TraitCategory;
  unit: string;
  direction: TraitSelectionDirection;
  isSexLimited: boolean;
  eligibleSex?: Sex;
  active: boolean;
  description: string;
  stages: string[];
  heritability?: number;
  minValidValue?: number;
  maxValidValue?: number;
  phenotypeCount: number;
  geneticEstimateCount: number;
  selectionIndexUse?: string[];
}

export interface MeasurementMethod {
  id: string;
  code: string;
  name: string;
  protocolVersion: string;
  description: string;
  active: boolean;
  equipment?: string;
  unit?: string;
  calculationFormula?: string;
  standardOperatingProcedure?: string;
  observationCount: number;
  metadataFields?: Record<string, string>;
}

export interface ContemporaryGroup {
  id: string;
  code: string;
  name: string;
  farmId: string;
  farmName: string;
  herdId?: string;
  herdName?: string;
  managementGroupId?: string;
  sexGroup?: 'MALE' | 'FEMALE' | 'MIXED';
  birthSeason?: string;
  feedingGroup?: string;
  managementSystem?: string;
  startDate?: string;
  endDate?: string;
  status: 'ACTIVE' | 'CLOSED';
  animalCount: number;
  phenotypeCount: number;
  warnings?: string[];
  notes?: string;
  description?: string;
}

export type PhenotypeStage =
  | 'BIRTH'
  | 'WEANING'
  | 'YEARLING'
  | '18_MONTH'
  | 'MATURE'
  | 'HARVEST'
  | 'LACTATION'
  | string;

export type PhenotypeQualityStatus =
  | 'VALIDATED'
  | 'RAW'
  | 'SUSPECT'
  | 'REJECTED'
  | 'CERTIFIED'
  | 'PROVISIONAL';

export interface PhenotypeObservation {
  id: string;
  animalId: string;
  animalName: string;
  animalIdentifier: string;
  traitId: string;
  traitCode: string;
  traitName: string;
  unit: string;
  traitUnit?: string;
  observationDate: string;
  observedDate?: string;
  stage: PhenotypeStage;
  rawValue: number;
  adjustedValue?: number;
  adjustmentReason?: string;
  animalAgeDays?: number;
  measurementMethodId?: string;
  measurementMethodCode?: string;
  measurementMethodName?: string;
  methodName?: string;
  deviceModel?: string;
  contemporaryGroupId?: string;
  contemporaryGroupCode?: string;
  contemporaryGroupName?: string;
  farmId?: string;
  farmName?: string;
  recordedBy?: string;
  observerName?: string;
  qualityStatus: PhenotypeQualityStatus;
  qualityFlags?: string[];
  notes?: string;
}

export interface PerformanceTestProtocolSection {
  title: string;
  content: string;
}

export interface PerformanceTest {
  id: string;
  code: string;
  name: string;
  testStation: string;
  location?: string;
  startDate: string;
  endDate?: string;
  durationDays?: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ACTIVE';
  protocolSections?: PerformanceTestProtocolSection[];
  protocolDescription?: string;
  supervisor?: string;
  traitsEvaluated?: string[];
  contemporaryGroupId?: string;
  contemporaryGroupCode?: string;
  enrolledCount: number;
  completedCount?: number;
}

export interface PerformanceTestEnrollment {
  id: string;
  performanceTestId: string;
  performanceTestCode?: string;
  testCode?: string;
  testName?: string;
  animalId: string;
  animalName: string;
  animalIdentifier: string;
  entryDate?: string;
  enrollmentDate?: string;
  exitDate?: string;
  entryWeightKg?: number;
  entryWeight?: number;
  exitWeightKg?: number;
  exitWeight?: number;
  averageDailyGainKg?: number;
  averageDailyGain?: number;
  feedConversionRatio?: number;
  residualFeedIntake?: number;
  ultrasoundRibeyeArea?: number;
  ultrasoundMarbling?: number;
  measurements?: any[];
  rank?: number;
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN' | 'DISQUALIFIED';
  contemporaryGroupId?: string;
  notes?: string;
}

export interface Laboratory {
  id: string;
  code: string;
  name: string;
  country: string;
  address?: string;
  accreditation?: string;
  accreditations?: string[];
  primaryAssays?: string[];
  email?: string;
  phone?: string;
  active: boolean;
  sampleVolume?: number;
  assayVolume?: number;
  averageTurnaroundDays?: number;
  turnaroundDaysAvg?: number;
  contactEmail?: string;
  contactPhone?: string;
  contactPerson?: string;
  organizationId?: string;
  organizationName?: string;
}

export type GeneticSampleType =
  | 'BLOOD_EDTA'
  | 'HAIR_FOLLICLE'
  | 'TISSUE_TSU'
  | 'SEMEN'
  | 'EMBRYO_BIOPSY'
  | 'NASAL_SWAB';

export type BiologicalSampleType = GeneticSampleType;

export type SampleProcessingStatus =
  | 'COLLECTED'
  | 'SHIPPED'
  | 'RECEIVED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'DESTROYED';

export type SampleStatus = SampleProcessingStatus;

export interface SampleChainOfCustodyEntry {
  timestamp: string;
  location: string;
  handledBy: string;
  action: string;
  notes?: string;
}

export interface GeneticSample {
  id: string;
  sampleCode: string;
  animalId: string;
  animalName: string;
  animalIdentifier: string;
  sampleType: GeneticSampleType;
  collectedDate: string;
  collectedBy: string;
  destinationLabId: string;
  destinationLabName?: string;
  receivedDate?: string;
  status: SampleProcessingStatus;
  barcode?: string;
  storageLocation?: string;
  storageTemp?: string;
  shippingTrackingNumber?: string;
  notes?: string;
  relatedEmbryoId?: string;
  assayCount?: number;
  chainOfCustody: SampleChainOfCustodyEntry[];
}

export type GenotypingPlatform =
  | 'ILLUMINA_BEADCHIP'
  | 'AFFYMETRIX_AXIOM'
  | 'TARGETED_GBS'
  | 'LONG_READ_WGS'
  | 'SHORT_READ_WGS'
  | string;

export type GenomeAssembly = 'ARS-UCD1.2' | 'UMD3.1' | 'ARS-LIC1.0' | string;

export type AssayQcStatus = 'PASSED' | 'WARNING' | 'FAILED' | 'PENDING';

export interface GenotypingAssay {
  id: string;
  code: string;
  name: string;
  platform: GenotypingPlatform;
  density: string;
  markerCount: number;
  laboratoryId: string;
  laboratoryName: string;
  assemblyVersion?: string;
  callRate: number;
  heterozygosityRate: number;
  sexConcordance: string;
  mendelianConflicts: number;
  qcStatus: AssayQcStatus;
  sampleId?: string;
  sampleCode?: string;
  animalId?: string;
  animalName?: string;
  animalIdentifier?: string;
  assayName?: string;
  labId?: string;
  labName?: string;
  chipName?: string;
  chipVersion?: string;
  genomeAssembly?: GenomeAssembly;
  totalMarkers?: number;
  calledMarkers?: number;
  callRatePct?: number;
  heterozygosityPct?: number;
  performedDate?: string;
  softwareVersion?: string;
  rawDataAssetUrl?: string;
  processedDataAssetUrl?: string;
  qcNotes?: string;
  parentageSupported?: boolean;
}

export type QcCheckCode =
  | 'CALL_RATE'
  | 'HETEROZYGOSITY'
  | 'SEX_CONCORDANCE'
  | 'PARENTAGE_CONCORDANCE'
  | 'SAMPLE_DUPLICATION'
  | 'MENDELIAN_ERRORS';

export interface GenotypeQcResult {
  id: string;
  assayId: string;
  checkCode: QcCheckCode;
  checkName: string;
  actualValue: number | string;
  threshold: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  message: string;
}

export interface GeneticMarker {
  id: string;
  code: string;
  name: string;
  chromosome: string;
  positionBp?: number;
  position?: number;
  refAllele: string;
  altAllele: string;
  genomeAssembly?: GenomeAssembly;
  geneSymbol?: string;
  gene?: string;
  inheritanceMode?: string;
  effectDescription?: string;
  resultCount?: number;
  active: boolean;
}

export interface AnimalMarkerResult {
  id: string;
  markerId: string;
  markerCode: string;
  animalId: string;
  animalName: string;
  animalIdentifier: string;
  genotype: string;
  assayId: string;
  qualityScore: number;
  recordedDate: string;
}

export type ConditionCategory =
  | 'GENETIC_DEFECT'
  | 'ECONOMIC_TRAIT'
  | 'COLOR_COAT'
  | 'HORNED_POLLED';

export type ConditionInheritance =
  | 'AUTOSOMAL_RECESSIVE'
  | 'AUTOSOMAL_DOMINANT'
  | 'CO_DOMINANT'
  | 'POLYGENIC';

export interface GeneticCondition {
  id: string;
  code: string;
  name: string;
  category: ConditionCategory;
  inheritance: ConditionInheritance;
  description: string;
  affectedBreeds: string[];
  testMethod: string;
}

export type ConditionStatus =
  | 'FREE'
  | 'CARRIER'
  | 'AFFECTED'
  | 'SUSPECTED'
  | 'INCONCLUSIVE'
  | 'NOT_TESTED'
  | 'TESTED_FREE'
  | 'INFERRED_FREE'
  | 'INFERRED_CARRIER';

export interface AnimalGeneticConditionResult {
  id: string;
  conditionId?: string;
  conditionCode: string;
  conditionName: string;
  animalId: string;
  animalName: string;
  animalIdentifier: string;
  status: ConditionStatus;
  testedDate: string;
  assayId?: string;
  labName?: string;
  certificateNumber?: string;
  labCertificateNumber?: string;
  source: 'LAB_TEST' | 'PEDIGREE_INFERRED' | 'RECORDED_CERTIFICATE' | 'RECORDED_TEST' | 'COMMERCIAL_CHIP';
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string;
}

export type EvaluationMethodology =
  | 'BLUP_ANIMAL_MODEL'
  | 'SSGBLUP_SINGLE_STEP'
  | 'GBLUP'
  | 'BAYESIAN_RIDGE_REGRESSION';

export type EvaluationRunStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'PUBLISHED'
  | 'FAILED';

export interface GeneticEvaluationRun {
  id: string;
  runCode: string;
  name: string;
  runDate: string;
  breedScope: string;
  methodology: EvaluationMethodology;
  softwareName: string;
  softwareVersion: string;
  geneticBase: string;
  baseYear: number;
  country: string;
  status: EvaluationRunStatus;
  animalCount: number;
  traitCount: number;
  traitsEvaluated?: string[];
  publishedDate?: string;
  modelMethod?: string;
  softwareEngine?: string;
  animalsEvaluatedCount?: number;
  completedAt?: string;
  createdAt?: string;
  genotypedCount?: number;
  snpChipDensity?: string;
  notes?: string;
}

export type EstimateType = 'EBV' | 'EPD' | 'GEBV' | 'DGV' | 'PARENT_AVERAGE';

export interface GeneticTraitEstimate {
  id: string;
  evaluationRunId?: string;
  evaluationRunCode?: string;
  runId?: string;
  animalId: string;
  animalName?: string;
  animalIdentifier?: string;
  traitId?: string;
  traitCode: string;
  traitName: string;
  estimateType: EstimateType;
  value: number;
  unit: string;
  accuracy: number;
  reliabilityPct?: number;
  reliability?: number;
  percentile?: number;
  rank?: number;
  totalRanked?: number;
  decile?: number;
  confidenceIntervalLower?: number;
  confidenceIntervalUpper?: number;
}

export type GeneticMetricType =
  | 'PEDIGREE_INBREEDING_F'
  | 'GENOMIC_INBREEDING_FROH'
  | 'GENOMIC_HETEROZYGOSITY'
  | 'RELATIONSHIP_COEFFICIENT'
  | 'MEAN_KINSHIP'
  | 'AVERAGE_RELATIONSHIP'
  | 'BREED_COMPOSITION';

export interface AnimalGeneticMetric {
  id: string;
  animalId: string;
  animalName: string;
  animalIdentifier: string;
  metricType: GeneticMetricType;
  value: number;
  formattedValue: string;
  method: string;
  calculationDate: string;
  source: 'PEDIGREE_ANALYSIS' | 'GENOMIC_ANALYSIS';
  evaluationRunId?: string;
  runId?: string;
  referencePopulation: string;
  percentileRank?: number;
  percentile?: number;
  notes?: string;
}

// ==========================================
// PHASE 4 — BREEDING PROGRAMS, MATING, GERMPLASM & GOVERNANCE
// ==========================================

export type BreedingObjectiveType =
  | 'BALANCED'
  | 'ECONOMIC'
  | 'CUSTOM'
  | 'TERMINAL'
  | 'MATERNAL'
  | 'DUAL_PURPOSE'
  | 'SPECIALTY'
  | 'HEALTH_EFFICIENCY';

export type BreedingProgramStatus = 'ACTIVE' | 'DRAFT' | 'SUSPENDED' | 'ARCHIVED';

export interface BreedingProgram {
  id: string;
  code: string;
  name: string;
  description: string;
  organizationId: string;
  organizationName: string;
  status: BreedingProgramStatus;
  objectiveType: BreedingObjectiveType;
  objectiveDescription?: string;
  breedScope: string[];
  candidateCount: number;
  evaluatedCount: number;
  genomicCount: number;
  parentageVerifiedCount: number;
  activePlansCount: number;
  latestEvaluationRunCode?: string;
  latestEvaluationDate?: string;
  selectionIndexId?: string;
  selectionIndexCode?: string;
  phenotypeCompletenessPct: number;
  createdAt: string;
  updatedAt: string;
}

export type BreedProgramRole = 'PRIMARY' | 'SECONDARY' | 'CROSS_SIRE' | 'COMPOSITE_BASE';

export interface BreedingProgramBreed {
  id: string;
  breedingProgramId: string;
  breedId: string;
  breedCode: string;
  breedName: string;
  role: BreedProgramRole;
  priority: number;
  targetPercentage?: number;
  notes?: string;
}

export type BreedingPopulationStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface BreedingPopulation {
  id: string;
  breedingProgramId: string;
  code: string;
  name: string;
  description: string;
  status: BreedingPopulationStatus;
  candidateCount: number;
  breedCompositionSummary: string;
  latestEvaluationRunCode?: string;
  averageInbreedingF: number;
  genotypeCoveragePct: number;
  farmIds?: string[];
  createdAt: string;
}

export interface SelectionIndexComponent {
  id: string;
  versionId?: string;
  traitId?: string;
  traitDefinitionId?: string;
  traitCode: string;
  traitName: string;
  category: 'PRODUCTION' | 'CONFORMATION' | 'HEALTH_FERTILITY' | 'EFFICIENCY' | 'CALVING' | 'GROWTH' | 'HEALTH' | 'FERTILITY' | string;
  weight: number;
  economicValue: number;
  direction: 'INCREASE' | 'DECREASE' | 'OPTIMUM';
  optimumRange?: [number, number];
  unit?: string;
  standardizedWeight: number;
  isOptional?: boolean;
}

export interface SelectionIndexVersion {
  id: string;
  selectionIndexId?: string;
  versionNumber?: string;
  version?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SUPERSEDED';
  publishedDate?: string;
  effectiveDate?: string;
  baseYear?: number;
  description?: string;
  notes?: string;
  baseValue?: number;
  scaleFactor?: number;
  components: SelectionIndexComponent[];
}

export interface SelectionIndex {
  id: string;
  code: string;
  name: string;
  description?: string;
  purpose: string;
  organizationId?: string;
  activeVersion?: string;
  programsUsingCount?: number;
  componentCount?: number;
  resultCount?: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
  versions: SelectionIndexVersion[];
}

export interface AnimalSelectionIndexResult {
  id: string;
  animalId: string;
  animalName: string;
  animalIdentifier: string;
  animalSex: Sex;
  selectionIndexId: string;
  indexCode: string;
  versionNumber: string;
  score: number;
  percentile: number;
  rank: number;
  totalRanked: number;
  reliability?: number;
  runId?: string;
  evaluationRunCode?: string;
  calculationDate: string;
}

export type MatingPlanStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface MatingPlan {
  id: string;
  code: string;
  name: string;
  breedingProgramId?: string;
  breedingProgramName?: string;
  populationId?: string;
  populationName?: string;
  farmId?: string;
  farmName?: string;
  herdId?: string;
  herdName?: string;
  season: string;
  status: MatingPlanStatus;
  createdBy?: string;
  approvedBy?: string;
  femaleCount: number;
  sireCount: number;
  evaluationRunCode?: string;
  selectionIndexCode?: string;
  maxInbreedingThreshold: number;
  carrierExclusion: boolean;
  recommendationsCount?: number;
  acceptedCount: number;
  rejectedCount: number;
  lockedCount?: number;
  createdAt: string;
  approvedAt?: string;
  notes?: string;
}

export type MatingRecommendationStatus = 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'LOCKED';

export interface MatingRecommendation {
  id: string;
  matingPlanId: string;
  femaleId?: string;
  femaleAnimalId?: string;
  femaleName: string;
  femaleIdentifier?: string;
  femalePrimaryIdentifier?: string;
  femaleBreed?: string;
  sireId?: string;
  sireAnimalId?: string;
  sireName: string;
  sireIdentifier?: string;
  sirePrimaryIdentifier?: string;
  sireBreed?: string;
  rank: number;
  score?: number;
  expectedInbreeding?: number;
  expectedInbreedingF?: number;
  genomicInbreeding?: number;
  relationshipCoefficient?: number;
  expectedProgenyIndex?: number;
  expectedProgenyTraits?: { traitCode: string; traitName: string; value: number; unit: string }[];
  expectedBreedComposition?: { breedName: string; percentage: number }[];
  geneticConditionRisks?: { conditionCode: string; conditionName: string; riskLevel: 'NONE' | 'POSSIBLE_CARRIER' | 'AT_RISK_AFFECTED'; explanation: string }[];
  warnings?: string[];
  status: MatingRecommendationStatus;
  rejectionReason?: string;
  overrideReason?: string;
  overrideByUserId?: string;
  isConditionCarrierRisk?: boolean;
  lockedAlternateSireId?: string;
  semenBatchId?: string;
  semenAvailableDoses?: number;
  notes?: string;
}

export type SemenCollectionMethod = 'ARTIFICIAL_VAGINA' | 'ELECTRO_EJACULATION' | string;

export interface SemenCollection {
  id: string;
  code?: string;
  sireId?: string;
  sireAnimalId?: string;
  sireName: string;
  sireIdentifier?: string;
  sirePrimaryIdentifier?: string;
  sireBreed?: string;
  collectionDate: string;
  centerId?: string;
  centerName?: string;
  volumeMl: number;
  concentrationMillionPerMl: number;
  motilityPct?: number;
  progressiveMotilityPct?: number;
  morphologyNormalPct?: number;
  normalMorphologyPct?: number;
  qualityGrade?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  semenType?: 'CONVENTIONAL' | 'SEXED_FEMALE' | 'SEXED_MALE' | 'RAW';
  batchesProduced?: number;
  totalDosesCreated?: number;
  dosesYielded?: number;
  qcApproved?: boolean;
  technician?: string;
  technicianName?: string;
  technicianId?: string;
  method?: string;
  notes?: string;
}

export type SemenBatchStatus = 'AVAILABLE' | 'QUARANTINED' | 'DEPLETED' | 'EXPIRED' | 'DISCARDED';

export interface SemenBatch {
  id: string;
  batchCode: string;
  collectionId: string;
  sireId: string;
  sireAnimalId?: string;
  sireName: string;
  sireIdentifier: string;
  sirePrimaryIdentifier?: string;
  sireBreed: string;
  collectionDate: string;
  freezeDate?: string;
  semenType: 'CONVENTIONAL' | 'SEXED_FEMALE' | 'SEXED_MALE';
  totalDoses: number;
  totalDosesProduced?: number;
  availableDoses: number;
  distributedDoses?: number;
  storageTank: string;
  storageCane: string;
  storageGoblet: string;
  storageLocation?: any;
  postThawMotilityPct?: number;
  normalMorphologyPct?: number;
  status: SemenBatchStatus;
  centerName: string;
  unitCost?: number;
  manufacturingDate?: string;
  expiryDate?: string;
}

export type EmbryoStage =
  | 'MORULA'
  | 'STAGE_4_MORULA'
  | 'EARLY_BLASTOCYST'
  | 'BLASTOCYST'
  | 'EXPANDED_BLASTOCYST'
  | 'HATCHING_BLASTOCYST'
  | 'HATCHED'
  | string;

export type EmbryoGrade = 'EXCELLENT_1' | 'GRADE_1_EXCELLENT' | 'GOOD_2' | 'FAIR_3' | 'POOR_4' | string;

export type EmbryoState = 'FRESH' | 'FROZEN' | 'TRANSFERRED' | 'DESTROYED' | 'DEGRADED' | string;
export type EmbryoPreservationMethod = 'SLOW_FREEZING' | 'VITRIFICATION' | 'FRESH' | string;

export interface Embryo {
  id: string;
  code: string;
  donorDamId?: string;
  donorDamAnimalId?: string;
  donorDamName?: string;
  donorDamIdentifier?: string;
  donorDamPrimaryIdentifier?: string;
  sireId?: string;
  sireAnimalId?: string;
  sireName?: string;
  sireIdentifier?: string;
  sirePrimaryIdentifier?: string;
  centerName?: string;
  origin?: 'IN_VIVO_FLUSH' | 'IN_VITRO_IVF' | 'IMPORTED' | string;
  productionDate?: string;
  productionType?: string;
  collectionDate?: string;
  fertilizationDate?: string;
  stage?: EmbryoStage;
  grade?: EmbryoGrade;
  ietsCode?: string;
  sex?: 'UNSEXED' | 'FEMALE' | 'MALE' | string;
  predictedSex?: string;
  state?: EmbryoState;
  status?: string;
  preservationMethod?: EmbryoPreservationMethod;
  storageTank?: string;
  storageCane?: string;
  storageCanister?: string;
  storageLocation?: any;
  isGenotyped?: boolean;
  genotypeStatus?: 'GENOTYPED' | 'PENDING' | 'UNTESTED' | string;
  genomicBiopsyDate?: string;
  notes?: string;
}

export type CLGrade = 'GRADE_1' | 'GRADE_2' | 'GRADE_3' | 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT' | string;
export type ETMethod = 'SURGICAL' | 'NON_SURGICAL' | 'LAPAROSCOPIC' | 'CERVICAL' | string;
export type ETPregnancyOutcome = 'PREGNANT' | 'OPEN' | 'UNKNOWN' | 'PENDING' | 'LOST' | string;

export interface EmbryoTransfer {
  id: string;
  embryoId: string;
  embryoCode: string;
  recipientAnimalId: string;
  recipientAnimalName?: string;
  recipientName?: string;
  recipientAnimalIdentifier?: string;
  recipientPrimaryIdentifier?: string;
  transferDate: string;
  technician?: string;
  technicianName?: string;
  technicianId?: string;
  method?: ETMethod;
  transferSite?: 'LEFT_HORN' | 'RIGHT_HORN';
  uterineHorn?: 'LEFT' | 'RIGHT' | string;
  clGrade?: CLGrade;
  pregnancyOutcome?: ETPregnancyOutcome;
  synchronizationProtocol?: string;
  corpusLuteumQuality?: 'GRADE_1' | 'GRADE_2' | 'GRADE_3';
  outcomeStatus?: 'PENDING_CHECK' | 'CONFIRMED_PREGNANT' | 'OPEN_NOT_PREGNANT' | 'ABORTION';
  outcomeNotes?: string;
  pregnancyCheckDate?: string;
  notes?: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  organizationId?: string;
  organizationName?: string;
  action: string;
  entityType: string;
  entityId: string;
  entityDisplay?: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  source: string;
  correlationId: string;
  occurredAt: string;
}

export interface Organization {
  id: string;
  code: string;
  name: string;
  type?:
    | 'NATIONAL_ASSOCIATION'
    | 'BREEDING_COMPANY'
    | 'COOPERATIVE'
    | 'RESEARCH_INSTITUTE'
    | 'COMMERCIAL_FARM'
    | 'SERVICE_LAB';
  country: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  farmCount?: number;
  memberCount?: number;
  activeProgramsCount?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: SystemRole;
  isActive: boolean;
  joinedDate: string;
  department?: string;
}

export interface ExportJob {
  id: string;
  title: string;
  scope: string;
  requestedBy: string;
  requestedAt: string;
  status: 'READY' | 'PROCESSING' | 'FAILED';
  format: 'CSV' | 'JSON' | 'EXCEL' | 'PDF';
  recordCount: number;
  fileSizeBytes?: number;
  downloadUrl?: string;
}

// ============================================================================
// PHASE 2 — HEALTH, REPRODUCTION, PRODUCTION, PREVENTIVE CARE & SENSORS
// ============================================================================

// --- Health & Veterinary Types ---
export type HealthEventStatus = 'OPEN' | 'UNDER_TREATMENT' | 'RESOLVED' | 'CHRONIC' | 'CANCELLED';
export type HealthEventSeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL' | 'HIGH';
export type AdministrationRoute =
  | 'INTRAMUSCULAR'
  | 'SUBCUTANEOUS'
  | 'INTRAVENOUS'
  | 'ORAL'
  | 'TOPICAL'
  | 'INTRAMAMMARY'
  | 'INTRAUTERINE'
  | 'INHALATION'
  | 'INTRANASAL'
  | string;
export type MedicationAdministrationStatus = 'GIVEN' | 'MISSED' | 'CANCELLED' | 'PENDING';
export type PreventiveCareType =
  | 'DEWORMING'
  | 'HOOF_TRIM'
  | 'HOOF_TRIMMING'
  | 'PARASITE_CONTROL'
  | 'DIPPING'
  | 'DEHORNING'
  | 'EXAMINATION'
  | 'VITAMIN_MINERAL'
  | 'OTHER'
  | string;

export interface HealthEvent {
  id: string;
  animalId: string;
  farmId?: string;
  openedAt: string;
  closedAt?: string;
  status: HealthEventStatus;
  reason?: string;
  severity: HealthEventSeverity;
  notes?: string;
  originObservationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Diagnosis {
  id: string;
  healthEventId?: string;
  animalId?: string;
  diagnosisCode?: string;
  diseaseCode?: string;
  diagnosisName?: string;
  diseaseName?: string;
  diagnosedAt: string;
  recordedById?: string;
  recordedByName?: string;
  diagnosedByName?: string;
  confidence?: 'CONFIRMED' | 'PROBABLE' | 'SUSPECT' | string;
  labConfirmed?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface Treatment {
  id: string;
  healthEventId?: string;
  animalId: string;
  treatmentName?: string;
  protocolName?: string;
  status?: string;
  medication?: string;
  dose?: number;
  doseUnit?: string;
  route?: AdministrationRoute;
  startedAt: string;
  endedAt?: string;
  withdrawalEnd?: string;
  milkWithdrawalDays?: number;
  meatWithdrawalDays?: number;
  veterinarianName?: string;
  recordedById?: string;
  recordedByName?: string;
  notes?: string;
  createdAt?: string;
}

export interface MedicationAdministration {
  id: string;
  animalId: string;
  treatmentId?: string;
  administeredAt: string;
  medication: string;
  dose?: number;
  doseUnit?: string;
  route?: AdministrationRoute;
  batchNumber?: string;
  status: MedicationAdministrationStatus;
  administeredById?: string;
  administeredByName?: string;
  notes?: string;
  createdAt?: string;
}

export interface VaccineCatalog {
  id: string;
  code: string;
  name: string;
  manufacturer?: string;
  diseaseTarget?: string;
  recommendedDose?: number;
  doseUnit?: string;
  route?: AdministrationRoute;
  active: boolean;
}

export interface VaccinationEvent {
  id: string;
  animalId: string;
  vaccineId: string;
  vaccineName?: string;
  administeredAt: string;
  dose?: number;
  doseUnit?: string;
  route?: AdministrationRoute;
  batchNumber?: string;
  expiryDate?: string;
  administeredById?: string;
  administeredByName?: string;
  nextDueAt?: string;
  boosterDueDate?: string;
  notes?: string;
  createdAt?: string;
}

export interface PreventiveCareEvent {
  id: string;
  animalId: string;
  farmId?: string;
  type: PreventiveCareType;
  performedAt?: string;
  administeredAt?: string;
  product?: string;
  productName?: string;
  batchNumber?: string;
  dose?: number;
  doseUnit?: string;
  route?: AdministrationRoute;
  performedById?: string;
  performedByName?: string;
  administeredByName?: string;
  nextDueAt?: string;
  nextDueDate?: string;
  notes?: string;
  createdAt?: string;
}

// --- Reproduction & Calving Types ---
export type BreedingCycleStatus = 'OPEN' | 'IN_BREEDING' | 'PREGNANT' | 'CLOSED' | 'CANCELLED' | 'ESTRUS' | 'INSEMINATED' | 'SYNCHRONIZED' | string;
export type BreedingEventType = 'NATURAL_SERVICE' | 'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER' | 'OTHER';
export type PregnancyResult = 'PREGNANT' | 'OPEN' | 'RECHECK' | 'DOUBTFUL' | 'CONFIRMED_PREGNANT';
export type PregnancyStatus = 'CONFIRMED' | 'ACTIVE' | 'ENDED_CALVED' | 'ENDED_ABORTED' | 'ENDED_LOST' | 'CALVED' | string;
export type CalvingEase = 'EASY' | 'NORMAL' | 'ASSISTED' | 'DIFFICULT_VET' | 'SURGICAL_CAESAREAN' | 'UNASSISTED' | string;
export type FetalPresentation = 'NORMAL_ANTERIOR' | 'POSTERIOR' | 'BREECH' | 'ABNORMAL' | 'ANTERIOR' | string;
export type BirthOutcome = 'LIVE' | 'STILLBORN' | 'DIED_NEONATAL';

export interface BreedingCycle {
  id: string;
  animalId?: string;
  femaleAnimalId?: string;
  cycleStart?: string;
  cycleEnd?: string;
  startDate?: string;
  endDate?: string;
  season?: string;
  status: BreedingCycleStatus;
  notes?: string;
  createdAt?: string;
}

export interface BreedingEvent {
  id: string;
  animalId?: string;
  breedingCycleId?: string;
  femaleAnimalId?: string;
  sireAnimalId?: string;
  sireId?: string;
  sireName?: string;
  sireIdentifier?: string;
  breedingType?: string;
  semenBatchId?: string;
  semenBatchCode?: string;
  semenStrawBatchCode?: string;
  semenSexType?: string;
  embryoId?: string;
  eventType?: BreedingEventType;
  eventAt?: string;
  breedingDate?: string;
  expectedCalvingDate?: string;
  technicianUserId?: string;
  technicianName?: string;
  synchronizationProtocol?: string;
  notes?: string;
  createdAt?: string;
}

export interface PregnancyCheck {
  id: string;
  breedingCycleId?: string;
  breedingEventId?: string;
  animalId: string;
  checkedAt?: string;
  checkDate?: string;
  result: PregnancyResult;
  gestationDaysEstimated?: number;
  estimatedDaysGestation?: number;
  fetusCount?: number;
  isTwins?: boolean;
  fetalSex?: 'MALE' | 'FEMALE' | 'UNKNOWN' | string;
  method: 'ULTRASOUND' | 'RECTAL_PALPATION' | 'BLOOD_PAG' | 'MILK_PAG' | string;
  examinerName?: string;
  veterinarianName?: string;
  notes?: string;
  createdAt?: string;
}

export interface Pregnancy {
  id: string;
  damId: string;
  damName?: string;
  damInternalId?: string;
  breedingCycleId?: string;
  breedingEventId?: string;
  sireAnimalId?: string;
  sireName?: string;
  status: PregnancyStatus;
  conceptionDate?: string;
  expectedCalvingDate?: string;
  confirmedAt?: string;
  endedAt?: string;
  notes?: string;
  createdAt?: string;
}

export interface CalvingEvent {
  id: string;
  damId: string;
  damName?: string;
  pregnancyId?: string;
  calvingAt?: string;
  calvingDate?: string;
  calvingTime?: string;
  ease?: CalvingEase;
  calvingEase?: CalvingEase;
  difficulty?: string;
  assistanceDetails?: string;
  birthType?: BirthType;
  presentation?: FetalPresentation;
  deliveryType?: string;
  totalBorn?: number;
  bornAlive?: number;
  bornDead?: number;
  maternalBehaviorScore?: number;
  colostrumQuality?: string;
  colostrumDeliveredHours?: number;
  recordedByName?: string;
  placentaStatus?: string;
  damCondition?: string;
  offspringCount?: number;
  calfCount?: number;
  farmId?: string;
  notes?: string;
  createdAt?: string;
}

export interface CalvingOffspring {
  id?: string;
  calvingEventId?: string;
  animalId?: string;
  calfAnimalId?: string;
  birthOrder?: number;
  name?: string;
  tagNumber?: string;
  sex?: Sex;
  birthOutcome: BirthOutcome;
  birthWeightKg?: number;
  coatColor?: string;
  calfType?: string;
  neonatalNotes?: string;
}

// --- Production (Generic & Agnostic) Types ---
export type ProductionPeriodType = 'LACTATION' | 'DRY_PERIOD' | 'GROWTH_FATTENING' | 'PERFORMANCE_TEST' | 'CUSTOM';
export type ProductionRecordType =
  | 'MILK_YIELD'
  | 'MILK_FAT_PCT'
  | 'MILK_PROTEIN_PCT'
  | 'SOMATIC_CELL_COUNT'
  | 'BODY_WEIGHT'
  | 'AVERAGE_DAILY_GAIN'
  | 'FEED_CONVERSION_RATIO'
  | 'WOOL_YIELD'
  | 'MEAT_QUALITY_SCORE'
  | 'MILK_TEST_DAY'
  | 'CUSTOM'
  | string;

export interface ProductionPeriod {
  id: string;
  animalId: string;
  farmId?: string;
  herdId?: string;
  type?: ProductionPeriodType;
  sequence?: number;
  startedAt?: string;
  endedAt?: string;
  status: 'ACTIVE' | 'CLOSED';
  startReason?: string;
  endReason?: string;
  notes?: string;
  createdAt?: string;

  // Compatibility fields
  periodType?: ProductionPeriodType | string;
  cycleNumber?: number;
  startDate?: string;
  endDate?: string;
}

export interface AnimalProductionRecord {
  id: string;
  animalId: string;
  productionPeriodId?: string;
  type?: ProductionRecordType;
  recordedAt?: string;
  value?: number;
  unit?: string;
  session?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'DAILY_TOTAL' | 'WEIGH_IN' | string;
  source?: 'MANUAL' | 'SENSOR' | 'IMPORTED' | string;
  qualityStatus?: 'RAW' | 'VALIDATED' | 'ADJUSTED' | 'SUSPECT' | 'REJECTED' | string;
  notes?: string;
  createdAt?: string;

  // Compatibility fields
  recordType?: string;
  recordDate?: string;
  milkYieldKg?: number;
  bodyWeightKg?: number;
  dailyGainKg?: number;
  fatPercentage?: number;
  proteinPercentage?: number;
  somaticCellCount?: number;
  daysInMilk?: number;
  recordedByName?: string;
}

// --- Connected Sensors & IoT Types ---
export type SensorDeviceType =
  | 'RUMEN_BOLUS'
  | 'EAR_TAG'
  | 'COLLAR'
  | 'LEG_PEDOMETER'
  | 'TAIL_MOUNT'
  | 'MILKING_INLINE'
  | 'ENVIRONMENTAL';

export type SensorMetricType =
  | 'RUMINATION_MINUTES'
  | 'ACTIVITY_INDEX'
  | 'BODY_TEMPERATURE'
  | 'STEP_COUNT'
  | 'LYING_TIME'
  | 'DRINKING_BOUTS'
  | 'HEART_RATE';

export type SensorReadingQuality = 'RAW' | 'FILTERED' | 'SUSPECT' | 'CALIBRATED' | 'VALIDATED' | 'ANOMALOUS';
export type SensorPlacement = 'LEFT_EAR' | 'RIGHT_EAR' | 'NECK_COLLAR' | 'RUMEN' | 'LEFT_REAR_LEG' | 'TAIL_BASE' | 'EAR' | 'COLLAR' | 'LEG' | 'TAIL';

export interface SensorDevice {
  id: string;
  farmId?: string;
  serialNumber: string;
  type?: SensorDeviceType;
  deviceType?: SensorDeviceType;
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  batteryLevelPct?: number;
  installedAt?: string;
  lastSeenAt?: string;
  currentAnimalId?: string;
  createdAt?: string;
}

export interface AnimalDeviceAssignment {
  id: string;
  animalId: string;
  deviceId: string;
  assignedAt: string;
  removedAt?: string;
  placement?: SensorPlacement;
  active?: boolean;
  status?: string;
  notes?: string;
}

export interface SensorReading {
  id: string;
  deviceId: string;
  animalId?: string;
  metricType: SensorMetricType;
  recordedAt?: string;
  timestamp?: string;
  value: number;
  unit: string;
  quality: SensorReadingQuality;
}

export interface DailySensorSummary {
  id: string;
  animalId: string;
  logDate: string;
  metricType: SensorMetricType;
  sampleCount: number;
  minValue?: number;
  maxValue?: number;
  avgValue?: number;
  sumValue?: number;
  lastValue?: number;
  unit?: string;
  abnormal: boolean;
  calculatedAt?: string;
}

// ==========================================
// SUPPLEMENTAL SPECIFICATION WORKFLOW MODELS
// ==========================================

export interface PhysicalMeasurements {
  rumpLengthCm?: number;
  rumpHeightCm?: number;
  lowerHeightCm?: number;
  backHeightCm?: number;
  bodyLengthCm?: number;
  ribDepthCm?: number;
  chestPerimeterCm?: number;
  bodyWidthCm?: number;
  scrotalCircumferenceCm?: number;
  measuredDate?: string;
  technician?: string;
}

export interface MaternalDevelopmentRecord {
  id: string;
  animalId: string;
  date: string;
  weightKg: number;
  waterIntake: 'LOW' | 'NORMAL' | 'HIGH' | string;
  waterIntakeLpd?: number;
  feedingSchedule: string;
  foodPreference: string;
  dietType: string;
  notes?: string;
  healthFollowUp?: string;
  abnormalObservation?: string;
  technician?: string;
}

export interface WeaningDevelopmentRecord {
  id: string;
  animalId: string;
  date: string;
  weightKg: number;
  cbc?: string; // Complete Blood Count or program metric
  dr?: string; // Dietary Regime
  sp?: number; // Scrotal Perimeter (cm)
  scrotalPerimeterCm?: number;
  drSp?: string; // Dietary Regime for SP
  drAc?: string; // Dietary Regime for AC
  drUs?: string; // Dietary Regime for Ultrasound
  ac?: string; // Abattoir Conformation
  acScore?: number | string;
  rea?: number; // Ribeye Area (cm²)
  reaCm2?: number;
  sft?: number; // Subcutaneous Fat Thickness (mm)
  sftMm?: number;
  mar?: number; // Marbling score (1-5 scale)
  marPercent?: number;
  waterIntake?: string;
  feedingSchedule?: string;
  foodPreference?: string;
  dietType?: string;
  technician?: string;
  contemporaryGroupId?: string;
  qualityStatus?: 'VERIFIED' | 'PRELIMINARY' | 'FLAGGED' | string;
  notes?: string;
}

export interface YearlingDevelopmentRecord {
  id: string;
  animalId: string;
  date: string;
  weightKg: number;
  cbc?: string;
  dr?: string;
  weightDate?: string;
  weightDietaryRegime?: string;
  sp?: number; // Scrotal Perimeter (cm)
  scrotalPerimeterCm?: number;
  dateSp?: string;
  spDate?: string;
  drSp?: string;
  spDietaryRegime?: string;
  ac?: string; // Abattoir Conformation
  acScore?: number | string;
  dateAc?: string;
  acDate?: string;
  drAc?: string;
  acDietaryRegime?: string;
  dateUs?: string;
  ultrasoundDate?: string;
  drUs?: string;
  ultrasoundDietaryRegime?: string;
  rea?: number; // Ribeye Area (cm²)
  reaCm2?: number;
  sft?: number; // Subcutaneous Fat Thickness (mm)
  sftMm?: number;
  mar?: number; // Marbling score
  marPercent?: number;
  waterIntake?: string;
  feedingSchedule?: string;
  foodPreference?: string;
  dietType?: string;
  technician?: string;
  qualityStatus?: 'VERIFIED' | 'PRELIMINARY' | 'FLAGGED' | string;
  notes?: string;
}

export type ReproductiveProcessStage =
  | 'PREPARATION'
  | 'SYNCHRONIZING'
  | 'INSEMINATED'
  | 'TRANSFERRED'
  | 'PREGNANCY_CHECK'
  | 'PREGNANT'
  | 'CALVED'
  | 'FAILED'
  | 'COMPLETED';

export interface ReproductiveProcessCheck {
  id?: string;
  checkDate?: string;
  date?: string;
  checkType?: string;
  stageLabel?: string;
  result: 'PREGNANT' | 'OPEN' | 'INCONCLUSIVE' | 'SUSPECT' | string;
  daysInGestation?: number;
  technician?: string;
  notes?: string;
}

export interface ReproductiveProcess {
  id: string;
  code?: string;
  status?: ReproductiveProcessStage;
  currentStage?: string;
  cowId?: string;
  cowAnimalId?: string;
  cowName?: string;
  cowEarTag?: string;
  cowBreed?: string;
  recipientDgr?: string;
  branding?: string;
  managementGroupId?: string;
  donorCowId?: string;
  donorCowAnimalId?: string;
  donorCowName?: string;
  donorCowBreed?: string;
  donorCowPlaceholder?: string;
  donorWeightKg?: number;
  donorBcsDay0?: number;
  donorIdentifier?: string;
  bullId?: string;
  bullAnimalId?: string;
  bullPlaceholder?: string;
  bullName?: string;
  bullDgr?: string;
  bullBreed?: string;
  semenBatch?: string;
  semenBatchId?: string;
  semenBatchCode?: string;
  embryoId?: string;
  embryoCode?: string;
  embryoBreed?: string;
  embryoBatch?: string;
  embryoStage?: string;
  embryoGrade?: string;
  embryoStageGrade?: string;
  isFreshEmbryo?: boolean;
  syncProtocol?: string;
  syncDate?: string;
  syncStartDate?: string;
  syncBatch?: string;
  removalDate?: string;
  syncDeviceRemovalDate?: string;
  treatmentsApplied?: string;
  syncTreatments?: string;
  procedureType: 'AI' | 'ET' | 'NATURAL' | 'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER' | string;
  procedureDate: string;
  technician?: string;
  procedureNotes?: string;
  donorBcs?: number;
  pregnancyChecks?: ReproductiveProcessCheck[];
  checks?: ReproductiveProcessCheck[];
  expectedCalvingDate?: string;
  actualCalvingDate?: string;
  notes?: string;
  createdAt?: string;
}

export interface RecipientEvaluation {
  id: string;
  code?: string;
  cowId?: string;
  cowAnimalId?: string;
  cowName?: string;
  cowEarTag?: string;
  earTag?: string;
  farmId?: string;
  farmName?: string;
  breed?: string;
  managementGroupId?: string;
  managementGroupName?: string;
  syncDate?: string;
  estrousCycle?: string;
  estrusScore?: number;
  clQuality?: string;
  bcs?: number;
  earTagVerified?: boolean;
  pregnancyDiagnosis?: 'PREGNANT' | 'OPEN' | 'SUSPECT' | 'PENDING' | string;
  lastPregnancyCheckDate?: string;
  finalObservation?: string;
  pregnancyOutcome?: string;
  healthAndStructure?: Record<string, any>;
  calfBirthDate?: string;
  calfNumber?: string;
  calfSex?: Sex;
  calfCoatColor?: string;
  calfBirthWeightKg?: number;
  calfType?: string;
  gestationDays?: number;
  gestationStatus?: string;
  calfOutcome?: string;
  verified?: boolean;
  evaluator?: string;
  overallStatus?: string;
  birthNotes?: string;
  calfAnimalId?: string;
  vaccinationHistory?: string;
  tickCount?: number;
  headEvaluation?: string;
  bodyType?: string;
  coatColor?: string;
  muscleDevelopment?: string;
  umbilicalCondition?: string;
  bodyStructure?: string;
  generalConformation?: string;
  evaluatorName?: string;
  evaluationDate?: string;
  status?: 'ELIGIBLE' | 'RECHECK_REQUIRED' | 'REJECTED' | 'APPROVED_FOR_ET' | string;
  notes?: string;
  photos?: string[];
}




