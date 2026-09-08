'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BreedingProgram,
  BreedingProgramBreed,
  BreedingPopulation,
  SelectionIndex,
  SelectionIndexVersion,
  AnimalSelectionIndexResult,
  MatingPlan,
  MatingRecommendation,
  MatingRecommendationStatus,
  SemenCollection,
  SemenBatch,
  Embryo,
  EmbryoTransfer,
  AuditEvent,
  Organization,
  OrganizationMembership,
  ExportJob,
  SystemRole,
} from './bovine-types';

// ==========================================
// INITIAL MOCK DATA
// ==========================================

export const initialOrganizations: Organization[] = [
  {
    id: 'org-1',
    code: 'NAT-BEEF-ASSOC',
    name: 'National Bovine Improvement Federation',
    type: 'NATIONAL_ASSOCIATION',
    country: 'USA',
    address: '1000 Genetic Way, Kansas City, MO',
    contactEmail: 'registrar@nbif-genetics.org',
    contactPhone: '+1 (816) 555-0199',
    farmCount: 42,
    memberCount: 380,
    activeProgramsCount: 3,
    isActive: true,
    createdAt: '2020-01-15',
  },
  {
    id: 'org-2',
    code: 'NUCLEUS-GENOMICS',
    name: 'Apex Bovine Genetics Cooperative',
    type: 'BREEDING_COMPANY',
    country: 'USA',
    address: '450 Science Park Dr, Madison, WI',
    contactEmail: 'operations@apexbovine.com',
    contactPhone: '+1 (608) 555-4420',
    farmCount: 18,
    memberCount: 120,
    activeProgramsCount: 2,
    isActive: true,
    createdAt: '2021-04-10',
  },
  {
    id: 'org-3',
    code: 'MIDWEST-RESEARCH',
    name: 'Midwest Agriculture Genomics Institute',
    type: 'RESEARCH_INSTITUTE',
    country: 'USA',
    address: '700 University Plaza, Ames, IA',
    contactEmail: 'trials@magi-ag.edu',
    farmCount: 6,
    memberCount: 45,
    activeProgramsCount: 1,
    isActive: true,
    createdAt: '2019-08-01',
  },
];

export const initialMemberships: OrganizationMembership[] = [
  {
    id: 'mem-1',
    organizationId: 'org-1',
    userId: 'usr-admin-1',
    userName: 'Dr. Sarah Jenkins',
    userEmail: 's.jenkins@nbif-genetics.org',
    role: 'ADMIN',
    isActive: true,
    joinedDate: '2020-02-01',
    department: 'Executive Board',
  },
  {
    id: 'mem-2',
    organizationId: 'org-1',
    userId: 'usr-reg-1',
    userName: 'Marcus Vance',
    userEmail: 'm.vance@nbif-genetics.org',
    role: 'REGISTRAR',
    isActive: true,
    joinedDate: '2021-06-15',
    department: 'Herdbook Registry',
  },
  {
    id: 'mem-3',
    organizationId: 'org-1',
    userId: 'usr-aud-1',
    userName: 'Elena Rostova',
    userEmail: 'e.rostova@audits.org',
    role: 'AUDITOR',
    isActive: true,
    joinedDate: '2022-01-10',
    department: 'Governance & Compliance',
  },
  {
    id: 'mem-4',
    organizationId: 'org-2',
    userId: 'usr-mgr-1',
    userName: 'Robert MacIntyre',
    userEmail: 'robert@apexbovine.com',
    role: 'HERD_MANAGER',
    isActive: true,
    joinedDate: '2021-09-01',
    department: 'Nucleus Herd Operations',
  },
  {
    id: 'mem-5',
    organizationId: 'org-2',
    userId: 'usr-tech-1',
    userName: 'Chloe Bennett',
    userEmail: 'c.bennett@apexbovine.com',
    role: 'TECHNICIAN',
    isActive: true,
    joinedDate: '2023-03-12',
    department: 'IVF & Germplasm Logistics',
  },
];

export const initialBreedingPrograms: BreedingProgram[] = [
  {
    id: 'bp-1',
    code: 'HOL-COMM-INDEX',
    name: 'National Commercial Dairy Profitability Program',
    description: 'Multi-trait balanced selection for commercial dairy herds focusing on high-solids milk yield, daughter fertility, longevity, and low somatic cell counts.',
    organizationId: 'org-1',
    organizationName: 'National Bovine Improvement Federation',
    status: 'ACTIVE',
    objectiveType: 'ECONOMIC',
    objectiveDescription: 'Maximizing lifetime net economic merit per cow with penalty constraints on calving difficulty and excessive stature.',
    breedScope: ['Holstein Friesian', 'Jersey'],
    candidateCount: 840,
    evaluatedCount: 792,
    genomicCount: 710,
    parentageVerifiedCount: 760,
    activePlansCount: 4,
    latestEvaluationRunCode: 'RUN-2026-02-GBLUP',
    latestEvaluationDate: '2026-02-18',
    selectionIndexId: 'idx-1',
    selectionIndexCode: 'NMI-2026',
    phenotypeCompletenessPct: 94.2,
    createdAt: '2022-03-01',
    updatedAt: '2026-02-28',
  },
  {
    id: 'bp-2',
    code: 'ANG-CARC-ADV',
    name: 'Apex Angus Marbling & Terminal Excellence',
    description: 'Intensive terminal line selection designed to maximize IMF (intramuscular fat), Ribeye Area, and Average Daily Gain while sustaining low birth weight.',
    organizationId: 'org-2',
    organizationName: 'Apex Bovine Genetics Cooperative',
    status: 'ACTIVE',
    objectiveType: 'TERMINAL',
    objectiveDescription: 'Prime carcass specification capture with high growth efficiency on standard 112-day central gain trials.',
    breedScope: ['Aberdeen Angus'],
    candidateCount: 420,
    evaluatedCount: 395,
    genomicCount: 388,
    parentageVerifiedCount: 405,
    activePlansCount: 3,
    latestEvaluationRunCode: 'RUN-2026-02-GBLUP',
    latestEvaluationDate: '2026-02-18',
    selectionIndexId: 'idx-2',
    selectionIndexCode: 'TSI-BEEF',
    phenotypeCompletenessPct: 97.5,
    createdAt: '2022-07-15',
    updatedAt: '2026-02-25',
  },
  {
    id: 'bp-3',
    code: 'DUAL-RESILIENT',
    name: 'Simmental-Angus Composite Maternal Line',
    description: 'Maternal hybrid vigor program combining Simmental maternal milk and frame with Angus fertility, low maintenance cost, and calf vigor.',
    organizationId: 'org-2',
    organizationName: 'Apex Bovine Genetics Cooperative',
    status: 'ACTIVE',
    objectiveType: 'MATERNAL',
    objectiveDescription: 'Producing elite F1 and composite replacement heifers with superior stayability, udder conformation, and calving ease.',
    breedScope: ['Simmental', 'Aberdeen Angus'],
    candidateCount: 310,
    evaluatedCount: 290,
    genomicCount: 260,
    parentageVerifiedCount: 285,
    activePlansCount: 2,
    latestEvaluationRunCode: 'RUN-2026-02-GBLUP',
    latestEvaluationDate: '2026-02-18',
    selectionIndexId: 'idx-3',
    selectionIndexCode: 'MAT-STAY',
    phenotypeCompletenessPct: 91.0,
    createdAt: '2023-01-10',
    updatedAt: '2026-02-20',
  },
];

