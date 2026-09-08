'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  Battery,
  Wifi,
  Radio,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SensorDeviceType } from '@/lib/bovine-types';

export default function BovineSensorDevicesPage() {
  const {
    session,
    sensorDevices,
    deviceAssignments,
    animals,
    addSensorDevice,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formType, setFormType] = useState<SensorDeviceType>('EAR_TAG');
  const [formSerial, setFormSerial] = useState('');
  const [formManufacturer, setFormManufacturer] = useState('Allflex Livestock Intelligence');
  const [formFirmware, setFormFirmware] = useState('v3.2.1-prod');

  const filteredDevices = sensorDevices.filter((d) => {
    const devType = d.deviceType || d.type;
    if (typeFilter !== 'ALL' && devType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSerial = d.serialNumber.toLowerCase().includes(q);
      const matchManu = d.manufacturer?.toLowerCase().includes(q);
      return matchSerial || matchManu;
    }
    return true;
  });

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSerial) return;

    addSensorDevice({
      deviceType: formType,
      serialNumber: formSerial,
      manufacturer: formManufacturer,
      firmwareVersion: formFirmware,
      batteryLevelPct: 100,
      status: 'INACTIVE',
    });

    setIsModalOpen(false);
    setFormSerial('');
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
            <span className="font-semibold text-stone-900">Device Hardware</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Sensor Hardware Inventory</h1>
          <p className="text-xs text-stone-500 mt-1">
            Physical telemetry sensors, rumen boluses, accelerometers, battery states, and firmware diagnostics.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Register New Device
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by serial number or manufacturer..."
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
          <option value="ALL">All Hardware Types</option>
          <option value="RUMEN_BOLUS">Rumen Bolus</option>
          <option value="EAR_TAG">Ear Tag Sensor</option>
          <option value="COLLAR">Neck Rumination Collar</option>
          <option value="PEDOMETER">Pedometer / Leg Sensor</option>
          <option value="MILK_METER">In-Line Milk Meter</option>
        </select>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((d) => {
          const activeAssign = deviceAssignments.find((a) => a.deviceId === d.id && a.active);
          const assignedAnimal = activeAssign ? animals.find((a) => a.id === activeAssign.animalId) : null;

          return (
            <div
              key={d.id}
              className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-stone-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-stone-900 text-xs">{d.serialNumber}</h3>
                    <div className="text-[11px] text-stone-500">{(d.deviceType || d.type || 'SENSOR').replace(/_/g, ' ')}</div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    d.status === 'ACTIVE' || d.active
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {d.status}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Paired Animal:</span>
                  {assignedAnimal ? (
                    <Link
                      href={`/bovine/animals/${assignedAnimal.id}/sensors`}
                      className="font-bold text-stone-900 hover:text-emerald-800"
                    >
                      {assignedAnimal.name} ({assignedAnimal.primaryIdentifier})
                    </Link>
                  ) : (
                    <span className="text-stone-400 italic">Unassigned (In Storage)</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Manufacturer:</span>
                  <span className="text-stone-700 font-medium">{d.manufacturer || 'Standard'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span className="flex items-center font-mono">
                  <Battery className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                  {d.batteryLevelPct || 100}% Battery
                </span>
                <span className="font-mono text-[11px]">FW: {d.firmwareVersion || '1.0.0'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Register Device */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Cpu className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Register Sensor Hardware</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDevice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hardware Sensor Type *</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as SensorDeviceType)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="RUMEN_BOLUS">Rumen Bolus (Temp/pH/Activity)</option>
                  <option value="EAR_TAG">Ear Tag Sensor (Activity/Rumination)</option>
                  <option value="COLLAR">Neck Rumination Collar</option>
                  <option value="PEDOMETER">Pedometer (Step/Resting Count)</option>
                  <option value="MILK_METER">In-Line Parlor Milk Meter</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Serial Number / MAC ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SN-BOLUS-99412"
                  value={formSerial}
                  onChange={(e) => setFormSerial(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-mono focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Firmware Version</label>
                  <input
                    type="text"
                    value={formFirmware}
                    onChange={(e) => setFormFirmware(e.target.value)}
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
                  Register Hardware
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
