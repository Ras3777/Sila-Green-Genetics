'use client';

import React from 'react';
import { TestTube2, Microscope, CheckCircle2, Activity, Users, Calculator } from 'lucide-react';
import { GeneticEvaluationRun } from '@/lib/bovine-types';

interface GeneticsStatsGridProps {
  activeSamplesCount: number;
  totalSamplesCount: number;
  laboratoriesCount: number;
  genotypingAssaysCount: number;
  highQcAssaysCount: number;
  totalPhenotypes: number;
  validatedPhenotypes: number;
  suspectPhenotypesCount: number;
  contemporaryGroupsCount: number;
  activeContemporaryGroupsCount: number;
  latestRun: GeneticEvaluationRun;
}

export function GeneticsStatsGrid({
  activeSamplesCount,
  totalSamplesCount,
  laboratoriesCount,
  genotypingAssaysCount,
  highQcAssaysCount,
  totalPhenotypes,
  validatedPhenotypes,
  suspectPhenotypesCount,
  contemporaryGroupsCount,
  activeContemporaryGroupsCount,
  latestRun,
}: GeneticsStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between text-stone-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Samples in Pipe</span>
          <TestTube2 className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="text-2xl font-bold text-stone-900">{activeSamplesCount}</div>
        <div className="text-[11px] text-stone-500">
          {totalSamplesCount} total collected across {laboratoriesCount} labs
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between text-stone-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Genotyped Assays</span>
          <Microscope className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="text-2xl font-bold text-stone-900">{genotypingAssaysCount}</div>
        <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>{highQcAssaysCount} Passed Gold QC (98.5%+)</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between text-stone-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Phenotypes</span>
          <Activity className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="text-2xl font-bold text-stone-900">{totalPhenotypes}</div>
        <div className="text-[11px] text-stone-500">
          {validatedPhenotypes} validated • {suspectPhenotypesCount} flagged
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between text-stone-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Contemporary Groups</span>
          <Users className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="text-2xl font-bold text-stone-900">{contemporaryGroupsCount}</div>
        <div className="text-[11px] text-stone-500">
          {activeContemporaryGroupsCount} active management cohorts
        </div>
      </div>

      <div className="col-span-2 md:col-span-4 lg:col-span-1 bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between text-stone-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Active Evaluation</span>
          <Calculator className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="text-sm font-bold text-stone-900 truncate">
          {latestRun?.runCode}
        </div>
        <div className="text-[11px] text-stone-500">
          Base: {latestRun?.geneticBase}
        </div>
      </div>
    </div>
  );
}
