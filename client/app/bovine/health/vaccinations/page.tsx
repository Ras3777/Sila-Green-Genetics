'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Syringe,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Tag,
  BookOpen,
} from 'lucide-react';

export default function BovineVaccinationsPage() {
  const {
    session,
    farms,
    herds,
    groups,
    animals,
    vaccineCatalog,
    vaccinationEvents,
    addVaccinationEvent,
  } = useBovine();

  const [activeTab, setActiveTab] = useState<'EVENTS' | 'CATALOG'>('EVENTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formVaccineId, setFormVaccineId] = useState('');
  const [formBatchNumber, setFormBatchNumber] = useState('LOT-VAC-2026');
  const [formDose, setFormDose] = useState(2);
  const [formDoseUnit, setFormDoseUnit] = useState('mL');
  const [formRoute, setFormRoute] = useState<'SUBCUTANEOUS' | 'INTRAMUSCULAR' | 'INTRANASAL'>('SUBCUTANEOUS');
  const [formBoosterDate, setFormBoosterDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const filteredEvents = vaccinationEvents.filter((v) => {
    const anim = animals.find((a) => a.id === v.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchVac = v.vaccineName ? v.vaccineName.toLowerCase().includes(q) : false;
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      return Boolean(matchVac || matchAnim);
    }
    return true;
  });

  const handleCreateVaccination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId || !formVaccineId) return;

    const vac = vaccineCatalog.find((v) => v.id === formVaccineId);

    addVaccinationEvent({
      vaccineId: formVaccineId,
      animalId: formAnimalId,
      vaccineName: vac?.name || 'Standard Bovine Vaccine',
      administeredAt: new Date().toISOString(),
      dose: Number(formDose),
      doseUnit: formDoseUnit,
      route: formRoute,
      batchNumber: formBatchNumber,
      administeredByName: session.name,
      boosterDueDate: formBoosterDate || undefined,
      notes: formNotes,
    });

    setIsModalOpen(false);
    setFormAnimalId('');
    setFormVaccineId('');
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
            <span className="font-semibold text-stone-900">Vaccinations</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Herd Vaccination & Immunity</h1>
          <p className="text-xs text-stone-500 mt-1">
            Preventive immunization campaigns, biological product catalog, and booster scheduling.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Log Vaccination Event
        </button>
      </div>

      {/* Tab Switcher & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-stone-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'EVENTS'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Vaccination Events ({vaccinationEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('CATALOG')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'CATALOG'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Vaccine Catalog ({vaccineCatalog.length})
          </button>
        </div>

        {activeTab === 'EVENTS' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vaccine or animal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Vaccination Events Table */}
      {activeTab === 'EVENTS' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Vaccine Product</th>
                  <th className="py-3.5 px-4">Animal</th>
                  <th className="py-3.5 px-4">Dose & Route</th>
                  <th className="py-3.5 px-4">Batch / Lot</th>
                  <th className="py-3.5 px-4">Administered Date</th>
                  <th className="py-3.5 px-4">Booster Due</th>
                  <th className="py-3.5 px-4">Technician</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      No vaccination events recorded.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((v) => {
                    const anim = animals.find((a) => a.id === v.animalId);
                    return (
                      <tr key={v.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {v.vaccineName}
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
                          <span className="font-mono">
                            {v.dose} {v.doseUnit}
                          </span>{' '}
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                            ({v.route})
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                          {v.batchNumber}
                        </td>

                        <td className="py-3 px-4 font-mono text-stone-500">
                          {v.administeredAt.split('T')[0]}
                        </td>

                        <td className="py-3 px-4">
                          {v.boosterDueDate ? (
                            <span className="font-mono text-amber-800 font-semibold text-[11px]">
                              {v.boosterDueDate}
                            </span>
                          ) : (
                            <span className="text-stone-400">None</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-stone-600">
                          {v.administeredByName}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Vaccine Catalog Grid */}
      {activeTab === 'CATALOG' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vaccineCatalog.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{cat.name}</h3>
                  <div className="font-mono text-xs text-emerald-800 font-semibold">{cat.code}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{cat.manufacturer}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                  {cat.active ? 'ACTIVE FORMULA' : 'RETIRED'}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl text-xs space-y-1">
                <div className="text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                  Disease Targets:
                </div>
                <div className="font-medium text-stone-800">{cat.diseaseTarget}</div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span>
                  Standard Dose: <strong className="text-stone-900">{cat.recommendedDose} {cat.doseUnit}</strong>
                </span>
                <span>
                  Route: <strong className="text-stone-900">{cat.route}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Log Vaccination */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Syringe className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Log Vaccination Event</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVaccination} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Animal *</label>
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
                <label className="block font-semibold text-stone-700 mb-1">Vaccine from Catalog *</label>
                <select
                  required
                  value={formVaccineId}
                  onChange={(e) => {
                    setFormVaccineId(e.target.value);
                    const selected = vaccineCatalog.find((v) => v.id === e.target.value);
                    if (selected) {
                      setFormDose(selected.recommendedDose ?? 2);
                      setFormDoseUnit(selected.doseUnit || 'ml');
                      setFormRoute(selected.route as any);
                    }
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="">Select vaccine...</option>
                  {vaccineCatalog.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.diseaseTarget})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Batch / Lot *</label>
                  <input
                    type="text"
                    required
                    value={formBatchNumber}
                    onChange={(e) => setFormBatchNumber(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-mono focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Booster Due Date</label>
                  <input
                    type="date"
                    value={formBoosterDate}
                    onChange={(e) => setFormBoosterDate(e.target.value)}
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
                  <option value="INTRANASAL">Intranasal</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observation Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes on injection site, needle gauge, animal temperament..."
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
                  Save Vaccination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
