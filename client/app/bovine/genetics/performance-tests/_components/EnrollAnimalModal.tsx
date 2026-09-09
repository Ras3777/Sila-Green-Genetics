'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Animal } from '@/lib/bovine-types';

interface EnrollAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  testCode?: string;
  animals: Animal[];
  enrollAnimalId: string;
  setEnrollAnimalId: (id: string) => void;
  enrollEntryWeight: string;
  setEnrollEntryWeight: (weight: string) => void;
}

export function EnrollAnimalModal({
  isOpen,
  onClose,
  onSubmit,
  testCode,
  animals,
  enrollAnimalId,
  setEnrollAnimalId,
  enrollEntryWeight,
  setEnrollEntryWeight,
}: EnrollAnimalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-base font-bold text-stone-900">Enroll Animal in {testCode}</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Select Animal</label>
            <select
              value={enrollAnimalId}
              onChange={(e) => setEnrollAnimalId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.primaryIdentifier || a.internalId}) - {a.sex}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Official Entry Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 340.5"
              value={enrollEntryWeight}
              onChange={(e) => setEnrollEntryWeight(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold cursor-pointer"
            >
              Confirm Enrollment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
