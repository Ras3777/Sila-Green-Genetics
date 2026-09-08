'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dna,
  GitBranch,
  Activity,
  Users,
  Trophy,
  TestTube2,
  Building,
  Microscope,
  Binary,
  Calculator,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';
import { useGenetics } from '@/lib/bovine-genetics-store';

export default function GeneticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { geneticEvaluationRuns, geneticSamples } = useGenetics();

  const activeRun = geneticEvaluationRuns.find((r) => r.status === 'PUBLISHED') || geneticEvaluationRuns[0];
  const pendingSamplesCount = geneticSamples.filter(
    (s) => s.status === 'COLLECTED' || s.status === 'SHIPPED' || s.status === 'PROCESSING'
  ).length;

  const tabs = [
    { href: '/bovine/genetics', label: 'Genetics Hub', icon: Dna, exact: true },
    { href: '/bovine/genetics/pedigree', label: 'Pedigree Explorer', icon: GitBranch },
    { href: '/bovine/genetics/phenotypes', label: 'Phenotypes & S.O.P.', icon: Activity },
    { href: '/bovine/genetics/contemporary-groups', label: 'Contemporary Groups', icon: Users },
    { href: '/bovine/genetics/performance-tests', label: 'Performance Tests', icon: Trophy },
    { href: '/bovine/genetics/samples', label: 'Biological Samples', icon: TestTube2, badge: pendingSamplesCount > 0 ? pendingSamplesCount : undefined },
    { href: '/bovine/genetics/laboratories', label: 'Laboratories', icon: Building },
    { href: '/bovine/genetics/assays', label: 'Genotyping & QC', icon: Microscope },
    { href: '/bovine/genetics/markers-conditions', label: 'Markers & Conditions', icon: Binary },
    { href: '/bovine/genetics/evaluations', label: 'Evaluations & EBVs', icon: Calculator },
    { href: '/bovine/genetics/metrics', label: 'Inbreeding & Metrics', icon: Flame },
    { href: '/bovine/genetics/breeds', label: 'Breeds Catalog', icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                  Phase 3 • Bovine Genomics
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 font-mono">
                  ARS-UCD1.2 Assembly
                </span>
              </div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <Dna className="w-6 h-6 text-emerald-700" />
                Pedigree Analytics, Phenotypes & Genetic Evaluation
              </h1>
              <p className="text-xs text-stone-600 max-w-3xl">
                Enterprise genetic information system enforcing strict <strong>provenance before interpretation</strong>:
                every metric tracks measurement protocol, contemporary group standardization, genotyping QC integrity, and evaluation run base.
              </p>
            </div>

            {/* Active Run pill */}
            {activeRun && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 flex items-center space-x-3 text-xs shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <div className="text-[10px] uppercase font-semibold text-stone-600 tracking-wider">
                    Active Evaluation Run
                  </div>
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <span>{activeRun.runCode}</span>
                    <span className="text-[11px] font-normal text-stone-500">
                      ({activeRun.geneticBase})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="mt-6 flex items-center space-x-1 overflow-x-auto pb-1 border-t border-stone-100 pt-3 scrollbar-thin">
            {tabs.map((tab) => {
              const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">{children}</div>
    </div>
  );
}
