'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { ProgramHeaderNav } from '../program-nav';
import { Sliders, ArrowRight, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

export default function ProgramIndexesPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;

  const { breedingPrograms, selectionIndexes } = useBreeding();
  const program = breedingPrograms.find((p) => p.id === programId);

  if (!program) return <div className="p-8 text-center text-stone-500">Program Not Found</div>;

  const activeIndex =
    selectionIndexes.find((idx) => idx.id === program.selectionIndexId || idx.code === program.selectionIndexCode) ||
    selectionIndexes[0];

  const activeVer = activeIndex?.versions?.[0];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <ProgramHeaderNav program={program} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Program Selection Index &amp; Trait Weights</h2>
          <p className="text-xs text-stone-600 mt-0.5">
            The mathematical selection index used to score, rank, and prioritize breeding candidates for {program.name}.
          </p>
        </div>

        <Link
          href={`/bovine/selection-indexes/${activeIndex?.id}`}
          className="inline-flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <span>Open Full Index Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {activeIndex && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {activeIndex.code}
                </span>
                <h3 className="text-lg font-bold text-stone-900">{activeIndex.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {activeIndex.activeVersion}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">{activeIndex.purpose}</p>
            </div>
          </div>

          {/* Component weights list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Trait Components &amp; Relative Selection Emphasis
            </h4>

            {activeVer?.components.map((comp) => {
              const pct = Math.round((comp.standardizedWeight || 0.2) * 100);
              return (
                <div key={comp.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900">{comp.traitName}</span>
                      <span className="text-[10px] uppercase font-semibold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {comp.category}
                      </span>
                    </div>
                    <div className="font-mono font-bold text-stone-900">
                      {comp.direction === 'INCREASE' ? '+' : comp.direction === 'DECREASE' ? '-' : 'opt'}
                      {comp.weight} (${comp.economicValue}/unit)
                    </div>
                  </div>

                  {/* Weight Progress Bar */}
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        comp.category === 'PRODUCTION'
                          ? 'bg-emerald-700'
                          : comp.category === 'HEALTH'
                          ? 'bg-blue-600'
                          : comp.category === 'FERTILITY'
                          ? 'bg-rose-600'
                          : 'bg-amber-600'
                      }`}
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>Selection Direction: {comp.direction}</span>
                    <span>Relative Weight: <strong>{pct}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
