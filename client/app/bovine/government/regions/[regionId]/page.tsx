'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  Globe2,
  Building2,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Mail,
  MapPin,
  Users2,
  Calendar,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';

export default function RegionalDossierPage({
  params,
}: {
  params: Promise<{ regionId: string }>;
}) {
  const resolvedParams = use(params);
  const { jurisdictions, diseaseEvents, selectJurisdiction } = useGovernment();
  const { farms } = useBovine();

  const region = jurisdictions.find(
    (j) => j.id === resolvedParams.regionId || j.code.toLowerCase() === resolvedParams.regionId.toLowerCase()
  ) || jurisdictions[1]; // fallback to Oromia

  const regionFarms = farms.filter((f) => f.region?.toLowerCase().includes(region.name.toLowerCase()));
  const regionDiseaseEvents = diseaseEvents.filter(
    (d) => d.regionId === region.id || d.regionName.toLowerCase().includes(region.name.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center space-x-2 text-xs">
          <Link
            href="/bovine/government/regions"
            className="text-stone-600 hover:text-stone-900 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Regional Authorities</span>
          </Link>
          <span className="text-stone-400">/</span>
          <span className="font-bold text-stone-900">{region.name}</span>
        </div>

        <button
          onClick={() => selectJurisdiction(region.id)}
          className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
        >
          Set Active Filter to {region.name}
        </button>
      </div>

      {/* Regional Dossier Header Card */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
              {region.level} AUTHORITY
            </span>
            <span className="font-mono text-stone-600 text-xs">Code: {region.code}</span>
            {region.status === 'SPECIAL_SURVEILLANCE' && (
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-mono font-bold text-[10px] animate-pulse">
                UNDER SURVEILLANCE
              </span>
            )}
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            {region.name} Livestock Regulatory Authority
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-2">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-stone-500" />
              HQ: <strong className="text-stone-800 ml-1">{region.headquarters}</strong>
            </span>
            <span className="flex items-center">
              <Users2 className="w-3.5 h-3.5 mr-1 text-stone-500" />
              Lead Official: <strong className="text-stone-800 ml-1">{region.leadOfficialName}</strong>
            </span>
            <span className="flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1 text-stone-500" />
              <strong className="text-stone-800">{region.contactEmail}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Statistical Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="REG-ANIMALS"
          label="Registered Livestock"
          value={region.registeredAnimals.toLocaleString()}
          unit="head"
          trend="UP"
          delta="+3.8%"
          domain="CENSUS"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="REG-BREEDING-STOCK"
          label="Active Elite Breeding Stock"
          value={region.activeBreedingStock.toLocaleString()}
          unit="head"
          trend="UP"
          delta="+5.2%"
          domain="GENETICS"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="REG-FARMS-COUNT"
          label="Reporting Operations"
          value={`${region.reportingFarms} / ${region.totalFarms}`}
          unit="farms"
          trend="STABLE"
          delta="100% submission rate"
          domain="COMPLIANCE"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="REG-DISEASE-EVENTS"
          label="Active Disease Alerts"
          value={regionDiseaseEvents.length}
          unit="events"
          trend={regionDiseaseEvents.length > 0 ? 'UP' : 'STABLE'}
          delta={regionDiseaseEvents.length > 0 ? 'Surveillance active' : 'Zero cases'}
          domain="HEALTH"
          status={regionDiseaseEvents.length > 0 ? 'WARNING' : 'NORMAL'}
        />
      </div>

      {/* Supervised Farms in Region */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 mb-2">
          Participating Farm Operations in {region.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {regionFarms.length > 0 ? (
            regionFarms.map((f) => (
              <Link
                key={f.id}
                href={`/bovine/government/farms/${f.id}`}
                className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-stone-500 font-bold">{f.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                      {f.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-800 transition-colors">
                    {f.name}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Location: {f.address || f.district || f.region}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <span>Manager: {(f as any).manager || 'Dr. Alemu Tadesse'}</span>
                  <span className="text-emerald-800 font-semibold group-hover:underline">Inspect Profile →</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 p-6 text-center text-stone-600 bg-white rounded-2xl border border-stone-200">
              No registered farm records found explicitly matching region filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
