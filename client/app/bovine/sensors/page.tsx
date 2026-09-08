'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Radio,
  Wifi,
  Battery,
  AlertTriangle,
  Activity,
  Search,
  ArrowRight,
  Plus,
  Filter,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  Cpu,
  Flame,
} from 'lucide-react';

export default function BovineSensorsDashboard() {
  const {
    session,
    farms,
    animals,
    sensorDevices,
    deviceAssignments,
    sensorReadings,
    dailySensorSummaries,
  } = useBovine();

  const [filterFarmId, setFilterFarmId] = useState<string>('ALL');

  const effectiveFarmId = session.activeFarmId !== 'ALL' ? session.activeFarmId : filterFarmId;
  const filteredAnimals = animals.filter(
    (a) => effectiveFarmId === 'ALL' || a.farmId === effectiveFarmId
  );
  const animalIds = new Set(filteredAnimals.map((a) => a.id));

  const activeAssignments = deviceAssignments.filter((a) => a.active && animalIds.has(a.animalId));
  const activeDeviceIds = new Set(activeAssignments.map((a) => a.deviceId));
  const activeDevices = sensorDevices.filter((d) => activeDeviceIds.has(d.id));

  const abnormalSummaries = dailySensorSummaries.filter(
    (s) => animalIds.has(s.animalId) && s.abnormal
  );

  const lowBatteryDevices = sensorDevices.filter((d) => d.batteryLevelPct && d.batteryLevelPct < 25);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-700" />
            <span>Connected Bio-Sensors & Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Sensors & Precision Livestock Command
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Real-time rumen temperature boluses, ear tag accelerometers, neck rumination collars, and telemetry anomaly alarms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {session.activeFarmId === 'ALL' && (
            <select
              value={filterFarmId}
              onChange={(e) => setFilterFarmId(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="ALL">All Facilities</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}

          <Link
            href="/bovine/sensors/devices"
            className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Register Device
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Connected Devices</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {activeDevices.length}
            </span>
            <span className="text-xs text-emerald-700 font-medium">streaming online</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Paired on ear, neck, or reticulorumen</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Telemetry Alarms</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {abnormalSummaries.length}
            </span>
            <span className="text-xs text-amber-800 font-medium">abnormal signals</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Rumination drop, fever, or estrus spikes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Hardware Battery Health</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Battery className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {lowBatteryDevices.length}
            </span>
            <span className="text-xs text-stone-400 font-medium">low battery</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Devices under 25% battery reserve</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Total Telemetry Pings</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {sensorReadings.length * 48}
            </span>
            <span className="text-xs text-purple-700 font-medium">24h samples</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Parsed by edge gateway receiver</p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Link
          href="/bovine/sensors/devices"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Device Hardware</span>
          <span className="text-[11px] text-stone-400 mt-0.5">{sensorDevices.length} registered</span>
        </Link>

        <Link
          href="/bovine/sensors/assignments"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <Radio className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Animal Pairings</span>
          <span className="text-[11px] text-stone-400 mt-0.5">{activeAssignments.length} active</span>
        </Link>

        <Link
          href="/bovine/sensors/readings"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Live Readings</span>
          <span className="text-[11px] text-stone-400 mt-0.5">Telemetry stream</span>
        </Link>

        <Link
          href="/bovine/sensors/daily-summaries"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Daily Summaries</span>
          <span className="text-[11px] text-stone-400 mt-0.5">Aggregates</span>
        </Link>

        <Link
          href="/bovine/sensors/alerts"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Anomaly Alarms</span>
          <span className="text-[11px] text-amber-800 font-bold mt-0.5">{abnormalSummaries.length} active</span>
        </Link>
      </div>

      {/* Main Grid: Active Anomaly Alerts & Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Abnormal Signals */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-800" />
              <h2 className="text-base font-bold text-stone-900">Active Anomaly Alarms</h2>
            </div>
            <Link
              href="/bovine/sensors/alerts"
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {abnormalSummaries.map((s) => {
              const anim = animals.find((a) => a.id === s.animalId);
              const isTemp = s.metricType === 'BODY_TEMPERATURE';
              const isRumination = s.metricType === 'RUMINATION_MINUTES';
              const isActivity = s.metricType === 'ACTIVITY_INDEX';

              return (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        isTemp
                          ? 'bg-rose-100 text-rose-800'
                          : isActivity
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isTemp ? <Flame className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/bovine/animals/${s.animalId}/sensors`}
                          className="font-bold text-stone-900 hover:text-emerald-800"
                        >
                          {anim?.name}
                        </Link>
                        <span className="font-mono text-stone-400 text-[11px]">
                          {anim?.primaryIdentifier}
                        </span>
                      </div>
                      <div className="text-stone-600 text-[11px] mt-0.5">
                        {isTemp && `Thermal spike peak ${s.maxValue}°C (Avg: ${s.avgValue}°C)`}
                        {isRumination && `Severe rumination depression: ${s.sumValue} min/day`}
                        {isActivity && `Estrus activity burst: ${s.lastValue} index units`}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold uppercase text-[10px]">
                    FLAGGED
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Telemetry Samples */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-bold text-stone-900">Live Telemetry Samples</h2>
            </div>
            <Link
              href="/bovine/sensors/readings"
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
            >
              <span>Full Stream</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {sensorReadings.slice(0, 5).map((r) => {
              const dev = sensorDevices.find((d) => d.id === r.deviceId);
              const anim = r.animalId ? animals.find((a) => a.id === r.animalId) : null;

              return (
                <div key={r.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900">
                        {r.metricType.replace(/_/g, ' ')}
                      </span>
                      {anim && (
                        <Link
                          href={`/bovine/animals/${anim.id}/sensors`}
                          className="font-medium text-emerald-800 hover:underline"
                        >
                          {anim.name}
                        </Link>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                      {new Date(r.timestamp || r.recordedAt || Date.now()).toLocaleTimeString()} • Device {dev?.serialNumber || r.deviceId}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {r.value} {r.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
