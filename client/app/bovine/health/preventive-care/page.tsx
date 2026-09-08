'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PreventiveCareType } from '@/lib/bovine-types';

export default function BovinePreventiveCarePage() {
  const {
    session,
    farms,
    animals,
    preventiveCareEvents,
    addPreventiveCareEvent,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formType, setFormType] = useState<PreventiveCareType>('HOOF_TRIMMING');
  const [formProduct, setFormProduct] = useState('');
  const [formNextDueDate, setFormNextDueDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const filteredEvents = preventiveCareEvents.filter((p) => {
    const anim = animals.find((a) => a.id === p.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (typeFilter !== 'ALL' && p.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchType = p.type.toLowerCase().includes(q);
      const matchProd = p.productName?.toLowerCase().includes(q);
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      return matchType || matchProd || matchAnim;
    }
    return true;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId) return;

    addPreventiveCareEvent({
      animalId: formAnimalId,
      type: formType,
      administeredAt: new Date().toISOString(),
      productName: formProduct || undefined,
      administeredByName: session.name,
      nextDueDate: formNextDueDate || undefined,
      notes: formNotes,
    });

    setIsModalOpen(false);
    setFormAnimalId('');
    setFormProduct('');
    setFormNextDueDate('');
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
            <span className="font-semibold text-stone-900">Preventive Care</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Preventive Care & Hoof Health</h1>
          <p className="text-xs text-stone-500 mt-1">
            Routine deworming, functional hoof trimming chute records, dipping, and preventative drenching schedules.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Log Preventive Care
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search procedure, product, or animal..."
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
          <option value="ALL">All Care Types</option>
          <option value="HOOF_TRIMMING">Hoof Trimming</option>
          <option value="DEWORMING">Deworming</option>
          <option value="DIPPING">Teat / External Dipping</option>
          <option value="VITAMIN_INJECTION">Vitamin / Trace Mineral</option>
          <option value="PARASITE_CONTROL">Parasite Control</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Care Type</th>
                <th className="py-3.5 px-4">Product / Intervention</th>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Administered Date</th>
                <th className="py-3.5 px-4">Next Due Date</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No preventive care events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((p) => {
                  const anim = animals.find((a) => a.id === p.animalId);
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-900">
                          {p.type.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-medium text-emerald-800">
                        {p.productName || 'Standard Protocol'}
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

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {(p.administeredAt || p.performedAt || '').split('T')[0] || '—'}
                      </td>

                      <td className="py-3 px-4">
                        {p.nextDueDate ? (
                          <span className="font-mono text-stone-700 font-semibold text-[11px]">
                            {p.nextDueDate}
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {p.administeredByName}
                      </td>

                      <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                        {p.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Care Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Record Preventive Care</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
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
                <label className="block font-semibold text-stone-700 mb-1">Care Category *</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as PreventiveCareType)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="HOOF_TRIMMING">Hoof Trimming / Chute Service</option>
                  <option value="DEWORMING">Deworming</option>
                  <option value="DIPPING">Teat / External Dip</option>
                  <option value="VITAMIN_INJECTION">Vitamin / Multimin Injection</option>
                  <option value="PARASITE_CONTROL">External Parasite Control</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product / Protocol Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cydectin Pour-On, Multimin 90, Four-Foot Functional Trim..."
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Next Follow-Up / Booster Due</label>
                <input
                  type="date"
                  value={formNextDueDate}
                  onChange={(e) => setFormNextDueDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Technician / Findings Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Medial claws balanced, no white line lesions observed..."
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
