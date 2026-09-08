'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Download,
  Filter,
  Layers,
  Building2,
  Check,
  Plus,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { CrossFarmComplianceMatrix } from '@/components/bovine/government/tables/CrossFarmComplianceMatrix';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { ComplianceAudit, ComplianceFinding, CorrectiveAction } from '@/lib/bovine-government-types';

export default function ComplianceAuditsPage() {
  const {
    complianceAudits,
    complianceFindings,
    correctiveActions,
    reviewCorrectiveAction,
    openMetricDefinitionDrawer,
  } = useGovernment();

  const [auditTab, setAuditTab] = useState<'AUDITS' | 'FINDINGS' | 'CAPA'>('AUDITS');

  const critFindings = complianceFindings.filter((f: ComplianceFinding) => f.severity === 'CRITICAL' && f.status === 'OPEN');
  const openCapas = correctiveActions.filter((c: CorrectiveAction) => c.outcome === 'PENDING');

  const auditColumns = [
    {
      key: 'code',
      header: 'Audit ID',
      sortable: true,
      render: (row: ComplianceAudit) => (
        <div>
          <span className="font-mono font-bold text-stone-900 text-xs">{row.code}</span>
          <div className="text-[10px] text-stone-500 font-mono">Date: {row.openedAt}</div>
        </div>
      ),
    },
    {
      key: 'farmName',
      header: 'Audited Farm Facility',
      sortable: true,
      render: (row: ComplianceAudit) => (
        <div>
          <div className="font-semibold text-stone-900 text-xs">{row.farmName}</div>
          <div className="text-[10px] text-stone-500">Auditor: {row.auditorName}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Audit Scope',
      sortable: true,
      render: (row: ComplianceAudit) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-stone-100 text-stone-800">
          {row.type}
        </span>
      ),
    },
    {
      key: 'scorePct',
      header: 'Statutory Score',
      sortable: true,
      align: 'right' as const,
      render: (row: ComplianceAudit) => (
        <div className="text-right">
          <span className="font-mono font-bold text-stone-900 text-xs">
            {row.scorePct}%
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Audit Status',
      sortable: true,
      align: 'center' as const,
      render: (row: ComplianceAudit) => (
        <div className="text-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              row.status === 'COMPLETED'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : row.status === 'IN_PROGRESS'
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {row.status}
          </span>
        </div>
      ),
    },
  ];

  const capaColumns = [
    {
      key: 'id',
      header: 'CAPA Directive ID',
      sortable: true,
      render: (row: CorrectiveAction) => (
        <div>
          <span className="font-mono font-bold text-stone-900 text-xs">{row.id}</span>
          <div className="text-[10px] text-stone-500 font-mono">Issued: {row.issuedAt}</div>
        </div>
      ),
    },
    {
      key: 'farmName',
      header: 'Target Operation',
      sortable: true,
      render: (row: CorrectiveAction) => (
        <div>
          <div className="font-semibold text-stone-900 text-xs">{row.farmName}</div>
          <div className="text-[10px] text-stone-500">Official: {row.issuedBy}</div>
        </div>
      ),
    },
    {
      key: 'actionRequired',
      header: 'Remediation Directive',
      render: (row: CorrectiveAction) => (
        <div className="text-xs text-stone-800 leading-snug">{row.actionRequired}</div>
      ),
    },
    {
      key: 'responseDeadline',
      header: 'Mandatory Deadline',
      sortable: true,
      render: (row: CorrectiveAction) => (
        <span className="font-mono font-semibold text-stone-800 text-xs">{row.responseDeadline}</span>
      ),
    },
    {
      key: 'outcome',
      header: 'CAPA Determination',
      sortable: true,
      align: 'center' as const,
      render: (row: CorrectiveAction) => (
        <div className="text-center">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              row.outcome === 'ACCEPTED' || row.outcome === 'RESOLVED'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : row.outcome === 'PENDING'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {row.outcome}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Statutory Verification',
      align: 'right' as const,
      render: (row: CorrectiveAction) => (
        <div className="flex items-center justify-end space-x-1.5">
          {row.outcome === 'PENDING' ? (
            <button
              onClick={() => reviewCorrectiveAction(row.id, 'ACCEPTED', 'Verified on-site by CVO')}
              className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Verify CAPA</span>
            </button>
          ) : (
            <span className="text-xs text-stone-500 font-mono">Signed Off</span>
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
              REGULATORY INTEGRITY
            </span>
            <span className="text-xs text-stone-600">Standard: National Veterinary Inspection Guidelines</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Regulatory Compliance, Audits & Corrective Action Directives
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Cross-farm statutory audit scorecards, non-conformance findings, and legal corrective action plan (CAPA) tracking.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Dossier</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="COMPLIANCE_PASS_RATE"
          label="Composite Audit Pass Rate"
          value="89.1%"
          trend="UP"
          delta="+3.1%"
          domain="AUDIT_SCORE"
          target="90.0%"
          coveragePct={91.0}
          status="WATCH"
        />

        <InstitutionalStatCard
          metricCode="COMP-CRIT-FINDINGS"
          label="Open Critical Non-Conformances"
          value={critFindings.length}
          unit="findings"
          trend={critFindings.length > 0 ? 'UP' : 'STABLE'}
          delta={critFindings.length > 0 ? 'Mandatory CAPA' : 'Zero'}
          domain="FINDINGS"
          status={critFindings.length > 0 ? 'CRITICAL' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="COMP-CAPA-DIRECTIVES"
          label="Active CAPA Directives"
          value={openCapas.length}
          unit="directives"
          trend="DOWN"
          delta="-2 verified"
          domain="REMEDIATION"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="COMP-AUDIT-CYCLE"
          label="Annual Farm Inspection Coverage"
          value="96.2%"
          trend="UP"
          delta="+4.8%"
          domain="COVERAGE"
          target="100%"
          coveragePct={96.2}
          status="NORMAL"
        />
      </div>

      {/* 6-Pillar Compliance Matrix */}
      <div>
        <CrossFarmComplianceMatrix />
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-stone-200 text-xs">
        <button
          onClick={() => setAuditTab('AUDITS')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            auditTab === 'AUDITS'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Statutory Audits Log ({complianceAudits.length})
        </button>
        <button
          onClick={() => setAuditTab('CAPA')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            auditTab === 'CAPA'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Corrective Action Plans / CAPA ({correctiveActions.length})
        </button>
      </div>

      {/* Tab Content Table */}
      {auditTab === 'AUDITS' ? (
        <GovernmentDataTable
          title="Scheduled & Completed Statutory Audits"
          subtitle="Annual inspections executed under the Animal Health and Traceability Proclamation."
          columns={auditColumns}
          data={complianceAudits}
          searchPlaceholder="Filter audits by code, farm, auditor..."
          searchFields={['code', 'farmName', 'auditorName', 'type', 'status']}
        />
      ) : (
        <GovernmentDataTable
          title="Mandatory Corrective Action Directives (CAPA)"
          subtitle="Statutory remediation orders served on non-compliant farm entities with verification workflow."
          columns={capaColumns}
          data={correctiveActions}
          searchPlaceholder="Filter CAPAs by ID, farm, directive..."
          searchFields={['id', 'farmName', 'actionRequired', 'outcome']}
        />
      )}
    </div>
  );
}
