'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Building2,
  Users,
  MapPin,
  Layers,
  ArrowRight,
  Shield,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export default function BovineOrganizationsPage() {
  const { organizations, farms, animals, herds } = useBovine();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Enterprise Hierarchy & Tenancy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Organizations & Agricultural Facilities
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Multi-facility management, biosecurity zones, farm stations, and herd groups
          </p>
        </div>
      </div>

      {/* Organizations List */}
      <div className="space-y-6">
        {organizations.map((org) => {
          const orgFarms = farms.filter((f) => f.organizationId === org.id);
          const totalAnimals = animals.filter((a) => a.ownerOrganizationId === org.id).length;

          return (
            <div
              key={org.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">{org.name}</h2>
                    <div className="text-xs text-stone-500 mt-0.5 flex items-center space-x-2">
                      <span>Code: {org.code}</span>
                      <span>•</span>
                      <span>Primary Contact: {org.contactEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 font-semibold">
                    {orgFarms.length} Active Farm Stations
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 font-bold border border-emerald-200">
                    {totalAnimals} Registered Cattle
                  </div>
                </div>
              </div>

              {/* Farms Grid under this Org */}
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  Operating Facilities & Research Stations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orgFarms.map((farm) => {
                    const farmCattle = animals.filter((a) => a.farmId === farm.id);
                    const farmHerds = herds.filter((h) => h.farmId === farm.id);
                    const occupancyPct = farm.capacity && farm.capacity > 0
                      ? Math.round((farmCattle.length / farm.capacity) * 100)
                      : 0;

                    return (
                      <Link
                        key={farm.id}
                        href={`/bovine/farms/${farm.id}`}
                        className="group p-5 rounded-2xl bg-stone-50/70 hover:bg-white border border-stone-200/80 hover:border-emerald-700/50 hover:shadow-md transition-all text-xs space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-[11px] text-emerald-800 font-bold">
                              {farm.code}
                            </span>
                            <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                              {farm.name}
                            </h4>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-bold uppercase text-[9px]">
                            {farm.type.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="text-stone-500 flex items-center space-x-1 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                          <span>
                            {farm.city}, {farm.region} ({farm.country})
                          </span>
                        </div>

                        {/* Capacity gauge */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-stone-500">Facility Capacity</span>
                            <span className="font-bold text-stone-900">
                              {farmCattle.length} / {farm.capacity} ({occupancyPct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                            <div
                              className="h-full bg-emerald-700 rounded-full"
                              style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                          <span>{farmHerds.length} Herd Groups</span>
                          <span className="text-emerald-800 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                            Open Farm &rarr;
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
