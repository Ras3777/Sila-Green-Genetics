'use client';

import React from 'react';
import { TileLayer } from 'react-leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';

export function BaseMapTiles() {
  const { baseMap } = useBovineMap();

  switch (baseMap) {
    case 'satellite':
      return (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ"
          maxZoom={19}
        />
      );
    case 'terrain':
      return (
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution="Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap"
          maxZoom={17}
        />
      );
    case 'light':
      return (
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
          maxZoom={20}
        />
      );
    case 'standard':
    default:
      return (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          maxZoom={19}
        />
      );
  }
}
