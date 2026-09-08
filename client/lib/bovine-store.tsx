'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Animal,
  AnimalIdentifier,
  AnimalBreedComposition,
  Parentage,
  AnimalOwnership,
  AnimalMovement,
  DailyAnimalLog,
  AnimalObservation,
  AnimalTask,
  AnimalMedia,
  Farm,
  Herd,
  ManagementGroup,
  FarmDailyLog,
  HerdDailyLog,
  GroupFeedingLog,
  FarmEnvironmentLog,
  FarmOperationalEvent,
  Notification,
  SystemRole,
  UserSession,
  Organization,
  HealthEvent,
  HealthEventStatus,
  HealthEventSeverity,
  Diagnosis,
  Treatment,
  MedicationAdministration,
  MedicationAdministrationStatus,
  VaccineCatalog,
  VaccinationEvent,
  PreventiveCareEvent,
  PreventiveCareType,
  BreedingCycle,
  BreedingCycleStatus,
  BreedingEvent,
  BreedingEventType,
  PregnancyCheck,
  PregnancyResult,
  Pregnancy,
  PregnancyStatus,
  CalvingEvent,
  CalvingOffspring,
  BirthOutcome,
  BirthType,
  CalvingEase,
  FetalPresentation,
  ProductionPeriod,
  ProductionPeriodType,
  AnimalProductionRecord,
  ProductionRecordType,
  SensorDevice,
  SensorDeviceType,
  AnimalDeviceAssignment,
  SensorReading,
  DailySensorSummary,
  SensorMetricType,
  SensorReadingQuality,
  SensorPlacement,
  Sex,
  MaternalDevelopmentRecord,
  WeaningDevelopmentRecord,
  YearlingDevelopmentRecord,
  ReproductiveProcess,
  RecipientEvaluation,
  MediaAlbum,
  MediaCategory,
  MediaVisibility,
  MediaVerificationStatus,
  MediaLink,
  MediaComment,
  MediaAuditEntry,
} from './bovine-types';
import { initialMediaAssets, initialMediaAlbums } from './bovine-media-data';
import {
  initialHealthEvents,
  initialDiagnoses,
  initialTreatments,
  initialMedicationAdministrations,
  initialVaccineCatalog,
  initialVaccinationEvents,
  initialPreventiveCareEvents,
  initialBreedingCycles,
  initialBreedingEvents,
  initialPregnancyChecks,
  initialPregnancies,
  initialCalvingEvents,
  initialCalvingOffspring,
  initialProductionPeriods,
  initialProductionRecords,
  initialSensorDevices,
  initialDeviceAssignments,
  initialSensorReadings,
  initialDailySensorSummaries,
  initialMaternalRecords,
  initialWeaningRecords,
  initialYearlingRecords,
  initialReproductiveProcesses,
  initialRecipientEvaluations,
} from './bovine-phase2-data';

interface BovineContextType {
  // Session & Filters
  session: UserSession;
  setSessionRole: (role: SystemRole) => void;
  setActiveFarm: (farmId: string | 'ALL') => void;
  setActiveHerd: (herdId: string | 'ALL') => void;

  // Data collections - Phase 1
  farms: Farm[];
  herds: Herd[];
  groups: ManagementGroup[];
  animals: Animal[];
  identifiers: AnimalIdentifier[];
  breedCompositions: AnimalBreedComposition[];
  parentages: Record<string, Parentage>;
  ownerships: AnimalOwnership[];
  movements: AnimalMovement[];
  dailyLogs: DailyAnimalLog[];
  observations: AnimalObservation[];
  tasks: AnimalTask[];
  media: AnimalMedia[];
  mediaAlbums: MediaAlbum[];
  farmDailyLogs: FarmDailyLog[];
  herdDailyLogs: HerdDailyLog[];
  groupFeedingLogs: GroupFeedingLog[];
  environmentLogs: FarmEnvironmentLog[];
  farmEvents: FarmOperationalEvent[];
  notifications: Notification[];
  organizations: Organization[];

  // Data collections - Phase 2 Health
  healthEvents: HealthEvent[];
  diagnoses: Diagnosis[];
  treatments: Treatment[];
  medicationAdministrations: MedicationAdministration[];
  vaccineCatalog: VaccineCatalog[];
  vaccinationEvents: VaccinationEvent[];
  preventiveCareEvents: PreventiveCareEvent[];

  // Data collections - Phase 2 Reproduction
  breedingCycles: BreedingCycle[];
  breedingEvents: BreedingEvent[];
  pregnancyChecks: PregnancyCheck[];
  pregnancies: Pregnancy[];
  calvingEvents: CalvingEvent[];
  calvingOffspring: CalvingOffspring[];

  // Data collections - Phase 2 Production
  productionPeriods: ProductionPeriod[];
  productionRecords: AnimalProductionRecord[];

  // Data collections - Phase 2 Sensors
  sensorDevices: SensorDevice[];
  deviceAssignments: AnimalDeviceAssignment[];
  sensorReadings: SensorReading[];
  dailySensorSummaries: DailySensorSummary[];

  // Data collections - Supplemental Workflows
  maternalRecords: MaternalDevelopmentRecord[];
  weaningRecords: WeaningDevelopmentRecord[];
  yearlingRecords: YearlingDevelopmentRecord[];
  reproductiveProcesses: ReproductiveProcess[];
  recipientEvaluations: RecipientEvaluation[];

  // Mutations - Phase 1
  addAnimal: (data: {
    animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt' | 'openTaskCount'>;
    identifiers: Omit<AnimalIdentifier, 'id' | 'animalId'>[];
    breedComposition: Omit<AnimalBreedComposition, 'id' | 'animalId'>[];
    parentage?: Parentage;
    ownership?: Omit<AnimalOwnership, 'id' | 'animalId'>;
    initialPhoto?: string;
  }) => string;
  updateAnimal: (animalId: string, updates: Partial<Animal>) => void;
  addIdentifier: (identifier: Omit<AnimalIdentifier, 'id'>) => void;
  retireIdentifier: (identifierId: string) => void;
  removeIdentifier: (identifierId: string) => void;
  setPrimaryIdentifier: (identifierId: string) => void;
  updateBreedComposition: (animalId: string, compositions: Omit<AnimalBreedComposition, 'id' | 'animalId'>[]) => void;
  updateParentage: (animalId: string, parentage: Parentage) => void;
  addOwnership: (ownership: Omit<AnimalOwnership, 'id'>) => void;
  recordMovement: (movement: Omit<AnimalMovement, 'id'>) => void;
  addDailyAnimalLog: (log: Omit<DailyAnimalLog, 'id'>) => void;
  addAnimalObservation: (obs: Omit<AnimalObservation, 'id'>) => void;
  addAnimalTask: (task: Omit<AnimalTask, 'id'>) => void;
  updateAnimalTask: (taskId: string, updates: Partial<AnimalTask>) => void;
  completeAnimalTask: (taskId: string, completedBy?: string) => void;
  completeTask: (taskId: string, completedBy?: string) => void;
  addAnimalMedia: (media: Omit<AnimalMedia, 'id'>) => string;
  updateAnimalMedia: (mediaId: string, updates: Partial<AnimalMedia>) => void;
  deleteAnimalMedia: (mediaId: string, permanent?: boolean) => void;
  setPrimaryProfilePhoto: (animalId: string, mediaId: string) => void;
  addMediaComment: (mediaId: string, comment: Omit<MediaComment, 'id' | 'date'>) => void;
  verifyAnimalMedia: (mediaId: string, status: MediaVerificationStatus, note?: string) => void;
  updateMediaVisibility: (mediaId: string, visibility: MediaVisibility) => void;
  toggleMarketplaceMedia: (mediaId: string, selected: boolean, order?: number) => void;
  createMediaAlbum: (album: Omit<MediaAlbum, 'id' | 'createdAt'>) => string;
  addMediaToAlbum: (albumId: string, mediaIds: string[]) => void;
  removeMediaFromAlbum: (albumId: string, mediaIds: string[]) => void;
  linkMediaToEntity: (mediaId: string, link: Omit<MediaLink, 'id' | 'mediaAssetId'>) => void;
  addFarm: (farm: Omit<Farm, 'id' | 'headCount' | 'herdCount' | 'sickCount' | 'reviewCount' | 'openTasks' | 'birthsThisMonth' | 'deathsThisMonth' | 'movementsThisMonth' | 'environmentSummary' | 'feedSummary'>) => string;
  addHerd: (herd: Omit<Herd, 'id' | 'headCount' | 'groupCount' | 'reviewCount' | 'dailyLogCompletionPct' | 'alertsCount'>) => string;
  addGroup: (group: Omit<ManagementGroup, 'id' | 'headCount' | 'dailyLogCompletionPct'>) => string;
  addFarmDailyLog: (log: Omit<FarmDailyLog, 'id'>) => void;
  addHerdDailyLog: (log: Omit<HerdDailyLog, 'id'>) => void;
  addGroupFeedingLog: (log: Omit<GroupFeedingLog, 'id'>) => void;
  addFarmEnvironmentLog: (log: Omit<FarmEnvironmentLog, 'id'>) => void;
  addFarmOperationalEvent: (event: Omit<FarmOperationalEvent, 'id'>) => void;
  resolveFarmOperationalEvent: (eventId: string, resolutionNotes?: string) => void;
  markNotificationRead: (id: string) => void;
  archiveNotification: (id: string) => void;
  bulkMarkNotificationsRead: () => void;
  bulkAssignHerd: (animalIds: string[], farmId: string, herdId: string, managementGroupId?: string) => void;
  bulkCreateTasks: (animalIds: string[], taskTemplate: { title: string; taskType: AnimalTask['taskType']; priority: AnimalTask['priority']; dueDate: string; assigneeName: string; description?: string }) => void;
  bulkMoveAnimals: (animalIds: string[], destinationFarmId: string, destinationHerdId: string, reason: string) => void;
  addDailyLog: (log: any) => void;
  addObservation: (obs: any) => void;
  moveAnimals: (params: { animalIds: string[]; destinationFarmId: string; destinationHerdId?: string; movementDate?: string; reason?: string; notes?: string }) => void;

  // Mutations - Phase 2 Health
  addHealthEvent: (event: Omit<HealthEvent, 'id' | 'createdAt' | 'updatedAt'>) => string;
  closeHealthEvent: (eventId: string, notes?: string) => void;
  addDiagnosis: (diagnosis: Omit<Diagnosis, 'id' | 'createdAt'>) => void;
  addTreatment: (treatment: Omit<Treatment, 'id' | 'createdAt'>) => string;
  addMedicationAdministration: (admin: Omit<MedicationAdministration, 'id' | 'createdAt'>) => void;
  recordMedicationGiven: (adminId: string, batchNumber?: string, notes?: string) => void;
  addVaccinationEvent: (event: Omit<VaccinationEvent, 'id' | 'createdAt'>) => void;
  addPreventiveCareEvent: (event: Omit<PreventiveCareEvent, 'id' | 'createdAt'>) => void;

  // Mutations - Phase 2 Reproduction
  addBreedingCycle: (cycle: Omit<BreedingCycle, 'id' | 'createdAt'>) => string;
  closeBreedingCycle: (cycleId: string, status?: BreedingCycleStatus) => void;
  addBreedingEvent: (event: Omit<BreedingEvent, 'id' | 'createdAt'>) => string;
  addPregnancyCheck: (check: Omit<PregnancyCheck, 'id' | 'createdAt'>) => void;
  confirmPregnancy: (damId: string, conceptionDate: string, expectedCalvingDate: string, breedingCycleId?: string, breedingEventId?: string) => string;
  addCalvingEvent: (data: { event: Omit<CalvingEvent, 'id' | 'createdAt'>; offspring: Array<{ birthOrder: number; birthOutcome: BirthOutcome; birthWeightKg?: number; sex: Sex; name: string; tagNumber?: string; coatColor?: string; neonatalNotes?: string }> }) => string;

  // Mutations - Phase 2 Production
  addProductionPeriod: (period: Omit<ProductionPeriod, 'id' | 'createdAt'>) => string;
  closeProductionPeriod: (periodId: string, endReason?: string) => void;
  addProductionRecord: (record: Omit<AnimalProductionRecord, 'id' | 'createdAt'>) => void;

  // Mutations - Phase 2 Sensors
  addSensorDevice: (device: Omit<SensorDevice, 'id' | 'createdAt'>) => string;
  updateSensorDevice: (deviceId: string, updates: Partial<SensorDevice>) => void;
  assignDeviceToAnimal: (animalId: string, deviceId: string, placement?: SensorPlacement, notes?: string) => void;
  removeDeviceAssignment: (assignmentId: string) => void;
  addSensorReading: (reading: Omit<SensorReading, 'id'>) => void;

  // Mutations - Supplemental Workflows
  addMaternalRecord: (record: Omit<MaternalDevelopmentRecord, 'id'>) => string;
  updateMaternalRecord: (id: string, updates: Partial<MaternalDevelopmentRecord>) => void;
  addWeaningRecord: (record: Omit<WeaningDevelopmentRecord, 'id'>) => string;
  updateWeaningRecord: (id: string, updates: Partial<WeaningDevelopmentRecord>) => void;
  addYearlingRecord: (record: Omit<YearlingDevelopmentRecord, 'id'>) => string;
  updateYearlingRecord: (id: string, updates: Partial<YearlingDevelopmentRecord>) => void;
  addReproductiveProcess: (process: Omit<ReproductiveProcess, 'id' | 'createdAt'>) => string;
  updateReproductiveProcess: (id: string, updates: Partial<ReproductiveProcess>) => void;
  addRecipientEvaluation: (evaluation: Omit<RecipientEvaluation, 'id'>) => string;
  updateRecipientEvaluation: (id: string, updates: Partial<RecipientEvaluation>) => void;
  promoteToBreedingStock: (animalId: string, notes?: string) => void;

  resetToDefaults: () => void;
}

const BovineContext = createContext<BovineContextType | null>(null);

const initialOrganizations: Organization[] = [
  {
    id: 'org-apex',
    name: 'Apex Bovine Genetics Consortium',
    code: 'APEX-GEN',
    country: 'United States',
    headquarters: 'Madison, Wisconsin',
    primaryContact: 'Dr. Evelyn Sterling',
    email: 'operations@apexbovine.com',
    phone: '+1 (608) 555-0199',
    activeFarmsCount: 3,
  },
  {
    id: 'org-heritage',
    name: 'Heritage Valley Pastoral Trust',
    code: 'HVP-TRUST',
    country: 'United States',
    headquarters: 'Fort Collins, Colorado',
    primaryContact: 'Marcus Vance',
    email: 'pastoral@heritagevalley.org',
    phone: '+1 (970) 555-0142',
    activeFarmsCount: 1,
  },
];

