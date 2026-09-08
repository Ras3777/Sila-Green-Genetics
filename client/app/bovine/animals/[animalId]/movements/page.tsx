'use client';

import React, { use, useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  Truck,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function AnimalMovementsPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, movements, farms, herds, moveAnimals } = useBovine();
  const animal = animals.find((a) => a.id === animalId);
  const animalMovements = movements.filter((m) => m.animalId === animalId);

  const [destFarmId, setDestFarmId] = useState(farms[0]?.id || '');
  const [destHerdId, setDestHerdId] = useState('');
  const [moveReason, setMoveReason] = useState('MANAGEMENT_ROTATION');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!animal) return null;

  const handleCreateMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destFarmId) return;

    moveAnimals({
      animalIds: [animal.id],
      destinationFarmId: destFarmId,
      destinationHerdId: destHerdId || undefined,
      movementDate: '2026-09-04',
      reason: moveReason,
      notes: notes.trim() || undefined,
    });

    setSuccess(true);
    setNotes('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Transfer History */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
          <Truck className="w-4 h-4 text-emerald-800" />
          <span>Biosecurity Movement & Transfer Ledger</span>
        </h2>

        <div className="divide-y divide-stone-100 text-xs">
          {animalMovements.map((move) => (
            <div key={move.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2 font-bold text-stone-900 text-sm">
                  <span>{move.fromFarmName}</span>
                  <span className="text-stone-400">&rarr;</span>
                  <span className="text-emerald-800">{move.toFarmName}</span>
                </div>
                <div className="text-stone-500 mt-0.5">
                  Reason: {move.reason.replace(/_/g, ' ')} {move.notes && `• ${move.notes}`}
                </div>
              </div>

              <div className="text-right text-stone-400 font-mono text-[11px]">
                <div>Date: {move.movementDate}</div>
                <div>Ref: {move.referenceNumber}</div>
              </div>
            </div>
          ))}

          {animalMovements.length === 0 && (
            <div className="p-6 text-center text-stone-400">
              No historical inter-facility movements recorded for this animal.
            </div>
          )}
        </div>
      </div>

      {/* New Transfer Form */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
          Execute New Transfer
        </h2>

        {success && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Movement recorded and live animal placement updated.</span>
          </div>
        )}

        <form onSubmit={handleCreateMove} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Destination Farm</label>
            <select
              value={destFarmId}
              onChange={(e) => setDestFarmId(e.target.value)}
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
              value={destHerdId}
              onChange={(e) => setDestHerdId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            >
              <option value="">Default Herd</option>
              {herds
                .filter((h) => h.farmId === destFarmId)
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
              value={moveReason}
              onChange={(e) => setMoveReason(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            >
              <option value="MANAGEMENT_ROTATION">Management Rotation</option>
              <option value="OPU_ET_COLLECTION">OPU / ET Collection</option>
              <option value="CALVING_RELOCATION">Calving Barn Relocation</option>
              <option value="QUARANTINE">Quarantine Isolation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Transfer Manifest Notes</label>
            <input
              type="text"
              placeholder="e.g. Biosecurity tested, trailer #4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Confirm Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
