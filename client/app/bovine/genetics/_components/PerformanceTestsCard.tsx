'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { PerformanceTest } from '@/lib/bovine-types';

interface PerformanceTestsCardProps {
  performanceTests: PerformanceTest[];
}

export function PerformanceTestsCard({ performanceTests }: PerformanceTestsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs font-bold text-stone-900">Performance Tests</h4>
        </div>
        <Link
          href="/bovine/genetics/performance-tests"
          className="text-[11px] font-semibold text-emerald-800 hover:underline"
        >
          Explore All
        </Link>
      </div>

      <div className="space-y-2.5 text-xs">
        {performanceTests.map((pt) => (
          <div key={pt.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">{pt.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                  pt.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {pt.status}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 flex items-center justify-between">
              <span>{pt.testStation}</span>
              <span>{pt.enrolledCount} enrolled</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
