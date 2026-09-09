'use client';

import React from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useBovineMap } from '@/lib/bovine-map-store';
import { BaseMapTiles } from './BaseMapTiles';
import { AdministrativeBoundariesLayer } from './AdministrativeBoundariesLayer';
import { FarmBoundariesLayer } from './FarmBoundariesLayer';
import { FarmMarkersLayer } from './FarmMarkersLayer';
import { AnimalMarkersLayer } from './AnimalMarkersLayer';
import { MovementPolylinesLayer } from './MovementPolylinesLayer';
import { DiseaseSurveillanceLayer } from './DiseaseSurveillanceLayer';
import { MarketplaceMarkersLayer } from './MarketplaceMarkersLayer';
import { GeofenceLayer } from './GeofenceLayer';
import { SpatialMeasureLayer } from './SpatialMeasureLayer';
import { MapEventsHandler } from './MapEventsHandler';

export function BovineMapCanvas({ className }: { className?: string }) {
  const { center, zoom } = useBovineMap();

  return (
    <div className={`relative w-full h-full min-h-[400px] overflow-hidden ${className || ''}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <MapEventsHandler />
        <BaseMapTiles />
        <AdministrativeBoundariesLayer />
        <FarmBoundariesLayer />
        <GeofenceLayer />
        <DiseaseSurveillanceLayer />
        <MovementPolylinesLayer />
        <MarketplaceMarkersLayer />
        <FarmMarkersLayer />
        <AnimalMarkersLayer />
        <SpatialMeasureLayer />
      </MapContainer>
    </div>
  );
}
