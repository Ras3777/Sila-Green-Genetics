'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import {
  Users,
  Building2,
  Layers,
  CalendarCheck2,
  Utensils,
  ArrowLeft,
  AlertTriangle,
  Users2,
  Sparkles,
} from 'lucide-react';

interface HerdLayoutProps {
  children: React.ReactNode;
  params: Promise<{ herdId: string }>;
}

export default function BovineHerdLayout({ children, params }: HerdLayoutProps) {
  const resolvedParams = use(params);
  const herdId = resolvedParams.herdId;
  const pathname = usePathname();

  const { herds, farms, animals, groups } = useBovine();
  const herd = herds.find((h) => h.id === herdId);

  if (!herd) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-xl font-bold text-stone-900">Herd Not Found</h1>
        <p className="text-xs text-stone-500">No active production herd matches ID &ldquo;{herdId}&rdquo;.</p>
        <Link
          href="/bovine/herds"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
        >
          Return to Herds Directory
        </Link>
      </div>
    );
  }

  const farm = farms.find((f) => f.id === herd.farmId);
  const herdAnimals = animals.filter((a) => a.herdId === herd.id);
  const herdGroups = groups.filter((g) => g.herdId === herd.id);

  const tabs = [
    { href: `/bovine/herds/${herd.id}`, label: 'Overview', icon: Users, exact: true },
    { href: `/bovine/herds/${herd.id}/animals`, label: `Animals (${herdAnimals.length})`, icon: Layers },
    { href: `/bovine/herds/${herd.id}/groups`, label: `Groups (${herdGroups.length})`, icon: Users2 },
    { href: `/bovine/herds/${herd.id}/daily-log`, label: 'Daily Log', icon: CalendarCheck2 },
    { href: `/bovine/herds/${herd.id}/feeding`, label: 'Feeding Log', icon: Utensils },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/herds" className="hover:text-emerald-800 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Herds Directory</span>
        </Link>
        <span>/</span>
        {farm && (
          <>
            <Link href={`/bovine/farms/${farm.id}`} className="hover:text-emerald-800">
              {farm.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-mono text-stone-700">{herd.code}</span>
        <span>/</span>
        <span className="font-semibold text-stone-900">{herd.name}</span>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              <Users className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {herd.code}
                </span>

                {herd.active ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                    Active Production Unit
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                    Inactive / Archived
                  </span>
                )}

                {herd.alertsCount > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    {herd.alertsCount} Review Flags
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {herd.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                <span className="font-medium capitalize">{herd.purpose.replace(/_/g, ' ').toLowerCase()}</span>
                <span>&bull;</span>
                {farm && (
                  <Link
                    href={`/bovine/farms/${farm.id}`}
                    className="flex items-center text-emerald-800 hover:underline font-semibold"
                  >
                    <Building2 className="w-3.5 h-3.5 mr-1" />
                    <span>Station: {farm.name} ({farm.code})</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Cattle Head</span>
              <span className="font-bold text-stone-900 text-base font-mono">{herdAnimals.length} head</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Groups</span>
              <span className="font-bold text-stone-900 text-base font-mono">{herdGroups.length} batches</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
              <span className="text-emerald-700 block text-[10px] uppercase font-bold">Daily Log</span>
              <span className="font-bold text-emerald-900 text-base font-mono">{herd.dailyLogCompletionPct}%</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-stone-100 pt-4 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Child Tab Content */}
      <div>{children}</div>
    </div>
  );
}
