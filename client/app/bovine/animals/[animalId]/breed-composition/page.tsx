'use client';

import React, { use, useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  Dna,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { AnimalBreedComposition } from '@/lib/bovine-types';

export default function AnimalBreedCompositionPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, breedCompositions, updateBreedComposition } = useBovine();
  const animal = animals.find((a) => a.id === animalId);
  const existingBreeds = breedCompositions.filter((bc) => bc.animalId === animalId);

  const [breeds, setBreeds] = useState<
    Array<{ breedName: string; percentage: number; source: any }>
  >(
    existingBreeds.length > 0
      ? existingBreeds.map((b) => ({
          breedName: b.breedName,
          percentage: b.percentage,
          source: b.source,
        }))
      : [{ breedName: 'Holstein', percentage: 100, source: 'REGISTERED' }]
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!animal) return null;

  const totalPercentage = breeds.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0);
  const isValid = totalPercentage === 100;

  const addBreed = () => {
    setBreeds((prev) => [
      ...prev,
      { breedName: 'Jersey', percentage: 0, source: 'GENOMIC' },
    ]);
  };

  const removeBreed = (index: number) => {
    if (breeds.length > 1) {
      setBreeds((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const formattedBreeds = breeds.map((b) => ({
      breedId: b.breedName.toLowerCase().replace(/\s+/g, '-'),
      breedName: b.breedName,
      percentage: b.percentage,
      source: (b.source || 'REGISTRY') as any,
      confidence: 'HIGH' as const,
      recordedDate: '2026-09-04',
    }));

    updateBreedComposition(animal.id, formattedBreeds);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Current Breakdown Visual */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
          <Dna className="w-4 h-4 text-emerald-800" />
          <span>Genetic Breed Composition</span>
        </h2>
        <p className="text-xs text-stone-500">
          Proportional genetic fraction determined via certified breed registry or genomic SNP chip array.
        </p>

        {/* Visual Progress Bar */}
        <div className="w-full h-4 rounded-full bg-stone-100 overflow-hidden flex">
          {breeds.map((b, idx) => (
            <div
              key={idx}
              className={`h-full ${idx % 2 === 0 ? 'bg-emerald-700' : 'bg-teal-600'} transition-all`}
              style={{ width: `${b.percentage}%` }}
              title={`${b.breedName}: ${b.percentage}%`}
            />
          ))}
        </div>

        {/* Breed Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {breeds.map((b, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between min-w-[180px]"
            >
              <div>
                <div className="font-bold text-stone-900">{b.breedName}</div>
                <div className="text-[10px] text-stone-500 uppercase">{b.source.replace(/_/g, ' ')}</div>
              </div>
              <div className="text-base font-bold text-emerald-800">{b.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Form */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h2 className="text-base font-bold text-stone-900">Edit Breed Components</h2>
          <button
            type="button"
            onClick={addBreed}
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Component
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Breed composition updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3">
          {breeds.map((breed, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Breed name..."
                  value={breed.breedName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBreeds((prev) =>
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
                      setBreeds((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, percentage: val } : item))
                      );
                    }}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 pr-6"
                  />
                  <span className="absolute right-2.5 top-1.5 text-stone-400 font-bold">%</span>
                </div>
              </div>

              <div className="w-36">
                <select
                  value={breed.source}
                  onChange={(e) => {
                    const src = e.target.value;
                    setBreeds((prev) =>
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

              {breeds.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBreed(idx)}
                  className="text-stone-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Validation Total Banner */}
          <div
            className={`p-3 rounded-2xl flex items-center justify-between text-xs font-semibold ${
              isValid ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            <span>Total Breed Composition: {totalPercentage}%</span>
            <span>{isValid ? 'Mathematically Valid (100%)' : 'Must sum to exactly 100%'}</span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isValid}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Save Composition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
