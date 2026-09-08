'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  AlertTriangle,
  ArrowLeft,
  Search,
  Filter,
  Flame,
  Activity,
  Heart,
  Stethoscope,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function BovineSensorAlertsPage() {
  const {
    session,
    farms,
    animals,
    dailySensorSummaries,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');

  const abnormalList = dailySensorSummaries.filter((s) => {
    const anim = animals.find((a) => a.id === s.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (!s.abnormal) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      const matchMetric = s.metricType.toLowerCase().includes(q);
      return matchAnim || matchMetric;
    }
    return true;
  });

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
            <span className="font-semibold text-stone-900">Anomaly Alarms</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Sensor Anomaly Alerts</h1>
          <p className="text-xs text-stone-500 mt-1">
            Machine learning threshold breaches for standing estrus, pyrexia fever, and rumination drops.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center">
          <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-700" />
          {abnormalList.length} Active Alarms
        </span>
      </div>

      {/* Alarms Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {abnormalList.map((s) => {
          const anim = animals.find((a) => a.id === s.animalId);
          const isTemp = s.metricType === 'BODY_TEMPERATURE';
          const isRumination = s.metricType === 'RUMINATION_MINUTES';
          const isActivity = s.metricType === 'ACTIVITY_INDEX';

          return (
            <div
              key={s.id}
              className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                      isTemp
                        ? 'bg-rose-100 text-rose-800'
                        : isActivity
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isTemp ? <Flame className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">
                      {isTemp && 'Pyrexia / Elevated Temperature Alert'}
                      {isRumination && 'Rumination Depression Alert'}
                      {isActivity && 'Standing Estrus Activity Spike'}
                    </h3>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {s.metricType.replace(/_/g, ' ')} • Flagged on {s.logDate}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                  HIGH
                </span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Affected Cow:</span>
                  <Link
                    href={`/bovine/animals/${s.animalId}/sensors`}
                    className="font-bold text-stone-900 hover:text-emerald-800"
                  >
                    {anim?.name} ({anim?.primaryIdentifier})
                  </Link>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-stone-500">Peak / Value:</span>
                  <span className="font-bold text-stone-900">
                    {s.maxValue} {s.unit} (Average: {s.avgValue} {s.unit})
                  </span>
                </div>
                {s.sumValue && (
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-stone-500">Total Sum:</span>
                    <span className="text-stone-700">{s.sumValue} {s.unit}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                {isActivity ? (
                  <Link
                    href="/bovine/reproduction/breeding-events"
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-xs flex items-center"
                  >
                    <Heart className="w-3.5 h-3.5 mr-1" />
                    Record Insemination
                  </Link>
                ) : (
                  <Link
                    href="/bovine/health/cases"
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-xs flex items-center"
                  >
                    <Stethoscope className="w-3.5 h-3.5 mr-1" />
                    Open Health Case
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
