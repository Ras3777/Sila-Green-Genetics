'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Activity,
  HeartPulse,
  Thermometer,
  CalendarCheck2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  GitBranch,
  Dna,
  Truck,
  Sparkles,
  CheckSquare,
  Building2,
  Clock,
} from 'lucide-react';

export default function Animal360OverviewPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const {
    animals,
    farms,
    herds,
    dailyLogs,
    observations,
    tasks,
    movements,
    breedCompositions,
    parentages,
  } = useBovine();

  const animal = animals.find((a) => a.id === animalId);
  if (!animal) return null;

  const parentage = parentages?.[animal.id];
  const farm = farms.find((f) => f.id === animal.farmId);
  const herd = herds.find((h) => h.id === animal.herdId);
  const animalLogs = dailyLogs.filter((l) => l.animalId === animal.id);
  const latestLog = animalLogs[animalLogs.length - 1];
  const animalObs = observations.filter((o) => o.animalId === animal.id);
  const animalTasks = tasks.filter((t) => t.animalId === animal.id);
  const animalMoves = movements.filter((m) => m.animalId === animal.id);
  const bcs = breedCompositions.filter((bc) => bc.animalId === animal.id);

  return (
    <div className="space-y-6">
      {/* Alert banner if review flagged */}
      {animal.requiresReview && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold text-sm">Veterinary Attention Alert Flagged</div>
            <p className="mt-0.5 leading-relaxed font-medium">
              {animal.reviewReason || 'Elevated body temperature or reduced rumination detected during daily morning health check.'}
            </p>
          </div>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Operational Status</div>
          <div className="text-xl font-bold text-stone-900 mt-1">
            {latestLog ? latestLog.operationalStatus : 'HEALTHY'}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active monitoring
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Latest Body Temp</div>
          <div className={`text-xl font-bold mt-1 ${latestLog && (latestLog.temperature || 38.5) > 39.3 ? 'text-amber-700' : 'text-stone-900'}`}>
            {latestLog ? `${latestLog.temperature || 38.5}°C` : '38.5°C'}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Normal range: 38.0 - 39.2°C
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Rumination Activity</div>
          <div className="text-xl font-bold text-stone-900 mt-1">
            {latestLog?.ruminationMinutes ? `${latestLog.ruminationMinutes} min` : '460 min/day'}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Collar telemetry baseline
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Open Assignments</div>
          <div className="text-xl font-bold text-stone-900 mt-1">
            {animalTasks.filter((t) => t.status !== 'COMPLETED').length} Tasks
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {animalTasks.filter((t) => t.status === 'COMPLETED').length} Completed to date
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Vitals History & Pedigree Mini */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Daily Vitals Summary */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-emerald-800" />
                <h2 className="text-base font-bold text-stone-900">Latest Vital Signs & Clinical Checks</h2>
              </div>
              <Link
                href={`/bovine/animals/${animal.id}/daily-log`}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center"
              >
                All Logs <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {latestLog ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] uppercase font-semibold text-stone-400">Appetite</span>
                  <div className="font-bold text-stone-800 mt-0.5">{latestLog.appetite}</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] uppercase font-semibold text-stone-400">Activity Level</span>
                  <div className="font-bold text-stone-800 mt-0.5">{latestLog.activity}</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] uppercase font-semibold text-stone-400">Lameness Score</span>
                  <div className="font-bold text-stone-800 mt-0.5">{latestLog.lamenessScore} / 5</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] uppercase font-semibold text-stone-400">Body Condition (BCS)</span>
                  <div className="font-bold text-stone-800 mt-0.5">{latestLog.bcs} / 5.0</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] uppercase font-semibold text-stone-400">Recorded Weight</span>
                  <div className="font-bold text-stone-800 mt-0.5">{latestLog.weightKg ? `${latestLog.weightKg} kg` : '620 kg'}</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] uppercase font-semibold text-stone-400">Logged By</span>
                  <div className="font-bold text-stone-800 mt-0.5">{latestLog.loggedBy}</div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-stone-400">No daily logs recorded yet.</div>
            )}

            {latestLog?.notes && (
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                <span className="font-semibold text-stone-900">Clinical Observations: </span>
                {latestLog.notes}
              </div>
            )}
          </div>

          {/* Pedigree & Genetics Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-emerald-800" />
                <h2 className="text-base font-bold text-stone-900">Genealogical Pedigree & Ancestry</h2>
              </div>
              <Link
                href={`/bovine/animals/${animal.id}/pedigree`}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center"
              >
                Tree View <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] uppercase font-semibold text-stone-400">Sire (Male Ancestor)</span>
                <div className="font-bold text-stone-900 text-sm mt-0.5">
                  {parentage?.sireName || animal.sireName || 'Not Recorded'}
                </div>
                {(parentage?.sireId || animal.sireId) && (
                  <Link
                    href={`/bovine/animals/${parentage?.sireId || animal.sireId}`}
                    className="text-emerald-800 text-[11px] hover:underline mt-1 block"
                  >
                    View Sire Record &rarr;
                  </Link>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] uppercase font-semibold text-stone-400">Dam (Female Ancestor)</span>
                <div className="font-bold text-stone-900 text-sm mt-0.5">
                  {parentage?.damName || animal.damName || 'Not Recorded'}
                </div>
                {(parentage?.damId || animal.damId) && (
                  <Link
                    href={`/bovine/animals/${parentage?.damId || animal.damId}`}
                    className="text-emerald-800 text-[11px] hover:underline mt-1 block"
                  >
                    View Dam Record &rarr;
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Placement, Tasks, and Timeline preview */}
        <div className="space-y-6">
          {/* Physical Placement */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-800" />
                <h2 className="text-sm font-bold text-stone-900">Current Facility Placement</h2>
              </div>
              <Link href={`/bovine/farms/${animal.farmId}`} className="text-xs text-emerald-800 hover:underline font-semibold">
                Open Farm
              </Link>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Farm Station:</span>
                <span className="font-bold text-stone-900">{farm?.name} ({farm?.code})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Assigned Herd:</span>
                <span className="font-bold text-stone-900">{herd?.name || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Facility Type:</span>
                <span className="font-semibold text-stone-700">{farm?.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Location:</span>
                <span className="font-semibold text-stone-700">{farm?.city}, {farm?.region}</span>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-emerald-800" />
                <h2 className="text-sm font-bold text-stone-900">Field Assignments</h2>
              </div>
              <Link href={`/bovine/animals/${animal.id}/tasks`} className="text-xs text-emerald-800 hover:underline font-semibold">
                Manage
              </Link>
            </div>

            <div className="space-y-2">
              {animalTasks.slice(0, 3).map((t) => (
                <div key={t.id} className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span>{t.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 uppercase">
                      {t.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">Due: {t.dueDate} • {t.assigneeName}</div>
                </div>
              ))}

              {animalTasks.length === 0 && (
                <div className="p-4 text-center text-xs text-stone-400">
                  No active tasks assigned to this animal.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
