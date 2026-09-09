'use client';

import React from 'react';
import { CalendarCheck2 } from 'lucide-react';

interface DailyOperationsHeaderProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  supervisorMode: boolean;
  onToggleSupervisorMode: () => void;
}

export function DailyOperationsHeader({
  selectedDate,
  onSelectDate,
  supervisorMode,
  onToggleSupervisorMode,
}: DailyOperationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <CalendarCheck2 className="w-3.5 h-3.5" />
          <span>Herd Health Monitoring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Daily Operations Workbench
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Rapid mass vital-entry, rumination telemetry, and clinical abnormality flags
        </p>
      </div>

      {/* Date & Supervisor Mode */}
      <div className="flex items-center space-x-2">
        <input
          id="input-daily-ops-date"
          type="date"
          value={selectedDate}
          onChange={(e) => onSelectDate(e.target.value)}
          className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 shadow-2xs"
        />

        <button
          id="btn-toggle-supervisor-mode"
          onClick={onToggleSupervisorMode}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
            supervisorMode
              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
          }`}
        >
          {supervisorMode ? 'Supervisor Review Active' : 'Supervisor Mode'}
        </button>
      </div>
    </div>
  );
}
