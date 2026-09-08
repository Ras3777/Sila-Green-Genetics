'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Sliders,
  Bell,
  Thermometer,
  Activity,
  Droplets,
  Utensils,
  ArrowLeft,
  CheckCircle2,
  Save,
  Gauge,
  Sparkles,
} from 'lucide-react';

export default function SettingsPreferencesPage() {
  const { session } = useBovine();

  const [feverThreshold, setFeverThreshold] = useState<number>(39.3);
  const [ruminationThreshold, setRuminationThreshold] = useState<number>(360);
  const [lamenessThreshold, setLamenessThreshold] = useState<number>(3);
  const [thiThreshold, setThiThreshold] = useState<number>(72);
  const [refusalThreshold, setRefusalThreshold] = useState<number>(5.0);
  const [units, setUnits] = useState<'METRIC' | 'IMPERIAL'>('METRIC');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/settings" className="hover:text-emerald-800 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>System Settings</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">Clinical Thresholds & Preferences</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Clinical Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Clinical Alert Thresholds & Rules
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Configure automated flags for vitals recording, environmental stress indices, and nutritional refusals
          </p>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 text-xs font-semibold">
        <Link
          href="/bovine/settings"
          className="px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          General & RBAC
        </Link>
        <Link
          href="/bovine/settings/preferences"
          className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white shadow-2xs"
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

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Clinical thresholds and preference parameters saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thresholds Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
            <Gauge className="w-4 h-4 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">Biometric & Clinical Sensitivity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-600" />
                  Hyperthermia / Fever Cutoff
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">{feverThreshold}°C</span>
              </div>
              <input
                type="range"
                min="38.5"
                max="41.0"
                step="0.1"
                value={feverThreshold}
                onChange={(e) => setFeverThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-800"
              />
              <span className="text-[11px] text-stone-500 block">
                Readings at or above this value trigger immediate veterinary alert and Animal 360 review flag.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  Daily Rumination Deficit
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">{ruminationThreshold} min/d</span>
              </div>
              <input
                type="range"
                min="200"
                max="500"
                step="10"
                value={ruminationThreshold}
                onChange={(e) => setRuminationThreshold(parseInt(e.target.value))}
                className="w-full accent-emerald-800"
              />
              <span className="text-[11px] text-stone-500 block">
                Collar sensor or manual rumination below this volume signals subacute acidosis or stress.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  Lameness Score Threshold (1-5)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">Score &ge; {lamenessThreshold}</span>
              </div>
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={lamenessThreshold}
                onChange={(e) => setLamenessThreshold(parseInt(e.target.value))}
                className="w-full accent-emerald-800"
              />
              <span className="text-[11px] text-stone-500 block">
                Locomotion scores matching this value create an automated Hoof Trimming & Inspection task.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-orange-600" />
                  Station THI Heat Stress Threshold
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">THI &ge; {thiThreshold}</span>
              </div>
              <input
                type="range"
                min="65"
                max="85"
                step="1"
                value={thiThreshold}
                onChange={(e) => setThiThreshold(parseInt(e.target.value))}
                className="w-full accent-emerald-800"
              />
              <span className="text-[11px] text-stone-500 block">
                Bovine Temperature-Humidity Index triggering misting fans and cooling protocols.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-700" />
                  Feed Refusal Weighback Alert
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">&gt; {refusalThreshold}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="0.5"
                value={refusalThreshold}
                onChange={(e) => setRefusalThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-800"
              />
              <span className="text-[11px] text-stone-500 block">
                Warns when feed bunk weighbacks exceed normal allowance, indicating unpalatable or spoiled TMR.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Clinical Thresholds</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
