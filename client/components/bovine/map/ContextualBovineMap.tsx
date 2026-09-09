'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BovineMapProvider, useBovineMap } from '@/lib/bovine-map-store';
import { MapOverlayMode, MapLayerToggles } from '@/lib/bovine-map-types';
import { MapLegend } from './MapLegend';
import { MapSelectionInspector } from './MapSelectionInspector';
import {
  MapPin,
  Maximize2,
  Layers,
  Radio,
  ExternalLink,
  Loader2,
} from 'lucide-react';

const BovineMapCanvas = dynamic(
  () => import('./BovineMapCanvas').then((mod) => mod.BovineMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-stone-100 text-stone-500">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-800 mb-2" />
        <span className="text-xs font-semibold text-stone-700">Loading Geospatial Context...</span>
      </div>
    ),
  }
);

export interface ContextualBovineMapProps {
  title?: string;
  description?: string;
  focusFarmId?: string;
  focusAnimalId?: string;
  focusDiseaseId?: string;
  focusMovementId?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  presetOverlay?: MapOverlayMode;
  presetLayers?: Partial<MapLayerToggles>;
  heightClassName?: string;
  compact?: boolean;
  showLegend?: boolean;
  allowFullscreenLink?: boolean;
}

function ContextualMapSync({
  focusFarmId,
  focusAnimalId,
  focusDiseaseId,
  focusMovementId,
  initialCenter,
  initialZoom,
  presetOverlay,
  presetLayers,
}: ContextualBovineMapProps) {
  const {
    farms,
    animalLocations,
    diseaseEvents,
    movementVectors,
    flyTo,
    setSelectedEntity,
    setOverlay,
    setLayerGroup,
  } = useBovineMap();

  useEffect(() => {
    if (presetOverlay) {
      setOverlay(presetOverlay);
    }
    if (presetLayers) {
      setLayerGroup(presetLayers);
    }
    if (initialCenter) {
      flyTo(initialCenter, initialZoom || 12);
    }
  }, [presetOverlay, presetLayers, initialCenter, initialZoom, setOverlay, setLayerGroup, flyTo]);

  // Focus farm
  useEffect(() => {
    if (!focusFarmId) return;
    const farm = farms.find((f) => f.id === focusFarmId);
    if (farm && farm.latitude && farm.longitude) {
      flyTo([farm.latitude, farm.longitude], 15);
      setSelectedEntity({ type: 'FARM', id: farm.id, data: farm });
    }
  }, [focusFarmId, farms, flyTo, setSelectedEntity]);

  // Focus animal
  useEffect(() => {
    if (!focusAnimalId) return;
    const animal = animalLocations.find((a) => a.animalId === focusAnimalId);
    if (animal) {
      flyTo(animal.coordinates, 16);
      setSelectedEntity({ type: 'ANIMAL', id: animal.animalId, data: animal });
    }
  }, [focusAnimalId, animalLocations, flyTo, setSelectedEntity]);

  // Focus disease
  useEffect(() => {
    if (!focusDiseaseId) return;
    const disease = diseaseEvents.find((d) => d.id === focusDiseaseId);
    if (disease) {
      flyTo(disease.coordinates, 12);
      setSelectedEntity({ type: 'DISEASE_EVENT', id: disease.id, data: disease });
    }
  }, [focusDiseaseId, diseaseEvents, flyTo, setSelectedEntity]);

  // Focus movement
  useEffect(() => {
    if (!focusMovementId) return;
    const movement = movementVectors.find((m) => m.id === focusMovementId);
    if (movement) {
      flyTo(movement.fromCoordinates, 11);
      setSelectedEntity({ type: 'MOVEMENT', id: movement.id, data: movement });
    }
  }, [focusMovementId, movementVectors, flyTo, setSelectedEntity]);

  return null;
}

export function ContextualBovineMap(props: ContextualBovineMapProps) {
  const {
    title = 'Geospatial Context',
    description = 'Interactive geospatial boundary, paddock subdivisions, and live telemetry',
    heightClassName = 'h-[440px]',
    compact = false,
    showLegend = true,
    allowFullscreenLink = true,
  } = props;

  return (
    <BovineMapProvider>
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Contextual Header */}
        <div className="p-3 sm:px-4 sm:py-3 border-b border-stone-200/80 bg-stone-50/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-bold text-stone-900 truncate tracking-tight">{title}</h3>
              <p className="text-[11px] text-stone-500 truncate">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>LIVE GIS SYNC</span>
            </div>

            {allowFullscreenLink && (
              <Link
                href="/bovine/map"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                title="Open in Full Bovine Geospatial Workspace"
              >
                <span>Full Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Map Canvas Container */}
        <div className={`relative w-full ${heightClassName} overflow-hidden bg-stone-100`}>
          <ContextualMapSync {...props} />
          <BovineMapCanvas className="w-full h-full" />

          {/* Floating Legend */}
          {showLegend && (
            <div className="absolute bottom-3 left-3 z-900 pointer-events-auto hidden md:block">
              <MapLegend />
            </div>
          )}

          {/* Inspector Slide-over */}
          <MapSelectionInspector />
        </div>
      </div>
    </BovineMapProvider>
  );
}
