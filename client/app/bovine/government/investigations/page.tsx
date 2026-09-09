'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  SearchCheck,
  ShieldAlert,
  AlertTriangle,
  Plus,
  ArrowRight,
  Download,
  Calendar,
  Layers,
  X,
  FileCheck2,
  Users2,
  Clock,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentNetworkWorkspace } from '@/components/bovine/government/networks/GovernmentNetworkWorkspace';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { InvestigationCase, InvestigationType } from '@/lib/bovine-government-types';

export default function RegulatoryInvestigationsPage() {
  const { investigations, addInvestigation } = useGovernment();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  // New case form state
  const [caseTitle, setCaseTitle] = useState('');
  const [caseType, setCaseType] = useState<InvestigationType>('PEDIGREE_CONFLICT');
  const [caseSeverity, setCaseSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');
  const [caseSummary, setCaseSummary] = useState('');

  const filteredCases = investigations.filter((c: InvestigationCase) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    return true;
  });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle) return;

    addInvestigation({
      title: caseTitle,
      caseType,
      severity: caseSeverity,
      priority: caseSeverity === 'CRITICAL' ? 'P1' : 'P2',
      leadInvestigatorName: 'Dr. Birhanu Kebede (CVO)',
      leadInvestigatorId: 'off-001',
      jurisdictionId: 'jur-tigray',
      jurisdictionName: 'Tigray Regional Livestock Agency',
      status: 'OPEN',
      summary: caseSummary || caseTitle,
      evidenceItems: [],
    });

    setIsNewCaseModalOpen(false);
    setCaseTitle('');
    setCaseSummary('');
  };

  const openCasesCount = investigations.filter((c: InvestigationCase) => c.status === 'OPEN' || c.status === 'EVIDENCE_COLLECTION').length;
  const p1CasesCount = investigations.filter((c: InvestigationCase) => c.priority === 'P1').length;

  const columns = [
    {
      key: 'caseNumber',
      header: 'Case Docket #',
      sortable: true,
      render: (row: InvestigationCase) => (
        <div>
          <span className="font-mono font-bold text-stone-900 text-xs">{row.caseNumber}</span>
          <div className="text-[10px] text-stone-500 font-mono">Opened: {row.openedAt}</div>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Investigation Subject & Title',
      sortable: true,
      render: (row: InvestigationCase) => (
        <div>
          <div className="font-bold text-stone-900 text-xs">{row.title}</div>
          <div className="text-[10px] text-stone-600 font-mono font-semibold">
            {row.caseType} • Scope: {row.jurisdictionName}
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority & Severity',
      sortable: true,
      render: (row: InvestigationCase) => (
        <div className="flex items-center space-x-1.5">
          <span
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
              row.priority === 'P1'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {row.priority}
          </span>
          <span className="text-[10px] font-semibold text-stone-700">{row.severity}</span>
        </div>
      ),
    },
    {
      key: 'leadInvestigatorName',
      header: 'Lead Official',
      sortable: true,
      render: (row: InvestigationCase) => (
        <div className="text-xs font-medium text-stone-800">{row.leadInvestigatorName}</div>
      ),
    },
    {
      key: 'evidenceCount',
      header: 'Evidence Items',
      sortable: true,
      align: 'right' as const,
      render: (row: InvestigationCase) => (
        <div className="text-right">
          <span className="font-mono font-bold text-stone-900 text-xs">
            {row.evidenceItems?.length || 3} items
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Docket Status',
      sortable: true,
      align: 'center' as const,
      render: (row: InvestigationCase) => (
        <div className="text-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              row.status === 'OPEN'
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : row.status === 'EVIDENCE_COLLECTION'
                ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
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
      render: (row: InvestigationCase) => (
        <Link
          href={`/bovine/government/investigations/${row.id}`}
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-semibold text-xs transition-colors"
        >
          <span>Open Docket</span>
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
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono font-bold text-[10px]">
              LEGAL REGULATORY DOCKET
            </span>
            <span className="text-xs text-stone-600">Statutory Enforcement Division</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Regulatory Investigations & Enforcement Case Dockets
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Formal investigations into pedigree falsification, counterfeit identification, illegal transit, and biosecurity violations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 outline-none cursor-pointer"
          >
            <option value="ALL">All Case Statuses</option>
            <option value="OPEN">Open Cases</option>
            <option value="EVIDENCE_COLLECTION">Evidence Collection</option>
            <option value="CLOSED_ACTION_TAKEN">Closed with Sanctions</option>
          </select>

          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-800 hover:bg-indigo-900 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open New Case Docket</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="INV-OPEN-CASES"
          label="Active Regulatory Dockets"
          value={openCasesCount}
          unit="cases"
          trend="DOWN"
          delta="-1 resolved"
          domain="DOCKETS"
          status={openCasesCount > 0 ? 'WARNING' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="INV-P1-CRITICAL"
          label="Priority 1 Cases"
          value={p1CasesCount}
          unit="cases"
          trend={p1CasesCount > 0 ? 'UP' : 'STABLE'}
          delta="Mandatory expedited hearing"
          domain="PRIORITY"
          status={p1CasesCount > 0 ? 'CRITICAL' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="INV-EVIDENCE-ITEMS"
          label="Canonical Evidence Linked"
          value="18"
          unit="artifacts"
          trend="UP"
          delta="+4 lab proofs"
          domain="EVIDENCE"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="INV-CLOSURE-RATE"
          label="Docket Resolution Rate"
          value="84.2%"
          trend="UP"
          delta="+6.4%"
          domain="ENFORCEMENT"
          target="> 80%"
          coveragePct={84.2}
          status="NORMAL"
        />
      </div>

      {/* Flagship Evidence Network Graph */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Topological Evidence & Legal Relationship Graph
          </h2>
          <span className="text-[11px] text-stone-600">
            Directed linking from primary case to audit findings, 50K assays, and transit logs
          </span>
        </div>
        <GovernmentNetworkWorkspace initialMode="EVIDENCE" height="460px" />
      </div>

      {/* Cases Table */}
      <div>
        <GovernmentDataTable
          title="Active & Historical Investigation Dockets"
          subtitle="Official log of open inquiries, evidentiary hearings, and statutory penalties."
          columns={columns}
          data={filteredCases}
          searchPlaceholder="Filter cases by number, title, type..."
          searchFields={['caseNumber', 'title', 'caseType', 'leadInvestigatorName', 'jurisdictionName']}
        />
      </div>

      {/* Open New Case Docket Modal */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                  OFFICIAL ENFORCEMENT
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  Open New Regulatory Investigation Docket
                </h3>
              </div>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Investigation Subject / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unregistered Seedstock Semen Sales & Falsified Sire ID"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  required
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Violation Category
                  </label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value as InvestigationType)}
                    className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none"
                  >
                    <option value="PEDIGREE_CONFLICT">Pedigree / Parentage Conflict</option>
                    <option value="IDENTITY_FRAUD">RFID / Ear Tag Identity Fraud</option>
                    <option value="MOVEMENT_IRREGULARITY">Movement Irregularity / Breach</option>
                    <option value="DISEASE_OUTBREAK">Disease Outbreak Concealment</option>
                    <option value="GENETIC_PROGRAM_VIOLATION">Genetic Program / Germplasm Violation</option>
                    <option value="FARM_COMPLIANCE">Farm Compliance Failure</option>
                    <option value="ANIMAL_WELFARE">Animal Welfare Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Severity & Priority
                  </label>
                  <select
                    value={caseSeverity}
                    onChange={(e) => setCaseSeverity(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none"
                  >
                    <option value="CRITICAL">Critical (P1 - Immediate Cease & Desist)</option>
                    <option value="HIGH">High (P2 - 14d Hearing Notice)</option>
                    <option value="MEDIUM">Medium (P3 - Administrative Review)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Initial Allegation Summary & Statutory Basis
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize initial findings, whistle-blower reports, or lab assay discrepancies..."
                  value={caseSummary}
                  onChange={(e) => setCaseSummary(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  Lead: Dr. Birhanu Kebede (CVO)
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsNewCaseModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-800 hover:bg-indigo-900 text-white font-semibold shadow-xs cursor-pointer"
                  >
                    Formalize Docket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
