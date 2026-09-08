'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  X,
  Calendar,
  Building2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { HealthEventSeverity, HealthEventStatus } from '@/lib/bovine-types';

export default function BovineHealthCasesPage() {
  const {
    session,
    farms,
    animals,
    healthEvents,
    diagnoses,
    treatments,
    addHealthEvent,
    closeHealthEvent,
    addDiagnosis,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // New Case Form state
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formSeverity, setFormSeverity] = useState<HealthEventSeverity>('MODERATE');
  const [formNotes, setFormNotes] = useState('');
  const [formDiseaseName, setFormDiseaseName] = useState('');
  const [formDiseaseCode, setFormDiseaseCode] = useState('');
  const [formConfirmed, setFormConfirmed] = useState(true);

  // Close Case Form state
  const [closeNotes, setCloseNotes] = useState('');

  const filteredCases = healthEvents.filter((c) => {
    const anim = animals.find((a) => a.id === c.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = anim?.name.toLowerCase().includes(q);
      const matchId = anim?.primaryIdentifier?.toLowerCase().includes(q) || anim?.internalId.toLowerCase().includes(q);
      const matchReason = c.reason ? c.reason.toLowerCase().includes(q) : false;
      return Boolean(matchName || matchId || matchReason);
    }
    return true;
  });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId || !formReason) return;

    const anim = animals.find((a) => a.id === formAnimalId);
    const eventId = addHealthEvent({
      animalId: formAnimalId,
      farmId: anim?.farmId || session.activeFarmId !== 'ALL' ? (session.activeFarmId as string) : 'farm-1',
      openedAt: new Date().toISOString(),
      status: 'OPEN',
      reason: formReason,
      severity: formSeverity,
      notes: formNotes,
    });

    if (formDiseaseName) {
      addDiagnosis({
        healthEventId: eventId,
        animalId: formAnimalId,
        diseaseCode: formDiseaseCode || 'DX-GENERIC',
        diseaseName: formDiseaseName,
        diagnosedAt: new Date().toISOString(),
        diagnosedByName: session.name,
        confidence: formConfirmed ? 'CONFIRMED' : 'SUSPECTED',
        notes: formNotes,
      });
    }

    setIsModalOpen(false);
    setFormAnimalId('');
    setFormReason('');
    setFormNotes('');
    setFormDiseaseName('');
    setFormDiseaseCode('');
  };

  const handleCloseCase = (caseId: string) => {
    closeHealthEvent(caseId, closeNotes || 'Resolved following veterinary inspection');
    setSelectedCaseId(null);
    setCloseNotes('');
  };

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
            <span className="font-semibold text-stone-900">Clinical Cases</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Clinical Health Cases</h1>
          <p className="text-xs text-stone-500 mt-1">
            Comprehensive registry of herd illness, veterinary diagnosis, and resolution history.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Open New Health Case
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by animal name, ID, or illness..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_TREATMENT">Under Treatment</option>
            <option value="MONITORING">Monitoring</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CHRONIC">Chronic</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="MILD">Mild</option>
          </select>
        </div>
      </div>

      {/* Cases Ledger Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Case Reason / Complaint</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Diagnosis</th>
                <th className="py-3.5 px-4">Opened Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No clinical health cases match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  const anim = animals.find((a) => a.id === c.animalId);
                  const diag = diagnoses.find((d) => d.healthEventId === c.id);

                  return (
                    <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/bovine/animals/${c.animalId}/health`}
                          className="font-bold text-stone-900 hover:text-emerald-800"
                        >
                          {anim?.name || 'Unknown'}
                        </Link>
                        <div className="font-mono text-[11px] text-stone-400">
                          {anim?.primaryIdentifier || anim?.internalId}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900">{c.reason}</div>
                        {c.notes && (
                          <div className="text-[11px] text-stone-500 line-clamp-1">{c.notes}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : c.severity === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : c.severity === 'MODERATE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {c.severity}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            c.status === 'UNDER_TREATMENT'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : c.status === 'RESOLVED'
                              ? 'bg-stone-100 text-stone-600'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {diag ? (
                          <div>
                            <span className="font-medium text-stone-900">{diag.diseaseName}</span>
                            <div className="text-[10px] text-stone-400 font-mono">{diag.diseaseCode}</div>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">No formal diagnosis</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {new Date(c.openedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        {c.status !== 'RESOLVED' && (
                          <button
                            onClick={() => setSelectedCaseId(c.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                        <Link
                          href={`/bovine/animals/${c.animalId}/health`}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors inline-block"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Open New Health Case */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-emerald-800" />
                <h2 className="text-lg font-bold text-stone-900">Open Clinical Health Case</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Affected Animal *</label>
                <select
                  required
                  value={formAnimalId}
                  onChange={(e) => setFormAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="">Select an animal...</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.primaryIdentifier || a.internalId}) - {a.useStatus}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Clinical Reason / Chief Complaint *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Right hind sole ulcer, severe mastitis, acute bloat..."
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Severity Level</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as HealthEventSeverity)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="MILD">Mild</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Diagnosis Classification</label>
                  <input
                    type="text"
                    placeholder="e.g. Clinical Mastitis, BRD..."
                    value={formDiseaseName}
                    onChange={(e) => setFormDiseaseName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Clinical Notes & Physical Examination</label>
                <textarea
                  rows={3}
                  placeholder="Describe temperature, symptoms, appetite, locomotion..."
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
                  Record Health Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Close / Resolve Case */}
      {selectedCaseId && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Resolve Health Case</h2>
              </div>
              <button
                onClick={() => setSelectedCaseId(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Confirm this animal has recovered and meets release criteria. This will update the case status to RESOLVED and archive active veterinary alerts.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Resolution Summary</label>
              <textarea
                rows={3}
                placeholder="e.g. Quarter clean, SCC normalized, animal returned to milking herd."
                value={closeNotes}
                onChange={(e) => setCloseNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedCaseId(null)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCloseCase(selectedCaseId)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
