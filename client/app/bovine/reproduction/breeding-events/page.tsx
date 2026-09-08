'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  GitBranch,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart,
} from 'lucide-react';
import { BreedingEventType } from '@/lib/bovine-types';

export default function BovineBreedingEventsPage() {
  const {
    session,
    farms,
    animals,
    breedingEvents,
    breedingCycles,
    addBreedingEvent,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formSireId, setFormSireId] = useState('');
  const [formType, setFormType] = useState<BreedingEventType>('ARTIFICIAL_INSEMINATION');
  const [formBreedingDate, setFormBreedingDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStrawBatch, setFormStrawBatch] = useState('STR-2026-X');
  const [formSemenType, setFormSemenType] = useState<'CONVENTIONAL' | 'SEXED_FEMALE' | 'SEXED_MALE'>('SEXED_FEMALE');
  const [formTechnician, setFormTechnician] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const filteredEvents = breedingEvents.filter((b) => {
    const anim = animals.find((a) => a.id === b.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (typeFilter !== 'ALL' && b.breedingType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      const matchSire = b.sireName?.toLowerCase().includes(q) || b.sireIdentifier?.toLowerCase().includes(q);
      return matchAnim || matchSire;
    }
    return true;
  });

  const handleCreateBreeding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId) return;

    const sire = animals.find((a) => a.id === formSireId);

    // Calculate expected calving date (approx 283 days gestation)
    const breedDateObj = new Date(formBreedingDate);
    const expCalv = new Date(breedDateObj.getTime() + 283 * 86400000).toISOString().split('T')[0];

    // Find active cycle if exists
    const activeCycle = breedingCycles.find((c) => c.animalId === formAnimalId && c.status !== 'CLOSED');

    addBreedingEvent({
      animalId: formAnimalId,
      breedingCycleId: activeCycle?.id,
      breedingType: formType,
      breedingDate: formBreedingDate,
      sireId: formSireId || undefined,
      sireName: sire?.name || (formSireId ? 'Selected Sire' : 'Commercial Straw Sire'),
      sireIdentifier: sire?.primaryIdentifier || 'SIRE-ID',
      semenStrawBatchCode: formStrawBatch,
      semenSexType: formSemenType,
      technicianName: formTechnician || session.name,
      expectedCalvingDate: expCalv,
      notes: formNotes,
    });

    setIsModalOpen(false);
    setFormAnimalId('');
    setFormSireId('');
    setFormNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <Link href="/bovine/reproduction" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Reproduction Hub</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Inseminations</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Breeding & Insemination Ledger</h1>
          <p className="text-xs text-stone-500 mt-1">
            Artificial insemination (AI), natural service, and embryo transfer logs with straw lot verification.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Log Breeding / AI Event
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dam, sire, or technician..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800 w-full md:w-auto"
        >
          <option value="ALL">All Breeding Types</option>
          <option value="ARTIFICIAL_INSEMINATION">Artificial Insemination (AI)</option>
          <option value="NATURAL_SERVICE">Natural Service</option>
          <option value="EMBRYO_TRANSFER">Embryo Transfer (ET)</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Dam / Female</th>
                <th className="py-3.5 px-4">Breeding Method</th>
                <th className="py-3.5 px-4">Sire Information</th>
                <th className="py-3.5 px-4">Straw Batch / Semen</th>
                <th className="py-3.5 px-4">Breeding Date</th>
                <th className="py-3.5 px-4">Expected Calving</th>
                <th className="py-3.5 px-4">Technician</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No breeding events recorded.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((b) => {
                  const dam = animals.find((a) => a.id === b.animalId);
                  return (
                    <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        {dam ? (
                          <Link
                            href={`/bovine/animals/${dam.id}/reproduction`}
                            className="font-bold text-stone-900 hover:text-emerald-800"
                          >
                            {dam.name}
                          </Link>
                        ) : (
                          <span className="font-bold text-stone-900">Unknown Dam</span>
                        )}
                        <div className="font-mono text-[11px] text-stone-400">
                          {dam?.primaryIdentifier || dam?.internalId}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-200">
                          {(b.breedingType || b.eventType || 'AI').replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{b.sireName}</div>
                        <div className="font-mono text-[10px] text-stone-400">{b.sireIdentifier}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-[11px] text-stone-700">
                          {b.semenStrawBatchCode || '—'}
                        </div>
                        {b.semenSexType && (
                          <span className="text-[10px] text-purple-700 font-semibold uppercase">
                            {b.semenSexType.replace(/_/g, ' ')}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {b.breedingDate}
                      </td>

                      <td className="py-3 px-4 font-mono text-emerald-800 font-semibold">
                        {b.expectedCalvingDate}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {b.technicianName}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Breeding Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <GitBranch className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Log Insemination / Breeding</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBreeding} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Dam *</label>
                  <select
                    required
                    value={formAnimalId}
                    onChange={(e) => setFormAnimalId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="">Select dam...</option>
                    {animals
                      .filter((a) => a.sex === 'FEMALE')
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.primaryIdentifier || a.internalId})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Service Sire</label>
                  <select
                    value={formSireId}
                    onChange={(e) => setFormSireId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="">Select bull / sire...</option>
                    {animals
                      .filter((a) => a.sex === 'MALE')
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.primaryIdentifier || a.internalId})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Breeding Method</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as BreedingEventType)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="ARTIFICIAL_INSEMINATION">Artificial Insemination (AI)</option>
                    <option value="NATURAL_SERVICE">Natural Service</option>
                    <option value="EMBRYO_TRANSFER">Embryo Transfer (ET)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Breeding Date</label>
                  <input
                    type="date"
                    required
                    value={formBreedingDate}
                    onChange={(e) => setFormBreedingDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Straw Lot / Batch</label>
                  <input
                    type="text"
                    value={formStrawBatch}
                    onChange={(e) => setFormStrawBatch(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-mono focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Semen Type</label>
                  <select
                    value={formSemenType}
                    onChange={(e) => setFormSemenType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="SEXED_FEMALE">Sexed Female (XX)</option>
                    <option value="CONVENTIONAL">Conventional</option>
                    <option value="SEXED_MALE">Sexed Male (XY)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Technician / Inseminator</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Jenkins, Certified AI Tech Ramos"
                  value={formTechnician}
                  onChange={(e) => setFormTechnician(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Breeding Observations</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Uterine tone good, cervical mucus clear, thawed at 36.5°C for 45 sec..."
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
                  Record Breeding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
