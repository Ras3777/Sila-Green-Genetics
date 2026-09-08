'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Users,
  Layers,
  CalendarCheck2,
  Utensils,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Building2,
  Sparkles,
  Users2,
  Plus,
} from 'lucide-react';

interface HerdOverviewPageProps {
  params: Promise<{ herdId: string }>;
}

export default function HerdOverviewPage({ params }: HerdOverviewPageProps) {
  const resolvedParams = use(params);
  const herdId = resolvedParams.herdId;

  const { herds, farms, animals, groups, herdDailyLogs, groupFeedingLogs } = useBovine();
  const herd = herds.find((h) => h.id === herdId);

  if (!herd) return null;

  const farm = farms.find((f) => f.id === herd.farmId);
  const herdAnimals = animals.filter((a) => a.herdId === herd.id);
  const herdGroups = groups.filter((g) => g.herdId === herd.id);
  const herdLogs = herdDailyLogs.filter((l) => l.herdId === herd.id);
  const latestLog = herdLogs[0];
  const feedLogs = groupFeedingLogs.filter((f) => f.herdId === herd.id);
  const latestFeed = feedLogs[0];

  const sickAnimals = herdAnimals.filter((a) => a.lifeStatus === 'SICK' || a.requiresReview);
  const heifers = herdAnimals.filter((a) => a.sex === 'FEMALE');
  const bulls = herdAnimals.filter((a) => a.sex === 'MALE');

  return (
    <div className="space-y-6">
      {/* Operational Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Production & Demographic Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-stone-900">Demographic Breakdown</h3>
            </div>
            <Link
              href={`/bovine/herds/${herd.id}/animals`}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Females</span>
              <span className="text-base font-bold text-stone-900 font-mono">{heifers.length} head</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Males</span>
              <span className="text-base font-bold text-stone-900 font-mono">{bulls.length} head</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Active Groups</span>
              <span className="text-base font-bold text-stone-900 font-mono">{herdGroups.length} batches</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200/70 text-xs">
              <span className="text-rose-600 block text-[10px] uppercase font-bold">Under Review</span>
              <span className="text-base font-bold text-rose-950 font-mono">{sickAnimals.length} head</span>
            </div>
          </div>
        </div>

        {/* Daily Operations Ledger Status */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <CalendarCheck2 className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-stone-900">Daily Log Status</h3>
            </div>
            <Link
              href={`/bovine/herds/${herd.id}/daily-log`}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center"
            >
              <span>Ledger</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>

          {latestLog ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Latest Log Date:</span>
                <span className="font-bold text-stone-800">{new Date(latestLog.date).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Normal Head</span>
                  <span className="font-bold font-mono text-sm">{latestLog.normalCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Abnormal Head</span>
                  <span className="font-bold font-mono text-sm">{latestLog.abnormalCount}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>Recorded By:</span>
                <span className="font-semibold text-stone-800">{latestLog.loggedBy}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-stone-500">No herd daily logs recorded yet today.</p>
              <Link
                href={`/bovine/herds/${herd.id}/daily-log`}
                className="mt-3 inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                Record Daily Log
              </Link>
            </div>
          )}
        </div>

        {/* Nutritional Intake Summary */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-stone-900">Nutritional Intake</h3>
            </div>
            <Link
              href={`/bovine/herds/${herd.id}/feeding`}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center"
            >
              <span>Feed Logs</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>

          {latestFeed ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs text-stone-500">Active Ration</div>
                <div className="text-sm font-bold text-stone-900">{latestFeed.rationName} ({latestFeed.rationVersion})</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 text-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">DMI Target</span>
                  <span className="font-bold font-mono text-sm">{latestFeed.dmiKgPerHead} kg/hd</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 text-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Dry Matter</span>
                  <span className="font-bold font-mono text-sm">{latestFeed.dryMatterPct}%</span>
                </div>
              </div>
              {latestFeed.highRefusalFlag && (
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>High feed refusal recorded on latest run</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-stone-500">No feed logs recorded for this herd.</p>
              <Link
                href={`/bovine/herds/${herd.id}/feeding`}
                className="mt-3 inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                Log Ration Intake
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sub-groups in this herd */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <Users2 className="w-4 h-4 text-emerald-800" />
            <h3 className="text-sm font-bold text-stone-900">Management Groups in this Herd</h3>
          </div>
          <Link
            href={`/bovine/herds/${herd.id}/groups`}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center"
          >
            <span>Manage Groups ({herdGroups.length})</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {herdGroups.length === 0 ? (
          <div className="p-6 text-center text-xs text-stone-500">
            No management groups defined inside this herd yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {herdGroups.map((g) => {
              const groupAnimals = animals.filter((a) => a.managementGroupId === g.id);
              return (
                <Link
                  key={g.id}
                  href={`/bovine/groups/${g.id}`}
                  className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200 hover:border-emerald-800/40 hover:bg-stone-50 transition-all space-y-2 block"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {g.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                      {g.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">{g.name}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1">{g.description}</p>
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-600">
                    <span>{groupAnimals.length} head</span>
                    <span className="text-emerald-800 font-semibold flex items-center">
                      View Group &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
