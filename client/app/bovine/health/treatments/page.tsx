'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Activity,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Pill,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function BovineTreatmentsPage() {
  const {
    session,
    farms,
    animals,
    healthEvents,
    treatments,
    medicationAdministrations,
    addTreatment,
    addMedicationAdministration,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formHealthEventId, setFormHealthEventId] = useState('');
  const [formProtocolName, setFormProtocolName] = useState('');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formMeatWithdrawalDays, setFormMeatWithdrawalDays] = useState(0);
  const [formMilkWithdrawalDays, setFormMilkWithdrawalDays] = useState(0);
  const [formMedication, setFormMedication] = useState('');
  const [formDose, setFormDose] = useState(10);
  const [formDoseUnit, setFormDoseUnit] = useState('mL');
  const [formRoute, setFormRoute] = useState<'SUBCUTANEOUS' | 'INTRAMUSCULAR' | 'INTRAMAMMARY' | 'ORAL' | 'TOPICAL'>('INTRAMAMMARY');
  const [formNotes, setFormNotes] = useState('');

  const filteredTreatments = treatments.filter((t) => {
    const anim = animals.find((a) => a.id === t.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchProto = t.protocolName ? t.protocolName.toLowerCase().includes(q) : false;
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      return Boolean(matchProto || matchAnim);
    }
    return true;
  });

  const handleCreateTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId || !formProtocolName) return;

    const treatId = addTreatment({
      animalId: formAnimalId,
      healthEventId: formHealthEventId || undefined,
      protocolName: formProtocolName,
      status: 'IN_PROGRESS',
      startedAt: formStartDate,
      veterinarianName: session.name,
      meatWithdrawalDays: Number(formMeatWithdrawalDays) || undefined,
      milkWithdrawalDays: Number(formMilkWithdrawalDays) || undefined,
      notes: formNotes,
    });

    // Optionally schedule first medication dose
    if (formMedication) {
      addMedicationAdministration({
        treatmentId: treatId,
        animalId: formAnimalId,
        administeredAt: new Date().toISOString(),
        medication: formMedication,
        dose: Number(formDose),
        doseUnit: formDoseUnit,
        route: formRoute,
        status: 'PENDING',
        administeredByName: session.name,
        notes: 'Initial scheduled dose',
      });
    }

    setIsModalOpen(false);
    setFormAnimalId('');
    setFormHealthEventId('');
    setFormProtocolName('');
    setFormMedication('');
    setFormNotes('');
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
            <span className="font-semibold text-stone-900">Treatment Protocols</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Treatment Protocols & Courses</h1>
          <p className="text-xs text-stone-500 mt-1">
            Active veterinary therapy regimens, prescription schedules, and withdrawal constraints.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Initiate Treatment Course
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search protocol or animal..."
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
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Treatments List */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Protocol Name</th>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Started Date</th>
                <th className="py-3.5 px-4">Withdrawal Restrictions</th>
                <th className="py-3.5 px-4">Administrations</th>
                <th className="py-3.5 px-4">Veterinarian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredTreatments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No treatment courses recorded.
                  </td>
                </tr>
              ) : (
                filteredTreatments.map((t) => {
                  const anim = animals.find((a) => a.id === t.animalId);
                  const admins = medicationAdministrations.filter((m) => m.treatmentId === t.id);
                  const givenCount = admins.filter((m) => m.status === 'GIVEN').length;

                  return (
                    <tr key={t.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{t.protocolName}</div>
                        {t.notes && <div className="text-[11px] text-stone-400 max-w-xs truncate">{t.notes}</div>}
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
                            t.status === 'IN_PROGRESS'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : t.status === 'COMPLETED'
                              ? 'bg-stone-100 text-stone-700'
                              : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          {t.status?.replace(/_/g, ' ') || 'ACTIVE'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {t.startedAt.split('T')[0]}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          {t.milkWithdrawalDays ? (
                            <span className="inline-flex items-center text-[11px] text-rose-800 font-medium">
                              <ShieldCheck className="w-3 h-3 mr-1 text-rose-600" />
                              Milk: {t.milkWithdrawalDays}d lock
                            </span>
                          ) : null}
                          {t.meatWithdrawalDays ? (
                            <span className="inline-flex items-center text-[11px] text-amber-800 font-medium">
                              <ShieldCheck className="w-3 h-3 mr-1 text-amber-600" />
                              Meat: {t.meatWithdrawalDays}d lock
                            </span>
                          ) : null}
                          {!t.milkWithdrawalDays && !t.meatWithdrawalDays && (
                            <span className="text-stone-400">None required</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-stone-900">
                          {givenCount} / {admins.length || 1}
                        </span>{' '}
                        <span className="text-[11px] text-stone-400">doses given</span>
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {t.veterinarianName}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Initiate Treatment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Activity className="w-5 h-5" />
                <h2 className="text-lg font-bold text-stone-900">Initiate Treatment Course</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTreatment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Animal *</label>
                <select
                  required
                  value={formAnimalId}
                  onChange={(e) => setFormAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="">Select an animal...</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.primaryIdentifier || a.internalId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Protocol / Regimen Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Clinical Mastitis 5-Day Intramammary Protocol"
                  value={formProtocolName}
                  onChange={(e) => setFormProtocolName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Milk Withdrawal (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={formMilkWithdrawalDays}
                    onChange={(e) => setFormMilkWithdrawalDays(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Meat Withdrawal (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={formMeatWithdrawalDays}
                    onChange={(e) => setFormMeatWithdrawalDays(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
              </div>

              {/* Initial Medication Entry */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <span className="block font-bold text-stone-800">First Medication Dose</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Drug / Compound</label>
                    <input
                      type="text"
                      placeholder="e.g. Spectramast LC"
                      value={formMedication}
                      onChange={(e) => setFormMedication(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Dose</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formDose}
                        onChange={(e) => setFormDose(Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Unit</label>
                      <input
                        type="text"
                        value={formDoseUnit}
                        onChange={(e) => setFormDoseUnit(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Route</label>
                  <select
                    value={formRoute}
                    onChange={(e) => setFormRoute(e.target.value as any)}
                    className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                  >
                    <option value="INTRAMAMMARY">Intramammary</option>
                    <option value="SUBCUTANEOUS">Subcutaneous (SQ)</option>
                    <option value="INTRAMUSCULAR">Intramuscular (IM)</option>
                    <option value="ORAL">Oral</option>
                    <option value="TOPICAL">Topical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Prescription Notes</label>
                <textarea
                  rows={2}
                  placeholder="Instructions for farm technician on administration schedule..."
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
                  Start Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
