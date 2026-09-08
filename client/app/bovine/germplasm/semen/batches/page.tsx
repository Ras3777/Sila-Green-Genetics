'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import {
  TestTubes,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  Package,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export default function SemenBatchesInventoryPage() {
  const { semenBatches, updateSemenBatch, addAuditEvent } = useBreeding();
  const { session } = useBovine();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Inventory adjustment modal state
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [targetBatchId, setTargetBatchId] = useState<string | null>(null);
  const [deltaDoses, setDeltaDoses] = useState(-5);
  const [adjustReason, setAdjustReason] = useState('Field AI Dispensation');

  const filtered = semenBatches.filter((b) => {
    if (typeFilter !== 'ALL' && b.semenType !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.batchCode.toLowerCase().includes(q) ||
        b.sireName.toLowerCase().includes(q) ||
        (b.sirePrimaryIdentifier?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const handleOpenAdjust = (batchId: string) => {
    setTargetBatchId(batchId);
    setDeltaDoses(-10);
    setAdjustReason('Field AI Dispensation');
    setAdjustModalOpen(true);
  };

  const handleSaveAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBatchId) return;

    const batch = semenBatches.find((b) => b.id === targetBatchId);
    if (!batch) return;

    const newAvailable = Math.max(0, batch.availableDoses + Number(deltaDoses));
    const newDistributed = (batch.distributedDoses ?? 0) + Math.max(0, -Number(deltaDoses));

    updateSemenBatch(targetBatchId, {
      availableDoses: newAvailable,
      distributedDoses: newDistributed,
      status: newAvailable === 0 ? 'DEPLETED' : batch.status,
    });

    addAuditEvent({
      actorId: session.userId,
      actorName: session.name,
      action: 'UPDATE_SEMEN_BATCH',
      entityType: 'SemenBatch',
      entityId: targetBatchId,
      entityDisplay: `${batch.batchCode} (${batch.sireName})`,
      reason: `Adjusted inventory by ${deltaDoses} straws: ${adjustReason}`,
      source: 'WEB_APPLICATION',
      correlationId: `corr-${Date.now()}`,
    });

    setAdjustModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 mb-1">
            <Link href="/bovine/germplasm" className="hover:text-stone-800">
              Germplasm
            </Link>
            <span>/</span>
            <Link href="/bovine/germplasm/semen" className="hover:text-stone-800">
              Semen
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Batches</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Semen Straw Batch Inventory</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Liquid nitrogen tank coordinates, straw quantities, post-thaw motility assays, and field dispensation.
          </p>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search batch code, sire name, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-stone-600">
          <span className="font-medium">Semen Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5"
          >
            <option value="ALL">All Types</option>
            <option value="CONVENTIONAL">Conventional</option>
            <option value="SEXED_FEMALE_4M">Sexed Ultra 4M (Female)</option>
            <option value="SEXED_MALE_4M">Sexed Ultra 4M (Male)</option>
          </select>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Batch Code</th>
              <th className="p-3.5">Sire Animal</th>
              <th className="p-3.5">Semen Type</th>
              <th className="p-3.5">Cryo Coordinates</th>
              <th className="p-3.5">Post-Thaw Motility</th>
              <th className="p-3.5">Available / Produced</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filtered.map((batch) => (
              <tr key={batch.id} className="hover:bg-stone-50">
                <td className="p-3.5">
                  <span className="font-mono font-bold text-emerald-950">{batch.batchCode}</span>
                  <div className="text-[10px] text-stone-400">Frozen: {batch.freezeDate}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-stone-900">{batch.sireName}</div>
                  <div className="text-[11px] font-mono text-stone-500">{batch.sirePrimaryIdentifier}</div>
                </td>
                <td className="p-3.5">
                  <span
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                      batch.semenType.startsWith('SEXED')
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {batch.semenType}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-stone-800">
                  {batch.storageLocation ? (
                    <>
                      <span className="font-bold text-stone-900">{batch.storageLocation.tank}</span> / Can{' '}
                      {batch.storageLocation.canister} / Cane {batch.storageLocation.cane}
                    </>
                  ) : (
                    <span className="text-stone-400">Cryo Tank 1</span>
                  )}
                </td>
                <td className="p-3.5 font-mono font-bold text-stone-900">
                  {batch.postThawMotilityPct}% Motile
                </td>
                <td className="p-3.5 font-mono">
                  <strong className="text-emerald-800 text-sm">{batch.availableDoses}</strong>
                  <span className="text-stone-400 text-xs font-normal"> / {batch.totalDosesProduced}</span>
                </td>
                <td className="p-3.5">
                  <span
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded uppercase ${
                      batch.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : batch.status === 'DEPLETED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {batch.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => handleOpenAdjust(batch.id)}
                    className="text-stone-600 hover:text-stone-900 font-semibold text-xs px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded"
                  >
                    Dispense / Adjust
                  </button>
                  <Link
                    href={`/bovine/germplasm/semen/${batch.id}`}
                    className="text-emerald-800 hover:text-emerald-700 font-semibold text-xs"
                  >
                    Inspect
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Modal */}
      {adjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">Adjust Semen Straw Inventory</h3>
            <form onSubmit={handleSaveAdjust} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Quantity Adjustment (Negative to dispense, Positive to receive) *
                </label>
                <input
                  type="number"
                  required
                  value={deltaDoses}
                  onChange={(e) => setDeltaDoses(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded-lg p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Reason / Work Order *</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
