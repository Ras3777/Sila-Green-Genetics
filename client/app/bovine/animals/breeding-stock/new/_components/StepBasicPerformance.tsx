'use client';

import React from 'react';
import { Scale } from 'lucide-react';

interface StepBasicPerformanceProps {
  currentWeightKg: string;
  setCurrentWeightKg: (val: string) => void;
  birthWeightKg: string;
  setBirthWeightKg: (val: string) => void;
  adgKg: string;
  setAdgKg: (val: string) => void;
  weaningWeightKg: string;
  setWeaningWeightKg: (val: string) => void;
  yearlingWeightKg: string;
  setYearlingWeightKg: (val: string) => void;
  pmwgKg: string;
  setPmwgKg: (val: string) => void;
}

export function StepBasicPerformance({
  currentWeightKg,
  setCurrentWeightKg,
  birthWeightKg,
  setBirthWeightKg,
  adgKg,
  setAdgKg,
  weaningWeightKg,
  setWeaningWeightKg,
  yearlingWeightKg,
  setYearlingWeightKg,
  pmwgKg,
  setPmwgKg,
}: StepBasicPerformanceProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Scale className="w-4 h-4 text-amber-700" />
        <span>Step 2 — Growth &amp; Gain Milestones</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Current Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={currentWeightKg}
            onChange={(e) => setCurrentWeightKg(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={birthWeightKg}
            onChange={(e) => setBirthWeightKg(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Average Daily Gain (ADG kg/d)</label>
          <input
            type="number"
            step="0.01"
            value={adgKg}
            onChange={(e) => setAdgKg(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Weaning Weight 205d (kg)</label>
          <input
            type="number"
            step="0.1"
            value={weaningWeightKg}
            onChange={(e) => setWeaningWeightKg(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Yearling Weight 365d (kg)</label>
          <input
            type="number"
            step="0.1"
            value={yearlingWeightKg}
            onChange={(e) => setYearlingWeightKg(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Post-Weaning Gain (PMWG kg/d)</label>
          <input
            type="number"
            step="0.01"
            value={pmwgKg}
            onChange={(e) => setPmwgKg(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
