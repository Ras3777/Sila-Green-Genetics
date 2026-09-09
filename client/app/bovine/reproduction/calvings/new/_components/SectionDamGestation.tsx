'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { Animal, Farm, Pregnancy } from '@/lib/bovine-types';

interface SectionDamGestationProps {
  femaleAnimals: Animal[];
  damId: string;
  onDamChange: (newDamId: string) => void;
  calvingDate: string;
  onCalvingDateChange: (date: string) => void;
  calvingTime: string;
  onCalvingTimeChange: (time: string) => void;
  farms: Farm[];
  farmId: string;
  onFarmChange: (farmId: string) => void;
  sirePlaceholder: string;
  onSirePlaceholderChange: (sire: string) => void;
  activePregnancy?: Pregnancy;
}

export function SectionDamGestation({
  femaleAnimals,
  damId,
  onDamChange,
  calvingDate,
  onCalvingDateChange,
  calvingTime,
  onCalvingTimeChange,
  farms,
  farmId,
  onFarmChange,
  sirePlaceholder,
  onSirePlaceholderChange,
  activePregnancy,
}: SectionDamGestationProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
        <Heart className="w-5 h-5 text-emerald-700" />
        <span>1. Dam (Mother) &amp; Gestation Context</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Select Calving Dam (Cow) *
          </label>
          <select
            value={damId}
            onChange={(e) => onDamChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          >
            {femaleAnimals.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.primaryIdentifier || f.internalId}) • {f.breed || 'Angus'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Calving Date *
          </label>
          <input
            type="date"
            value={calvingDate}
            onChange={(e) => onCalvingDateChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Calving Time
          </label>
          <input
            type="time"
            value={calvingTime}
            onChange={(e) => onCalvingTimeChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Birth Facility / Farm
          </label>
          <select
            value={farmId}
            onChange={(e) => onFarmChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Sire / Service Bull (Father)
          </label>
          <input
            type="text"
            value={sirePlaceholder}
            onChange={(e) => onSirePlaceholderChange(e.target.value)}
            placeholder="e.g. SAV Raindance 6848"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Linked Gestation / Pregnancy
          </label>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
            {activePregnancy ? (
              <span className="text-emerald-800 font-semibold">
                Confirmed Active Pregnancy #{activePregnancy.id}
              </span>
            ) : (
              <span className="text-stone-400">Natural / Unlinked Service</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
