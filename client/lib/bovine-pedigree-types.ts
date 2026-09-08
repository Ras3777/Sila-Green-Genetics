import { Animal, ParentageStatus } from './bovine-types';

export type PedigreeMode =
  | 'ancestors'
  | 'descendants'
  | 'sireLine'
  | 'damLine'
  | 'relationship'
  | 'founders'
  | 'dataQuality';

export type PedigreeOverlay =
  | 'identity'
  | 'parentage'
  | 'genetics'
  | 'performance'
  | 'breed'
  | 'conditions'
  | 'inbreeding'
  | 'marketplace'
  | 'dataQuality';

export type PedigreeDensity = 'minimal' | 'compact' | 'detailed';

export type PedigreeLayoutDirection = 'LR' | 'TB';

export type PedigreeNodeType =
  | 'pedigreeAnimal'
  | 'externalAncestor'
  | 'unknownAncestor'
  | 'aggregateProgeny'
  | 'founder';

export interface PedigreeTraitValue {
  traitCode: string;
  traitName: string;
  unit: string;
  value: number;
  accuracy?: number; // 0..100
  percentile?: number; // 0..100
  category?: string;
  direction?: 'INCREASE' | 'DECREASE';
}

export interface PedigreeConditionValue {
  conditionCode: string;
  conditionName: string;
  status: 'FREE' | 'CARRIER' | 'AFFECTED' | 'UNTESTED' | 'SUSPECTED' | string;
  testMethod?: string;
  certificateNumber?: string;
}

export interface PedigreeDataQualityFlag {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
}

export interface PedigreeNodeData {
  id: string;
  animalId: string;
  name: string;
  internalId?: string;
  primaryIdentifier?: string;
  registrationNumber?: string;
  sex: 'MALE' | 'FEMALE' | string;
  breed: string;
  breedComponents?: Array<{ breed: string; percentage: number }>;
  birthDate?: string;
  deathDate?: string;
  lifeStatus?: string;
  photoUrl?: string;
  generation: number; // 0 = root, 1 = parents, -1 = progeny
  branchRole?: 'SIRE' | 'DAM' | 'ROOT' | 'PROGENY' | 'FOUNDER';
  
  // Provenance & Parentage
  parentageStatus: ParentageStatus;
  verificationMethod?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  source?: string;
  
  // Genetics & Phenotypes
  traits?: PedigreeTraitValue[];
  selectedTraitValue?: PedigreeTraitValue;
  conditions?: PedigreeConditionValue[];
  actualWeights?: { birthKg?: number; weaningKg?: number; yearlingKg?: number };
  
  // Inbreeding & Bloodline
  inbreedingF?: number; // e.g. 0.03125 (3.125%)
  genomicF?: number;
  ancestralContribution?: number; // % contribution to root
  isFounder?: boolean;
  isCommonAncestor?: boolean;
  
  // Commercial
  marketplaceListing?: {
    id: string;
    status: string;
    price?: number;
    currency?: string;
    semenStraws?: number;
    title?: string;
  };
  
  // Data Quality
  dataQualityFlags?: PedigreeDataQualityFlag[];
  
  // Graph State
  isRoot: boolean;
  isSelected: boolean;
  isPathHighlighted: boolean;
  matchesSearch: boolean;
  isCollapsed?: boolean;
  hasChildren?: boolean;
  childrenCount?: number;
  progenyCount?: number;
  nodeType: PedigreeNodeType;
}

export interface PedigreeGraphNode {
  id: string;
  type: PedigreeNodeType;
  data: PedigreeNodeData;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PedigreeGraphEdge {
  id: string;
  source: string; // parent ID
  target: string; // child ID
  type: 'pedigreeRelationship';
  data: {
    relationshipType: 'SIRE' | 'DAM';
    status: ParentageStatus;
    method?: string;
    confidence?: string;
    isHighlighted?: boolean;
  };
}

export interface PedigreeGraphData {
  nodes: PedigreeGraphNode[];
  edges: PedigreeGraphEdge[];
  rootId: string;
  maxGeneration: number;
  totalKnownAncestors: number;
  totalPossibleAncestors: number;
  completenessPercentage: number;
  inbreedingF: number;
  genomicF?: number;
}

// Analytics Models
export interface GenerationCompleteness {
  generation: number;
  label: string;
  knownCount: number;
  totalCount: number;
  percentage: number;
  verifiedCount: number;
  recordedCount: number;
  unverifiedCount: number;
}

export interface CommonAncestorSummary {
  animalId: string;
  name: string;
  identifier: string;
  sex: 'MALE' | 'FEMALE' | string;
  paternalGeneration: number;
  maternalGeneration: number;
  contributionToF: number; // e.g. 0.0156
  kinshipContributionPct: number; // e.g. 50%
}

export interface FounderSummary {
  animalId: string;
  name: string;
  identifier: string;
  breed: string;
  bloodlineContributionPct: number;
  appearancesCount: number;
}

export interface PedigreeAnalyticsData {
  completenessByGen: GenerationCompleteness[];
  pedigreeCompletenessIndex: number;
  totalInbreedingF: number;
  genomicInbreedingF?: number;
  commonAncestors: CommonAncestorSummary[];
  founders: FounderSummary[];
  dataQualityIssues: Array<{
    animalId: string;
    animalName: string;
    flag: PedigreeDataQualityFlag;
  }>;
}

// Dialog States
export interface PotentialMateAnalysis {
  sire: Animal;
  dam: Animal;
  projectedInbreedingF: number;
  inbreedingRisk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  conditionCollisions: Array<{
    conditionCode: string;
    conditionName: string;
    sireStatus: 'FREE' | 'CARRIER' | 'AFFECTED' | 'UNTESTED';
    damStatus: 'FREE' | 'CARRIER' | 'AFFECTED' | 'UNTESTED';
    affectedProbabilityPct: number;
    carrierProbabilityPct: number;
    riskLevel: 'CRITICAL' | 'WARNING' | 'SAFE';
  }>;
  commonAncestors: CommonAncestorSummary[];
  complementarityTraits: Array<{
    traitCode: string;
    traitName: string;
    sireValue: number;
    damValue: number;
    projectedValue: number;
    unit: string;
  }>;
}

export interface SavedPedigreeView {
  id: string;
  name: string;
  mode: PedigreeMode;
  overlay: PedigreeOverlay;
  selectedTrait?: string;
  selectedCondition?: string;
  generationDepth: number;
  density: PedigreeDensity;
  direction: PedigreeLayoutDirection;
  createdDate: string;
}
