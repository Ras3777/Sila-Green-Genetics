'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Radio,
  Wifi,
  Battery,
  AlertTriangle,
  Activity,
  Flame,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ animalId: string }>;
}

export default function Animal360SensorsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const {
    animals,
    sensorDevices,
    deviceAssignments,
    sensorReadings,
    dailySensorSummaries,
  } = useBovine();

  const animal = animals.find((a) => a.id === animalId);
  const myAssignments = deviceAssignments.filter((a) => a.animalId === animalId);
  const myReadings = sensorReadings.filter((r) => r.animalId === animalId);
  const mySummaries = dailySensorSummaries.filter((s) => s.animalId === animalId);

  if (!animal) return null;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
            <Radio className="w-4 h-4 text-emerald-700" />
            <span>Connected Bio-Sensors & Telemetry</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900">Bio-Sensors & Telemetry: {animal.name}</h2>
          <p className="text-xs text-stone-500">
            Real-time biometric signals, rumination hours, body temperature curves, and activity indices.
          </p>
        </div>

        <Link
          href="/bovine/sensors/assignments"
          className="inline-flex items-center px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Pair Hardware
        </Link>
      </div>

      {/* Paired Devices Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
          <Wifi className="w-4 h-4 text-emerald-800" />
          <span>Paired Hardware Devices ({myAssignments.length})</span>
        </h3>

        {myAssignments.length === 0 ? (
          <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <Radio className="w-8 h-8 text-stone-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-stone-800">No Hardware Paired</p>
            <p className="text-[11px] text-stone-400">Click Pair Hardware to attach an ear tag, collar, or bolus.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAssignments.map((a) => {
              const dev = sensorDevices.find((d) => d.id === a.deviceId);
              return (
                <div
                  key={a.id}
                  className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-stone-900">
                        {dev?.serialNumber || a.deviceId}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold uppercase text-[10px]">
                        {a.placement}
                      </span>
                    </div>
                    <span className="flex items-center text-stone-500 font-mono">
                      <Battery className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                      {dev?.batteryLevelPct || 100}%
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-500">
                    Type: <strong className="text-stone-700">{(dev?.deviceType || dev?.type || 'SENSOR').replace(/_/g, ' ')}</strong> • Paired:{' '}
                    {a.assignedAt.split('T')[0]}
                  </div>

                  {a.notes && <p className="text-stone-600 text-[11px]">{a.notes}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Telemetry Summaries */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900">Daily Telemetry Metrics</h3>

        {mySummaries.length === 0 ? (
          <p className="text-xs text-stone-400 italic py-4">No daily rollups available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mySummaries.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">
                    {s.metricType.replace(/_/g, ' ')}
                  </span>
                  {s.abnormal && (
                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                      ALERT
                    </span>
                  )}
                </div>

                <div className="font-mono text-2xl font-bold text-stone-900">
                  {s.avgValue} <span className="text-xs text-stone-500 font-normal">{s.unit}</span>
                </div>

                <div className="text-[11px] text-stone-500 flex justify-between font-mono">
                  <span>Min: {s.minValue}</span>
                  <span>Max: {s.maxValue}</span>
                  {s.sumValue && <span>Sum: {s.sumValue}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
