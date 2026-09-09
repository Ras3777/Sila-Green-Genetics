'use client';

import React from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';
import { MovementVectorMap } from '@/lib/bovine-map-types';
import { Truck, ArrowRight, Calendar, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function MovementPolylinesLayer() {
  const {
    filteredMovementVectors,
    layers,
    selectedEntity,
    setSelectedEntity,
  } = useBovineMap();

  if (!layers.movements) return null;

  const getPolylineOptions = (mov: MovementVectorMap, isSelected: boolean) => {
    let color = '#0284c7'; // default blue
    let dashArray: string | undefined = undefined;

    if (mov.status === 'IN_TRANSIT') {
      color = '#0284c7';
      dashArray = '8, 8';
    } else if (mov.status === 'COMPLETED') {
      color = '#059669';
    } else if (mov.status === 'PENDING') {
      color = '#d97706';
      dashArray = '5, 5';
    }

    // Weight scales with volume (e.g. 8 head = 3px, 20 head = 5px)
    const weight = Math.max(3, Math.min(8, 2 + mov.volumeHead * 0.25)) + (isSelected ? 2 : 0);

    return {
      color: isSelected ? '#ea580c' : color,
      weight,
      opacity: isSelected ? 1.0 : 0.85,
      dashArray,
    };
  };

  const createTruckIcon = (mov: MovementVectorMap, isSelected: boolean) => {
    const isTransit = mov.status === 'IN_TRANSIT';
    const bgColor = isTransit ? '#0284c7' : mov.status === 'COMPLETED' ? '#059669' : '#d97706';

    const html = `
      <div class="relative cursor-pointer group" style="transform: translate(-50%, -50%);">
        ${
          isTransit
            ? `<div class="absolute -inset-1 rounded-full animate-ping opacity-75" style="background-color: ${bgColor};"></div>`
            : ''
        }
        <div class="w-7 h-7 rounded-full shadow-md flex items-center justify-center text-white border-2 border-white ${
          isSelected ? 'ring-3 ring-amber-400 scale-125' : 'hover:scale-110'
        }" style="background-color: ${bgColor};">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-bovine-movement-truck-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  return (
    <>
      {filteredMovementVectors.map((mov) => {
        const isSelected = selectedEntity?.id === mov.id;
        const linePositions: [number, number][] = [mov.fromCoordinates, mov.toCoordinates];
        const midpoint: [number, number] = [
          (mov.fromCoordinates[0] + mov.toCoordinates[0]) / 2,
          (mov.fromCoordinates[1] + mov.toCoordinates[1]) / 2,
        ];

        return (
          <React.Fragment key={mov.id}>
            {/* Origin to Destination Polyline */}
            <Polyline
              positions={linePositions}
              pathOptions={getPolylineOptions(mov, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedEntity({ type: 'MOVEMENT', id: mov.id, data: mov });
                },
              }}
            />

            {/* Midpoint Truck Waypoint Marker */}
            <Marker
              position={midpoint}
              icon={createTruckIcon(mov, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedEntity({ type: 'MOVEMENT', id: mov.id, data: mov });
                },
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-3 font-sans text-xs max-w-xs space-y-2">
                  <div className="flex items-center justify-between gap-1 border-b border-stone-100 pb-1.5">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-900 font-bold border border-sky-200">
                      {mov.referenceNumber}
                    </span>
                    <span className="font-bold text-[10px] uppercase text-stone-700">
                      {mov.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-stone-900 text-xs font-semibold">
                    {mov.volumeHead} Head • {mov.movementType.replace(/_/g, ' ')}
                  </div>

                  <div className="text-[11px] text-stone-600 space-y-0.5">
                    <div className="truncate">From: <strong>{mov.fromFarmName}</strong></div>
                    <div className="truncate">To: <strong>{mov.toFarmName}</strong></div>
                  </div>

                  {mov.carrierName && (
                    <div className="text-[10px] text-stone-500 font-mono">
                      Carrier: {mov.carrierName} ({mov.vehicleRegistration})
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedEntity({ type: 'MOVEMENT', id: mov.id, data: mov });
                    }}
                    className="w-full mt-2 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold text-[11px] hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>View Transfer Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </>
  );
}
