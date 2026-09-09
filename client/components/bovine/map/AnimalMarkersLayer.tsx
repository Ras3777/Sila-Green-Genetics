'use client';

import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';
import { AnimalMapLocation } from '@/lib/bovine-map-types';
import { Dna, ShieldCheck, Radio, Battery, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function AnimalMarkersLayer() {
  const {
    filteredAnimalLocations,
    layers,
    selectedEntity,
    setSelectedEntity,
    flyTo,
  } = useBovineMap();

  if (!layers.animalLocations && !layers.farmAnimals && !layers.breedingStock) return null;

  const createAnimalIcon = (animal: AnimalMapLocation, isSelected: boolean) => {
    const isGps = animal.locationConfidence === 'SENSOR_GPS';
    const isSick = animal.healthStatus === 'SICK' || animal.healthStatus === 'QUARANTINE';

    let markerColor = '#059669'; // default emerald
    if (isSick) markerColor = '#dc2626';
    else if (animal.breedingStock) markerColor = '#d97706';
    else if (isGps) markerColor = '#2563eb';

    const html = `
      <div class="relative cursor-pointer group" style="transform: translate(-50%, -50%);">
        ${
          isGps
            ? `<div class="absolute -inset-1 rounded-full animate-ping opacity-75" style="background-color: ${markerColor};"></div>`
            : ''
        }
        <div class="relative w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-[10px] ${
          isSelected ? 'ring-4 ring-amber-400 scale-125 z-50' : 'hover:scale-110'
        }" style="background-color: ${markerColor};">
          ${isGps ? 'GPS' : animal.sex === 'MALE' ? '♂' : '♀'}
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-bovine-animal-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  };

  return (
    <>
      {filteredAnimalLocations.map((animal) => {
        // Layer filter checks
        if (animal.breedingStock && !layers.breedingStock && !layers.animalLocations) return null;
        if (!animal.breedingStock && !layers.farmAnimals && !layers.animalLocations) return null;
        if (animal.sex === 'MALE' && !layers.bulls && !layers.animalLocations) return null;
        if (animal.sex === 'FEMALE' && !layers.cows && !layers.animalLocations) return null;

        const isSelected = selectedEntity?.id === animal.animalId;
        const icon = createAnimalIcon(animal, isSelected);

        return (
          <React.Fragment key={animal.animalId}>
            {/* If GPS with accuracy radius, render accuracy circle */}
            {animal.locationConfidence === 'SENSOR_GPS' && animal.accuracyMeters && (
              <Circle
                center={animal.coordinates}
                radius={animal.accuracyMeters}
                pathOptions={{
                  color: isSelected ? '#d97706' : '#3b82f6',
                  weight: 1,
                  fillColor: '#3b82f6',
                  fillOpacity: 0.1,
                }}
              />
            )}

            <Marker
              position={animal.coordinates}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedEntity({ type: 'ANIMAL', id: animal.animalId, data: animal });
                  flyTo(animal.coordinates, 15);
                },
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-3 font-sans text-xs max-w-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 font-bold border border-amber-200">
                          {animal.primaryIdentifier}
                        </span>
                        {animal.dgr && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-semibold">
                            {animal.dgr}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">{animal.name}</h4>
                      <div className="text-[11px] text-stone-500">
                        {animal.breed} • {animal.sex} {animal.breedingRole ? `• ${animal.breedingRole}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Location Confidence Stamp */}
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-stone-500 text-[10px] font-mono uppercase">
                      <span>Location Source</span>
                      <span className="font-bold text-emerald-800">
                        {animal.locationConfidence === 'SENSOR_GPS'
                          ? 'Live GPS Tracker'
                          : animal.locationConfidence === 'FARM_PADDOCK_LOCATION'
                          ? 'RFID Paddock Scan'
                          : 'Movement Event'}
                      </span>
                    </div>
                    <div className="text-stone-800 font-medium truncate">
                      {animal.farmAreaName || animal.farmName}
                    </div>
                    {animal.accuracyMeters && (
                      <div className="text-[10px] text-stone-500 font-mono">
                        Accuracy: ±{animal.accuracyMeters}m • Updated {animal.telemetryFreshnessSec || 60}s ago
                      </div>
                    )}
                  </div>

                  {/* Action Hub */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setSelectedEntity({ type: 'ANIMAL', id: animal.animalId, data: animal });
                      }}
                      className="w-full py-1.5 rounded-lg bg-emerald-800 text-white font-semibold text-[11px] flex items-center justify-center gap-1 hover:bg-emerald-700 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Animal Inspector</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <Link
                      href={`/bovine/animals/breeding-stock/${animal.animalId}`}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
                      title="Breeding Stock Profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </>
  );
}
