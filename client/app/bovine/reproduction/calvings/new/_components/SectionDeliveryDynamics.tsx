'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CalvingEase } from '@/lib/bovine-types';

interface SectionDeliveryDynamicsProps {
  difficulty: CalvingEase;
  onDifficultyChange: (difficulty: CalvingEase) => void;
  deliveryType: string;
  onDeliveryTypeChange: (type: string) => void;
  maternalBehaviorScore: number;
  onMaternalBehaviorScoreChange: (score: number) => void;
  colostrumQuality: string;
  onColostrumQualityChange: (quality: string) => void;
  assistanceDetails: string;
  onAssistanceDetailsChange: (details: string) => void;
}

export function SectionDeliveryDynamics({
  difficulty,
  onDifficultyChange,
  deliveryType,
  onDeliveryTypeChange,
  maternalBehaviorScore,
  onMaternalBehaviorScoreChange,
  colostrumQuality,
  onColostrumQualityChange,
  assistanceDetails,
  onAssistanceDetailsChange,
}: SectionDeliveryDynamicsProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-700" />
        <span>2. Delivery Dynamics &amp; Maternal Vigor</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Calving Ease / Difficulty *
          </label>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as CalvingEase)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
          >
            <option value="NORMAL">Score 1 - Normal / Unassisted</option>
            <option value="EASY">Score 2 - Easy (Hand assistance)</option>
            <option value="ASSISTED">Score 3 - Assisted (Mechanical pull)</option>
            <option value="DIFFICULT_VET">Score 4 - Difficult / Vet Required</option>
            <option value="SURGICAL_CAESAREAN">Score 5 - Surgical Caesarean Section</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Delivery Type
          </label>
          <input
            type="text"
            value={deliveryType}
            onChange={(e) => onDeliveryTypeChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Maternal Behavior (1-5)
          </label>
          <select
            value={maternalBehaviorScore}
            onChange={(e) => onMaternalBehaviorScoreChange(parseInt(e.target.value))}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
          >
            <option value={5}>5 - Attentive &amp; Protective</option>
            <option value={4}>4 - Normal Maternal Care</option>
            <option value={3}>3 - Passive</option>
            <option value={2}>2 - Disinterested</option>
            <option value={1}>1 - Aggressive to Calf</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Colostrum Quality (Brix)
          </label>
          <select
            value={colostrumQuality}
            onChange={(e) => onColostrumQualityChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="EXCELLENT">Excellent (&gt;22% Brix / &gt;50 g/L IgG)</option>
            <option value="GOOD">Good (18-22% Brix)</option>
            <option value="FAIR">Fair (15-18% Brix)</option>
            <option value="POOR">Poor (&lt;15% Brix - Replaced)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          Obstetrical Notes / Assistance Details
        </label>
        <input
          type="text"
          value={assistanceDetails}
          onChange={(e) => onAssistanceDetailsChange(e.target.value)}
          placeholder="e.g. Anterior presentation, slight assistance given for front legs"
          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
        />
      </div>
    </div>
  );
}
