'use client';

import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';

export function GeofenceLayer() {
  const { geofences, layers } = useBovineMap();

  if (!layers.quarantineZones && !layers.paddocks) return null;

  return (
    <>
      {geofences.map((gf) => {
        const isQuarantine = gf.type === 'QUARANTINE';
        const strokeColor = isQuarantine ? '#dc2626' : '#f59e0b';
        const fillColor = isQuarantine ? '#fee2e2' : '#fef3c7';

        return (
          <Polygon
            key={gf.id}
            positions={gf.polygon}
            pathOptions={{
              color: strokeColor,
              weight: 2,
              dashArray: '4, 4',
              fillColor: strokeColor,
              fillOpacity: 0.15,
            }}
          >
            <Tooltip sticky direction="top">
              <div className="p-1 font-sans text-xs">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: strokeColor }}
                  />
                  <span>{gf.name}</span>
                </div>
                <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                  Type: {gf.type.replace('_', ' ')} •{' '}
                  {gf.alertOnExit ? 'Alert on Exit' : 'Alert on Enter'}
                </div>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
}
