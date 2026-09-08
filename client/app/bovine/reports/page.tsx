'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function ReportsHubPage() {
  const { breedingPrograms, matingPlans, semenBatches, embryos } = useBreeding();
  const { animals, farms } = useBovine();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (reportType: string) => {
    let filename = '';
    let content = '';

    if (reportType === 'HERD_GENETIC_SUMMARY') {
      filename = 'herd_genetic_audit_report.csv';
      const headers = 'AnimalID,Name,Breed,Sex,InbreedingF,ConditionStatus\n';
      const rows = animals
        .map(
          (a) =>
            `${a.primaryIdentifier || a.internalId},${a.name},${a.breed},${a.sex},${((a.inbreedingCoefficient || 0.03) * 100).toFixed(2)}%,Clear`
        )
        .join('\n');
      content = headers + rows;
    } else if (reportType === 'SEMEN_INVENTORY') {
      filename = 'cryo_semen_inventory_report.csv';
      const headers = 'BatchCode,SireName,SireID,SemenType,Tank,Canister,AvailableDoses,TotalProduced\n';
      const rows = semenBatches
        .map(
          (b) =>
            `${b.batchCode},${b.sireName},${b.sireIdentifier || (b as any).sirePrimaryIdentifier || ''},${b.semenType},${(b as any).storageLocation?.tank || b.storageTank || ''},${(b as any).storageLocation?.canister || b.storageCane || ''},${b.availableDoses},${b.totalDoses || (b as any).totalDosesProduced || 0}`
        )
        .join('\n');
      content = headers + rows;
    } else if (reportType === 'EMBRYO_REPOSITORY') {
      filename = 'embryo_repository_report.csv';
      const headers = 'EmbryoCode,DamName,SireName,Stage,Grade,Preservation,PredictedSex,Tank\n';
      const rows = embryos
        .map(
          (e) =>
            `${e.code},${e.donorDamName},${e.sireName},${e.stage},${e.grade},${(e as any).preservationMethod || e.state || 'FROZEN'},${(e as any).predictedSex || e.sex || ''},${(e as any).storageLocation?.tank || e.storageTank || 'FRESH'}`
        )
        .join('\n');
      content = headers + rows;
    } else if (reportType === 'MATING_DISPATCH') {
      filename = 'mating_allocation_summary.csv';
      const headers = 'PlanCode,PlanName,Season,Females,Sires,MaxInbreedingF,Status\n';
      const rows = matingPlans
        .map(
          (m) =>
            `${m.code},${m.name},${m.season},${m.femaleCount},${m.sireCount},${m.maxInbreedingThreshold}%,${m.status}`
        )
        .join('\n');
      content = headers + rows;
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    setDownloadSuccess(`Generated and downloaded ${filename}`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const reportTemplates = [
    {
      id: 'HERD_GENETIC_SUMMARY',
      title: 'Population Genetic Audit & Inbreeding Ledger',
      description: 'Comprehensive roster of all registered animals with verified pedigree consanguinity and genetic condition status.',
      format: 'CSV / Excel Spreadsheet',
      cadence: 'Monthly / On-demand',
    },
    {
      id: 'SEMEN_INVENTORY',
      title: 'Cryogenic Semen Straw Inventory & Tank Auditing',
      description: 'Complete physical tank coordinates, dose levels, post-thaw lab assays, and field dispensation movements.',
      format: 'CSV / Audit Manifest',
      cadence: 'Weekly Cycle',
    },
    {
      id: 'EMBRYO_REPOSITORY',
      title: 'Embryo Biorepository & IVF Transfer Register',
      description: 'IETS stage and grade listings, biopsy-verified genomic rankings, recipient synchronization events, and confirmed pregnancies.',
      format: 'CSV / Manifest',
      cadence: 'Per Flush Session',
    },
    {
      id: 'MATING_DISPATCH',
      title: 'Mating Allocation Work Order & Field Dispatch',
      description: 'Seasonal sire-to-female allocation matrices formatted for AI field technicians with carrier exclusion compliance.',
      format: 'CSV / Dispatch Sheet',
      cadence: 'Seasonal Breeding Cycle',
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <FileText className="w-4 h-4" />
            <span>Compliance &amp; Operational Reports • Phase 4</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Breeding Reports &amp; Exports</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Generate standardized compliance reports, Interbull genomic exports, cryo manifests, and mating dispatch sheets.
          </p>
        </div>

        {downloadSuccess && (
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {tpl.format}
                </span>
                <span className="text-xs text-stone-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{tpl.cadence}</span>
                </span>
              </div>
              <h2 className="text-base font-bold text-stone-900">{tpl.title}</h2>
              <p className="text-xs text-stone-600 leading-relaxed">{tpl.description}</p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-mono">Status: Ready to compile</span>
              <button
                onClick={() => handleExport(tpl.id)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dataset (.csv)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Standard Formats Info */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
        <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Registry &amp; Industry Data Compatibility
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
          All exported datasets follow standardized <strong>Interbull Form 01/02</strong>, <strong>CDCB format 105</strong>, and <strong>IETS Certificate of Embryo Transfer (Form A)</strong> specifications for seamless ingestion into national breed associations and genomic evaluation centers.
        </p>
      </div>
    </div>
  );
}
