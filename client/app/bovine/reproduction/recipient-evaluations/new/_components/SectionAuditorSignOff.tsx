'use client';

import React from 'react';
import { FileCheck } from 'lucide-react';

interface SectionAuditorSignOffProps {
  evaluator: string;
  onEvaluatorChange: (v: string) => void;
  evaluationDate: string;
  onEvaluationDateChange: (v: string) => void;
  overallStatus: 'APPROVED' | 'CONDITIONAL' | 'REJECTED';
  onOverallStatusChange: (v: 'APPROVED' | 'CONDITIONAL' | 'REJECTED') => void;
  notes: string;
  onNotesChange: (v: string) => void;
}

export function SectionAuditorSignOff({
  evaluator,
  onEvaluatorChange,
  evaluationDate,
  onEvaluationDateChange,
  overallStatus,
  onOverallStatusChange,
  notes,
  onNotesChange,
}: SectionAuditorSignOffProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <FileCheck className="w-5 h-5 text-emerald-700" />
        <span>Auditor Sign-Off &amp; Qualification</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Licensed Evaluator / Vet *
          </label>
          <input
            type="text"
            value={evaluator}
            onChange={(e) => onEvaluatorChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Evaluation Date *
          </label>
          <input
            type="date"
            value={evaluationDate}
            onChange={(e) => onEvaluationDateChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Final Recommendation
          </label>
          <select
            value={overallStatus}
            onChange={(e) => onOverallStatusChange(e.target.value as any)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 cursor-pointer"
          >
            <option value="APPROVED">APPROVED FOR TRANSFER</option>
            <option value="CONDITIONAL">CONDITIONAL (Follow-up)</option>
            <option value="REJECTED">REJECTED (Not Suitable)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">Clinical Evaluation Summary Notes</label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={2}
          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
        />
      </div>
    </div>
  );
}
