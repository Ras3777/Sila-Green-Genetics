'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Milk,
  Scale,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  Calendar,
  Layers,
  BarChart2,
} from 'lucide-react';
import { ProductionRecordType } from '@/lib/bovine-types';

export default function BovineProductionRecordsPage() {
  const {
    session,
    farms,
    animals,
    productionRecords,
    productionPeriods,
    addProductionRecord,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formRecordType, setFormRecordType] = useState<ProductionRecordType>('MILK_TEST_DAY');
  const [formRecordDate, setFormRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [formMilkYield, setFormMilkYield] = useState<number | ''>(38.5);
  const [formFatPct, setFormFatPct] = useState<number | ''>(3.8);
  const [formProteinPct, setFormProteinPct] = useState<number | ''>(3.2);
  const [formSCC, setFormSCC] = useState<number | ''>(120);
  const [formDIM, setFormDIM] = useState<number | ''>(65);
  const [formWeight, setFormWeight] = useState<number | ''>(580);
  const [formADG, setFormADG] = useState<number | ''>(1.4);
  const [formNotes, setFormNotes] = useState('');

  const filteredRecords = productionRecords.filter((r) => {
    const anim = animals.find((a) => a.id === r.animalId);
    const recType = r.recordType || r.type || '';
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (typeFilter !== 'ALL' && recType !== typeFilter && r.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      const matchType = recType.toLowerCase().includes(q);
      return matchAnim || matchType;
    }
    return true;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId) return;

    const activePeriod = productionPeriods.find((p) => p.animalId === formAnimalId && p.status === 'ACTIVE');

    addProductionRecord({
      animalId: formAnimalId,
      productionPeriodId: activePeriod?.id,
      recordType: formRecordType,
      recordDate: formRecordDate,
      milkYieldKg: formRecordType === 'MILK_TEST_DAY' && formMilkYield !== '' ? Number(formMilkYield) : undefined,
      fatPercentage: formRecordType === 'MILK_TEST_DAY' && formFatPct !== '' ? Number(formFatPct) : undefined,
      proteinPercentage: formRecordType === 'MILK_TEST_DAY' && formProteinPct !== '' ? Number(formProteinPct) : undefined,
      somaticCellCount: formRecordType === 'MILK_TEST_DAY' && formSCC !== '' ? Number(formSCC) : undefined,
      daysInMilk: formRecordType === 'MILK_TEST_DAY' && formDIM !== '' ? Number(formDIM) : undefined,
      bodyWeightKg: formWeight !== '' ? Number(formWeight) : undefined,
      dailyGainKg: formADG !== '' ? Number(formADG) : undefined,
      recordedByName: session.name,
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
            <span className="font-semibold text-stone-900">Production Records</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Production Records Ledger</h1>
          <p className="text-xs text-stone-500 mt-1">
            Milk meter test days, component lab samples (fat/protein/SCC), and scale body weights.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Log Production Record
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search animal or record type..."
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
          <option value="ALL">All Record Types</option>
          <option value="MILK_TEST_DAY">Milk Test Days</option>
          <option value="BEEF_WEIGHT">Scale Body Weights</option>
          <option value="CARCASS">Carcass Grading</option>
        </select>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Record Type</th>
                <th className="py-3.5 px-4">Test Date</th>
                <th className="py-3.5 px-4">Milk Yield</th>
                <th className="py-3.5 px-4">Fat / Protein / SCC</th>
                <th className="py-3.5 px-4">Weight / ADG</th>
                <th className="py-3.5 px-4">DIM</th>
                <th className="py-3.5 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No production records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const anim = animals.find((a) => a.id === r.animalId);
                  const recordType = r.recordType || r.type || 'RECORD';
                  const recordDate = r.recordDate || (r.recordedAt ? r.recordedAt.split('T')[0] : '—');
                  const milkYield = r.milkYieldKg ?? (recordType === 'MILK_TEST_DAY' || r.type === 'MILK_YIELD' ? r.value : undefined);
                  const bodyWeight = r.bodyWeightKg ?? (recordType === 'BEEF_WEIGHT' || r.type === 'BODY_WEIGHT' ? r.value : undefined);
                  const dailyGain = r.dailyGainKg ?? (r.type === 'AVERAGE_DAILY_GAIN' ? r.value : undefined);
                  const fatPct = r.fatPercentage ?? (r.type === 'MILK_FAT_PCT' ? r.value : undefined);
                  const proPct = r.proteinPercentage ?? (r.type === 'MILK_PROTEIN_PCT' ? r.value : undefined);
                  const scc = r.somaticCellCount ?? (r.type === 'SOMATIC_CELL_COUNT' ? r.value : undefined);

                  return (
                    <tr key={r.id} className="hover:bg-stone-50/50 transition-colors">
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
                        {recordType.replace(/_/g, ' ')}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {recordDate}
                      </td>

                      <td className="py-3 px-4">
                        {milkYield !== undefined ? (
                          <span className="font-mono font-bold text-stone-900">
                            {milkYield} kg
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {fatPct !== undefined || proPct !== undefined ? (
                          <div className="text-[11px] font-mono">
                            {fatPct !== undefined && <>F: <strong className="text-stone-800">{fatPct}%</strong></>}
                            {proPct !== undefined && <> • P: <strong className="text-stone-800">{proPct}%</strong></>}
                            {scc && (
                              <span className="text-stone-400"> (SCC: {scc}k)</span>
                            )}
                          </div>
                        ) : scc ? (
                          <span className="text-stone-500 font-mono text-[11px]">SCC: {scc}k</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {bodyWeight !== undefined ? (
                          <span className="font-mono font-bold text-stone-900">
                            {bodyWeight} kg
                            {dailyGain !== undefined ? ` (+${dailyGain}kg/d)` : ''}
                          </span>
                        ) : dailyGain !== undefined ? (
                          <span className="font-mono font-bold text-emerald-800">
                            +{dailyGain} kg/d ADG
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-600">
                        {r.daysInMilk ? `${r.daysInMilk}d` : '—'}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {r.recordedByName || 'System Auto'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Production Record */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Milk className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Log Production Record</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3.5 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Record Type</label>
                  <select
                    value={formRecordType}
                    onChange={(e) => setFormRecordType(e.target.value as ProductionRecordType)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="MILK_TEST_DAY">Milk Test Day</option>
                    <option value="BEEF_WEIGHT">Beef Scale Weight</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formRecordDate}
                    onChange={(e) => setFormRecordDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
              </div>

              {formRecordType === 'MILK_TEST_DAY' ? (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Milk Yield (kg/day)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formMilkYield}
                        onChange={(e) => setFormMilkYield(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Days in Milk (DIM)
                      </label>
                      <input
                        type="number"
                        value={formDIM}
                        onChange={(e) => setFormDIM(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Fat %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formFatPct}
                        onChange={(e) => setFormFatPct(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Protein %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formProteinPct}
                        onChange={(e) => setFormProteinPct(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">SCC (x1000)</label>
                      <input
                        type="number"
                        value={formSCC}
                        onChange={(e) => setFormSCC(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Body Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={formWeight}
                        onChange={(e) => setFormWeight(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Daily Gain ADG (kg/d)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={formADG}
                        onChange={(e) => setFormADG(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Morning milking, in-line conductivity normal..."
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
