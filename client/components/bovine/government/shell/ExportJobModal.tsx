'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileCode,
  FileText,
  CheckCircle2,
  Clock,
  Layers,
  Building2,
  ShieldCheck,
  Truck,
  Dna,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';

export function ExportJobModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { selectedJurisdiction, createExportJob } = useGovernment();

  const [selectedFormat, setSelectedFormat] = useState<'CSV' | 'XLSX' | 'JSON'>('XLSX');
  const [selectedPackage, setSelectedPackage] = useState<string>('oie_surveillance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedJobId, setLastCreatedJobId] = useState<string | null>(null);

  if (!isOpen) return null;

  const packages = [
    {
      id: 'oie_surveillance',
      title: 'WOAH / OIE Terrestrial Biosurveillance Dossier',
      desc: 'Disease outbreaks, active quarantine zones, lab confirmations, and ring vaccination rates.',
      icon: ShieldCheck,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    },
    {
      id: 'traceability_movement',
      title: 'Livestock Traceability & Transit Ledger',
      desc: 'Inter-farm movements, permit clearances, transport manifests, and movement exceptions.',
      icon: Truck,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      id: 'genomics_audit',
      title: 'National Seedstock Genomic Integrity & Inbreeding Audit',
      desc: '50K SNP call rates, parentage verification rates, pedigree completeness, and inbreeding coefficients.',
      icon: Dna,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'compliance_matrix',
      title: 'Cross-Farm Regulatory Compliance & Audit Matrix',
      desc: '6-pillar compliance scores, open corrective actions, inspection findings, and farm risk tiers.',
      icon: Layers,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
  ];

  const handleGenerate = () => {
    setIsSubmitting(true);
    const targetPkg = packages.find((p) => p.id === selectedPackage);
    const title = targetPkg ? targetPkg.title : 'Statutory Export';

    setTimeout(() => {
      const jobId = createExportJob({
        title,
        format: selectedFormat,
        requesterName: 'Dr. Birhanu Kebede (CVO)',
        dataset: selectedPackage,
        scopeJurisdiction: selectedJurisdiction?.name || 'Federal',
        rowCount: 142260,
        downloadUrl: `/exports/dossier_${selectedPackage}_${Date.now()}.${selectedFormat.toLowerCase()}`,
      });
      setLastCreatedJobId(jobId);
      setIsSubmitting(false);
    }, 400);
  };

  const handleSimulateDownload = () => {
    const content = JSON.stringify({
      statutoryPackage: selectedPackage,
      format: selectedFormat,
      jurisdiction: selectedJurisdiction?.name,
      jurisdictionCode: selectedJurisdiction?.code,
      generatedAt: new Date().toISOString(),
      authorizedOfficial: 'Dr. Birhanu Kebede (CVO)',
      disclaimer: 'Official Ministry of Agriculture Regulatory Export. Cryptographically certified.',
    }, null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MOA_EXPORT_${selectedPackage.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.${selectedFormat.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full p-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                STATUTORY DISCLOSURE
              </span>
              <span className="text-stone-600 text-xs">Jurisdiction: {selectedJurisdiction?.name}</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mt-1">
              Statutory Regulatory Export Center
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Generate officially certified data bundles for ministry records, WOAH reporting, or legal audits.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-4 space-y-4">
          {/* Package Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-700 mb-2">
              Select Regulatory Package
            </label>
            <div className="space-y-2">
              {packages.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                const Icon = pkg.icon;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-700'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl border shrink-0 ${pkg.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-stone-900 leading-snug">{pkg.title}</p>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">{pkg.desc}</p>
                    </div>
                    <div className="shrink-0 pt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-700 mb-2">
              Select Output Format
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { format: 'XLSX' as const, label: 'Excel (XLSX)', icon: FileSpreadsheet, desc: 'Formatted sheets & pivots' },
                { format: 'CSV' as const, label: 'Raw CSV', icon: FileText, desc: 'UTF-8 delimited' },
                { format: 'JSON' as const, label: 'API JSON', icon: FileCode, desc: 'Complete schema envelope' },
              ].map((fmt) => (
                <button
                  key={fmt.format}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.format)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFormat === fmt.format
                      ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <fmt.icon className="w-4 h-4 text-stone-700 mb-1" />
                  <div className="font-semibold text-xs">{fmt.label}</div>
                  <div className="text-[10px] text-stone-600 font-normal">{fmt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Export Jobs Notice */}
          {lastCreatedJobId && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Regulatory dossier generated successfully!</span>
              </div>
              <button
                onClick={handleSimulateDownload}
                className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs cursor-pointer flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download File</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-600">
            Certified timestamp: {new Date().toLocaleDateString()}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Compiling Dossier...' : 'Generate Export'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
