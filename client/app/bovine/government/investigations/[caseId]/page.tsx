'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  SearchCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Layers,
  FileCheck2,
  CheckCircle2,
  Clock,
  Plus,
  X,
  ExternalLink,
  Users2,
  Paperclip,
  Check,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InvestigationCase, InvestigationEvidence } from '@/lib/bovine-government-types';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';

export default function InvestigationDocketProfilePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const resolvedParams = use(params);
  const { investigations, addEvidenceToCase } = useGovernment();

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceLabel, setEvidenceLabel] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [evidenceRelation, setEvidenceRelation] = useState<string>('SUPPORTING_PROOF');

  const caseDocket: InvestigationCase =
    investigations.find((c: InvestigationCase) => c.id === resolvedParams.caseId) || investigations[0];

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceLabel) return;

    addEvidenceToCase(caseDocket.id, {
      label: evidenceLabel,
      entityType: 'DOCUMENT',
      entityId: `doc-${Date.now().toString().slice(-4)}`,
      description: evidenceDesc || evidenceLabel,
      relation: (evidenceRelation as any) || 'SUPPORTING_PROOF',
      relevanceScore: 90,
      pinned: false,
    });

    setIsEvidenceModalOpen(false);
    setEvidenceLabel('');
    setEvidenceDesc('');
  };

  const evidenceColumns = [
    {
      key: 'label',
      header: 'Evidence Item & Entity',
      sortable: true,
      render: (row: InvestigationEvidence) => (
        <div>
          <span className="font-bold text-stone-900 text-xs">{row.label}</span>
          <div className="text-[10px] text-stone-500 font-mono">
            Type: {row.entityType} • ID: {row.entityId}
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Evidentiary Finding',
      render: (row: InvestigationEvidence) => (
        <p className="text-xs text-stone-800 leading-snug">{row.description}</p>
      ),
    },
    {
      key: 'relation',
      header: 'Relation to Case',
      sortable: true,
      align: 'center' as const,
      render: (row: InvestigationEvidence) => (
        <div className="text-center">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-stone-100 text-stone-800 border-stone-200">
            {row.relation}
          </span>
        </div>
      ),
    },
    {
      key: 'timestamp',
      header: 'Logged Date',
      sortable: true,
      render: (row: InvestigationEvidence) => (
        <span className="font-mono text-stone-700 text-xs">{row.timestamp}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center space-x-2 text-xs">
          <Link
            href="/bovine/government/investigations"
            className="text-stone-600 hover:text-stone-900 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Investigation Dockets</span>
          </Link>
          <span className="text-stone-400">/</span>
          <span className="font-bold text-stone-900">{caseDocket.caseNumber}</span>
        </div>

        <button
          onClick={() => setIsEvidenceModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-800 hover:bg-indigo-900 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Attach Sworn Evidence</span>
        </button>
      </div>

      {/* Case Docket Header Card */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono font-bold text-[10px]">
              DOCKET {caseDocket.caseNumber}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono font-bold text-[10px]">
              {caseDocket.caseType}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-mono font-bold text-[10px]">
              PRIORITY {caseDocket.priority}
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            {caseDocket.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-2">
            <span>Jurisdiction: <strong className="text-stone-800">{caseDocket.jurisdictionName}</strong></span>
            <span>Lead Investigator: <strong className="text-stone-800">{caseDocket.leadInvestigatorName}</strong></span>
            <span>Opened: <strong className="text-stone-800 font-mono">{caseDocket.openedAt}</strong></span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-500 block">Current Status</span>
          <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            {caseDocket.status}
          </span>
        </div>
      </div>

      {/* Case Summary Box */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2 text-xs">
        <h3 className="font-bold text-stone-900 text-sm">Statutory Allegation & Investigative Findings</h3>
        <p className="text-stone-700 leading-relaxed text-[13px]">
          {caseDocket.summary}
        </p>
        {caseDocket.actionTaken && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
            <strong>Sanctions & Actions Taken:</strong> {caseDocket.actionTaken}
          </div>
        )}
      </div>

      {/* Evidence Table */}
      <div>
        <GovernmentDataTable
          title="Evidentiary Repository & Canonical Chain of Custody"
          subtitle="Sworn laboratory assays, digital audit logs, and movement manifests entered into the regulatory record."
          columns={evidenceColumns}
          data={caseDocket.evidenceItems}
          searchPlaceholder="Filter evidence items..."
          searchFields={['title', 'description', 'source', 'evidenceType']}
        />
      </div>

      {/* Attach Evidence Modal */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                  CHAIN OF CUSTODY
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  Attach Sworn Evidence to Docket {caseDocket.caseNumber}
                </h3>
              </div>
              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Evidence Label & Reference Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lab Assay Report 50K-2026-88"
                  value={evidenceLabel}
                  onChange={(e) => setEvidenceLabel(e.target.value)}
                  required
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Evidentiary Relationship
                </label>
                <select
                  value={evidenceRelation}
                  onChange={(e) => setEvidenceRelation(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none"
                >
                  <option value="SUPPORTING_PROOF">Supporting Laboratory / Document Proof</option>
                  <option value="PRIMARY_SUSPECT">Primary Target / Subject</option>
                  <option value="FINDING_REF">Regulatory Audit Finding Reference</option>
                  <option value="TRANSIT_SITE">Transit / Movement Manifest Reference</option>
                  <option value="CONTAMINATED_ORIGIN">Contaminated Farm of Origin</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Findings Description & Relevance
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the proof provided by this item and relevance to the charges..."
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  Certified by Registrar
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEvidenceModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-800 hover:bg-indigo-900 text-white font-semibold shadow-xs cursor-pointer"
                  >
                    Enter into Record
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