// Initial realistic seed data
const initialFarms: Farm[] = [
  {
    id: 'farm-1',
    code: 'MDG-01',
    name: 'Meadowlands Dairy & Genetics Hub',
    type: 'DAIRY',
    organizationId: 'org-apex',
    country: 'United States',
    region: 'Midwest',
    district: 'Dane County',
    city: 'Madison',
    address: '4280 Prairie Valley Rd',
    latitude: 43.0731,
    longitude: -89.4012,
    elevation: 280,
    active: true,
    headCount: 68,
    herdCount: 3,
    sickCount: 2,
    reviewCount: 3,
    openTasks: 5,
    birthsThisMonth: 8,
    deathsThisMonth: 0,
    movementsThisMonth: 6,
    environmentSummary: {
      airTempC: 21.5,
      humidityPct: 58,
      thi: 67,
      heatStressRisk: 'NONE',
      beddingScore: 4.5,
      mudScore: 1.2,
      waterScore: 4.8,
    },
    feedSummary: {
      offeredKg: 3450,
      consumedKg: 3310,
      refusalPct: 4.1,
    },
  },
  {
    id: 'farm-2',
    code: 'HVB-02',
    name: 'Highland Valley Beef Station',
    type: 'BEEF',
    organizationId: 'org-apex',
    country: 'United States',
    region: 'Mountain West',
    district: 'Larimer County',
    city: 'Fort Collins',
    address: '8910 Foothills Ridge',
    latitude: 40.5853,
    longitude: -105.0844,
    elevation: 1540,
    active: true,
    headCount: 52,
    herdCount: 2,
    sickCount: 1,
    reviewCount: 2,
    openTasks: 3,
    birthsThisMonth: 5,
    deathsThisMonth: 1,
    movementsThisMonth: 4,
    environmentSummary: {
      airTempC: 24.0,
      humidityPct: 42,
      thi: 69,
      heatStressRisk: 'MILD',
      beddingScore: 4.0,
      mudScore: 1.0,
      waterScore: 4.5,
    },
    feedSummary: {
      offeredKg: 2800,
      consumedKg: 2680,
      refusalPct: 4.3,
    },
  },
  {
    id: 'farm-3',
    code: 'EPG-03',
    name: 'Emerald Prairie Genomic Nucleus',
    type: 'GENOMIC_HUB',
    organizationId: 'org-apex',
    country: 'United States',
    region: 'Corn Belt',
    district: 'Story County',
    city: 'Ames',
    address: '1400 Biotech Parkway',
    latitude: 42.0308,
    longitude: -93.6319,
    elevation: 300,
    active: true,
    headCount: 41,
    herdCount: 2,
    sickCount: 0,
    reviewCount: 1,
    openTasks: 2,
    birthsThisMonth: 4,
    deathsThisMonth: 0,
    movementsThisMonth: 8,
    environmentSummary: {
      airTempC: 22.0,
      humidityPct: 52,
      thi: 68,
      heatStressRisk: 'NONE',
      beddingScore: 4.8,
      mudScore: 1.1,
      waterScore: 5.0,
    },
    feedSummary: {
      offeredKg: 1950,
      consumedKg: 1910,
      refusalPct: 2.1,
    },
  },
  {
    id: 'farm-4',
    code: 'SPB-04',
    name: 'Sunrise Pastures Breeding Hub',
    type: 'SEEDSTOCK',
    organizationId: 'org-apex',
    country: 'United States',
    region: 'Southwest',
    district: 'Hill Country',
    city: 'Fredericksburg',
    address: '610 Live Oak Lane',
    latitude: 30.2752,
    longitude: -98.8719,
    elevation: 520,
    active: true,
    headCount: 45,
    herdCount: 2,
    sickCount: 1,
    reviewCount: 2,
    openTasks: 4,
    birthsThisMonth: 6,
    deathsThisMonth: 0,
    movementsThisMonth: 3,
    environmentSummary: {
      airTempC: 28.5,
      humidityPct: 62,
      thi: 76,
      heatStressRisk: 'MODERATE',
      beddingScore: 4.2,
      mudScore: 1.5,
      waterScore: 4.6,
    },
    feedSummary: {
      offeredKg: 2200,
      consumedKg: 2060,
      refusalPct: 6.4,
    },
  },
];

const initialHerds: Herd[] = [
  {
    id: 'herd-1',
    farmId: 'farm-1',
    code: 'EGD-01',
    name: 'Elite Genomic Donors',
    purpose: 'In-vitro fertilization, superovulation, and embryo production',
    headCount: 24,
    groupCount: 2,
    reviewCount: 1,
    active: true,
    dailyLogCompletionPct: 92,
    alertsCount: 1,
  },
  {
    id: 'herd-2',
    farmId: 'farm-1',
    code: 'PMH-A',
    name: 'Production Milking Herd A',
    purpose: 'High index genetic commercial test milkers',
    headCount: 30,
    groupCount: 2,
    reviewCount: 2,
    active: true,
    dailyLogCompletionPct: 88,
    alertsCount: 2,
  },
  {
    id: 'herd-3',
    farmId: 'farm-1',
    code: 'YSH-01',
    name: 'Young Stock Heifers',
    purpose: 'Replacement heifer development and genomic screening',
    headCount: 14,
    groupCount: 1,
    reviewCount: 0,
    active: true,
    dailyLogCompletionPct: 100,
    alertsCount: 0,
  },
  {
    id: 'herd-4',
    farmId: 'farm-2',
    code: 'BSS-02',
    name: 'Bull Stud Sires',
    purpose: 'High merit natural service & AI collection beef sires',
    headCount: 18,
    groupCount: 1,
    reviewCount: 1,
    active: true,
    dailyLogCompletionPct: 95,
    alertsCount: 1,
  },
  {
    id: 'herd-5',
    farmId: 'farm-2',
    code: 'BBD-02',
    name: 'Black Angus Breeding Dam Unit',
    purpose: 'Elite commercial & registered Angus dam line',
    headCount: 34,
    groupCount: 2,
    reviewCount: 1,
    active: true,
    dailyLogCompletionPct: 90,
    alertsCount: 1,
  },
  {
    id: 'herd-6',
    farmId: 'farm-3',
    code: 'RCG-03',
    name: 'Recipient Herd Beta',
    purpose: 'Embryo transfer recipients under hormone synchronization',
    headCount: 26,
    groupCount: 2,
    reviewCount: 1,
    active: true,
    dailyLogCompletionPct: 85,
    alertsCount: 1,
  },
  {
    id: 'herd-7',
    farmId: 'farm-3',
    code: 'PTG-03',
    name: 'Progeny Test Calves',
    purpose: 'Performance feed intake & genomic evaluation',
    headCount: 15,
    groupCount: 1,
    reviewCount: 0,
    active: true,
    dailyLogCompletionPct: 100,
    alertsCount: 0,
  },
  {
    id: 'herd-8',
    farmId: 'farm-4',
    code: 'SSM-04',
    name: 'Seedstock Matrons',
    purpose: 'Purebred foundational cows for show and sale',
    headCount: 28,
    groupCount: 2,
    reviewCount: 1,
    active: true,
    dailyLogCompletionPct: 91,
    alertsCount: 1,
  },
  {
    id: 'herd-9',
    farmId: 'farm-4',
    code: 'SYB-04',
    name: 'Yearling Bulls & Heifers',
    purpose: 'Sale preparation and breeding soundness examination',
    headCount: 17,
    groupCount: 1,
    reviewCount: 1,
    active: true,
    dailyLogCompletionPct: 94,
    alertsCount: 1,
  },
];

const initialGroups: ManagementGroup[] = [
  {
    id: 'group-1',
    farmId: 'farm-1',
    herdId: 'herd-1',
    code: 'PEN-D1',
    name: 'Donor Pen 1 (Pre-Flushing)',
    description: 'High energy ration, daily heat check and monitoring',
    headCount: 12,
    status: 'ACTIVE',
    startDate: '2026-01-10',
    dailyLogCompletionPct: 95,
  },
  {
    id: 'group-2',
    farmId: 'farm-1',
    herdId: 'herd-1',
    code: 'PEN-D2',
    name: 'Donor Pen 2 (Resting/Post-OPU)',
    description: 'Maintenance pasture plus mineral supplementation',
    headCount: 12,
    status: 'ACTIVE',
    startDate: '2026-02-01',
    dailyLogCompletionPct: 90,
  },
  {
    id: 'group-3',
    farmId: 'farm-1',
    herdId: 'herd-2',
    code: 'PEN-M1',
    name: 'Fresh Cow Milking Pen',
    description: '0-30 DIM fresh cows undergoing metabolic screening',
    headCount: 15,
    status: 'ACTIVE',
    startDate: '2026-01-15',
    dailyLogCompletionPct: 86,
  },
  {
    id: 'group-4',
    farmId: 'farm-2',
    herdId: 'herd-4',
    code: 'PADDOCK-B1',
    name: 'Sire Bull Paddock North',
    description: 'Individual bull housing with shade and runout',
    headCount: 9,
    status: 'ACTIVE',
    startDate: '2025-11-20',
    dailyLogCompletionPct: 96,
  },
  {
    id: 'group-5',
    farmId: 'farm-3',
    herdId: 'herd-6',
    code: 'PEN-SYNC1',
    name: 'Sync Protocol Group 2026-A',
    description: 'Recipients on Day 7 post CIDR sync protocol',
    headCount: 14,
    status: 'ACTIVE',
    startDate: '2026-02-15',
    dailyLogCompletionPct: 82,
  },
];

const initialAnimals: Animal[] = [
  {
    id: 'anim-1',
    internalId: 'BV-2024-8891',
    name: 'Altair Supernova ET',
    sex: 'FEMALE',
    birthDate: '2024-03-14',
    lifeStatus: 'ALIVE',
    useStatus: 'DONOR',
    coatColor: 'Black & White',
    hornStatus: 'POLLED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-1',
    herdId: 'herd-1',
    managementGroupId: 'group-1',
    registrationStatus: 'APPROVED',
    registrationNumber: 'USA-HO-325988102',
    photoUrl: 'https://picsum.photos/seed/bovine-supernova/800/600',
    requiresReview: false,
    latestConditionScore: 4.8,
    openTaskCount: 1,
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2026-09-04T06:00:00Z',
    primaryIdentifier: 'US-9941203',
    primaryIdentifierType: 'EAR_TAG',
  },
  {
    id: 'anim-2',
    internalId: 'BV-2023-7402',
    name: 'Ironwood Titan Red',
    sex: 'MALE',
    birthDate: '2023-08-22',
    lifeStatus: 'ALIVE',
    useStatus: 'AI_SIRE',
    coatColor: 'Solid Red',
    hornStatus: 'POLLED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-2',
    herdId: 'herd-4',
    managementGroupId: 'group-4',
    registrationStatus: 'APPROVED',
    registrationNumber: 'USA-AN-19842109',
    photoUrl: 'https://picsum.photos/seed/bovine-titan/800/600',
    requiresReview: false,
    latestConditionScore: 4.6,
    openTaskCount: 1,
    createdAt: '2023-08-25T11:20:00Z',
    updatedAt: '2026-09-03T14:30:00Z',
    primaryIdentifier: 'US-7782341',
    primaryIdentifierType: 'EAR_TAG',
  },
  {
    id: 'anim-3',
    internalId: 'BV-2024-9104',
    name: 'Meadow Jewel 420',
    sex: 'FEMALE',
    birthDate: '2024-05-18',
    lifeStatus: 'ALIVE',
    useStatus: 'BREEDING_STOCK',
    coatColor: 'Fawn / Light Brown',
    hornStatus: 'DEHORNED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-1',
    herdId: 'herd-2',
    managementGroupId: 'group-3',
    registrationStatus: 'APPROVED',
    registrationNumber: 'USA-JE-11894021',
    photoUrl: 'https://picsum.photos/seed/bovine-jewel/800/600',
    requiresReview: false,
    latestConditionScore: 4.2,
    openTaskCount: 0,
    createdAt: '2024-05-20T08:00:00Z',
    updatedAt: '2026-09-04T05:30:00Z',
    primaryIdentifier: 'US-9104882',
    primaryIdentifierType: 'EAR_TAG',
  },
  {
    id: 'anim-4',
    internalId: 'BV-2024-6330',
    name: 'Cloverdale Bella 14',
    sex: 'FEMALE',
    birthDate: '2024-01-10',
    lifeStatus: 'ALIVE',
    useStatus: 'RECIPIENT',
    coatColor: 'Black Baldy',
    hornStatus: 'POLLED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-3',
    herdId: 'herd-6',
    managementGroupId: 'group-5',
    registrationStatus: 'APPROVED',
    registrationNumber: 'USA-SM-44102911',
    photoUrl: 'https://picsum.photos/seed/bovine-bella/800/600',
    requiresReview: true,
    reviewReason: 'Elevated temperature (39.7°C) & drop in morning appetite',
    latestConditionScore: 3.1,
    openTaskCount: 2,
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2026-09-04T07:15:00Z',
    primaryIdentifier: 'US-6330912',
    primaryIdentifierType: 'EAR_TAG',
  },
  {
    id: 'anim-5',
    internalId: 'BV-2025-1011',
    name: 'Kobe Summit Wagyu 11',
    sex: 'MALE',
    birthDate: '2025-02-04',
    lifeStatus: 'ALIVE',
    useStatus: 'NATURAL_SERVICE_SIRE',
    coatColor: 'Black',
    hornStatus: 'HORNED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-2',
    herdId: 'herd-4',
    managementGroupId: 'group-4',
    registrationStatus: 'APPROVED',
    registrationNumber: 'USA-WY-892014',
    photoUrl: 'https://picsum.photos/seed/bovine-kobe/800/600',
    requiresReview: false,
    latestConditionScore: 4.7,
    openTaskCount: 1,
    createdAt: '2025-02-06T12:00:00Z',
    updatedAt: '2026-09-02T16:00:00Z',
    primaryIdentifier: 'US-1011883',
    primaryIdentifierType: 'EAR_TAG',
  },
  {
    id: 'anim-6',
    internalId: 'BV-2024-4019',
    name: 'Prairie Storm 9',
    sex: 'MALE',
    birthDate: '2024-04-01',
    lifeStatus: 'ALIVE',
    useStatus: 'TEST_ANIMAL',
    coatColor: 'Black',
    hornStatus: 'POLLED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-3',
    herdId: 'herd-7',
    registrationStatus: 'APPROVED',
    registrationNumber: 'USA-AN-201198',
    photoUrl: 'https://picsum.photos/seed/bovine-storm/800/600',
    requiresReview: false,
    latestConditionScore: 4.0,
    openTaskCount: 0,
    createdAt: '2024-04-03T10:00:00Z',
    updatedAt: '2026-09-01T11:00:00Z',
    primaryIdentifier: 'US-4019231',
    primaryIdentifierType: 'EAR_TAG',
  },
  {
    id: 'anim-7',
    internalId: 'BV-2022-3112',
    name: 'Oakridge Duchess 7',
    sex: 'FEMALE',
    birthDate: '2022-09-19',
    lifeStatus: 'ALIVE',
    useStatus: 'CULL_CANDIDATE',
    coatColor: 'Black & White',
    hornStatus: 'DEHORNED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-1',
    herdId: 'herd-2',
    managementGroupId: 'group-3',
    registrationStatus: 'APPROVED',
    registrationNumber: 'USA-HO-2891044',
    photoUrl: 'https://picsum.photos/seed/bovine-duchess/800/600',
    requiresReview: true,
    reviewReason: 'Chronic mastitis history; scheduled for exit evaluation',
    latestConditionScore: 2.8,
    openTaskCount: 1,
    createdAt: '2022-09-22T08:00:00Z',
    updatedAt: '2026-09-04T05:00:00Z',
    primaryIdentifier: 'US-3112890',
    primaryIdentifierType: 'EAR_TAG',
  },
  {
    id: 'anim-8',
    internalId: 'BV-2024-1290',
    name: 'Sunrise Glory 29',
    sex: 'FEMALE',
    birthDate: '2024-06-12',
    lifeStatus: 'ALIVE',
    useStatus: 'DONOR',
    coatColor: 'Solid Grey/Brown',
    hornStatus: 'POLLED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-4',
    herdId: 'herd-8',
    registrationStatus: 'APPROVED',
    registrationNumber: 'USA-BS-689102',
    photoUrl: 'https://picsum.photos/seed/bovine-glory/800/600',
    requiresReview: false,
    latestConditionScore: 4.5,
    openTaskCount: 0,
    createdAt: '2024-06-15T14:00:00Z',
    updatedAt: '2026-09-03T18:00:00Z',
    primaryIdentifier: 'US-1290441',
    primaryIdentifierType: 'EAR_TAG',
  },
  {
    id: 'anim-9',
    internalId: 'BV-2025-0042',
    name: 'Calf Maverick ET',
    sex: 'MALE',
    birthDate: '2025-07-28',
    lifeStatus: 'ALIVE',
    useStatus: 'GENERAL',
    coatColor: 'Black & White',
    hornStatus: 'POLLED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-1',
    herdId: 'herd-3',
    registrationStatus: 'PENDING',
    photoUrl: 'https://picsum.photos/seed/bovine-maverick/800/600',
    requiresReview: false,
    latestConditionScore: 4.4,
    openTaskCount: 1,
    createdAt: '2025-08-01T08:00:00Z',
    updatedAt: '2026-09-04T06:10:00Z',
    primaryIdentifier: 'US-0042119',
    primaryIdentifierType: 'EAR_TAG',
  },
  {
    id: 'anim-10',
    internalId: 'BV-2021-1108',
    name: 'Apex Heritage Bull 01',
    sex: 'MALE',
    birthDate: '2021-04-10',
    lifeStatus: 'SOLD',
    useStatus: 'RETIRED',
    coatColor: 'Black',
    hornStatus: 'POLLED',
    ownerOrgId: 'org-apex',
    farmId: 'farm-2',
    herdId: 'herd-4',
    registrationStatus: 'APPROVED',
    registrationNumber: 'USA-AN-180922',
    photoUrl: 'https://picsum.photos/seed/bovine-heritage/800/600',
    requiresReview: false,
    latestConditionScore: 4.1,
    openTaskCount: 0,
    createdAt: '2021-04-12T09:00:00Z',
    updatedAt: '2025-10-15T12:00:00Z',
    primaryIdentifier: 'US-1108492',
    primaryIdentifierType: 'EAR_TAG',
  },
];

