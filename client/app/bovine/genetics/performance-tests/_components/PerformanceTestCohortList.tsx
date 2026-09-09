'use client';

import React from 'react';
import { Building } from 'lucide-react';
import { PerformanceTest } from '@/lib/bovine-types';

interface PerformanceTestCohortListProps {
  performanceTests: PerformanceTest[];
  selectedTestId?: string;
  onSelectTest: (id: string) => void;
}

export function PerformanceTestCohortList({
  performanceTests,
  selectedTestId,
  onSelectTest,
}: PerformanceTestCohortListProps) {
  return (
    <div className="lg:col-span-4 space-y-3">
      {performanceTests.map((pt) => {
        const isSelected = pt.id === selectedTestId;
        return (
          <div
            key={pt.id}
            onClick={() => onSelectTest(pt.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2.5 ${
              isSelected
                ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                {pt.code}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  pt.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {pt.status}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-stone-900 text-sm">{pt.name}</h4>
              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5 text-stone-400" />
                <span>{pt.testStation}</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-100">
              <span className="font-semibold">{pt.durationDays} Days Duration</span>
              <span>{pt.enrolledCount} Head Enrolled</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
