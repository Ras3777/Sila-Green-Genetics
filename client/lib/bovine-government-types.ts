// Bovine Government Observer Institutional Portal Types
// Defines regulatory oversight, surveillance, jurisdiction hierarchy,
// traceability, compliance, and institutional analytics data models.

export type JurisdictionLevel = 'NATIONAL' | 'REGION' | 'ZONE' | 'DISTRICT' | 'FARM';

export interface Jurisdiction {
  id: string;
  code: string;
  name: string;
  level: JurisdictionLevel;
  parentId?: string;
  parentName?: string;
  country: string;
  totalFarms: number;
  reportingFarms: number;
  registeredAnimals: number;
  activeBreedingStock: number;
  headquarters: string;
  leadOfficialName: string;
  contactEmail: string;
  status: 'ACTIVE' | 'SPECIAL_SURVEILLANCE' | 'INACTIVE';
}

export type ReportingPeriodKey =
  | 'TODAY'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'CURRENT_QUARTER'
  | 'YTD'
  | 'PREVIOUS_YEAR'
  | 'SNAPSHOT_2025'
  | 'CUSTOM';

export interface ReportingPeriod {
  key: ReportingPeriodKey;
  label: string;
  fromDate: string;
  toDate: string;
  isSnapshot?: boolean;
  snapshotDate?: string;
  comparisonPeriodLabel: string;
}

export type FreshnessStatus = 'CURRENT' | 'PARTIAL' | 'DELAYED' | 'INCOMPLETE' | 'HISTORICAL';

export interface DataFreshness {
  lastUpdated: string;
  reportingFarms: number;
  totalFarms: number;
  coveragePct: number;
  medianLagDays: number;
  status: FreshnessStatus;
  notes?: string;
}

export interface MetricDefinition {
  key: string;
  title: string;
  shortDescription: string;
  numerator: string;
  denominator: string;
  includedPopulation: string;
  excludedPopulation: string;
  dataSources: string[];
  calculationLagDays: number;
  version: string;
  regulatoryStandardRef?: string;
}

export interface InstitutionalKPI {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  unit?: string;
  changePct: number;
  previousPeriodValue: number;
  benchmarkValue?: number;
  target?: number;
  coveragePct: number;
  severity?: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
  category:
    | 'POPULATION'
    | 'FARMS'
    | 'HEALTH'
    | 'REPRODUCTION'
    | 'GENETICS'
    | 'COMPLIANCE'
    | 'MOVEMENT'
    | 'DATA_QUALITY'
    | 'PROGRAMS';
  definitionKey: string;
}

export type DiseaseConfirmedStatus = 'CONFIRMED' | 'SUSPECTED' | 'PROBABLE';

export interface DiseaseEvent {
  id: string;
  code: string;
  diseaseCode: string;
  diseaseName: string;
  confirmedStatus: DiseaseConfirmedStatus;
  farmId: string;
  farmName: string;
  regionId: string;
  regionName: string;
  districtId: string;
  districtName: string;
  animalsAffected: number;
  deathsCount: number;
  quarantinedCount: number;
  reportingSource: string;
  reportedAt: string;
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
  quarantineActive: boolean;
  notes?: string;
  investigationCaseId?: string;
}

export interface QuarantineRecord {
  id: string;
  farmId: string;
  farmName: string;
  regionId: string;
  regionName: string;
  reason: string;
  diseaseEventId?: string;
  startedAt: string;
  expectedEndAt?: string;
  endedAt?: string;
  animalsAffected: number;
  movementsBlocked: number;
  status: 'ACTIVE' | 'EXTENDED' | 'LIFTED' | 'VIOLATED';
  authorizedBy: string;
  notes?: string;
}

export interface VaccinationSurveillanceRecord {
  id: string;
  regionId: string;
  regionName: string;
  districtId: string;
  districtName: string;
  vaccineCode: string;
  vaccineName: string;
  eligibleAnimals: number;
  vaccinatedAnimals: number;
  overdueAnimals: number;
  coveragePct: number;
  targetPct: number;
  farmsBelowTargetCount: number;
  campaignStatus: 'COMPLIANT' | 'NEEDS_ATTENTION' | 'CRITICAL_GAP';
  lastCampaignDate: string;
}

export type MovementExceptionType =
  | 'QUARANTINE_BREACH'
  | 'MISSING_ORIGIN'
  | 'UNREGISTERED_DESTINATION'
  | 'UNCONFIRMED_ARRIVAL'
  | 'IMPOSSIBLE_DATES'
  | 'TAG_CONFLICT'
  | 'UNAUTHORIZED_CROSS_BORDER';