const initialIdentifiers: AnimalIdentifier[] = [
  // anim-1
  {
    id: 'id-1',
    animalId: 'anim-1',
    type: 'EAR_TAG',
    value: 'US-9941203',
    issuer: 'US Farm Service',
    country: 'USA',
    isPrimary: true,
    issueDate: '2024-03-14',
    status: 'ACTIVE',
  },
  {
    id: 'id-2',
    animalId: 'anim-1',
    type: 'RFID_EID',
    value: '982000412891402',
    issuer: 'Allflex ISO',
    country: 'USA',
    isPrimary: false,
    issueDate: '2024-03-14',
    status: 'ACTIVE',
  },
  {
    id: 'id-3',
    animalId: 'anim-1',
    type: 'DGR',
    value: 'DGR-88912-US',
    issuer: 'Dairy Genetics Registry',
    country: 'USA',
    isPrimary: false,
    issueDate: '2024-04-01',
    status: 'ACTIVE',
  },
  {
    id: 'id-4',
    animalId: 'anim-1',
    type: 'REGISTRY_NUMBER',
    value: 'USA-HO-325988102',
    issuer: 'Holstein Association USA',
    country: 'USA',
    isPrimary: false,
    issueDate: '2024-04-10',
    status: 'ACTIVE',
  },
  // anim-2
  {
    id: 'id-5',
    animalId: 'anim-2',
    type: 'EAR_TAG',
    value: 'US-7782341',
    issuer: 'US Beef Tag',
    country: 'USA',
    isPrimary: true,
    issueDate: '2023-08-22',
    status: 'ACTIVE',
  },
  {
    id: 'id-6',
    animalId: 'anim-2',
    type: 'RFID_EID',
    value: '982000318402911',
    issuer: 'Datamars RFID',
    country: 'USA',
    isPrimary: false,
    issueDate: '2023-08-22',
    status: 'ACTIVE',
  },
  // anim-3
  {
    id: 'id-7',
    animalId: 'anim-3',
    type: 'EAR_TAG',
    value: 'US-9104882',
    issuer: 'US Farm Service',
    country: 'USA',
    isPrimary: true,
    issueDate: '2024-05-18',
    status: 'ACTIVE',
  },
  // anim-4
  {
    id: 'id-8',
    animalId: 'anim-4',
    type: 'EAR_TAG',
    value: 'US-6330912',
    issuer: 'US Farm Service',
    country: 'USA',
    isPrimary: true,
    issueDate: '2024-01-10',
    status: 'ACTIVE',
  },
  {
    id: 'id-9',
    animalId: 'anim-4',
    type: 'RFID_EID',
    value: '982000446330192',
    issuer: 'Allflex ISO',
    country: 'USA',
    isPrimary: false,
    issueDate: '2024-01-10',
    status: 'ACTIVE',
  },
  // anim-5
  {
    id: 'id-10',
    animalId: 'anim-5',
    type: 'EAR_TAG',
    value: 'US-1011883',
    issuer: 'Wagyu Registry',
    country: 'USA',
    isPrimary: true,
    issueDate: '2025-02-04',
    status: 'ACTIVE',
  },
  // anim-6
  {
    id: 'id-11',
    animalId: 'anim-6',
    type: 'EAR_TAG',
    value: 'US-4019231',
    issuer: 'US Farm Service',
    country: 'USA',
    isPrimary: true,
    issueDate: '2024-04-01',
    status: 'ACTIVE',
  },
  // anim-7
  {
    id: 'id-12',
    animalId: 'anim-7',
    type: 'EAR_TAG',
    value: 'US-3112890',
    issuer: 'US Farm Service',
    country: 'USA',
    isPrimary: true,
    issueDate: '2022-09-19',
    status: 'ACTIVE',
  },
  // anim-8
  {
    id: 'id-13',
    animalId: 'anim-8',
    type: 'EAR_TAG',
    value: 'US-1290441',
    issuer: 'US Farm Service',
    country: 'USA',
    isPrimary: true,
    issueDate: '2024-06-12',
    status: 'ACTIVE',
  },
  // anim-9
  {
    id: 'id-14',
    animalId: 'anim-9',
    type: 'EAR_TAG',
    value: 'US-0042119',
    issuer: 'US Farm Service',
    country: 'USA',
    isPrimary: true,
    issueDate: '2025-07-28',
    status: 'ACTIVE',
  },
  // anim-10
  {
    id: 'id-15',
    animalId: 'anim-10',
    type: 'EAR_TAG',
    value: 'US-1108492',
    issuer: 'US Farm Service',
    country: 'USA',
    isPrimary: true,
    issueDate: '2021-04-10',
    status: 'ACTIVE',
  },
];

const initialBreedCompositions: AnimalBreedComposition[] = [
  {
    id: 'bc-1',
    animalId: 'anim-1',
    breedId: 'holstein',
    breedName: 'Holstein',
    percentage: 100,
    source: 'REGISTRY',
    confidence: 'HIGH',
    recordedDate: '2024-03-14',
  },
  {
    id: 'bc-2',
    animalId: 'anim-2',
    breedId: 'angus',
    breedName: 'Angus',
    percentage: 100,
    source: 'REGISTRY',
    confidence: 'HIGH',
    recordedDate: '2023-08-22',
  },
  {
    id: 'bc-3',
    animalId: 'anim-3',
    breedId: 'jersey',
    breedName: 'Jersey',
    percentage: 85,
    source: 'GENOMIC_INFERRED',
    confidence: 'HIGH',
    recordedDate: '2024-05-18',
  },
  {
    id: 'bc-4',
    animalId: 'anim-3',
    breedId: 'holstein',
    breedName: 'Holstein',
    percentage: 15,
    source: 'GENOMIC_INFERRED',
    confidence: 'HIGH',
    recordedDate: '2024-05-18',
  },
  {
    id: 'bc-5',
    animalId: 'anim-4',
    breedId: 'simmental',
    breedName: 'Simmental',
    percentage: 50,
    source: 'PEDIGREE_DERIVED',
    confidence: 'MEDIUM',
    recordedDate: '2024-01-10',
  },
  {
    id: 'bc-6',
    animalId: 'anim-4',
    breedId: 'angus',
    breedName: 'Angus',
    percentage: 50,
    source: 'PEDIGREE_DERIVED',
    confidence: 'MEDIUM',
    recordedDate: '2024-01-10',
  },
  {
    id: 'bc-7',
    animalId: 'anim-5',
    breedId: 'wagyu',
    breedName: 'Wagyu (Kuroge Washu)',
    percentage: 100,
    source: 'REGISTRY',
    confidence: 'HIGH',
    recordedDate: '2025-02-04',
  },
  {
    id: 'bc-8',
    animalId: 'anim-6',
    breedId: 'angus',
    breedName: 'Angus',
    percentage: 100,
    source: 'OWNER_REPORTED',
    confidence: 'MEDIUM',
    recordedDate: '2024-04-01',
  },
  {
    id: 'bc-9',
    animalId: 'anim-7',
    breedId: 'holstein',
    breedName: 'Holstein',
    percentage: 100,
    source: 'REGISTRY',
    confidence: 'HIGH',
    recordedDate: '2022-09-19',
  },
  {
    id: 'bc-10',
    animalId: 'anim-8',
    breedId: 'brown_swiss',
    breedName: 'Brown Swiss',
    percentage: 100,
    source: 'REGISTRY',
    confidence: 'HIGH',
    recordedDate: '2024-06-12',
  },
  {
    id: 'bc-11',
    animalId: 'anim-9',
    breedId: 'holstein',
    breedName: 'Holstein',
    percentage: 100,
    source: 'PEDIGREE_DERIVED',
    confidence: 'HIGH',
    recordedDate: '2025-07-28',
  },
  {
    id: 'bc-12',
    animalId: 'anim-10',
    breedId: 'angus',
    breedName: 'Angus',
    percentage: 100,
    source: 'REGISTRY',
    confidence: 'HIGH',
    recordedDate: '2021-04-10',
  },
];

const initialParentages: Record<string, Parentage> = {
  'anim-1': {
    sireId: 'anim-ext-1',
    sireName: 'Stantons Applicable-ET',
    sireIdentifier: 'HO-CAN-12189047',
    sireStatus: 'VERIFIED',
    sireBreed: 'Holstein',
    damId: 'anim-ext-2',
    damName: 'Sandy-Valley Nu Era',
    damIdentifier: 'HO-USA-74291040',
    damStatus: 'VERIFIED',
    damBreed: 'Holstein',
    source: 'Genomic SNP Parentage Verification (99.98%)',
    confidence: 'HIGH',
    paternalGrandsireName: 'S-S-I 1stClass Federalist',
    paternalGranddamName: 'Stantons Cameo Approach',
    maternalGrandsireName: 'Bacon-Hill Pety Modesty',
    maternalGranddamName: 'Sandy-Valley Morgan Era',
  },
  'anim-2': {
    sireName: 'Connealy Confidence Plus',
    sireIdentifier: 'USA-AN-17585576',
    sireStatus: 'RECORDED',
    sireBreed: 'Angus',
    damName: 'Ironwood Blackcap 310',
    damIdentifier: 'USA-AN-18910482',
    damStatus: 'RECORDED',
    damBreed: 'Angus',
    source: 'Breeder Service Certificate',
    confidence: 'HIGH',
    paternalGrandsireName: 'Connealy Tobin',
    paternalGranddamName: 'Becka Gala of Conanga',
    maternalGrandsireName: 'SAV Final Answer 0035',
    maternalGranddamName: 'Ironwood Lady 908',
  },
  'anim-4': {
    sireName: 'W/C Relentless 32C',
    sireIdentifier: 'USA-SM-3045559',
    sireStatus: 'RECORDED',
    sireBreed: 'Simmental',
    damName: 'Cloverdale Dixie 801',
    damIdentifier: 'USA-AN-19041234',
    damStatus: 'RECORDED',
    damBreed: 'Angus',
    source: 'Herd Breeding Log',
    confidence: 'MEDIUM',
  },
  'anim-9': {
    sireId: 'anim-ext-1',
    sireName: 'Stantons Applicable-ET',
    sireIdentifier: 'HO-CAN-12189047',
    sireStatus: 'PROPOSED',
    sireBreed: 'Holstein',
    damId: 'anim-1',
    damName: 'Altair Supernova ET',
    damIdentifier: 'US-9941203',
    damStatus: 'VERIFIED',
    damBreed: 'Holstein',
    source: 'Embryo Transfer Flush Sheet #2025-F19',
    confidence: 'HIGH',
  },
};

const initialOwnerships: AnimalOwnership[] = [
  {
    id: 'own-1',
    animalId: 'anim-1',
    ownerName: 'Apex Bovine Genetics Syndicate',
    ownerOrgId: 'org-apex',
    ownershipType: 'SYNDICATE',
    sharePercentage: 70,
    startDate: '2024-03-14',
    isCurrent: true,
  },
  {
    id: 'own-2',
    animalId: 'anim-1',
    ownerName: 'Altair Genetics Partners LLC',
    ownerOrgId: 'org-altair',
    ownershipType: 'CO_OWNER',
    sharePercentage: 30,
    startDate: '2024-03-14',
    isCurrent: true,
  },
  {
    id: 'own-3',
    animalId: 'anim-2',
    ownerName: 'Apex Bovine Genetics Co.',
    ownerOrgId: 'org-apex',
    ownershipType: 'SOLE',
    sharePercentage: 100,
    startDate: '2023-08-22',
    isCurrent: true,
  },
  {
    id: 'own-4',
    animalId: 'anim-3',
    ownerName: 'Apex Bovine Genetics Co.',
    ownerOrgId: 'org-apex',
    ownershipType: 'SOLE',
    sharePercentage: 100,
    startDate: '2024-05-18',
    isCurrent: true,
  },
  {
    id: 'own-5',
    animalId: 'anim-4',
    ownerName: 'Apex Bovine Genetics Co.',
    ownerOrgId: 'org-apex',
    ownershipType: 'SOLE',
    sharePercentage: 100,
    startDate: '2024-01-10',
    isCurrent: true,
  },
  {
    id: 'own-6',
    animalId: 'anim-5',
    ownerName: 'Summit Wagyu Holdings & Apex Joint Venture',
    ownerOrgId: 'org-apex',
    ownershipType: 'CO_OWNER',
    sharePercentage: 50,
    startDate: '2025-02-04',
    isCurrent: true,
  },
];

const initialMovements: AnimalMovement[] = [
  {
    id: 'mov-1',
    animalId: 'anim-1',
    fromFarmId: 'farm-3',
    fromFarmName: 'Emerald Prairie Genomic Nucleus',
    toFarmId: 'farm-1',
    toFarmName: 'Meadowlands Dairy & Genetics Hub',
    movementType: 'INTER_FARM_TRANSFER',
    movementDate: '2025-09-10',
    reason: 'Transferred for advanced IVF and embryo production program',
    referenceNumber: 'TR-2025-09-082',
    operatorName: 'Mark Henderson (Herd Lead)',
  },
  {
    id: 'mov-2',
    animalId: 'anim-4',
    fromFarmId: 'farm-2',
    fromFarmName: 'Highland Valley Beef Station',
    toFarmId: 'farm-3',
    toFarmName: 'Emerald Prairie Genomic Nucleus',
    movementType: 'INTER_FARM_TRANSFER',
    movementDate: '2025-11-04',
    reason: 'Transferred for recipient sync and ET trial',
    referenceNumber: 'TR-2025-11-019',
    operatorName: 'Sarah Jenkins (Vet Tech)',
  },
  {
    id: 'mov-3',
    animalId: 'anim-5',
    fromFarmId: 'farm-4',
    fromFarmName: 'Sunrise Pastures Breeding Hub',
    toFarmId: 'farm-2',
    toFarmName: 'Highland Valley Beef Station',
    movementType: 'INTER_FARM_TRANSFER',
    movementDate: '2025-06-20',
    reason: 'Acquired and transferred to bull stud quarantine',
    referenceNumber: 'TR-2025-06-112',
    operatorName: 'Dave Miller (Logistics)',
  },
];

const initialDailyLogs: DailyAnimalLog[] = [
  {
    id: 'dl-1',
    animalId: 'anim-1',
    date: '2026-09-04',
    operationalStatus: 'NORMAL',
    overallCondition: 5,
    temperature: 38.6,
    weight: 642,
    bcs: 3.5,
    appetiteScore: 5,
    activityScore: 5,
    hydrationScore: 5,
    manureScore: 3,
    lamenessScore: 1,
    ruminationMinutes: 485,
    lyingHours: 11.2,
    standingHours: 12.8,
    stepCount: 2840,
    feedIntakeKg: 24.5,
    waterIntakeL: 95,
    heartRate: 64,
    respirationRate: 26,
    isAbnormal: false,
    requiresReview: false,
    notes: 'Vibrant, clean rumination cycle, excellent standing posture.',
    loggedBy: 'Elena Rostova (Technician)',
  },
  {
    id: 'dl-2',
    animalId: 'anim-4',
    date: '2026-09-04',
    operationalStatus: 'SICK',
    overallCondition: 3,
    temperature: 39.8,
    weight: 560,
    bcs: 3.0,
    appetiteScore: 2,
    activityScore: 2,
    hydrationScore: 3,
    manureScore: 2,
    lamenessScore: 2,
    ruminationMinutes: 280,
    lyingHours: 15.6,
    standingHours: 8.4,
    stepCount: 1120,
    feedIntakeKg: 14.2,
    waterIntakeL: 52,
    heartRate: 82,
    respirationRate: 38,
    isAbnormal: true,
    requiresReview: true,
    reviewReason: 'Fever spike 39.8°C, slow to rise, mild labored breathing.',
    notes: 'Moved to recovery pen. Blood draw sample sent to lab for respiratory panel.',
    loggedBy: 'Marcus Vance (Field Vet)',
  },
  {
    id: 'dl-3',
    animalId: 'anim-2',
    date: '2026-09-04',
    operationalStatus: 'NORMAL',
    overallCondition: 5,
    temperature: 38.5,
    weight: 980,
    bcs: 4.0,
    appetiteScore: 5,
    activityScore: 4,
    hydrationScore: 5,
    manureScore: 3,
    lamenessScore: 1,
    ruminationMinutes: 510,
    lyingHours: 10.5,
    standingHours: 13.5,
    stepCount: 3100,
    feedIntakeKg: 28.0,
    waterIntakeL: 110,
    heartRate: 60,
    respirationRate: 24,
    isAbnormal: false,
    requiresReview: false,
    notes: 'Pre-semen collection check passed with high vigor.',
    loggedBy: 'Tim O’Connor (Stud Master)',
  },
  {
    id: 'dl-4',
    animalId: 'anim-7',
    date: '2026-09-04',
    operationalStatus: 'OBSERVATION',
    overallCondition: 3,
    temperature: 38.9,
    weight: 610,
    bcs: 2.75,
    appetiteScore: 3,
    activityScore: 3,
    hydrationScore: 4,
    manureScore: 3,
    lamenessScore: 2,
    ruminationMinutes: 370,
    feedIntakeKg: 18.0,
    waterIntakeL: 70,
    isAbnormal: true,
    requiresReview: true,
    reviewReason: 'Stiff gait left rear quarter, milk somatic cell count high.',
    notes: 'Scheduled for veterinary cull examination.',
    loggedBy: 'Elena Rostova (Technician)',
  },
];

