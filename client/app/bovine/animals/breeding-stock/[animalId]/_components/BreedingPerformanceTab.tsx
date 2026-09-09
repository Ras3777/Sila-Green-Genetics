'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  Animal,
  MaternalDevelopmentRecord,
  WeaningDevelopmentRecord,
  YearlingDevelopmentRecord,
} from '@/lib/bovine-types';

interface BreedingPerformanceTabProps {
  animal: Animal;
  maternalList: MaternalDevelopmentRecord[];
  weaningList: WeaningDevelopmentRecord[];
  yearlingList: YearlingDevelopmentRecord[];
}

export function BreedingPerformanceTab({
  animal,
  maternalList,
  weaningList,
  yearlingList,
}: BreedingPerformanceTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">Phase I</span>
            <span className="text-xs text-stone-400 font-mono">{maternalList.length} Entries</span>
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Maternal Development</h4>
          <p className="text-xs text-stone-500">
            Neonatal scale checkins, nurse cow association, and milk replacer uptake.
          </p>
          <Link
            href={`/bovine/animals/breeding-stock/${animal.id}/performance/maternal`}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline pt-2"
          >
            <span>Enter / View Phase I</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">Phase II</span>
            <span className="text-xs text-stone-400 font-mono">{weaningList.length} Entries</span>
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Weaning Performance</h4>
          <p className="text-xs text-stone-500">
            205-day adjusted weight, DR, SP, REA, SFT, MAR, and AC measurements.
          </p>
          <Link
            href={`/bovine/animals/breeding-stock/${animal.id}/performance/weaning`}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline pt-2"
          >
            <span>Enter / View Phase II</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">Phase III</span>
            <span className="text-xs text-stone-400 font-mono">{yearlingList.length} Entries</span>
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Yearling Performance</h4>
          <p className="text-xs text-stone-500">
            365-day weights with date-specific dietary regimes (DR-SP, DR-AC, DR-US).
          </p>
          <Link
            href={`/bovine/animals/breeding-stock/${animal.id}/performance/yearling`}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline pt-2"
          >
            <span>Enter / View Phase III</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