export const initialBreedingProgramBreeds: BreedingProgramBreed[] = [
  {
    id: 'bpb-1',
    breedingProgramId: 'bp-1',
    breedId: 'breed-1',
    breedCode: 'HO',
    breedName: 'Holstein Friesian',
    role: 'PRIMARY',
    priority: 1,
    targetPercentage: 85,
    notes: 'Primary dairy production contributor.',
  },
  {
    id: 'bpb-2',
    breedingProgramId: 'bp-1',
    breedId: 'breed-3',
    breedCode: 'JE',
    breedName: 'Jersey',
    role: 'CROSS_SIRE',
    priority: 2,
    targetPercentage: 15,
    notes: 'Components crossbreeding sire line for solids enhancement.',
  },
  {
    id: 'bpb-3',
    breedingProgramId: 'bp-2',
    breedId: 'breed-2',
    breedCode: 'AN',
    breedName: 'Aberdeen Angus',
    role: 'PRIMARY',
    priority: 1,
    targetPercentage: 100,
    notes: 'Certified purebred black angus terminal line.',
  },
  {
    id: 'bpb-4',
    breedingProgramId: 'bp-3',
    breedId: 'breed-4',
    breedCode: 'SM',
    breedName: 'Simmental',
    role: 'COMPOSITE_BASE',
    priority: 1,
    targetPercentage: 50,
    notes: 'Maternal milk and growth base.',
  },
  {
    id: 'bpb-5',
    breedingProgramId: 'bp-3',
    breedId: 'breed-2',
    breedCode: 'AN',
    breedName: 'Aberdeen Angus',
    role: 'CROSS_SIRE',
    priority: 2,
    targetPercentage: 50,
    notes: 'Calving ease and carcass marbling infusion.',
  },
];

export const initialBreedingPopulations: BreedingPopulation[] = [
  {
    id: 'bpop-1',
    breedingProgramId: 'bp-1',
    code: 'POP-HOL-NUCLEUS',
    name: 'National Elite Dairy Nucleus Herd',
    description: 'Top 1% donor cows and progeny tested AI sires under intensive embryo transfer programs.',
    status: 'ACTIVE',
    candidateCount: 180,
    breedCompositionSummary: '100% Holstein Purebred',
    latestEvaluationRunCode: 'RUN-2026-02-GBLUP',
    averageInbreedingF: 0.042,
    genotypeCoveragePct: 98.9,
    farmIds: ['farm-1'],
    createdAt: '2022-04-01',
  },
  {
    id: 'bpop-2',
    breedingProgramId: 'bp-1',
    code: 'POP-HOL-COMM',
    name: 'Commercial Producer Multi-Herd Cohort',
    description: 'Participating cooperative commercial herds tracking daughters for herd life and health traits.',
    status: 'ACTIVE',
    candidateCount: 660,
    breedCompositionSummary: '92% Holstein, 8% Jersey Cross',
    latestEvaluationRunCode: 'RUN-2026-02-GBLUP',
    averageInbreedingF: 0.035,
    genotypeCoveragePct: 82.5,
    farmIds: ['farm-1', 'farm-2'],
    createdAt: '2022-05-15',
  },
  {
    id: 'bpop-3',
    breedingProgramId: 'bp-2',
    code: 'POP-ANG-CENTRAL',
    name: 'Apex Seedstock Bull Nucleus',
    description: 'Central performance tested yearling bull cohort enrolled in Calan gate feed efficiency trials.',
    status: 'ACTIVE',
    candidateCount: 220,
    breedCompositionSummary: '100% Angus Registered',
    latestEvaluationRunCode: 'RUN-2026-02-GBLUP',
    averageInbreedingF: 0.038,
    genotypeCoveragePct: 99.1,
    farmIds: ['farm-2'],
    createdAt: '2022-08-01',
  },
];

export const initialSelectionIndexes: SelectionIndex[] = [
  {
    id: 'idx-1',
    code: 'NMI-2026',
    name: 'Net Merit Index (NMI-2026)',
    description: 'Lifetime profitability economic index balancing milk fat and protein yield with daughter pregnancy rate, productive life, and mastitis resistance.',
    purpose: 'Commercial Dairy Net Lifetime Profitability ($ USD)',
    activeVersion: 'v3.2',
    programsUsingCount: 2,
    componentCount: 6,
    resultCount: 792,
    status: 'ACTIVE',
    createdAt: '2023-01-01',
    updatedAt: '2026-01-10',
    versions: [
      {
        id: 'ver-1-1',
        selectionIndexId: 'idx-1',
        versionNumber: 'v3.2',
        status: 'PUBLISHED',
        publishedDate: '2026-01-10',
        description: 'Updated 2026 economic weights reflecting higher feed costs and increased value of protein components.',
        baseValue: 0,
        scaleFactor: 1.0,
        components: [
          {
            id: 'c-1',
            versionId: 'ver-1-1',
            traitId: 'trait-1',
            traitCode: 'PROT_KG',
            traitName: 'Protein Yield',
            category: 'PRODUCTION',
            weight: 3.2,
            economicValue: 7.2,
            direction: 'INCREASE',
            unit: 'kg',
            standardizedWeight: 0.28,
          },
          {
            id: 'c-2',
            versionId: 'ver-1-1',
            traitId: 'trait-2',
            traitCode: 'FAT_KG',
            traitName: 'Fat Yield',
            category: 'PRODUCTION',
            weight: 2.8,
            economicValue: 5.4,
            direction: 'INCREASE',
            unit: 'kg',
            standardizedWeight: 0.22,
          },
          {
            id: 'c-3',
            versionId: 'ver-1-1',
            traitId: 'trait-3',
            traitCode: 'PL_MONTHS',
            traitName: 'Productive Life',
            category: 'HEALTH_FERTILITY',
            weight: 4.5,
            economicValue: 28.0,
            direction: 'INCREASE',
            unit: 'months',
            standardizedWeight: 0.20,
          },
          {
            id: 'c-4',
            versionId: 'ver-1-1',
            traitId: 'trait-4',
            traitCode: 'DPR_PCT',
            traitName: 'Daughter Pregnancy Rate',
            category: 'HEALTH_FERTILITY',
            weight: 3.0,
            economicValue: 18.5,
            direction: 'INCREASE',
            unit: '%',
            standardizedWeight: 0.14,
          },
          {
            id: 'c-5',
            versionId: 'ver-1-1',
            traitId: 'trait-5',
            traitCode: 'SCS_LOG',
            traitName: 'Somatic Cell Score',
            category: 'HEALTH_FERTILITY',
            weight: -2.5,
            economicValue: -65.0,
            direction: 'DECREASE',
            unit: 'log2',
            standardizedWeight: 0.10,
          },
          {
            id: 'c-6',
            versionId: 'ver-1-1',
            traitId: 'trait-6',
            traitCode: 'SCE_PCT',
            traitName: 'Sire Calving Ease',
            category: 'CALVING',
            weight: -1.2,
            economicValue: -12.0,
            direction: 'DECREASE',
            unit: '%',
            standardizedWeight: 0.06,
          },
        ],
      },
    ],
  },
  {
    id: 'idx-2',
    code: 'TSI-BEEF',
    name: 'Terminal Sire Index (TSI-Beef)',
    description: 'Terminal beef index maximizing yearling carcass value, dressing percentage, and marbling score with moderate birth weight constraints.',
    purpose: 'Terminal Carcass Profit Per Feedlot Progeny ($ USD)',
    activeVersion: 'v2.0',
    programsUsingCount: 1,
    componentCount: 5,
    resultCount: 395,
    status: 'ACTIVE',
    createdAt: '2023-05-10',
    updatedAt: '2025-11-20',
    versions: [
      {
        id: 'ver-2-1',
        selectionIndexId: 'idx-2',
        versionNumber: 'v2.0',
        status: 'PUBLISHED',
        publishedDate: '2025-11-20',
        description: 'Standardized 2025 grid carcass pricing matrix incorporating Certified Angus Beef premium increments.',
        baseValue: 100,
        scaleFactor: 1.0,
        components: [
          {
            id: 'c-201',
            traitId: 'trait-7',
            traitCode: 'CW_KG',
            traitName: 'Carcass Weight',
            category: 'PRODUCTION',
            weight: 1.5,
            economicValue: 3.8,
            direction: 'INCREASE',
            unit: 'kg',
            standardizedWeight: 0.30,
          },
          {
            id: 'c-202',
            traitId: 'trait-8',
            traitCode: 'MARB_SCORE',
            traitName: 'Marbling Score',
            category: 'CONFORMATION',
            weight: 2.4,
            economicValue: 45.0,
            direction: 'INCREASE',
            unit: 'score',
            standardizedWeight: 0.35,
          },
          {
            id: 'c-203',
            traitId: 'trait-9',
            traitCode: 'REA_CM2',
            traitName: 'Ribeye Area',
            category: 'CONFORMATION',
            weight: 1.8,
            economicValue: 14.5,
            direction: 'INCREASE',
            unit: 'cm²',
            standardizedWeight: 0.20,
          },
          {
            id: 'c-204',
            traitId: 'trait-10',
            traitCode: 'RFI_KG',
            traitName: 'Residual Feed Intake',
            category: 'EFFICIENCY',
            weight: -1.6,
            economicValue: -22.0,
            direction: 'DECREASE',
            unit: 'kg/day',
            standardizedWeight: 0.15,
          },
        ],
      },
    ],
  },
  {
    id: 'idx-3',
    code: 'MAT-STAY',
    name: 'Maternal Stayability & Replacement Index',
    description: 'Designed for producing resilient replacement females with sustained longevity (stayability past 6 years), optimal maternal milk, and docility.',
    purpose: 'Maternal Replacement Cow Lifetime Efficiency ($ USD)',
    activeVersion: 'v1.4',
    programsUsingCount: 1,
    componentCount: 4,
    resultCount: 290,
    status: 'ACTIVE',
    createdAt: '2024-02-01',
    updatedAt: '2025-08-15',
    versions: [
      {
        id: 'ver-3-1',
        selectionIndexId: 'idx-3',
        versionNumber: 'v1.4',
        status: 'PUBLISHED',
        publishedDate: '2025-08-15',
        description: 'Focus on cow survival to 5th parity in harsh pasture environments.',
        baseValue: 50,
        scaleFactor: 1.0,
        components: [
          {
            id: 'c-301',
            traitId: 'trait-11',
            traitCode: 'STAY_PCT',
            traitName: 'Stayability (6 yrs)',
            category: 'HEALTH_FERTILITY',
            weight: 3.5,
            economicValue: 32.0,
            direction: 'INCREASE',
            unit: '%',
            standardizedWeight: 0.40,
          },
          {
            id: 'c-302',
            traitId: 'trait-12',
            traitCode: 'CED_PCT',
            traitName: 'Calving Ease Direct',
            category: 'CALVING',
            weight: 2.0,
            economicValue: 16.0,
            direction: 'INCREASE',
            unit: '%',
            standardizedWeight: 0.25,
          },
          {
            id: 'c-303',
            traitId: 'trait-13',
            traitCode: 'MILK_MAT_KG',
            traitName: 'Maternal Milk',
            category: 'PRODUCTION',
            weight: 1.2,
            economicValue: 8.0,
            direction: 'OPTIMUM',
            optimumRange: [15, 25],
            unit: 'kg',
            standardizedWeight: 0.20,
          },
          {
            id: 'c-304',
            traitId: 'trait-14',
            traitCode: 'DOC_SCORE',
            traitName: 'Docility Score',
            category: 'HEALTH_FERTILITY',
            weight: 1.0,
            economicValue: 12.0,
            direction: 'INCREASE',
            unit: 'score',
            standardizedWeight: 0.15,
          },
        ],
      },
    ],
  },
];

