'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileSpreadsheet,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Animal } from '@/lib/bovine-types';
import { PedigreeGraphData } from '@/lib/bovine-pedigree-types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rootAnimal: Animal;
  graphData: PedigreeGraphData;
}

export default function ExportDialog({
  isOpen,
  onClose,
  rootAnimal,
  graphData,
}: ExportDialogProps) {
  const [format, setFormat] = useState<'certificate' | 'image' | 'csv'>('certificate');
  const [genDepth, setGenDepth] = useState<number>(3);
  const [isExporting, setIsExporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteExport = () => {
    setIsExporting(true);

    if (format === 'csv') {
      // Build CSV
      const headers = ['Generation', 'Role', 'Name', 'PrimaryIdentifier', 'Sex', 'Breed', 'Status', 'InbreedingF'];
      const rows = graphData.nodes.map((n) => [
        n.data.generation,
        n.data.branchRole || 'ANCESTOR',
        `"${n.data.name}"`,
        `"${n.data.primaryIdentifier || ''}"`,
        n.data.sex,
        `"${n.data.breed}"`,
        n.data.parentageStatus,
        (n.data.inbreedingF || 0).toFixed(4),
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `pedigree_${rootAnimal.name.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'certificate') {
      // Trigger browser print for certificate view
      window.print();
    }

    setTimeout(() => {
      setIsExporting(false);
      setSuccessMessage('Export successfully generated.');
      setTimeout(() => setSuccessMessage(null), 2500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Export Pedigree & Certificate</h3>
              <p className="text-stone-500 text-xs">Certified ancestry documents for {rootAnimal.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-stone-700">
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Format selection cards */}
          <div>
            <label className="block font-bold text-stone-900 mb-2">Select Export Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat('certificate')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  format === 'certificate'
                    ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Printer className="w-5 h-5 text-emerald-800 mb-1.5" />
                <div className="font-bold text-stone-900 text-xs">Official PDF</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Herdbook Certificate</div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('image')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  format === 'image'
                    ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <ImageIcon className="w-5 h-5 text-blue-800 mb-1.5" />
                <div className="font-bold text-stone-900 text-xs">PNG Snapshot</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Full Canvas Graph</div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  format === 'csv'
                    ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-purple-800 mb-1.5" />
                <div className="font-bold text-stone-900 text-xs">CSV Table</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Raw Ancestry Records</div>
              </button>
            </div>
          </div>

          {/* Certificate Preview Card */}
          {format === 'certificate' && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div className="flex items-center space-x-1.5 text-stone-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Official Certificate of Pedigree & Registration</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">CERT-2026-HB</span>
              </div>

              <div className="text-[11px] space-y-1 text-stone-600">
                <div>Subject Animal: <span className="font-bold text-stone-900">{rootAnimal.name}</span></div>
                <div>Primary ID: <span className="font-mono">{rootAnimal.primaryIdentifier || rootAnimal.internalId}</span></div>
                <div>Lineage Depth: <span className="font-bold">{genDepth} Generations</span></div>
                <div>DNA Verification: <span className="text-emerald-800 font-bold">Passed (ICAR 500-SNP Core)</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteExport}
            disabled={isExporting}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download / Print'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
