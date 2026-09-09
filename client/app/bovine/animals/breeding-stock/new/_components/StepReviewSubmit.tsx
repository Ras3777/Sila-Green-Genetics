'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Animal, Sex } from '@/lib/bovine-types';

interface StepReviewSubmitProps {
  name: string;
  dgr: string;
  earTag: string;
  primaryBreed: string;
  sex: Sex;
  birthDate: string;
  calculateAge: (dateStr: string) => string;
  selectedSire?: Animal;
  externalSireName: string;
  selectedDam?: Animal;
  externalDamName: string;
  betaCasein: string;
  currentWeightKg: string;
  photoUrl: string;
  setPhotoUrl: (url: string) => void;
  registrationNotes: string;
  setRegistrationNotes: (notes: string) => void;
}

export function StepReviewSubmit({
  name,
  dgr,
  earTag,
  primaryBreed,
  sex,
  birthDate,
  calculateAge,
  selectedSire,
  externalSireName,
  selectedDam,
  externalDamName,
  betaCasein,
  currentWeightKg,
  photoUrl,
  setPhotoUrl,
  registrationNotes,
  setRegistrationNotes,
}: StepReviewSubmitProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-5">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
        <span>Step 7 — Registration Audit &amp; Confirmation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
          <div className="font-bold text-stone-900 text-sm">{name || 'Unnamed Candidate'}</div>
          <div>
            <span className="text-stone-500">DGR Registry ID:</span>{' '}
            <span className="font-mono font-bold text-stone-900">{dgr}</span>
          </div>
          <div>
            <span className="text-stone-500">Ear Tag:</span>{' '}
            <span className="font-mono">{earTag || 'Auto-generated'}</span>
          </div>
          <div>
            <span className="text-stone-500">Breed &amp; Sex:</span>{' '}
            <span className="font-semibold">{primaryBreed} ({sex})</span>
          </div>
          <div>
            <span className="text-stone-500">Birth Date:</span>{' '}
            <span>{birthDate} (Age: {calculateAge(birthDate)})</span>
          </div>
        </div>

        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
          <div className="font-bold text-stone-900 text-sm">Pedigree &amp; Genetic Provenance</div>
          <div>
            <span className="text-stone-500">Sire:</span>{' '}
            <span className="font-semibold">{selectedSire?.name || externalSireName || 'Recorded'}</span>
          </div>
          <div>
            <span className="text-stone-500">Dam:</span>{' '}
            <span className="font-semibold">{selectedDam?.name || externalDamName || 'Recorded'}</span>
          </div>
          <div>
            <span className="text-stone-500">Beta-Casein:</span>{' '}
            <span className="font-mono font-bold text-emerald-800">{betaCasein}</span>
          </div>
          <div>
            <span className="text-stone-500">Current Scale Weight:</span>{' '}
            <span className="font-mono font-bold">{currentWeightKg} kg</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">Photo URL</label>
        <input
          type="url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">Registration Notes</label>
        <textarea
          value={registrationNotes}
          onChange={(e) => setRegistrationNotes(e.target.value)}
          rows={2}
          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
        />
      </div>
    </div>
  );
}
