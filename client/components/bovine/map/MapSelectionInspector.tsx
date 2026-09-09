'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovineMap } from '@/lib/bovine-map-store';
import {
  X,
  ExternalLink,
  MapPin,
  Building2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Radio,
  Battery,
  Clock,
  Dna,
  Heart,
  Truck,
  ShoppingCart,
  Layers,
  ChevronRight,
  Maximize2,
  Download,
  Award,
  Sparkles,
  Users,
  Compass,
  FileCheck2,
} from 'lucide-react';

export function MapSelectionInspector() {
  const { selectedEntity, isInspectorOpen, clearSelection, flyTo, farmGeometries, setFilter } =
    useBovineMap();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AREAS' | 'METRICS'>('OVERVIEW');

  if (!isInspectorOpen || !selectedEntity) {
    return null;
  }

  const { type, id, data } = selectedEntity;

  // Handler to export spatial GeoJSON
  const handleExportGeoJSON = () => {
    let geojson: any = null;
    let filename = `export-${type.toLowerCase()}-${id}.geojson`;

    if (type === 'FARM') {
      const geom = farmGeometries.find((g) => g.farmId === id);
      geojson = {
        type: 'FeatureCollection',
        features: [
          ...(geom?.perimeterPolygon
            ? [
                {
                  type: 'Feature',
                  properties: { name: data.name, type: 'FARM_PERIMETER', farmId: id },
                  geometry: {
                    type: 'Polygon',
                    coordinates: [geom.perimeterPolygon.map(([lat, lng]) => [lng, lat])],
                  },
                },
              ]
            : []),
          ...(geom?.areas.map((a) => ({
            type: 'Feature',
            properties: {
              name: a.name,
              code: a.code,
              type: a.type,
              acreageHectares: a.acreageHectares,
              capacityHead: a.capacityHead,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [a.polygon.map(([lat, lng]) => [lng, lat])],
            },
          })) || []),
        ],
      };
    } else if (type === 'ANIMAL') {
      geojson = {
        type: 'Feature',
        properties: {
          id: data.animalId,
          name: data.name,
          primaryIdentifier: data.primaryIdentifier,
          farmId: data.farmId,
          confidence: data.locationConfidence,
          recordedAt: data.recordedAt,
        },
        geometry: {
          type: 'Point',
          coordinates: [data.coordinates[1], data.coordinates[0]],
        },
      };
    } else if (type === 'REGION' || type === 'DISTRICT') {
      geojson = {
        type: 'Feature',
        properties: {
          id: data.id,
          name: data.name,
          code: data.code,
          level: data.level,
          statistics: data.statistics,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [data.polygon.map(([lat, lng]: [number, number]) => [lng, lat])],
        },
      };
    }

    if (!geojson) return;
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="fixed top-20 right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] z-1000 bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-stone-200/80 bg-stone-50/70 flex items-start justify-between gap-3">
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              {type.replace('_', ' ')}
            </span>
            {type === 'FARM' && data.verificationStatus && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-500">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            )}
            {type === 'ANIMAL' && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  data.locationConfidence === 'SENSOR_GPS'
                    ? 'bg-emerald-100 text-emerald-800'
                    : data.locationConfidence === 'FARM_PADDOCK_LOCATION'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {data.locationConfidence === 'SENSOR_GPS' ? (
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                ) : (
                  <MapPin className="w-2.5 h-2.5" />
                )}
                {data.locationConfidence.replace('_', ' ')}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-stone-900 truncate tracking-tight">
            {type === 'FARM' && data.name}
            {type === 'ANIMAL' && `${data.name} (${data.primaryIdentifier})`}
            {(type === 'REGION' || type === 'DISTRICT') && data.name}
            {type === 'DISEASE_EVENT' && `${data.diseaseName} Case #${data.caseNumber}`}
            {type === 'MOVEMENT' && `Transfer #${data.referenceNumber}`}
            {type === 'MARKETPLACE' && data.title}
            {type === 'CLUSTER' && data.title}
          </h3>
          <p className="text-xs text-stone-500 truncate">
            {type === 'FARM' && `${data.code} • ${data.city || data.region}`}
            {type === 'ANIMAL' && `${data.breed} • ${data.sex} • Farm: ${data.farmName}`}
            {(type === 'REGION' || type === 'DISTRICT') && `Admin Code: ${data.code}`}
            {type === 'DISEASE_EVENT' && `Reported at ${data.farmName}`}
            {type === 'MOVEMENT' && `${data.fromFarmName} → ${data.toFarmName}`}
            {type === 'MARKETPLACE' && `${data.breed} • ${data.farmName}, ${data.region}`}
            {type === 'CLUSTER' && `${data.farms.length} Facilities in Radius`}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleExportGeoJSON}
            title="Download GeoJSON Feature"
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ======================= FARM INSPECTOR ======================= */}
        {type === 'FARM' && (
          <>
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200/60 text-center">
                <span className="text-[10px] uppercase font-semibold text-stone-500">Cattle</span>
                <p className="text-base font-bold text-stone-900 mt-0.5">
                  {data.currentOccupancy ?? data.capacity ?? 184}
                </p>
                <span className="text-[9px] text-stone-400">Head Count</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200/60 text-center">
                <span className="text-[10px] uppercase font-semibold text-stone-500">Acreage</span>
                <p className="text-base font-bold text-stone-900 mt-0.5">
                  {farmGeometries.find((g) => g.farmId === id)?.totalAcreageHectares ?? 145}
                </p>
                <span className="text-[9px] text-stone-400">Hectares</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200/60 text-center">
                <span className="text-[10px] uppercase font-semibold text-stone-500">Biosecurity</span>
                <p className="text-base font-bold text-emerald-800 mt-0.5">Tier 1</p>
                <span className="text-[9px] text-stone-400">Audited</span>
              </div>
            </div>

            {/* Farm Details */}
            <div className="space-y-2 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/60 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500 font-medium">Facility Type</span>
                <span className="font-semibold text-stone-900">{data.type || 'Commercial Dairy'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500 font-medium">Jurisdiction</span>
                <span className="font-semibold text-stone-900">
                  {data.region}, {data.district || 'District East'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500 font-medium">Coordinates</span>
                <span className="font-mono text-[11px] text-stone-700">
                  {data.latitude?.toFixed(4)}, {data.longitude?.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500 font-medium">Premises ID</span>
                <span className="font-mono text-emerald-800 font-semibold">{data.code}</span>
              </div>
            </div>

            {/* Paddocks & Internal Subdivisions */}
            {farmGeometries.find((g) => g.farmId === id)?.areas && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Internal Paddocks ({farmGeometries.find((g) => g.farmId === id)?.areas.length})
                  </h4>
                  <span className="text-[10px] text-stone-400">Acreage & Head</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {farmGeometries
                    .find((g) => g.farmId === id)
                    ?.areas.map((area) => (
                      <div
                        key={area.id}
                        className="bg-white p-2.5 rounded-xl border border-stone-200/80 flex items-center justify-between gap-2 hover:border-emerald-300 transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-stone-900 leading-tight">
                            {area.name}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {area.code} • {area.type.replace('_', ' ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-stone-800">
                            {area.currentOccupancyHead} / {area.capacityHead}
                          </span>
                          <span className="block text-[9px] text-stone-400">
                            {area.acreageHectares} ha
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={`/bovine/farms/${id}`}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <span>View Comprehensive Farm Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (data.latitude && data.longitude) {
                    flyTo([data.latitude, data.longitude], 15);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5 text-stone-500" />
                <span>Focus Farm Perimeter Extent</span>
              </button>
            </div>
          </>
        )}

        {/* ======================= ANIMAL INSPECTOR ======================= */}
        {type === 'ANIMAL' && (
          <>
            {/* Animal Header Summary Card */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Tag / RFID</span>
                  <p className="text-base font-mono font-bold text-stone-900">
                    {data.primaryIdentifier}
                  </p>
                </div>
                {data.dgr && (
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-stone-400 uppercase">DGR ID</span>
                    <p className="text-xs font-mono font-bold text-emerald-800">{data.dgr}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-200 text-stone-800">
                  {data.breed}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-200 text-stone-800">
                  {data.sex}
                </span>
                {data.breedingRole && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                    {data.breedingRole}
                  </span>
                )}
              </div>
            </div>

            {/* Telemetry & Location Quality */}
            <div className="space-y-2 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/60 text-xs">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-600" />
                Geospatial Confidence Taxonomy
              </h4>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500 font-medium">Taxonomy Tier</span>
                <span className="font-semibold text-stone-900">
                  {data.locationConfidence === 'SENSOR_GPS' && 'Tier 1: Active GPS Collar'}
                  {data.locationConfidence === 'FARM_PADDOCK_LOCATION' &&
                    'Tier 2: RFID Gate Paddock Fix'}
                  {data.locationConfidence === 'EVENT_DERIVED' &&
                    'Tier 3: Event-Derived Landmark'}
                </span>
              </div>
              {data.accuracyMeters !== undefined && (
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500 font-medium">Estimated Accuracy</span>
                  <span className="font-semibold text-emerald-800">
                    &plusmn;{data.accuracyMeters} meters
                  </span>
                </div>
              )}
              {data.batteryPct !== undefined && (
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500 font-medium">Device Battery</span>
                  <span className="font-semibold text-stone-800 flex items-center gap-1">
                    <Battery className="w-3 h-3 text-emerald-600" />
                    {data.batteryPct}%
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-stone-500 font-medium">Recorded Fix</span>
                <span className="text-[11px] text-stone-600 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {new Date(data.recordedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Farm & Paddock Assignment */}
            <div className="space-y-1.5 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/60 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500 font-medium">Assigned Facility</span>
                <span className="font-semibold text-stone-900">{data.farmName}</span>
              </div>
              {data.farmAreaName && (
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 font-medium">Paddock / Pen</span>
                  <span className="font-semibold text-emerald-800">{data.farmAreaName}</span>
                </div>
              )}
            </div>

            {/* Genetic Index if available */}
            {data.geneticIndex !== undefined && (
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-xl text-purple-700">
                    <Dna className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-700">
                      Genomic Selection Index
                    </span>
                    <p className="text-sm font-bold text-purple-950">
                      {data.selectionIndexValue || 'Net Merit +$480'}
                    </p>
                  </div>
                </div>
                <span className="text-base font-bold text-purple-800">
                  {data.geneticIndex}
                </span>
              </div>
            )}

            {/* Animal Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={`/bovine/animals/farm-animals/${data.animalId}`}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Open Comprehensive Animal Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => flyTo(data.coordinates, 16)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-stone-500" />
                <span>Locate & Follow GPS Signal</span>
              </button>
            </div>
          </>
        )}

        {/* ======================= REGION / DISTRICT INSPECTOR ======================= */}
        {(type === 'REGION' || type === 'DISTRICT') && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200/60">
                <span className="text-[10px] uppercase font-semibold text-stone-500">Cattle</span>
                <p className="text-lg font-bold text-stone-900 mt-0.5">
                  {data.statistics.animalCount.toLocaleString()}
                </p>
                <span className="text-[9px] text-stone-400">Total Registered</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200/60">
                <span className="text-[10px] uppercase font-semibold text-stone-500">Facilities</span>
                <p className="text-lg font-bold text-stone-900 mt-0.5">
                  {data.statistics.farmCount}
                </p>
                <span className="text-[9px] text-stone-400">Licensed Premises</span>
              </div>
            </div>

            {/* Regulatory Rates */}
            <div className="space-y-2 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/60 text-xs">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                Regional Veterinary Indicators
              </h4>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-stone-600">
                  <span>Vaccination Coverage</span>
                  <span className="font-bold text-emerald-800">
                    {data.statistics.vaccinationRate}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${data.statistics.vaccinationRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-stone-600">
                  <span>Genomic Testing Coverage</span>
                  <span className="font-bold text-purple-800">
                    {data.statistics.genotypeCoverage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${data.statistics.genotypeCoverage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-stone-600">
                  <span>Regulatory Compliance</span>
                  <span className="font-bold text-stone-900">
                    {data.statistics.complianceRate}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-700 rounded-full"
                    style={{ width: `${data.statistics.complianceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Filter */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  if (type === 'REGION') {
                    setFilter('region', data.name);
                  }
                  flyTo(data.center, 9);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Filter Workspace to this {type}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {/* ======================= DISEASE EVENT INSPECTOR ======================= */}
        {type === 'DISEASE_EVENT' && (
          <>
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold text-red-950 uppercase">
                    Active Biosecurity Alert
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                  {data.severity} SEVERITY
                </span>
              </div>
              <p className="text-sm font-bold text-red-950">{data.diseaseName}</p>
              <p className="text-xs text-red-800">
                Premises: <span className="font-semibold">{data.farmName}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-bold">Affected Head</span>
                <p className="text-base font-bold text-red-700 mt-0.5">{data.affectedCount}</p>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-bold">Confirmed Deaths</span>
                <p className="text-base font-bold text-stone-900 mt-0.5">{data.deathsCount}</p>
              </div>
            </div>

            <div className="space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                Concentric Buffer Rings
              </h4>
              <div className="space-y-1 text-stone-600 text-[11px]">
                <div className="flex items-center justify-between py-0.5 border-b border-stone-200">
                  <span className="font-semibold text-red-700">5 km Core Zone</span>
                  <span>Mandatory Ring Vaccination</span>
                </div>
                <div className="flex items-center justify-between py-0.5 border-b border-stone-200">
                  <span className="font-semibold text-amber-700">10 km Buffer</span>
                  <span>Livestock Transit Lockdown</span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span className="font-semibold text-blue-700">25 km Surveillance</span>
                  <span>Daily Clinical Monitoring</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/bovine/government"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Open Official Surveillance Dossier</span>
              </Link>
            </div>
          </>
        )}

        {/* ======================= MOVEMENT INSPECTOR ======================= */}
        {type === 'MOVEMENT' && (
          <>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Movement Status</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  {data.status.replace('_', ' ')}
                </span>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-2 text-stone-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  <span className="font-bold">{data.fromFarmName}</span>
                </div>
                <div className="w-0.5 h-3 bg-stone-300 ml-1"></div>
                <div className="flex items-center gap-2 text-stone-800">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="font-bold">{data.toFarmName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">Volume</span>
                <span className="font-bold text-stone-900">{data.volumeHead} Head of Cattle</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">Carrier / Truck</span>
                <span className="font-medium text-stone-800">{data.carrierName || 'Licensed Hauler'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Purpose</span>
                <span className="font-medium text-stone-800">{data.reason}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/bovine/movements"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Inspect Transfer Manifest</span>
              </Link>
            </div>
          </>
        )}

        {/* ======================= MARKETPLACE INSPECTOR ======================= */}
        {type === 'MARKETPLACE' && (
          <>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                  {data.listingType.replace('_', ' ')}
                </span>
                <span className="text-sm font-bold text-emerald-800">
                  {data.currency} {data.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-bold text-stone-900">{data.title}</p>
              <p className="text-stone-500">
                Origin: {data.farmName}, {data.region}
              </p>
            </div>

            {data.privacyPrecision !== 'EXACT' && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
                <span className="font-bold block">Biosecurity Location Masking Active</span>
                <p>
                  To prevent unauthorized access, pin coordinates are fuzzed to a ~
                  {data.approximateRadiusMeters / 1000}km radius until purchase verification.
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/bovine/marketplace"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Inquire Trade Lot</span>
              </Link>
            </div>
          </>
        )}

        {/* ======================= CLUSTER INSPECTOR ======================= */}
        {type === 'CLUSTER' && (
          <>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-500 uppercase">
                  Spatial Density Cluster
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  {data.farms.length} Facilities
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Click any farm below to zoom into its boundary perimeter:
              </p>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {data.farms.map((f: any) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    flyTo([f.latitude, f.longitude], 14);
                  }}
                  className="w-full text-left bg-white p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-stone-900">{f.name}</p>
                    <p className="text-[10px] text-stone-500">
                      {f.code} • {f.type}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
