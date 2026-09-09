'use client';

import React from 'react';
import { Truck } from 'lucide-react';
import { Farm, Herd } from '@/lib/bovine-types';

interface AnimalsBulkMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  bulkDestinationFarm: string;
  setBulkDestinationFarm: (farm: string) => void;
  bulkDestinationHerd: string;
  setBulkDestinationHerd: (herd: string) => void;
  bulkMoveReason: string;
  setBulkMoveReason: (reason: string) => void;
  farms: Farm[];
  herds: Herd[];
  onSubmit: (e: React.FormEvent) => void;
}

export function AnimalsBulkMoveModal({
  isOpen,
  onClose,
  selectedCount,
  bulkDestinationFarm,
  setBulkDestinationFarm,
  bulkDestinationHerd,
  setBulkDestinationHerd,
  bulkMoveReason,
  setBulkMoveReason,
  farms,
  herds,
  onSubmit,
}: AnimalsBulkMoveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">Transfer Livestock Group</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-stone-600">
          You are executing a permanent or temporary placement transfer for <strong>{selectedCount}</strong> selected animals.
        </p>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Destination Farm</label>
          <select
            value={bulkDestinationFarm}
            onChange={(e) => setBulkDestinationFarm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.code}) - {f.type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Destination Herd (Optional)</label>
          <select
            value={bulkDestinationHerd}
            onChange={(e) => setBulkDestinationHerd(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">Keep / Default Herd</option>
            {herds
              .filter((h) => h.farmId === bulkDestinationFarm)
              .map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.purpose})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Movement Reason</label>
          <select
            value={bulkMoveReason}
            onChange={(e) => setBulkMoveReason(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="MANAGEMENT_ROTATION">Management Rotation</option>
            <option value="BREEDING_TRANSFER">Breeding Transfer / Nucleus</option>
            <option value="OPU_ET_COLLECTION">OPU / Embryo Transfer Collection</option>
            <option value="CALVING_RELOCATION">Calving Barn Relocation</option>
            <option value="QUARANTINE">Quarantine &amp; Isolation</option>
          </select>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 cursor-pointer"
          >
            Confirm Transfer
          </button>
        </div>
      </form>
    </div>
  );
}
