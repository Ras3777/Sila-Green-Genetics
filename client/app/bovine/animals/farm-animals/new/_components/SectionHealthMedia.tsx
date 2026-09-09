'use client';

import React from 'react';
import { HeartPulse } from 'lucide-react';

interface SectionHealthMediaProps {
  initialVaccinations: string;
  setInitialVaccinations: (v: string) => void;
  photoUrl: string;
  setPhotoUrl: (v: string) => void;
  healthNotes: string;
  setHealthNotes: (v: string) => void;
}

export function SectionHealthMedia({
  initialVaccinations,
  setInitialVaccinations,
  photoUrl,
  setPhotoUrl,
  healthNotes,
  setHealthNotes,
}: SectionHealthMediaProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <HeartPulse className="w-4 h-4 text-emerald-700" />
        <span>Section F &amp; G — Health, Preventive State &amp; Photo</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Initial Vaccines Administered</label>
          <input
            type="text"
            value={initialVaccinations}
            onChange={(e) => setInitialVaccinations(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Animal Photo URL</label>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1">Clinical / Health Notes</label>
          <textarea
            value={healthNotes}
            onChange={(e) => setHealthNotes(e.target.value)}
            rows={2}
            placeholder="Initial pen check observations, feeding vigor, and physical soundness remarks..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
