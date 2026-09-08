'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  GitCompare,
  Plus,
  X,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Activity,
} from 'lucide-react';

export default function BovineComparePage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids');

  const { animals, breedCompositions, farms, herds, dailyLogs, observations } = useBovine();

  // Selected animal IDs for side-by-side comparison (2 to 6 animals)
  const initialIds = idsParam
    ? idsParam.split(',').filter(Boolean)
    : [animals[0]?.id, animals[1]?.id].filter(Boolean);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  const comparedAnimals = animals.filter((a) => selectedIds.includes(a.id));

  const removeAnimal = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const addAnimalToCompare = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 6) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const calculateAge = (birthDateStr: string) => {
    const birth = new Date(birthDateStr);
    const now = new Date('2026-09-04');
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (diffMonths < 12) return `${diffMonths} mo`;
    const years = Math.floor(diffMonths / 12);
    const remainingMo = diffMonths % 12;
    return remainingMo > 0 ? `${years}y ${remainingMo}m` : `${years} yrs`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Comparative Phenotypic & Genetic Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Side-by-Side Livestock Evaluation
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Compare biometric traits, pedigree ancestry, rumination telemetry, and data completeness
          </p>
        </div>

        {/* Add Animal Selector */}
        {selectedIds.length < 6 && (
          <div className="flex items-center space-x-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addAnimalToCompare(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 shadow-2xs"
            >
              <option value="" disabled>
                + Add animal to compare...
              </option>
              {animals
                .filter((a) => !selectedIds.includes(a.id))
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.primaryIdentifier || a.internalId})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {comparedAnimals.length === 0 ? (
        <div className="p-12 text-center text-stone-500 text-xs bg-white rounded-3xl border border-stone-200">
          <GitCompare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          No animals selected for comparison. Select at least 2 animals to inspect comparative metrics.
        </div>
      ) : (
        /* Multi-column Side-by-Side Comparison Matrix */
        <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-4 w-44 font-semibold text-stone-400 uppercase tracking-wider">
                    Trait / Metric
                  </th>
                  {comparedAnimals.map((animal) => (
                    <th key={animal.id} className="p-4 min-w-[220px] align-top">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/bovine/animals/${animal.id}`}
                            className="font-bold text-sm text-stone-900 hover:text-emerald-800 hover:underline block"
                          >
                            {animal.name}
                          </Link>
                          <div className="text-[11px] font-mono text-emerald-800 font-semibold mt-0.5">
                            {animal.primaryIdentifier || animal.internalId}
                          </div>
                        </div>
                        <button
                          onClick={() => removeAnimal(animal.id)}
                          className="p-1 text-stone-400 hover:text-stone-700"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {/* Sex & Age */}
                <tr>
                  <td className="p-4 bg-stone-50/50 font-semibold text-stone-600">Sex & Calculated Age</td>
                  {comparedAnimals.map((a) => (
                    <td key={a.id} className="p-4 font-medium">
                      {a.sex} • {calculateAge(a.birthDate)} ({a.birthDate})
                    </td>
                  ))}
                </tr>

                {/* Role / Use Status */}
                <tr>
                  <td className="p-4 bg-stone-50/50 font-semibold text-stone-600">Reproductive Role</td>
                  {comparedAnimals.map((a) => (
                    <td key={a.id} className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                        {a.useStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Genetic Breeds */}
                <tr>
                  <td className="p-4 bg-stone-50/50 font-semibold text-stone-600">Breed Composition</td>
                  {comparedAnimals.map((a) => {
                    const bcs = breedCompositions.filter((bc) => bc.animalId === a.id);
                    return (
                      <td key={a.id} className="p-4">
                        {bcs.map((b) => `${b.percentage}% ${b.breedName}`).join(', ') || 'Unspecified'}
                      </td>
                    );
                  })}
                </tr>

                {/* Physical Placement */}
                <tr>
                  <td className="p-4 bg-stone-50/50 font-semibold text-stone-600">Current Station</td>
                  {comparedAnimals.map((a) => {
                    const farm = farms.find((f) => f.id === a.farmId);
                    const herd = herds.find((h) => h.id === a.herdId);
                    return (
                      <td key={a.id} className="p-4">
                        <div className="font-semibold text-stone-900">{farm?.name}</div>
                        <div className="text-[11px] text-stone-500">{herd?.name}</div>
                      </td>
                    );
                  })}
                </tr>

                {/* Parentage */}
                <tr>
                  <td className="p-4 bg-stone-50/50 font-semibold text-stone-600">Sire & Dam</td>
                  {comparedAnimals.map((a) => (
                    <td key={a.id} className="p-4">
                      <div>
                        <span className="text-stone-400">Sire:</span> {a.sireName || 'Unrecorded'}
                      </div>
                      <div>
                        <span className="text-stone-400">Dam:</span> {a.damName || 'Unrecorded'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Latest Daily Vitals */}
                <tr>
                  <td className="p-4 bg-stone-50/50 font-semibold text-stone-600">Latest Vital Check</td>
                  {comparedAnimals.map((a) => {
                    const logs = dailyLogs.filter((l) => l.animalId === a.id);
                    const latest = logs[logs.length - 1];
                    return (
                      <td key={a.id} className="p-4">
                        {latest ? (
                          <div>
                            <div className="font-semibold text-stone-900">
                              {latest.temperature || 38.5}°C • {latest.operationalStatus}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              Rumination: {latest.ruminationMinutes || 'N/A'} min
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">No daily logs yet</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Review Flags */}
                <tr>
                  <td className="p-4 bg-stone-50/50 font-semibold text-stone-600">Veterinary Flag</td>
                  {comparedAnimals.map((a) => (
                    <td key={a.id} className="p-4">
                      {a.requiresReview ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold border border-amber-200">
                          {a.reviewReason || 'Flagged for review'}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Clear
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4 bg-stone-50/50 font-semibold text-stone-600">Action</td>
                  {comparedAnimals.map((a) => (
                    <td key={a.id} className="p-4">
                      <Link
                        href={`/bovine/animals/${a.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open 360</span>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
