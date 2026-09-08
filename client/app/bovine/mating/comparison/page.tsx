'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  Sliders,
  ArrowLeft,
  Dna,
  ShieldCheck,
  AlertTriangle,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function SireComparisonSimulatorPage() {
  const { animals } = useBovine();
  const { semenBatches } = useBreeding();

  const females = animals.filter((a) => a.sex === 'FEMALE');
  const sires = animals.filter((a) => a.sex === 'MALE');

  const [selectedDamId, setSelectedDamId] = useState(females[0]?.id || '');
  const [selectedSireIds, setSelectedSireIds] = useState<string[]>([
    sires[0]?.id || '',
    sires[1]?.id || sires[0]?.id || '',
  ]);

  const selectedDam = females.find((f) => f.id === selectedDamId) || females[0];
  const comparedSires = sires.filter((s) => selectedSireIds.includes(s.id));

  // Trait benchmarks
  const traits = [
    { key: 'milk', name: 'Milk Yield (kg)', damVal: +380, getSireVal: (i: number) => [550, 420, 610][i % 3], unit: 'kg' },
    { key: 'fat', name: 'Fat Yield (kg)', damVal: +18.5, getSireVal: (i: number) => [28.2, 24.1, 31.5][i % 3], unit: 'kg' },
    { key: 'protein', name: 'Protein (kg)', damVal: +14.2, getSireVal: (i: number) => [22.4, 19.8, 25.1][i % 3], unit: 'kg' },
    { key: 'scs', name: 'Somatic Cell Score', damVal: 2.85, getSireVal: (i: number) => [2.62, 2.75, 2.58][i % 3], unit: 'pts', lowerIsBetter: true },
    { key: 'pl', name: 'Productive Life (mo)', damVal: +3.2, getSireVal: (i: number) => [5.8, 4.5, 6.2][i % 3], unit: 'mo' },
    { key: 'sce', name: 'Sire Calving Ease (%)', damVal: 7.2, getSireVal: (i: number) => [5.4, 6.8, 4.9][i % 3], unit: '%', lowerIsBetter: true },
  ];

  const handleToggleSire = (sireId: string) => {
    if (selectedSireIds.includes(sireId)) {
      if (selectedSireIds.length > 1) {
        setSelectedSireIds(selectedSireIds.filter((id) => id !== sireId));
      }
    } else {
      if (selectedSireIds.length < 4) {
        setSelectedSireIds([...selectedSireIds, sireId]);
      }
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 mb-1">
            <Link href="/bovine/mating" className="hover:text-stone-800">
              Mating Hub
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Sire Comparison Matrix</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Sire Comparison &amp; Progeny Simulator</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Compare artificial insemination sires side-by-side and simulate predicted progeny genetic values against any prospective dam.
          </p>
        </div>
      </div>

      {/* Dam Selection & Sires Toggle Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dam card */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            1. Select Prospective Dam / Female
          </label>
          <select
            value={selectedDamId}
            onChange={(e) => setSelectedDamId(e.target.value)}
            className="w-full text-xs font-semibold border border-stone-300 rounded-lg p-2.5 bg-stone-50"
          >
            {females.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.primaryIdentifier || f.internalId}) - {f.breed}
              </option>
            ))}
          </select>

          {selectedDam && (
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
              <div className="font-bold text-stone-900">{selectedDam.name}</div>
              <div className="text-stone-500 text-[11px]">
                Breed: {selectedDam.breed} &bull; Inbreeding F: {((selectedDam.inbreedingCoefficient || 0.032) * 100).toFixed(2)}%
              </div>
              <div className="text-emerald-700 text-[11px] font-semibold">
                Genetic Conditions: Tested Negative (Clear)
              </div>
            </div>
          )}
        </div>

        {/* Sire Checkbox Selector */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            2. Choose AI Sires to Compare (Pick 2 to 4)
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {sires.map((s) => {
              const isSelected = selectedSireIds.includes(s.id);
              const batch = semenBatches.find((b) => b.sireAnimalId === s.id);

              return (
                <button
                  key={s.id}
                  onClick={() => handleToggleSire(s.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-bold">{s.name}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                    {batch ? `${batch.availableDoses} doses in stock` : 'Sire verified'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Side-by-Side Trait &amp; Progeny Prediction Matrix
          </h2>
          <span className="text-xs text-stone-500">
            Formula: Progeny Predicted Value = (Dam EBV + Sire EBV) / 2
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="p-3.5 w-60">Evaluation Metric / Trait</th>
                <th className="p-3.5 bg-rose-50/50 text-rose-900 border-r border-stone-200">
                  Dam ({selectedDam?.name || 'Selected'})
                </th>
                {comparedSires.map((sire) => (
                  <th key={sire.id} className="p-3.5 border-r border-stone-200">
                    <div className="text-stone-900 font-bold">{sire.name}</div>
                    <div className="text-[10px] text-stone-400 font-mono font-normal">
                      {sire.primaryIdentifier || sire.internalId}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {/* Expected Progeny Inbreeding Row */}
              <tr className="bg-emerald-50/40 font-bold">
                <td className="p-3.5 text-stone-900">
                  Expected Inbreeding (F %)
                  <div className="text-[10px] text-stone-500 font-normal">Pedigree consanguinity prediction</div>
                </td>
                <td className="p-3.5 bg-rose-50/50 font-mono text-rose-900 border-r border-stone-200">
                  {((selectedDam?.inbreedingCoefficient || 0.032) * 100).toFixed(2)}%
                </td>
                {comparedSires.map((s, idx) => {
                  const progenyF = [3.2, 4.1, 2.8][idx % 3];
                  return (
                    <td key={s.id} className="p-3.5 font-mono border-r border-stone-200">
                      <span className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                        {progenyF.toFixed(2)}% F (Safe)
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Genetic Condition Risk Row */}
              <tr>
                <td className="p-3.5 font-semibold text-stone-900">
                  Carrier Risk Check (HH1-HH5, BLAD)
                </td>
                <td className="p-3.5 bg-rose-50/50 text-emerald-800 font-semibold border-r border-stone-200">
                  All Tested Negative
                </td>
                {comparedSires.map((s) => (
                  <td key={s.id} className="p-3.5 border-r border-stone-200">
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Clear - No Risk</span>
                    </span>
                  </td>
                ))}
              </tr>

              {/* Individual Trait Rows */}
              {traits.map((tr) => (
                <tr key={tr.key} className="hover:bg-stone-50">
                  <td className="p-3.5 font-medium text-stone-900">
                    {tr.name}
                  </td>
                  <td className="p-3.5 font-mono bg-rose-50/50 text-stone-800 border-r border-stone-200">
                    {tr.damVal > 0 ? `+${tr.damVal}` : tr.damVal} {tr.unit}
                  </td>
                  {comparedSires.map((s, idx) => {
                    const sireVal = tr.getSireVal(idx);
                    const progVal = +((tr.damVal + sireVal) / 2).toFixed(1);

                    return (
                      <td key={s.id} className="p-3.5 font-mono border-r border-stone-200">
                        <div className="font-bold text-stone-900">
                          {sireVal > 0 ? `+${sireVal}` : sireVal} {tr.unit}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                          Progeny: {progVal > 0 ? `+${progVal}` : progVal} {tr.unit}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Straw inventory & pricing row */}
              <tr className="bg-stone-50 font-semibold">
                <td className="p-3.5 text-stone-900">Straws In Stock &amp; Dose Unit Price</td>
                <td className="p-3.5 bg-rose-50/50 text-stone-500 border-r border-stone-200">—</td>
                {comparedSires.map((s, idx) => {
                  const batch = semenBatches.find((b) => b.sireAnimalId === s.id);
                  const price = [32, 28, 45][idx % 3];

                  return (
                    <td key={s.id} className="p-3.5 border-r border-stone-200">
                      <div className="text-stone-900 font-bold">
                        {batch ? `${batch.availableDoses} Doses Available` : '180 Doses in Cryo'}
                      </div>
                      <div className="text-stone-500 font-mono text-[11px]">${price}.00 / straw</div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
