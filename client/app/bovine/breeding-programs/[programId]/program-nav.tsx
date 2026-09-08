'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BreedingProgram } from '@/lib/bovine-types';
import {
  Award,
  ArrowLeft,
  Users,
  GitBranch,
  Target,
  Dna,
  Activity,
  Sliders,
  TrendingUp,
} from 'lucide-react';

export function ProgramHeaderNav({ program }: { program: BreedingProgram }) {
  const pathname = usePathname();
  const base = `/bovine/breeding-programs/${program.id}`;

  const tabs = [
    { label: 'Overview', href: base, icon: Award, exact: true },
    { label: 'Populations', href: `${base}/populations`, icon: Users },
    { label: 'Breeds', href: `${base}/breeds`, icon: GitBranch },
    { label: 'Objectives', href: `${base}/objectives`, icon: Target },
    { label: 'Candidates Pool', href: `${base}/candidates`, icon: Dna },
    { label: 'Evaluations', href: `${base}/evaluations`, icon: Activity },
    { label: 'Indexes', href: `${base}/indexes`, icon: Sliders },
    { label: 'Progress Trends', href: `${base}/progress`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      {/* Back button */}
      <div>
        <Link
          href="/bovine/breeding-programs"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Programs Portfolio</span>
        </Link>
      </div>

      {/* Program Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {program.code}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md tracking-wider ${
                  program.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {program.status}
              </span>
              <span className="text-[11px] font-medium text-stone-500">• {program.organizationName}</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">{program.name}</h1>
            <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">{program.description}</p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href={`/bovine/mating/plans/new?programId=${program.id}`}
              className="inline-flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs"
            >
              <span>Create Mating Plan</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 overflow-x-auto border-t border-stone-100 mt-6 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-800' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
