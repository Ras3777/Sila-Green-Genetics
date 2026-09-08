'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Stethoscope,
  Search,
  Filter,
  ArrowLeft,
  Activity,
  Plus,
  X,
  FileCheck2,
  Calendar,
  AlertCircle,
  Tag,
} from 'lucide-react';

export default function BovineDiagnosesPage() {
  const {
    session,
    farms,
    animals,
    diagnoses,
    healthEvents,
    addDiagnosis,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formHealthEventId, setFormHealthEventId] = useState('');
  const [formDiseaseCode, setFormDiseaseCode] = useState('');
  const [formDiseaseName, setFormDiseaseName] = useState('');
  const [formConfidence, setFormConfidence] = useState<'CONFIRMED' | 'SUSPECTED'>('CONFIRMED');
  const [formNotes, setFormNotes] = useState('');

  const filteredDiagnoses = diagnoses.filter((d) => {
    const parentEvent = healthEvents.find((he) => he.id === d.healthEventId);
    const anim = parentEvent ? animals.find((a) => a.id === parentEvent.animalId) : null;

    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (confidenceFilter !== 'ALL' && d.confidence !== confidenceFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDisease =
        (d.diseaseName?.toLowerCase().includes(q) ?? false) ||
        (d.diseaseCode?.toLowerCase().includes(q) ?? false);
      const matchAnimal = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      return Boolean(matchDisease || matchAnimal);
    }
    return true;
  });

  const handleAddDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHealthEventId || !formDiseaseName) return;

    const parentEvent = healthEvents.find((he) => he.id === formHealthEventId);

    addDiagnosis({
      healthEventId: formHealthEventId,
      animalId: parentEvent?.animalId,
      diseaseCode: formDiseaseCode || 'DX-CLINICAL',
      diseaseName: formDiseaseName,
      diagnosedAt: new Date().toISOString(),
      diagnosedByName: session.name,
      confidence: formConfidence,
      notes: formNotes,
    });

    setIsModalOpen(false);
    setFormHealthEventId('');
    setFormDiseaseCode('');
    setFormDiseaseName('');
    setFormNotes('');
  };

  // Open cases available for new diagnoses
  const openCases = healthEvents.filter((he) => he.status !== 'RESOLVED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <Link href="/bovine/health" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Health Hub</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Diagnoses Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Clinical Diagnoses Registry</h1>
          <p className="text-xs text-stone-500 mt-1">
            Standardized ICD/Veterinary clinical condition classifications mapped across open and historical cases.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Record Diagnosis
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search diagnoses or animal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>

        <select
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value)}
          className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800 w-full md:w-auto"
        >
          <option value="ALL">All Confidences</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SUSPECTED">Suspected</option>
        </select>
      </div>

      {/* Diagnoses Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Disease / Condition</th>
                <th className="py-3.5 px-4">Standard Code</th>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Diagnosed Date</th>
                <th className="py-3.5 px-4">Clinician</th>
                <th className="py-3.5 px-4">Clinical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredDiagnoses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No clinical diagnoses found.
                  </td>
                </tr>
              ) : (
                filteredDiagnoses.map((d) => {
                  const parentEvent = healthEvents.find((he) => he.id === d.healthEventId);
                  const anim = parentEvent ? animals.find((a) => a.id === parentEvent.animalId) : null;

                  return (
                    <tr key={d.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {d.diseaseName}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-emerald-800 font-semibold">
                        {d.diseaseCode}
                      </td>

                      <td className="py-3 px-4">
                        {anim ? (
                          <Link
                            href={`/bovine/animals/${anim.id}/health`}
                            className="font-semibold text-stone-900 hover:text-emerald-800"
                          >
                            {anim.name} <span className="font-mono text-stone-400">({anim.primaryIdentifier})</span>
                          </Link>
                        ) : (
                          <span className="text-stone-400">Unknown</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            d.confidence === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {d.confidence}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {new Date(d.diagnosedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {d.diagnosedByName}
                      </td>

                      <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                        {d.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Diagnosis */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-emerald-800" />
                <h2 className="text-base font-bold text-stone-900">Record Veterinary Diagnosis</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDiagnosis} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Health Case *</label>
                <select
                  required
                  value={formHealthEventId}
                  onChange={(e) => setFormHealthEventId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="">Select active case...</option>
                  {openCases.map((he) => {
                    const anim = animals.find((a) => a.id === he.animalId);
                    return (
                      <option key={he.id} value={he.id}>
                        {anim?.name} ({anim?.primaryIdentifier}) - {he.reason}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Disease / Condition Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subacute Ruminal Acidosis, Bovine Respiratory Disease..."
                  value={formDiseaseName}
                  onChange={(e) => setFormDiseaseName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">ICD/SNOMED Code</label>
                  <input
                    type="text"
                    placeholder="e.g. DX-MAST-01"
                    value={formDiseaseCode}
                    onChange={(e) => setFormDiseaseCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Confidence</label>
                  <select
                    value={formConfidence}
                    onChange={(e) => setFormConfidence(e.target.value as 'CONFIRMED' | 'SUSPECTED')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SUSPECTED">Suspected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Clinical Findings & Etiology</label>
                <textarea
                  rows={3}
                  placeholder="Laboratory culturing, auscultation, symptoms..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl shadow-xs"
                >
                  Save Diagnosis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
