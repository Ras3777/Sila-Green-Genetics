'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Filter,
  Layers,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';
import { Farm } from '@/lib/bovine-types';
import { ComplianceFinding } from '@/lib/bovine-government-types';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { CrossFarmComplianceMatrix } from '@/components/bovine/government/tables/CrossFarmComplianceMatrix';

export default function FarmOversightPage() {
  const { complianceFindings, complianceAudits } = useGovernment();
  const { farms, herds } = useBovine();

  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  // Augment farms with explainable risk scores
  const augmentedFarms = farms.map((farm: Farm) => {
    const findings = complianceFindings.filter((f: ComplianceFinding) => f.farmId === farm.id && f.status === 'OPEN');
    const critCount = findings.filter((f: ComplianceFinding) => f.severity === 'CRITICAL').length;
    const majorCount = findings.filter((f: ComplianceFinding) => f.severity === 'MAJOR').length;

    const riskScore = Math.min(100, critCount * 30 + majorCount * 15 + (farm.code === 'FARM-ET-003' ? 25 : 5));
    const riskTier: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' =
      riskScore >= 40 ? 'HIGH_RISK' : riskScore >= 20 ? 'MEDIUM_RISK' : 'LOW_RISK';

    const farmHerds = herds.filter((h) => h.farmId === farm.id);

    return {
      ...farm,
      riskScore,
      riskTier,
      critCount,
      majorCount,
      herdCount: farmHerds.length || 1,
      isQuarantined: farm.code === 'FARM-ET-003',
    };
  });

  const filtered = augmentedFarms.filter((f) => {
    if (riskFilter !== 'ALL' && f.riskTier !== riskFilter) return false;
    return true;
  });

  const highRiskCount = augmentedFarms.filter((f) => f.riskTier === 'HIGH_RISK').length;
  const quarantinedCount = augmentedFarms.filter((f) => f.isQuarantined).length;

  const columns = [
    {
      key: 'name',
      header: 'Farm Entity & Code',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-bold text-stone-900 flex items-center space-x-1.5">
            <span>{row.name}</span>
            {row.isQuarantined && (
              <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-bold uppercase animate-pulse">
                Q-ZONE
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-600 font-mono">
            Code: {row.code} • {row.region}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Facility Class',
      sortable: true,
      render: (row: any) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-stone-100 text-stone-800">
          {row.type || 'NUCLEUS'}
        </span>
      ),
    },
    {
      key: 'riskScore',
      header: 'Regulatory Risk Score',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="flex items-center space-x-1.5">
            <span
              className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                row.riskTier === 'HIGH_RISK'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : row.riskTier === 'MEDIUM_RISK'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {row.riskTier === 'HIGH_RISK' ? 'HIGH' : row.riskTier === 'MEDIUM_RISK' ? 'MED' : 'LOW'}
            </span>
            <span className="font-mono font-bold text-xs text-stone-800">{row.riskScore}</span>
          </div>
          {row.critCount > 0 && (
            <span className="text-[10px] text-rose-700 font-semibold block mt-0.5">
              +{row.critCount * 30} (Critical Non-Conformance)
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'herdCount',
      header: 'Herds Monitored',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {row.herdCount} herds
        </span>
      ),
    },
    {
      key: 'manager',
      header: 'Designated Operator',
      sortable: true,
      render: (row: any) => (
        <div className="text-xs text-stone-800 font-medium">
          {row.manager || 'Dr. Alemu Tadesse'}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: any) => (
        <Link
          href={`/bovine/government/farms/${row.id}`}
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors"
        >
          <span>Oversight Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
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
              FARM SURVEILLANCE
            </span>
            <span className="text-xs text-stone-600">Total Registered Operations: {farms.length}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            National Farm Oversight & Risk Scorecard Directory
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Surveillance of all certified breeding centers, bull studs, and commercial dairy operations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 outline-none cursor-pointer"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="LOW_RISK">Low Risk</option>
            <option value="MEDIUM_RISK">Medium Risk</option>
            <option value="HIGH_RISK">High Risk</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="FARM-SUPERVISED"
          label="Total Supervised Facilities"
          value={farms.length}
          unit="farms"
          trend="UP"
          delta="+4 accredited"
          domain="SURVEILLANCE"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="FARM-HIGH-RISK"
          label="High-Risk Operations"
          value={highRiskCount}
          unit="farms"
          trend={highRiskCount > 0 ? 'UP' : 'STABLE'}
          delta={highRiskCount > 0 ? 'Audit required' : 'Zero'}
          domain="COMPLIANCE"
          status={highRiskCount > 0 ? 'WARNING' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="FARM-QUARANTINES"
          label="Active Quarantine Orders"
          value={quarantinedCount}
          unit="farms"
          trend={quarantinedCount > 0 ? 'UP' : 'STABLE'}
          delta="Cordon active"
          domain="BIOSECURITY"
          status={quarantinedCount > 0 ? 'CRITICAL' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="FARM-AUDIT-COMPLIANCE"
          label="Annual Audit Compliance"
          value="91.4%"
          trend="UP"
          delta="+2.8%"
          domain="GOVERNANCE"
          target="95.0%"
          coveragePct={91.4}
          status="NORMAL"
        />
      </div>

      {/* 6-Pillar Matrix */}
      <div>
        <CrossFarmComplianceMatrix />
      </div>

      {/* Farm Directory Table */}
      <div>
        <GovernmentDataTable
          title="Participating Farm Operations Directory"
          subtitle="Complete registry of farm entities with regulatory risk scores, facility tiers, and inspection status."
          columns={columns}
          data={filtered}
          searchPlaceholder="Search farm name, code, manager, region..."
          searchFields={['name', 'code', 'manager', 'region', 'location']}
        />
      </div>
    </div>
  );
}
