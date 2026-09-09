'use client';

import React from 'react';
import { Dna } from 'lucide-react';

interface BreedRow {
  breedName: string;
  percentage: number;
}

interface StepBreedNucleusProps {
  breedRows: BreedRow[];
  setBreedRows: (rows: BreedRow[]) => void;
  paternalNucleus: string;
  setPaternalNucleus: (val: string) => void;
  paternalType: string;
  setPaternalType: (val: string) => void;
}

export function StepBreedNucleus({
  breedRows,
  setBreedRows,
  paternalNucleus,
  setPaternalNucleus,
  paternalType,
  setPaternalType,
}: StepBreedNucleusProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Dna className="w-4 h-4 text-amber-700" />
        <span>Step 4 — Breed Composition &amp; Paternal Line</span>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-bold text-stone-800">Breed Composition Breakout</div>
        {breedRows.map((row, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <input
              type="text"
              value={row.breedName}
              onChange={(e) => {
                const next = [...breedRows];
                next[idx].breedName = e.target.value;
                setBreedRows(next);
              }}
              placeholder="Breed Name"
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold"
            />
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={row.percentage}
                onChange={(e) => {
                  const next = [...breedRows];
                  next[idx].percentage = parseFloat(e.target.value) || 0;
                  setBreedRows(next);
                }}
                className="w-20 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
              />
              <span className="text-xs text-stone-500 font-bold">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Paternal Nucleus Cohort</label>
          <input
            type="text"
            value={paternalNucleus}
            onChange={(e) => setPaternalNucleus(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Paternal Lineage Type</label>
          <select
            value={paternalType}
            onChange={(e) => setPaternalType(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="GENOMIC_PROVEN">Genomically Proven Top 1%</option>
            <option value="PROGENY_TESTED">Progeny Tested &gt;80 Daughters</option>
            <option value="FOUNDATION">Foundational Heritage Line</option>
          </select>
        </div>
      </div>
    </div>
  );
}