export interface MovementException {
  id: string;
  movementId: string;
  type: MovementExceptionType;
  severity: 'CRITICAL' | 'WARNING' | 'WATCH';
  farmOriginId: string;
  farmOriginName: string;
  farmDestId?: string;
  farmDestName?: string;
  animalId: string;
  animalName: string;
  animalIdentifier: string;
  occurredAt: string;
  details: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  investigationCaseId?: string;
}

export type ComplianceSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR';
export type ComplianceStatus = 'COMPLIANT' | 'UNDER_REVIEW' | 'NON_COMPLIANT' | 'NOT_ASSESSED';

export interface ComplianceAudit {
  id: string;
  code: string;
  farmId: string;
  farmName: string;
  regionId: string;
  regionName: string;
  type: 'ROUTINE_ANNUAL' | 'UNANNOUNCED_INSPECTION' | 'DISEASE_FOLLOW_UP' | 'TRACEABILITY_AUDIT';
  scope: string;
  auditorName: string;
  auditorId: string;
  openedAt: string;
  completedAt?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  scorePct: number;
  openFindings: number;
  criticalFindings: number;
  followUpDueAt?: string;
}

export interface ComplianceFinding {
  id: string;
  auditId?: string;
  farmId: string;
  farmName: string;
  category: 'IDENTITY' | 'VACCINATION' | 'MOVEMENT' | 'PEDIGREE' | 'REPORTING' | 'WELFARE' | 'BIOSECURITY';
  severity: ComplianceSeverity;
  description: string;
  policyReference: string;
  responsibleParty: string;
  openedAt: string;
  dueAt: string;
  status: 'OPEN' | 'CORRECTIVE_ACTION_ISSUED' | 'RESPONSE_SUBMITTED' | 'ACCEPTED' | 'RESOLVED';
  correctiveActionId?: string;
  notes?: string;
}

export interface CorrectiveAction {
  id: string;
  findingId: string;
  farmId: string;
  farmName: string;
  actionRequired: string;
  issuedBy: string;
  issuedAt: string;
  responseDeadline: string;
  farmResponse?: string;
  evidenceUrls?: string[];
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  outcome: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'RESOLVED';
  notes?: string;
}

export interface InspectionSchedule {
  id: string;
  farmId: string;
  farmName: string;
  regionName: string;
  scheduledDate: string;
  inspectorName: string;
  type: 'ANNUAL_CERTIFICATION' | 'DISEASE_SPOT_CHECK' | 'WELFARE_INSPECTION' | 'EXPORT_CLEARANCE';
  status: 'UPCOMING' | 'TODAY' | 'OVERDUE' | 'COMPLETED' | 'CANCELLED';
  previousScore?: number;
  checklistItemsCount: number;
}

export type DataQualityCategory =
  | 'IDENTITY'
  | 'PEDIGREE'
  | 'REPRODUCTION'
  | 'HEALTH'
  | 'MOVEMENT'
  | 'GENETICS';

export interface DataQualityIssue {
  id: string;
  category: DataQualityCategory;
  title: string;
  description: string;
  affectedEntityType: 'ANIMAL' | 'FARM' | 'PARENTAGE' | 'MOVEMENT' | 'PREGNANCY' | 'ASSAY';
  affectedEntityId: string;
  affectedEntityLabel: string;
  farmId: string;
  farmName: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  detectedAt: string;
  status: 'OPEN' | 'IN_REVIEW' | 'CORRECTED';
  proposedCorrection?: string;
}

export interface CrossFarmQualityScore {
  farmId: string;
  farmName: string;
  regionName: string;
  identityScore: number;
  pedigreeScore: number;
  healthScore: number;
  reproductionScore: number;
  movementScore: number;
  geneticsScore: number;
  overallScore: number;
  reportingLagDays: number;
  lastUpdated: string;
}

export type InvestigationType =
  | 'DISEASE_OUTBREAK'
  | 'IDENTITY_FRAUD'
  | 'MOVEMENT_IRREGULARITY'
  | 'PEDIGREE_CONFLICT'
  | 'GENETIC_PROGRAM_VIOLATION'
  | 'FARM_COMPLIANCE'
  | 'ANIMAL_WELFARE';

