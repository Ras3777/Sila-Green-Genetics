'use client';

import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';
import { FarmAreaGeometry, FarmGeometryRecord } from '@/lib/bovine-map-types';

export function FarmBoundariesLayer() {
  const {
    farmGeometries,
    farms,
    layers,
    selectedEntity,
    setSelectedEntity,
    flyTo,
  } = useBovineMap();

  if (!layers.farmBoundaries && !layers.paddocks) return null;

  const getAreaColor = (type: FarmAreaGeometry['type']) => {
    switch (type) {
      case 'BREEDING_PADDOCK':
        return { stroke: '#d97706', fill: '#fef3c7', text: 'text-amber-900' };
      case 'CALVING_AREA':
        return { stroke: '#e11d48', fill: '#ffe4e6', text: 'text-rose-900' };
      case 'QUARANTINE_PEN':
        return { stroke: '#dc2626', fill: '#fee2e2', text: 'text-red-900' };
      case 'BARN':
      case 'HANDLING_FACILITY':
        return { stroke: '#475569', fill: '#f1f5f9', text: 'text-slate-800' };
      case 'WATER_POINT':
        return { stroke: '#0284c7', fill: '#e0f2fe', text: 'text-sky-900' };
      case 'PASTURE':
      case 'PADDOCK':
      default:
        return { stroke: '#059669', fill: '#d1fae5', text: 'text-emerald-900' };
    }
  };

  return (
    <>
      {farmGeometries.map((geom) => {
        const farm = farms.find((f) => f.id === geom.farmId);
        const isFarmSelected = selectedEntity?.id === geom.farmId;

        return (
          <React.Fragment key={geom.farmId}>
            {/* Outer Farm Perimeter Boundary */}
            {layers.farmBoundaries && (
              <Polygon
                positions={geom.perimeterPolygon}
                pathOptions={{
                  color: isFarmSelected ? '#d97706' : '#059669',
                  weight: isFarmSelected ? 3 : 2,
                  dashArray: '6, 4',
                  fillColor: '#059669',
                  fillOpacity: isFarmSelected ? 0.18 : 0.06,
                }}
                eventHandlers={{
                  click: () => {
                    if (farm) {
                      setSelectedEntity({ type: 'FARM', id: farm.id, data: farm });
                      flyTo(geom.center, 14);
                    }
                  },
                }}
              >
                <Tooltip sticky direction="top">
                  <div className="p-1 font-sans text-xs">
                    <div className="font-bold text-stone-900">
                      {farm ? farm.name : 'Registered Farm Property'}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {geom.totalAcreageHectares} ha • {geom.verificationStatus.replace(/_/g, ' ')}
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            )}

            {/* Internal Subdivisions & Paddocks */}
            {layers.paddocks &&
              geom.areas.map((area) => {
                const colorConfig = getAreaColor(area.type);
                const isAreaSelected = selectedEntity?.id === area.id;

                return (
                  <Polygon
                    key={area.id}
                    positions={area.polygon}
                    pathOptions={{
                      color: isAreaSelected ? '#d97706' : colorConfig.stroke,
                      weight: isAreaSelected ? 2.5 : 1.5,
                      fillColor: colorConfig.stroke,
                      fillOpacity: isAreaSelected ? 0.35 : 0.14,
                    }}
                    eventHandlers={{
                      click: () => {
                        if (farm) {
                          setSelectedEntity({
                            type: 'FARM',
                            id: farm.id,
                            data: { ...farm, highlightedArea: area },
                          });
                        }
                      },
                    }}
                  >
                    <Tooltip sticky direction="top">
                      <div className="p-1 font-sans text-xs">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colorConfig.stroke }}
                          />
                          <span>{area.name}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                          {area.code} • {area.type.replace(/_/g, ' ')} • {area.acreageHectares} ha
                        </div>
                        <div className="text-[10px] font-semibold text-stone-700 mt-1 flex items-center gap-2">
                          <span>
                            Occupancy: {area.currentOccupancyHead} / {area.capacityHead} head
                          </span>
                          {area.waterSourceAvailable && <span className="text-sky-700">✓ Water</span>}
                          {area.shadeAvailable && <span className="text-emerald-700">✓ Shade</span>}
                        </div>
                      </div>
                    </Tooltip>
                  </Polygon>
                );
              })}
          </React.Fragment>
        );
      })}
    </>
  );
}
