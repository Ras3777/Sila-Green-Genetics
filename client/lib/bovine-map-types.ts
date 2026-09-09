export type BaseMapProvider = 'standard' | 'satellite' | 'terrain' | 'light';

export type MapViewMode = 'MAP' | 'TABLE' | 'SPLIT';

export type MapOverlayMode =
  | 'POPULATION'
  | 'VACCINATION'
  | 'GENOTYPE_COVERAGE'
  | 'COMPLIANCE'
  | 'RISK_SCORE'
  | 'HEALTH_STATUS'
  | 'BREEDING_STOCK'
  | 'EXPECTED_CALVINGS';

export type LocationConfidence = 'SENSOR_GPS' | 'FARM_PADDOCK_LOCATION' | 'EVENT_DERIVED';

export type LocationPrecision = 'EXACT' | 'APPROXIMATE' | 'DISTRICT_ONLY' | 'REGION_ONLY' | 'HIDDEN';

export type LocationVerificationStatus =
  | 'UNVERIFIED'
  | 'SELF_REPORTED'
  | 'SUPERVISOR_VERIFIED'
  | 'GOVERNMENT_VERIFIED'
  | 'GPS_VERIFIED';

export type FarmAreaType =
  | 'PASTURE'
  | 'PADDOCK'
  | 'BREEDING_PADDOCK'
  | 'CALVING_AREA'
  | 'QUARANTINE_PEN'
  | 'BARN'
  | 'HANDLING_FACILITY'
  | 'WATER_POINT'
  | 'FEED_STORAGE'
  | 'OTHER';

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface FarmAreaGeometry {
  id: string;
  farmId: string;
  name: string;
  code: string;
  type: FarmAreaType;
  polygon: [number, number][]; // [lat, lng] array
  acreageHectares: number;
  capacityHead: number;
  currentOccupancyHead: number;
  waterSourceAvailable: boolean;
  shadeAvailable: boolean;
  notes?: string;
  active: boolean;
}

export interface FarmGeometryRecord {
  farmId: string;
  perimeterPolygon: [number, number][];
  center: [number, number];
  totalAcreageHectares: number;
  verificationStatus: LocationVerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  areas: FarmAreaGeometry[];
}

export interface AdministrativeBoundary {
  id: string;
  code: string;
  name: string;
  level: 'REGION' | 'ZONE' | 'DISTRICT';
  parentCode?: string;
  center: [number, number];
  polygon: [number, number][];
  statistics: {
    animalCount: number;
    farmCount: number;
    breedingStockCount: number;
    birthsYtd: number;
    mortalityRate: number; // percentage
    vaccinationRate: number; // percentage
    genotypeCoverage: number; // percentage
    pregnancyRate: number; // percentage
    complianceRate: number; // percentage
    activeHealthAlerts: number;
    quarantinedFarmsCount: number;
  };
}

export interface AnimalMapLocation {
  animalId: string;
  name: string;
  primaryIdentifier: string;
  dgr?: string;
  breed: string;
  sex: 'MALE' | 'FEMALE';
  breedingStock: boolean;
  breedingRole?: string;
  farmId: string;
  farmName: string;
  farmAreaId?: string;
  farmAreaName?: string;
  coordinates: [number, number];
  locationConfidence: LocationConfidence;
  precision: LocationPrecision;
  accuracyMeters?: number;
  recordedAt: string;
  deviceId?: string;
  batteryPct?: number;
  telemetryFreshnessSec?: number;
  healthStatus: 'NORMAL' | 'SICK' | 'QUARANTINE' | 'OBSERVATION';
  geneticIndex?: number;
  selectionIndexValue?: string;
  photoUrl?: string;
}

export interface MovementVectorMap {
  id: string;
  referenceNumber: string;
  fromFarmId: string;
  fromFarmName: string;
  fromCoordinates: [number, number];
  toFarmId: string;
  toFarmName: string;
  toCoordinates: [number, number];
  volumeHead: number;
  animalIds: string[];
  movementType: string;
  movementDate: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  carrierName?: string;
  vehicleRegistration?: string;
  reason: string;
}

