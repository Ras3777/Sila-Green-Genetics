'use client';

import React from 'react';
import { Ruler } from 'lucide-react';
import { Sex } from '@/lib/bovine-types';

interface StepPhysicalMeasurementsProps {
  rumpLengthCm: string;
  setRumpLengthCm: (val: string) => void;
  rumpHeightCm: string;
  setRumpHeightCm: (val: string) => void;
  lowerHeightCm: string;
  setLowerHeightCm: (val: string) => void;
  backHeightCm: string;
  setBackHeightCm: (val: string) => void;
  bodyLengthCm: string;
  setBodyLengthCm: (val: string) => void;
  ribDepthCm: string;
  setRibDepthCm: (val: string) => void;
  chestPerimeterCm: string;
  setChestPerimeterCm: (val: string) => void;
  bodyWidthCm: string;
  setBodyWidthCm: (val: string) => void;
  scrotalCircumferenceCm: string;
  setScrotalCircumferenceCm: (val: string) => void;
  sex: Sex;
}

export function StepPhysicalMeasurements({
  rumpLengthCm,
  setRumpLengthCm,
  rumpHeightCm,
  setRumpHeightCm,
  lowerHeightCm,
  setLowerHeightCm,
  backHeightCm,
  setBackHeightCm,
  bodyLengthCm,
  setBodyLengthCm,
  ribDepthCm,
  setRibDepthCm,
  chestPerimeterCm,
  setChestPerimeterCm,
  bodyWidthCm,
  setBodyWidthCm,
  scrotalCircumferenceCm,
  setScrotalCircumferenceCm,
  sex,
}: StepPhysicalMeasurementsProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Ruler className="w-4 h-4 text-amber-700" />
        <span>Step 3 — Physical Morphometric Measurements (cm)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Length of Rump (cm)</label>
          <input
            type="number"
            step="0.1"
            value={rumpLengthCm}
            onChange={(e) => setRumpLengthCm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Height of Rump (cm)</label>
          <input
            type="number"
            step="0.1"
            value={rumpHeightCm}
            onChange={(e) => setRumpHeightCm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Lower Height (cm)</label>
          <input
            type="number"
            step="0.1"
            value={lowerHeightCm}
            onChange={(e) => setLowerHeightCm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Back Height (cm)</label>
          <input
            type="number"
            step="0.1"
            value={backHeightCm}
            onChange={(e) => setBackHeightCm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Body Length (cm)</label>
          <input
            type="number"
            step="0.1"
            value={bodyLengthCm}
            onChange={(e) => setBodyLengthCm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Rib Depth (cm)</label>
          <input
            type="number"
            step="0.1"
            value={ribDepthCm}
            onChange={(e) => setRibDepthCm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Chest Perimeter (cm)</label>
          <input
            type="number"
            step="0.1"
            value={chestPerimeterCm}
            onChange={(e) => setChestPerimeterCm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Body Width (cm)</label>
          <input
            type="number"
            step="0.1"
            value={bodyWidthCm}
            onChange={(e) => setBodyWidthCm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        {sex === 'MALE' && (
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Scrotal Circumference (cm)</label>
            <input
              type="number"
              step="0.5"
              value={scrotalCircumferenceCm}
              onChange={(e) => setScrotalCircumferenceCm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
            />
          </div>
        )}
      </div>
    </div>
  );
}
