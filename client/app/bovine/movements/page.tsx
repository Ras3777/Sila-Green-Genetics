'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Clock,
  Printer,
} from 'lucide-react';
import { ContextualBovineMap } from '@/components/bovine/map/ContextualBovineMap';

export default function BovineMovementsPage() {
  const { movements, farms, herds, animals, moveAnimals } = useBovine();

  // Filters
  const [sourceFarmFilter, setSourceFarmFilter] = useState('');
  const [destFarmFilter, setDestFarmFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // New Movement Modal
  const [isNewMoveOpen, setIsNewMoveOpen] = useState(false);
  const [sourceFarmId, setSourceFarmId] = useState(farms[0]?.id || '');
  const [destFarmId, setDestFarmId] = useState(farms[1]?.id || farms[0]?.id || '');
  const [destHerdId, setDestHerdId] = useState('');
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [moveReason, setMoveReason] = useState('MANAGEMENT_ROTATION');
  const [driverName, setDriverName] = useState('John Hansen (Certified Hauler)');
  const [vehicleReg, setVehicleReg] = useState('WI-TRK-8821');
  const [notes, setNotes] = useState('');
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);

  // Available animals at source farm
  const eligibleAnimals = animals.filter((a) => a.farmId === sourceFarmId);

  // Filtered movements
  const filteredMovements = movements.filter((m) => {
    if (sourceFarmFilter && m.fromFarmId !== sourceFarmFilter) return false;
    if (destFarmFilter && m.toFarmId !== destFarmFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        m.referenceNumber.toLowerCase().includes(q) ||
        m.fromFarmName.toLowerCase().includes(q) ||
        m.toFarmName.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleSelectAnimal = (id: string) => {
    setSelectedAnimalIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllSourceAnimals = () => {
    if (selectedAnimalIds.length === eligibleAnimals.length) {
      setSelectedAnimalIds([]);
    } else {
      setSelectedAnimalIds(eligibleAnimals.map((a) => a.id));
    }
  };

  const handleExecuteMove = () => {
    if (selectedAnimalIds.length === 0 || !destFarmId) return;

    moveAnimals({
      animalIds: selectedAnimalIds,
      destinationFarmId: destFarmId,
      destinationHerdId: destHerdId || undefined,
      movementDate: '2026-09-04',
      reason: moveReason,
      notes: `${notes ? notes + ' • ' : ''}Carrier: ${driverName} (${vehicleReg})`,
    });

    setIsNewMoveOpen(false);
    setModalStep(1);
    setSelectedAnimalIds([]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Biosecurity Chain of Custody</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Inter-Facility Transfers & Movements
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Audit-compliant movement manifests, electronic bills of lading, and biosecurity tracking
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setIsNewMoveOpen(true);
              setModalStep(1);
              setSelectedAnimalIds([]);
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Transfer Manifest</span>
          </button>
        </div>
      </div>

      {/* Geospatial Movement Corridors Map */}
      <ContextualBovineMap
        title="Geospatial Transfer Corridors & Carrier Routing"
        description="Live inter-facility movement corridors, transit manifests, and biosecurity surveillance buffers"
        presetLayers={{ movements: true, surveillanceBuffers: true }}
        heightClassName="h-[360px]"
      />

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search manifests by reference #, farm, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder:text-stone-400"
          />
        </div>

        <select
          value={sourceFarmFilter}
          onChange={(e) => setSourceFarmFilter(e.target.value)}
          className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
        >
          <option value="">Source Farm (All)</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              From: {f.name}
            </option>
          ))}
        </select>

        <select
          value={destFarmFilter}
          onChange={(e) => setDestFarmFilter(e.target.value)}
          className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
        >
          <option value="">Destination Farm (All)</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              To: {f.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSourceFarmFilter('');
            setDestFarmFilter('');
            setSearchTerm('');
          }}
          className="text-stone-500 hover:text-stone-800 font-semibold px-2 py-1"
        >
          Reset
        </button>
      </div>

      {/* Movements Table */}
      <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3 pl-5">Reference #</th>
                <th className="p-3">Transfer Route</th>
                <th className="p-3">Cattle Count</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Movement Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-5 text-right">Manifest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50/80">
                  <td className="p-3 pl-5 font-mono font-bold text-emerald-800">
                    {m.referenceNumber}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-stone-900 flex items-center space-x-1.5">
                      <span>{m.fromFarmName}</span>
                      <span className="text-stone-400">&rarr;</span>
                      <span className="text-emerald-800">{m.toFarmName}</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-stone-800">
                    {m.animalIds?.length || 1} Head
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                      {m.reason.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-stone-600">{m.movementDate}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                      {m.status || 'COMPLETED'}
                    </span>
                  </td>
                  <td className="p-3 pr-5 text-right">
                    <button
                      onClick={() => alert(`Printing verified transport manifest #${m.referenceNumber}`)}
                      className="inline-flex items-center space-x-1 text-emerald-800 hover:underline font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Bol</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No movement records match the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Step New Movement Modal */}
      {isNewMoveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  New Biosecurity Transfer Manifest
                </h2>
                <p className="text-stone-500 text-[11px]">Step {modalStep} of 3</p>
              </div>
              <button
                onClick={() => setIsNewMoveOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: Facilities */}
            {modalStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Origin Facility (Source)
                    </label>
                    <select
                      value={sourceFarmId}
                      onChange={(e) => {
                        setSourceFarmId(e.target.value);
                        setSelectedAnimalIds([]);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                    >
                      {farms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Destination Facility (Target)
                    </label>
                    <select
                      value={destFarmId}
                      onChange={(e) => setDestFarmId(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                    >
                      {farms
                        .filter((f) => f.id !== sourceFarmId)
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.code})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Movement Reason
                  </label>
                  <select
                    value={moveReason}
                    onChange={(e) => setMoveReason(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  >
                    <option value="MANAGEMENT_ROTATION">Routine Management Rotation</option>
                    <option value="OPU_ET_COLLECTION">OPU / Embryo Transfer Donor Run</option>
                    <option value="CALVING_RELOCATION">Maternity Barn Relocation</option>
                    <option value="QUARANTINE">Quarantine & Isolation Holding</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {eligibleAnimals.length} cattle currently located at selected origin farm.
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setModalStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900"
                  >
                    Next: Select Animals ({eligibleAnimals.length}) &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Animal Selection */}
            {modalStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">
                    Select Cattle to Transfer ({selectedAnimalIds.length} of {eligibleAnimals.length} chosen)
                  </span>
                  <button
                    onClick={selectAllSourceAnimals}
                    className="text-emerald-800 font-bold hover:underline"
                  >
                    {selectedAnimalIds.length === eligibleAnimals.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 border border-stone-200 rounded-2xl">
                  {eligibleAnimals.map((animal) => (
                    <div
                      key={animal.id}
                      onClick={() => toggleSelectAnimal(animal.id)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        selectedAnimalIds.includes(animal.id) ? 'bg-emerald-50/70' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedAnimalIds.includes(animal.id)}
                          onChange={() => {}}
                          className="rounded text-emerald-800"
                        />
                        <div>
                          <div className="font-bold text-stone-900">{animal.name}</div>
                          <div className="text-[11px] font-mono text-emerald-800 font-semibold">
                            {animal.primaryIdentifier || animal.internalId}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 uppercase font-medium">
                        {animal.useStatus}
                      </span>
                    </div>
                  ))}

                  {eligibleAnimals.length === 0 && (
                    <div className="p-6 text-center text-stone-400">
                      No cattle stationed at this origin farm.
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setModalStep(1)}
                    className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
                  >
                    &larr; Back
                  </button>
                  <button
                    disabled={selectedAnimalIds.length === 0}
                    onClick={() => setModalStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 disabled:bg-stone-300 text-white font-bold hover:bg-emerald-900"
                  >
                    Next: Transport Logistics &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Transport Logistics & Confirmation */}
            {modalStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Driver / Transport Provider
                    </label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Trailer / Vehicle Registration
                    </label>
                    <input
                      type="text"
                      value={vehicleReg}
                      onChange={(e) => setVehicleReg(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Biosecurity Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Disinfected trailer, fresh bedding provided"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
                  <div className="font-bold text-stone-900">Transfer Confirmation Summary:</div>
                  <div>Origin: {farms.find((f) => f.id === sourceFarmId)?.name}</div>
                  <div>Destination: {farms.find((f) => f.id === destFarmId)?.name}</div>
                  <div>Cattle Count: <strong>{selectedAnimalIds.length} head</strong></div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setModalStep(2)}
                    className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
                  >
                    &larr; Back
                  </button>
                  <button
                    id="btn-confirm-execute-movement"
                    onClick={handleExecuteMove}
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold uppercase tracking-wider hover:bg-emerald-900 shadow-xs cursor-pointer"
                  >
                    Execute Movement Manifest
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
