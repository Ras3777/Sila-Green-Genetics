'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Pill,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowLeft,
  Plus,
  X,
  ShieldCheck,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { MedicationAdministrationStatus } from '@/lib/bovine-types';

export default function BovineMedicationsPage() {
  const {
    session,
    farms,
    animals,
    medicationAdministrations,
    treatments,
    recordMedicationGiven,
    addMedicationAdministration,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [batchInput, setBatchInput] = useState('LOT-2026-X');
  const [notesInput, setNotesInput] = useState('');

  // New Administration form
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formTreatmentId, setFormTreatmentId] = useState('');
  const [formMedication, setFormMedication] = useState('');
  const [formDose, setFormDose] = useState(10);
  const [formDoseUnit, setFormDoseUnit] = useState('mL');
  const [formRoute, setFormRoute] = useState<'SUBCUTANEOUS' | 'INTRAMUSCULAR' | 'INTRAMAMMARY' | 'ORAL' | 'TOPICAL'>('SUBCUTANEOUS');

  const filteredMeds = medicationAdministrations.filter((m) => {
    const anim = animals.find((a) => a.id === m.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMed = m.medication.toLowerCase().includes(q);
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      return matchMed || matchAnim;
    }
    return true;
  });

  const handleConfirmGiven = (adminId: string) => {
    recordMedicationGiven(adminId, batchInput, notesInput);
    setSelectedAdminId(null);
    setNotesInput('');
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId || !formMedication) return;

    addMedicationAdministration({
      animalId: formAnimalId,
      treatmentId: formTreatmentId || undefined,
      administeredAt: new Date().toISOString(),
      medication: formMedication,
      dose: Number(formDose),
      doseUnit: formDoseUnit,
      route: formRoute,
      status: 'PENDING',
      administeredByName: session.name,
      notes: 'Scheduled by farm manager',
    });

    setIsModalOpen(false);
    setFormAnimalId('');
    setFormTreatmentId('');
    setFormMedication('');
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
            <span className="font-semibold text-stone-900">Medications</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Medication Administration Worklist</h1>
          <p className="text-xs text-stone-500 mt-1">
            Daily scheduled drug administrations, batch lot verification, and audit sign-off.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Schedule Dose
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medication or animal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800 w-full md:w-auto"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending (Due)</option>
          <option value="GIVEN">Given (Administered)</option>
          <option value="SKIPPED">Skipped</option>
        </select>
      </div>

      {/* Worklist Cards / Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Medication & Dose</th>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Route</th>
                <th className="py-3.5 px-4">Scheduled / Given Date</th>
                <th className="py-3.5 px-4">Batch / Lot</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredMeds.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No medication administration records found.
                  </td>
                </tr>
              ) : (
                filteredMeds.map((m) => {
                  const anim = animals.find((a) => a.id === m.animalId);
                  const isGiven = m.status === 'GIVEN';

                  return (
                    <tr key={m.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isGiven
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isGiven ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Given
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{m.medication}</div>
                        <div className="text-[11px] text-stone-500">
                          {m.dose} {m.doseUnit}
                        </div>
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

                      <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                        {m.route?.replace(/_/g, ' ') || 'N/A'}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {new Date(m.administeredAt).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        {m.batchNumber ? (
                          <span className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-700">
                            {m.batchNumber}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Not set</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {m.administeredByName || '—'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {!isGiven ? (
                          <button
                            onClick={() => setSelectedAdminId(m.id)}
                            className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-2xs transition-colors"
                          >
                            Record Given
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-800 font-semibold">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Quick Record Given */}
      {selectedAdminId && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Sign Off Medication Dose</h2>
              </div>
              <button
                onClick={() => setSelectedAdminId(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Verify drug vial lot number and record any side observations during delivery.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Batch / Lot Number</label>
                <input
                  type="text"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-mono focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Clinical Observation Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Swelling reduced, good tolerance..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedAdminId(null)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmGiven(selectedAdminId)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Confirm Given
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule New Dose */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Pill className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Schedule Medication Dose</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedication} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Animal *</label>
                <select
                  required
                  value={formAnimalId}
                  onChange={(e) => setFormAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="">Select animal...</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.primaryIdentifier || a.internalId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Medication / Compound Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Banamine Injectable, Draxxin, Polyflex..."
                  value={formMedication}
                  onChange={(e) => setFormMedication(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dose Amount</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formDose}
                    onChange={(e) => setFormDose(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={formDoseUnit}
                    onChange={(e) => setFormDoseUnit(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Administration Route</label>
                <select
                  value={formRoute}
                  onChange={(e) => setFormRoute(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="SUBCUTANEOUS">Subcutaneous (SQ)</option>
                  <option value="INTRAMUSCULAR">Intramuscular (IM)</option>
                  <option value="INTRAMAMMARY">Intramammary</option>
                  <option value="ORAL">Oral</option>
                  <option value="TOPICAL">Topical</option>
                </select>
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
                  Schedule Dose
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
