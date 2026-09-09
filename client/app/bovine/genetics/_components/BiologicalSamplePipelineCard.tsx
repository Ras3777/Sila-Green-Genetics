'use client';

import React from 'react';
import Link from 'next/link';
import { TestTube2, ArrowRight, ExternalLink } from 'lucide-react';
import { GeneticSample, Laboratory } from '@/lib/bovine-types';

interface BiologicalSamplePipelineCardProps {
  geneticSamples: GeneticSample[];
  laboratories: Laboratory[];
}

export function BiologicalSamplePipelineCard({
  geneticSamples,
  laboratories,
}: BiologicalSamplePipelineCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <TestTube2 className="w-4 h-4 text-emerald-700" />
            Biological Samples & Genotyping Pipeline
          </h3>
          <p className="text-xs text-stone-500">
            Tracking samples through tissue collection, courier logistics, DNA extraction, and BeadChip array analysis.
          </p>
        </div>
        <Link
          href="/bovine/genetics/samples"
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
        >
          <span>View Repository</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* Pipeline Stage Visualizer */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center py-2">
        {[
          { label: 'Collected', count: geneticSamples.filter((s) => s.status === 'COLLECTED').length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'In Transit', count: geneticSamples.filter((s) => s.status === 'SHIPPED').length, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'At Laboratory', count: geneticSamples.filter((s) => s.status === 'RECEIVED' || s.status === 'PROCESSING').length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
          { label: 'Assay Complete', count: geneticSamples.filter((s) => s.status === 'COMPLETED').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Rejected / Redo', count: geneticSamples.filter((s) => s.status === 'REJECTED').length, color: 'bg-rose-50 text-rose-700 border-rose-200' },
        ].map((stage, i) => (
          <div key={i} className={`p-3 rounded-xl border ${stage.color} space-y-1`}>
            <div className="text-[11px] font-semibold">{stage.label}</div>
            <div className="text-lg font-bold">{stage.count}</div>
          </div>
        ))}
      </div>

      {/* Samples List Preview */}
      <div className="divide-y divide-stone-100">
        {geneticSamples.slice(0, 4).map((sample) => {
          const lab = laboratories.find((l) => l.id === sample.destinationLabId);
          return (
            <div key={sample.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-mono text-[11px] text-stone-700 shrink-0">
                  {sample.sampleType === 'TISSUE_TSU' && 'TSU'}
                  {sample.sampleType === 'SEMEN' && 'SMN'}
                  {sample.sampleType === 'BLOOD_EDTA' && 'BLD'}
                  {sample.sampleType === 'HAIR_FOLLICLE' && 'HAR'}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-stone-900 truncate flex items-center gap-1.5">
                    <span>{sample.animalName}</span>
                    <span className="font-mono text-stone-500 text-[11px]">({sample.animalIdentifier})</span>
                  </div>
                  <div className="text-stone-500 text-[11px] truncate flex items-center gap-2">
                    <span className="font-mono">{sample.sampleCode}</span>
                    <span>•</span>
                    <span>{sample.destinationLabName || lab?.name}</span>
                    <span>•</span>
                    <span>Collected {sample.collectedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                    sample.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sample.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : sample.status === 'PROCESSING'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {sample.status}
                </span>
                <Link
                  href={`/bovine/genetics/samples?highlight=${sample.id}`}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                  title="View Chain of Custody"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