const initialObservations: AnimalObservation[] = [
  {
    id: 'obs-1',
    animalId: 'anim-4',
    date: '2026-09-04 07:10',
    type: 'TEMPERATURE',
    valueType: 'NUMERIC',
    numericValue: 39.8,
    unit: '°C',
    source: 'MANUAL',
    severity: 'SEVERE',
    isAbnormal: true,
    requiresReview: true,
    notes: 'Digital rectal temp confirmed 39.8°C.',
    farmId: 'farm-3',
    herdId: 'herd-6',
    recordedBy: 'Marcus Vance (Field Vet)',
  },
  {
    id: 'obs-2',
    animalId: 'anim-4',
    date: '2026-09-04 07:20',
    type: 'APPETITE',
    valueType: 'SCORE',
    scoreValue: 2,
    source: 'MANUAL',
    severity: 'MODERATE',
    isAbnormal: true,
    requiresReview: true,
    notes: 'Left more than 40% of morning TMR refused.',
    farmId: 'farm-3',
    herdId: 'herd-6',
    recordedBy: 'Elena Rostova (Technician)',
  },
  {
    id: 'obs-3',
    animalId: 'anim-1',
    date: '2026-09-03 16:30',
    type: 'HEAT_SIGNS',
    valueType: 'TEXT',
    textValue: 'Strong standing heat observed; clear mucous discharge, mounting herd mates.',
    source: 'MANUAL',
    severity: 'INFO',
    isAbnormal: false,
    requiresReview: false,
    notes: 'Noted for ET flush scheduling on Day 7.',
    farmId: 'farm-1',
    herdId: 'herd-1',
    recordedBy: 'Sarah Jenkins (Vet Tech)',
  },
  {
    id: 'obs-4',
    animalId: 'anim-7',
    date: '2026-09-04 06:15',
    type: 'LAMENESS',
    valueType: 'SCORE',
    scoreValue: 2,
    source: 'MANUAL',
    severity: 'MILD',
    isAbnormal: true,
    requiresReview: true,
    notes: 'Mild arching of back when walking, reluctant on left hind.',
    farmId: 'farm-1',
    herdId: 'herd-2',
    recordedBy: 'Elena Rostova (Technician)',
  },
];

const initialTasks: AnimalTask[] = [
  {
    id: 'task-1',
    animalId: 'anim-4',
    animalName: 'Cloverdale Bella 14',
    animalIdentifier: 'US-6330912',
    title: 'Administer Antipyretic & Recheck Temperature',
    description: 'Provide prescribed NSAID (flunixin meglumine) and recheck core body temp in 4 hours.',
    taskType: 'HEALTH_CHECK',
    priority: 'URGENT',
    status: 'OPEN',
    dueDate: '2026-09-04',
    assigneeName: 'Marcus Vance (Field Vet)',
    farmId: 'farm-3',
    herdId: 'herd-6',
  },
  {
    id: 'task-2',
    animalId: 'anim-1',
    animalName: 'Altair Supernova ET',
    animalIdentifier: 'US-9941203',
    title: 'Oocyte Pick-Up (OPU) Prep Protocol',
    description: 'Verify fasting status, perform ultrasound ovarian scan before scheduled aspiration.',
    taskType: 'SAMPLING',
    priority: 'HIGH',
    status: 'OPEN',
    dueDate: '2026-09-05',
    assigneeName: 'Sarah Jenkins (Vet Tech)',
    farmId: 'farm-1',
    herdId: 'herd-1',
  },
  {
    id: 'task-3',
    animalId: 'anim-2',
    animalName: 'Ironwood Titan Red',
    animalIdentifier: 'US-7782341',
    title: 'Post-Collection Motility & Concentration Analysis',
    description: 'Straw evaluation for cryopreservation batch #2026-C88.',
    taskType: 'SAMPLING',
    priority: 'MEDIUM',
    status: 'OPEN',
    dueDate: '2026-09-04',
    assigneeName: 'Tim O’Connor (Stud Master)',
    farmId: 'farm-2',
    herdId: 'herd-4',
  },
  {
    id: 'task-4',
    animalId: 'anim-7',
    animalName: 'Oakridge Duchess 7',
    animalIdentifier: 'US-3112890',
    title: 'Hoof Trimming & Locomotion Review',
    description: 'Inspect left rear claw for digital dermatitis or sole ulcer.',
    taskType: 'HOOF_TRIMMING',
    priority: 'MEDIUM',
    status: 'OPEN',
    dueDate: '2026-09-04',
    assigneeName: 'Mark Henderson (Herd Lead)',
    farmId: 'farm-1',
    herdId: 'herd-2',
  },
  {
    id: 'task-5',
    animalId: 'anim-9',
    animalName: 'Calf Maverick ET',
    animalIdentifier: 'US-0042119',
    title: 'Genomic Tissue Sampling Unit (TSU) Collection',
    description: 'Collect ear notch biopsy for 100K GGP Bovine chip profiling.',
    taskType: 'SAMPLING',
    priority: 'HIGH',
    status: 'OPEN',
    dueDate: '2026-09-06',
    assigneeName: 'Elena Rostova (Technician)',
    farmId: 'farm-1',
    herdId: 'herd-3',
  },
];

const initialMedia: AnimalMedia[] = initialMediaAssets;
const initialAlbums: MediaAlbum[] = initialMediaAlbums;

const initialFarmDailyLogs: FarmDailyLog[] = [
  {
    id: 'fdl-1',
    farmId: 'farm-1',
    date: '2026-09-04',
    totalHead: 68,
    presentHead: 68,
    sickCount: 2,
    treatmentCount: 2,
    quarantineCount: 1,
    criticalAlertCount: 1,
    birthsCount: 1,
    deathsCount: 0,
    weaningCount: 0,
    movementsInCount: 0,
    movementsOutCount: 0,
    heatObservedCount: 4,
    breedingCount: 3,
    pregnancyChecksCount: 5,
    calvingsCount: 1,
    feedOfferedKg: 3450,
    feedRefusedKg: 140,
    feedConsumedKg: 3310,
    waterConsumedL: 6400,
    openHealthCases: 2,
    overdueTasks: 0,
    notes: 'All parlor milkings completed on time. Calf born healthy in Pen 3.',
    loggedBy: 'Mark Henderson (Herd Lead)',
  },
  {
    id: 'fdl-2',
    farmId: 'farm-2',
    date: '2026-09-04',
    totalHead: 52,
    presentHead: 52,
    sickCount: 1,
    treatmentCount: 1,
    quarantineCount: 0,
    criticalAlertCount: 0,
    birthsCount: 0,
    deathsCount: 0,
    weaningCount: 0,
    movementsInCount: 0,
    movementsOutCount: 0,
    heatObservedCount: 2,
    breedingCount: 1,
    pregnancyChecksCount: 0,
    calvingsCount: 0,
    feedOfferedKg: 2800,
    feedRefusedKg: 120,
    feedConsumedKg: 2680,
    waterConsumedL: 4900,
    openHealthCases: 1,
    overdueTasks: 0,
    notes: 'Sire pens cleaned and bedded. Bull collection batch completed.',
    loggedBy: 'Tim O’Connor (Stud Master)',
  },
];

const initialHerdDailyLogs: HerdDailyLog[] = [
  {
    id: 'hdl-1',
    herdId: 'herd-1',
    farmId: 'farm-1',
    date: '2026-09-04',
    headCount: 24,
    normalCount: 23,
    abnormalCount: 1,
    logsCompleted: 22,
    logsMissing: 2,
    feedIntakeKg: 588,
    waterIntakeL: 2280,
    notes: 'High donor appetite; Supernova showing strong heat signs.',
    loggedBy: 'Elena Rostova',
  },
  {
    id: 'hdl-2',
    herdId: 'herd-6',
    farmId: 'farm-3',
    date: '2026-09-04',
    headCount: 26,
    normalCount: 24,
    abnormalCount: 2,
    logsCompleted: 24,
    logsMissing: 2,
    feedIntakeKg: 620,
    waterIntakeL: 2400,
    notes: 'Cloverdale Bella flagged with fever; placed in recovery box.',
    loggedBy: 'Sarah Jenkins',
  },
];

const initialFeedingLogs: GroupFeedingLog[] = [
  {
    id: 'feed-1',
    farmId: 'farm-1',
    herdId: 'herd-1',
    managementGroupId: 'group-1',
    groupName: 'Donor Pen 1 (Pre-Flushing)',
    date: '2026-09-04',
    rationName: 'Flushing Lactating TMR Premium',
    rationVersion: 'v4.2',
    batchReference: 'BATCH-FL-260904',
    animalsFedCount: 12,
    feedOfferedKg: 600,
    feedRefusedKg: 22,
    feedConsumedKg: 578,
    dryMatterPct: 54.5,
    dmiKgPerHead: 26.2,
    concentrateKg: 240,
    forageKg: 330,
    supplementsKg: 30,
    notes: 'Optimal DM intake, consistent mix, no sorting observed.',
    highRefusalFlag: false,
  },
  {
    id: 'feed-2',
    farmId: 'farm-1',
    herdId: 'herd-2',
    managementGroupId: 'group-3',
    groupName: 'Fresh Cow Milking Pen',
    date: '2026-09-04',
    rationName: 'High Output Transition Cow Ration',
    rationVersion: 'v2.1',
    batchReference: 'BATCH-TR-260904',
    animalsFedCount: 15,
    feedOfferedKg: 780,
    feedRefusedKg: 68,
    feedConsumedKg: 712,
    dryMatterPct: 51.0,
    dmiKgPerHead: 24.2,
    concentrateKg: 350,
    forageKg: 400,
    supplementsKg: 30,
    notes: 'Slightly higher refusal in north trough due to waterer condensation.',
    highRefusalFlag: false,
  },
];

const initialEnvironmentLogs: FarmEnvironmentLog[] = [
  {
    id: 'env-1',
    farmId: 'farm-1',
    date: '2026-09-04 06:00',
    airTempC: 21.5,
    relativeHumidityPct: 58,
    thi: 67,
    heatStressRisk: 'NONE',
    rainfallMm: 0,
    windSpeedKmh: 12,
    barnTempC: 20.8,
    ventilationStatus: 'OPTIMAL',
    beddingScore: 4.5,
    mudScore: 1.2,
    pastureScore: 4.0,
    shadeScore: 5.0,
    waterAvailabilityScore: 4.8,
    source: 'SENSOR',
  },
  {
    id: 'env-2',
    farmId: 'farm-4',
    date: '2026-09-04 12:00',
    airTempC: 29.5,
    relativeHumidityPct: 65,
    thi: 78,
    heatStressRisk: 'MODERATE',
    rainfallMm: 0,
    windSpeedKmh: 8,
    barnTempC: 28.0,
    ventilationStatus: 'FAIR',
    beddingScore: 4.0,
    mudScore: 1.5,
    pastureScore: 3.5,
    shadeScore: 4.2,
    waterAvailabilityScore: 4.5,
    source: 'SENSOR',
  },
];

const initialFarmEvents: FarmOperationalEvent[] = [
  {
    id: 'fevt-1',
    farmId: 'farm-3',
    farmName: 'Emerald Prairie Genomic Nucleus',
    title: 'Quarantine Protocol Initiated for Pen 6',
    eventType: 'BIOSECURITY',
    severity: 'HIGH',
    occurrenceTime: '2026-09-04 07:30',
    status: 'OPEN',
    notes: 'Cloverdale Bella 14 presenting fever >39.5°C; biosecurity boot dips refreshed and access restricted.',
    reportedBy: 'Marcus Vance (Field Vet)',
  },
  {
    id: 'fevt-2',
    farmId: 'farm-1',
    farmName: 'Meadowlands Dairy & Genetics Hub',
    title: 'Backup Generator Automated Exercise Test',
    eventType: 'EQUIPMENT_FAILURE',
    severity: 'LOW',
    occurrenceTime: '2026-09-03 10:00',
    status: 'RESOLVED',
    resolutionTime: '2026-09-03 11:15',
    notes: 'Scheduled monthly transfer switch test passed with zero load interruption.',
    reportedBy: 'Mark Henderson (Herd Lead)',
  },
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Fever Alert: Cloverdale Bella 14',
    message: 'Temperature recorded at 39.8°C with drop in morning intake.',
    type: 'ALERT',
    entityType: 'ANIMAL',
    entityId: 'anim-4',
    timestamp: '2026-09-04 07:22',
    isRead: false,
    isArchived: false,
    linkUrl: '/bovine/animals/anim-4/observations',
  },
  {
    id: 'notif-2',
    title: 'New Animal Registered',
    message: 'Calf Maverick ET was submitted for pedigree approval.',
    type: 'REGISTRATION',
    entityType: 'ANIMAL',
    entityId: 'anim-9',
    timestamp: '2026-09-04 06:10',
    isRead: false,
    isArchived: false,
    linkUrl: '/bovine/animals/anim-9',
  },
  {
    id: 'notif-3',
    title: 'Urgent Task Assigned',
    message: 'Administer Antipyretic & Recheck Temperature due by 12:00 PM.',
    type: 'TASK',
    entityType: 'TASK',
    entityId: 'task-1',
    timestamp: '2026-09-04 07:25',
    isRead: false,
    isArchived: false,
    linkUrl: '/bovine/tasks',
  },
  {
    id: 'notif-4',
    title: 'High THI Environmental Advisory',
    message: 'Sunrise Pastures THI reached 78 (Moderate Heat Stress Risk). Fans engaged.',
    type: 'ALERT',
    entityType: 'FARM',
    entityId: 'farm-4',
    timestamp: '2026-09-04 06:00',
    isRead: true,
    isArchived: false,
    linkUrl: '/bovine/farms/farm-4/environment',
  },
];

