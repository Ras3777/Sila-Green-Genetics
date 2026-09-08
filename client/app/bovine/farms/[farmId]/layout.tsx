'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import {
  Building2,
  MapPin,
  Users,
  Layers,
  Truck,
  ArrowLeft,
  CalendarCheck2,
  Utensils,
  Sun,
  ShieldAlert,
  Map as MapIcon,
  Plus,
} from 'lucide-react';

interface FarmLayoutProps {
  children: React.ReactNode;
  params: Promise<{ farmId: string }>;
}

export default function BovineFarmLayout({ children, params }: FarmLayoutProps) {
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;
  const pathname = usePathname();

  const { farms, herds, animals, farmEvents, environmentLogs } = useBovine();
  const farm = farms.find((f) => f.id === farmId);

  if (!farm) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-xl font-bold text-stone-900">Station Not Found</h1>
        <p className="text-xs text-stone-500">No active agricultural station matches ID &ldquo;{farmId}&rdquo;.</p>
        <Link
          href="/bovine/farms"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
        >
          Return to Farm Facilities
        </Link>
      </div>
    );
  }

  const farmAnimals = animals.filter((a) => a.farmId === farm.id);
  const farmHerds = herds.filter((h) => h.farmId === farm.id);
  const openIncidents = farmEvents.filter((e) => e.farmId === farm.id && e.status !== 'RESOLVED');
  const latestEnv = environmentLogs.find((e) => e.farmId === farm.id);

  const occupancyPct = farm.capacity && farm.capacity > 0
    ? Math.round((farmAnimals.length / farm.capacity) * 100)
    : 0;

  const tabs = [
    { href: `/bovine/farms/${farm.id}`, label: 'Overview', icon: Building2, exact: true },
    { href: `/bovine/farms/${farm.id}/animals`, label: `Animals (${farmAnimals.length})`, icon: Layers },
    { href: `/bovine/farms/${farm.id}/herds`, label: `Herds (${farmHerds.length})`, icon: Users },
    { href: `/bovine/farms/${farm.id}/daily-log`, label: 'Daily Log', icon: CalendarCheck2 },
    { href: `/bovine/farms/${farm.id}/feeding`, label: 'Feeding', icon: Utensils },
    { href: `/bovine/farms/${farm.id}/environment`, label: 'Environment', icon: Sun },
    { href: `/bovine/farms/${farm.id}/events`, label: `Incidents (${openIncidents.length})`, icon: ShieldAlert, badge: openIncidents.length > 0 ? `${openIncidents.length}` : undefined },
    { href: `/bovine/farms/${farm.id}/map`, label: 'Map & Biosecurity', icon: MapIcon },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/farms" className="hover:text-emerald-800 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Farm Facilities</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-stone-700">{farm.code}</span>
        <span>/</span>
        <span className="font-semibold text-stone-900">{farm.name}</span>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight">{farm.name}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono text-xs font-bold border border-stone-200">
                  {farm.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  {farm.type.replace(/_/g, ' ')}
                </span>
                {openIncidents.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200 flex items-center space-x-1 animate-pulse">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{openIncidents.length} Incident Active</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500 mt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {farm.address}, {farm.city}, {farm.region} ({farm.country})
                  </span>
                </div>
                <span>•</span>
                <span>Coordinates: {farm.latitude}, {farm.longitude} ({farm.elevation}m)</span>
                <span>•</span>
                <span>Supervisor: {farm.contactName} ({farm.contactEmail})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={`/bovine/animals/new?farmId=${farm.id}`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Animal</span>
            </Link>
          </div>
        </div>

        {/* Capacity & Operational KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100 text-xs">
          <div>
            <div className="text-[11px] uppercase font-semibold text-stone-400">Occupancy</div>
            <div className="text-xl font-bold text-stone-900 mt-0.5">
              {farmAnimals.length} / {farm.capacity} ({occupancyPct}%)
            </div>
            <div className="w-full h-1.5 rounded-full bg-stone-100 mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${occupancyPct > 90 ? 'bg-amber-600' : 'bg-emerald-700'}`}
                style={{ width: `${Math.min(occupancyPct, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-semibold text-stone-400">Herds & Pens</div>
            <div className="text-xl font-bold text-stone-900 mt-0.5">{farmHerds.length} Lots Active</div>
            <div className="text-stone-500 mt-0.5">Assigned to farm</div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-semibold text-stone-400">Clinical Reviews</div>
            <div className={`text-xl font-bold mt-0.5 ${farmAnimals.filter((a) => a.requiresReview).length > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
              {farmAnimals.filter((a) => a.requiresReview).length} Cattle Flagged
            </div>
            <div className="text-stone-500 mt-0.5">Requires vet inspection</div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-semibold text-stone-400">Environment Status</div>
            <div className="text-xl font-bold text-stone-900 mt-0.5 flex items-center space-x-1.5">
              <span>{latestEnv ? `${latestEnv.airTempC}°C` : '21.5°C'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                latestEnv?.heatStressRisk === 'SEVERE' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-800'
              }`}>
                THI {latestEnv?.thi || 67}
              </span>
            </div>
            <div className="text-stone-500 mt-0.5">Ventilation: {latestEnv?.ventilationStatus || 'OPTIMAL'}</div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-stone-200 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-emerald-800 text-emerald-900 bg-white shadow-2xs font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-800' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Tab Viewport */}
      <div>{children}</div>
    </div>
  );
}
