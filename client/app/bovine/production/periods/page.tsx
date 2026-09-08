'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  Milk,
  Scale,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { ProductionPeriodType } from '@/lib/bovine-types';

export default function BovineProductionPeriodsPage() {
  const {
    session,
    farms,
    animals,
    productionPeriods,
    addProductionPeriod,
    closeProductionPeriod,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formPeriodType, setFormPeriodType] = useState<ProductionPeriodType>('LACTATION');
  const [formCycleNumber, setFormCycleNumber] = useState(1);
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');

  const filteredPeriods = productionPeriods.filter((p) => {
    const anim = animals.find((a) => a.id === p.animalId);
    const periodType = p.periodType || p.type || '';
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (typeFilter !== 'ALL' && periodType !== typeFilter && p.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      const matchType = periodType.toLowerCase().includes(q);
      return matchAnim || matchType;
    }
    return true;
  });

  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId) return;

    addProductionPeriod({
      animalId: formAnimalId,
      periodType: formPeriodType,
      cycleNumber: Number(formCycleNumber),
      startDate: formStartDate,
      status: 'ACTIVE',
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
            <Link href="/bovine/production" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Production Hub</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Production Periods</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Bounded Production Periods</h1>
          <p className="text-xs text-stone-500 mt-1">
            Milking lactations, beef backgrounding and finishing phases, and dry-off cycles.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Start Production Period
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search animal or period type..."
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
          <option value="ALL">All Period Types</option>
          <option value="LACTATION">Lactation Cycles</option>
          <option value="BEEF_FINISHING">Beef Finishing</option>
          <option value="BACKGROUNDING">Backgrounding / Grower</option>
          <option value="DRY_PERIOD">Dry Periods</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Period Type</th>
                <th className="py-3.5 px-4">Cycle #</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">End Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredPeriods.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No production periods recorded.
                  </td>
                </tr>
              ) : (
                filteredPeriods.map((p) => {
                  const anim = animals.find((a) => a.id === p.animalId);
                  const isActive = p.status === 'ACTIVE';

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        {anim ? (
                          <Link
                            href={`/bovine/animals/${anim.id}/production`}
                            className="font-bold text-stone-900 hover:text-emerald-800"
                          >
                            {anim.name}
                          </Link>
                        ) : (
                          <span className="font-bold text-stone-900">Unknown</span>
                        )}
                        <div className="font-mono text-[11px] text-stone-400">
                          {anim?.primaryIdentifier || anim?.internalId}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {(p.periodType || p.type || 'PERIOD').replace(/_/g, ' ')}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-800">
                        #{p.cycleNumber ?? p.sequence ?? 1}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {p.startDate || (p.startedAt ? p.startedAt.split('T')[0] : '—')}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {p.endDate || (p.endedAt ? p.endedAt.split('T')[0] : '—')}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        {isActive && (
                          <button
                            onClick={() => closeProductionPeriod(p.id, 'Scheduled cycle end')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                          >
                            Close / Dry-Off
                          </button>
                        )}
                        <Link
                          href={`/bovine/animals/${p.animalId}/production`}
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

      {/* Modal: Start Production Period */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Calendar className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Start Production Period</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePeriod} className="space-y-3.5 text-xs">
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
                      {a.name} ({a.primaryIdentifier || a.internalId}) - {a.useStatus}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Period Type</label>
                  <select
                    value={formPeriodType}
                    onChange={(e) => setFormPeriodType(e.target.value as ProductionPeriodType)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="LACTATION">Lactation Cycle</option>
                    <option value="BEEF_FINISHING">Beef Finishing</option>
                    <option value="BACKGROUNDING">Backgrounding</option>
                    <option value="DRY_PERIOD">Dry Period</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cycle Number</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formCycleNumber}
                    onChange={(e) => setFormCycleNumber(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Parity 2 fresh cow entered high TMR pen..."
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
                  Start Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
