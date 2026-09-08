'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  Building2,
  Layers,
  Dna,
  Award,
  Heart,
  ShieldAlert,
  Truck,
  ShieldCheck,
  CheckCircle2,
  SearchCheck,
  Flag,
  BarChart3,
  FileText,
  Network,
  Globe2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';

export function GovernmentSidebar() {
  const pathname = usePathname();
  const {
    selectedJurisdiction,
    diseaseEvents,
    complianceFindings,
    investigations,
    alerts,
    movementExceptions,
  } = useGovernment();

  const [collapsed, setCollapsed] = useState(false);

  // Active counts for badges
  const activeQuarantinesCount = diseaseEvents.filter(d => d.quarantineActive).length;
  const criticalFindingsCount = complianceFindings.filter(f => f.severity === 'CRITICAL' && f.status === 'OPEN').length;
  const activeInvestigationsCount = investigations.filter(c => c.status === 'OPEN' || c.status === 'EVIDENCE_COLLECTION').length;
  const movementExceptionsCount = movementExceptions.filter(m => m.severity === 'CRITICAL' || m.severity === 'WARNING').length;

  const sections = [
    {
      category: 'Overview',
      items: [
        {
          name: 'Command Dashboard',
          href: '/bovine/government/dashboard',
          icon: LayoutDashboard,
          badge: alerts.filter(a => a.status === 'ACTIVE').length > 0 ? `${alerts.filter(a => a.status === 'ACTIVE').length}` : undefined,
          badgeColor: 'bg-rose-100 text-rose-800',
        },
      ],
    },
    {
      category: 'Territorial & Registry',
      items: [
        { name: 'Population Accounting', href: '/bovine/government/population', icon: Users2 },
        { name: 'Regional Authorities', href: '/bovine/government/regions', icon: Globe2 },
        { name: 'Farm Oversight Matrix', href: '/bovine/government/farms', icon: Building2 },
        { name: 'National Animal Registry', href: '/bovine/government/animals', icon: Layers },
      ],
    },
    {
      category: 'Genetics & Breeding',
      items: [
        { name: 'Genetics Surveillance', href: '/bovine/government/genetics', icon: Dna },
        { name: 'Breeding Programs', href: '/bovine/government/breeding-programs', icon: Award },
        { name: 'Reproductive Surveillance', href: '/bovine/government/reproduction', icon: Heart },
      ],
    },
    {
      category: 'Biosurveillance & Movement',
      items: [
        {
          name: 'Disease & Quarantine',
          href: '/bovine/government/health',
          icon: ShieldAlert,
          badge: activeQuarantinesCount > 0 ? `${activeQuarantinesCount} Q-Zone` : undefined,
          badgeColor: 'bg-rose-600 text-white',
        },
        {
          name: 'Traceability & Movements',
          href: '/bovine/government/movements',
          icon: Truck,
          badge: movementExceptionsCount > 0 ? `${movementExceptionsCount} alert` : undefined,
          badgeColor: 'bg-amber-100 text-amber-900',
        },
      ],
    },
    {
      category: 'Regulatory & Integrity',
      items: [
        {
          name: 'Compliance & Audits',
          href: '/bovine/government/compliance',
          icon: ShieldCheck,
          badge: criticalFindingsCount > 0 ? `${criticalFindingsCount} crit` : undefined,
          badgeColor: 'bg-rose-100 text-rose-800',
        },
        { name: 'Cross-Farm Data Quality', href: '/bovine/government/data-quality', icon: CheckCircle2 },
        {
          name: 'Regulatory Investigations',
          href: '/bovine/government/investigations',
          icon: SearchCheck,
          badge: activeInvestigationsCount > 0 ? `${activeInvestigationsCount} open` : undefined,
          badgeColor: 'bg-indigo-100 text-indigo-900',
        },
      ],
    },
    {
      category: 'Institutional Delivery',
      items: [
        { name: 'National Programs', href: '/bovine/government/programs', icon: Flag },
        { name: 'Institutional Analytics', href: '/bovine/government/analytics', icon: BarChart3 },
        { name: 'Statutory Reports', href: '/bovine/government/reports', icon: FileText },
        { name: 'Institutional Hierarchy', href: '/bovine/government/institutional', icon: Network },
      ],
    },
  ];

  return (
    <aside
      className={`relative border-r border-stone-200/90 bg-[#FAF9F5] flex flex-col justify-between transition-all duration-200 z-20 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header Profile / Crest */}
      <div className="p-3 border-b border-stone-200/80">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                GOV
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-stone-900 tracking-tight truncate leading-tight">
                  Government Observer
                </p>
                <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider truncate">
                  Institutional Oversight
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              GOV
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-stone-200/70 text-stone-600 transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                {section.category}
              </h4>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/bovine/government/dashboard');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-200/60 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-300' : 'text-stone-600 group-hover:text-stone-900'
                    }`} />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: Official Scope & Return to Bovine */}
      <div className="p-3 border-t border-stone-200/80 bg-white/50 space-y-2">
        {!collapsed && (
          <div className="p-2 rounded-xl bg-stone-100 border border-stone-200/80">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-stone-900 truncate leading-tight">
                  Dr. Birhanu Kebede
                </p>
                <p className="text-[9px] text-stone-600 font-medium truncate">
                  Chief Veterinary Officer • Federal
                </p>
              </div>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-600">
              <span>Scope: <strong className="text-stone-800 font-semibold">{selectedJurisdiction?.name}</strong></span>
              <span className="font-mono text-emerald-800 font-semibold">{selectedJurisdiction?.code}</span>
            </div>
          </div>
        )}

        <Link
          href="/bovine/dashboard"
          className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          title="Return to Farm & Commercial Operations"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {!collapsed && <span>Exit to Farm Workspace</span>}
        </Link>
      </div>
    </aside>
  );
}