export interface InvestigationEvidence {
  id: string;
  caseId: string;
  entityType: 'ANIMAL' | 'FARM' | 'MOVEMENT' | 'DISEASE_EVENT' | 'LAB_ASSAY' | 'AUDIT_FINDING' | 'DOCUMENT';
  entityId: string;
  label: string;
  description: string;
  relation:
    | 'PRIMARY_SUSPECT'
    | 'VECTOR'
    | 'CONTAMINATED_ORIGIN'
    | 'TRANSIT_SITE'
    | 'AFFECTED_CONTACT'
    | 'SUPPORTING_PROOF'
    | 'FINDING_REF';
  relevanceScore: number;
  pinned: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  caseType: InvestigationType;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  priority: 'P1' | 'P2' | 'P3';
  leadInvestigatorName: string;
  leadInvestigatorId: string;
  jurisdictionId: string;
  jurisdictionName: string;
  status: 'OPEN' | 'EVIDENCE_COLLECTION' | 'HEARING' | 'CLOSED_ACTION_TAKEN' | 'CLOSED_UNSUBSTANTIATED';
  openedAt: string;
  closedAt?: string;
  summary: string;
  evidenceItems: InvestigationEvidence[];
  actionTaken?: string;
}

export interface GovernmentProgramTarget {
  metricName: string;
  baseline: number;
  current: number;
  target: number;
  unit: string;
  deadline: string;
}

export interface GovernmentProgram {
  id: string;
  code: string;
  name: string;
  description: string;
  leadAgency: string;
  category: 'AI_EXPANSION' | 'GENOTYPING_INITIATIVE' | 'BREED_CONSERVATION' | 'TRACEABILITY' | 'VACCINATION_CAMPAIGN';
  targets: GovernmentProgramTarget[];
  baselinePct?: number;
  currentPct?: number;
  targetPct?: number;
  totalEligible: number;
  completedCount: number;
  progressPct: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'BEHIND';
  regionsCovered: string[];
  startDate: string;
  targetCompletionDate: string;
}

export interface GovernmentOfficial {
  id: string;
  name: string;
  title: string;
  officeName: string;
  jurisdictionId: string;
  jurisdictionName: string;
  email: string;
  phone: string;
  role:
    | 'FEDERAL_OBSERVER'
    | 'FEDERAL_VET'
    | 'REGIONAL_DIRECTOR'
    | 'DISTRICT_VET'
    | 'COMPLIANCE_INSPECTOR'
    | 'PROGRAM_OFFICER'
    | 'GENETICS_ANALYST';
  activeAssignmentsCount: number;
}

export interface OfficialAssignment {
  id: string;
  officialId: string;
  officialName: string;
  targetType: 'JURISDICTION' | 'FARM_CLUSTER' | 'INSPECTION' | 'INVESTIGATION' | 'PROGRAM';
  targetId: string;
  targetName: string;
  assignedRole: string;
  effectiveFrom: string;
  effectiveTo?: string;
  active: boolean;
}

export interface StandardReport {
  id: string;
  code: string;
  title: string;
  category:
    | 'POPULATION'
    | 'HEALTH'
    | 'REPRODUCTION'
    | 'GENETICS'
    | 'MOVEMENT'
    | 'COMPLIANCE'
    | 'PROGRAMS';
  description: string;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  generatedAt: string;
  dataCutoff: string;
  version: string;
  coveragePct: number;
  fileSize: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  downloadUrl: string;
}

export interface InstitutionalExportJob {
  id: string;
  title: string;
  requesterName: string;
  dataset: string;
  scopeJurisdiction: string;
  format: 'CSV' | 'XLSX' | 'PDF' | 'JSON';
  status: 'PROCESSING' | 'READY' | 'EXPIRED';
  rowCount: number;
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export interface InstitutionalAlert {
  id: string;
  title: string;
  description: string;
  severity: 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';
  category: 'DISEASE' | 'MORTALITY' | 'MOVEMENT' | 'GENETICS' | 'COMPLIANCE' | 'REPORTING';
  detectedAt: string;
  jurisdictionName: string;
  affectedCount: number;
  triggerRule: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'DISMISSED';
  linkRoute: string;
  investigationCaseId?: string;
}

export interface InstitutionalTask {
  id: string;
  title: string;
  type: 'INSPECTION' | 'AUDIT' | 'FINDING_REVIEW' | 'MOVEMENT_EXCEPTION' | 'PARENTAGE_CONFLICT';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  farmName?: string;
  jurisdictionName: string;
  assignedOfficialName: string;
  linkRoute: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}
