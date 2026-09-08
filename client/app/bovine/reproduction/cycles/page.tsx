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
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { BreedingCycleStatus } from '@/lib/bovine-types';

export default function BovineBreedingCyclesPage() {
  const {
    session,
    farms,
    animals,
    breedingCycles,
    addBreedingCycle,
    closeBreedingCycle,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStatus, setFormStatus] = useState<BreedingCycleStatus>('ESTRUS');
  const [formNotes, setFormNotes] = useState('');

  const filteredCycles = breedingCycles.filter((c) => {
    const anim = animals.find((a) => a.id === c.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      const matchStatus = c.status.toLowerCase().includes(q);
      return matchAnim || matchStatus;
    }
    return true;
  });

  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId) return;

    addBreedingCycle({
      animalId: formAnimalId,
      startDate: formStartDate,
      status: formStatus,
      notes: formNotes,
    });

    setIsModalOpen(false);
    setFormAnimalId('');
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
            <span className="font-semibold text-stone-900">Breeding Cycles</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Breeding Cycles Manager</h1>
          <p className="text-xs text-stone-500 mt-1">
            Hormone synchronization protocols, estrus detection, and cycle progression milestones.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Start New Cycle
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search animal or cycle status..."
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
          <option value="ALL">All Cycle Statuses</option>
          <option value="ESTRUS">In Estrus / Heat</option>
          <option value="SYNCHRONIZED">Synchronized (CIDR/Ovsynch)</option>
          <option value="INSEMINATED">Inseminated (Bred)</option>
          <option value="PREGNANT">Confirmed Pregnant</option>
          <option value="OPEN">Open (Failed Conception)</option>
          <option value="CLOSED">Closed / Completed</option>
        </select>
      </div>

      {/* Cycles Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Cycle Status</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">End Date</th>
                <th className="py-3.5 px-4">Protocol & Observation Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredCycles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No breeding cycles found.
                  </td>
                </tr>
              ) : (
                filteredCycles.map((c) => {
                  const anim = animals.find((a) => a.id === c.animalId);
                  return (
                    <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        {anim ? (
                          <Link
                            href={`/bovine/animals/${anim.id}/reproduction`}
                            className="font-bold text-stone-900 hover:text-emerald-800"
                          >
                            {anim.name} <span className="font-mono text-stone-400">({anim.primaryIdentifier})</span>
                          </Link>
                        ) : (
                          <span className="text-stone-400">Unknown</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.status === 'PREGNANT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'ESTRUS'
                              ? 'bg-amber-100 text-amber-800'
                              : c.status === 'INSEMINATED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {c.startDate}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {c.endDate || '—'}
                      </td>

                      <td className="py-3 px-4 text-stone-600 max-w-sm truncate">
                        {c.notes || 'Natural cycling'}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        {c.status !== 'CLOSED' && (
                          <button
                            onClick={() => closeBreedingCycle(c.id, 'CLOSED')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                          >
                            Close Cycle
                          </button>
                        )}
                        <Link
                          href={`/bovine/animals/${c.animalId}/reproduction`}
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

      {/* Modal: Start New Cycle */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Activity className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Start New Breeding Cycle</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCycle} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Female Animal *</label>
                <select
                  required
                  value={formAnimalId}
                  onChange={(e) => setFormAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="">Select female...</option>
                  {animals
                    .filter((a) => a.sex === 'FEMALE')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.primaryIdentifier || a.internalId}) - {a.useStatus}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cycle Start Date</label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Initial Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as BreedingCycleStatus)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="ESTRUS">Standing Heat / Estrus</option>
                    <option value="SYNCHRONIZED">Synchronized (Protocol)</option>
                    <option value="OPEN">Open Cycling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Protocol / Synchronization Details</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 7-Day CIDR + PGF2a, Presynch-11, standing heat observed at 06:00..."
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
                  Initiate Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