export const initialAnimalIndexResults: AnimalSelectionIndexResult[] = [
  {
    id: 'air-1',
    animalId: 'anim-1',
    animalName: 'Altair Benchmark ET',
    animalIdentifier: 'US-9901421',
    animalSex: 'MALE',
    selectionIndexId: 'idx-1',
    indexCode: 'NMI-2026',
    versionNumber: 'v3.2',
    score: 864,
    percentile: 98,
    rank: 4,
    totalRanked: 792,
    evaluationRunCode: 'RUN-2026-02-GBLUP',
    calculationDate: '2026-02-18',
  },
  {
    id: 'air-2',
    animalId: 'anim-2',
    animalName: 'Cloverdale Supernova Dam 91',
    animalIdentifier: 'US-8840219',
    animalSex: 'FEMALE',
    selectionIndexId: 'idx-1',
    indexCode: 'NMI-2026',
    versionNumber: 'v3.2',
    score: 795,
    percentile: 94,
    rank: 18,
    totalRanked: 792,
    evaluationRunCode: 'RUN-2026-02-GBLUP',
    calculationDate: '2026-02-18',
  },
  {
    id: 'air-3',
    animalId: 'anim-3',
    animalName: 'Apex Titan Maverick 55',
    animalIdentifier: 'US-7719203',
    animalSex: 'MALE',
    selectionIndexId: 'idx-2',
    indexCode: 'TSI-BEEF',
    versionNumber: 'v2.0',
    score: 188,
    percentile: 99,
    rank: 2,
    totalRanked: 395,
    evaluationRunCode: 'RUN-2026-02-GBLUP',
    calculationDate: '2026-02-18',
  },
  {
    id: 'air-4',
    animalId: 'anim-4',
    animalName: 'Bella Vista Cow 102',
    animalIdentifier: 'US-6628104',
    animalSex: 'FEMALE',
    selectionIndexId: 'idx-2',
    indexCode: 'TSI-BEEF',
    versionNumber: 'v2.0',
    score: 142,
    percentile: 88,
    rank: 34,
    totalRanked: 395,
    evaluationRunCode: 'RUN-2026-02-GBLUP',
    calculationDate: '2026-02-18',
  },
];

export const initialMatingPlans: MatingPlan[] = [
  {
    id: 'plan-1',
    code: 'PLAN-2026-SPRING-AI',
    name: 'Spring 2026 Commercial Dairy AI Allocation',
    breedingProgramId: 'bp-1',
    breedingProgramName: 'National Commercial Dairy Profitability Program',
    populationId: 'bpop-1',
    populationName: 'National Elite Dairy Nucleus Herd',
    farmId: 'farm-1',
    farmName: 'Pine Valley Dairy',
    season: 'Spring 2026',
    status: 'APPROVED',
    createdBy: 'Dr. Sarah Jenkins',
    approvedBy: 'Marcus Vance',
    femaleCount: 65,
    sireCount: 4,
    evaluationRunCode: 'RUN-2026-02-GBLUP',
    selectionIndexCode: 'NMI-2026',
    maxInbreedingThreshold: 6.25,
    carrierExclusion: true,
    recommendationsCount: 65,
    acceptedCount: 60,
    rejectedCount: 5,
    createdAt: '2026-02-20',
    approvedAt: '2026-02-24',
    notes: 'Prioritize high protein yield and sexed female semen for top 40% genetic merit heifers.',
  },
  {
    id: 'plan-2',
    code: 'PLAN-2026-ANGUS-TERM',
    name: '2026 Terminal Angus Nucleus Mating Trial',
    breedingProgramId: 'bp-2',
    breedingProgramName: 'Apex Angus Marbling & Terminal Excellence',
    populationId: 'bpop-3',
    populationName: 'Apex Seedstock Bull Nucleus',
    farmId: 'farm-2',
    farmName: 'High Meadow Angus',
    season: 'Fall 2026',
    status: 'DRAFT',
    createdBy: 'Robert MacIntyre',
    femaleCount: 40,
    sireCount: 3,
    evaluationRunCode: 'RUN-2026-02-GBLUP',
    selectionIndexCode: 'TSI-BEEF',
    maxInbreedingThreshold: 5.0,
    carrierExclusion: true,
    recommendationsCount: 40,
    acceptedCount: 32,
    rejectedCount: 8,
    createdAt: '2026-02-25',
    notes: 'Excluding any carriers for Arthrogryposis Multiplex (AM) and Neuropathic Hydrocephalus (NH).',
  },
];

