'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Animal, DailyLog } from '@/lib/bovine-types';

interface DailyOperationsAnimalRowProps {
  animal: Animal;
  existingLog?: DailyLog;
  rowState: Partial<DailyLog>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRowChange: (field: string, value: any) => void;
  onQuickNormal: () => void;
  onSaveRow: () => void;
}

export function DailyOperationsAnimalRow({
  animal,
  existingLog,
  rowState,
  isExpanded,
  onToggleExpand,
  onRowChange,
  onQuickNormal,
  onSaveRow,
}: DailyOperationsAnimalRowProps) {
  const isAbnormal =
    rowState.operationalStatus === 'SICK' ||
    (rowState.temperatureC && rowState.temperatureC > 39.3) ||
    (rowState.lamenessScore && rowState.lamenessScore >= 3);

  return (
    <div
      className={`rounded-3xl bg-white border transition-all ${
        existingLog?.isAbnormal || isAbnormal
          ? 'border-amber-300 shadow-xs'
          : existingLog
          ? 'border-stone-200/90'
          : 'border-stone-200/80 shadow-2xs'
      }`}
    >
      {/* Compact Row */}
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Animal Info */}
        <div className="flex items-center space-x-3 min-w-[200px]">
          <div className={`w-3 h-3 rounded-full ${existingLog ? 'bg-emerald-500' : 'bg-stone-300'}`} />
          <div>
            <div className="font-bold text-stone-900 text-sm flex items-center space-x-1.5">
              <Link href={`/bovine/animals/${animal.id}`} className="hover:text-emerald-800 hover:underline">
                {animal.name}
              </Link>
              {animal.requiresReview && (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  Review
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-stone-500">
              {animal.primaryIdentifier || animal.internalId} • {animal.useStatus}
            </div>
          </div>
        </div>

        {/* Fast Field Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 flex-1 text-xs">
          {/* Status */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Status</label>
            <select
              value={rowState.operationalStatus || 'HEALTHY'}
              onChange={(e) => onRowChange('operationalStatus', e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 text-xs font-semibold text-stone-800"
            >
              <option value="HEALTHY">Healthy</option>
              <option value="IN_HEAT">In Heat</option>
              <option value="SICK">Sick</option>
              <option value="INJURED">Injured</option>
              <option value="IN_TREATMENT">In Treatment</option>
              <option value="QUARANTINE">Quarantine</option>
              <option value="OFF_FEED">Off Feed</option>
            </select>
          </div>

          {/* Temp (°C) */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Temp (°C)</label>
            <input
              type="number"
              step="0.1"
              value={rowState.temperatureC || 38.5}
              onChange={(e) => onRowChange('temperatureC', parseFloat(e.target.value))}
              className={`w-full bg-stone-50 border rounded-xl px-2 py-1 text-xs font-mono font-bold ${
                (rowState.temperatureC || 0) > 39.3 ? 'border-amber-400 text-amber-800 bg-amber-50' : 'border-stone-200 text-stone-800'
              }`}
            />
          </div>

          {/* Appetite */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Appetite</label>
            <select
              value={rowState.appetite || 'NORMAL'}
              onChange={(e) => onRowChange('appetite', e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 text-xs text-stone-800"
            >
              <option value="NORMAL">Normal</option>
              <option value="REDUCED">Reduced</option>
              <option value="OFF_FEED">Off-Feed</option>
            </select>
          </div>

          {/* Lameness (1-5) */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Lameness (1-5)</label>
            <select
              value={rowState.lamenessScore || 1}
              onChange={(e) => onRowChange('lamenessScore', parseInt(e.target.value))}
              className={`w-full bg-stone-50 border rounded-xl px-2 py-1 text-xs ${
                (rowState.lamenessScore || 1) >= 3 ? 'border-amber-400 text-amber-800 bg-amber-50 font-bold' : 'border-stone-200 text-stone-800'
              }`}
            >
              <option value={1}>1 - Normal Gait</option>
              <option value={2}>2 - Mildly Lame</option>
              <option value={3}>3 - Moderately Lame</option>
              <option value={4}>4 - Lame</option>
              <option value={5}>5 - Severely Lame</option>
            </select>
          </div>

          {/* Notes */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Clinical Note</label>
            <input
              type="text"
              placeholder="e.g. Mild cough, clear eyes"
              value={rowState.notes || ''}
              onChange={(e) => onRowChange('notes', e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 text-xs text-stone-800"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 justify-end">
          {!existingLog && (
            <button
              onClick={onQuickNormal}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-xs font-semibold transition-colors cursor-pointer border border-stone-200"
              title="Mark healthy and normal with standard vitals"
            >
              Normal
            </button>
          )}

          <button
            onClick={onSaveRow}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Save
          </button>

          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
            title={isExpanded ? 'Collapse vitals' : 'Expand detailed vitals'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Detailed Vitals Drawer */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-stone-50/80 border-t border-stone-100 rounded-b-3xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Rumination (min/day)</label>
            <input
              type="number"
              value={rowState.ruminationMinutes || 450}
              onChange={(e) => onRowChange('ruminationMinutes', parseInt(e.target.value))}
              className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Body Condition (BCS)</label>
            <input
              type="number"
              step="0.25"
              value={rowState.bcs || 3.25}
              onChange={(e) => onRowChange('bcs', parseFloat(e.target.value))}
              className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Weight (kg)</label>
            <input
              type="number"
              value={rowState.weightKg || 620}
              onChange={(e) => onRowChange('weightKg', parseFloat(e.target.value))}
              className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Heart Rate (bpm)</label>
            <input
              type="number"
              value={rowState.heartRateBpm || 68}
              onChange={(e) => onRowChange('heartRateBpm', parseInt(e.target.value))}
              className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Respiration (breaths/m)</label>
            <input
              type="number"
              value={rowState.respirationRateBpm || 26}
              onChange={(e) => onRowChange('respirationRateBpm', parseInt(e.target.value))}
              className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Manure Score (1-5)</label>
            <select
              value={rowState.manureScore || 3}
              onChange={(e) => onRowChange('manureScore', parseInt(e.target.value))}
              className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
            >
              <option value={1}>1 - Liquid</option>
              <option value={2}>2 - Loose</option>
              <option value={3}>3 - Ideal / Porridge</option>
              <option value={4}>4 - Thick</option>
              <option value={5}>5 - Dry balls</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
