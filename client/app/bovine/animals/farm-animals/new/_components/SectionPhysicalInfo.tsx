'use client';

import React from 'react';
import { Scale } from 'lucide-react';
import { HornStatus } from '@/lib/bovine-types';

interface SectionPhysicalInfoProps {
  currentWeightKg: string;
  setCurrentWeightKg: (v: string) => void;
  birthWeightKg: string;
  setBirthWeightKg: (v: string) => void;
  coatColor: string;
  setCoatColor: (v: string) => void;
  frameSize: string;
  setFrameSize: (v: string) => void;
  birthCondition: string;
  setBirthCondition: (v: string) => void;
  hornStatus: HornStatus;
  setHornStatus: (v: HornStatus) => void;
}

export function SectionPhysicalInfo({
  currentWeightKg,
  setCurrentWeightKg,
  birthWeightKg,
  setBirthWeightKg,
  coatColor,
  setCoatColor,
  frameSize,
  setFrameSize,
  birthCondition,
  setBirthCondition,
  hornStatus,
  setHornStatus,
}: SectionPhysicalInfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Scale className="w-4 h-4 text-emerald-700" />
        <span>Section C — Physical Conformation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Current Scale Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={currentWeightKg}
            onChange={(e) => setCurrentWeightKg(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
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
          <label className="block text-xs font-semibold text-stone-700 mb-1">Coat Color &amp; Pattern</label>
          <input
            type="text"
            value={coatColor}
            onChange={(e) => setCoatColor(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Frame / Size</label>
          <select
            value={frameSize}
            onChange={(e) => setFrameSize(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="Small">Small Frame</option>
            <option value="Medium">Medium Frame</option>
            <option value="Large">Large Frame</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Condition</label>
          <input
            type="text"
            value={birthCondition}
            onChange={(e) => setBirthCondition(e.target.value)}
            placeholder="Healthy / Vigorous"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Horn Status</label>
          <select
            value={hornStatus}
            onChange={(e) => setHornStatus(e.target.value as HornStatus)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="POLLED">Polled (Naturally Hornless)</option>
            <option value="HORNED">Horned</option>
            <option value="DEHORNED">Dehorned</option>
            <option value="SCURRED">Scurred</option>
          </select>
        </div>
      </div>
    </div>
  );
}
