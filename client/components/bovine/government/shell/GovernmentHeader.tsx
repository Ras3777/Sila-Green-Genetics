'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Search,
  Bell,
  CheckSquare,
  Globe2,
  Calendar,
  ChevronDown,
  Download,
  AlertTriangle,
  Building2,
  Layers,
  X,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';
import { ReportingPeriodKey } from '@/lib/bovine-government-types';

export function GovernmentHeader({
  onOpenAlerts,
  onOpenTasks,
  onOpenExport,
}: {
  onOpenAlerts?: () => void;
  onOpenTasks?: () => void;
  onOpenExport?: () => void;
}) {
  const {
    jurisdictions,
    selectedJurisdictionId,
    selectJurisdiction,
    selectedJurisdiction,
    reportingPeriods,
    selectedPeriod,
    selectedPeriodKey,
    selectReportingPeriod,
    alerts,
    taskQueue,
    diseaseEvents,
    investigations,
    freshness,
  } = useGovernment();

  const { farms, animals } = useBovine();

  const [jurisdictionDropdownOpen, setJurisdictionDropdownOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const jurisdictionRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (jurisdictionRef.current && !jurisdictionRef.current.contains(e.target as Node)) {
        setJurisdictionDropdownOpen(false);
      }
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) {
        setPeriodDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const criticalAlertsCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const pendingTasksCount = taskQueue.filter((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;

  // Quick cross-domain search results
  const q = searchQuery.trim().toLowerCase();
  const searchResults = q.length >= 2 ? {
    farms: farms.filter(f => f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || f.region.toLowerCase().includes(q)).slice(0, 3),
    animals: animals.filter(a => a.name.toLowerCase().includes(q) || (a.registrationNumber && a.registrationNumber.toLowerCase().includes(q)) || a.internalId.toLowerCase().includes(q)).slice(0, 3),
    diseases: diseaseEvents.filter(d => d.diseaseName.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.regionName.toLowerCase().includes(q)).slice(0, 2),
    cases: investigations.filter(c => c.title.toLowerCase().includes(q) || c.caseNumber.toLowerCase().includes(q)).slice(0, 2),
  } : null;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/90 px-4 lg:px-6 h-16 flex items-center justify-between shadow-xs">
      {/* Left: Jurisdiction Selector & Reporting Period */}
      <div className="flex items-center space-x-3">
        {/* Jurisdiction Switcher */}
        <div className="relative" ref={jurisdictionRef}>
          <button
            onClick={() => setJurisdictionDropdownOpen(!jurisdictionDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200/90 hover:border-emerald-700/40 hover:bg-stone-50/80 text-stone-800 transition-all cursor-pointer shadow-xs text-xs font-medium"
            title="Switch Territorial Jurisdiction"
          >
            <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
              {selectedJurisdiction?.level === 'NATIONAL' ? 'NAT' : selectedJurisdiction?.level === 'REGION' ? 'REG' : 'DIS'}
            </div>
            <div className="text-left">
              <span className="font-semibold text-stone-900 block leading-tight">
                {selectedJurisdiction?.name || 'All Jurisdictions'}
              </span>
              <span className="text-[10px] text-stone-600 block leading-none">
                {selectedJurisdiction?.level} • Code {selectedJurisdiction?.code}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-600 ml-1" />
          </button>

          {jurisdictionDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-stone-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between text-xs text-stone-600 font-medium">
                <span>Territorial Jurisdiction</span>
                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                  {jurisdictions.length} Scopes
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {jurisdictions.map((j) => {
                  const isActive = j.id === selectedJurisdictionId;
                  return (
                    <button
                      key={j.id}
                      onClick={() => {
                        selectJurisdiction(j.id);
                        setJurisdictionDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-emerald-50/60 transition-colors cursor-pointer ${
                        isActive ? 'bg-emerald-50/90 text-emerald-900 font-semibold' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          j.level === 'NATIONAL' ? 'bg-indigo-100 text-indigo-800' :
                          j.level === 'REGION' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {j.level}
                        </span>
                        <div>
                          <p className="font-medium text-stone-900">{j.name}</p>
                          <p className="text-[10px] text-stone-600">
                            {j.registeredAnimals.toLocaleString()} animals • {j.reportingFarms} farms
                          </p>
                        </div>
                      </div>
                      {isActive && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reporting Period Switcher */}
        <div className="relative" ref={periodRef}>
          <button
            onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200/90 hover:border-emerald-700/40 hover:bg-stone-50/80 text-stone-800 transition-all cursor-pointer shadow-xs text-xs font-medium"
            title="Select Cutoff / Reporting Period"
          >
            <Calendar className="w-3.5 h-3.5 text-stone-600" />
            <span className="font-semibold text-stone-900">
              {selectedPeriod?.label || selectedPeriodKey}
            </span>
            <ChevronDown className="w-3 h-3 text-stone-600" />
          </button>

          {periodDropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl border border-stone-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 border-b border-stone-100 text-[11px] font-medium text-stone-600">
                Official Reporting Cutoff
              </div>
              <div className="py-1">
                {reportingPeriods.map((p) => {
                  const isSelected = p.key === selectedPeriodKey;
                  return (
                    <button
                      key={p.key}
                      onClick={() => {
                        selectReportingPeriod(p.key);
                        setPeriodDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-50 flex items-center justify-between cursor-pointer ${
                        isSelected ? 'bg-emerald-50/80 text-emerald-900 font-semibold' : 'text-stone-700'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-stone-900">{p.label}</p>
                        <p className="text-[10px] text-stone-600">{p.comparisonPeriodLabel}</p>
                      </div>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Data Freshness Indicator */}
        <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-[11px] text-emerald-900">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-medium">Regulatory Sync: <strong className="font-semibold">{freshness.status} (Lag &le; {freshness.medianLagDays}d)</strong></span>
        </div>
      </div>

      {/* Right: Search, Alerts, Task Queue, Export */}
      <div className="flex items-center space-x-2.5">
        {/* Global Institutional Search */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/70 text-stone-600 hover:text-stone-900 transition-colors text-xs cursor-pointer border border-stone-200/60"
            title="Institutional Cross-Registry Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-medium">Search registry, farms, events...</span>
            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono bg-white border border-stone-300 rounded text-stone-600">
              Ctrl+K
            </kbd>
          </button>

          {searchOpen && (
            <div className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-white rounded-2xl border border-stone-200 shadow-2xl p-3 z-50">
              <div className="flex items-center border-b border-stone-200 pb-2 mb-2">
                <Search className="w-4 h-4 text-stone-600 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by RFID, Farm Code, Disease, Case #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full text-xs outline-none text-stone-900 placeholder:text-stone-600"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-stone-100 rounded text-stone-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {searchResults ? (
                <div className="max-h-72 overflow-y-auto space-y-3 pt-1 text-xs">
                  {searchResults.farms.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-stone-600 tracking-wider mb-1 flex items-center">
                        <Building2 className="w-3 h-3 mr-1 text-emerald-700" /> Farms ({searchResults.farms.length})
                      </div>
                      {searchResults.farms.map((f) => (
                        <Link
                          key={f.id}
                          href={`/bovine/government/farms/${f.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between p-1.5 hover:bg-emerald-50 rounded-lg text-stone-800"
                        >
                          <span className="font-medium">{f.name} ({f.code})</span>
                          <span className="text-[10px] text-stone-600">{f.region}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.animals.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-stone-600 tracking-wider mb-1 flex items-center">
                        <Layers className="w-3 h-3 mr-1 text-blue-700" /> Animals ({searchResults.animals.length})
                      </div>
                      {searchResults.animals.map((a) => (
                        <Link
                          key={a.id}
                          href={`/bovine/government/animals/${a.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between p-1.5 hover:bg-blue-50 rounded-lg text-stone-800"
                        >
                          <span className="font-medium">{a.name} • {a.registrationNumber || a.internalId}</span>
                          <span className="text-[10px] text-stone-600 font-mono">{a.internalId}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.diseases.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-stone-600 tracking-wider mb-1 flex items-center">
                        <ShieldAlert className="w-3 h-3 mr-1 text-rose-700" /> Biosurveillance ({searchResults.diseases.length})
                      </div>
                      {searchResults.diseases.map((d) => (
                        <Link
                          key={d.id}
                          href={`/bovine/government/health`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between p-1.5 hover:bg-rose-50 rounded-lg text-stone-800"
                        >
                          <span className="font-medium text-rose-800">{d.code}: {d.diseaseName}</span>
                          <span className="text-[10px] text-stone-600">{d.confirmedStatus}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.cases.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-stone-600 tracking-wider mb-1 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1 text-amber-700" /> Cases ({searchResults.cases.length})
                      </div>
                      {searchResults.cases.map((c) => (
                        <Link
                          key={c.id}
                          href={`/bovine/government/investigations/${c.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between p-1.5 hover:bg-amber-50 rounded-lg text-stone-800"
                        >
                          <span className="font-medium">{c.caseNumber}: {c.title}</span>
                          <span className="text-[10px] text-stone-600">{c.severity}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.farms.length === 0 && searchResults.animals.length === 0 && searchResults.diseases.length === 0 && searchResults.cases.length === 0 && (
                    <p className="text-center text-stone-600 py-4">No matching institutional records found.</p>
                  )}
                </div>
              ) : (
                <div className="p-3 text-center text-stone-600 text-xs">
                  Enter at least 2 characters to search across national herds, identification numbers, and cases.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Regulatory Tasks Button */}
        <button
          onClick={onOpenTasks}
          className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200/80"
          title="Official Task Queue"
        >
          <CheckSquare className="w-4 h-4" />
          {pendingTasksCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-stone-900 text-white font-bold text-[9px] shadow-xs">
              {pendingTasksCount}
            </span>
          )}
        </button>

        {/* Biosurveillance Alerts Button */}
        <button
          onClick={onOpenAlerts}
          className={`relative p-2 rounded-xl transition-colors cursor-pointer border ${
            criticalAlertsCount > 0
              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border-stone-200/80'
          }`}
          title="Biosurveillance & Quarantine Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full font-bold text-[9px] text-white shadow-xs ${
              criticalAlertsCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-600'
            }`}>
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Quick Statutory Export */}
        <button
          onClick={onOpenExport}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
          title="Export Statutory Regulatory Bundle"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Statutory Export</span>
        </button>
      </div>
    </header>
  );
}
