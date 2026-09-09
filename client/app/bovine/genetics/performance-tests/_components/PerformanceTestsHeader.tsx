'use client';

import React from 'react';
import { Trophy, Plus } from 'lucide-react';

interface PerformanceTestsHeaderProps {
  onCreateTest: () => void;
}

export function PerformanceTestsHeader({ onCreateTest }: PerformanceTestsHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Standardized Cohort Testing
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-xs text-stone-500">Feed Efficiency &amp; Carcass Ultrasound</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-700" />
          Performance Testing Cohorts
        </h2>
        <p className="text-xs text-stone-600 max-w-2xl">
          Controlled test station trials measuring Average Daily Gain (ADG), Feed Conversion Ratio (FCR), Residual Feed Intake (RFI) via Insentec/Calan feeders, and real-time carcass ultrasound.
        </p>
      </div>

      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={onCreateTest}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Test</span>
        </button>
      </div>
    </div>
  );
}
