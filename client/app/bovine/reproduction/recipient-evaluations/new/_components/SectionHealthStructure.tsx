'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SectionHealthStructureProps {
  bcs: number;
  onBcsChange: (v: number) => void;
  tickCount: string;
  onTickCountChange: (v: string) => void;
  headEyes: string;
  onHeadEyesChange: (v: string) => void;
  bodyStructure: string;
  onBodyStructureChange: (v: string) => void;
  umbilicalCondition: string;
  onUmbilicalConditionChange: (v: string) => void;
  generalConformationScore: number;
  onGeneralConformationScoreChange: (v: number) => void;
  earTagVerified: boolean;
  onEarTagVerifiedChange: (v: boolean) => void;
}

export function SectionHealthStructure({
  bcs,
  onBcsChange,
  tickCount,
  onTickCountChange,
  headEyes,
  onHeadEyesChange,
  bodyStructure,
  onBodyStructureChange,
  umbilicalCondition,
  onUmbilicalConditionChange,
  generalConformationScore,
  onGeneralConformationScoreChange,
  earTagVerified,
  onEarTagVerifiedChange,
}: SectionHealthStructureProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-emerald-700" />
        <span>Section E: Health &amp; Structural Phenotypic Scoring</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Body Condition Score (BCS 1-9) *
          </label>
          <input
            type="number"
            step="0.25"
            min="1"
            max="9"
            value={bcs}
            onChange={(e) => onBcsChange(parseFloat(e.target.value))}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 font-bold"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Tick / Ectoparasite Burden
          </label>
          <input
            type="text"
            value={tickCount}
            onChange={(e) => onTickCountChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Head &amp; Eyes Conformation
          </label>
          <input
            type="text"
            value={headEyes}
            onChange={(e) => onHeadEyesChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Pelvic &amp; Body Structure
          </label>
          <input
            type="text"
            value={bodyStructure}
            onChange={(e) => onBodyStructureChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Umbilical / Navel Fold
          </label>
          <input
            type="text"
            value={umbilicalCondition}
            onChange={(e) => onUmbilicalConditionChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            General Conformation Score (1-5)
          </label>
          <select
            value={generalConformationScore}
            onChange={(e) => onGeneralConformationScoreChange(parseInt(e.target.value))}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
          >
            <option value={5}>5 - Outstanding</option>
            <option value={4}>4 - Superior Maternal</option>
            <option value={3}>3 - Acceptable Standard</option>
            <option value={2}>2 - Marginal</option>
            <option value={1}>1 - Unsuitable</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="cb-ear-tag-verified"
          checked={earTagVerified}
          onChange={(e) => onEarTagVerifiedChange(e.target.checked)}
          className="w-4 h-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-700 cursor-pointer"
        />
        <label htmlFor="cb-ear-tag-verified" className="text-xs text-stone-700 font-semibold cursor-pointer">
          Physically verified visual ear tag matches registry record
        </label>
      </div>
    </div>
  );
}
