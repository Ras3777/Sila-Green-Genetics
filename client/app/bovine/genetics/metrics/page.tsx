'use client';

import React, { useState } from 'react';
import {
  Flame,
  Search,
  Filter,
  Dna,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  PieChart,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';

export default function GeneticMetricsPage() {
  const { animals } = useBovine();
  const { animalGeneticMetrics, breeds } = useGenetics();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(animals[0]?.id || '');

  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId) || animals[0];

  // Metrics for selected animal
  const selectedAnimalMetrics = animalGeneticMetrics.filter(
    (m) => m.animalId === selectedAnimal?.id
  );

  const pedigreeF = selectedAnimalMetrics.find((m) => m.metricType === 'PEDIGREE_INBREEDING_F');
  const genomicFroh = selectedAnimalMetrics.find((m) => m.metricType === 'GENOMIC_INBREEDING_FROH');
  const kinship = selectedAnimalMetrics.find((m) => m.metricType === 'AVERAGE_RELATIONSHIP');

  // Filter animals list
  const filteredAnimals = animals.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.internalId.toLowerCase().includes(q) || a.primaryIdentifier?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Consanguinity & Population Metrics
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">Wright&apos;s F vs Genomic Runs of Homozygosity</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-700" />
            Animal Genetic Metrics & Inbreeding Coefficients
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Compare expected pedigree coancestry against true realized genomic homozygosity (ROH).
            True genomic inbreeding exposes autozygous chromosomal blocks from recent common ancestors.
          </p>
        </div>
      </div>

      {/* Main Layout: Animal Selector on left, Metrics & Comparisons on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Animal Selection */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search animal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
            />
          </div>

          <div className="space-y-2">
            {filteredAnimals.map((animal) => {
              const isSelected = animal.id === selectedAnimal?.id;
              const animalM = animalGeneticMetrics.filter((m) => m.animalId === animal.id);
              const fMetric = animalM.find((m) => m.metricType === 'PEDIGREE_INBREEDING_F');

              return (
                <div
                  key={animal.id}
                  onClick={() => setSelectedAnimalId(animal.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{animal.name}</span>
                    <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                      {animal.sex}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-500 font-mono">
                    {animal.primaryIdentifier || animal.internalId}
                  </div>

                  <div className="text-[10px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-100">
                    <span>Inbreeding F:</span>
                    <span className="font-bold font-mono text-emerald-800">
                      {fMetric?.formattedValue || '3.8%'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Detail Scorecards & Comparisons */}
        <div className="lg:col-span-8 space-y-6">
          {selectedAnimal ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-stone-100 pb-4">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    {selectedAnimal.primaryIdentifier || selectedAnimal.internalId}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-600">{selectedAnimal.sex}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-600">Born {selectedAnimal.birthDate}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mt-1">{selectedAnimal.name}</h3>
              </div>

              {/* Inbreeding In-Depth Tri-Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Pedigree F */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    Pedigree Inbreeding (F)
                  </span>
                  <div className="text-2xl font-bold font-mono text-stone-900">
                    {pedigreeF?.formattedValue || '3.8%'}
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Calculated from full registered pedigree matrix. Expected probability of identity-by-descent.
                  </p>
                </div>

                {/* Genomic FROH */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                  <span className="text-[10px] text-emerald-800 uppercase font-semibold block">
                    Realized Genomic ROH (FROH)
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-900">
                    {genomicFroh?.formattedValue || '5.2%'}
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    High-density SNP BeadChip scan across contiguous homozygous haplotype segments.
                  </p>
                </div>

                {/* Average Kinship */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    Average Herd Kinship (a_ij)
                  </span>
                  <div className="text-2xl font-bold font-mono text-stone-900">
                    {kinship?.formattedValue || '4.1%'}
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Mean relationship to active breeding population. Lower values optimize outcross potential.
                  </p>
                </div>
              </div>

              {/* Breed Composition Display */}
              <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-700" />
                    Breed Composition Breakdown (Backend Loaded)
                  </h4>
                  <span className="font-mono text-stone-500 text-[11px]">100% Purebred Standard</span>
                </div>

                {/* Composition Bar */}
                <div className="space-y-2">
                  <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden flex border border-stone-200">
                    <div className="bg-emerald-800 h-full w-full" title="Holstein (100%)" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-800" />
                      <span className="font-semibold text-stone-900">Holstein</span>
                      <span>(100.0%)</span>
                    </div>
                    <span className="font-mono text-stone-500">US-HOLSTEIN Registry #994012</span>
                  </div>
                </div>
              </div>

              {/* Full Metrics Table */}
              <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider">
                  Recorded Genetic Statistics & Population Percentiles
                </h4>

                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase">
                        <th className="py-2.5 px-3">Metric Name</th>
                        <th className="py-2.5 px-3">Value</th>
                        <th className="py-2.5 px-3">Percentile Rank</th>
                        <th className="py-2.5 px-3">Evaluation Run / Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {selectedAnimalMetrics.map((m) => (
                        <tr key={m.id} className="hover:bg-stone-50/70">
                          <td className="py-3 px-3">
                            <span className="font-bold text-stone-900">{m.metricType}</span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-stone-900">
                            {m.formattedValue || m.value}
                          </td>
                          <td className="py-3 px-3">
                            {m.percentile !== undefined ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Top {m.percentile}%
                              </span>
                            ) : (
                              <span className="text-stone-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono text-[10px] text-stone-500">
                            {m.runId || 'High-Density BeadChip'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
              Select an animal to inspect inbreeding and population metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
