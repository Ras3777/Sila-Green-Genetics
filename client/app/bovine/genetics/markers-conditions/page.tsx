'use client';

import React, { useState } from 'react';
import {
  Binary,
  Plus,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Dna,
  ShieldCheck,
  Search,
  ExternalLink,
  Info,
  X,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { GeneticMarker, GeneticCondition, AnimalGeneticConditionResult, ConditionStatus } from '@/lib/bovine-types';

export default function MarkersConditionsPage() {
  const { animals } = useBovine();
  const {
    geneticMarkers,
    animalMarkerResults,
    geneticConditions,
    animalGeneticConditionResults,
    addAnimalGeneticConditionResult,
  } = useGenetics();

  const [activeTab, setActiveTab] = useState<'CONDITIONS' | 'MARKERS'>('CONDITIONS');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  // Form states
  const [newAnimalId, setNewAnimalId] = useState(animals[0]?.id || '');
  const [newConditionCode, setNewConditionCode] = useState(geneticConditions[0]?.code || 'BLAD');
  const [newStatus, setNewStatus] = useState<ConditionStatus>('TESTED_FREE');
  const [newSource, setNewSource] = useState<'RECORDED_TEST' | 'PEDIGREE_INFERRED' | 'COMMERCIAL_CHIP'>('RECORDED_TEST');
  const [newLabCertificate, setNewLabCertificate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredConditionResults = animalGeneticConditionResults.filter((res) => {
    if (statusFilter !== 'ALL' && res.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.animalName.toLowerCase().includes(q) ||
        res.conditionCode.toLowerCase().includes(q) ||
        res.conditionName.toLowerCase().includes(q) ||
        res.animalIdentifier?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRecordResult = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === newAnimalId);
    const cond = geneticConditions.find((c) => c.code === newConditionCode);
    if (!animal || !cond) return;

    addAnimalGeneticConditionResult({
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      conditionCode: cond.code,
      conditionName: cond.name,
      status: newStatus,
      testedDate: new Date().toISOString().split('T')[0],
      source: newSource,
      labCertificateNumber: newLabCertificate || undefined,
      notes: newNotes || undefined,
    });

    setRecordModalOpen(false);
    setNewLabCertificate('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Mendelian Surveillance
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">Recessive Defect & Causative Variants</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Binary className="w-5 h-5 text-emerald-700" />
            Genetic Markers & Recessive Conditions
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Surveillance registry strictly isolating laboratory-certified diagnostic results from pedigree-inferred risk.
            Monitors lethal haplotypes (HH1-HH6) and recessive genetic defects (BLAD, CVM, HCD, Curly Calf).
          </p>
        </div>

        <button
          onClick={() => setRecordModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Condition Status</span>
        </button>
      </div>

      {/* Sub-Tabs: Genetic Conditions vs Markers */}
      <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs text-xs">
        <button
          onClick={() => setActiveTab('CONDITIONS')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
            activeTab === 'CONDITIONS'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Genetic Conditions Registry ({animalGeneticConditionResults.length} records)
        </button>
        <button
          onClick={() => setActiveTab('MARKERS')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
            activeTab === 'MARKERS'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Causative Markers Catalog ({geneticMarkers.length} markers)
        </button>
      </div>

      {/* VIEW 1: GENETIC CONDITIONS */}
      {activeTab === 'CONDITIONS' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap gap-2 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search animal, condition, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="TESTED_FREE">Tested Free</option>
              <option value="CARRIER">Carrier (Heterozygous)</option>
              <option value="AFFECTED">Affected (Homozygous)</option>
              <option value="INFERRED_FREE">Inferred Free</option>
              <option value="INFERRED_CARRIER">Inferred Carrier</option>
            </select>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Animal</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Surveillance Status</th>
                    <th className="py-3 px-4">Provenance & Source</th>
                    <th className="py-3 px-4">Tested Date</th>
                    <th className="py-3 px-4">Certificate / Assay ID</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredConditionResults.map((res) => (
                    <tr key={res.id} className="hover:bg-stone-50/70">
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{res.animalName}</div>
                        <div className="font-mono text-[10px] text-stone-500">
                          {res.animalIdentifier}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{res.conditionName}</div>
                        <div className="font-mono text-[10px] text-stone-500">
                          {res.conditionCode}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            res.status === 'TESTED_FREE' || res.status === 'INFERRED_FREE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.status === 'CARRIER' || res.status === 'INFERRED_CARRIER'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {res.status === 'TESTED_FREE' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {res.status === 'CARRIER' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {res.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-800">
                          {res.source === 'RECORDED_TEST' && 'Laboratory Assay'}
                          {res.source === 'COMMERCIAL_CHIP' && 'High-Density BeadChip'}
                          {res.source === 'PEDIGREE_INFERRED' && 'Pedigree Kinship Inference'}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {res.source === 'PEDIGREE_INFERRED' ? 'Non-certified' : 'Certified result'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                        {res.testedDate}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-stone-700">
                        {res.labCertificateNumber || '-'}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-stone-500 max-w-xs">
                        {res.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GENETIC MARKERS CATALOG */}
      {activeTab === 'MARKERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {geneticMarkers.map((marker) => (
            <div
              key={marker.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                  {marker.code}
                </span>
                <span className="font-mono text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                  Chr {marker.chromosome}:{(marker.position ?? marker.positionBp ?? 0).toLocaleString()}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm">{marker.name}</h4>
                <div className="text-[11px] font-mono text-stone-600">Gene: {marker.gene || marker.geneSymbol || 'Intergenic'}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] space-y-1">
                <div>
                  <span className="text-stone-500">Reference / Alternate Allele:</span>{' '}
                  <span className="font-mono font-bold text-stone-900">
                    {marker.refAllele} / {marker.altAllele}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500">Inheritance:</span>{' '}
                  <span className="font-semibold text-stone-800">{marker.inheritanceMode}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed">
                {marker.effectDescription}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* RECORD CONDITION MODAL */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Binary className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Record Genetic Condition Result</h3>
              </div>
              <button
                onClick={() => setRecordModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordResult} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Animal</label>
                <select
                  value={newAnimalId}
                  onChange={(e) => setNewAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.primaryIdentifier || a.internalId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Genetic Condition</label>
                  <select
                    value={newConditionCode}
                    onChange={(e) => setNewConditionCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    {geneticConditions.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    <option value="TESTED_FREE">TESTED_FREE (Clear)</option>
                    <option value="CARRIER">CARRIER (Heterozygous)</option>
                    <option value="AFFECTED">AFFECTED (Homozygous Recessive)</option>
                    <option value="INFERRED_FREE">INFERRED_FREE (Pedigree)</option>
                    <option value="INFERRED_CARRIER">INFERRED_CARRIER (Pedigree)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Evidence Source</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    <option value="RECORDED_TEST">Certified Diagnostic Laboratory</option>
                    <option value="COMMERCIAL_CHIP">Illumina / GGP BeadChip Array</option>
                    <option value="PEDIGREE_INFERRED">Pedigree Inference (Estimated)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Certificate / Assay ID</label>
                  <input
                    type="text"
                    placeholder="e.g. CERT-2026-99182"
                    value={newLabCertificate}
                    onChange={(e) => setNewLabCertificate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Diagnostic Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Tested homozygous hornless foundation line"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
