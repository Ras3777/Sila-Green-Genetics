'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useBovine } from './bovine-store';
import { Farm } from './bovine-types';
import {
  BaseMapProvider,
  MapViewMode,
  MapOverlayMode,
  MapLayerToggles,
  MapFilters,
  SavedMapView,
  SelectedEntity,
  MeasurementToolMode,
  AdministrativeBoundary,
  FarmGeometryRecord,
  AnimalMapLocation,
  MovementVectorMap,
  DiseaseEventMap,
  MarketplaceListingMap,
  GeofenceZone,
  GeofenceEventRecord,
} from './bovine-map-types';
import {
  initialAdministrativeBoundaries,
  initialFarmGeometries,
  initialAnimalLocations,
  initialMovementVectors,
  initialDiseaseEvents,
  initialMarketplaceListingsMap,
  initialGeofences,
  initialGeofenceEvents,
  initialSavedViews,
} from './bovine-map-data';

const DEFAULT_LAYERS: MapLayerToggles = {
  regions: true,
  districts: true,
  farmBoundaries: true,
  paddocks: true,
  waterPoints: true,
  quarantineAreas: true,
  farmAnimals: true,
  breedingStock: true,
  bulls: true,
  cows: true,
  youngStock: false,
  animalLocations: true,
  movements: true,
  sensors: true,
  diseaseEvents: true,
  quarantineZones: true,
  vaccinationChoropleth: false,
  pregnantFemales: false,
  expectedCalvings: false,
  breedDistribution: false,
  geneticMerit: false,
  inbreeding: false,
  complianceOverlay: false,
  surveillanceBuffers: true,
  marketplaceListings: false,
};

const DEFAULT_FILTERS: MapFilters = {
  searchQuery: '',
  farmType: 'ALL',
  region: 'ALL',
  district: 'ALL',
  breed: 'ALL',
  sex: 'ALL',
  breedingRole: 'ALL',
  healthStatus: 'ALL',
  complianceStatus: 'ALL',
  radiusKm: 25,
};

interface BovineMapContextType {
  // Viewport
  center: [number, number];
  zoom: number;
  targetCoords: [number, number] | null;
  targetZoom: number | null;
  setViewport: (center: [number, number], zoom: number) => void;
  flyTo: (coords: [number, number], zoom?: number) => void;

  // Base Map & Overlay
  baseMap: BaseMapProvider;
  setBaseMap: (provider: BaseMapProvider) => void;
  overlay: MapOverlayMode;
  setOverlay: (overlay: MapOverlayMode) => void;

  // Layout View Mode
  viewMode: MapViewMode;
  setViewMode: (mode: MapViewMode) => void;

  // Layer Toggles
  layers: MapLayerToggles;
  toggleLayer: (key: keyof MapLayerToggles) => void;
  setLayerGroup: (group: Partial<MapLayerToggles>) => void;
  resetLayers: () => void;

  // Filters
  filters: MapFilters;
  setFilter: <K extends keyof MapFilters>(key: K, value: MapFilters[K]) => void;
  resetFilters: () => void;

  // Selection & Inspector
  selectedEntity: SelectedEntity;
  setSelectedEntity: (entity: SelectedEntity) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;
  clearSelection: () => void;

  // Measurement Tools
  measurementMode: MeasurementToolMode;
  setMeasurementMode: (mode: MeasurementToolMode) => void;
  measurePoints: [number, number][];
  addMeasurePoint: (point: [number, number]) => void;
  clearMeasurements: () => void;

  // Timeline / Time Scrubber
  activeDate: string;
  setActiveDate: (date: string) => void;
  isPlayingTimeline: boolean;
  toggleTimelinePlayback: () => void;

  // Saved Views
  savedViews: SavedMapView[];
  activeSavedViewId: string | null;
  applySavedView: (view: SavedMapView) => void;
  saveCurrentView: (name: string, description: string) => SavedMapView;

  // Data collections (filtered)
  farms: Farm[];
  filteredFarms: Farm[];
  farmGeometries: FarmGeometryRecord[];
  boundaries: AdministrativeBoundary[];
  filteredBoundaries: AdministrativeBoundary[];
  animalLocations: AnimalMapLocation[];
  filteredAnimalLocations: AnimalMapLocation[];
  movementVectors: MovementVectorMap[];
  filteredMovementVectors: MovementVectorMap[];
  diseaseEvents: DiseaseEventMap[];
  filteredDiseaseEvents: DiseaseEventMap[];
  marketplaceListings: MarketplaceListingMap[];
  filteredMarketplaceListings: MarketplaceListingMap[];
  geofences: GeofenceZone[];
  geofenceEvents: GeofenceEventRecord[];

  // Mobile Bottom Sheet
  isMobileSheetOpen: boolean;
  setIsMobileSheetOpen: (open: boolean) => void;
}

