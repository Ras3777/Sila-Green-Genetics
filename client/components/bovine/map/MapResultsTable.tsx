'use client';

import React, { useState } from 'react';
import { useBovineMap } from '@/lib/bovine-map-store';
import {
  Building2,
  Users,
  Truck,
  ShieldAlert,
  ShoppingCart,
  Compass,
  Search,
  ExternalLink,
  MapPin,
  Radio,
  Dna,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export function MapResultsTable() {
  const {
    filteredFarms,
    filteredAnimalLocations,
    filteredMovementVectors,
    filteredDiseaseEvents,
    filteredMarketplaceListings,
    setSelectedEntity,
    flyTo,
  } = useBovineMap();

  const [activeTab, setActiveTab] = useState<'FARMS' | 'ANIMALS' | 'MOVEMENTS' | 'HEALTH' | 'MARKET'>(
    'FARMS'
  );
  const [tableSearch, setTableSearch] = useState('');

  return (
    <div className="h-full flex flex-col bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Table Navigation Tabs & Search */}
      <div className="p-3 border-b border-stone-200/80 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('FARMS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'FARMS'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Farms ({filteredFarms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ANIMALS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ANIMALS'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tracked ({filteredAnimalLocations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MOVEMENTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'MOVEMENTS'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Transfers ({filteredMovementVectors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('HEALTH')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'HEALTH'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Alerts ({filteredDiseaseEvents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MARKET')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'MARKET'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Trade Lots ({filteredMarketplaceListings.length})</span>
          </button>
        </div>

        {/* Quick Filter Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Quick search rows..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="pl-8 pr-3 py-1 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 w-44"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        {/* ===================== FARMS TABLE ===================== */}
        {activeTab === 'FARMS' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">Premises Name</th>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Facility Type</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Coordinates</th>
                <th className="py-2.5 px-3">Capacity</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredFarms
                .filter(
                  (f) =>
                    !tableSearch ||
                    f.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
                    f.code.toLowerCase().includes(tableSearch.toLowerCase())
                )
                .map((farm) => (
                  <tr
                    key={farm.id}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                    onClick={() => {
                      if (farm.latitude && farm.longitude) {
                        flyTo([farm.latitude, farm.longitude], 14);
                      }
                      setSelectedEntity({ type: 'FARM', id: farm.id, data: farm });
                    }}
                  >
                    <td className="py-2.5 px-3 font-bold text-stone-900 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                      <span className="truncate max-w-[200px]">{farm.name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600">{farm.code}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-800">
                        {farm.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{farm.region}</td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-stone-400">
                      {farm.latitude ? `${farm.latitude.toFixed(3)}, ${farm.longitude.toFixed(3)}` : 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-800">
                      {farm.headCount ?? farm.capacity ?? 120} head
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (farm.latitude && farm.longitude) {
                            flyTo([farm.latitude, farm.longitude], 15);
                          }
                          setSelectedEntity({ type: 'FARM', id: farm.id, data: farm });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold text-[11px] transition-colors"
                      >
                        <Compass className="w-3 h-3 text-emerald-700" />
                        <span>Locate</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* ===================== ANIMALS TABLE ===================== */}
        {activeTab === 'ANIMALS' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">Tag / Identifier</th>
                <th className="py-2.5 px-3">Animal Name</th>
                <th className="py-2.5 px-3">Breed & Sex</th>
                <th className="py-2.5 px-3">Location Confidence</th>
                <th className="py-2.5 px-3">Assigned Farm</th>
                <th className="py-2.5 px-3">Health Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredAnimalLocations
                .filter(
                  (a) =>
                    !tableSearch ||
                    a.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
                    a.primaryIdentifier.toLowerCase().includes(tableSearch.toLowerCase())
                )
                .map((animal) => (
                  <tr
                    key={animal.animalId}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                    onClick={() => {
                      flyTo(animal.coordinates, 15);
                      setSelectedEntity({ type: 'ANIMAL', id: animal.animalId, data: animal });
                    }}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                      {animal.primaryIdentifier}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{animal.name}</td>
                    <td className="py-2.5 px-3 text-stone-600">
                      {animal.breed} ({animal.sex})
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          animal.locationConfidence === 'SENSOR_GPS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : animal.locationConfidence === 'FARM_PADDOCK_LOCATION'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {animal.locationConfidence === 'SENSOR_GPS' ? (
                          <Radio className="w-2.5 h-2.5 animate-pulse" />
                        ) : (
                          <MapPin className="w-2.5 h-2.5" />
                        )}
                        {animal.locationConfidence.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-700 font-medium">
                      {animal.farmName}
                      {animal.farmAreaName && (
                        <span className="block text-[10px] text-stone-400">
                          {animal.farmAreaName}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          animal.healthStatus === 'NORMAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {animal.healthStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          flyTo(animal.coordinates, 16);
                          setSelectedEntity({ type: 'ANIMAL', id: animal.animalId, data: animal });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold text-[11px] transition-colors"
                      >
                        <Compass className="w-3 h-3 text-emerald-700" />
                        <span>Follow</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* ===================== MOVEMENTS TABLE ===================== */}
        {activeTab === 'MOVEMENTS' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">Movement Ref</th>
                <th className="py-2.5 px-3">Origin Farm</th>
                <th className="py-2.5 px-3">Destination Farm</th>
                <th className="py-2.5 px-3">Volume Head</th>
                <th className="py-2.5 px-3">Carrier / Vehicle</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredMovementVectors.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                  onClick={() => {
                    flyTo(m.fromCoordinates, 11);
                    setSelectedEntity({ type: 'MOVEMENT', id: m.id, data: m });
                  }}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                    {m.referenceNumber}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-900">{m.fromFarmName}</td>
                  <td className="py-2.5 px-3 font-semibold text-blue-900">{m.toFarmName}</td>
                  <td className="py-2.5 px-3 font-bold text-stone-800">{m.volumeHead} head</td>
                  <td className="py-2.5 px-3 text-stone-600">
                    {m.carrierName} ({m.vehicleRegistration})
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        flyTo(m.fromCoordinates, 11);
                        setSelectedEntity({ type: 'MOVEMENT', id: m.id, data: m });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold text-[11px] transition-colors"
                    >
                      <Compass className="w-3 h-3 text-emerald-700" />
                      <span>Track</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ===================== HEALTH ALERTS TABLE ===================== */}
        {activeTab === 'HEALTH' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">Case Number</th>
                <th className="py-2.5 px-3">Disease Diagnosed</th>
                <th className="py-2.5 px-3">Premises</th>
                <th className="py-2.5 px-3">Affected Head</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Quarantine</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDiseaseEvents.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-red-50/40 cursor-pointer transition-colors"
                  onClick={() => {
                    flyTo(d.coordinates, 12);
                    setSelectedEntity({ type: 'DISEASE_EVENT', id: d.id, data: d });
                  }}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">{d.caseNumber}</td>
                  <td className="py-2.5 px-3 font-bold text-red-950">{d.diseaseName}</td>
                  <td className="py-2.5 px-3 font-medium text-stone-800">{d.farmName}</td>
                  <td className="py-2.5 px-3 font-bold text-red-700">
                    {d.affectedCount} ({d.deathsCount} dead)
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                      {d.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {d.quarantineActive ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                        ACTIVE LOCKDOWN
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-600">
                        MONITORING
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        flyTo(d.coordinates, 13);
                        setSelectedEntity({ type: 'DISEASE_EVENT', id: d.id, data: d });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-semibold text-[11px] transition-colors"
                    >
                      <Compass className="w-3 h-3 text-red-700" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ===================== MARKETPLACE TABLE ===================== */}
        {activeTab === 'MARKET' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">Trade Title</th>
                <th className="py-2.5 px-3">Lot Category</th>
                <th className="py-2.5 px-3">Breed</th>
                <th className="py-2.5 px-3">Origin Facility</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">DNA Verified</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredMarketplaceListings.map((l) => (
                <tr
                  key={l.id}
                  className="hover:bg-purple-50/40 cursor-pointer transition-colors"
                  onClick={() => {
                    flyTo(l.coordinates, 13);
                    setSelectedEntity({ type: 'MARKETPLACE', id: l.id, data: l });
                  }}
                >
                  <td className="py-2.5 px-3 font-bold text-stone-900">{l.title}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      {l.listingType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-stone-700">{l.breed}</td>
                  <td className="py-2.5 px-3 text-stone-600">
                    {l.farmName}, {l.region}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-800">
                    {l.currency} {l.price.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    {l.dnaVerified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <Dna className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400">Pedigree</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        flyTo(l.coordinates, 13);
                        setSelectedEntity({ type: 'MARKETPLACE', id: l.id, data: l });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold text-[11px] transition-colors"
                    >
                      <Compass className="w-3 h-3 text-purple-700" />
                      <span>Locate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
