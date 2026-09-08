'use client';

import React from 'react';
import { AnimalMedia } from '@/lib/bovine-types';
import {
  X,
  Sparkles,
  Layers,
  ArrowRight,
  Plus,
  Scale,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface AnimalMediaStageComparisonProps {
  mediaList: AnimalMedia[];
  isOpen: boolean;
  onClose: () => void;
  onOpenViewer: (media: AnimalMedia) => void;
  onAddStagePhoto?: (stage: 'BIRTH' | 'MATERNAL' | 'WEANING' | 'YEARLING' | 'MATURE') => void;
}

interface StageDefinition {
  key: 'BIRTH' | 'MATERNAL' | 'WEANING' | 'YEARLING' | 'MATURE';
  title: string;
  ageSpan: string;
  expectedDays: number;
  benchmarkWeightKg: number;
  description: string;
}

const STAGES: StageDefinition[] = [
  {
    key: 'BIRTH',
    title: 'Birth & Neonatal',
    ageSpan: '0 - 14 Days',
    expectedDays: 0,
    benchmarkWeightKg: 42,
    description: 'Calving vigor, colostrum intake, and neonatal vigor score',
  },
  {
    key: 'MATERNAL',
    title: 'Maternal Phase I',
    ageSpan: '15 - 120 Days',
    expectedDays: 100,
    benchmarkWeightKg: 135,
    description: 'Dam milk yield correlation, creep feeding & rumen papillae',
  },
  {
    key: 'WEANING',
    title: 'Weaning Phase II',
    ageSpan: '120 - 205 Days',
    expectedDays: 205,
    benchmarkWeightKg: 245,
    description: 'Adjusted 205-day weaning weight, ADG, and frame ratio',
  },
  {
    key: 'YEARLING',
    title: 'Yearling Phase III',
    ageSpan: '205 - 365 Days',
    expectedDays: 365,
    benchmarkWeightKg: 460,
    description: 'Adjusted 365-day yearling weight, scrotal size or pelvic area',
  },
  {
    key: 'MATURE',
    title: 'Mature Stock',
    ageSpan: '365+ Days',
    expectedDays: 730,
    benchmarkWeightKg: 640,
    description: 'Mature body condition score, udder structure or bull stud index',
  },
];

export default function AnimalMediaStageComparison({
  mediaList,
  isOpen,
  onClose,
  onOpenViewer,
  onAddStagePhoto,
}: AnimalMediaStageComparisonProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col h-[90vh] w-full max-w-6xl rounded-3xl border border-stone-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Lifecycle Developmental Progression</h3>
              <p className="text-xs text-stone-500">
                Sequential photographic tracking from birth, maternal nursing, weaning, yearling, to mature herd stock
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Horizontal Progression Track */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex items-stretch gap-4 min-w-[960px] h-full">
            {STAGES.map((stg, index) => {
              // Find matching media for this stage
              const stageMedia = mediaList.filter((m) => m.stage === stg.key);
              const primaryItem = stageMedia[0];

              return (
                <div
                  key={stg.key}
                  className="flex-1 flex flex-col rounded-3xl border border-stone-200/80 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
                >
                  {/* Stage Header */}
                  <div className="p-3.5 bg-stone-50/80 border-b border-stone-200/70">
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                      <span>Phase {index + 1}</span>
                      <span className="font-semibold text-emerald-800">{stg.ageSpan}</span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 mt-0.5">{stg.title}</h4>
                  </div>

                  {/* Media Frame */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 flex items-center justify-center border-b border-stone-200/70">
                    {primaryItem ? (
                      <div
                        className="relative h-full w-full group cursor-pointer"
                        onClick={() => onOpenViewer(primaryItem)}
                      >
                        <img
                          src={primaryItem.thumbnailUrl || primaryItem.url}
                          alt={stg.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 text-stone-900 px-3 py-1 text-xs font-bold backdrop-blur-xs shadow-md">
                            <Eye className="h-3.5 w-3.5" /> Inspect
                          </span>
                        </div>
                        <span className="absolute bottom-1.5 right-1.5 rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur-xs">
                          {primaryItem.capturedAt?.split('T')[0] || 'Logged'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-stone-400 text-xs mb-2">No photo registered</span>
                        {onAddStagePhoto && (
                          <button
                            type="button"
                            onClick={() => onAddStagePhoto(stg.key)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:border-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/30 transition-colors shadow-2xs"
                          >
                            <Plus className="h-3 w-3" /> Add {stg.title}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Growth Benchmark Metrics */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">
                        Benchmark Profile
                      </span>
                      <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-stone-500">Target Weight:</span>
                        <span className="font-bold text-stone-900">{stg.benchmarkWeightKg} kg</span>
                      </div>
                      <p className="mt-2 text-[11px] text-stone-500 leading-relaxed">
                        {stg.description}
                      </p>
                    </div>

                    {stageMedia.length > 1 && (
                      <div className="pt-2 border-t border-stone-100 text-[10px] text-emerald-800 font-semibold">
                        +{stageMedia.length - 1} more angle logged in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
