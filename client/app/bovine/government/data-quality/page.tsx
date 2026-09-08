'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Layers,
  Search,
  Filter,
  Check,
  Download,
  Building2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { DataQualityIssue } from '@/lib/bovine-government-types';

export default function CrossFarmDataQualityPage() {
  const {
    dataQualityIssues,
    crossFarmQualityScores,
    resolveDataQualityIssue,
    openMetricDefinitionDrawer,
  } = useGovernment();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredIssues = dataQualityIssues.filter((issue: DataQualityIssue) => {
    if (severityFilter !== 'ALL' && issue.severity !== severityFilter) return false;
    return true;
  });

  const openIssues = dataQualityIssues.filter((i: DataQualityIssue) => i.status === 'OPEN');
  const critIssues = dataQualityIssues.filter((i: DataQualityIssue) => i.severity === 'CRITICAL' && i.status === 'OPEN');

  const issueColumns = [
    {
      key: 'id',
      header: 'Anomaly ID',
      sortable: true,
      render: (row: DataQualityIssue) => (
        <div>
          <span className="font-mono font-bold text-stone-900 text-xs">{row.id}</span>
          <div className="text-[10px] text-stone-500 font-mono">Date: {row.detectedAt}</div>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (row: DataQualityIssue) => (
        <span
          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
            row.severity === 'CRITICAL'
              ? 'bg-rose-100 text-rose-900 border border-rose-300'
              : row.severity === 'WARNING'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-stone-100 text-stone-800'
          }`}
        >
          {row.severity}
        </span>
      ),
    },
    {
      key: 'farmName',
      header: 'Farm Entity & Subject',
      sortable: true,
      render: (row: DataQualityIssue) => (
        <div>
          <div className="font-semibold text-stone-900 text-xs">{row.farmName}</div>
          <div className="text-[10px] text-stone-600">
            {row.affectedEntityType}: <strong className="font-mono text-stone-800">{row.affectedEntityLabel}</strong>
          </div>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Anomaly Domain & Description',
      sortable: true,
      render: (row: DataQualityIssue) => (
        <div>
          <div className="font-bold text-stone-900 text-xs">
            [{row.category}] {row.title}
          </div>
          <p className="text-[11px] text-stone-600 mt-0.5">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Resolution',
      sortable: true,
      align: 'center' as const,
      render: (row: DataQualityIssue) => (
        <div className="text-center">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              row.status === 'OPEN'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {row.status}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: DataQualityIssue) => (
        <div className="flex items-center justify-end">
          {row.status === 'OPEN' ? (
            <button
              onClick={() => resolveDataQualityIssue(row.id)}
              className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Resolve</span>
            </button>
          ) : (
            <span className="text-xs text-stone-500 font-mono">Resolved</span>
          )}
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
              DATA GOVERNANCE
            </span>
            <span className="text-xs text-stone-600">Cross-Farm Master Integrity Pipeline</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Cross-Farm Data Quality & Anomaly Queues
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Automated detection of duplicate RFIDs, Mendelian parentage conflicts, impossible birth dates, and missing vital records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Anomaly</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Informational</option>
          </select>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="DQ-COMPLETENESS"
          label="National Data Completeness"
          value="96.4%"
          trend="UP"
          delta="+1.2%"
          domain="INTEGRITY"
          target="> 95%"
          coveragePct={96.4}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="DQ-OPEN-ANOMALIES"
          label="Unresolved Data Anomalies"
          value={openIssues.length}
          unit="issues"
          trend="DOWN"
          delta="-4 resolved"
          domain="PIPELINE"
          status={critIssues.length > 0 ? 'WARNING' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="DQ-DUPLICATE-RFID"
          label="Duplicate RFID Tag Clashes"
          value="1"
          unit="clashes"
          trend="STABLE"
          delta="Quarantine isolation active"
          domain="IDENTIFICATION"
          status="WARNING"
        />

        <InstitutionalStatCard
          metricCode="DQ-MENDELIAN-ERRORS"
          label="Mendelian Lineage Discrepancies"
          value="0.04%"
          trend="DOWN"
          delta="Low error rate"
          domain="GENETICS"
          target="< 0.1%"
          status="NORMAL"
        />
      </div>

      {/* Cross-Farm Data Completeness Breakdown */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm">
          National Data Completeness by Functional Domain
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          {[
            { name: 'Identification & RFID', pct: 99.8, status: 'HIGH', note: 'Near universal tagging' },
            { name: 'Pedigree & Lineage', pct: 92.4, status: 'HIGH', note: 'Sire/Dam verified' },
            { name: 'Vaccination History', pct: 95.1, status: 'HIGH', note: 'Mandatory protocols' },
            { name: 'Growth & Body Weights', pct: 88.6, status: 'MODERATE', note: 'Monthly scale logs' },
            { name: '50K SNP Genotyping', pct: 38.6, status: 'GROWING', note: 'Seedstock campaign' },
          ].map((d) => (
            <div key={d.name} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-stone-500">{d.name}</span>
              <div className="text-xl font-bold font-mono text-stone-900">{d.pct}%</div>
              <p className="text-[10px] text-stone-500">{d.note}</p>
              <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${d.pct >= 90 ? 'bg-emerald-600' : d.pct >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${d.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Queue Table */}
      <div>
        <GovernmentDataTable
          title="Data Integrity Exceptions & Anomaly Queue"
          subtitle="Systematic audit exceptions requiring field investigator or registrar reconciliation."
          columns={issueColumns}
          data={filteredIssues}
          searchPlaceholder="Filter anomaly queue by ID, farm, title..."
          searchFields={['id', 'farmName', 'title', 'category', 'description', 'affectedEntityLabel']}
        />
      </div>
    </div>
  );
}
