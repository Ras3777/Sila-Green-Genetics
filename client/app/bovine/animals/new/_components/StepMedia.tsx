'use client';

import React from 'react';

interface StepMediaProps {
  photoUrl: string;
  setPhotoUrl: (url: string) => void;
  registrationDocName: string;
  setRegistrationDocName: (name: string) => void;
}

export function StepMedia({
  photoUrl,
  setPhotoUrl,
  registrationDocName,
  setRegistrationDocName,
}: StepMediaProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
        6. Photos, DNA Cards & Documents
      </h2>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Identification Photo URL</label>
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">Breed Association Certificate File</label>
        <input
          type="text"
          value={registrationDocName}
          onChange={(e) => setRegistrationDocName(e.target.value)}
          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
        />
      </div>
    </div>
  );
}
