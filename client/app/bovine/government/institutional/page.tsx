'use client';

import React, { useState } from 'react';
import {
  Network,
  Users2,
  Building2,
  ShieldCheck,
  UserCheck,
  Mail,
  MapPin,
  Download,
  Calendar,
  Layers,
  Filter,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentNetworkWorkspace } from '@/components/bovine/government/networks/GovernmentNetworkWorkspace';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { GovernmentOfficial, OfficialAssignment } from '@/lib/bovine-government-types';

export default function InstitutionalHierarchyPage() {
  const { officials, assignments, jurisdictions } = useGovernment();

  const [activeTab, setActiveTab] = useState<'OFFICIALS' | 'ASSIGNMENTS'>('OFFICIALS');

  const officialColumns = [
    {
      key: 'name',
      header: 'Veterinary Official & Badge',
      sortable: true,
      render: (row: GovernmentOfficial) => (
        <div>
          <div className="font-bold text-stone-900 text-xs flex items-center space-x-1.5">
            <span>{row.name}</span>
            {row.activeAssignmentsCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </div>
          <div className="text-[10px] text-stone-500 font-mono">
            Office: {row.officeName} • ID: {row.id}
          </div>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Official Title & Post',
      sortable: true,
      render: (row: GovernmentOfficial) => (
        <div>
          <div className="font-semibold text-stone-800 text-xs">{row.title}</div>
          <div className="text-[10px] text-stone-500">{row.officeName}</div>
        </div>
      ),
    },
    {
      key: 'jurisdictionName',
      header: 'Assigned Jurisdiction Scope',
      sortable: true,
      render: (row: GovernmentOfficial) => (
        <span className="font-medium text-stone-800 text-xs">
          {row.jurisdictionName}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Institutional Role',
      sortable: true,
      render: (row: GovernmentOfficial) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-stone-100 text-stone-800">
          {row.role}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Contact Credentials',
      render: (row: GovernmentOfficial) => (
        <div className="text-xs text-stone-700">
          <div>{row.email}</div>
          <div className="text-[10px] text-stone-500 font-mono">{row.phone}</div>
        </div>
      ),
    },
    {
      key: 'activeAssignmentsCount',
      header: 'Credential Status',
      sortable: true,
      align: 'center' as const,
      render: (row: GovernmentOfficial) => (
        <div className="text-center">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            ACCREDITED
          </span>
        </div>
      ),
    },
  ];

  const assignmentColumns = [
    {
      key: 'officialName',
      header: 'Assigned Official',
      sortable: true,
      render: (row: OfficialAssignment) => (
        <div className="font-bold text-stone-900 text-xs">{row.officialName}</div>
      ),
    },
    {
      key: 'targetName',
      header: 'Territorial Post / Facility Target',
      sortable: true,
      render: (row: OfficialAssignment) => (
        <div>
          <div className="font-semibold text-stone-900 text-xs">{row.targetName}</div>
          <div className="text-[10px] text-stone-500 font-mono">Target Type: {row.targetType}</div>
        </div>
      ),
    },
    {
      key: 'assignedRole',
      header: 'Statutory Delegation Role',
      sortable: true,
      render: (row: OfficialAssignment) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
          {row.assignedRole}
        </span>
      ),
    },
    {
      key: 'effectiveFrom',
      header: 'Tenure / Effective Dates',
      sortable: true,
      render: (row: OfficialAssignment) => (
        <div className="text-xs text-stone-800">
          <div>From: <strong className="font-mono">{row.effectiveFrom}</strong></div>
          <div className="text-[10px] text-stone-500 font-mono">To: {row.effectiveTo || 'Indefinite'}</div>
        </div>
      ),
    },
    {
      key: 'active',
      header: 'Delegation Status',
      sortable: true,
      align: 'center' as const,
      render: (row: OfficialAssignment) => (
        <div className="text-center">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            ACTIVE DELEGATION
          </span>
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
            <span className="px-2 py-0.5 rounded-md bg-stone-900 text-white font-mono font-bold text-[10px]">
              INSTITUTIONAL DIRECTORY
            </span>
            <span className="text-xs text-stone-600">Ministry of Agriculture Veterinary Services</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Institutional Hierarchy & Veterinary Authority Directory
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Statutory organizational hierarchy, designated Chief Veterinary Officers, and active jurisdictional assignments.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Authority Roster</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="INST-OFFICIALS-COUNT"
          label="Accredited Veterinary Officials"
          value={officials.length}
          unit="officials"
          trend="UP"
          delta="+2 certified"
          domain="PERSONNEL"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="INST-ASSIGNMENTS"
          label="Active Territorial Delegations"
          value={assignments.length}
          unit="posts"
          trend="STABLE"
          delta="100% post coverage"
          domain="GOVERNANCE"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="INST-JURISDICTIONS"
          label="Statutory Jurisdictions"
          value={jurisdictions.length}
          unit="levels"
          trend="STABLE"
          delta="Federal to district"
          domain="ADMINISTRATION"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="INST-ACCREDITATION"
          label="National Accreditation Compliance"
          value="100%"
          trend="STABLE"
          delta="WOAH standards met"
          domain="CREDENTIALS"
          status="NORMAL"
        />
      </div>

      {/* Interactive Institutional Hierarchy Tree Graph */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Topological Administrative Authority Tree
          </h2>
          <span className="text-[11px] text-stone-600">
            Federal Ministry → Regional Agricultural Bureaus → Zonal &amp; District Veterinary Posts
          </span>
        </div>
        <GovernmentNetworkWorkspace initialMode="HIERARCHY" height="420px" />
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 text-xs">
        <button
          onClick={() => setActiveTab('OFFICIALS')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'OFFICIALS'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Accredited Officials Directory ({officials.length})
        </button>
        <button
          onClick={() => setActiveTab('ASSIGNMENTS')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'ASSIGNMENTS'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Territorial Delegations &amp; Posts ({assignments.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'OFFICIALS' ? (
        <GovernmentDataTable
          title="Ministry of Agriculture Official Directory"
          subtitle="Roster of authorized state veterinarians, geneticists, compliance inspectors, and registrars."
          columns={officialColumns}
          data={officials}
          searchPlaceholder="Search officials by name, title, badge, agency..."
          searchFields={['name', 'title', 'badgeNumber', 'agency', 'jurisdictionName', 'role']}
        />
      ) : (
        <GovernmentDataTable
          title="Official Territorial Delegations"
          subtitle="Statutory delegation orders assigning veterinary officers to regional states and nucleus facilities."
          columns={assignmentColumns}
          data={assignments}
          searchPlaceholder="Filter assignments by official, target, role..."
          searchFields={['officialName', 'targetName', 'assignedRole']}
        />
      )}
    </div>
  );
}
