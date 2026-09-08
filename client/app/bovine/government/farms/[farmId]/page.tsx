'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
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
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';
import { Farm } from '@/lib/bovine-types';
import { ComplianceFinding, ComplianceAudit } from '@/lib/bovine-government-types';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';

export default function FarmOversightProfilePage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const resolvedParams = use(params);
  const { complianceAudits, complianceFindings, issueCorrectiveAction } = useGovernment();
  const { farms, herds, animals } = useBovine();

  const [isCapaModalOpen, setIsCapaModalOpen] = useState(false);
  const [capaTitle, setCapaTitle] = useState('');
  const [capaDesc, setCapaDesc] = useState('');
  const [capaDeadline, setCapaDeadline] = useState('2026-09-30');

  const farm: Farm = farms.find((f: Farm) => f.id === resolvedParams.farmId) || farms[0];
  const farmHerds = herds.filter((h) => h.farmId === farm.id);
  const farmAnimals = animals.filter((a) => a.farmId === farm.id);

  const farmFindings = complianceFindings.filter((f: ComplianceFinding) => f.farmId === farm.id);
  const farmAudits = complianceAudits.filter((a: ComplianceAudit) => a.farmId === farm.id);
  const isQuarantined = farm.code === 'FARM-ET-003';

  const handleIssueCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capaTitle) return;

    issueCorrectiveAction({
      findingId: farmFindings[0]?.id || 'find-001',
      farmId: farm.id,
      farmName: farm.name,
      actionRequired: capaTitle,
      issuedBy: 'Dr. Birhanu Kebede (CVO)',
      responseDeadline: capaDeadline,
      notes: capaDesc || capaTitle,
    });

    setIsCapaModalOpen(false);
    setCapaTitle('');
    setCapaDesc('');
  };

  const findingColumns = [
    {
      key: 'code',
      header: 'Finding Code',
      sortable: true,
      render: (row: any) => (
        <span className="font-mono font-bold text-stone-800 text-xs">{row.code}</span>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
            row.severity === 'CRITICAL'
              ? 'bg-rose-100 text-rose-900 border border-rose-300'
              : row.severity === 'MAJOR'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-stone-100 text-stone-800'
          }`}
        >
          {row.severity}
        </span>
      ),
    },
    {
      key: 'pillar',
      header: 'Statutory Pillar',
      sortable: true,
      render: (row: any) => (
        <span className="text-xs font-semibold text-stone-700">{row.pillar}</span>
      ),
    },
    {
      key: 'description',
      header: 'Non-Conformance Detail',
      render: (row: any) => (
        <div className="text-xs text-stone-800 leading-snug">{row.description}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      align: 'center' as const,
      render: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            row.status === 'OPEN'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center space-x-2 text-xs">
          <Link
            href="/bovine/government/farms"
            className="text-stone-600 hover:text-stone-900 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Farm Oversight Directory</span>
          </Link>
          <span className="text-stone-400">/</span>
          <span className="font-bold text-stone-900">{farm.name}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCapaModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Corrective Action Directive</span>
          </button>
        </div>
      </div>

      {/* Farm Overview Header Card */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono font-bold text-[10px]">
              {farm.type || 'COMMERCIAL_NUCLEUS'}
            </span>
            <span className="font-mono text-stone-600 text-xs">Code: {farm.code}</span>
            {isQuarantined && (
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono font-bold text-[10px] animate-pulse">
                UNDER QUARANTINE
              </span>
            )}
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            {farm.name} — Regulatory File
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-2">
            <span>Location: <strong className="text-stone-800">{farm.address || farm.district || farm.region} ({farm.region})</strong></span>
            <span>Designated Operator: <strong className="text-stone-800">{(farm as any).manager || 'Dr. Alemu Tadesse'}</strong></span>
            <span>Accreditation ID: <strong className="text-stone-800 font-mono">ET-AGRI-{farm.code}</strong></span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="FARM-INVENTORY"
          label="Registered Herd Strength"
          value={farmAnimals.length || 380}
          unit="cattle"
          trend="UP"
          delta="+14 net"
          domain="CENSUS"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="FARM-OPEN-FINDINGS"
          label="Unresolved Audit Findings"
          value={farmFindings.filter((f: ComplianceFinding) => f.status === 'OPEN').length}
          unit="findings"
          trend={farmFindings.length > 0 ? 'UP' : 'STABLE'}
          delta={farmFindings.length > 0 ? 'Requires action' : 'Clear'}
          domain="COMPLIANCE"
          status={farmFindings.length > 0 ? 'WARNING' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="FARM-HERDS"
          label="Management Herds"
          value={farmHerds.length || 2}
          unit="herds"
          trend="STABLE"
          delta="Inspected"
          domain="STRUCTURE"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="FARM-PASS-SCORE"
          label="Composite Compliance Pass"
          value={isQuarantined ? '62.4%' : '94.8%'}
          trend={isQuarantined ? 'DOWN' : 'UP'}
          delta={isQuarantined ? '-12.0%' : '+3.2%'}
          domain="QUALITY"
          status={isQuarantined ? 'CRITICAL' : 'NORMAL'}
        />
      </div>

      {/* Audit Findings Table */}
      <div>
        <GovernmentDataTable
          title="Compliance Audit Non-Conformances"
          subtitle="Detailed historical findings from federal and regional biosecurity and traceability audits."
          columns={findingColumns}
          data={farmFindings}
          searchPlaceholder="Filter findings by code, severity, pillar..."
          searchFields={['code', 'severity', 'pillar', 'description']}
        />
      </div>

      {/* Corrective Action Directive Modal */}
      {isCapaModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                  STATUTORY NOTICE
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  Issue Corrective Action Directive (CAPA)
                </h3>
              </div>
              <button
                onClick={() => setIsCapaModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueCapa} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Target Farm Facility
                </label>
                <input
                  type="text"
                  value={`${farm.name} (${farm.code})`}
                  disabled
                  className="w-full p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Mandatory Corrective Action Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Immediate Quarantine Isolation & RFID Retagging"
                  value={capaTitle}
                  onChange={(e) => setCapaTitle(e.target.value)}
                  required
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Specific Statutory Remediation Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="State the regulatory standard breached and exact steps the farm operator must fulfill..."
                  value={capaDesc}
                  onChange={(e) => setCapaDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Mandatory Regulatory Compliance Deadline
                </label>
                <input
                  type="date"
                  value={capaDeadline}
                  onChange={(e) => setCapaDeadline(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  Signed: Chief Veterinary Officer
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCapaModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold shadow-xs cursor-pointer"
                  >
                    Serve Statutory Directive
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