export const initialMatingRecommendations: MatingRecommendation[] = [
  {
    id: 'rec-1',
    matingPlanId: 'plan-1',
    femaleId: 'anim-2',
    femaleName: 'Cloverdale Supernova Dam 91',
    femaleIdentifier: 'US-8840219',
    femaleBreed: 'Holstein Friesian',
    sireId: 'anim-1',
    sireName: 'Altair Benchmark ET',
    sireIdentifier: 'US-9901421',
    sireBreed: 'Holstein Friesian',
    rank: 1,
    score: 94.8,
    expectedInbreeding: 3.8,
    genomicInbreeding: 4.1,
    relationshipCoefficient: 0.076,
    expectedProgenyIndex: 829.5,
    expectedProgenyTraits: [
      { traitCode: 'PROT_KG', traitName: 'Protein Yield', value: 42.5, unit: 'kg' },
      { traitCode: 'FAT_KG', traitName: 'Fat Yield', value: 54.0, unit: 'kg' },
      { traitCode: 'PL_MONTHS', traitName: 'Productive Life', value: 4.8, unit: 'months' },
    ],
    expectedBreedComposition: [{ breedName: 'Holstein Friesian', percentage: 100 }],
    geneticConditionRisks: [
      { conditionCode: 'HH1', conditionName: 'Holstein Haplotype 1', riskLevel: 'NONE', explanation: 'Both parents tested free (Homozygous Normal).' },
      { conditionCode: 'BLAD', conditionName: 'Bovine Leukocyte Adhesion', riskLevel: 'NONE', explanation: 'Both parents free.' },
    ],
    warnings: [],
    status: 'ACCEPTED',
    semenBatchId: 'sb-1',
    semenAvailableDoses: 140,
  },
  {
    id: 'rec-2',
    matingPlanId: 'plan-1',
    femaleId: 'anim-4',
    femaleName: 'Bella Vista Cow 102',
    femaleIdentifier: 'US-6628104',
    femaleBreed: 'Holstein Friesian',
    sireId: 'anim-1',
    sireName: 'Altair Benchmark ET',
    sireIdentifier: 'US-9901421',
    sireBreed: 'Holstein Friesian',
    rank: 1,
    score: 89.2,
    expectedInbreeding: 7.2,
    genomicInbreeding: 7.8,
    relationshipCoefficient: 0.144,
    expectedProgenyIndex: 780.0,
    expectedProgenyTraits: [
      { traitCode: 'PROT_KG', traitName: 'Protein Yield', value: 38.0, unit: 'kg' },
      { traitCode: 'FAT_KG', traitName: 'Fat Yield', value: 49.0, unit: 'kg' },
    ],
    expectedBreedComposition: [{ breedName: 'Holstein Friesian', percentage: 100 }],
    geneticConditionRisks: [
      { conditionCode: 'HH1', conditionName: 'Holstein Haplotype 1', riskLevel: 'NONE', explanation: 'Parents clear.' },
    ],
    warnings: ['Expected inbreeding (7.2%) exceeds recommended safety threshold (6.25%).'],
    status: 'REJECTED',
    rejectionReason: 'Exceeds consanguinity threshold (7.2% > 6.25%). Selected alternate outcross sire.',
    lockedAlternateSireId: 'anim-3',
  },
  {
    id: 'rec-3',
    matingPlanId: 'plan-2',
    femaleId: 'anim-4',
    femaleName: 'Bella Vista Cow 102',
    femaleIdentifier: 'US-6628104',
    femaleBreed: 'Aberdeen Angus',
    sireId: 'anim-3',
    sireName: 'Apex Titan Maverick 55',
    sireIdentifier: 'US-7719203',
    sireBreed: 'Aberdeen Angus',
    rank: 1,
    score: 96.2,
    expectedInbreeding: 2.4,
    genomicInbreeding: 2.8,
    relationshipCoefficient: 0.048,
    expectedProgenyIndex: 165.0,
    expectedProgenyTraits: [
      { traitCode: 'MARB_SCORE', traitName: 'Marbling Score', value: 0.95, unit: 'score' },
      { traitCode: 'REA_CM2', traitName: 'Ribeye Area', value: 1.15, unit: 'cm²' },
      { traitCode: 'CW_KG', traitName: 'Carcass Weight', value: 38.0, unit: 'kg' },
    ],
    expectedBreedComposition: [{ breedName: 'Aberdeen Angus', percentage: 100 }],
    geneticConditionRisks: [
      { conditionCode: 'AM', conditionName: 'Arthrogryposis Multiplex', riskLevel: 'NONE', explanation: 'Sire and dam certified free (AMF).' },
      { conditionCode: 'NH', conditionName: 'Neuropathic Hydrocephalus', riskLevel: 'NONE', explanation: 'Sire and dam certified free (NHF).' },
    ],
    warnings: [],
    status: 'ACCEPTED',
    semenBatchId: 'sb-2',
    semenAvailableDoses: 85,
  },
];

export const initialSemenCollections: SemenCollection[] = [
  {
    id: 'sc-1',
    code: 'COL-2026-01-09',
    sireId: 'anim-1',
    sireName: 'Altair Benchmark ET',
    sireIdentifier: 'US-9901421',
    sireBreed: 'Holstein Friesian',
    collectionDate: '2026-01-09',
    centerId: 'center-1',
    centerName: 'Apex Cryo-Genetics Central',
    volumeMl: 6.8,
    concentrationMillionPerMl: 1420,
    motilityPct: 82.5,
    morphologyNormalPct: 91.0,
    qualityGrade: 'EXCELLENT',
    semenType: 'SEXED_FEMALE',
    batchesProduced: 2,
    totalDosesCreated: 240,
    technician: 'Chloe Bennett',
    notes: 'Excellent pre-freeze motility. Diluted with OptiXcell extender and processed via flow cytometry for 90% female sort purity.',
  },
  {
    id: 'sc-2',
    code: 'COL-2026-01-22',
    sireId: 'anim-3',
    sireName: 'Apex Titan Maverick 55',
    sireIdentifier: 'US-7719203',
    sireBreed: 'Aberdeen Angus',
    collectionDate: '2026-01-22',
    centerId: 'center-1',
    centerName: 'Apex Cryo-Genetics Central',
    volumeMl: 7.4,
    concentrationMillionPerMl: 1550,
    motilityPct: 85.0,
    morphologyNormalPct: 94.2,
    qualityGrade: 'EXCELLENT',
    semenType: 'CONVENTIONAL',
    batchesProduced: 1,
    totalDosesCreated: 310,
    technician: 'Chloe Bennett',
    notes: 'Dense ejaculate. Fast post-thaw recovery at 46°C water bath for 30 seconds.',
  },
];

