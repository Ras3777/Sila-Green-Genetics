'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Settings,
  Shield,
  Database,
  UserCheck,
  Building2,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
  Sliders,
  Bell,
  Layers,
} from 'lucide-react';
import { UserRole } from '@/lib/bovine-types';

export default function BovineSettingsPage() {
  const {
    session,
    setSessionRole,
    farms,
    herds,
    animals,
    dailyLogs,
    resetToDefaults,
  } = useBovine();

  const [feverThreshold, setFeverThreshold] = useState<number>(39.3);
  const [ruminationThreshold, setRuminationThreshold] = useState<number>(360);
  const [lamenessThreshold, setLamenessThreshold] = useState<number>(3);
  const [offlineSimulated, setOfflineSimulated] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'FARMER', title: 'Farmer / Operator', desc: 'Daily vitals recording and quick observations.' },
    { role: 'TECHNICIAN', title: 'Field Technician', desc: 'RFID/Barcode pen walking, tasks, and animal transfers.' },
    { role: 'HERD_MANAGER', title: 'Herd Manager', desc: 'Herd placement, daily operations review, and task dispatch.' },
    { role: 'FARM_MANAGER', title: 'Farm Manager', desc: 'Full facility management, capacity control, and movements.' },
    { role: 'REGISTRAR', title: 'Livestock Registrar', desc: 'Pedigree verification, breed compositions, and master records.' },
    { role: 'SUPERVISOR', title: 'Supervisor / Vet', desc: 'Clinical review, abnormality clearance, and cross-farm auditing.' },
    { role: 'ADMIN', title: 'System Administrator', desc: 'Unrestricted enterprise configuration and system control.' },
  ];

  const handleExportData = () => {
    const raw = localStorage.getItem('bovine_state_v1');
    const blob = new Blob([raw || ''], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bovine_management_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Configuration & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            System Preferences & Security
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Manage RBAC permissions, clinical alert thresholds, offline cache, and state persistence
          </p>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 text-xs font-semibold">
        <Link
          href="/bovine/settings"
          className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white shadow-2xs"
        >
          General & RBAC
        </Link>
        <Link
          href="/bovine/settings/preferences"
          className="px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          Clinical Thresholds
        </Link>
        <Link
          href="/bovine/settings/organization"
          className="px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          Organization Profiles
        </Link>
      </div>

      {/* RBAC Role Switcher */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
          <UserCheck className="w-4 h-4 text-emerald-800" />
          <h2 className="text-base font-bold text-stone-900">Active Role-Based Access Control (RBAC)</h2>
        </div>

        <p className="text-xs text-stone-500">
          Select an active persona to inspect the application under specific role permissions and UX constraints.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {roles.map((r) => {
            const isCurrent = session.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => setSessionRole(r.role)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-50/80 border-emerald-600 shadow-xs ring-1 ring-emerald-600'
                    : 'bg-stone-50/70 border-stone-200 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">{r.title}</span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{r.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinical Telemetry Thresholds */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
          <Sliders className="w-4 h-4 text-emerald-800" />
          <h2 className="text-base font-bold text-stone-900">Clinical Alert & Abnormality Thresholds</h2>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Clinical threshold settings saved.</span>
          </div>
        )}

        <form onSubmit={handleSaveThresholds} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Fever Alert Cutoff (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={feverThreshold}
              onChange={(e) => setFeverThreshold(parseFloat(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Default: 39.3°C triggers review flag
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Low Rumination Warning (Mins/day)
            </label>
            <input
              type="number"
              value={ruminationThreshold}
              onChange={(e) => setRuminationThreshold(parseInt(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Default: &lt; 360 min flags sub-acute rumination
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Lameness Review Threshold (1-5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={lamenessThreshold}
              onChange={(e) => setLamenessThreshold(parseInt(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Default: Score &ge; 3 requires hoof trimmer
            </span>
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Update Thresholds
            </button>
          </div>
        </form>
      </div>

      {/* Offline Storage & State Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
          <Database className="w-4 h-4 text-emerald-800" />
          <h2 className="text-base font-bold text-stone-900">Local Cache & Offline Persistence</h2>
        </div>

        <p className="text-xs text-stone-500">
          Bovine Genetics operates with an offline-first storage engine synced to your browser&rsquo;s local persistent storage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500">Cached Cattle Records</span>
            <div className="text-xl font-bold text-stone-900 mt-0.5">{animals.length} Records</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500">Historical Daily Logs</span>
            <div className="text-xl font-bold text-stone-900 mt-0.5">{dailyLogs.length} Entries</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500">Storage Version</span>
            <div className="text-xl font-mono font-bold text-emerald-800 mt-0.5">bovine_state_v1</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-100">
          <button
            onClick={handleExportData}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Database (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all records to initial factory defaults?')) {
                resetToDefaults();
                alert('Database successfully restored to clean seed data.');
              }
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Factory Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