const BovineMapContext = createContext<BovineMapContextType | undefined>(undefined);

export function BovineMapProvider({ children }: { children: React.ReactNode }) {
  const { farms } = useBovine();

  // Viewport state (Default: Ethiopia agricultural region center)
  const [center, setCenter] = useState<[number, number]>([8.6, 39.0]);
  const [zoom, setZoom] = useState<number>(8);
  const [targetCoords, setTargetCoords] = useState<[number, number] | null>(null);
  const [targetZoom, setTargetZoom] = useState<number | null>(null);

  // Configuration
  const [baseMap, setBaseMap] = useState<BaseMapProvider>('standard');
  const [overlay, setOverlay] = useState<MapOverlayMode>('POPULATION');
  const [viewMode, setViewMode] = useState<MapViewMode>('MAP');
  const [layers, setLayers] = useState<MapLayerToggles>(DEFAULT_LAYERS);
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);

  // Selection
  const [selectedEntity, setSelectedEntityState] = useState<SelectedEntity>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Measurement
  const [measurementMode, setMeasurementMode] = useState<MeasurementToolMode>('NONE');
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);

  // Timeline
  const [activeDate, setActiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);

  // Saved Views
  const [savedViews, setSavedViews] = useState<SavedMapView[]>(initialSavedViews);
  const [activeSavedViewId, setActiveSavedViewId] = useState<string | null>(null);

  // Datasets
  const [farmGeometries] = useState<FarmGeometryRecord[]>(initialFarmGeometries);
  const [boundaries] = useState<AdministrativeBoundary[]>(initialAdministrativeBoundaries);
  const [animalLocations] = useState<AnimalMapLocation[]>(initialAnimalLocations);
  const [movementVectors] = useState<MovementVectorMap[]>(initialMovementVectors);
  const [diseaseEvents] = useState<DiseaseEventMap[]>(initialDiseaseEvents);
  const [marketplaceListings] = useState<MarketplaceListingMap[]>(initialMarketplaceListingsMap);
  const [geofences] = useState<GeofenceZone[]>(initialGeofences);
  const [geofenceEvents] = useState<GeofenceEventRecord[]>(initialGeofenceEvents);

  // Viewport helpers
  const setViewport = useCallback((newCenter: [number, number], newZoom: number) => {
    setCenter(newCenter);
    setZoom(newZoom);
  }, []);

  const flyTo = useCallback((coords: [number, number], newZoom: number = 13) => {
    setTargetCoords(coords);
    setTargetZoom(newZoom);
    setCenter(coords);
    setZoom(newZoom);
  }, []);

  // Selection helper
  const setSelectedEntity = useCallback((entity: SelectedEntity) => {
    setSelectedEntityState(entity);
    if (entity) {
      setIsInspectorOpen(true);
      setIsMobileSheetOpen(true);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEntityState(null);
    setIsInspectorOpen(false);
    setIsMobileSheetOpen(false);
  }, []);

  // Layer toggles
  const toggleLayer = useCallback((key: keyof MapLayerToggles) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setLayerGroup = useCallback((group: Partial<MapLayerToggles>) => {
    setLayers((prev) => ({ ...prev, ...group }));
  }, []);

  const resetLayers = useCallback(() => {
    setLayers(DEFAULT_LAYERS);
  }, []);

  // Filters
  const setFilter = useCallback(<K extends keyof MapFilters>(key: K, value: MapFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Measurement
  const addMeasurePoint = useCallback((point: [number, number]) => {
    setMeasurePoints((prev) => [...prev, point]);
  }, []);

  const clearMeasurements = useCallback(() => {
    setMeasurePoints([]);
    setMeasurementMode('NONE');
  }, []);

  // Timeline playback simulation
  const toggleTimelinePlayback = useCallback(() => {
    setIsPlayingTimeline((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPlayingTimeline) return;
    const interval = setInterval(() => {
      setActiveDate((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 1);
        if (d > new Date()) return '2026-08-01';
        return d.toISOString().split('T')[0];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // Saved Views
  const applySavedView = useCallback((view: SavedMapView) => {
    setActiveSavedViewId(view.id);
    setCenter(view.center);
    setZoom(view.zoom);
    setTargetCoords(view.center);
    setTargetZoom(view.zoom);
    setBaseMap(view.baseMap);
    setOverlay(view.overlay);
    if (view.layers) {
      setLayers((prev) => ({ ...prev, ...view.layers }));
    }
    if (view.filters) {
      setFilters((prev) => ({ ...prev, ...view.filters }));
    }
  }, []);

  const saveCurrentView = useCallback(
    (name: string, description: string): SavedMapView => {
      const newView: SavedMapView = {
        id: `view-custom-${Date.now()}`,
        name,
        description,
        center,
        zoom,
        baseMap,
        overlay,
        layers,
        filters,
        isSystemPreset: false,
      };
      setSavedViews((prev) => [newView, ...prev]);
      setActiveSavedViewId(newView.id);
      return newView;
    },
    [center, zoom, baseMap, overlay, layers, filters]
  );

  // Filtered Farms
  const filteredFarms = useMemo(() => {
    return farms.filter((f) => {
      if (filters.farmType !== 'ALL' && f.type !== filters.farmType) return false;
      if (filters.region !== 'ALL' && f.region !== filters.region) return false;
      if (filters.district !== 'ALL' && f.district !== filters.district) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesCode = f.code.toLowerCase().includes(q);
        const matchesCity = f.city.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesCity) return false;
      }
      return true;
    });
  }, [farms, filters.farmType, filters.region, filters.district, filters.searchQuery]);

  // Filtered Animals
  const filteredAnimalLocations = useMemo(() => {
    return animalLocations.filter((a) => {
      if (filters.breed !== 'ALL' && a.breed !== filters.breed) return false;
      if (filters.sex !== 'ALL' && a.sex !== filters.sex) return false;
      if (filters.healthStatus !== 'ALL' && a.healthStatus !== filters.healthStatus) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = a.name.toLowerCase().includes(q);
        const matchesId = a.primaryIdentifier.toLowerCase().includes(q);
        const matchesDgr = a.dgr?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesDgr) return false;
      }
      return true;
    });
  }, [animalLocations, filters.breed, filters.sex, filters.healthStatus, filters.searchQuery]);

  // Filtered Boundaries
  const filteredBoundaries = useMemo(() => {
    return boundaries.filter((b) => {
      if (filters.region !== 'ALL' && b.level === 'REGION' && b.name !== filters.region) {
        return false;
      }
      return true;
    });
  }, [boundaries, filters.region]);

  // Filtered Movements
  const filteredMovementVectors = useMemo(() => {
    return movementVectors.filter((m) => {
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesRef = m.referenceNumber.toLowerCase().includes(q);
        const matchesFrom = m.fromFarmName.toLowerCase().includes(q);
        const matchesTo = m.toFarmName.toLowerCase().includes(q);
        if (!matchesRef && !matchesFrom && !matchesTo) return false;
      }
      return true;
    });
  }, [movementVectors, filters.searchQuery]);

  // Filtered Disease Events
  const filteredDiseaseEvents = useMemo(() => {
    return diseaseEvents.filter((d) => {
      if (filters.healthStatus === 'QUARANTINE' && !d.quarantineActive) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesCase = d.caseNumber.toLowerCase().includes(q);
        const matchesDisease = d.diseaseName.toLowerCase().includes(q);
        const matchesFarm = d.farmName.toLowerCase().includes(q);
        if (!matchesCase && !matchesDisease && !matchesFarm) return false;
      }
      return true;
    });
  }, [diseaseEvents, filters.healthStatus, filters.searchQuery]);

  // Filtered Marketplace Listings
  const filteredMarketplaceListings = useMemo(() => {
    return marketplaceListings.filter((l) => {
      if (filters.breed !== 'ALL' && l.breed !== filters.breed) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = l.title.toLowerCase().includes(q);
        const matchesBreed = l.breed.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBreed) return false;
      }
      return true;
    });
  }, [marketplaceListings, filters.breed, filters.searchQuery]);

  return (
    <BovineMapContext.Provider
      value={{
        center,
        zoom,
        targetCoords,
        targetZoom,
        setViewport,
        flyTo,
        baseMap,
        setBaseMap,
        overlay,
        setOverlay,
        viewMode,
        setViewMode,
        layers,
        toggleLayer,
        setLayerGroup,
        resetLayers,
        filters,
        setFilter,
        resetFilters,
        selectedEntity,
        setSelectedEntity,
        isInspectorOpen,
        setIsInspectorOpen,
        clearSelection,
        measurementMode,
        setMeasurementMode,
        measurePoints,
        addMeasurePoint,
        clearMeasurements,
        activeDate,
        setActiveDate,
        isPlayingTimeline,
        toggleTimelinePlayback,
        savedViews,
        activeSavedViewId,
        applySavedView,
        saveCurrentView,
        farms,
        filteredFarms,
        farmGeometries,
        boundaries,
        filteredBoundaries,
        animalLocations,
        filteredAnimalLocations,
        movementVectors,
        filteredMovementVectors,
        diseaseEvents,
        filteredDiseaseEvents,
        marketplaceListings,
        filteredMarketplaceListings,
        geofences,
        geofenceEvents,
        isMobileSheetOpen,
        setIsMobileSheetOpen,
      }}
    >
      {children}
    </BovineMapContext.Provider>
  );
}

export function useBovineMap() {
  const context = useContext(BovineMapContext);
  if (!context) {
    throw new Error('useBovineMap must be used within a BovineMapProvider');
  }
  return context;
}