export const initialSemenBatches: SemenBatch[] = [
  {
    id: 'sb-1',
    batchCode: 'SB-HOL-2601-F',
    collectionId: 'sc-1',
    sireId: 'anim-1',
    sireName: 'Altair Benchmark ET',
    sireIdentifier: 'US-9901421',
    sireBreed: 'Holstein Friesian',
    collectionDate: '2026-01-09',
    semenType: 'SEXED_FEMALE',
    totalDoses: 240,
    availableDoses: 140,
    storageTank: 'CryoTank-A1 (Liquid N2 -196°C)',
    storageCane: 'Cane-08',
    storageGoblet: 'Goblet-Red',
    status: 'AVAILABLE',
    centerName: 'Apex Cryo-Genetics Central',
    unitCost: 45.0,
    manufacturingDate: '2026-01-10',
    expiryDate: '2036-01-10',
  },
  {
    id: 'sb-2',
    batchCode: 'SB-ANG-2601-C',
    collectionId: 'sc-2',
    sireId: 'anim-3',
    sireName: 'Apex Titan Maverick 55',
    sireIdentifier: 'US-7719203',
    sireBreed: 'Aberdeen Angus',
    collectionDate: '2026-01-22',
    semenType: 'CONVENTIONAL',
    totalDoses: 310,
    availableDoses: 85,
    storageTank: 'CryoTank-B2 (Liquid N2 -196°C)',
    storageCane: 'Cane-14',
    storageGoblet: 'Goblet-Blue',
    status: 'AVAILABLE',
    centerName: 'Apex Cryo-Genetics Central',
    unitCost: 28.0,
    manufacturingDate: '2026-01-23',
    expiryDate: '2036-01-23',
  },
  {
    id: 'sb-3',
    batchCode: 'SB-HOL-2509-RES',
    collectionId: 'sc-1',
    sireId: 'anim-1',
    sireName: 'Altair Benchmark ET',
    sireIdentifier: 'US-9901421',
    sireBreed: 'Holstein Friesian',
    collectionDate: '2025-09-14',
    semenType: 'CONVENTIONAL',
    totalDoses: 150,
    availableDoses: 12,
    storageTank: 'CryoTank-A1',
    storageCane: 'Cane-02',
    storageGoblet: 'Goblet-Yellow',
    status: 'AVAILABLE',
    centerName: 'Apex Cryo-Genetics Central',
    unitCost: 35.0,
    manufacturingDate: '2025-09-15',
    expiryDate: '2035-09-15',
  },
];

export const initialEmbryos: Embryo[] = [
  {
    id: 'emb-1',
    code: 'EMB-2026-001',
    donorDamId: 'anim-2',
    donorDamName: 'Cloverdale Supernova Dam 91',
    donorDamIdentifier: 'US-8840219',
    sireId: 'anim-1',
    sireName: 'Altair Benchmark ET',
    sireIdentifier: 'US-9901421',
    centerName: 'Apex IVF Bovine Laboratory',
    origin: 'IN_VITRO_IVF',
    collectionDate: '2026-01-14',
    fertilizationDate: '2026-01-15',
    stage: 'BLASTOCYST',
    grade: 'EXCELLENT_1',
    ietsCode: 'Code 4 (Blastocyst, Grade 1)',
    sex: 'FEMALE',
    state: 'FROZEN',
    storageTank: 'CryoTank-IVF-1',
    storageCane: 'Cane-E04',
    storageCanister: 'Canister-3',
    genotypeStatus: 'GENOTYPED',
    genomicBiopsyDate: '2026-01-21',
    notes: 'Trophectoderm biopsy verified 99.8% parentage concordance and free of HH1-HH5 haplotypes.',
  },
  {
    id: 'emb-2',
    code: 'EMB-2026-002',
    donorDamId: 'anim-2',
    donorDamName: 'Cloverdale Supernova Dam 91',
    donorDamIdentifier: 'US-8840219',
    sireId: 'anim-1',
    sireName: 'Altair Benchmark ET',
    sireIdentifier: 'US-9901421',
    centerName: 'Apex IVF Bovine Laboratory',
    origin: 'IN_VITRO_IVF',
    collectionDate: '2026-01-14',
    fertilizationDate: '2026-01-15',
    stage: 'EXPANDED_BLASTOCYST',
    grade: 'GOOD_2',
    ietsCode: 'Code 5 (Expanded Blastocyst, Grade 2)',
    sex: 'FEMALE',
    state: 'TRANSFERRED',
    storageTank: 'CryoTank-IVF-1',
    storageCane: 'Cane-E04',
    storageCanister: 'Canister-3',
    genotypeStatus: 'GENOTYPED',
    genomicBiopsyDate: '2026-01-21',
    notes: 'Transferred to recipient cow Recip-44 on 2026-02-12.',
  },
  {
    id: 'emb-3',
    code: 'EMB-2026-003',
    donorDamId: 'anim-4',
    donorDamName: 'Bella Vista Cow 102',
    donorDamIdentifier: 'US-6628104',
    sireId: 'anim-3',
    sireName: 'Apex Titan Maverick 55',
    sireIdentifier: 'US-7719203',
    centerName: 'Apex IVF Bovine Laboratory',
    origin: 'IN_VIVO_FLUSH',
    collectionDate: '2026-02-04',
    fertilizationDate: '2026-01-28',
    stage: 'MORULA',
    grade: 'EXCELLENT_1',
    ietsCode: 'Code 3 (Morula, Grade 1)',
    sex: 'UNSEXED',
    state: 'FROZEN',
    storageTank: 'CryoTank-IVF-2',
    storageCane: 'Cane-M09',
    storageCanister: 'Canister-1',
    genotypeStatus: 'UNTESTED',
    notes: 'Conventional donor flush yielding 8 viable embryos.',
  },
];

export const initialEmbryoTransfers: EmbryoTransfer[] = [
  {
    id: 'et-1',
    embryoId: 'emb-2',
    embryoCode: 'EMB-2026-002',
    recipientAnimalId: 'anim-4',
    recipientAnimalName: 'Recipient Heifer Recip-44',
    recipientAnimalIdentifier: 'US-RECIP-440',
    transferDate: '2026-02-12',
    technician: 'Dr. Michael Chen',
    transferSite: 'RIGHT_HORN',
    synchronizationProtocol: '7-day Co-Synch + CIDR (Day 7 CL sync)',
    corpusLuteumQuality: 'GRADE_1',
    outcomeStatus: 'CONFIRMED_PREGNANT',
    outcomeNotes: 'Day 35 ultrasound positive with strong embryonic heartbeat detected.',
    pregnancyCheckDate: '2026-03-01',
  },
];

export const initialAuditEvents: AuditEvent[] = [
  {
    id: 'aud-1',
    actorId: 'usr-admin-1',
    actorName: 'Dr. Sarah Jenkins',
    organizationId: 'org-1',
    organizationName: 'National Bovine Improvement Federation',
    action: 'PUBLISH_SELECTION_INDEX',
    entityType: 'SelectionIndex',
    entityId: 'idx-1',
    entityDisplay: 'Net Merit Index (NMI-2026) v3.2',
    fieldName: 'status',
    oldValue: 'DRAFT',
    newValue: 'PUBLISHED',
    reason: 'Approved by 2026 Technical Genetics Advisory Board.',
    source: 'WEB_APPLICATION',
    correlationId: 'corr-tx-990142',
    occurredAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'aud-2',
    actorId: 'usr-reg-1',
    actorName: 'Marcus Vance',
    organizationId: 'org-1',
    organizationName: 'National Bovine Improvement Federation',
    action: 'APPROVE_MATING_PLAN',
    entityType: 'MatingPlan',
    entityId: 'plan-1',
    entityDisplay: 'Spring 2026 Commercial Dairy AI Allocation',
    fieldName: 'status',
    oldValue: 'SUBMITTED',
    newValue: 'APPROVED',
    reason: 'Verified inbreeding constraints (<6.25%) and genetic condition exclusions.',
    source: 'WEB_APPLICATION',
    correlationId: 'corr-tx-990881',
    occurredAt: '2026-02-24T09:15:00Z',
  },
  {
    id: 'aud-3',
    actorId: 'usr-tech-1',
    actorName: 'Chloe Bennett',
    organizationId: 'org-2',
    organizationName: 'Apex Bovine Genetics Cooperative',
    action: 'REGISTER_SEMEN_BATCH',
    entityType: 'SemenBatch',
    entityId: 'sb-1',
    entityDisplay: 'SB-HOL-2601-F (Altair Benchmark ET)',
    fieldName: 'availableDoses',
    oldValue: '0',
    newValue: '240',
    reason: 'Cryopreservation QC passed with 82.5% pre-freeze motility.',
    source: 'LAB_EQUIPMENT_INTERFACE',
    correlationId: 'corr-tx-991204',
    occurredAt: '2026-01-10T16:45:00Z',
  },
  {
    id: 'aud-4',
    actorId: 'usr-tech-1',
    actorName: 'Chloe Bennett',
    organizationId: 'org-2',
    organizationName: 'Apex Bovine Genetics Cooperative',
    action: 'EMBRYO_TRANSFER_RECORDED',
    entityType: 'EmbryoTransfer',
    entityId: 'et-1',
    entityDisplay: 'EMB-2026-002 -> Recipient US-RECIP-440',
    fieldName: 'outcomeStatus',
    oldValue: 'PENDING_CHECK',
    newValue: 'CONFIRMED_PREGNANT',
    reason: 'Ultrasound confirmed day 35 fetus.',
    source: 'VET_FIELD_APP',
    correlationId: 'corr-tx-992305',
    occurredAt: '2026-03-01T11:20:00Z',
  },
];

