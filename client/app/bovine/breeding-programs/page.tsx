'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  Award,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Users,
  Activity,
  Dna,
  Calendar,
  CheckCircle2,
  Sliders,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { BreedingProgramStatus, BreedingObjectiveType } from '@/lib/bovine-types';

export default function BreedingProgramsPortfolioPage() {
  const { breedingPrograms, breedingPopulations, selectionIndexes } = useBreeding();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BreedingProgramStatus>('ALL');
  const [objectiveFilter, setObjectiveFilter] = useState<'ALL' | BreedingObjectiveType>('ALL');

  const filtered = breedingPrograms.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (objectiveFilter !== 'ALL' && p.objectiveType !== objectiveFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.organizationName.toLowerCase().includes(q) ||
        p.breedScope.some((b) => b.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalCandidates = breedingPrograms.reduce((acc, p) => acc + p.candidateCount, 0);
  const totalEvaluated = breedingPrograms.reduce((acc, p) => acc + p.evaluatedCount, 0);
  const totalGenomic = breedingPrograms.reduce((acc, p) => acc + p.genomicCount, 0);
  const avgCompleteness = +(
    breedingPrograms.reduce((acc, p) => acc + p.phenotypeCompletenessPct, 0) /
    (breedingPrograms.length || 1)
  ).toFixed(1);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <Award className="w-4 h-4" />
            <span>Decision &amp; Governance Layer • Phase 4</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Breeding Programs Portfolio</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Manage population-level selection objectives, breeding candidate pools, and genetic progress goals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/bovine/breeding-programs/new"
            className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Breeding Program</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Active Programs</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{breedingPrograms.length}</div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% In Active Scope</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Enrolled Candidates</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{totalCandidates.toLocaleString()}</div>
          <div className="text-[11px] text-stone-500 mt-1">
            {totalEvaluated.toLocaleString()} Evaluated ({((totalEvaluated / (totalCandidates || 1)) * 100).toFixed(0)}%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Genomic Genotyped</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{totalGenomic.toLocaleString()}</div>
          <div className="text-[11px] text-stone-500 mt-1">
            {((totalGenomic / (totalCandidates || 1)) * 100).toFixed(1)}% Population Coverage
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Avg Phenotype Completeness</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{avgCompleteness}%</div>
          <div className="text-[11px] text-stone-500 mt-1">Contemporary Group Minimums Met</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search programs, breeds, orgs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-stone-600">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-medium">Objective:</span>
            <select
              value={objectiveFilter}
              onChange={(e) => setObjectiveFilter(e.target.value as any)}
              className="bg-stone-50 border border-stone-300 text-stone-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Objectives</option>
              <option value="ECONOMIC">Economic Profit</option>
              <option value="TERMINAL">Terminal Carcass</option>
              <option value="MATERNAL">Maternal Stayability</option>
              <option value="BALANCED">Balanced Dual-Purpose</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-stone-600">
            <span className="font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-stone-50 border border-stone-300 text-stone-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="space-y-4">
        {filtered.map((p) => {
          const populations = breedingPopulations.filter((bp) => bp.breedingProgramId === p.id);
          const activeIndex = selectionIndexes.find((idx) => idx.id === p.selectionIndexId || idx.code === p.selectionIndexCode);

          return (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-stone-200 hover:border-emerald-700/50 shadow-xs transition-all overflow-hidden"
            >
              <div className="p-5 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {p.code}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md tracking-wider ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {p.status}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                        Objective: {p.objectiveType}
                      </span>
                      <span className="text-xs text-stone-500">• {p.organizationName}</span>
                    </div>

                    <h2 className="text-lg font-bold text-stone-900">{p.name}</h2>
                    <p className="text-xs text-stone-600 leading-relaxed max-w-4xl">{p.description}</p>

                    {/* Breed scope tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-stone-500 font-medium mr-1">Breeds enrolled:</span>
                      {p.breedScope.map((b) => (
                        <span
                          key={b}
                          className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right side CTA & quick links */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0">
                    <Link
                      href={`/bovine/breeding-programs/${p.id}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <span>Program Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[10px] text-stone-400">
                      Updated: {p.updatedAt}
                    </span>
                  </div>
                </div>

                {/* Metrics Breakdown Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-stone-100">
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                      Candidates
                    </div>
                    <div className="text-base font-bold text-stone-900 mt-0.5">
                      {p.candidateCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {populations.length} Sub-populations
                    </div>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                      EBV Evaluated
                    </div>
                    <div className="text-base font-bold text-stone-900 mt-0.5">
                      {p.evaluatedCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                      {p.latestEvaluationRunCode || 'GBLUP Live'}
                    </div>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                      Genotyped
                    </div>
                    <div className="text-base font-bold text-stone-900 mt-0.5">
                      {p.genomicCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {((p.genomicCount / (p.candidateCount || 1)) * 100).toFixed(0)}% Genotyped
                    </div>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                      Selection Index
                    </div>
                    <div className="text-base font-bold text-stone-900 mt-0.5 truncate">
                      {p.selectionIndexCode || 'N/A'}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {activeIndex ? `${activeIndex.activeVersion}` : 'Default Weights'}
                    </div>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                      Phenotype Completeness
                    </div>
                    <div className="text-base font-bold text-emerald-800 mt-0.5">
                      {p.phenotypeCompletenessPct}%
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {p.activePlansCount} Active Mating Plans
                    </div>
                  </div>
                </div>

                {/* Subpage Deep-Link Tabs */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-stone-100 text-xs text-stone-600">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mr-1">
                    Modules:
                  </span>
                  <Link
                    href={`/bovine/breeding-programs/${p.id}/populations`}
                    className="hover:text-emerald-800 hover:underline font-medium px-2 py-1 rounded-md hover:bg-emerald-50"
                  >
                    Populations ({populations.length})
                  </Link>
                  <span className="text-stone-300">•</span>
                  <Link
                    href={`/bovine/breeding-programs/${p.id}/breeds`}
                    className="hover:text-emerald-800 hover:underline font-medium px-2 py-1 rounded-md hover:bg-emerald-50"
                  >
                    Breeds &amp; Roles
                  </Link>
                  <span className="text-stone-300">•</span>
                  <Link
                    href={`/bovine/breeding-programs/${p.id}/objectives`}
                    className="hover:text-emerald-800 hover:underline font-medium px-2 py-1 rounded-md hover:bg-emerald-50"
                  >
                    Objectives &amp; Constraints
                  </Link>
                  <span className="text-stone-300">•</span>
                  <Link
                    href={`/bovine/breeding-programs/${p.id}/candidates`}
                    className="hover:text-emerald-800 hover:underline font-medium px-2 py-1 rounded-md hover:bg-emerald-50"
                  >
                    Candidates Pool
                  </Link>
                  <span className="text-stone-300">•</span>
                  <Link
                    href={`/bovine/breeding-programs/${p.id}/indexes`}
                    className="hover:text-emerald-800 hover:underline font-medium px-2 py-1 rounded-md hover:bg-emerald-50"
                  >
                    Index Weights
                  </Link>
                  <span className="text-stone-300">•</span>
                  <Link
                    href={`/bovine/breeding-programs/${p.id}/progress`}
                    className="hover:text-emerald-800 hover:underline font-medium px-2 py-1 rounded-md hover:bg-emerald-50 text-emerald-800 font-semibold"
                  >
                    Genetic Progress Trends &rarr;
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-stone-200 text-stone-500">
            <Award className="w-8 h-8 mx-auto text-stone-400 mb-2" />
            <p className="font-semibold text-stone-800">No breeding programs matched your criteria.</p>
            <p className="text-xs text-stone-500 mt-1">Try clearing your search query or status filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
