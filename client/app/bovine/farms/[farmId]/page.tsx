'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Building2,
  MapPin,
  Users,
  Layers,
  Truck,
  Plus,
  ArrowRight,
  Shield,
  CheckCircle2,
  CalendarCheck2,
  Utensils,
  Sun,
  ShieldAlert,
  Droplets,
  Activity,
} from 'lucide-react';
import { ContextualBovineMap } from '@/components/bovine/map/ContextualBovineMap';

export default function BovineFarmOverviewPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const {
    farms,
    herds,
    animals,
    movements,
    farmDailyLogs,
    groupFeedingLogs,
    environmentLogs,
    farmEvents,
  } = useBovine();

  const farm = farms.find((f) => f.id === farmId);
  if (!farm) return null;

  const farmHerds = herds.filter((h) => h.farmId === farm.id);
  const farmAnimals = animals.filter((a) => a.farmId === farm.id);
  const farmMovements = movements.filter(
    (m) => m.fromFarmId === farm.id || m.toFarmId === farm.id
  );
  const latestLog = farmDailyLogs.find((l) => l.farmId === farm.id);
  const latestFeed = groupFeedingLogs.find((g) => g.farmId === farm.id);
  const latestEnv = environmentLogs.find((e) => e.farmId === farm.id);
  const openEvents = farmEvents.filter((e) => e.farmId === farm.id && e.status !== 'RESOLVED');

  return (
    <div className="space-y-6">
      {/* Geospatial Farm Perimeter & Paddock Subdivisions Map */}
      <ContextualBovineMap
        title={`${farm.name} Spatial Boundaries & Paddock Subdivisions`}
        description={`Government-verified perimeter (${farm.region}, ${farm.city || 'District'}), internal grazing paddocks, and biosecurity zone`}
        focusFarmId={farm.id}
        heightClassName="h-[360px]"
      />

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Daily Farm Log Summary */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <CalendarCheck2 className="w-4 h-4 text-emerald-800" />
                <h2 className="text-base font-bold text-stone-900">Today&apos;s Farm Operational Log</h2>
              </div>
              <Link
                href={`/bovine/farms/${farm.id}/daily-log`}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center"
              >
                <span>Full Ledger</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {latestLog ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Head Present</span>
                    <div className="text-lg font-bold text-stone-900 mt-0.5">
                      {latestLog.presentHead} / {latestLog.totalHead}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Sick / Quarantine</span>
                    <div className="text-lg font-bold text-amber-700 mt-0.5">
                      {latestLog.sickCount} / {latestLog.quarantineCount}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Feed Consumed</span>
                    <div className="text-lg font-bold text-stone-900 mt-0.5">
                      {latestLog.feedConsumedKg} kg
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Water Intake</span>
                    <div className="text-lg font-bold text-stone-900 mt-0.5">
                      {latestLog.waterConsumedL} L
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 text-stone-700 leading-relaxed">
                  <span className="font-semibold text-stone-900">Operations Note:</span> {latestLog.notes}
                  <div className="text-[10px] text-stone-400 mt-1">
                    Logged by {latestLog.loggedBy} on {latestLog.date}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-stone-400">
                No daily farm summary recorded yet for today.
              </div>
            )}
          </div>

          {/* Group Feeding & Ration Summary */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-emerald-800" />
                <h2 className="text-base font-bold text-stone-900">Current Feeding & Nutrition Regimen</h2>
              </div>
              <Link
                href={`/bovine/farms/${farm.id}/feeding`}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center"
              >
                <span>Feeding Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {latestFeed ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Active Ration</span>
                  <div className="font-bold text-stone-900 mt-0.5">{latestFeed.rationName}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">{latestFeed.rationVersion}</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Dry Matter Intake (DMI)</span>
                  <div className="font-bold text-emerald-800 mt-0.5">{latestFeed.dmiKgPerHead} kg / head</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{latestFeed.dryMatterPct}% Dry Matter</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Refusal Rate</span>
                  <div className="font-bold text-stone-900 mt-0.5">
                    {Math.round((latestFeed.feedRefusedKg / (latestFeed.feedOfferedKg || 1)) * 100)}%
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{latestFeed.feedRefusedKg} kg refused</div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-stone-400">
                No active group rations logged for this station.
              </div>
            )}
          </div>

          {/* Recent Station Movements */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-800" />
                <h2 className="text-base font-bold text-stone-900">Recent Livestock Transfers</h2>
              </div>
              <span className="text-xs text-stone-400">{farmMovements.length} total</span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {farmMovements.slice(0, 3).map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">
                      {m.fromFarmName} &rarr; {m.toFarmName}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Reason: {m.reason}
                    </div>
                  </div>
                  <div className="text-right text-stone-400 font-mono text-[11px]">
                    <div>{m.movementDate}</div>
                    <div className="text-[10px]">{m.referenceNumber}</div>
                  </div>
                </div>
              ))}

              {farmMovements.length === 0 && (
                <div className="p-6 text-center text-stone-400">
                  No transfer manifests recorded involving this facility.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Biosecurity & Incident Alerts */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                <h2 className="text-base font-bold text-stone-900">Active Incidents</h2>
              </div>
              <Link
                href={`/bovine/farms/${farm.id}/events`}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {openEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950">{evt.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 font-bold text-[9px] uppercase">
                      {evt.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-900 leading-relaxed font-medium">{evt.notes}</p>
                  <div className="text-[10px] text-stone-500 pt-1">
                    Occurred: {evt.occurrenceTime} • Reported by {evt.reportedBy}
                  </div>
                </div>
              ))}

              {openEvents.length === 0 && (
                <div className="p-6 text-center text-xs text-stone-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                  No biosecurity incidents or quarantine protocols active.
                </div>
              )}
            </div>
          </div>

          {/* Environmental Telemetry Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-600" />
                <h2 className="text-base font-bold text-stone-900">Environment & THI</h2>
              </div>
              <Link
                href={`/bovine/farms/${farm.id}/environment`}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                Log Readings
              </Link>
            </div>

            {latestEnv ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <div>
                    <div className="font-bold text-stone-900">{latestEnv.airTempC}°C Ambient</div>
                    <div className="text-[11px] text-stone-500">{latestEnv.relativeHumidityPct}% Humidity</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    THI {latestEnv.thi}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-[10px] text-stone-400 uppercase">Bedding Score</span>
                    <div className="font-bold text-stone-900">{latestEnv.beddingScore} / 5.0</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-[10px] text-stone-400 uppercase">Water Availability</span>
                    <div className="font-bold text-stone-900">{latestEnv.waterAvailabilityScore} / 5.0</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-stone-400">
                No telemetry sensor data recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