export const initialExportJobs: ExportJob[] = [
  {
    id: 'exp-1',
    title: 'Spring 2026 Evaluation Run Trait Estimates',
    scope: 'Evaluation RUN-2026-02-GBLUP (All animals, 14 traits)',
    requestedBy: 'Dr. Sarah Jenkins',
    requestedAt: '2026-02-28 14:10',
    status: 'READY',
    format: 'CSV',
    recordCount: 14820,
    fileSizeBytes: 2450000,
    downloadUrl: '#',
  },
  {
    id: 'exp-2',
    title: 'Active Germplasm Tank Inventory & Doses',
    scope: 'All Liquid N2 Cryo-Tanks (Semen Batches & Embryos)',
    requestedBy: 'Chloe Bennett',
    requestedAt: '2026-03-01 08:30',
    status: 'READY',
    format: 'EXCEL',
    recordCount: 840,
    fileSizeBytes: 512000,
    downloadUrl: '#',
  },
  {
    id: 'exp-3',
    title: 'Population Inbreeding & Kinship Matrix',
    scope: 'Population POP-HOL-NUCLEUS (G-Matrix Pedigree + Genomic)',
    requestedBy: 'Marcus Vance',
    requestedAt: '2026-03-02 16:40',
    status: 'READY',
    format: 'JSON',
    recordCount: 180,
    fileSizeBytes: 1820000,
    downloadUrl: '#',
  },
];

// ==========================================
// CONTEXT TYPE
// ==========================================

export interface BovineBreedingContextType {
  // Organizations & Governance
  organizations: Organization[];
  memberships: OrganizationMembership[];
  auditEvents: AuditEvent[];
  exportJobs: ExportJob[];
  addOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => string;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  addOrganizationMember: (member: Omit<OrganizationMembership, 'id' | 'joinedDate'>) => string;
  updateMemberRole: (id: string, newRole: SystemRole) => void;
  addAuditEvent: (event: Omit<AuditEvent, 'id' | 'occurredAt'>) => void;
  createExportJob: (job: Omit<ExportJob, 'id' | 'requestedAt' | 'status'>) => string;

  // Breeding Programs & Populations
  breedingPrograms: BreedingProgram[];
  breedingProgramBreeds: BreedingProgramBreed[];
  breedingPopulations: BreedingPopulation[];
  addBreedingProgram: (program: Omit<BreedingProgram, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateBreedingProgram: (id: string, updates: Partial<BreedingProgram>) => void;
  addBreedingPopulation: (pop: Omit<BreedingPopulation, 'id' | 'createdAt'>) => string;
  updateBreedingPopulation: (id: string, updates: Partial<BreedingPopulation>) => void;
  addBreedingProgramBreed: (bpb: Omit<BreedingProgramBreed, 'id'>) => string;
  removeBreedingProgramBreed: (id: string) => void;

  // Selection Indexes
  selectionIndexes: SelectionIndex[];
  animalIndexResults: AnimalSelectionIndexResult[];
  addSelectionIndex: (
    index: Omit<SelectionIndex, 'id' | 'createdAt' | 'updatedAt'>,
    initialVersion?: Omit<SelectionIndexVersion, 'id'>
  ) => string;
  updateSelectionIndex: (id: string, updates: Partial<SelectionIndex>) => void;
  addSelectionIndexVersion: (indexId: string, version: Omit<SelectionIndexVersion, 'id'>) => string;

  // Mating Plans & Recommendations
  matingPlans: MatingPlan[];
  matingRecommendations: MatingRecommendation[];
  addMatingPlan: (plan: Omit<MatingPlan, 'id' | 'createdAt'>) => string;
  updateMatingPlan: (id: string, updates: Partial<MatingPlan>) => void;
  addMatingRecommendation: (rec: Omit<MatingRecommendation, 'id'>) => string;
  updateMatingRecommendation: (id: string, updates: Partial<MatingRecommendation>) => void;
  updateMatingRecommendationStatus: (
    id: string,
    status: MatingRecommendationStatus,
    rejectionReason?: string,
    lockedAlternateSireId?: string
  ) => void;
  bulkApproveRecommendations: (ids: string[]) => void;
  generateMatingRecommendations: (
    planId: string,
    femaleIds: string[],
    sireIds: string[],
    maxInbreeding: number,
    carrierExclusion: boolean
  ) => void;

  // Germplasm (Semen & Embryos)
  semenCollections: SemenCollection[];
  semenBatches: SemenBatch[];
  embryos: Embryo[];
  embryoTransfers: EmbryoTransfer[];
  addSemenCollection: (col: Omit<SemenCollection, 'id'>) => string;
  addSemenBatch: (batch: Omit<SemenBatch, 'id'>) => string;
  updateSemenBatch: (id: string, updates: Partial<SemenBatch>) => void;
  updateSemenBatchDoses: (batchId: string, dosesDelta: number) => void;
  addEmbryo: (embryo: Omit<Embryo, 'id'>) => string;
  updateEmbryoState: (id: string, state: Embryo['state']) => void;
  addEmbryoTransfer: (transfer: Omit<EmbryoTransfer, 'id'>) => string;
  updateEmbryoTransfer: (id: string, updates: Partial<EmbryoTransfer>) => void;
}

const BovineBreedingContext = createContext<BovineBreedingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bovine_breeding_data_v1';

export function BovineBreedingProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [memberships, setMemberships] = useState<OrganizationMembership[]>(initialMemberships);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(initialAuditEvents);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>(initialExportJobs);

  const [breedingPrograms, setBreedingPrograms] = useState<BreedingProgram[]>(initialBreedingPrograms);
  const [breedingProgramBreeds, setBreedingProgramBreeds] = useState<BreedingProgramBreed[]>(initialBreedingProgramBreeds);
  const [breedingPopulations, setBreedingPopulations] = useState<BreedingPopulation[]>(initialBreedingPopulations);

  const [selectionIndexes, setSelectionIndexes] = useState<SelectionIndex[]>(initialSelectionIndexes);
  const [animalIndexResults, setAnimalIndexResults] = useState<AnimalSelectionIndexResult[]>(initialAnimalIndexResults);

  const [matingPlans, setMatingPlans] = useState<MatingPlan[]>(initialMatingPlans);
  const [matingRecommendations, setMatingRecommendations] = useState<MatingRecommendation[]>(initialMatingRecommendations);

  const [semenCollections, setSemenCollections] = useState<SemenCollection[]>(initialSemenCollections);
  const [semenBatches, setSemenBatches] = useState<SemenBatch[]>(initialSemenBatches);
  const [embryos, setEmbryos] = useState<Embryo[]>(initialEmbryos);
  const [embryoTransfers, setEmbryoTransfers] = useState<EmbryoTransfer[]>(initialEmbryoTransfers);

