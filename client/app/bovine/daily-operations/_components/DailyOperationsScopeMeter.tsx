'use client';

import React from 'react';
import { Farm, Herd } from '@/lib/bovine-types';

interface DailyOperationsScopeMeterProps {
  farms: Farm[];
  selectedFarm: string;
  onSelectFarm: (farmId: string) => void;
  herds: Herd[];
  selectedHerd: string;
  onSelectHerd: (herdId: string) => void;
  loggedCount: number;
  scopedAnimalsCount: number;
  missingCount: number;
  abnormalCount: number;
}

export function DailyOperationsScopeMeter({
  farms,
  selectedFarm,
  onSelectFarm,
  herds,
  selectedHerd,
  onSelectHerd,
  loggedCount,
  scopedAnimalsCount,
  missingCount,
  abnormalCount,
}: DailyOperationsScopeMeterProps) {
  const progressPercent = Math.round((loggedCount / (scopedAnimalsCount || 1)) * 100);
  const abnormalPercent = Math.round((abnormalCount / (scopedAnimalsCount || 1)) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
      <div>
        <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Farm Station</label>
        <select
          value={selectedFarm}
          onChange={(e) => onSelectFarm(e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
        >
          <option value="ALL">All Farms</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} ({f.code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Herd Group</label>
        <select
          value={selectedHerd}
          onChange={(e) => onSelectHerd(e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
        >
          <option value="ALL">All Herds</option>
          {herds
            .filter((h) => selectedFarm === 'ALL' || h.farmId === selectedFarm)
            .map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.purpose})
              </option>
            ))}
        </select>
      </div>

      {/* Completion Meter */}
      <div className="lg:col-span-2 flex flex-col justify-center space-y-1.5 pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-stone-200 pt-3 lg:pt-0">
        <div className="flex justify-between text-xs font-semibold text-stone-700">
          <span>Daily Progress Meter</span>
          <span>
            {loggedCount} of {scopedAnimalsCount} Head Logged ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden flex">
          <div
            className="bg-emerald-700 h-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          {abnormalCount > 0 && (
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${abnormalPercent}%` }}
            />
          )}
        </div>
        <div className="flex justify-between text-[11px] text-stone-500">
          <span>{missingCount} checks pending</span>
          <span className="text-amber-800 font-semibold">{abnormalCount} flagged abnormal</span>
        </div>
      </div>
    </div>
  );
}
