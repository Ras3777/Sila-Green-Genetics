'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Map as MapIcon,
  MapPin,
  Shield,
  ShieldAlert,
  Compass,
  Layers,
  Users,
  Thermometer,
  Droplets,
  Building2,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface FarmMapPageProps {
  params: Promise<{ farmId: string }>;
}

export default function FarmMapPage({ params }: FarmMapPageProps) {
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const { farms, herds, animals, environmentLogs, farmEvents } = useBovine();
  const farm = farms.find((f) => f.id === farmId);

  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [activeLayer, setActiveLayer] = useState<'zones' | 'biosecurity' | 'sensors'>('zones');

  if (!farm) {
    return null;
  }

  const farmHerds = herds.filter((h) => h.farmId === farm.id);
  const farmAnimals = animals.filter((a) => a.farmId === farm.id);
  const latestEnv = environmentLogs.find((e) => e.farmId === farm.id);
  const openIncidents = farmEvents.filter((e) => e.farmId === farm.id && e.status !== 'RESOLVED');

  // Defined farm operational zones for facility architecture
  const zones = [
    {
      id: 'zone-prod-1',
      name: 'Barn Alpha - Main Lactation & Free Stall',
      type: 'PRODUCTION',
      biosecurityTier: 'Standard - Controlled',
      capacity: Math.round((farm.capacity || 500) * 0.4),
      headCount: Math.round(farmAnimals.length * 0.45),
      herdsAssigned: farmHerds.slice(0, 1).map((h) => h.name),
      sensors: { temp: latestEnv?.airTempC || 21.4, humidity: latestEnv?.relativeHumidityPct || 62, thi: latestEnv?.thi || 68 },
      status: 'OPTIMAL',
      statusText: 'Adequate ventilation, continuous misting active',
    },
    {
      id: 'zone-maternity',
      name: 'Maternity Ward & Close-up Dry Pens',
      type: 'SPECIAL_CARE',
      biosecurityTier: 'Elevated - Vet Escort Only',
      capacity: Math.round((farm.capacity || 500) * 0.15),
      headCount: Math.round(farmAnimals.length * 0.12),
      herdsAssigned: ['Maternity / Dry Herd'],
      sensors: { temp: (latestEnv?.airTempC || 21) - 1, humidity: 58, thi: 66 },
      status: 'CAUTION',
      statusText: '3 fresh calvings under monitoring today',
    },
    {
      id: 'zone-quarantine',
      name: 'Quarantine & Biosecurity Isolation Bay',
      type: 'BIOSECURITY_ISOLATION',
      biosecurityTier: 'Strict Exclusion - Bio Tier 3',
      capacity: Math.round((farm.capacity || 500) * 0.08),
      headCount: farmAnimals.filter((a) => (a.operationalStatus as string) === 'QUARANTINE' || (a.useStatus as string) === 'QUARANTINE' || a.lifeStatus === 'SICK').length,
      herdsAssigned: ['Quarantine Pen B-2'],
      sensors: { temp: latestEnv?.airTempC || 22, humidity: 65, thi: 69 },
      status: openIncidents.length > 0 ? 'ALERT' : 'OPTIMAL',
      statusText: openIncidents.length > 0 ? 'Active biosecurity containment protocol' : 'Negative pathogen screen, sanitized',
    },
    {
      id: 'zone-heifer-grazing',
      name: 'North Pasture & Heifer Rotational Paddock',
      type: 'PASTURE',
      biosecurityTier: 'Perimeter Monitored',
      capacity: Math.round((farm.capacity || 500) * 0.25),
      headCount: Math.round(farmAnimals.length * 0.25),
      herdsAssigned: farmHerds.slice(1, 2).map((h) => h.name),
      sensors: { temp: latestEnv?.airTempC || 23, humidity: 55, thi: 69 },
      status: 'OPTIMAL',
      statusText: 'Pasture score 4.2/5, shade cloth deployed',
    },
    {
      id: 'zone-feed-center',
      name: 'Central Commodity Feed Center & Silo Bunkers',
      type: 'NUTRITION_HUB',
      biosecurityTier: 'Commercial Delivery / Controlled',
      capacity: 0,
      headCount: 0,
      herdsAssigned: [],
      sensors: { temp: 18.5, humidity: 48, thi: 63 },
      status: 'OPTIMAL',
      statusText: 'TMR Mixer calibrated, dry matter tested',
    },
    {
      id: 'zone-milking-parlor',
      name: 'Automated Milking Parlor & Milk Storage Hub',
      type: 'HARVESTING',
      biosecurityTier: 'Food Safety Sanitary Grade A',
      capacity: 40,
      headCount: 0,
      herdsAssigned: ['Active Shift Groups'],
      sensors: { temp: 19.8, humidity: 60, thi: 65 },
      status: 'OPTIMAL',
      statusText: 'CIP sanitation complete, bulk tank cooled to 3.8°C',
    },
  ];

  const filteredZones = selectedZone === 'all' ? zones : zones.filter((z) => z.id === selectedZone);

  return (
    <div className="space-y-6">
      {/* Station Geographic Metadata */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Geospatial Coordinates & Boundaries</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              {farm.name} ({farm.code})
            </h3>
            <p className="text-xs text-stone-500">
              {farm.address}, {farm.city}, {farm.district}, {farm.region}, {farm.country}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Latitude</span>
              <span className="font-mono font-bold text-stone-900">{farm.latitude.toFixed(4)}° N</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Longitude</span>
              <span className="font-mono font-bold text-stone-900">{farm.longitude.toFixed(4)}° W</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Elevation</span>
              <span className="font-mono font-bold text-stone-900">{farm.elevation}m ASL</span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${farm.latitude},${farm.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 px-3.5 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>External GPS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Map Layout Visualizer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas / Schematic */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <MapIcon className="w-4 h-4 text-emerald-800" />
                <h4 className="text-sm font-bold text-stone-900">Interactive Facility Schematic</h4>
              </div>

              {/* Layer switchers */}
              <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveLayer('zones')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeLayer === 'zones' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Paddocks & Pens
                </button>
                <button
                  onClick={() => setActiveLayer('biosecurity')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeLayer === 'biosecurity' ? 'bg-white text-purple-800 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Biosecurity Tiers
                </button>
                <button
                  onClick={() => setActiveLayer('sensors')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeLayer === 'sensors' ? 'bg-white text-blue-800 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Microclimate Sensors
                </button>
              </div>
            </div>

            {/* Schematic Grid Canvas */}
            <div className="relative min-h-[380px] rounded-2xl bg-stone-900/5 p-4 border border-stone-200/70 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                {zones.map((z) => {
                  const isSelected = selectedZone === z.id;
                  const isQuarantine = z.type === 'BIOSECURITY_ISOLATION';

                  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  if (activeLayer === 'biosecurity') {
                    badgeColor = isQuarantine
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : z.type === 'SPECIAL_CARE'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : 'bg-blue-100 text-blue-800 border-blue-200';
                  }

                  return (
                    <div
                      key={z.id}
                      onClick={() => setSelectedZone(isSelected ? 'all' : z.id)}
                      className={`cursor-pointer p-4 rounded-2xl bg-white/95 backdrop-blur-xs border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-700 ring-2 ring-emerald-700/20 shadow-md'
                          : 'border-stone-200/80 hover:border-stone-300 hover:shadow-2xs'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${badgeColor}`}>
                            {activeLayer === 'biosecurity' ? z.biosecurityTier : z.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] font-mono text-stone-500 font-bold">
                            {z.headCount} head {z.capacity > 0 ? `/ ${z.capacity}` : ''}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-stone-900">{z.name}</h5>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                        {activeLayer === 'sensors' ? (
                          <div className="flex items-center gap-2 text-stone-600 font-mono">
                            <span className="flex items-center gap-0.5">
                              <Thermometer className="w-3 h-3 text-amber-600" />
                              {z.sensors.temp}°C
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Droplets className="w-3 h-3 text-blue-600" />
                              {z.sensors.humidity}%
                            </span>
                            <span className="font-bold text-stone-800">THI {z.sensors.thi}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                            {z.herdsAssigned.join(', ') || 'Facility Utility'}
                          </div>
                        )}

                        <span
                          className={`w-2 h-2 rounded-full ${
                            z.status === 'ALERT'
                              ? 'bg-rose-500 animate-pulse'
                              : z.status === 'CAUTION'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Schematic Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 pt-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal Condition
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Special Monitoring
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Biosecurity / Quarantine
                </span>
              </div>
              <span>Click any zone above to filter details</span>
            </div>
          </div>
        </div>

        {/* Selected Zone or Biosecurity Panel */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-800" />
                <h4 className="text-sm font-bold text-stone-900">Station Biosecurity Control</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                Status: Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Vehicle Disinfection Station</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Automated wheel wash active at Gate 1 entrance</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Visitor & Staff Log Clearance</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Mandatory boot dip and sanitary gear enforced</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200/70 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-900">Isolation Quarantine Bay</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    {openIncidents.length > 0
                      ? `${openIncidents.length} active incidents logged. Strict barrier maintenance in effect.`
                      : 'Zero cross-contamination events recorded. Buffer zone clear.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Facility Lead Contact</span>
              <span className="font-bold text-stone-900">{farm.contactName || 'Station Commander'}</span>
            </div>
          </div>

          {/* Quick links to facility sections */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Facility Navigation</h4>
            <div className="space-y-1.5">
              <Link
                href={`/bovine/farms/${farm.id}/animals`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Inspect All Station Animals</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
              <Link
                href={`/bovine/farms/${farm.id}/herds`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Manage Production Herds</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
              <Link
                href={`/bovine/farms/${farm.id}/events`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                  <span>View Incident History</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
