'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Activity,
  Search,
  Filter,
  ArrowLeft,
  Wifi,
  Radio,
  Clock,
  Plus,
  X,
  AlertTriangle,
  Flame,
  Layers,
} from 'lucide-react';
import { SensorMetricType, SensorReadingQuality } from '@/lib/bovine-types';

export default function BovineSensorReadingsPage() {
  const {
    session,
    farms,
    animals,
    sensorDevices,
    sensorReadings,
    addSensorReading,
  } = useBovine();

  const [metricFilter, setMetricFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formMetric, setFormMetric] = useState<SensorMetricType>('BODY_TEMPERATURE');
  const [formValue, setFormValue] = useState(38.8);
  const [formUnit, setFormUnit] = useState('°C');

  const filteredReadings = sensorReadings.filter((r) => {
    const anim = r.animalId ? animals.find((a) => a.id === r.animalId) : null;
    if (session.activeFarmId !== 'ALL' && anim && anim.farmId !== session.activeFarmId) return false;
    if (metricFilter !== 'ALL' && r.metricType !== metricFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      const matchDevice = r.deviceId.toLowerCase().includes(q);
      return matchAnim || matchDevice;
    }
    return true;
  });

  const handleCreateReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId) return;

    addSensorReading({
      deviceId: 'dev-1',
      animalId: formAnimalId,
      timestamp: new Date().toISOString(),
      metricType: formMetric,
      value: Number(formValue),
      unit: formUnit,
      quality: 'VALIDATED',
    });

    setIsModalOpen(false);
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
            <span className="font-semibold text-stone-900">Telemetry Stream</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Live Sensor Telemetry Stream</h1>
          <p className="text-xs text-stone-500 mt-1">
            Incoming high-frequency time-series bio-telemetry samples from connected IoT devices.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Inject Telemetry Ping
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by animal or device..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>

        <select
          value={metricFilter}
          onChange={(e) => setMetricFilter(e.target.value)}
          className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800 w-full md:w-auto"
        >
          <option value="ALL">All Metric Types</option>
          <option value="BODY_TEMPERATURE">Body Temperature (°C)</option>
          <option value="RUMINATION_MINUTES">Rumination Minutes</option>
          <option value="ACTIVITY_INDEX">Activity Index</option>
          <option value="HEART_RATE">Heart Rate (BPM)</option>
          <option value="STEPS">Steps Count</option>
        </select>
      </div>

      {/* Stream Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Metric Type</th>
                <th className="py-3.5 px-4">Telemetry Value</th>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Device ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Quality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredReadings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No sensor readings found.
                  </td>
                </tr>
              ) : (
                filteredReadings.map((r) => {
                  const anim = r.animalId ? animals.find((a) => a.id === r.animalId) : null;
                  const dev = sensorDevices.find((d) => d.id === r.deviceId);

                  return (
                    <tr key={r.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-900">
                          {r.metricType.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          {r.value} {r.unit}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {anim ? (
                          <Link
                            href={`/bovine/animals/${anim.id}/sensors`}
                            className="font-semibold text-stone-900 hover:text-emerald-800"
                          >
                            {anim.name} <span className="font-mono text-stone-400">({anim.primaryIdentifier})</span>
                          </Link>
                        ) : (
                          <span className="text-stone-400">Unpaired ping</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                        {dev?.serialNumber || r.deviceId}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {new Date(r.timestamp || r.recordedAt || Date.now()).toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            r.quality === 'ANOMALOUS'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {r.quality || 'VALIDATED'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Inject Ping */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Wifi className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Inject Telemetry Sample</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReading} className="space-y-3.5 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Metric Type</label>
                  <select
                    value={formMetric}
                    onChange={(e) => {
                      const m = e.target.value as SensorMetricType;
                      setFormMetric(m);
                      if (m === 'BODY_TEMPERATURE') setFormUnit('°C');
                      else if (m === 'RUMINATION_MINUTES') setFormUnit('min');
                      else if (m === 'ACTIVITY_INDEX') setFormUnit('index');
                      else if (m === 'HEART_RATE') setFormUnit('bpm');
                      else setFormUnit('steps');
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="BODY_TEMPERATURE">Body Temperature (°C)</option>
                    <option value="RUMINATION_MINUTES">Rumination Minutes</option>
                    <option value="ACTIVITY_INDEX">Activity Index</option>
                    <option value="HEART_RATE">Heart Rate (bpm)</option>
                    <option value="STEPS">Steps Count</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Value ({formUnit})</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-mono focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
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
                  Stream Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
