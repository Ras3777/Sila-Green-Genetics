'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { ProgramHeaderNav } from './program-nav';
import {
  Users,
  Dna,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Calendar,
} from 'lucide-react';

export default function BreedingProgramOverviewPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;

  const {
    breedingPrograms,
    breedingPopulations,
    breedingProgramBreeds,
    selectionIndexes,
    matingPlans,
  } = useBreeding();

  const program = breedingPrograms.find((p) => p.id === programId);
  if (!program) {
    return (
      <div className="p-8 text-center text-stone-500">
        <h2 className="text-lg font-bold text-stone-900">Program Not Found</h2>
        <Link href="/bovine/breeding-programs" className="text-emerald-800 text-xs font-semibold mt-2 inline-block">
          Return to Programs
        </Link>
      </div>
    );
  }

  const populations = breedingPopulations.filter((bp) => bp.breedingProgramId === program.id);
  const breeds = breedingProgramBreeds.filter((b) => b.breedingProgramId === program.id);
  const activeIndex = selectionIndexes.find((idx) => idx.id === program.selectionIndexId || idx.code === program.selectionIndexCode);
  const programPlans = matingPlans.filter((mp) => mp.breedingProgramId === program.id);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <ProgramHeaderNav program={program} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Candidate Pool</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{program.candidateCount.toLocaleString()}</div>
          <div className="text-[11px] text-stone-500 mt-1">Across {populations.length} sub-populations</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Genomic Genotyped</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            {((program.genomicCount / (program.candidateCount || 1)) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-stone-500 mt-1">{program.genomicCount} high-density animals</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Phenotype Completeness</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{program.phenotypeCompletenessPct}%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Contemporary groups qualified</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Active Selection Index</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 truncate">
            {program.selectionIndexCode || 'NMI-2026'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">{activeIndex?.activeVersion || 'v3.2'} Published</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Scope & Populations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub-populations */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-bold text-stone-900">Enrolled Breeding Populations</h3>
              </div>
              <Link
                href={`/bovine/breeding-programs/${program.id}/populations`}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-700"
              >
                Manage Populations &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {populations.map((pop) => (
                <div
                  key={pop.id}
                  className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {pop.code}
                      </span>
                      <span className="font-semibold text-stone-900">{pop.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {pop.status}
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px]">{pop.description}</p>
                    <div className="text-stone-600 text-[11px] font-medium">
                      Composition: {pop.breedCompositionSummary}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1 shrink-0 text-right">
                    <div className="font-bold text-stone-900 text-sm">
                      {pop.candidateCount} <span className="text-xs font-normal text-stone-500">Head</span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Avg Inbreeding: <span className="font-semibold text-stone-800">{(pop.averageInbreedingF * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Mating Plans */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-bold text-stone-900">Mating Allocation Plans</h3>
              </div>
              <Link
                href={`/bovine/mating/plans/new?programId=${program.id}`}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-700"
              >
                + New Mating Plan
              </Link>
            </div>

            {programPlans.length > 0 ? (
              <div className="space-y-3">
                {programPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-stone-800">{plan.code}</span>
                        <span className="font-semibold text-stone-900">{plan.name}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            plan.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {plan.status}
                        </span>
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        Season: {plan.season} • Max Inbreeding: {plan.maxInbreedingThreshold}% • Carrier Exclusion:{' '}
                        {plan.carrierExclusion ? 'Active' : 'Off'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right text-[11px] text-stone-600">
                        <div>
                          <strong className="text-stone-900">{plan.femaleCount}</strong> Females x{' '}
                          <strong className="text-stone-900">{plan.sireCount}</strong> Sires
                        </div>
                        <div className="text-emerald-700 font-semibold">{plan.acceptedCount} Accepted</div>
                      </div>
                      <Link
                        href={`/bovine/mating/plans/${plan.id}`}
                        className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-xl">
                No active mating allocation plans created for this program yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Breeds & Index Weights Summary */}
        <div className="space-y-6">
          {/* Breeds Contribution */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Breed Composition Roles</h3>
              <Link
                href={`/bovine/breeding-programs/${program.id}/breeds`}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                Details
              </Link>
            </div>

            <div className="space-y-2.5">
              {breeds.map((b) => (
                <div key={b.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <div className="flex items-center justify-between font-semibold text-stone-900">
                    <span>{b.breedName}</span>
                    <span className="font-mono text-emerald-800">{b.targetPercentage || 100}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                    <span>Role: {b.role}</span>
                    <span>Priority #{b.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Selection Index */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Objective Index Weights</h3>
              <Link
                href={`/bovine/breeding-programs/${program.id}/indexes`}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                View Version
              </Link>
            </div>

            {activeIndex && activeIndex.versions && activeIndex.versions[0] ? (
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-stone-800">{activeIndex.name} ({activeIndex.activeVersion})</div>
                <div className="space-y-1.5 pt-1">
                  {activeIndex.versions[0].components.slice(0, 4).map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-600">{c.traitName}</span>
                      <span className="font-mono font-semibold text-stone-900">
                        {c.direction === 'INCREASE' ? '+' : c.direction === 'DECREASE' ? '-' : 'opt'}
                        {c.weight} ({((c.standardizedWeight || 0.2) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-stone-500">Standard balanced economic index configured.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
