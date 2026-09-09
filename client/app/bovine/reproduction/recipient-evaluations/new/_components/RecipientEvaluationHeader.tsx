'use client';

import React from 'react';

interface RecipientEvaluationHeaderProps {
  overallStatus: 'APPROVED' | 'CONDITIONAL' | 'REJECTED';
  onOverallStatusChange: (status: 'APPROVED' | 'CONDITIONAL' | 'REJECTED') => void;
}

export function RecipientEvaluationHeader({
  overallStatus,
  onOverallStatusChange,
}: RecipientEvaluationHeaderProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          Clinical Screening
        </span>
        <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
          New Recipient Cow Evaluation Scorecard
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Conduct standardized pre-transfer reproductive, structural, and maternal capability audits for embryo surrogates.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={overallStatus}
          onChange={(e) => onOverallStatusChange(e.target.value as any)}
          className="bg-stone-50 border border-stone-300 text-stone-900 font-bold text-xs rounded-xl px-3 py-2 cursor-pointer"
        >
          <option value="APPROVED">ET APPROVED</option>
          <option value="CONDITIONAL">CONDITIONAL</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>
    </div>
  );
}
