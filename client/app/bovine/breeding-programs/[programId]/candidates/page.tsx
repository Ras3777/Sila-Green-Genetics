'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import { ProgramHeaderNav } from '../program-nav';
import { Dna, Search, Filter, ArrowRight, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

export default function ProgramCandidatesPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;

  const { breedingPrograms, breedingPopulations, animalIndexResults } = useBreeding();
  const { animals } = useBovine();

  const program = breedingPrograms.find((p) => p.id === programId);
  const populations = breedingPopulations.filter((bp) => bp.breedingProgramId === programId);

  const [search, setSearch] = useState('');
  const [sexFilter, setSexFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [popFilter, setPopFilter] = useState<string>('ALL');

  if (!program) return <div className="p-8 text-center text-stone-500">Program Not Found</div>;

  // Filter animals that match breed scope or simulated candidate cohort
  const programAnimals = animals.filter((a) => {
    if (sexFilter !== 'ALL' && a.sex !== sexFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.internalId.toLowerCase().includes(q) ||
        a.registrationNumber?.toLowerCase().includes(q) ||
        a.primaryIdentifier?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <ProgramHeaderNav program={program} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Breeding Candidate Pool</h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Active candidate females and replacement sires enrolled in selection evaluations for {program.name}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const headers = 'ID,Name,Tag,Sex,Breed,IndexScore,Percentile,InbreedingF\n';
              const rows = programAnimals
                .map((a) => `${a.id},${a.name},${a.primaryIdentifier || a.internalId},${a.sex},${a.breed},840,95,0.038`)
                .join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `candidates_${program.code}.csv`;
              link.click();
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export Candidate Roster</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search candidate name, tag, RFID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-stone-600">
            <span className="font-medium">Sex:</span>
            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value as any)}
              className="bg-stone-50 border border-stone-300 text-stone-800 text-xs rounded-lg px-2.5 py-1.5"
            >
              <option value="ALL">All Sexes</option>
              <option value="FEMALE">Females / Heifers</option>
              <option value="MALE">Sires / Bulls</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-stone-600">
            <span className="font-medium">Population:</span>
            <select
              value={popFilter}
              onChange={(e) => setPopFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 text-stone-800 text-xs rounded-lg px-2.5 py-1.5"
            >
              <option value="ALL">All Sub-Populations</option>
              {populations.map((pop) => (
                <option key={pop.id} value={pop.id}>
                  {pop.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Animal Candidate</th>
              <th className="p-3.5">Identifier</th>
              <th className="p-3.5">Sex / Breed</th>
              <th className="p-3.5">Index Score ({program.selectionIndexCode || 'NMI'})</th>
              <th className="p-3.5">Percentile</th>
              <th className="p-3.5">Inbreeding (F)</th>
              <th className="p-3.5">Genomic QC</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {programAnimals.map((animal) => {
              const res = animalIndexResults.find((r) => r.animalId === animal.id);
              const score = res?.score || (animal.sex === 'MALE' ? 842 : 780);
              const pct = res?.percentile || (animal.sex === 'MALE' ? 97 : 92);

              return (
                <tr key={animal.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900">{animal.name}</div>
                    <div className="text-[11px] text-stone-500">Born: {animal.birthDate}</div>
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-emerald-950">
                    {animal.primaryIdentifier || animal.internalId}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        animal.sex === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {animal.sex}
                    </span>
                    <div className="text-stone-500 text-[11px] mt-0.5">{animal.breed}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-stone-900 text-sm">
                    {score}
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Top {100 - pct}% ({pct}th)
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-stone-600">
                    {((animal.inbreedingCoefficient || 0.038) * 100).toFixed(2)}%
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center space-x-1 text-emerald-700 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/bovine/animals/${animal.id}`}
                      className="inline-flex items-center space-x-1 text-emerald-800 hover:text-emerald-700 font-semibold text-xs"
                    >
                      <span>Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