  // Hydrate from localStorage safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          if (parsed.organizations) setOrganizations(parsed.organizations);
          if (parsed.memberships) setMemberships(parsed.memberships);
          if (parsed.auditEvents) setAuditEvents(parsed.auditEvents);
          if (parsed.exportJobs) setExportJobs(parsed.exportJobs);
          if (parsed.breedingPrograms) setBreedingPrograms(parsed.breedingPrograms);
          if (parsed.breedingProgramBreeds) setBreedingProgramBreeds(parsed.breedingProgramBreeds);
          if (parsed.breedingPopulations) setBreedingPopulations(parsed.breedingPopulations);
          if (parsed.selectionIndexes) setSelectionIndexes(parsed.selectionIndexes);
          if (parsed.animalIndexResults) setAnimalIndexResults(parsed.animalIndexResults);
          if (parsed.matingPlans) setMatingPlans(parsed.matingPlans);
          if (parsed.matingRecommendations) setMatingRecommendations(parsed.matingRecommendations);
          if (parsed.semenCollections) setSemenCollections(parsed.semenCollections);
          if (parsed.semenBatches) setSemenBatches(parsed.semenBatches);
          if (parsed.embryos) setEmbryos(parsed.embryos);
          if (parsed.embryoTransfers) setEmbryoTransfers(parsed.embryoTransfers);
        }, 0);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const persistState = (partial: Record<string, any>) => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const prev = stored ? JSON.parse(stored) : {};
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...prev, ...partial }));
    } catch {
      // Ignore quota errors
    }
  };

  // Organizations & Governance
  const addOrganization = (data: Omit<Organization, 'id' | 'createdAt'>) => {
    const id = `org-${Date.now()}`;
    const newOrg: Organization = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...organizations, newOrg];
    setOrganizations(next);
    persistState({ organizations: next });
    return id;
  };

  const updateOrganization = (id: string, updates: Partial<Organization>) => {
    const next = organizations.map((o) => (o.id === id ? { ...o, ...updates } : o));
    setOrganizations(next);
    persistState({ organizations: next });
  };

  const addOrganizationMember = (data: Omit<OrganizationMembership, 'id' | 'joinedDate'>) => {
    const id = `mem-${Date.now()}`;
    const newMem: OrganizationMembership = {
      ...data,
      id,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    const next = [...memberships, newMem];
    setMemberships(next);
    persistState({ memberships: next });
    return id;
  };

  const updateMemberRole = (id: string, newRole: SystemRole) => {
    const next = memberships.map((m) => (m.id === id ? { ...m, role: newRole } : m));
    setMemberships(next);
    persistState({ memberships: next });
  };

  const addAuditEvent = (event: Omit<AuditEvent, 'id' | 'occurredAt'>) => {
    const newEvent: AuditEvent = {
      ...event,
      id: `aud-${Date.now()}`,
      occurredAt: new Date().toISOString(),
    };
    const next = [newEvent, ...auditEvents];
    setAuditEvents(next);
    persistState({ auditEvents: next });
  };

  const createExportJob = (job: Omit<ExportJob, 'id' | 'requestedAt' | 'status'>) => {
    const id = `exp-${Date.now()}`;
    const newJob: ExportJob = {
      ...job,
      id,
      status: 'READY',
      requestedAt: new Date().toLocaleString(),
      downloadUrl: '#',
    };
    const next = [newJob, ...exportJobs];
    setExportJobs(next);
    persistState({ exportJobs: next });
    return id;
  };

  // Breeding Programs
  const addBreedingProgram = (data: Omit<BreedingProgram, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `bp-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newProgram: BreedingProgram = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const next = [...breedingPrograms, newProgram];
    setBreedingPrograms(next);
    persistState({ breedingPrograms: next });
    return id;
  };

  const updateBreedingProgram = (id: string, updates: Partial<BreedingProgram>) => {
    const next = breedingPrograms.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p
    );
    setBreedingPrograms(next);
    persistState({ breedingPrograms: next });
  };

  const addBreedingPopulation = (data: Omit<BreedingPopulation, 'id' | 'createdAt'>) => {
    const id = `bpop-${Date.now()}`;
    const newPop: BreedingPopulation = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...breedingPopulations, newPop];
    setBreedingPopulations(next);
    persistState({ breedingPopulations: next });
    return id;
  };

  const updateBreedingPopulation = (id: string, updates: Partial<BreedingPopulation>) => {
    const next = breedingPopulations.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setBreedingPopulations(next);
    persistState({ breedingPopulations: next });
  };

  const addBreedingProgramBreed = (data: Omit<BreedingProgramBreed, 'id'>) => {
    const id = `bpb-${Date.now()}`;
    const newBreed: BreedingProgramBreed = { ...data, id };
    const next = [...breedingProgramBreeds, newBreed];
    setBreedingProgramBreeds(next);
    persistState({ breedingProgramBreeds: next });
    return id;
  };

  const removeBreedingProgramBreed = (id: string) => {
    const next = breedingProgramBreeds.filter((b) => b.id !== id);
    setBreedingProgramBreeds(next);
    persistState({ breedingProgramBreeds: next });
  };

  // Selection Indexes
  const addSelectionIndex = (
    data: Omit<SelectionIndex, 'id' | 'createdAt' | 'updatedAt'>,
    initialVersion?: Omit<SelectionIndexVersion, 'id'>
  ) => {
    const id = `idx-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const versions: SelectionIndexVersion[] = initialVersion
      ? [{ ...initialVersion, id: `ver-${Date.now()}`, selectionIndexId: id }]
      : [];

    const newIndex: SelectionIndex = {
      ...data,
      id,
      versions,
      createdAt: now,
      updatedAt: now,
    };
    const next = [...selectionIndexes, newIndex];
    setSelectionIndexes(next);
    persistState({ selectionIndexes: next });
    return id;
  };

  const updateSelectionIndex = (id: string, updates: Partial<SelectionIndex>) => {
    const next = selectionIndexes.map((idx) =>
      idx.id === id ? { ...idx, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : idx
    );
    setSelectionIndexes(next);
    persistState({ selectionIndexes: next });
  };

  const addSelectionIndexVersion = (indexId: string, version: Omit<SelectionIndexVersion, 'id'>) => {
    const verId = `ver-${Date.now()}`;
    const newVer: SelectionIndexVersion = { ...version, id: verId, selectionIndexId: indexId };
    const next = selectionIndexes.map((idx) => {
      if (idx.id !== indexId) return idx;
      const updatedVersions = [...(idx.versions || []), newVer];
      return {
        ...idx,
        activeVersion: newVer.versionNumber,
        versions: updatedVersions,
        updatedAt: new Date().toISOString().split('T')[0],
      };
    });
    setSelectionIndexes(next);
    persistState({ selectionIndexes: next });
    return verId;
  };

  // Mating Plans & Recommendations
  const addMatingPlan = (data: Omit<MatingPlan, 'id' | 'createdAt'>) => {
    const id = `plan-${Date.now()}`;
    const newPlan: MatingPlan = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...matingPlans, newPlan];
    setMatingPlans(next);
    persistState({ matingPlans: next });
    return id;
  };

  const updateMatingPlan = (id: string, updates: Partial<MatingPlan>) => {
    const next = matingPlans.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setMatingPlans(next);
    persistState({ matingPlans: next });
  };

  const addMatingRecommendation = (rec: Omit<MatingRecommendation, 'id'>) => {
    const id = `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newRec: MatingRecommendation = { ...rec, id };
    const next = [newRec, ...matingRecommendations];
    setMatingRecommendations(next);
    persistState({ matingRecommendations: next });
    return id;
  };

  const updateMatingRecommendation = (id: string, updates: Partial<MatingRecommendation>) => {
    const next = matingRecommendations.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setMatingRecommendations(next);
    persistState({ matingRecommendations: next });
  };

  const updateMatingRecommendationStatus = (
    id: string,
    status: MatingRecommendationStatus,
    rejectionReason?: string,
    lockedAlternateSireId?: string
  ) => {
    const next = matingRecommendations.map((r) => {
      if (r.id !== id) return r;
      return {
        ...r,
        status,
        rejectionReason: rejectionReason !== undefined ? rejectionReason : r.rejectionReason,
        lockedAlternateSireId: lockedAlternateSireId !== undefined ? lockedAlternateSireId : r.lockedAlternateSireId,
      };
    });
    setMatingRecommendations(next);
    persistState({ matingRecommendations: next });
  };

  const bulkApproveRecommendations = (ids: string[]) => {
    const idSet = new Set(ids);
    const next = matingRecommendations.map((r) =>
      idSet.has(r.id) && r.status === 'PROPOSED' ? { ...r, status: 'ACCEPTED' as const } : r
    );
    setMatingRecommendations(next);
    persistState({ matingRecommendations: next });
  };

  const generateMatingRecommendations = (
    planId: string,
    femaleIds: string[],
    sireIds: string[],
    maxInbreeding: number,
    carrierExclusion: boolean
  ) => {
    // Generate intelligent simulated mate allocations based on input candidates
    const generated: MatingRecommendation[] = [];
    femaleIds.forEach((fId, fIdx) => {
      // Pick best matching sire from candidate pool
      const selectedSireId = sireIds[fIdx % sireIds.length];
      const recId = `rec-${Date.now()}-${fIdx}`;
      const inbreedingSim = +(2.0 + Math.sin(fIdx) * 2.5 + 1.2).toFixed(1);
      const warnings: string[] = [];
      if (inbreedingSim > maxInbreeding) {
        warnings.push(`Expected inbreeding (${inbreedingSim}%) exceeds plan maximum threshold (${maxInbreeding}%).`);
      }

      generated.push({
        id: recId,
        matingPlanId: planId,
        femaleId: fId,
        femaleName: `Candidate Female #${fIdx + 1}`,
        femaleIdentifier: `US-HEIF-${1000 + fIdx}`,
        femaleBreed: 'Holstein Friesian',
        sireId: selectedSireId,
        sireName: `Candidate Sire #${(fIdx % sireIds.length) + 1}`,
        sireIdentifier: `US-BULL-${9000 + (fIdx % sireIds.length)}`,
        sireBreed: 'Holstein Friesian',
        rank: 1,
        score: +(88.0 + Math.cos(fIdx) * 8).toFixed(1),
        expectedInbreeding: inbreedingSim,
        genomicInbreeding: +(inbreedingSim + 0.3).toFixed(1),
        relationshipCoefficient: +(inbreedingSim * 0.02).toFixed(3),
        expectedProgenyIndex: +(750 + fIdx * 12),
        expectedProgenyTraits: [
          { traitCode: 'PROT_KG', traitName: 'Protein Yield', value: 36.5 + fIdx, unit: 'kg' },
          { traitCode: 'FAT_KG', traitName: 'Fat Yield', value: 48.0 + fIdx, unit: 'kg' },
        ],
        expectedBreedComposition: [{ breedName: 'Holstein Friesian', percentage: 100 }],
        geneticConditionRisks: [
          { conditionCode: 'HH1', conditionName: 'Holstein Haplotype 1', riskLevel: 'NONE', explanation: 'Genomic screen negative.' },
        ],
        warnings,
        status: warnings.length > 0 ? 'PROPOSED' : 'ACCEPTED',
      });
    });

    const next = [...matingRecommendations.filter((r) => r.matingPlanId !== planId), ...generated];
    setMatingRecommendations(next);
    persistState({ matingRecommendations: next });

    // Update plan counts
    updateMatingPlan(planId, {
      femaleCount: femaleIds.length,
      sireCount: sireIds.length,
      recommendationsCount: generated.length,
      acceptedCount: generated.filter((g) => g.status === 'ACCEPTED').length,
      rejectedCount: 0,
    });
  };

  // Germplasm (Semen & Embryos)
  const addSemenCollection = (data: Omit<SemenCollection, 'id'>) => {
    const id = `sc-${Date.now()}`;
    const newCol: SemenCollection = { ...data, id };
    const next = [...semenCollections, newCol];
    setSemenCollections(next);
    persistState({ semenCollections: next });
    return id;
  };

  const addSemenBatch = (data: Omit<SemenBatch, 'id'>) => {
    const id = `sb-${Date.now()}`;
    const newBatch: SemenBatch = { ...data, id };
    const next = [...semenBatches, newBatch];
    setSemenBatches(next);
    persistState({ semenBatches: next });
    return id;
  };

  const updateSemenBatchDoses = (batchId: string, dosesDelta: number) => {
    const next = semenBatches.map((b) => {
      if (b.id !== batchId) return b;
      const updatedAvailable = Math.max(0, b.availableDoses + dosesDelta);
      return {
        ...b,
        availableDoses: updatedAvailable,
        status: updatedAvailable === 0 ? ('DEPLETED' as const) : b.status,
      };
    });
    setSemenBatches(next);
    persistState({ semenBatches: next });
  };

  const updateSemenBatch = (id: string, updates: Partial<SemenBatch>) => {
    const next = semenBatches.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setSemenBatches(next);
    persistState({ semenBatches: next });
  };

  const addEmbryo = (data: Omit<Embryo, 'id'>) => {
    const id = `emb-${Date.now()}`;
    const newEmb: Embryo = { ...data, id };
    const next = [...embryos, newEmb];
    setEmbryos(next);
    persistState({ embryos: next });
    return id;
  };

  const updateEmbryoState = (id: string, state: Embryo['state']) => {
    const next = embryos.map((e) => (e.id === id ? { ...e, state } : e));
    setEmbryos(next);
    persistState({ embryos: next });
  };

  const addEmbryoTransfer = (data: Omit<EmbryoTransfer, 'id'>) => {
    const id = `et-${Date.now()}`;
    const newTransfer: EmbryoTransfer = { ...data, id };
    const next = [...embryoTransfers, newTransfer];
    setEmbryoTransfers(next);
    persistState({ embryoTransfers: next });

    // Mark embryo as TRANSFERRED
    updateEmbryoState(data.embryoId, 'TRANSFERRED');
    return id;
  };

  const updateEmbryoTransfer = (id: string, updates: Partial<EmbryoTransfer>) => {
    const next = embryoTransfers.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setEmbryoTransfers(next);
    persistState({ embryoTransfers: next });
  };

  const value: BovineBreedingContextType = {
    organizations,
    memberships,
    auditEvents,
    exportJobs,
    addOrganization,
    updateOrganization,
    addOrganizationMember,
    updateMemberRole,
    addAuditEvent,
    createExportJob,

    breedingPrograms,
    breedingProgramBreeds,
    breedingPopulations,
    addBreedingProgram,
    updateBreedingProgram,
    addBreedingPopulation,
    updateBreedingPopulation,
    addBreedingProgramBreed,
    removeBreedingProgramBreed,

    selectionIndexes,
    animalIndexResults,
    addSelectionIndex,
    updateSelectionIndex,
    addSelectionIndexVersion,

    matingPlans,
    matingRecommendations,
    addMatingPlan,
    updateMatingPlan,
    addMatingRecommendation,
    updateMatingRecommendation,
    updateMatingRecommendationStatus,
    bulkApproveRecommendations,
    generateMatingRecommendations,

    semenCollections,
    semenBatches,
    embryos,
    embryoTransfers,
    addSemenCollection,
    addSemenBatch,
    updateSemenBatch,
    updateSemenBatchDoses,
    addEmbryo,
    updateEmbryoState,
    addEmbryoTransfer,
    updateEmbryoTransfer,
  };

  return <BovineBreedingContext.Provider value={value}>{children}</BovineBreedingContext.Provider>;
}

export function useBreeding() {
  const context = useContext(BovineBreedingContext);
  if (!context) {
    throw new Error('useBreeding must be used within a BovineBreedingProvider');
  }
  return context;
}
