'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Radio,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
} from 'lucide-react';
import { SensorPlacement } from '@/lib/bovine-types';

export default function BovineSensorAssignmentsPage() {
  const {
    session,
    farms,
    animals,
    sensorDevices,
    deviceAssignments,
    assignDeviceToAnimal,
    removeDeviceAssignment,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formDeviceId, setFormDeviceId] = useState('');
  const [formPlacement, setFormPlacement] = useState<SensorPlacement>('EAR');
  const [formNotes, setFormNotes] = useState('');

  // Devices not currently active
  const activeDeviceIds = new Set(
    deviceAssignments.filter((a) => a.active).map((a) => a.deviceId)
  );
  const availableDevices = sensorDevices.filter((d) => !activeDeviceIds.has(d.id));

  const filteredAssignments = deviceAssignments.filter((a) => {
    const anim = animals.find((an) => an.id === a.animalId);
    const dev = sensorDevices.find((d) => d.id === a.deviceId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      const matchSerial = dev?.serialNumber.toLowerCase().includes(q);
      return matchAnim || matchSerial;
    }
    return true;
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId || !formDeviceId) return;

    assignDeviceToAnimal(formAnimalId, formDeviceId, formPlacement, formNotes);

    setIsModalOpen(false);
    setFormAnimalId('');
    setFormDeviceId('');
    setFormNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <Link href="/bovine/sensors" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Sensors Hub</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Device Pairings</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Animal-Device Assignments</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage biological sensors paired with individual cows, placement geometry, and detachment history.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Pair New Device
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search animal or sensor serial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Sensor Serial / Type</th>
                <th className="py-3.5 px-4">Placement</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned At</th>
                <th className="py-3.5 px-4">Detached At</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No animal device pairings found.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((a) => {
                  const anim = animals.find((an) => an.id === a.animalId);
                  const dev = sensorDevices.find((d) => d.id === a.deviceId);

                  return (
                    <tr key={a.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        {anim ? (
                          <Link
                            href={`/bovine/animals/${anim.id}/sensors`}
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

                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-stone-900">
                          {dev?.serialNumber || a.deviceId}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {(dev?.deviceType || dev?.type || 'SENSOR').replace(/_/g, ' ')}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-stone-800">
                        {a.placement}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            a.active
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {a.active ? 'PAIRED & ACTIVE' : 'DETACHED'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {a.assignedAt.split('T')[0]}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {a.removedAt ? a.removedAt.split('T')[0] : '—'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {a.active && (
                          <button
                            onClick={() => removeDeviceAssignment(a.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                          >
                            Unpair / Detach
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Pair Device */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Radio className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Pair Sensor to Animal</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
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
                <label className="block font-semibold text-stone-700 mb-1">Available Device *</label>
                <select
                  required
                  value={formDeviceId}
                  onChange={(e) => setFormDeviceId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="">Select unassigned hardware...</option>
                  {availableDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.serialNumber} ({(d.deviceType || d.type || 'SENSOR').replace(/_/g, ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Anatomical Placement</label>
                <select
                  value={formPlacement}
                  onChange={(e) => setFormPlacement(e.target.value as SensorPlacement)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="EAR">Ear Tag</option>
                  <option value="NECK">Neck Collar</option>
                  <option value="RUMEN">Rumen Bolus</option>
                  <option value="LEG">Leg Pedometer</option>
                  <option value="TAIL">Tail Sensor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Pairing Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Left ear, tag applied with Allflex universal applicator..."
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
                  Confirm Pairing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
