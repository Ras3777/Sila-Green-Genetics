'use client';

import React from 'react';
import { Plus, FileText } from 'lucide-react';
import { PerformanceTest } from '@/lib/bovine-types';

interface PerformanceTestStationDetailProps {
  selectedTest: PerformanceTest;
  enrolledCount: number;
  onEnrollAnimal: () => void;
}

export function PerformanceTestStationDetail({
  selectedTest,
  enrolledCount,
  onEnrollAnimal,
}: PerformanceTestStationDetailProps) {
  return (
    <div className="space-y-6">
      {/* Top Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
              {selectedTest.code}
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-600">{selectedTest.durationDays} Days Standard Trial</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mt-1">{selectedTest.name}</h3>
        </div>

        <button
          onClick={onEnrollAnimal}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll Animal</span>
        </button>
      </div>

      {/* Station Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Test Station</span>
          <span className="font-bold text-stone-900">{selectedTest.testStation}</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Trial Supervisor</span>
          <span className="font-bold text-stone-900">{selectedTest.supervisor}</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Date Window</span>
          <span className="font-bold text-stone-900">{selectedTest.startDate} to {selectedTest.endDate}</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Active Cohort Size</span>
          <span className="font-bold text-emerald-800">{enrolledCount} Bulls Enrolled</span>
        </div>
      </div>

      {/* Standard Operating Protocol Notice */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
        <span className="font-bold flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-700" />
          Trial Protocol Specification:
        </span>
        <p className="text-[11px] text-blue-900 leading-relaxed">
          {selectedTest.protocolDescription} Evaluated traits: {(selectedTest.traitsEvaluated || []).join(', ')}.
          Interim weights taken every 28 days with calibrated multi-point load cells.
        </p>
      </div>
    </div>
  );
}
