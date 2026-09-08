'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Clock,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function BovineDailySensorSummariesPage() {
  const {
    session,
    farms,
    animals,
    dailySensorSummaries,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAbnormal, setFilterAbnormal] = useState<'ALL' | 'ABNORMAL' | 'NORMAL'>('ALL');

  const filteredSummaries = dailySensorSummaries.filter((s) => {
    const anim = animals.find((a) => a.id === s.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (filterAbnormal === 'ABNORMAL' && !s.abnormal) return false;
    if (filterAbnormal === 'NORMAL' && s.abnormal) return false;
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
            <span className="font-semibold text-stone-900">Daily Summaries</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Daily Aggregated Bio-Telemetry</h1>
          <p className="text-xs text-stone-500 mt-1">
            24-hour sensor rollups: minimum, maximum, mean, and diurnal sum telemetry metrics.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by animal or metric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>

        <select
          value={filterAbnormal}
          onChange={(e) => setFilterAbnormal(e.target.value as any)}
          className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800 w-full md:w-auto"
        >
          <option value="ALL">All Summaries</option>
          <option value="ABNORMAL">Anomalous / Flagged Only</option>
          <option value="NORMAL">Normal Range Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Metric</th>
                <th className="py-3.5 px-4">Samples</th>
                <th className="py-3.5 px-4">Min / Max</th>
                <th className="py-3.5 px-4">Average</th>
                <th className="py-3.5 px-4">Total Sum</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredSummaries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No daily summaries recorded.
                  </td>
                </tr>
              ) : (
                filteredSummaries.map((s) => {
                  const anim = animals.find((a) => a.id === s.animalId);
                  return (
                    <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
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

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {s.logDate}
                      </td>

                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {s.metricType.replace(/_/g, ' ')}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-600">
                        {s.sampleCount}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-600">
                        {s.minValue} - {s.maxValue} {s.unit}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {s.avgValue} {s.unit}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-700">
                        {s.sumValue ? `${s.sumValue} ${s.unit}` : '—'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            s.abnormal
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {s.abnormal ? 'Anomalous' : 'Normal'}
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
    </div>
  );
}
