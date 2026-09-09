'use client';

import React from 'react';
import { Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';
import { DiseaseEventMap } from '@/lib/bovine-map-types';
import { AlertTriangle, ShieldAlert, ArrowRight, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

export function DiseaseSurveillanceLayer() {
  const {
    filteredDiseaseEvents,
    layers,
    selectedEntity,
    setSelectedEntity,
    flyTo,
  } = useBovineMap();

  if (!layers.diseaseEvents && !layers.surveillanceBuffers && !layers.quarantineZones) {
    return null;
  }

  const createDiseaseIcon = (event: DiseaseEventMap, isSelected: boolean) => {
    const isCritical = event.severity === 'CRITICAL';
    const bgColor = isCritical ? '#dc2626' : '#d97706';

    const html = `
      <div class="relative cursor-pointer group" style="transform: translate(-50%, -50%);">
        <div class="absolute -inset-2 rounded-full animate-ping opacity-75" style="background-color: ${bgColor};"></div>
        <div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs border-2 border-white ${
          isSelected ? 'ring-4 ring-amber-400 scale-125' : 'hover:scale-110'
        }" style="background-color: ${bgColor};">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-bovine-disease-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  };

  const getBufferColor = (radiusKm: number) => {
    if (radiusKm <= 5) return { stroke: '#dc2626', fill: '#fee2e2', opacity: 0.18, label: '5km Strict Ring-Vaccination' };
    if (radiusKm <= 10) return { stroke: '#ea580c', fill: '#ffedd5', opacity: 0.12, label: '10km Biosecurity Buffer' };
    return { stroke: '#d97706', fill: '#fef3c7', opacity: 0.06, label: '25km Regional Surveillance Zone' };
  };

  return (
    <>
      {filteredDiseaseEvents.map((event) => {
        const isSelected = selectedEntity?.id === event.id;
        const icon = createDiseaseIcon(event, isSelected);

        return (
          <React.Fragment key={event.id}>
            {/* Concentric Surveillance Buffers (5km, 10km, 25km) */}
            {layers.surveillanceBuffers &&
              event.bufferRadiusKm.map((radiusKm) => {
                const config = getBufferColor(radiusKm);
                return (
                  <Circle
                    key={`${event.id}-buffer-${radiusKm}`}
                    center={event.coordinates}
                    radius={radiusKm * 1000} // meters
                    pathOptions={{
                      color: isSelected ? '#ea580c' : config.stroke,
                      weight: isSelected ? 2.5 : 1.5,
                      dashArray: '6, 6',
                      fillColor: config.stroke,
                      fillOpacity: isSelected ? config.opacity * 1.5 : config.opacity,
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedEntity({ type: 'DISEASE_EVENT', id: event.id, data: event });
                      },
                    }}
                  />
                );
              })}

            {/* Disease Event Center Marker */}
            {layers.diseaseEvents && (
              <Marker
                position={event.coordinates}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setSelectedEntity({ type: 'DISEASE_EVENT', id: event.id, data: event });
                    flyTo(event.coordinates, 12);
                  },
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-3 font-sans text-xs max-w-xs space-y-2.5">
                    <div className="flex items-start justify-between gap-1 border-b border-stone-100 pb-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-100 text-red-900 font-bold border border-red-200">
                            {event.caseNumber}
                          </span>
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                            {event.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-red-900 text-sm">{event.diseaseName}</h4>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Affected Farm: <strong>{event.farmName}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-red-50 p-2 rounded-lg border border-red-200/60">
                        <span className="text-[10px] text-red-700 font-mono uppercase block">Clinical Impact</span>
                        <span className="font-bold text-red-950 font-mono text-sm">{event.affectedCount} Affected</span>
                        <span className="text-[9px] text-red-700 block">{event.deathsCount} Fatalities</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                        <span className="text-[10px] text-stone-400 font-mono uppercase block">Quarantine Order</span>
                        <span className="font-bold text-stone-900 font-mono text-xs">
                          {event.quarantineActive ? 'ACTIVE GEOFENCE' : 'RELEASED'}
                        </span>
                        <span className="text-[9px] text-stone-500 block">Concentric 5-25km</span>
                      </div>
                    </div>

                    {event.investigatingOfficer && (
                      <div className="text-[10px] text-stone-500 font-mono">
                        Lead: {event.investigatingOfficer}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setSelectedEntity({ type: 'DISEASE_EVENT', id: event.id, data: event });
                        }}
                        className="w-full py-1.5 rounded-lg bg-red-800 text-white font-semibold text-[11px] hover:bg-red-700 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Surveillance Dossier</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