export interface DiseaseEventMap {
  id: string;
  caseNumber: string;
  farmId: string;
  farmName: string;
  coordinates: [number, number];
  diseaseName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'CONFIRMED' | 'SUSPECTED' | 'UNDER_INVESTIGATION' | 'RESOLVED';
  affectedCount: number;
  deathsCount: number;
  startedAt: string;
  quarantineActive: boolean;
  bufferRadiusKm: number[]; // e.g. [5, 10, 25]
  investigatingOfficer?: string;
  notes?: string;
}

export interface MarketplaceListingMap {
  id: string;
  title: string;
  animalId?: string;
  animalName?: string;
  listingType: 'LIVE_ANIMAL' | 'SEMEN' | 'EMBRYO' | 'BREEDING_SERVICE';
  breed: string;
  sex?: 'MALE' | 'FEMALE';
  price: number;
  currency: string;
  farmId: string;
  farmName: string;
  region: string;
  coordinates: [number, number];
  privacyPrecision: LocationPrecision;
  approximateRadiusMeters: number;
  dnaVerified: boolean;
  geneticIndex?: number;
  photoUrl?: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'FARM_PERIMETER' | 'PADDOCK' | 'QUARANTINE' | 'RESTRICTED' | 'WATER_POINT';
  polygon: [number, number][];
  farmId: string;
  alertOnEnter: boolean;
  alertOnExit: boolean;
  active: boolean;
}

export interface GeofenceEventRecord {
  id: string;
  geofenceId: string;
  geofenceName: string;
  animalId: string;
  animalName: string;
  eventType: 'ENTERED' | 'EXITED' | 'DWELLING';
  occurredAt: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  description: string;
}

export interface MapLayerToggles {
  // Geography
  regions: boolean;
  districts: boolean;
  farmBoundaries: boolean;
  paddocks: boolean;
  waterPoints: boolean;
  quarantineAreas: boolean;
  // Animals
  farmAnimals: boolean;
  breedingStock: boolean;
  bulls: boolean;
  cows: boolean;
  youngStock: boolean;
  // Operations
  animalLocations: boolean;
  movements: boolean;
  sensors: boolean;
  // Health
  diseaseEvents: boolean;
  quarantineZones: boolean;
  vaccinationChoropleth: boolean;
  // Reproduction
  pregnantFemales: boolean;
  expectedCalvings: boolean;
  // Genetics
  breedDistribution: boolean;
  geneticMerit: boolean;
  inbreeding: boolean;
  // Government
  complianceOverlay: boolean;
  surveillanceBuffers: boolean;
  // Marketplace
  marketplaceListings: boolean;
}

export interface MapFilters {
  searchQuery: string;
  farmType: string;
  region: string;
  district: string;
  breed: string;
  sex: string;
  breedingRole: string;
  healthStatus: string;
  complianceStatus: string;
  dateFrom?: string;
  dateTo?: string;
  radiusOrigin?: [number, number];
  radiusKm?: number;
}

export interface SavedMapView {
  id: string;
  name: string;
  description: string;
  center: [number, number];
  zoom: number;
  baseMap: BaseMapProvider;
  overlay: MapOverlayMode;
  layers: Partial<MapLayerToggles>;
  filters: Partial<MapFilters>;
  isSystemPreset?: boolean;
}

export type SelectedEntity =
  | { type: 'FARM'; id: string; data: any }
  | { type: 'ANIMAL'; id: string; data: AnimalMapLocation }
  | { type: 'REGION'; id: string; data: AdministrativeBoundary }
  | { type: 'DISTRICT'; id: string; data: AdministrativeBoundary }
  | { type: 'DISEASE_EVENT'; id: string; data: DiseaseEventMap }
  | { type: 'MOVEMENT'; id: string; data: MovementVectorMap }
  | { type: 'MARKETPLACE'; id: string; data: MarketplaceListingMap }
  | { type: 'CLUSTER'; id: string; data: { farms: any[]; center: [number, number]; title: string } }
  | null;

export type MeasurementToolMode = 'NONE' | 'DISTANCE' | 'AREA' | 'RADIUS_SEARCH';
