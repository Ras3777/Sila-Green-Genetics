'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { ProgramHeaderNav } from '../program-nav';
import { Activity, CheckCircle2, ArrowRight, Dna, FileText } from 'lucide-react';

export default function ProgramEvaluationsPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;

  const { breedingPrograms } = useBreeding();
  const { geneticEvaluationRuns } = useGenetics();
  const evaluationRuns = geneticEvaluationRuns || [];

  const program = breedingPrograms.find((p) => p.id === programId);
  if (!program) return <div className="p-8 text-center text-stone-500">Program Not Found</div>;

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <ProgramHeaderNav program={program} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Evaluation Runs &amp; Provenance</h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Statistical evaluation runs that estimated genomic breeding values (GEBV) for candidates in this program.
          </p>
        </div>

        <Link
          href="/bovine/genetics/evaluations/new"
          className="inline-flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <span>Run New Evaluation</span>
        </Link>
      </div>

      <div className="space-y-4">
        {evaluationRuns.map((run) => (
          <div
            key={run.id}
            className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {run.runCode}
                  </span>
                  <span className="font-semibold text-stone-900 text-sm">{run.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {run.status}
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Methodology: <strong className="text-stone-800">{run.modelMethod}</strong> • Software Engine:{' '}
                  <strong className="text-stone-800">{run.softwareEngine}</strong> • Base Year:{' '}
                  <strong className="text-stone-800">{run.baseYear}</strong>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-stone-900">
                  {(run.animalsEvaluatedCount ?? run.animalCount ?? 0).toLocaleString()} Candidates
                </div>
                <div className="text-[11px] text-stone-500">
                  Published: {run.completedAt || run.createdAt || run.runDate}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span className="text-[11px] text-stone-500">
                Genotyped Candidates: {(run.genotypedCount ?? 0).toLocaleString()} ({run.snpChipDensity || 'Standard HD'})
              </span>
              <Link
                href={`/bovine/genetics/evaluations/${run.id}`}
                className="inline-flex items-center space-x-1 text-emerald-800 hover:text-emerald-700 font-semibold"
              >
                <span>View Methodology &amp; Outputs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