export function BovineProvider({ children }: { children: React.ReactNode }) {
  // Session
  const [session, setSession] = useState<UserSession>({
    userId: 'usr-1',
    name: 'Dr. John Miller',
    email: 'j.miller@apexbovine.com',
    role: 'FARM_MANAGER',
    organizationId: 'org-apex',
    activeFarmId: 'ALL',
    activeHerdId: 'ALL',
  });

  // State collections with lazy localStorage fallback
  const [farms, setFarms] = useState<Farm[]>(initialFarms);
  const [herds, setHerds] = useState<Herd[]>(initialHerds);
  const [groups, setGroups] = useState<ManagementGroup[]>(initialGroups);
  const [animals, setAnimals] = useState<Animal[]>(initialAnimals);
  const [identifiers, setIdentifiers] = useState<AnimalIdentifier[]>(initialIdentifiers);
  const [breedCompositions, setBreedCompositions] = useState<AnimalBreedComposition[]>(initialBreedCompositions);
  const [parentages, setParentages] = useState<Record<string, Parentage>>(initialParentages);
  const [ownerships, setOwnerships] = useState<AnimalOwnership[]>(initialOwnerships);
  const [movements, setMovements] = useState<AnimalMovement[]>(initialMovements);
  const [dailyLogs, setDailyLogs] = useState<DailyAnimalLog[]>(initialDailyLogs);
  const [observations, setObservations] = useState<AnimalObservation[]>(initialObservations);
  const [tasks, setTasks] = useState<AnimalTask[]>(initialTasks);
  const [media, setMedia] = useState<AnimalMedia[]>(initialMedia);
  const [mediaAlbums, setMediaAlbums] = useState<MediaAlbum[]>(initialAlbums);
  const [farmDailyLogs, setFarmDailyLogs] = useState<FarmDailyLog[]>(initialFarmDailyLogs);
  const [herdDailyLogs, setHerdDailyLogs] = useState<HerdDailyLog[]>(initialHerdDailyLogs);
  const [groupFeedingLogs, setGroupFeedingLogs] = useState<GroupFeedingLog[]>(initialFeedingLogs);
  const [environmentLogs, setEnvironmentLogs] = useState<FarmEnvironmentLog[]>(initialEnvironmentLogs);
  const [farmEvents, setFarmEvents] = useState<FarmOperationalEvent[]>(initialFarmEvents);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);

  // Phase 2 State collections
  const [healthEvents, setHealthEvents] = useState<HealthEvent[]>(initialHealthEvents);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(initialDiagnoses);
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);
  const [medicationAdministrations, setMedicationAdministrations] = useState<MedicationAdministration[]>(initialMedicationAdministrations);
  const [vaccineCatalog, setVaccineCatalog] = useState<VaccineCatalog[]>(initialVaccineCatalog);
  const [vaccinationEvents, setVaccinationEvents] = useState<VaccinationEvent[]>(initialVaccinationEvents);
  const [preventiveCareEvents, setPreventiveCareEvents] = useState<PreventiveCareEvent[]>(initialPreventiveCareEvents);
  const [breedingCycles, setBreedingCycles] = useState<BreedingCycle[]>(initialBreedingCycles);
  const [breedingEvents, setBreedingEvents] = useState<BreedingEvent[]>(initialBreedingEvents);
  const [pregnancyChecks, setPregnancyChecks] = useState<PregnancyCheck[]>(initialPregnancyChecks);
  const [pregnancies, setPregnancies] = useState<Pregnancy[]>(initialPregnancies);
  const [calvingEvents, setCalvingEvents] = useState<CalvingEvent[]>(initialCalvingEvents);
  const [calvingOffspring, setCalvingOffspring] = useState<CalvingOffspring[]>(initialCalvingOffspring);
  const [productionPeriods, setProductionPeriods] = useState<ProductionPeriod[]>(initialProductionPeriods);
  const [productionRecords, setProductionRecords] = useState<AnimalProductionRecord[]>(initialProductionRecords);
  const [sensorDevices, setSensorDevices] = useState<SensorDevice[]>(initialSensorDevices);
  const [deviceAssignments, setDeviceAssignments] = useState<AnimalDeviceAssignment[]>(initialDeviceAssignments);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>(initialSensorReadings);
  const [dailySensorSummaries, setDailySensorSummaries] = useState<DailySensorSummary[]>(initialDailySensorSummaries);

  // Supplemental Workflows State collections
  const [maternalRecords, setMaternalRecords] = useState<MaternalDevelopmentRecord[]>(initialMaternalRecords);
  const [weaningRecords, setWeaningRecords] = useState<WeaningDevelopmentRecord[]>(initialWeaningRecords);
  const [yearlingRecords, setYearlingRecords] = useState<YearlingDevelopmentRecord[]>(initialYearlingRecords);
  const [reproductiveProcesses, setReproductiveProcesses] = useState<ReproductiveProcess[]>(initialReproductiveProcesses);
  const [recipientEvaluations, setRecipientEvaluations] = useState<RecipientEvaluation[]>(initialRecipientEvaluations);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('bovine_state_v1') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        const timer = setTimeout(() => {
          if (parsed.animals) setAnimals(parsed.animals);
          if (parsed.farms) setFarms(parsed.farms);
          if (parsed.herds) setHerds(parsed.herds);
          if (parsed.groups) setGroups(parsed.groups);
          if (parsed.identifiers) setIdentifiers(parsed.identifiers);
          if (parsed.breedCompositions) setBreedCompositions(parsed.breedCompositions);
          if (parsed.parentages) setParentages(parsed.parentages);
          if (parsed.ownerships) setOwnerships(parsed.ownerships);
          if (parsed.movements) setMovements(parsed.movements);
          if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
          if (parsed.observations) setObservations(parsed.observations);
          if (parsed.tasks) setTasks(parsed.tasks);
          if (parsed.media) setMedia(parsed.media);
          if (parsed.mediaAlbums) setMediaAlbums(parsed.mediaAlbums);
          if (parsed.farmDailyLogs) setFarmDailyLogs(parsed.farmDailyLogs);
          if (parsed.herdDailyLogs) setHerdDailyLogs(parsed.herdDailyLogs);
          if (parsed.groupFeedingLogs) setGroupFeedingLogs(parsed.groupFeedingLogs);
          if (parsed.environmentLogs) setEnvironmentLogs(parsed.environmentLogs);
          if (parsed.farmEvents) setFarmEvents(parsed.farmEvents);
          if (parsed.notifications) setNotifications(parsed.notifications);
          if (parsed.session) setSession(parsed.session);
          if (parsed.healthEvents) setHealthEvents(parsed.healthEvents);
          if (parsed.diagnoses) setDiagnoses(parsed.diagnoses);
          if (parsed.treatments) setTreatments(parsed.treatments);
          if (parsed.medicationAdministrations) setMedicationAdministrations(parsed.medicationAdministrations);
          if (parsed.vaccineCatalog) setVaccineCatalog(parsed.vaccineCatalog);
          if (parsed.vaccinationEvents) setVaccinationEvents(parsed.vaccinationEvents);
          if (parsed.preventiveCareEvents) setPreventiveCareEvents(parsed.preventiveCareEvents);
          if (parsed.breedingCycles) setBreedingCycles(parsed.breedingCycles);
          if (parsed.breedingEvents) setBreedingEvents(parsed.breedingEvents);
          if (parsed.pregnancyChecks) setPregnancyChecks(parsed.pregnancyChecks);
          if (parsed.pregnancies) setPregnancies(parsed.pregnancies);
          if (parsed.calvingEvents) setCalvingEvents(parsed.calvingEvents);
          if (parsed.calvingOffspring) setCalvingOffspring(parsed.calvingOffspring);
          if (parsed.productionPeriods) {
            setProductionPeriods(parsed.productionPeriods.map((p: any) => ({
              ...p,
              periodType: p.periodType || p.type || 'LACTATION',
              type: p.type || p.periodType || 'LACTATION',
              sequence: p.sequence ?? p.cycleNumber ?? 1,
              cycleNumber: p.cycleNumber ?? p.sequence ?? 1,
              startedAt: p.startedAt || (p.startDate ? new Date(p.startDate).toISOString() : new Date().toISOString()),
              startDate: p.startDate || (p.startedAt ? p.startedAt.split('T')[0] : '—'),
            })));
          }
          if (parsed.productionRecords) {
            setProductionRecords(parsed.productionRecords.map((r: any) => ({
              ...r,
              recordType: r.recordType || r.type || 'MILK_TEST_DAY',
              type: r.type || r.recordType || 'MILK_YIELD',
              recordDate: r.recordDate || (r.recordedAt ? r.recordedAt.split('T')[0] : '—'),
              recordedAt: r.recordedAt || (r.recordDate ? new Date(r.recordDate).toISOString() : new Date().toISOString()),
            })));
          }
          if (parsed.sensorDevices) {
            setSensorDevices(parsed.sensorDevices.map((d: any) => ({
              ...d,
              deviceType: d.deviceType || d.type || 'EAR_TAG',
              type: d.type || d.deviceType || 'EAR_TAG',
              status: d.status || (d.active !== false ? 'ACTIVE' : 'INACTIVE'),
            })));
          }
          if (parsed.deviceAssignments) setDeviceAssignments(parsed.deviceAssignments);
          if (parsed.sensorReadings) setSensorReadings(parsed.sensorReadings);
          if (parsed.dailySensorSummaries) setDailySensorSummaries(parsed.dailySensorSummaries);
          if (parsed.maternalRecords) setMaternalRecords(parsed.maternalRecords);
          if (parsed.weaningRecords) setWeaningRecords(parsed.weaningRecords);
          if (parsed.yearlingRecords) setYearlingRecords(parsed.yearlingRecords);
          if (parsed.reproductiveProcesses) setReproductiveProcesses(parsed.reproductiveProcesses);
          if (parsed.recipientEvaluations) setRecipientEvaluations(parsed.recipientEvaluations);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error('Error loading stored bovine state', e);
    }
  }, []);

  // Save changes to localStorage
  const persistState = (customPayload?: Record<string, unknown>) => {
    try {
      const payload = {
        animals,
        farms,
        herds,
        groups,
        identifiers,
        breedCompositions,
        parentages,
        ownerships,
        movements,
        dailyLogs,
        observations,
        tasks,
        media,
        mediaAlbums,
        farmDailyLogs,
        herdDailyLogs,
        groupFeedingLogs,
        environmentLogs,
        farmEvents,
        notifications,
        session,
        healthEvents,
        diagnoses,
        treatments,
        medicationAdministrations,
        vaccineCatalog,
        vaccinationEvents,
        preventiveCareEvents,
        breedingCycles,
        breedingEvents,
        pregnancyChecks,
        pregnancies,
        calvingEvents,
        calvingOffspring,
        productionPeriods,
        productionRecords,
        sensorDevices,
        deviceAssignments,
        sensorReadings,
        dailySensorSummaries,
        maternalRecords,
        weaningRecords,
        yearlingRecords,
        reproductiveProcesses,
        recipientEvaluations,
        ...customPayload,
      };
      localStorage.setItem('bovine_state_v1', JSON.stringify(payload));
    } catch (e) {
      console.error('Error persisting bovine state', e);
    }
  };

  // Session setters
  const setSessionRole = (role: SystemRole) => {
    const updated = { ...session, role };
    setSession(updated);
    persistState({ session: updated });
  };

  const setActiveFarm = (farmId: string | 'ALL') => {
    const updated = { ...session, activeFarmId: farmId, activeHerdId: 'ALL' };
    setSession(updated);
    persistState({ session: updated });
  };

  const setActiveHerd = (herdId: string | 'ALL') => {
    const updated = { ...session, activeHerdId: herdId };
    setSession(updated);
    persistState({ session: updated });
  };

  // Animal Registration Wizard action
  const addAnimal: BovineContextType['addAnimal'] = ({
    animal,
    identifiers: newIds,
    breedComposition: newBc,
    parentage,
    ownership,
    initialPhoto,
  }) => {
    const animalId = `anim-${Date.now()}`;
    const primaryIdObj = newIds.find((i) => i.isPrimary) || newIds[0];

    const fullAnimal: Animal = {
      ...animal,
      id: animalId,
      primaryIdentifier: primaryIdObj ? primaryIdObj.value : undefined,
      primaryIdentifierType: primaryIdObj ? primaryIdObj.type : undefined,
      photoUrl: initialPhoto || `https://picsum.photos/seed/${animalId}/800/600`,
      openTaskCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createdIds: AnimalIdentifier[] = newIds.map((item, idx) => ({
      ...item,
      id: `id-${Date.now()}-${idx}`,
      animalId,
    }));

    const createdBc: AnimalBreedComposition[] = newBc.map((item, idx) => ({
      ...item,
      id: `bc-${Date.now()}-${idx}`,
      animalId,
    }));

    const createdOwnerships: AnimalOwnership[] = ownership
      ? [
          {
            ...ownership,
            id: `own-${Date.now()}`,
            animalId,
          },
        ]
      : [];

    const updatedAnimals = [fullAnimal, ...animals];
    const updatedIdentifiers = [...identifiers, ...createdIds];
    const updatedBreedCompositions = [...breedCompositions, ...createdBc];
    const updatedParentages = parentage
      ? { ...parentages, [animalId]: parentage }
      : parentages;
    const updatedOwnerships = [...ownerships, ...createdOwnerships];

    // Notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Animal Registered',
      message: `${fullAnimal.name} (${primaryIdObj?.value || fullAnimal.internalId}) successfully enrolled.`,
      type: 'REGISTRATION',
      entityType: 'ANIMAL',
      entityId: animalId,
      timestamp: new Date().toLocaleString(),
      isRead: false,
      isArchived: false,
      linkUrl: `/bovine/animals/${animalId}`,
    };
    const updatedNotifications = [newNotif, ...notifications];

    setAnimals(updatedAnimals);
    setIdentifiers(updatedIdentifiers);
    setBreedCompositions(updatedBreedCompositions);
    setParentages(updatedParentages);
    setOwnerships(updatedOwnerships);
    setNotifications(updatedNotifications);

    persistState({
      animals: updatedAnimals,
      identifiers: updatedIdentifiers,
      breedCompositions: updatedBreedCompositions,
      parentages: updatedParentages,
      ownerships: updatedOwnerships,
      notifications: updatedNotifications,
    });

    return animalId;
  };

  const updateAnimal = (animalId: string, updates: Partial<Animal>) => {
    const updated = animals.map((a) =>
      a.id === animalId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    );
    setAnimals(updated);
    persistState({ animals: updated });
  };

  const addIdentifier = (idData: Omit<AnimalIdentifier, 'id'>) => {
    const newId: AnimalIdentifier = {
      ...idData,
      id: `id-${Date.now()}`,
    };
    let updated = [...identifiers, newId];
    if (newId.isPrimary) {
      updated = updated.map((item) =>
        item.animalId === newId.animalId && item.id !== newId.id
          ? { ...item, isPrimary: false }
          : item
      );
      // Also update on animal
      updateAnimal(newId.animalId, {
        primaryIdentifier: newId.value,
        primaryIdentifierType: newId.type,
      });
    }
    setIdentifiers(updated);
    persistState({ identifiers: updated });
  };

  const retireIdentifier = (identifierId: string) => {
    const updated = identifiers.map((i) =>
      i.id === identifierId
        ? {
            ...i,
            status: 'RETIRED' as const,
            retirementDate: new Date().toISOString().split('T')[0],
            isPrimary: false,
          }
        : i
    );
    setIdentifiers(updated);
    persistState({ identifiers: updated });
  };

  const setPrimaryIdentifier = (identifierId: string) => {
    const target = identifiers.find((i) => i.id === identifierId);
    if (!target) return;
    const updated = identifiers.map((i) =>
      i.animalId === target.animalId
        ? { ...i, isPrimary: i.id === identifierId }
        : i
    );
    setIdentifiers(updated);
    updateAnimal(target.animalId, {
      primaryIdentifier: target.value,
      primaryIdentifierType: target.type,
    });
    persistState({ identifiers: updated });
  };

  const updateBreedComposition = (
    animalId: string,
    compositions: Omit<AnimalBreedComposition, 'id' | 'animalId'>[]
  ) => {
    const filtered = breedCompositions.filter((bc) => bc.animalId !== animalId);
    const newBcs: AnimalBreedComposition[] = compositions.map((c, i) => ({
      ...c,
      id: `bc-${Date.now()}-${i}`,
      animalId,
    }));
    const updated = [...filtered, ...newBcs];
    setBreedCompositions(updated);
    persistState({ breedCompositions: updated });
  };

  const updateParentage = (animalId: string, parentage: Parentage) => {
    const updated = { ...parentages, [animalId]: parentage };
    setParentages(updated);
    persistState({ parentages: updated });
  };

  const addOwnership = (ownershipData: Omit<AnimalOwnership, 'id'>) => {
    const newOwn: AnimalOwnership = {
      ...ownershipData,
      id: `own-${Date.now()}`,
    };
    const updated = [newOwn, ...ownerships];
    setOwnerships(updated);
    persistState({ ownerships: updated });
  };

  const recordMovement = (movData: Omit<AnimalMovement, 'id'>) => {
    const newMov: AnimalMovement = {
      ...movData,
      id: `mov-${Date.now()}`,
    };
    const updatedMovements = [newMov, ...movements];
    setMovements(updatedMovements);

    // Update animal's current farm
    const animal = animals.find((a) => a.id === movData.animalId);
    if (animal) {
      updateAnimal(animal.id, {
        farmId: movData.toFarmId,
      });
    }

    // Add notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Animal Movement Recorded',
      message: `${animal?.name || 'Animal'} moved to ${movData.toFarmName}`,
      type: 'MOVEMENT',
      entityType: 'ANIMAL',
      entityId: movData.animalId,
      timestamp: new Date().toLocaleString(),
      isRead: false,
      isArchived: false,
      linkUrl: `/bovine/animals/${movData.animalId}/movements`,
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);

    persistState({
      movements: updatedMovements,
      notifications: updatedNotifs,
    });
  };

  const addDailyAnimalLog = (logData: Omit<DailyAnimalLog, 'id'>) => {
    const newLog: DailyAnimalLog = {
      ...logData,
      id: `dl-${Date.now()}`,
    };
    const updatedLogs = [newLog, ...dailyLogs];
    setDailyLogs(updatedLogs);

    // Sync animal condition & review status
    const anim = animals.find((a) => a.id === logData.animalId);
    if (anim) {
      updateAnimal(anim.id, {
        latestConditionScore: logData.overallCondition,
        requiresReview: logData.requiresReview || anim.requiresReview,
        reviewReason: logData.reviewReason || anim.reviewReason,
      });
    }

    if (logData.isAbnormal) {
      const alertNotif: Notification = {
        id: `notif-${Date.now()}`,
        title: `Abnormal Log: ${anim?.name || 'Animal'}`,
        message: logData.reviewReason || 'Abnormal condition recorded today',
        type: 'ALERT',
        entityType: 'ANIMAL',
        entityId: logData.animalId,
        timestamp: new Date().toLocaleString(),
        isRead: false,
        isArchived: false,
        linkUrl: `/bovine/animals/${logData.animalId}/daily-log`,
      };
      const updatedNotifs = [alertNotif, ...notifications];
      setNotifications(updatedNotifs);
      persistState({ dailyLogs: updatedLogs, notifications: updatedNotifs });
    } else {
      persistState({ dailyLogs: updatedLogs });
    }
  };

  const addAnimalObservation = (obsData: Omit<AnimalObservation, 'id'>) => {
    const newObs: AnimalObservation = {
      ...obsData,
      id: `obs-${Date.now()}`,
    };
    const updatedObs = [newObs, ...observations];
    setObservations(updatedObs);

    if (obsData.requiresReview) {
      const anim = animals.find((a) => a.id === obsData.animalId);
      if (anim) {
        updateAnimal(anim.id, {
          requiresReview: true,
          reviewReason: obsData.notes || `Flagged ${obsData.type} observation`,
        });
      }
    }

    persistState({ observations: updatedObs });
  };

  const addAnimalTask = (taskData: Omit<AnimalTask, 'id'>) => {
    const newTask: AnimalTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);

    // Increment openTaskCount for animal
    const anim = animals.find((a) => a.id === taskData.animalId);
    if (anim) {
      updateAnimal(anim.id, {
        openTaskCount: (anim.openTaskCount || 0) + 1,
      });
    }

    persistState({ tasks: updatedTasks });
  };

  const updateAnimalTask = (taskId: string, updates: Partial<AnimalTask>) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    setTasks(updated);
    persistState({ tasks: updated });
  };

  const completeAnimalTask = (taskId: string, completedBy?: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: 'COMPLETED' as const,
            completedAt: new Date().toISOString(),
            completedBy: completedBy || session.name,
          }
        : t
    );
    setTasks(updated);

    // Decrement open task count on animal
    const anim = animals.find((a) => a.id === task.animalId);
    if (anim && anim.openTaskCount > 0) {
      updateAnimal(anim.id, {
        openTaskCount: Math.max(0, anim.openTaskCount - 1),
      });
    }

    persistState({ tasks: updated });
  };

  const addAnimalMedia = (mediaData: Omit<AnimalMedia, 'id'>): string => {
    const mediaId = `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newMed: AnimalMedia = {
      ...mediaData,
      id: mediaId,
      visibility: mediaData.visibility || 'INTERNAL',
      verificationStatus: mediaData.verificationStatus || 'PENDING_REVIEW',
      marketplaceStatus: mediaData.marketplaceStatus || 'NOT_LISTED',
      comments: mediaData.comments || [],
      auditHistory: mediaData.auditHistory || [
        {
          id: `aud-${Date.now()}`,
          mediaAssetId: mediaId,
          action: 'UPLOADED',
          actorName: session.name || 'System User',
          timestamp: new Date().toISOString(),
          details: 'Uploaded asset into canonical media ledger',
        },
      ],
      links: mediaData.links || [],
    };
    let updated = [newMed, ...media];
    if (newMed.isIdentityPhoto || newMed.isProfile) {
      updated = updated.map((m) =>
        m.animalId === newMed.animalId && m.id !== newMed.id
          ? { ...m, isIdentityPhoto: false, isProfile: false }
          : m
      );
      updateAnimal(newMed.animalId, {
        photoUrl: newMed.url,
      });
    }
    setMedia(updated);
    persistState({ media: updated });
    return mediaId;
  };

  const updateAnimalMedia = (mediaId: string, updates: Partial<AnimalMedia>) => {
    const updated = media.map((m) => {
      if (m.id !== mediaId) return m;
      const next: AnimalMedia = {
        ...m,
        ...updates,
        auditHistory: [
          ...(m.auditHistory || []),
          {
            id: `aud-${Date.now()}`,
            mediaAssetId: mediaId,
            action: 'METADATA_UPDATED',
            actorName: session.name || 'System User',
            timestamp: new Date().toISOString(),
            details: 'Updated media details and properties',
          },
        ],
      };
      return next;
    });
    setMedia(updated);
    persistState({ media: updated });
  };

  const deleteAnimalMedia = (mediaId: string, permanent: boolean = false) => {
    const target = media.find((m) => m.id === mediaId);
    if (!target) return;
    let updated: AnimalMedia[];
    if (permanent) {
      updated = media.filter((m) => m.id !== mediaId);
    } else {
      updated = media.map((m) =>
        m.id === mediaId
          ? {
              ...m,
              verificationStatus: 'REJECTED' as const,
              auditHistory: [
                ...(m.auditHistory || []),
                {
                  id: `aud-${Date.now()}`,
                  mediaAssetId: mediaId,
                  action: 'ARCHIVED',
                  actorName: session.name || 'System User',
                  timestamp: new Date().toISOString(),
                  details: 'Asset soft-deleted/archived',
                },
              ],
            }
          : m
      );
    }
    setMedia(updated);
    // Also remove from any albums
    const updatedAlbums = mediaAlbums.map((alb) => ({
      ...alb,
      mediaIds: alb.mediaIds.filter((id) => id !== mediaId),
    }));
    setMediaAlbums(updatedAlbums);
    persistState({ media: updated, mediaAlbums: updatedAlbums });
  };

  const setPrimaryProfilePhoto = (animalId: string, mediaId: string) => {
    const target = media.find((m) => m.id === mediaId);
    if (!target) return;
    const updated = media.map((m) =>
      m.animalId === animalId
        ? {
            ...m,
            isIdentityPhoto: m.id === mediaId,
            isProfile: m.id === mediaId,
            auditHistory:
              m.id === mediaId
                ? [
                    ...(m.auditHistory || []),
                    {
                      id: `aud-${Date.now()}`,
                      mediaAssetId: mediaId,
                      action: 'SET_PRIMARY',
                      actorName: session.name || 'System User',
                      timestamp: new Date().toISOString(),
                      details: 'Designated as primary identity portrait',
                    },
                  ]
                : m.auditHistory,
          }
        : m
    );
    setMedia(updated);
    updateAnimal(animalId, { photoUrl: target.url });
    persistState({ media: updated });
  };

  const addMediaComment = (mediaId: string, comment: Omit<MediaComment, 'id' | 'date'>) => {
    const newComment: MediaComment = {
      ...comment,
      id: `comm-${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updated = media.map((m) =>
      m.id === mediaId
        ? {
            ...m,
            comments: [...(m.comments || []), newComment],
            auditHistory: [
              ...(m.auditHistory || []),
              {
                id: `aud-${Date.now()}`,
                mediaId,
                mediaAssetId: mediaId,
                action: 'COMMENT_ADDED',
                actorName: comment.authorName,
                timestamp: new Date().toISOString(),
                details: `Added note: "${((comment as any).text || comment.message || '').slice(0, 40)}..."`,
              },
            ],
          }
        : m
    );
    setMedia(updated);
    persistState({ media: updated });
  };

  const verifyAnimalMedia = (mediaId: string, status: MediaVerificationStatus, note?: string) => {
    const updated = media.map((m) =>
      m.id === mediaId
        ? {
            ...m,
            verificationStatus: status,
            verifiedBy: session.name || 'System User',
            verifiedAt: new Date().toISOString(),
            verificationNote: note || m.verificationNote,
            auditHistory: [
              ...(m.auditHistory || []),
              {
                id: `aud-${Date.now()}`,
                mediaAssetId: mediaId,
                action: status === 'VERIFIED' ? 'VERIFIED' : 'REJECTED',
                actorName: session.name || 'System User',
                timestamp: new Date().toISOString(),
                details: `Verification status changed to ${status}${note ? `: ${note}` : ''}`,
              },
            ],
          }
        : m
    );
    setMedia(updated);
    persistState({ media: updated });
  };

  const updateMediaVisibility = (mediaId: string, visibility: MediaVisibility) => {
    const updated = media.map((m) =>
      m.id === mediaId
        ? {
            ...m,
            visibility,
            auditHistory: [
              ...(m.auditHistory || []),
              {
                id: `aud-${Date.now()}`,
                mediaId,
                mediaAssetId: mediaId,
                action: 'VISIBILITY_CHANGED',
                actorName: session.name || 'System User',
                timestamp: new Date().toISOString(),
                details: `Visibility changed to ${visibility}`,
              },
            ],
          }
        : m
    );
    setMedia(updated);
    persistState({ media: updated });
  };

  const toggleMarketplaceMedia = (mediaId: string, selected: boolean, order?: number) => {
    const updated = media.map((m) =>
      m.id === mediaId
        ? {
            ...m,
            marketplaceSelected: selected,
            marketplaceStatus: selected ? ('APPROVED_FOR_PUBLIC' as const) : ('NOT_LISTED' as const),
            marketplaceOrder: order !== undefined ? order : m.marketplaceOrder,
            auditHistory: [
              ...(m.auditHistory || []),
              {
                id: `aud-${Date.now()}`,
                mediaId,
                mediaAssetId: mediaId,
                action: selected ? 'FEATURED_MARKETPLACE' : 'UNFEATURED_MARKETPLACE',
                actorName: session.name || 'System User',
                timestamp: new Date().toISOString(),
                details: selected ? 'Enrolled in marketplace showcase' : 'Removed from marketplace showcase',
              },
            ],
          }
        : m
    );
    setMedia(updated);
    persistState({ media: updated });
  };

  const createMediaAlbum = (albumData: Omit<MediaAlbum, 'id' | 'createdAt'>): string => {
    const albumId = `alb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newAlb: MediaAlbum = {
      ...albumData,
      id: albumId,
      createdAt: new Date().toISOString(),
      mediaIds: albumData.mediaIds || [],
    };
    const updated = [...mediaAlbums, newAlb];
    setMediaAlbums(updated);
    persistState({ mediaAlbums: updated });
    return albumId;
  };

  const addMediaToAlbum = (albumId: string, mediaIds: string[]) => {
    const updated = mediaAlbums.map((alb) => {
      if (alb.id !== albumId) return alb;
      const combined = Array.from(new Set([...alb.mediaIds, ...mediaIds]));
      return { ...alb, mediaIds: combined };
    });
    setMediaAlbums(updated);
    persistState({ mediaAlbums: updated });
  };

  const removeMediaFromAlbum = (albumId: string, mediaIds: string[]) => {
    const targetSet = new Set(mediaIds);
    const updated = mediaAlbums.map((alb) => {
      if (alb.id !== albumId) return alb;
      return { ...alb, mediaIds: alb.mediaIds.filter((id) => !targetSet.has(id)) };
    });
    setMediaAlbums(updated);
    persistState({ mediaAlbums: updated });
  };

  const linkMediaToEntity = (mediaId: string, link: Omit<MediaLink, 'id' | 'mediaAssetId'>) => {
    const newLink: MediaLink = {
      ...link,
      id: `lnk-${Date.now()}`,
      mediaAssetId: mediaId,
    };
    const updated = media.map((m) =>
      m.id === mediaId
        ? {
            ...m,
            links: [...(m.links || []), newLink],
            auditHistory: [
              ...(m.auditHistory || []),
              {
                id: `aud-${Date.now()}`,
                mediaId,
                mediaAssetId: mediaId,
                action: 'LINKED_RECORD',
                actorName: session.name || 'System User',
                timestamp: new Date().toISOString(),
                details: `Linked to ${link.entityType} (${link.label || link.entityId})`,
              },
            ],
          }
        : m
    );
    setMedia(updated);
    persistState({ media: updated });
  };


  const addFarm: BovineContextType['addFarm'] = (farmData) => {
    const farmId = `farm-${Date.now()}`;
    const newFarm: Farm = {
      ...farmData,
      id: farmId,
      headCount: 0,
      herdCount: 0,
      sickCount: 0,
      reviewCount: 0,
      openTasks: 0,
      birthsThisMonth: 0,
      deathsThisMonth: 0,
      movementsThisMonth: 0,
      environmentSummary: {
        airTempC: 22.0,
        humidityPct: 50,
        thi: 68,
        heatStressRisk: 'NONE',
        beddingScore: 4.5,
        mudScore: 1.0,
        waterScore: 4.8,
      },
      feedSummary: {
        offeredKg: 0,
        consumedKg: 0,
        refusalPct: 0,
      },
    };
    const updated = [...farms, newFarm];
    setFarms(updated);
    persistState({ farms: updated });
    return farmId;
  };

  const addHerd: BovineContextType['addHerd'] = (herdData) => {
    const herdId = `herd-${Date.now()}`;
    const newHerd: Herd = {
      ...herdData,
      id: herdId,
      headCount: 0,
      groupCount: 0,
      reviewCount: 0,
      dailyLogCompletionPct: 100,
      alertsCount: 0,
    };
    const updated = [...herds, newHerd];
    setHerds(updated);
    // Increment herdCount on farm
    const farm = farms.find((f) => f.id === herdData.farmId);
    if (farm) {
      setFarms(
        farms.map((f) =>
          f.id === farm.id ? { ...f, herdCount: f.herdCount + 1 } : f
        )
      );
    }
    persistState({ herds: updated });
    return herdId;
  };

  const addGroup: BovineContextType['addGroup'] = (groupData) => {
    const groupId = `group-${Date.now()}`;
    const newGroup: ManagementGroup = {
      ...groupData,
      id: groupId,
      headCount: 0,
      dailyLogCompletionPct: 100,
    };
    const updated = [...groups, newGroup];
    setGroups(updated);
    // Increment groupCount on herd
    const herd = herds.find((h) => h.id === groupData.herdId);
    if (herd) {
      setHerds(
        herds.map((h) =>
          h.id === herd.id ? { ...h, groupCount: h.groupCount + 1 } : h
        )
      );
    }
    persistState({ groups: updated });
    return groupId;
  };

  const addFarmDailyLog = (logData: Omit<FarmDailyLog, 'id'>) => {
    const newLog: FarmDailyLog = {
      ...logData,
      id: `fdl-${Date.now()}`,
    };
    const updated = [newLog, ...farmDailyLogs];
    setFarmDailyLogs(updated);
    persistState({ farmDailyLogs: updated });
  };

  const addHerdDailyLog = (logData: Omit<HerdDailyLog, 'id'>) => {
    const newLog: HerdDailyLog = {
      ...logData,
      id: `hdl-${Date.now()}`,
    };
    const updated = [newLog, ...herdDailyLogs];
    setHerdDailyLogs(updated);
    persistState({ herdDailyLogs: updated });
  };

  const addGroupFeedingLog = (logData: Omit<GroupFeedingLog, 'id'>) => {
    const newLog: GroupFeedingLog = {
      ...logData,
      id: `feed-${Date.now()}`,
    };
    const updated = [newLog, ...groupFeedingLogs];
    setGroupFeedingLogs(updated);
    persistState({ groupFeedingLogs: updated });
  };

  const addFarmEnvironmentLog = (logData: Omit<FarmEnvironmentLog, 'id'>) => {
    const newLog: FarmEnvironmentLog = {
      ...logData,
      id: `env-${Date.now()}`,
    };
    const updated = [newLog, ...environmentLogs];
    setEnvironmentLogs(updated);
    // Sync to farm environmentSummary
    const farm = farms.find((f) => f.id === logData.farmId);
    if (farm) {
      setFarms(
        farms.map((f) =>
          f.id === farm.id
            ? {
                ...f,
                environmentSummary: {
                  airTempC: logData.airTempC,
                  humidityPct: logData.relativeHumidityPct,
                  thi: logData.thi,
                  heatStressRisk: logData.heatStressRisk,
                  beddingScore: logData.beddingScore,
                  mudScore: logData.mudScore,
                  waterScore: logData.waterAvailabilityScore,
                },
              }
            : f
        )
      );
    }
    persistState({ environmentLogs: updated });
  };

  const addFarmOperationalEvent = (
    eventData: Omit<FarmOperationalEvent, 'id'>
  ) => {
    const newEvent: FarmOperationalEvent = {
      ...eventData,
      id: `fevt-${Date.now()}`,
    };
    const updatedEvents = [newEvent, ...farmEvents];
    setFarmEvents(updatedEvents);

    const alertNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: `Farm Incident: ${newEvent.title}`,
      message: `${newEvent.farmName} reported ${newEvent.eventType} (${newEvent.severity})`,
      type: 'ALERT',
      entityType: 'INCIDENT',
      entityId: newEvent.id,
      timestamp: new Date().toLocaleString(),
      isRead: false,
      isArchived: false,
      linkUrl: `/bovine/farms/${newEvent.farmId}/events`,
    };
    const updatedNotifs = [alertNotif, ...notifications];
    setNotifications(updatedNotifs);

    persistState({
      farmEvents: updatedEvents,
      notifications: updatedNotifs,
    });
  };

  const resolveFarmOperationalEvent = (
    eventId: string,
    resolutionNotes?: string
  ) => {
    const updated = farmEvents.map((evt) =>
      evt.id === eventId
        ? {
            ...evt,
            status: 'RESOLVED' as const,
            resolutionTime: new Date().toISOString(),
            notes: resolutionNotes ? `${evt.notes || ''} [Resolution: ${resolutionNotes}]` : evt.notes,
          }
        : evt
    );
    setFarmEvents(updated);
    persistState({ farmEvents: updated });
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    persistState({ notifications: updated });
  };

  const archiveNotification = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isArchived: true } : n
    );
    setNotifications(updated);
    persistState({ notifications: updated });
  };

  const bulkMarkNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    persistState({ notifications: updated });
  };

  const bulkAssignHerd = (
    animalIds: string[],
    farmId: string,
    herdId: string,
    managementGroupId?: string
  ) => {
    const updated = animals.map((a) =>
      animalIds.includes(a.id)
        ? {
            ...a,
            farmId,
            herdId,
            managementGroupId: managementGroupId || a.managementGroupId,
            updatedAt: new Date().toISOString(),
          }
        : a
    );
    setAnimals(updated);
    persistState({ animals: updated });
  };

  const bulkCreateTasks = (
    animalIds: string[],
    taskTemplate: {
      title: string;
      taskType: AnimalTask['taskType'];
      priority: AnimalTask['priority'];
      dueDate: string;
      assigneeName: string;
      description?: string;
    }
  ) => {
    const newTasks: AnimalTask[] = animalIds.map((aid, idx) => {
      const anim = animals.find((a) => a.id === aid);
      return {
        id: `task-${Date.now()}-${idx}`,
        animalId: aid,
        animalName: anim?.name || 'Animal',
        animalIdentifier: anim?.primaryIdentifier || anim?.internalId || 'ID',
        title: taskTemplate.title,
        description: taskTemplate.description,
        taskType: taskTemplate.taskType,
        priority: taskTemplate.priority,
        status: 'OPEN',
        dueDate: taskTemplate.dueDate,
        assigneeName: taskTemplate.assigneeName,
        farmId: anim?.farmId || 'farm-1',
        herdId: anim?.herdId || 'herd-1',
      };
    });

    const updatedTasks = [...newTasks, ...tasks];
    setTasks(updatedTasks);

    const updatedAnimals = animals.map((a) =>
      animalIds.includes(a.id)
        ? { ...a, openTaskCount: (a.openTaskCount || 0) + 1 }
        : a
    );
    setAnimals(updatedAnimals);

    persistState({ tasks: updatedTasks, animals: updatedAnimals });
  };

  const bulkMoveAnimals = (
    animalIds: string[],
    destinationFarmId: string,
    destinationHerdId: string,
    reason: string
  ) => {
    const destFarm = farms.find((f) => f.id === destinationFarmId);
    const newMovements: AnimalMovement[] = [];

    const updatedAnimals = animals.map((a) => {
      if (!animalIds.includes(a.id)) return a;
      const srcFarm = farms.find((f) => f.id === a.farmId);
      newMovements.push({
        id: `mov-${Date.now()}-${a.id}`,
        animalId: a.id,
        fromFarmId: a.farmId,
        fromFarmName: srcFarm?.name || 'Origin Farm',
        toFarmId: destinationFarmId,
        toFarmName: destFarm?.name || 'Destination Farm',
        movementType: 'INTER_FARM_TRANSFER',
        movementDate: new Date().toISOString().split('T')[0],
        reason,
        referenceNumber: `BLK-TR-${Date.now().toString().slice(-6)}`,
        operatorName: session.name,
      });

      return {
        ...a,
        farmId: destinationFarmId,
        herdId: destinationHerdId,
        updatedAt: new Date().toISOString(),
      };
    });

    const updatedAllMovements = [...newMovements, ...movements];
    setMovements(updatedAllMovements);
    setAnimals(updatedAnimals);
    persistState({ movements: updatedAllMovements, animals: updatedAnimals });
  };

  // Phase 2 Mutations - Health
  const addHealthEvent: BovineContextType['addHealthEvent'] = (eventData) => {
    const eventId = `he-${Date.now()}`;
    const newEvent: HealthEvent = {
      ...eventData,
      id: eventId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newEvent, ...healthEvents];
    setHealthEvents(updated);
    const anim = animals.find((a) => a.id === eventData.animalId);
    if (anim && (eventData.severity === 'HIGH' || eventData.severity === 'CRITICAL')) {
      updateAnimal(anim.id, { requiresReview: true, reviewReason: `Health incident: ${eventData.reason}` });
    }
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: `Health Case Opened: ${anim?.name || 'Animal'}`,
      message: `${eventData.reason} (${eventData.severity || 'MODERATE'} severity)`,
      type: 'HEALTH',
      entityType: 'ANIMAL',
      entityId: eventData.animalId,
      timestamp: new Date().toLocaleString(),
      isRead: false,
      isArchived: false,
      linkUrl: `/bovine/health/cases`,
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    persistState({ healthEvents: updated, notifications: updatedNotifs });
    return eventId;
  };

  const closeHealthEvent = (eventId: string, notes?: string) => {
    const updated = healthEvents.map((he) =>
      he.id === eventId
        ? {
            ...he,
            status: 'RESOLVED' as HealthEventStatus,
            closedAt: new Date().toISOString(),
            notes: notes ? `${he.notes ? he.notes + '\n' : ''}Resolution: ${notes}` : he.notes,
            updatedAt: new Date().toISOString(),
          }
        : he
    );
    setHealthEvents(updated);
    persistState({ healthEvents: updated });
  };

  const addDiagnosis: BovineContextType['addDiagnosis'] = (diagData) => {
    const newDiag: Diagnosis = {
      ...diagData,
      id: `diag-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newDiag, ...diagnoses];
    setDiagnoses(updated);
    persistState({ diagnoses: updated });
  };

  const addTreatment: BovineContextType['addTreatment'] = (treatData) => {
    const treatId = `treat-${Date.now()}`;
    const newTreat: Treatment = {
      ...treatData,
      id: treatId,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTreat, ...treatments];
    setTreatments(updated);
    persistState({ treatments: updated });
    return treatId;
  };

  const addMedicationAdministration: BovineContextType['addMedicationAdministration'] = (adminData) => {
    const newAdmin: MedicationAdministration = {
      ...adminData,
      id: `med-adm-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newAdmin, ...medicationAdministrations];
    setMedicationAdministrations(updated);
    persistState({ medicationAdministrations: updated });
  };

  const recordMedicationGiven = (adminId: string, batchNumber?: string, notes?: string) => {
    const updated = medicationAdministrations.map((m) =>
      m.id === adminId
        ? {
            ...m,
            status: 'GIVEN' as MedicationAdministrationStatus,
            administeredAt: new Date().toISOString(),
            batchNumber: batchNumber || m.batchNumber,
            administeredByName: session.name,
            notes: notes ? `${m.notes ? m.notes + '\n' : ''}${notes}` : m.notes,
          }
        : m
    );
    setMedicationAdministrations(updated);
    persistState({ medicationAdministrations: updated });
  };

  const addVaccinationEvent: BovineContextType['addVaccinationEvent'] = (vacData) => {
    const newVac: VaccinationEvent = {
      ...vacData,
      id: `vacevt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newVac, ...vaccinationEvents];
    setVaccinationEvents(updated);
    persistState({ vaccinationEvents: updated });
  };

  const addPreventiveCareEvent: BovineContextType['addPreventiveCareEvent'] = (prevData) => {
    const newPrev: PreventiveCareEvent = {
      ...prevData,
      id: `pcare-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPrev, ...preventiveCareEvents];
    setPreventiveCareEvents(updated);
    persistState({ preventiveCareEvents: updated });
  };

  // Phase 2 Mutations - Reproduction
  const addBreedingCycle: BovineContextType['addBreedingCycle'] = (cycleData) => {
    const cycleId = `bc-${Date.now()}`;
    const newCycle: BreedingCycle = {
      ...cycleData,
      id: cycleId,
      createdAt: new Date().toISOString(),
    };
    const updated = [newCycle, ...breedingCycles];
    setBreedingCycles(updated);
    persistState({ breedingCycles: updated });
    return cycleId;
  };

  const closeBreedingCycle = (cycleId: string, status?: BreedingCycleStatus) => {
    const updated = breedingCycles.map((c) =>
      c.id === cycleId
        ? {
            ...c,
            status: status || 'CLOSED',
            endDate: new Date().toISOString().split('T')[0],
          }
        : c
    );
    setBreedingCycles(updated);
    persistState({ breedingCycles: updated });
  };

  const addBreedingEvent: BovineContextType['addBreedingEvent'] = (eventData) => {
    const eventId = `be-${Date.now()}`;
    const newEvent: BreedingEvent = {
      ...eventData,
      id: eventId,
      createdAt: new Date().toISOString(),
    };
    const updated = [newEvent, ...breedingEvents];
    setBreedingEvents(updated);
    persistState({ breedingEvents: updated });
    return eventId;
  };

  const addPregnancyCheck: BovineContextType['addPregnancyCheck'] = (checkData) => {
    const newCheck: PregnancyCheck = {
      ...checkData,
      id: `pgchk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newCheck, ...pregnancyChecks];
    setPregnancyChecks(updated);
    persistState({ pregnancyChecks: updated });
  };

  const confirmPregnancy = (
    damId: string,
    conceptionDate: string,
    expectedCalvingDate: string,
    breedingCycleId?: string,
    breedingEventId?: string
  ) => {
    const pregId = `preg-${Date.now()}`;
    const dam = animals.find((a) => a.id === damId);
    const newPreg: Pregnancy = {
      id: pregId,
      damId,
      breedingCycleId,
      breedingEventId,
      conceptionDate,
      expectedCalvingDate,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };
    const updated = [newPreg, ...pregnancies];
    setPregnancies(updated);

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Pregnancy Confirmed',
      message: `${dam?.name || 'Dam'} confirmed pregnant. Expected calving: ${expectedCalvingDate}`,
      type: 'BREEDING',
      entityType: 'ANIMAL',
      entityId: damId,
      timestamp: new Date().toLocaleString(),
      isRead: false,
      isArchived: false,
      linkUrl: `/bovine/reproduction/pregnancies`,
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);

    persistState({ pregnancies: updated, notifications: updatedNotifs });
    return pregId;
  };

  const addCalvingEvent: BovineContextType['addCalvingEvent'] = ({ event, offspring: offspringList }) => {
    const calvingId = `calv-${Date.now()}`;
    const newCalv: CalvingEvent = {
      ...event,
      id: calvingId,
      createdAt: new Date().toISOString(),
    };
    const dam = animals.find((a) => a.id === event.damId);

    const createdOffspring: CalvingOffspring[] = [];
    const newCalfAnimals: Animal[] = [];
    const newIdentifiers: AnimalIdentifier[] = [];
    const newParentages: Record<string, Parentage> = {};

    offspringList.forEach((off, idx) => {
      const calfAnimId = `anim-calf-${Date.now()}-${idx}`;
      const offId = `calfoff-${Date.now()}-${idx}`;

      createdOffspring.push({
        id: offId,
        calvingEventId: calvingId,
        animalId: calfAnimId,
        calfAnimalId: off.birthOutcome === 'LIVE' ? calfAnimId : undefined,
        birthOrder: off.birthOrder,
        birthOutcome: off.birthOutcome,
        birthWeightKg: off.birthWeightKg,
        neonatalNotes: off.neonatalNotes,
      });

      if (off.birthOutcome === 'LIVE') {
        const calfTag = off.tagNumber || `CALF-${Date.now().toString().slice(-4)}-${idx + 1}`;
        newCalfAnimals.push({
          id: calfAnimId,
          internalId: `BV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}${idx}`,
          name: off.name || `Calf of ${dam?.name || 'Dam'}`,
          sex: off.sex || 'FEMALE',
          birthDate: event.calvingDate || event.calvingAt || new Date().toISOString().split('T')[0],
          lifeStatus: 'ALIVE',
          useStatus: 'GENERAL',
          coatColor: off.coatColor || dam?.coatColor || 'Standard',
          hornStatus: 'UNKNOWN',
          ownerOrgId: dam?.ownerOrgId || 'org-apex',
          farmId: event.farmId || dam?.farmId || 'farm-1',
          herdId: dam?.herdId || herds.find((h) => h.farmId === (event.farmId || dam?.farmId))?.id || 'herd-1',
          registrationStatus: 'PENDING',
          photoUrl: `https://picsum.photos/seed/${calfAnimId}/800/600`,
          requiresReview: false,
          latestConditionScore: 4.0,
          openTaskCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          primaryIdentifier: calfTag,
          primaryIdentifierType: 'EAR_TAG',
        });

        newIdentifiers.push({
          id: `id-calf-${Date.now()}-${idx}`,
          animalId: calfAnimId,
          type: 'EAR_TAG',
          value: calfTag,
          issuer: 'Farm Calving Register',
          country: 'USA',
          isPrimary: true,
          issueDate: event.calvingDate || event.calvingAt || new Date().toISOString().split('T')[0],
          status: 'ACTIVE',
        });

        if (event.damId) {
          newParentages[calfAnimId] = {
            damId: event.damId,
            damName: dam?.name,
            damIdentifier: dam?.primaryIdentifier || dam?.internalId,
            verificationStatus: 'RECORDED',
            sireStatus: 'RECORDED',
            damStatus: 'RECORDED',
            source: 'Calving Register',
            confidence: 'HIGH',
          };
        }
      }
    });

    const updatedCalvings = [newCalv, ...calvingEvents];
    const updatedOffspring = [...createdOffspring, ...calvingOffspring];
    const updatedAnimals = [...newCalfAnimals, ...animals];
    const updatedIdentifiers = [...newIdentifiers, ...identifiers];
    const updatedParentagesMap = { ...parentages, ...newParentages };

    let updatedPregnancies = pregnancies;
    if (event.pregnancyId) {
      updatedPregnancies = pregnancies.map((p) =>
        p.id === event.pregnancyId ? { ...p, status: 'CALVED' as PregnancyStatus } : p
      );
      setPregnancies(updatedPregnancies);
    }

    setCalvingEvents(updatedCalvings);
    setCalvingOffspring(updatedOffspring);
    setAnimals(updatedAnimals);
    setIdentifiers(updatedIdentifiers);
    setParentages(updatedParentagesMap);

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Calving Recorded',
      message: `${dam?.name || 'Dam'} calved (${event.calfCount || event.offspringCount || 1} ${(event.calfCount || event.offspringCount || 1) > 1 ? 'calves' : 'calf'}). ${createdOffspring.filter((o) => o.birthOutcome === 'LIVE').length} live calf enrolled.`,
      type: 'REGISTRATION',
      entityType: 'ANIMAL',
      entityId: event.damId,
      timestamp: new Date().toLocaleString(),
      isRead: false,
      isArchived: false,
      linkUrl: `/bovine/reproduction/calvings`,
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);

    persistState({
      calvingEvents: updatedCalvings,
      calvingOffspring: updatedOffspring,
      animals: updatedAnimals,
      identifiers: updatedIdentifiers,
      parentages: updatedParentagesMap,
      pregnancies: updatedPregnancies,
      notifications: updatedNotifs,
    });

    return calvingId;
  };

  // Phase 2 Mutations - Production
  const addProductionPeriod: BovineContextType['addProductionPeriod'] = (periodData) => {
    const periodId = `prod-per-${Date.now()}`;
    const pData = periodData as any;
    const type = pData.type || pData.periodType || 'LACTATION';
    const periodType = pData.periodType || pData.type || 'LACTATION';
    const sequence = pData.sequence ?? pData.cycleNumber ?? 1;
    const cycleNumber = pData.cycleNumber ?? pData.sequence ?? 1;
    const startedAt = pData.startedAt || (pData.startDate ? new Date(pData.startDate).toISOString() : new Date().toISOString());
    const startDate = pData.startDate || (pData.startedAt ? pData.startedAt.split('T')[0] : new Date().toISOString().split('T')[0]);

    const newPeriod: ProductionPeriod = {
      ...periodData,
      id: periodId,
      type,
      periodType,
      sequence,
      cycleNumber,
      startedAt,
      startDate,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPeriod, ...productionPeriods];
    setProductionPeriods(updated);
    persistState({ productionPeriods: updated });
    return periodId;
  };

  const closeProductionPeriod = (periodId: string, endReason?: string) => {
    const updated = productionPeriods.map((p) =>
      p.id === periodId
        ? {
            ...p,
            status: 'CLOSED' as const,
            endDate: new Date().toISOString().split('T')[0],
            endReason: endReason || 'Scheduled dry-off / cycle end',
          }
        : p
    );
    setProductionPeriods(updated);
    persistState({ productionPeriods: updated });
  };

  const addProductionRecord: BovineContextType['addProductionRecord'] = (recordData) => {
    const rData = recordData as any;
    const recordType = rData.recordType || rData.type || 'MILK_TEST_DAY';
    const type = rData.type || rData.recordType || 'MILK_YIELD';
    const recordDate = rData.recordDate || (rData.recordedAt ? rData.recordedAt.split('T')[0] : new Date().toISOString().split('T')[0]);
    const recordedAt = rData.recordedAt || (rData.recordDate ? new Date(rData.recordDate).toISOString() : new Date().toISOString());
    const value = rData.value ?? rData.milkYieldKg ?? rData.bodyWeightKg ?? 0;
    const unit = rData.unit || (rData.milkYieldKg !== undefined || rData.bodyWeightKg !== undefined ? 'kg' : '');

    const newRecord: AnimalProductionRecord = {
      ...recordData,
      id: `prod-rec-${Date.now()}`,
      type,
      recordType,
      recordedAt,
      recordDate,
      value,
      unit,
      source: rData.source || 'MANUAL',
      qualityStatus: rData.qualityStatus || 'VALIDATED',
      createdAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...productionRecords];
    setProductionRecords(updated);
    persistState({ productionRecords: updated });
  };

  // Phase 2 Mutations - Sensors
  const addSensorDevice: BovineContextType['addSensorDevice'] = (deviceData) => {
    const deviceId = `dev-${Date.now()}`;
    const dData = deviceData as any;
    const type = dData.type || dData.deviceType || 'EAR_TAG';
    const deviceType = dData.deviceType || dData.type || 'EAR_TAG';
    const active = dData.active !== undefined ? dData.active : dData.status !== 'INACTIVE';
    const status = dData.status || (active ? 'ACTIVE' : 'INACTIVE');

    const newDev: SensorDevice = {
      ...deviceData,
      id: deviceId,
      type,
      deviceType,
      active,
      status,
      createdAt: new Date().toISOString(),
    };
    const updated = [newDev, ...sensorDevices];
    setSensorDevices(updated);
    persistState({ sensorDevices: updated });
    return deviceId;
  };

  const updateSensorDevice = (deviceId: string, updates: Partial<SensorDevice>) => {
    const updated = sensorDevices.map((d) =>
      d.id === deviceId ? { ...d, ...updates } : d
    );
    setSensorDevices(updated);
    persistState({ sensorDevices: updated });
  };

  const assignDeviceToAnimal = (animalId: string, deviceId: string, placement?: SensorPlacement, notes?: string) => {
    const assignId = `dev-assign-${Date.now()}`;
    const newAssign: AnimalDeviceAssignment = {
      id: assignId,
      deviceId,
      animalId,
      assignedAt: new Date().toISOString(),
      placement: placement || 'LEFT_EAR',
      active: true,
      notes,
    };
    const updatedAssignments = [newAssign, ...deviceAssignments];
    const updatedDevices = sensorDevices.map((d) =>
      d.id === deviceId ? { ...d, status: 'ACTIVE' as const } : d
    );
    setDeviceAssignments(updatedAssignments);
    setSensorDevices(updatedDevices);
    persistState({ deviceAssignments: updatedAssignments, sensorDevices: updatedDevices });
  };

  const removeDeviceAssignment = (assignmentId: string) => {
    const target = deviceAssignments.find((a) => a.id === assignmentId);
    const updatedAssignments = deviceAssignments.map((a) =>
      a.id === assignmentId ? { ...a, active: false, removedAt: new Date().toISOString() } : a
    );
    const updatedDevices = sensorDevices.map((d) =>
      d.id === target?.deviceId ? { ...d, status: 'INACTIVE' as const } : d
    );
    setDeviceAssignments(updatedAssignments);
    setSensorDevices(updatedDevices);
    persistState({ deviceAssignments: updatedAssignments, sensorDevices: updatedDevices });
  };

  const addSensorReading: BovineContextType['addSensorReading'] = (readingData) => {
    const newReading: SensorReading = {
      ...readingData,
      id: `sr-${Date.now()}`,
    };
    const updated = [newReading, ...sensorReadings];
    setSensorReadings(updated);
    persistState({ sensorReadings: updated });
  };

  // Supplemental Mutations
  const addMaternalRecord: BovineContextType['addMaternalRecord'] = (recordData) => {
    const id = `mat-${Date.now()}`;
    const newRecord: MaternalDevelopmentRecord = { ...recordData, id };
    const updated = [newRecord, ...maternalRecords];
    setMaternalRecords(updated);
    setAnimals((prev) =>
      prev.map((a) => (a.id === recordData.animalId ? { ...a, currentWeightKg: recordData.weightKg } : a))
    );
    persistState({ maternalRecords: updated });
    return id;
  };

  const updateMaternalRecord: BovineContextType['updateMaternalRecord'] = (id, updates) => {
    const updated = maternalRecords.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setMaternalRecords(updated);
    persistState({ maternalRecords: updated });
  };

  const addWeaningRecord: BovineContextType['addWeaningRecord'] = (recordData) => {
    const id = `wean-${Date.now()}`;
    const newRecord: WeaningDevelopmentRecord = { ...recordData, id };
    const updated = [newRecord, ...weaningRecords];
    setWeaningRecords(updated);
    setAnimals((prev) =>
      prev.map((a) => (a.id === recordData.animalId ? { ...a, currentWeightKg: recordData.weightKg } : a))
    );
    persistState({ weaningRecords: updated });
    return id;
  };

  const updateWeaningRecord: BovineContextType['updateWeaningRecord'] = (id, updates) => {
    const updated = weaningRecords.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setWeaningRecords(updated);
    persistState({ weaningRecords: updated });
  };

  const addYearlingRecord: BovineContextType['addYearlingRecord'] = (recordData) => {
    const id = `year-${Date.now()}`;
    const newRecord: YearlingDevelopmentRecord = { ...recordData, id };
    const updated = [newRecord, ...yearlingRecords];
    setYearlingRecords(updated);
    setAnimals((prev) =>
      prev.map((a) => (a.id === recordData.animalId ? { ...a, currentWeightKg: recordData.weightKg } : a))
    );
    persistState({ yearlingRecords: updated });
    return id;
  };

  const updateYearlingRecord: BovineContextType['updateYearlingRecord'] = (id, updates) => {
    const updated = yearlingRecords.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setYearlingRecords(updated);
    persistState({ yearlingRecords: updated });
  };

  const addReproductiveProcess: BovineContextType['addReproductiveProcess'] = (procData) => {
    const id = `rp-${Date.now()}`;
    const newProc: ReproductiveProcess = {
      ...procData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newProc, ...reproductiveProcesses];
    setReproductiveProcesses(updated);
    persistState({ reproductiveProcesses: updated });
    return id;
  };

  const updateReproductiveProcess: BovineContextType['updateReproductiveProcess'] = (id, updates) => {
    const updated = reproductiveProcesses.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setReproductiveProcesses(updated);
    persistState({ reproductiveProcesses: updated });
  };

  const addRecipientEvaluation: BovineContextType['addRecipientEvaluation'] = (evalData) => {
    const id = `rec-eval-${Date.now()}`;
    const newEval: RecipientEvaluation = { ...evalData, id };
    const updated = [newEval, ...recipientEvaluations];
    setRecipientEvaluations(updated);
    persistState({ recipientEvaluations: updated });
    return id;
  };

  const updateRecipientEvaluation: BovineContextType['updateRecipientEvaluation'] = (id, updates) => {
    const updated = recipientEvaluations.map((e) => (e.id === id ? { ...e, ...updates } : e));
    setRecipientEvaluations(updated);
    persistState({ recipientEvaluations: updated });
  };

  const promoteToBreedingStock: BovineContextType['promoteToBreedingStock'] = (animalId, notes) => {
    const updatedAnimals = animals.map((a) => {
      if (a.id === animalId) {
        return {
          ...a,
          isBreedingStock: true,
          classification: 'BREEDING_STOCK' as const,
          useStatus: 'BREEDING_STOCK' as const,
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    });
    setAnimals(updatedAnimals);

    const promoted = animals.find((a) => a.id === animalId);
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title: `Breeding Stock Promoted: ${promoted?.name || animalId}`,
      message: `Animal successfully promoted to active breeding stock registry. ${notes || ''}`,
      type: 'INFO',
      entityType: 'ANIMAL',
      entityId: animalId,
      timestamp: new Date().toLocaleString(),
      isRead: false,
      isArchived: false,
      linkUrl: `/bovine/animals/breeding-stock/${animalId}`,
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);

    persistState({ animals: updatedAnimals, notifications: updatedNotifs });
  };

  return (
    <BovineContext.Provider
      value={{
        session,
        setSessionRole,
        setActiveFarm,
        setActiveHerd,
        farms,
        herds,
        groups,
        animals,
        identifiers,
        breedCompositions,
        parentages,
        ownerships,
        movements,
        dailyLogs,
        observations,
        tasks,
        media,
        mediaAlbums,
        farmDailyLogs,
        herdDailyLogs,
        groupFeedingLogs,
        environmentLogs,
        farmEvents,
        notifications,
        organizations,
        // Phase 2 collections
        healthEvents,
        diagnoses,
        treatments,
        medicationAdministrations,
        vaccineCatalog,
        vaccinationEvents,
        preventiveCareEvents,
        breedingCycles,
        breedingEvents,
        pregnancyChecks,
        pregnancies,
        calvingEvents,
        calvingOffspring,
        productionPeriods,
        productionRecords,
        sensorDevices,
        deviceAssignments,
        sensorReadings,
        dailySensorSummaries,
        // Supplemental collections
        maternalRecords,
        weaningRecords,
        yearlingRecords,
        reproductiveProcesses,
        recipientEvaluations,
        addDailyLog: (logData: any) => {
          addDailyAnimalLog({
            animalId: logData.animalId,
            date: logData.date,
            operationalStatus: logData.operationalStatus === 'HEALTHY' ? 'NORMAL' : (logData.operationalStatus || 'NORMAL'),
            overallCondition: logData.overallCondition || 4,
            temperature: logData.temperatureC || logData.temperature || 38.5,
            weight: logData.weightKg || logData.weight,
            bcs: logData.bcs || 3.0,
            appetiteScore: logData.appetite === 'NORMAL' ? 4 : (typeof logData.appetite === 'number' ? logData.appetite : 3),
            activityScore: logData.activity === 'NORMAL' ? 4 : (typeof logData.activity === 'number' ? logData.activity : 3),
            lamenessScore: logData.lamenessScore || 1,
            ruminationMinutes: logData.ruminationMinutes || 450,
            isAbnormal: !!logData.isAbnormal,
            requiresReview: !!(logData.requiresSupervisorReview || logData.requiresReview || logData.requiresAttention),
            reviewReason: logData.notes || (logData.isAbnormal ? 'Flagged abnormal telemetry' : undefined),
            notes: logData.notes,
            loggedBy: logData.loggedBy || session.name,
          });
        },
        addObservation: (obsData: any) => {
          addAnimalObservation({
            animalId: obsData.animalId,
            date: obsData.date || new Date().toISOString().split('T')[0],
            type: obsData.type || 'BEHAVIOR',
            valueType: 'TEXT',
            textValue: obsData.notes || obsData.description || 'Clinical observation',
            source: 'MANUAL',
            severity: obsData.severity || 'INFO',
            isAbnormal: !!obsData.isAbnormal,
            requiresReview: !!obsData.requiresReview,
            notes: obsData.notes || obsData.description,
            loggedBy: obsData.loggedBy || session.name,
          });
        },
        moveAnimals: (params: { animalIds: string[]; destinationFarmId: string; destinationHerdId?: string; movementDate?: string; reason?: string; notes?: string }) => {
          bulkMoveAnimals(
            params.animalIds,
            params.destinationFarmId,
            params.destinationHerdId || herds.find(h => h.farmId === params.destinationFarmId)?.id || 'herd-1',
            params.reason || 'Management transfer'
          );
        },
        resetToDefaults: () => {
          localStorage.removeItem('bovine_state_v1');
          setAnimals(initialAnimals);
          setFarms(initialFarms);
          setHerds(initialHerds);
          setGroups(initialGroups);
          setIdentifiers(initialIdentifiers);
          setBreedCompositions(initialBreedCompositions);
          setParentages(initialParentages);
          setOwnerships(initialOwnerships);
          setMovements(initialMovements);
          setDailyLogs(initialDailyLogs);
          setObservations(initialObservations);
          setTasks(initialTasks);
          setMedia(initialMedia);
          setFarmDailyLogs(initialFarmDailyLogs);
          setHerdDailyLogs(initialHerdDailyLogs);
          setGroupFeedingLogs(initialFeedingLogs);
          setEnvironmentLogs(initialEnvironmentLogs);
          setFarmEvents(initialFarmEvents);
          setNotifications(initialNotifications);
          setOrganizations(initialOrganizations);
          setHealthEvents(initialHealthEvents);
          setDiagnoses(initialDiagnoses);
          setTreatments(initialTreatments);
          setMedicationAdministrations(initialMedicationAdministrations);
          setVaccineCatalog(initialVaccineCatalog);
          setVaccinationEvents(initialVaccinationEvents);
          setPreventiveCareEvents(initialPreventiveCareEvents);
          setBreedingCycles(initialBreedingCycles);
          setBreedingEvents(initialBreedingEvents);
          setPregnancyChecks(initialPregnancyChecks);
          setPregnancies(initialPregnancies);
          setCalvingEvents(initialCalvingEvents);
          setCalvingOffspring(initialCalvingOffspring);
          setProductionPeriods(initialProductionPeriods);
          setProductionRecords(initialProductionRecords);
          setSensorDevices(initialSensorDevices);
          setDeviceAssignments(initialDeviceAssignments);
          setSensorReadings(initialSensorReadings);
          setDailySensorSummaries(initialDailySensorSummaries);
        },
        addAnimal,
        updateAnimal,
        addIdentifier,
        retireIdentifier,
        removeIdentifier: (id: string) => {
          retireIdentifier(id);
        },
        setPrimaryIdentifier,
        updateBreedComposition,
        updateParentage,
        addOwnership,
        recordMovement,
        addDailyAnimalLog,
        addAnimalObservation,
        addAnimalTask,
        updateAnimalTask,
        completeAnimalTask,
        completeTask: completeAnimalTask,
        addAnimalMedia,
        updateAnimalMedia,
        deleteAnimalMedia,
        setPrimaryProfilePhoto,
        addMediaComment,
        verifyAnimalMedia,
        updateMediaVisibility,
        toggleMarketplaceMedia,
        createMediaAlbum,
        addMediaToAlbum,
        removeMediaFromAlbum,
        linkMediaToEntity,
        addFarm,
        addHerd,
        addGroup,
        addFarmDailyLog,
        addHerdDailyLog,
        addGroupFeedingLog,
        addFarmEnvironmentLog,
        addFarmOperationalEvent,
        resolveFarmOperationalEvent,
        markNotificationRead,
        archiveNotification,
        bulkMarkNotificationsRead,
        bulkAssignHerd,
        bulkCreateTasks,
        bulkMoveAnimals,
        // Phase 2 mutations
        addHealthEvent,
        closeHealthEvent,
        addDiagnosis,
        addTreatment,
        addMedicationAdministration,
        recordMedicationGiven,
        addVaccinationEvent,
        addPreventiveCareEvent,
        addBreedingCycle,
        closeBreedingCycle,
        addBreedingEvent,
        addPregnancyCheck,
        confirmPregnancy,
        addCalvingEvent,
        addProductionPeriod,
        closeProductionPeriod,
        addProductionRecord,
        addSensorDevice,
        updateSensorDevice,
        assignDeviceToAnimal,
        removeDeviceAssignment,
        addSensorReading,
        // Supplemental mutations
        addMaternalRecord,
        updateMaternalRecord,
        addWeaningRecord,
        updateWeaningRecord,
        addYearlingRecord,
        updateYearlingRecord,
        addReproductiveProcess,
        updateReproductiveProcess,
        addRecipientEvaluation,
        updateRecipientEvaluation,
        promoteToBreedingStock,
      }}
    >
      {children}
    </BovineContext.Provider>
  );
}

export function useBovine() {
  const context = useContext(BovineContext);
  if (!context) {
    throw new Error('useBovine must be used within a BovineProvider');
  }
  return context;
}
