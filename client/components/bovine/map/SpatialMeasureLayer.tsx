'use client';

import React from 'react';
import { Polyline, Polygon, Circle, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';

// Haversine formula for distance in kilometers
function calculateHaversineDistance(p1: [number, number], p2: [number, number]): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLon = ((p2[1] - p1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[0] * Math.PI) / 180) *
      Math.cos((p2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function SpatialMeasureLayer() {
  const {
    measurementMode,
    measurePoints,
    filters,
  } = useBovineMap();

  if (measurementMode === 'NONE' || measurePoints.length === 0) {
    return null;
  }

  // Calculate cumulative distance
  let totalDistanceKm = 0;
  for (let i = 0; i < measurePoints.length - 1; i++) {
    totalDistanceKm += calculateHaversineDistance(measurePoints[i], measurePoints[i + 1]);
  }

  const lastPoint = measurePoints[measurePoints.length - 1];

  const measureIcon = L.divIcon({
    html: `<div class="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-md"></div>`,
    className: 'custom-measure-point-marker',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  return (
    <>
      {/* Points */}
      {measurePoints.map((pt, idx) => (
        <Marker key={idx} position={pt} icon={measureIcon} />
      ))}

      {/* Polyline connecting points */}
      {measurePoints.length >= 2 && (
        <Polyline
          positions={measurePoints}
          pathOptions={{
            color: '#f59e0b',
            weight: 3,
            dashArray: '5, 5',
          }}
        />
      )}

      {/* Polygon if measuring area */}
      {measurementMode === 'AREA' && measurePoints.length >= 3 && (
        <Polygon
          positions={measurePoints}
          pathOptions={{
            color: '#f59e0b',
            weight: 2,
            fillColor: '#f59e0b',
            fillOpacity: 0.25,
          }}
        />
      )}

      {/* Radius circle if in radius search mode */}
      {measurementMode === 'RADIUS_SEARCH' && (
        <Circle
          center={lastPoint}
          radius={(filters.radiusKm || 25) * 1000}
          pathOptions={{
            color: '#3b82f6',
            weight: 2,
            dashArray: '6, 6',
            fillColor: '#3b82f6',
            fillOpacity: 0.12,
          }}
        >
          <Tooltip permanent direction="top">
            <div className="font-sans font-bold text-xs text-sky-900">
              Radius: {filters.radiusKm || 25} km
            </div>
          </Tooltip>
        </Circle>
      )}

      {/* Tooltip on last point showing measurements */}
      {lastPoint && measurementMode === 'DISTANCE' && measurePoints.length >= 2 && (
        <Marker position={lastPoint} icon={measureIcon}>
          <Tooltip permanent direction="top">
            <div className="font-sans font-bold text-xs text-stone-900">
              Total Distance: {totalDistanceKm < 1 ? `${Math.round(totalDistanceKm * 1000)} m` : `${totalDistanceKm.toFixed(2)} km`}
            </div>
          </Tooltip>
        </Marker>
      )}
    </>
  );
}
