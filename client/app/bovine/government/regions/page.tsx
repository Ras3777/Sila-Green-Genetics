'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe2,
  Building2,
  Users2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Download,
  Search,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { Jurisdiction } from '@/lib/bovine-government-types';

export default function RegionalAuthoritiesPage() {
  const { jurisdictions, selectJurisdiction, selectedJurisdictionId } = useGovernment();

  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  const filtered = jurisdictions.filter((j) => {
    if (levelFilter !== 'ALL' && j.level !== levelFilter) return false;
    return true;
  });

  const columns = [
    {
      key: 'name',
      header: 'Jurisdiction Name',
      sortable: true,
      render: (row: Jurisdiction) => (
        <div>
          <div className="font-bold text-stone-900 flex items-center space-x-1.5">
            <span>{row.name}</span>
            {row.id === selectedJurisdictionId && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                ACTIVE SCOPE
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-600 font-mono">
            Code: {row.code} • HQ: {row.headquarters}
          </div>
        </div>
      ),
    },
    {
      key: 'level',
      header: 'Administrative Level',
      sortable: true,
      render: (row: Jurisdiction) => (
        <span
          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
            row.level === 'NATIONAL'
              ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
              : row.level === 'REGION'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              : 'bg-amber-100 text-amber-900 border border-amber-200'
          }`}
        >
          {row.level}
        </span>
      ),
    },
    {
      key: 'leadOfficialName',
      header: 'Lead Veterinary Official',
      sortable: true,
      render: (row: Jurisdiction) => (
        <div>
          <div className="font-medium text-stone-900 text-xs">{row.leadOfficialName}</div>
          <div className="text-[10px] text-stone-600">{row.contactEmail}</div>
        </div>
      ),
    },
    {
      key: 'reportingFarms',
      header: 'Participating Farms',
      sortable: true,
      align: 'right' as const,
      render: (row: Jurisdiction) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {row.reportingFarms} / {row.totalFarms}
        </span>
      ),
    },
    {
      key: 'registeredAnimals',
      header: 'Registered Cattle',
      sortable: true,
      align: 'right' as const,
      render: (row: Jurisdiction) => (
        <span className="font-mono font-bold text-emerald-900 text-xs">
          {row.registeredAnimals.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Surveillance Status',
      sortable: true,
      align: 'center' as const,
      render: (row: Jurisdiction) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            row.status === 'SPECIAL_SURVEILLANCE'
              ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
          }`}
        >
          {row.status === 'SPECIAL_SURVEILLANCE' ? 'SURVEILLANCE' : 'ACTIVE'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: Jurisdiction) => (
        <div className="flex items-center justify-end space-x-1.5">
          <button
            onClick={() => selectJurisdiction(row.id)}
            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold cursor-pointer"
            title="Set as active operational filter"
          >
            Select Scope
          </button>
          <Link
            href={`/bovine/government/regions/${row.id}`}
            className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
            title="View Regional Dossier"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
              TERRITORIAL REGISTRY
            </span>
            <span className="text-xs text-stone-600">Total Scopes: {jurisdictions.length}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Regional Authorities & Jurisdictional Directory
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Administrative registry of veterinary authorities, regional bureaus, and designated district offices.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 outline-none cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="NATIONAL">National Authority</option>
            <option value="REGION">Regional States</option>
            <option value="ZONE">Zonal Offices</option>
            <option value="DISTRICT">District Veterinary Posts</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="JUR-TOTAL"
          label="Active Jurisdictions"
          value={jurisdictions.length}
          unit="authorities"
          trend="STABLE"
          delta="100% accredited"
          domain="GOVERNANCE"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="JUR-REPORTING-FARMS"
          label="Supervised Farm Entities"
          value="48"
          unit="farms"
          trend="UP"
          delta="+6 added"
          domain="COVERAGE"
          target="50"
          coveragePct={96.0}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="JUR-SURVEILLANCE-AREAS"
          label="Special Surveillance Zones"
          value="1"
          unit="region"
          trend="STABLE"
          delta="Bishoftu zone active"
          domain="HEALTH"
          status="WARNING"
        />

        <InstitutionalStatCard
          metricCode="JUR-OFFICIALS"
          label="Accredited Veterinary Officers"
          value="14"
          unit="officials"
          trend="UP"
          delta="+2 certified"
          domain="PERSONNEL"
          status="NORMAL"
        />
      </div>

      {/* Jurisdictions Table */}
      <div>
        <GovernmentDataTable
          title="Jurisdictional Directory & Authority Registry"
          subtitle="Directory of federal ministries, regional agriculture bureaus, and district veterinary surveillance posts."
          columns={columns}
          data={filtered}
          searchPlaceholder="Search jurisdictions, lead officials, HQ..."
          searchFields={['name', 'code', 'headquarters', 'leadOfficialName', 'contactEmail']}
        />
      </div>
    </div>
  );
}
