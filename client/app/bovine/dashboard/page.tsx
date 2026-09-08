'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Layers,
  Building2,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck2,
  CheckSquare,
  Truck,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  HeartPulse,
  Thermometer,
  FileCheck2,
  Dna,
  Clock,
  ChevronRight,
  ShieldAlert,
  Droplets,
  Sun,
  Plus,
} from 'lucide-react';

export default function BovineDashboardPage() {
  const {
    session,
    farms,
    herds,
    animals,
    dailyLogs,
    tasks,
    movements,
    observations,
    farmEvents,
    environmentLogs,
    groupFeedingLogs,
  } = useBovine();

  // Scope filter: if activeFarmId is not 'ALL', filter animals
  const scopedAnimals = session.activeFarmId === 'ALL'
    ? animals
    : animals.filter((a) => a.farmId === session.activeFarmId);

  // Population metrics
  const totalCount = scopedAnimals.length;
  const aliveCount = scopedAnimals.filter((a) => a.lifeStatus === 'ALIVE').length;
  const inactiveCount = scopedAnimals.filter((a) => a.lifeStatus === 'INACTIVE').length;
  const soldCount = scopedAnimals.filter((a) => a.lifeStatus === 'SOLD').length;
  const femaleCount = scopedAnimals.filter((a) => a.sex === 'FEMALE').length;
  const maleCount = scopedAnimals.filter((a) => a.sex === 'MALE').length;

  const useStatusBreakdown: Record<string, number> = {};
  scopedAnimals.forEach((a) => {
    useStatusBreakdown[a.useStatus] = (useStatusBreakdown[a.useStatus] || 0) + 1;
  });

  // Data completeness flags
  const missingPrimaryIds = scopedAnimals.filter((a) => !a.primaryIdentifier);
  const requiresReviewAnimals = scopedAnimals.filter((a) => a.requiresReview);

  // Today operations
  const todayStr = '2026-09-04';
  const todayLogs = dailyLogs.filter((l) => l.date === todayStr);
  const abnormalLogs = todayLogs.filter((l) => l.isAbnormal);
  const openTasks = tasks.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS');
  const urgentTasks = openTasks.filter((t) => t.priority === 'URGENT' || t.priority === 'HIGH');
  const openIncidents = farmEvents.filter((e) => e.status === 'OPEN' || e.status === 'INVESTIGATING');

  const sickOrQuarantineAnimals = scopedAnimals.filter((a) => {
    const log = todayLogs.find((l) => l.animalId === a.id);
    return log?.operationalStatus === 'SICK' || log?.operationalStatus === 'QUARANTINE';
  });

  // Trend tab state
  const [activeTrendTab, setActiveTrendTab] = useState<'population' | 'logs' | 'completeness'>('population');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Scope & Date Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Livestock Operations Command</span>
            <span>•</span>
            <span>{session.activeFarmId === 'ALL' ? 'Organization-wide' : farms.find(f => f.id === session.activeFarmId)?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Today&apos;s Herd Overview
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Operational status, abnormal queues, and herd vital activity for Friday, September 4, 2026
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            id="btn-dash-daily-ops"
            href="/bovine/daily-operations"
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Daily Operations Workbench</span>
          </Link>
          <Link
            id="btn-dash-add-animal"
            href="/bovine/animals/new"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-stone-500" />
            <span>Register</span>
          </Link>
        </div>
      </div>

      {/* Population KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Total Head</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>{aliveCount} Alive</span>
            <span className="text-emerald-700 font-semibold">{((aliveCount / (totalCount || 1)) * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Females / Males</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {femaleCount} <span className="text-sm font-normal text-stone-400">/</span> {maleCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {scopedAnimals.filter(a => a.useStatus === 'DONOR' || a.useStatus === 'BREEDING_STOCK').length} Breeding Stock
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Daily Logs</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {todayLogs.length} <span className="text-sm font-normal text-stone-400">/ {scopedAnimals.length}</span>
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-1">
            {Math.round((todayLogs.length / (scopedAnimals.length || 1)) * 100)}% Completed Today
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Attention Queue</div>
          <div className={`text-2xl sm:text-3xl font-bold mt-1 ${requiresReviewAnimals.length > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
            {requiresReviewAnimals.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {abnormalLogs.length} Abnormal vitals today
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Open Tasks</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{openTasks.length}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            {urgentTasks.length} Urgent / High priority
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Farms & Herds</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {farms.length} <span className="text-sm font-normal text-stone-400">/ {herds.length}</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Active facilities enrolled
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: Today Operations & Attention Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today Operations & Use Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today Operations Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">Today&apos;s Field Activity</h2>
                  <p className="text-xs text-stone-500">Live summary of logs, health alerts and active shifts</p>
                </div>
              </div>
              <Link
                href="/bovine/daily-operations"
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
              >
                Workbench <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <div className="text-xs text-stone-500">Normal Vitals</div>
                <div className="text-xl font-bold text-stone-900 mt-1">
                  {todayLogs.filter(l => !l.isAbnormal).length}
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Checked & optimal</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div className="text-xs text-amber-900 font-medium">Abnormal Logs</div>
                <div className="text-xl font-bold text-amber-800 mt-1">
                  {abnormalLogs.length}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">Require review / care</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <div className="text-xs text-stone-500">Sick / Recovery Box</div>
                <div className="text-xl font-bold text-stone-900 mt-1">
                  {sickOrQuarantineAnimals.length}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">Isolated monitoring</div>
              </div>
            </div>

            {/* Quick operational progress bar */}
            <div>
              <div className="flex justify-between text-xs text-stone-600 mb-1.5 font-medium">
                <span>Daily Log Completion Rate</span>
                <span>{todayLogs.length} of {scopedAnimals.length} Head Recorded ({Math.round((todayLogs.length / (scopedAnimals.length || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden flex">
                <div
                  className="bg-emerald-700 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (todayLogs.length / (scopedAnimals.length || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Population Use-Status Breakdown */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
            <h2 className="text-base font-bold text-stone-900 mb-1">Livestock Use & Role Classification</h2>
            <p className="text-xs text-stone-500 mb-4">Breeding stock, donors, recipients and progeny breakdown</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Donors', count: useStatusBreakdown['DONOR'] || 0, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { label: 'Recipients', count: useStatusBreakdown['RECIPIENT'] || 0, color: 'bg-teal-50 text-teal-800 border-teal-200' },
                { label: 'AI Sires', count: useStatusBreakdown['AI_SIRE'] || 0, color: 'bg-blue-50 text-blue-800 border-blue-200' },
                { label: 'Natural Sires', count: useStatusBreakdown['NATURAL_SERVICE_SIRE'] || 0, color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
                { label: 'Breeding Stock', count: useStatusBreakdown['BREEDING_STOCK'] || 0, color: 'bg-stone-50 text-stone-800 border-stone-200' },
                { label: 'Test Animals', count: useStatusBreakdown['TEST_ANIMAL'] || 0, color: 'bg-purple-50 text-purple-800 border-purple-200' },
                { label: 'Cull Candidates', count: useStatusBreakdown['CULL_CANDIDATE'] || 0, color: 'bg-rose-50 text-rose-800 border-rose-200' },
                { label: 'General / Calves', count: useStatusBreakdown['GENERAL'] || 0, color: 'bg-amber-50 text-amber-800 border-amber-200' },
              ].map((item) => (
                <div key={item.label} className={`p-3 rounded-2xl border ${item.color}`}>
                  <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{item.label}</div>
                  <div className="text-xl font-bold mt-1">{item.count}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">
                    {((item.count / (totalCount || 1)) * 100).toFixed(0)}% of herd
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Widgets: Tabs for Head Count / Operations / Completeness */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-stone-900">Operational Trends</h2>
                <p className="text-xs text-stone-500">Historical dynamics and completeness trajectories</p>
              </div>
              <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setActiveTrendTab('population')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTrendTab === 'population' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Movements
                </button>
                <button
                  onClick={() => setActiveTrendTab('logs')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTrendTab === 'logs' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Abnormal Vitals
                </button>
                <button
                  onClick={() => setActiveTrendTab('completeness')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTrendTab === 'completeness' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Registry Completeness
                </button>
              </div>
            </div>

            {/* Tab content */}
            {activeTrendTab === 'population' && (
              <div className="space-y-3">
                <div className="text-xs text-stone-600 flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="font-medium">Recent Farm-to-Farm Transfers (Recorded via AnimalMovement)</span>
                  <span className="text-stone-400">{movements.length} total</span>
                </div>
                <div className="divide-y divide-stone-100">
                  {movements.slice(0, 3).map((m) => (
                    <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-stone-900">{m.fromFarmName}</span>
                        <span className="text-stone-400 mx-1.5">&rarr;</span>
                        <span className="font-semibold text-emerald-800">{m.toFarmName}</span>
                        <div className="text-[11px] text-stone-500">{m.reason}</div>
                      </div>
                      <div className="text-right text-stone-400 text-[11px]">
                        <div>{m.movementDate}</div>
                        <div className="font-mono text-[10px]">{m.referenceNumber}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTrendTab === 'logs' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 flex items-center justify-between">
                  <span>Abnormal Vital Spike Detector: Elevated temperatures flagged in Pen 6</span>
                  <span className="font-bold">1 Flagged Today</span>
                </div>
                <div className="text-xs text-stone-500">
                  Daily monitoring compares each morning check against the individual cow&apos;s 30-day baseline average rumination and milk temperature.
                </div>
              </div>
            )}

            {activeTrendTab === 'completeness' && (
              <div className="space-y-3 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between font-medium text-stone-700">
                    <span>Animals with Primary Ear Tag / RFID</span>
                    <span className="text-emerald-800 font-bold">{Math.round(((scopedAnimals.length - missingPrimaryIds.length) / (scopedAnimals.length || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full" style={{ width: `${Math.round(((scopedAnimals.length - missingPrimaryIds.length) / (scopedAnimals.length || 1)) * 100)}%` }} />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between font-medium text-stone-700">
                    <span>Animals with 100% Breed Composition Assigned</span>
                    <span className="text-emerald-800 font-bold">100%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full w-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Priority Attention Queue & Active Farms */}
        <div className="space-y-6">
          {/* Priority Attention Queue */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-stone-900">Priority Attention Queue</h2>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                {requiresReviewAnimals.length + openIncidents.length} Items
              </span>
            </div>

            <div className="space-y-3">
              {/* Critical abnormal cattle */}
              {requiresReviewAnimals.map((anim) => (
                <Link
                  key={anim.id}
                  href={`/bovine/animals/${anim.id}`}
                  className="block p-3 rounded-2xl bg-amber-50/40 hover:bg-amber-50 border border-amber-200/70 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-stone-900">{anim.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {anim.primaryIdentifier}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                    {anim.reviewReason || 'Flagged for daily veterinary review'}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-stone-500">
                    <span>{anim.useStatus.replace(/_/g, ' ')}</span>
                    <span className="text-emerald-800 font-semibold flex items-center">
                      Review 360 &rarr;
                    </span>
                  </div>
                </Link>
              ))}

              {/* Incidents */}
              {openIncidents.map((evt) => (
                <Link
                  key={evt.id}
                  href={`/bovine/farms/${evt.farmId}/events`}
                  className="block p-3 rounded-2xl bg-rose-50/40 hover:bg-rose-50 border border-rose-200/70 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-rose-900">{evt.title}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                      {evt.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">{evt.notes}</p>
                </Link>
              ))}

              {requiresReviewAnimals.length === 0 && openIncidents.length === 0 && (
                <div className="p-6 text-center text-xs text-stone-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  No critical review flags active. All herds operating normally.
                </div>
              )}
            </div>
          </div>

          {/* Farm Facility Cards */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-800" />
                <h2 className="text-sm font-bold text-stone-900">Enrolled Farms</h2>
              </div>
              <Link href="/bovine/farms" className="text-xs font-semibold text-emerald-800 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {farms.map((f) => (
                <Link
                  key={f.id}
                  href={`/bovine/farms/${f.id}`}
                  className="block p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200/70 transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 truncate">{f.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-stone-600 font-mono border border-stone-200">
                      {f.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    {f.city}, {f.region} • {f.type}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/50 text-[11px]">
                    <span className="font-semibold text-stone-700">{f.headCount} Head</span>
                    <span className="text-stone-500">{f.herdCount} Herds</span>
                    <span className={`font-semibold ${f.reviewCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {f.reviewCount} Reviews
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
