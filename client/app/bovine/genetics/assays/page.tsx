'use client';

import React, { useState } from 'react';
import {
  Microscope,
  Plus,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCode2,
  Download,
  Dna,
  Binary,
  Layers,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { GenotypingAssay } from '@/lib/bovine-types';

export default function GenotypingAssaysPage() {
  const { genotypingAssays, laboratories, geneticSamples, addGenotypingAssay, updateAssayQcStatus } = useGenetics();

  const [searchQuery, setSearchQuery] = useState('');
  const [qcFilter, setQcFilter] = useState('ALL');
  const [selectedAssayId, setSelectedAssayId] = useState<string>(genotypingAssays[0]?.id || '');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newPlatform, setNewPlatform] = useState('Illumina Infinium iSelect BeadChip');
  const [newDensity, setNewDensity] = useState('100K');
  const [newMarkerCount, setNewMarkerCount] = useState('100240');
  const [newLabId, setNewLabId] = useState(laboratories[0]?.id || '');
  const [newSampleId, setNewSampleId] = useState(geneticSamples[0]?.id || '');

  const selectedAssay = genotypingAssays.find((a) => a.id === selectedAssayId) || genotypingAssays[0];

  const filteredAssays = genotypingAssays.filter((assay) => {
    if (qcFilter !== 'ALL' && assay.qcStatus !== qcFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (assay.name || assay.assayName || '').toLowerCase().includes(q) ||
        (assay.code || assay.chipName || '').toLowerCase().includes(q) ||
        (assay.platform || '').toLowerCase().includes(q) ||
        (assay.laboratoryName || assay.labName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateAssay = (e: React.FormEvent) => {
    e.preventDefault();
    const lab = laboratories.find((l) => l.id === newLabId);
    const sample = geneticSamples.find((s) => s.id === newSampleId);
    if (!newCode || !newName) return;

    addGenotypingAssay({
      code: newCode.toUpperCase(),
      name: newName,
      platform: newPlatform,
      density: newDensity,
      markerCount: parseInt(newMarkerCount) || 100000,
      laboratoryId: newLabId,
      laboratoryName: lab?.name || 'Partner Lab',
      assemblyVersion: 'ARS-UCD1.2 (Bos taurus)',
      sampleId: newSampleId,
      qcStatus: 'PASSED',
      callRate: 99.4,
      heterozygosityRate: 33.2,
      sexConcordance: 'PASS',
      mendelianConflicts: 0,
    });

    setCreateModalOpen(false);
    setNewCode('');
    setNewName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Genomic Quality Assurance
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">SNP Call Rate & Mendelian Conformance</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Microscope className="w-5 h-5 text-emerald-700" />
            Genotyping Assays & QC Audit
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Audit BeadChip arrays and low-pass sequencing runs against strict quality gates:
            minimum 98.5% call rate, 28-38% diploid heterozygosity, chromosomal sex concordance, and ISAG parentage conflict checks.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Assay Run</span>
        </button>
      </div>

      {/* Main Grid: Assays List & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Assays List */}
        <div className="lg:col-span-6 space-y-4">
          {/* Filters */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap gap-2 text-xs">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search assay name or platform..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <select
              value={qcFilter}
              onChange={(e) => setQcFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium"
            >
              <option value="ALL">All QC Statuses</option>
              <option value="PASSED">Passed (≥98.5%)</option>
              <option value="WARNING">Warning</option>
              <option value="FAILED">Failed / Outlier</option>
            </select>
          </div>

          {/* Cards */}
          <div className="space-y-2.5">
            {filteredAssays.map((assay) => {
              const isSelected = assay.id === selectedAssay?.id;
              return (
                <div
                  key={assay.id}
                  onClick={() => setSelectedAssayId(assay.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold bg-stone-100 text-stone-900 px-2 py-0.5 rounded">
                        {assay.code}
                      </span>
                      <span className="font-mono text-[10px] text-stone-600 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200">
                        {assay.density} ({assay.markerCount.toLocaleString()} SNPs)
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        assay.qcStatus === 'PASSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : assay.qcStatus === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {assay.qcStatus}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{assay.name}</h4>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {assay.platform} • {assay.laboratoryName}
                    </div>
                  </div>

                  {/* Mini QC stats */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-100 text-[10px]">
                    <div>
                      <span className="text-stone-500 block">Call Rate:</span>
                      <span
                        className={`font-mono font-bold ${
                          assay.callRate >= 98.5 ? 'text-emerald-800' : 'text-rose-800'
                        }`}
                      >
                        {assay.callRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Heterozygosity:</span>
                      <span className="font-mono font-bold text-stone-800">
                        {assay.heterozygosityRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Sex Match:</span>
                      <span className="font-semibold text-emerald-800">
                        {assay.sexConcordance}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Detailed QC Inspection & Data Assets */}
        <div className="lg:col-span-6">
          {selectedAssay ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6 text-xs">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      {selectedAssay.code}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-600">{selectedAssay.assemblyVersion}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">{selectedAssay.name}</h3>
                </div>

                <div className="flex items-center space-x-1.5">
                  {selectedAssay.qcStatus !== 'PASSED' && (
                    <button
                      onClick={() => updateAssayQcStatus(selectedAssay.id, 'PASSED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 cursor-pointer"
                    >
                      Override to Pass
                    </button>
                  )}
                  {selectedAssay.qcStatus !== 'FAILED' && (
                    <button
                      onClick={() => updateAssayQcStatus(selectedAssay.id, 'FAILED')}
                      className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold cursor-pointer"
                    >
                      Flag Failed
                    </button>
                  )}
                </div>
              </div>

              {/* Quality Control Audit Metric Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Quality Control Verification Gates
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {/* Gate 1: SNP Call Rate */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 uppercase font-semibold">
                        SNP Call Rate
                      </span>
                      {selectedAssay.callRate >= 98.5 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <div className="text-xl font-bold font-mono text-stone-900">
                      {selectedAssay.callRate}%
                    </div>
                    <div className="text-[10px] text-stone-500">
                      ICAR Quality Threshold: ≥ 98.5%
                    </div>
                  </div>

                  {/* Gate 2: Heterozygosity */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 uppercase font-semibold">
                        Diploid Heterozygosity
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xl font-bold font-mono text-stone-900">
                      {selectedAssay.heterozygosityRate}%
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Normal Range: 28.0% - 38.0%
                    </div>
                  </div>

                  {/* Gate 3: Sex Concordance */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 uppercase font-semibold">
                        Genotypic Sex Match
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-base font-bold text-stone-900">
                      {selectedAssay.sexConcordance}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      X/Y chromosome SNP calls concordant
                    </div>
                  </div>

                  {/* Gate 4: Mendelian Conflicts */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 uppercase font-semibold">
                        Mendelian Parentage Conflicts
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xl font-bold font-mono text-stone-900">
                      {selectedAssay.mendelianConflicts}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Zero conflicting parentage alleles
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Assets & Downstream Imputation */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-emerald-700" />
                  Genomic Artifacts & Files
                </h4>

                <div className="space-y-2">
                  {[
                    { name: `${selectedAssay.code}_finalreport.txt`, type: 'Illumina FinalReport IDAT Matrix', size: '14.2 MB' },
                    { name: `${selectedAssay.code}_snps_pass.vcf.gz`, type: 'Compressed Variant Call Format (ARS-UCD1.2)', size: '8.6 MB' },
                    { name: `${selectedAssay.code}.ped / .map`, type: 'PLINK Binary Genotype Dataset', size: '4.1 MB' },
                  ].map((file, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        <FileCode2 className="w-4 h-4 text-stone-500" />
                        <div>
                          <div className="font-mono font-bold text-stone-900">{file.name}</div>
                          <div className="text-[10px] text-stone-500">{file.type} • {file.size}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Simulated download for ${file.name}`)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 rounded-lg cursor-pointer"
                        title="Download Data Asset"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
              Select a genotyping assay to inspect QC gates.
            </div>
          )}
        </div>
      </div>

      {/* CREATE ASSAY MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Microscope className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Register Genotyping Assay</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssay} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Assay Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ASSAY-2026-004"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 uppercase font-mono font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">SNP Density</label>
                  <select
                    value={newDensity}
                    onChange={(e) => setNewDensity(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    <option value="50K">50K (Illumina BovineSNP50)</option>
                    <option value="100K">100K (GGP Bovine 100K)</option>
                    <option value="777K HD">777K HD (Illumina High-Density)</option>
                    <option value="WGS">WGS (Whole Genome Sequencing)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Assay Run Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neogen GGP Bovine 100K Plate 41B"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Laboratory</label>
                  <select
                    value={newLabId}
                    onChange={(e) => setNewLabId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    {laboratories.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Target Marker Count</label>
                  <input
                    type="number"
                    value={newMarkerCount}
                    onChange={(e) => setNewMarkerCount(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Register Assay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
