'use client';

import { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';

export function MapEventsHandler() {
  const map = useMap();
  const {
    setViewport,
    targetCoords,
    targetZoom,
    measurementMode,
    addMeasurePoint,
  } = useBovineMap();

  // Listen to map pan/zoom events
  useMapEvents({
    moveend: () => {
      const c = map.getCenter();
      const z = map.getZoom();
      setViewport([c.lat, c.lng], z);
    },
    click: (e) => {
      if (measurementMode !== 'NONE') {
        addMeasurePoint([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  // Handle programatic flyTo
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, targetZoom || 13, {
        duration: 1.2,
      });
    }
  }, [targetCoords, targetZoom, map]);

  return null;
}
