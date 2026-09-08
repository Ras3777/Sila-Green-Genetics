'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  MapPin,
  Building2,
  Filter,
  Layers,
  ArrowRight,
  Truck,
  Sun,
  Droplets,
  Thermometer,
  ShieldAlert,
  ChevronRight,
  Eye,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Farm } from '@/lib/bovine-types';

export default function BovineMapPage() {
  const { farms, movements, animals } = useBovine();

  // Filters
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [showMovementsOverlay, setShowMovementsOverlay] = useState(true);

  // Selected farm for detailed side drawer
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(farms[0] || null);

  const filteredFarms = farms.filter((f) => {
    if (selectedType !== 'ALL' && f.type !== selectedType) return false;
    if (selectedRegion !== 'ALL' && f.region !== selectedRegion) return false;
    return true;
  });

  // Unique regions
  const regions = Array.from(new Set(farms.map((f) => f.region)));

  // Coordinate projections for our interactive SVG map canvas
  // US Bounding Box roughly: lat 25 to 50, lng -125 to -65
  const projectCoordinates = (lat: number, lng: number) => {
    const minLat = 26;
    const maxLat = 48;
    const minLng = -122;
    const maxLng = -72;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Geospatial Operations & Biosecurity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Livestock Geographic Distribution
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Real-time farm coordinates, regional weather indicators, and live inter-facility transfer vectors
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            id="select-map-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-medium text-stone-700 shadow-2xs"
          >
            <option value="ALL">All Farm Types</option>
            <option value="DAIRY">Dairy</option>
            <option value="BEEF">Beef</option>
            <option value="GENOMIC_HUB">Genomic Nucleus</option>
            <option value="SEEDSTOCK">Seedstock</option>
          </select>

          <select
            id="select-map-region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-medium text-stone-700 shadow-2xs"
          >
            <option value="ALL">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-700 cursor-pointer shadow-2xs select-none">
            <input
              id="checkbox-movement-flow"
              type="checkbox"
              checked={showMovementsOverlay}
              onChange={(e) => setShowMovementsOverlay(e.target.checked)}
              className="w-3.5 h-3.5 text-emerald-700 rounded border-stone-300"
            />
            <span className="hidden sm:inline">Movement Vectors</span>
          </label>
        </div>
      </div>

      {/* Main Map Canvas + Side Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Stage (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-stone-100 border border-stone-300/80 shadow-inner relative overflow-hidden flex flex-col min-h-[460px] p-4 sm:p-6">
          {/* Legend and Overlay Controls */}
          <div className="absolute top-4 left-4 z-10 p-3 rounded-2xl bg-white/95 backdrop-blur border border-stone-200/80 shadow-sm text-xs space-y-1.5">
            <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wider">Facility Legend</div>
            <div className="flex items-center space-x-2 text-[11px] text-stone-600">
              <span className="w-3 h-3 rounded-full bg-emerald-700 border border-white" />
              <span>Dairy / Genomic Hub</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-stone-600">
              <span className="w-3 h-3 rounded-full bg-amber-600 border border-white" />
              <span>Review Alert Flagged</span>
            </div>
            {showMovementsOverlay && (
              <div className="flex items-center space-x-2 text-[11px] text-stone-600 pt-1 border-t border-stone-100">
                <span className="w-4 h-0.5 bg-emerald-700 border-dashed" />
                <span>Inter-farm Transfer Vector</span>
              </div>
            )}
          </div>

          {/* Graphical SVG Map Overlay */}
          <div className="flex-1 relative w-full h-full min-h-[380px]">
            <svg
              className="w-full h-full absolute inset-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E2DFD6" strokeWidth="0.4" />
                </pattern>
                <marker
                  id="arrow-vector"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="3"
                  markerHeight="3"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#047857" />
                </marker>
              </defs>

              {/* Subtle background grid */}
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />

              {/* Geographic contour boundary simulation */}
              <path
                d="M 10,25 Q 25,18 45,22 T 85,20 Q 92,45 88,70 T 70,85 Q 45,90 25,82 T 10,60 Z"
                fill="#EAE8DF"
                stroke="#D6D1C4"
                strokeWidth="0.8"
                opacity="0.6"
              />

              {/* Movement-flow vectors */}
              {showMovementsOverlay &&
                movements.map((m) => {
                  const fromFarm = farms.find((f) => f.id === m.fromFarmId);
                  const toFarm = farms.find((f) => f.id === m.toFarmId);
                  if (!fromFarm || !toFarm) return null;

                  const p1 = projectCoordinates(fromFarm.latitude, fromFarm.longitude);
                  const p2 = projectCoordinates(toFarm.latitude, toFarm.longitude);

                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2 - 5; // gentle curve

                  return (
                    <g key={m.id}>
                      <path
                        d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="0.7"
                        strokeDasharray="2,1.5"
                        markerEnd="url(#arrow-vector)"
                        className="animate-pulse"
                      />
                    </g>
                  );
                })}
            </svg>

            {/* Plotted Interactive Farm Markers */}
            {filteredFarms.map((farm) => {
              const pos = projectCoordinates(farm.latitude, farm.longitude);
              const isSelected = selectedFarm?.id === farm.id;
              const hasAlert = farm.reviewCount > 0;

              return (
                <div
                  key={farm.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => setSelectedFarm(farm)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 group`}
                >
                  <div className="relative">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-transform group-hover:scale-110 ${
                        isSelected
                          ? 'bg-emerald-950 ring-4 ring-emerald-400'
                          : hasAlert
                          ? 'bg-amber-600 ring-2 ring-white'
                          : 'bg-emerald-700 ring-2 ring-white'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Quick Marker Label */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap bg-white/95 backdrop-blur px-2 py-0.5 rounded-lg border border-stone-300 text-[10px] font-bold text-stone-900 shadow-xs pointer-events-none">
                      {farm.name.split(' ')[0]} ({farm.headCount}h)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-stone-500 text-right mt-2">
            Click any farm marker to inspect live herds, weather indices, and biosecurity posture
          </div>
        </div>

        {/* Farm Context Side Panel (1 Col) */}
        <div>
          {selectedFarm ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {selectedFarm.type} FACILITY
                  </span>
                  <h2 className="text-lg font-bold text-stone-900 mt-1">{selectedFarm.name}</h2>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">
                    {selectedFarm.code} • {selectedFarm.city}, {selectedFarm.region}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFarm(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Geographic Coordinates & Elevation */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs grid grid-cols-3 gap-2">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-semibold">Lat</span>
                  <div className="font-mono text-stone-800">{selectedFarm.latitude.toFixed(4)}</div>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-semibold">Lng</span>
                  <div className="font-mono text-stone-800">{selectedFarm.longitude.toFixed(4)}</div>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-semibold">Elevation</span>
                  <div className="font-mono text-stone-800">{selectedFarm.elevation}m</div>
                </div>
              </div>

              {/* Live Farm Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-stone-500 text-[11px]">Head Count</span>
                  <div className="text-xl font-bold text-stone-900 mt-0.5">{selectedFarm.headCount} Head</div>
                  <div className="text-[10px] text-stone-500">{selectedFarm.herdCount} Herds Enrolled</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-stone-500 text-[11px]">Review Attention</span>
                  <div className={`text-xl font-bold mt-0.5 ${selectedFarm.reviewCount > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
                    {selectedFarm.reviewCount} Flagged
                  </div>
                  <div className="text-[10px] text-stone-500">{selectedFarm.openTasks} Tasks open</div>
                </div>
              </div>

              {/* Environment Snapshot */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-2 text-xs">
                <div className="font-bold text-emerald-900 flex items-center justify-between">
                  <span>Current Weather & THI Index</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    THI: {selectedFarm.environmentSummary.thi} ({selectedFarm.environmentSummary.heatStressRisk})
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-stone-700 text-[11px]">
                  <div>
                    <span className="text-stone-500">Air Temp:</span> {selectedFarm.environmentSummary.airTempC}°C
                  </div>
                  <div>
                    <span className="text-stone-500">Humidity:</span> {selectedFarm.environmentSummary.humidityPct}%
                  </div>
                  <div>
                    <span className="text-stone-500">Bedding:</span> {selectedFarm.environmentSummary.beddingScore}/5
                  </div>
                </div>
              </div>

              {/* Feed Intake Status */}
              <div className="text-xs text-stone-600 flex justify-between items-center py-2 border-t border-stone-100">
                <span>Daily Feed Refusal:</span>
                <span className="font-semibold text-stone-900">{selectedFarm.feedSummary.refusalPct}% (Normal)</span>
              </div>

              {/* Open Farm Action */}
              <div className="pt-2">
                <Link
                  id="btn-map-open-farm"
                  href={`/bovine/farms/${selectedFarm.id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  <span>Open Full Farm Station ({selectedFarm.code})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-stone-200/80 text-center text-stone-400 text-xs">
              <MapPin className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              Select a farm location on the map to inspect live metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
