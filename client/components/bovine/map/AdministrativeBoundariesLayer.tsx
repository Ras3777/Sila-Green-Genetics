'use client';

import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';
import { AdministrativeBoundary } from '@/lib/bovine-map-types';

export function AdministrativeBoundariesLayer() {
  const {
    filteredBoundaries,
    layers,
    overlay,
    selectedEntity,
    setSelectedEntity,
    flyTo,
  } = useBovineMap();

  if (!layers.regions && !layers.districts) return null;

  const getPolygonStyle = (boundary: AdministrativeBoundary) => {
    const isSelected = selectedEntity?.id === boundary.id;
    let fillColor = '#059669';
    let fillOpacity = 0.08;

    if (overlay === 'VACCINATION') {
      const rate = boundary.statistics.vaccinationRate;
      if (rate >= 95) fillColor = '#059669';
      else if (rate >= 90) fillColor = '#10b981';
      else if (rate >= 80) fillColor = '#f59e0b';
      else fillColor = '#ef4444';
      fillOpacity = 0.22;
    } else if (overlay === 'COMPLIANCE') {
      const rate = boundary.statistics.complianceRate;
      if (rate >= 95) fillColor = '#059669';
      else if (rate >= 90) fillColor = '#0284c7';
      else fillColor = '#f59e0b';
      fillOpacity = 0.2;
    } else if (overlay === 'GENOTYPE_COVERAGE') {
      const rate = boundary.statistics.genotypeCoverage;
      if (rate >= 50) fillColor = '#7c3aed';
      else if (rate >= 35) fillColor = '#6366f1';
      else fillColor = '#94a3b8';
      fillOpacity = 0.2;
    } else if (overlay === 'HEALTH_STATUS') {
      if (boundary.statistics.quarantinedFarmsCount > 0) {
        fillColor = '#dc2626';
        fillOpacity = 0.25;
      } else if (boundary.statistics.activeHealthAlerts > 0) {
        fillColor = '#f59e0b';
        fillOpacity = 0.15;
      }
    }

    return {
      color: isSelected ? '#d97706' : fillColor,
      weight: isSelected ? 3 : boundary.level === 'REGION' ? 2 : 1.5,
      dashArray: boundary.level === 'DISTRICT' ? '4, 4' : undefined,
      fillColor,
      fillOpacity: isSelected ? 0.35 : fillOpacity,
    };
  };

  return (
    <>
      {filteredBoundaries.map((b) => {
        if (b.level === 'REGION' && !layers.regions) return null;
        if (b.level === 'DISTRICT' && !layers.districts) return null;

        const style = getPolygonStyle(b);

        return (
          <Polygon
            key={b.id}
            positions={b.polygon}
            pathOptions={style}
            eventHandlers={{
              click: () => {
                setSelectedEntity({
                  type: b.level === 'REGION' ? 'REGION' : 'DISTRICT',
                  id: b.id,
                  data: b,
                });
                flyTo(b.center, b.level === 'REGION' ? 8 : 10);
              },
            }}
          >
            <Tooltip sticky direction="top" className="custom-leaflet-tooltip">
              <div className="p-1 font-sans text-xs">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>{b.name}</span>
                </div>
                <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                  {b.level} • {b.statistics.animalCount.toLocaleString()} cattle • {b.statistics.farmCount} farms
                </div>
                {overlay === 'VACCINATION' && (
                  <div className="text-[10px] text-emerald-800 font-bold mt-1">
                    Vaccination Coverage: {b.statistics.vaccinationRate}%
                  </div>
                )}
                {overlay === 'COMPLIANCE' && (
                  <div className="text-[10px] text-sky-800 font-bold mt-1">
                    Compliance Rate: {b.statistics.complianceRate}%
                  </div>
                )}
                {overlay === 'GENOTYPE_COVERAGE' && (
                  <div className="text-[10px] text-indigo-800 font-bold mt-1">
                    Genotyped: {b.statistics.genotypeCoverage}%
                  </div>
                )}
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
}
