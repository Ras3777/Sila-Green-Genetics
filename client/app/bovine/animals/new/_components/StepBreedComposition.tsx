'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface StepBreedCompositionProps {
  breedList: Array<{ breedName: string; percentage: number; source: any }>;
  setBreedList: React.Dispatch<
    React.SetStateAction<Array<{ breedName: string; percentage: number; source: any }>>
  >;
  addBreedRow: () => void;
  removeBreedRow: (index: number) => void;
  totalBreedPercentage: number;
  isBreedValid: boolean;
}

export function StepBreedComposition({
  breedList,
  setBreedList,
  addBreedRow,
  removeBreedRow,
  totalBreedPercentage,
  isBreedValid,
}: StepBreedCompositionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <h2 className="text-lg font-bold text-stone-900">4. Genetic Breed Composition</h2>
        <button
          type="button"
          onClick={addBreedRow}
          className="text-xs font-semibold text-emerald-800 hover:underline flex items-center"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Secondary Breed
        </button>
      </div>

      <p className="text-xs text-stone-500">
        Total percentage across all listed breeds must mathematically equal 100%.
      </p>

      <div className="space-y-3">
        {breedList.map((breed, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Breed Name (e.g. Holstein, Angus, Jersey)..."
                value={breed.breedName}
                onChange={(e) => {
                  const val = e.target.value;
                  setBreedList((prev) =>
                    prev.map((item, i) => (i === idx ? { ...item, breedName: val } : item))
                  );
                }}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900"
              />
            </div>

            <div className="w-24">
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={breed.percentage}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setBreedList((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, percentage: val } : item))
                    );
                  }}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 pr-6"
                />
                <span className="absolute right-2.5 top-1.5 text-xs text-stone-400 font-bold">%</span>
              </div>
            </div>

            <div className="w-36">
              <select
                value={breed.source}
                onChange={(e) => {
                  const src = e.target.value;
                  setBreedList((prev) =>
                    prev.map((item, i) => (i === idx ? { ...item, source: src } : item))
                  );
                }}
                className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-stone-900"
              >
                <option value="REGISTERED">Registered</option>
                <option value="GENOMIC">Genomic Assayed</option>
                <option value="PEDIGREE">Pedigree Estimate</option>
                <option value="PHENOTYPIC">Phenotypic</option>
              </select>
            </div>

            {breedList.length > 1 && (
              <button
                type="button"
                onClick={() => removeBreedRow(idx)}
                className="text-stone-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Sum validation display */}
      <div
        className={`p-3 rounded-2xl flex items-center justify-between text-xs font-semibold ${
          isBreedValid ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
        }`}
      >
        <span>Total Genetic Composition: {totalBreedPercentage}%</span>
        <span>{isBreedValid ? 'Valid (100%)' : 'Must equal exactly 100%'}</span>
      </div>
    </div>
  );
}
