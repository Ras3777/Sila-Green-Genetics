'use client';

import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Building2,
  Globe2,
  Filter,
  Plus,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { StandardReport, InstitutionalExportJob } from '@/lib/bovine-government-types';

export default function StatutoryReportsPage() {
  const { standardReports, exportJobs, createExportJob, selectedJurisdiction } = useGovernment();

  const [activeReportTab, setActiveReportTab] = useState<'CATALOG' | 'EXPORT_JOBS'>('CATALOG');
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'XLSX' | 'CSV'>('XLSX');
  const [selectedReportCode, setSelectedReportCode] = useState<string>('REP-CENSUS-2026');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCustomReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      createExportJob({
        title: `Custom Statutory Report [${selectedReportCode}]`,
        requesterName: 'Dr. Birhanu Kebede (CVO)',
        dataset: selectedReportCode,
        scopeJurisdiction: selectedJurisdiction?.name || 'Federal',
        format: selectedFormat,
        rowCount: 142260,
        downloadUrl: `/exports/${selectedReportCode}_${Date.now()}.${selectedFormat.toLowerCase()}`,
      });
      setIsGenerating(false);
      setActiveReportTab('EXPORT_JOBS');
    }, 400);
  };

  const reportColumns = [
    {
      key: 'title',
      header: 'Statutory Report Dossier',
      sortable: true,
      render: (row: StandardReport) => (
        <div>
          <div className="font-bold text-stone-900 text-xs">{row.title}</div>
          <div className="text-[10px] text-stone-500 font-mono">
            {row.code} • Frequency: {row.frequency}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Statutory Domain',
      sortable: true,
      render: (row: StandardReport) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-stone-100 text-stone-800">
          {row.category}
        </span>
      ),
    },
    {
      key: 'generatedAt',
      header: 'Last Certified Generation',
      sortable: true,
      render: (row: StandardReport) => (
        <div className="text-xs text-stone-800">
          <div>Date: <strong className="font-mono">{row.generatedAt}</strong></div>
          <div className="text-[10px] text-stone-500">Cutoff: {row.dataCutoff}</div>
        </div>
      ),
    },
    {
      key: 'format',
      header: 'Format & Size',
      sortable: true,
      render: (row: StandardReport) => (
        <span className="font-mono text-xs text-stone-700 font-semibold">
          {row.format} ({row.fileSize})
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Download',
      align: 'right' as const,
      render: (row: StandardReport) => (
        <a
          href={row.downloadUrl || '#'}
          download
          onClick={(e) => {
            e.preventDefault();
            const blob = new Blob([JSON.stringify(row, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${row.code}_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </a>
      ),
    },
  ];

  const exportColumns = [
    {
      key: 'title',
      header: 'Export Task',
      sortable: true,
      render: (row: InstitutionalExportJob) => (
        <div>
          <div className="font-bold text-stone-900 text-xs">{row.title}</div>
          <div className="text-[10px] text-stone-500 font-mono">
            Scope: {row.scopeJurisdiction} • Requested: {row.requestedAt}
          </div>
        </div>
      ),
    },
    {
      key: 'format',
      header: 'Format',
      sortable: true,
      render: (row: InstitutionalExportJob) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-stone-100 text-stone-800">
          {row.format}
        </span>
      ),
    },
    {
      key: 'rowCount',
      header: 'Records',
      sortable: true,
      align: 'right' as const,
      render: (row: InstitutionalExportJob) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {row.rowCount?.toLocaleString()} rows
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      align: 'center' as const,
      render: (row: InstitutionalExportJob) => (
        <div className="text-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              row.status === 'READY'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {row.status}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'File Action',
      align: 'right' as const,
      render: (row: InstitutionalExportJob) => (
        <button
          onClick={() => {
            const content = JSON.stringify(row, null, 2);
            const blob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `EXPORT_JOB_${row.id}_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
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
              STATUTORY DISCLOSURES
            </span>
            <span className="text-xs text-stone-600">Reports Authority: Ministry of Agriculture</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Statutory Reports Center & Regulatory Dossier Exports
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Pre-compiled statutory reporting dossiers, WOAH biosecurity submissions, and on-demand customized exports.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="REP-STANDARD-COUNT"
          label="Pre-Compiled Standard Reports"
          value={standardReports.length}
          unit="dossiers"
          trend="STABLE"
          delta="Updated weekly"
          domain="REPORTS"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="REP-WOAH-READY"
          label="WOAH Terrestrial Compliance"
          value="100%"
          trend="STABLE"
          delta="Certified ready"
          domain="INTERNATIONAL"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="REP-EXPORT-JOBS"
          label="Completed Export Tasks"
          value={exportJobs.length}
          unit="jobs"
          trend="UP"
          delta="+3 generated today"
          domain="EXPORTS"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="REP-DATA-CUTOFF"
          label="Latest Certified Cutoff Date"
          value="2026-03-01"
          trend="STABLE"
          delta="Monthly certified lock"
          domain="AUDIT"
          status="NORMAL"
        />
      </div>

      {/* On-Demand Report Builder Box */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
        <h3 className="font-bold text-stone-900 text-sm flex items-center">
          <FileText className="w-4 h-4 mr-1.5 text-emerald-800" /> On-Demand Statutory Report Generator
        </h3>
        <form onSubmit={handleGenerateCustomReport} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Select Report Dossier</label>
            <select
              value={selectedReportCode}
              onChange={(e) => setSelectedReportCode(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none"
            >
              <option value="REP-CENSUS-2026">National Cattle Census Balance Sheet</option>
              <option value="REP-WOAH-BIOSEC">WOAH Epidemiological Biosurveillance Report</option>
              <option value="REP-GEN-AUDIT">National 50K Genomic Integrity & Inbreeding Audit</option>
              <option value="REP-TRANSIT-LEDGER">Livestock Movement & Transit Compliance Ledger</option>
              <option value="REP-CROSS-FARM-AUDIT">6-Pillar Cross-Farm Regulatory Scorecard</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Territorial Scope</label>
            <input
              type="text"
              value={selectedJurisdiction?.name || 'Federal Coverage'}
              disabled
              className="w-full p-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Output Format</label>
            <div className="grid grid-cols-3 gap-1">
              {(['XLSX', 'CSV', 'PDF'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`p-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    selectedFormat === fmt
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full p-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Compiling Dossier...' : 'Compile & Generate'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 text-xs">
        <button
          onClick={() => setActiveReportTab('CATALOG')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeReportTab === 'CATALOG'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Statutory Report Catalog ({standardReports.length})
        </button>
        <button
          onClick={() => setActiveReportTab('EXPORT_JOBS')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeReportTab === 'EXPORT_JOBS'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Export Jobs Queue ({exportJobs.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeReportTab === 'CATALOG' ? (
        <GovernmentDataTable
          title="Standard Statutory Report Catalog"
          subtitle="Officially certified regulatory reports generated on scheduled reporting cycles."
          columns={reportColumns}
          data={standardReports}
          searchPlaceholder="Filter reports by title, code, category..."
          searchFields={['title', 'code', 'category', 'description']}
        />
      ) : (
        <GovernmentDataTable
          title="Generated Statutory Export Jobs"
          subtitle="Audit log of generated datasets with cryptographically sealed download packages."
          columns={exportColumns}
          data={exportJobs}
          searchPlaceholder="Filter export jobs..."
          searchFields={['title', 'scopeJurisdiction', 'requesterName', 'dataset']}
        />
      )}
    </div>
  );
}
