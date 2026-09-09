'use client';

import React from 'react';
import { Activity } from 'lucide-react';

interface SectionSyncEstrusProps {
  syncProtocol: string;
  onSyncProtocolChange: (v: string) => void;
  estrusScore: number;
  onEstrusScoreChange: (v: number) => void;
  cervicalMucus: string;
  onCervicalMucusChange: (v: string) => void;
  uterineTone: string;
  onUterineToneChange: (v: string) => void;
}

export function SectionSyncEstrus({
  syncProtocol,
  onSyncProtocolChange,
  estrusScore,
  onEstrusScoreChange,
  cervicalMucus,
  onCervicalMucusChange,
  uterineTone,
  onUterineToneChange,
}: SectionSyncEstrusProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-700" />
        <span>Section B: Synchronization &amp; Estrus Responsiveness</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Sync Protocol
          </label>
          <input
            type="text"
            value={syncProtocol}
            onChange={(e) => onSyncProtocolChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Estrus Expression Score (1-5)
          </label>
          <select
            value={estrusScore}
            onChange={(e) => onEstrusScoreChange(parseInt(e.target.value))}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
          >
            <option value={5}>5 - Vigorous Standing Heat</option>
            <option value={4}>4 - Distinct Estrual Behavior</option>
            <option value={3}>3 - Moderate Signs</option>
            <option value={2}>2 - Weak / Marginal Heat</option>
            <option value={1}>1 - Anestrus / Unresponsive</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Cervical Mucus Discharge
          </label>
          <input
            type="text"
            value={cervicalMucus}
            onChange={(e) => onCervicalMucusChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Uterine Tone &amp; Edema
          </label>
          <input
            type="text"
            value={uterineTone}
            onChange={(e) => onUterineToneChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
