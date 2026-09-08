'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { ProgramHeaderNav } from '../program-nav';
import {
  Users,
  Plus,
  Dna,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { BreedingPopulationStatus } from '@/lib/bovine-types';

export default function ProgramPopulationsPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;

  const { breedingPrograms, breedingPopulations, addBreedingPopulation, updateBreedingPopulation } = useBreeding();
  const program = breedingPrograms.find((p) => p.id === programId);

  const [modalOpen, setModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newComp, setNewComp] = useState('100% Registered Purebred');
  const [newCandidates, setNewCandidates] = useState(120);

  if (!program) return <div className="p-8 text-center text-stone-500">Program Not Found</div>;

  const populations = breedingPopulations.filter((bp) => bp.breedingProgramId === program.id);

  const handleCreatePopulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    addBreedingPopulation({
      breedingProgramId: program.id,
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      description: newDesc.trim(),
      status: 'ACTIVE',
      candidateCount: Number(newCandidates) || 0,
      breedCompositionSummary: newComp.trim(),
      averageInbreedingF: 0.038,
      genotypeCoveragePct: 92.5,
      latestEvaluationRunCode: program.latestEvaluationRunCode || 'RUN-2026-02-GBLUP',
    });

    setModalOpen(false);
    setNewCode('');
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <ProgramHeaderNav program={program} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Breeding Populations &amp; Cohort Tiers</h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Divide the program into structured selection tiers (e.g. Nucleus herds, multipliers, and commercial progeny test groups).
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sub-Population</span>
        </button>
      </div>

      {/* Population Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {populations.map((pop) => (
          <div key={pop.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {pop.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      pop.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {pop.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mt-1">{pop.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{pop.description}</p>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-stone-900">{pop.candidateCount}</div>
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Candidates</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-center">
              <div className="bg-stone-50 p-2 rounded-lg">
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Inbreeding F</div>
                <div className="text-xs font-bold text-stone-800 mt-0.5">
                  {(pop.averageInbreedingF * 100).toFixed(2)}%
                </div>
              </div>

              <div className="bg-stone-50 p-2 rounded-lg">
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Genotype Cov</div>
                <div className="text-xs font-bold text-emerald-800 mt-0.5">
                  {pop.genotypeCoveragePct}%
                </div>
              </div>

              <div className="bg-stone-50 p-2 rounded-lg">
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Eval Run</div>
                <div className="text-xs font-mono font-bold text-stone-800 mt-0.5 truncate">
                  {pop.latestEvaluationRunCode || 'LIVE'}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 pt-1 flex items-center justify-between">
              <span>Composition: {pop.breedCompositionSummary}</span>
              <Link
                href={`/bovine/breeding-programs/${program.id}/candidates?popId=${pop.id}`}
                className="text-emerald-800 font-semibold hover:underline"
              >
                View Candidates &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Population Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">Add Breeding Sub-Population</h3>
            <form onSubmit={handleCreatePopulation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Population Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. POP-NUCLEUS-TIER1"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full text-xs font-mono border border-stone-300 rounded-lg p-2.5 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Population Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elite Donor Cow Cohort"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Breed Composition Summary</label>
                <input
                  type="text"
                  value={newComp}
                  onChange={(e) => setNewComp(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Initial Candidates Count</label>
                <input
                  type="number"
                  min="0"
                  value={newCandidates}
                  onChange={(e) => setNewCandidates(Number(e.target.value))}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg"
                >
                  Create Sub-Population
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
