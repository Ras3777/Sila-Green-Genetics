'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Building2,
  MapPin,
  Users,
  Plus,
  ArrowRight,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Map as MapIcon,
  Table as TableIcon,
  Sun,
  Droplets,
  Thermometer,
  ShieldAlert,
  CalendarCheck2,
} from 'lucide-react';

export default function BovineFarmsListPage() {
  const { farms, herds, animals, organizations, farmDailyLogs, environmentLogs, farmEvents } = useBovine();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [filterOrg, setFilterOrg] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const regions = Array.from(new Set(farms.map((f) => f.region)));

  const filteredFarms = farms.filter((f) => {
    if (filterType !== 'ALL' && f.type !== filterType) return false;
    if (filterRegion !== 'ALL' && f.region !== filterRegion) return false;
    if (filterOrg !== 'ALL' && f.organizationId !== filterOrg) return false;
    if (!searchTerm.trim()) return true;

    const q = searchTerm.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.code.toLowerCase().includes(q) ||
      f.city.toLowerCase().includes(q) ||
      f.region.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Operational Stations & Facilities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Farms, Stations & Herd Hubs
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Geospatial breeding stations, IVF donor centers, isolation pens, and production herds
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/bovine/map"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 shadow-2xs"
            title="View Interactive Map"
          >
            <MapIcon className="w-3.5 h-3.5 text-stone-500" />
            <span>Map View</span>
          </Link>
          <Link
            href="/bovine/herds"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-stone-500" />
            <span>All Herds</span>
          </Link>
          <Link
            id="btn-enroll-station"
            href="/bovine/farms/new"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll Station</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search farm facilities by name, code, city, or facility type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl border border-stone-200 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">Facility Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
            >
              <option value="ALL">All Operational Types</option>
              <option value="DAIRY">Dairy Production</option>
              <option value="BEEF">Beef Station</option>
              <option value="GENOMIC_HUB">Genomic Nucleus Hub</option>
              <option value="SEEDSTOCK">Seedstock</option>
              <option value="RESEARCH">Research</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">Geographic Region</label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
            >
              <option value="ALL">All Regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">Organization</label>
            <select
              value={filterOrg}
              onChange={(e) => setFilterOrg(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
            >
              <option value="ALL">All Organizations</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Farms View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => {
            const farmAnimals = animals.filter((a) => a.farmId === farm.id);
            const farmHerds = herds.filter((h) => h.farmId === farm.id);
            const occupancy = farm.capacity && farm.capacity > 0
              ? Math.round((farmAnimals.length / farm.capacity) * 100)
              : 0;
            const org = organizations.find((o) => o.id === farm.organizationId);

            // Latest Daily Log
            const latestFarmLog = farmDailyLogs.find((l) => l.farmId === farm.id);
            // Latest Environment Log
            const latestEnv = environmentLogs.find((e) => e.farmId === farm.id);
            // Open Events
            const openEvents = farmEvents.filter((evt) => evt.farmId === farm.id && evt.status !== 'RESOLVED');

            return (
              <div
                key={farm.id}
                className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4 flex flex-col justify-between hover:border-emerald-700/50 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-emerald-800 font-bold">{farm.code}</span>
                      <h2 className="text-lg font-bold text-stone-900">{farm.name}</h2>
                      <div className="text-[11px] text-stone-400 font-medium">{org?.name}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                      {farm.type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                    <span>
                      {farm.city}, {farm.region} ({farm.country})
                    </span>
                  </div>

                  {/* Quick Status Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                    {openEvents.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-bold border border-rose-200 flex items-center space-x-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{openEvents.length} Incident{openEvents.length > 1 ? 's' : ''} Active</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Biosecurity Clear</span>
                      </span>
                    )}

                    {latestEnv && (
                      <span className={`px-2 py-0.5 rounded-md font-semibold border ${
                        latestEnv.heatStressRisk === 'SEVERE' || latestEnv.heatStressRisk === 'MODERATE'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}>
                        THI {latestEnv.thi} ({latestEnv.heatStressRisk})
                      </span>
                    )}
                  </div>

                  {/* Capacity progress */}
                  <div className="space-y-1 pt-2 border-t border-stone-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Current Occupancy</span>
                      <span className="font-bold text-stone-900">
                        {farmAnimals.length} / {farm.capacity} ({occupancy}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancy > 90 ? 'bg-amber-600' : 'bg-emerald-700'
                        }`}
                        style={{ width: `${Math.min(occupancy, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Herds summary */}
                  <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
                    {farmHerds.map((h) => (
                      <span
                        key={h.id}
                        className="px-2 py-0.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-600 font-medium"
                      >
                        {h.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">Supervisor: {farm.contactName}</span>
                  <Link
                    href={`/bovine/farms/${farm.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    <span>Station 360</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 pl-6">Code & Name</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Capacity</th>
                  <th className="p-3.5">Herds</th>
                  <th className="p-3.5">Biosecurity / Env</th>
                  <th className="p-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredFarms.map((farm) => {
                  const farmAnimals = animals.filter((a) => a.farmId === farm.id);
                  const farmHerds = herds.filter((h) => h.farmId === farm.id);
                  const occupancy = farm.capacity && farm.capacity > 0
                    ? Math.round((farmAnimals.length / farm.capacity) * 100)
                    : 0;
                  const openEvents = farmEvents.filter((evt) => evt.farmId === farm.id && evt.status !== 'RESOLVED');

                  return (
                    <tr key={farm.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3.5 pl-6">
                        <Link href={`/bovine/farms/${farm.id}`} className="font-bold text-stone-900 hover:text-emerald-800">
                          {farm.name}
                        </Link>
                        <div className="font-mono text-[11px] text-emerald-800">{farm.code}</div>
                      </td>
                      <td className="p-3.5 font-medium">{farm.type.replace(/_/g, ' ')}</td>
                      <td className="p-3.5 text-stone-600">{farm.city}, {farm.region}</td>
                      <td className="p-3.5">
                        <span className="font-bold">{farmAnimals.length}</span> / {farm.capacity} ({occupancy}%)
                      </td>
                      <td className="p-3.5 font-medium">{farmHerds.length} Herds</td>
                      <td className="p-3.5">
                        {openEvents.length > 0 ? (
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            {openEvents.length} Alerts
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <Link
                          href={`/bovine/farms/${farm.id}`}
                          className="font-bold text-emerald-800 hover:underline"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
