'use client';

import React, { useState } from 'react';
import { AnimalMedia } from '@/lib/bovine-types';
import {
  X,
  Layers,
  ArrowRight,
  Calendar,
  Sparkles,
  Scale,
  CheckCircle2,
  Activity,
  Sliders,
} from 'lucide-react';

interface AnimalMediaBeforeAfterProps {
  mediaList: AnimalMedia[];
  initialBeforeId?: string;
  initialAfterId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AnimalMediaBeforeAfter({
  mediaList,
  initialBeforeId,
  initialAfterId,
  isOpen,
  onClose,
}: AnimalMediaBeforeAfterProps) {
  // Default to first two media items if not explicitly set
  const [beforeId, setBeforeId] = useState<string>(
    initialBeforeId || (mediaList[0]?.id ?? '')
  );
  const [afterId, setAfterId] = useState<string>(
    initialAfterId || (mediaList[1]?.id ?? mediaList[0]?.id ?? '')
  );
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'SIDE_BY_SIDE' | 'SLIDER'>('SIDE_BY_SIDE');

  if (!isOpen) return null;

  const beforeMedia = mediaList.find((m) => m.id === beforeId) || mediaList[0];
  const afterMedia = mediaList.find((m) => m.id === afterId) || mediaList[1] || mediaList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col h-[90vh] w-full max-w-5xl rounded-3xl border border-stone-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Before / After Visual Comparison</h3>
              <p className="text-xs text-stone-500">
                Examine clinical healing, conformation maturation, or weight progression over time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-stone-200 p-1 bg-stone-100/80 text-xs">
              <button
                onClick={() => setViewMode('SIDE_BY_SIDE')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === 'SIDE_BY_SIDE'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('SLIDER')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === 'SLIDER'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Interactive Slider
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Media Selectors */}
        <div className="grid grid-cols-2 gap-4 px-6 py-3.5 border-b border-stone-100 bg-stone-50/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-600 uppercase text-[10px] w-14 shrink-0">
              Before:
            </span>
            <select
              value={beforeId}
              onChange={(e) => setBeforeId(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 focus:ring-1 focus:ring-emerald-800 outline-none shadow-2xs"
            >
              {mediaList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.capturedAt?.split('T')[0] || 'Undated'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-600 uppercase text-[10px] w-14 shrink-0">
              After:
            </span>
            <select
              value={afterId}
              onChange={(e) => setAfterId(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 focus:ring-1 focus:ring-emerald-800 outline-none shadow-2xs"
            >
              {mediaList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.capturedAt?.split('T')[0] || 'Undated'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Inspection Canvas */}
        <div className="relative flex-1 bg-stone-950 p-4 flex items-center justify-center overflow-hidden">
          {viewMode === 'SIDE_BY_SIDE' ? (
            <div className="grid grid-cols-2 gap-4 h-full w-full max-h-[55vh]">
              {/* Left Canvas (Before) */}
              <div className="relative flex flex-col rounded-2xl overflow-hidden border border-stone-800 bg-black/60 shadow-lg">
                <div className="absolute top-2.5 left-2.5 z-10 rounded-lg bg-stone-900/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white shadow-xs border border-white/10">
                  BEFORE • {beforeMedia?.capturedAt?.split('T')[0] || 'Day 0'}
                </div>
                <img
                  src={beforeMedia?.thumbnailUrl || beforeMedia?.url}
                  alt="Before state"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Right Canvas (After) */}
              <div className="relative flex flex-col rounded-2xl overflow-hidden border border-stone-800 bg-black/60 shadow-lg">
                <div className="absolute top-2.5 right-2.5 z-10 rounded-lg bg-emerald-700/95 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white shadow-xs border border-emerald-500/30">
                  AFTER • {afterMedia?.capturedAt?.split('T')[0] || 'Current'}
                </div>
                <img
                  src={afterMedia?.thumbnailUrl || afterMedia?.url}
                  alt="After state"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          ) : (
            /* Interactive Slider View */
            <div className="relative h-full w-full max-h-[55vh] max-w-3xl overflow-hidden rounded-2xl border border-stone-800 shadow-2xl select-none">
              {/* Under Image (After) */}
              <img
                src={afterMedia?.thumbnailUrl || afterMedia?.url}
                alt="After"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Over Image (Before) clipped by slider */}
              <div
                className="absolute inset-0 h-full overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={beforeMedia?.thumbnailUrl || beforeMedia?.url}
                  alt="Before"
                  className="absolute inset-0 h-full w-full object-cover max-w-none"
                  style={{ width: '100%', minWidth: '100%' }}
                />
              </div>

              {/* Slider Line & Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-lg"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-900 shadow-xl border border-stone-300">
                  <Sliders className="h-4 w-4" />
                </div>
              </div>

              {/* Slider Range Input Overlay */}
              <input
                type="range"
                min={0}
                max={100}
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
              />

              {/* Floating Labels */}
              <div className="absolute top-3 left-3 pointer-events-none rounded-lg bg-black/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xs border border-white/10">
                Before ({sliderPosition}%)
              </div>
              <div className="absolute top-3 right-3 pointer-events-none rounded-lg bg-emerald-700/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xs border border-emerald-500/30">
                After ({100 - sliderPosition}%)
              </div>
            </div>
          )}
        </div>

        {/* Comparison Ledger Metrics */}
        <div className="border-t border-stone-200 bg-white p-5 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 space-y-1.5">
              <span className="font-semibold text-stone-900 text-xs">{beforeMedia?.title}</span>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60 font-mono">
                <span>Date: {beforeMedia?.capturedAt?.split('T')[0] || '—'}</span>
                <span>Stage: {beforeMedia?.stage || 'Prior'}</span>
                <span>Age: {beforeMedia?.ageMonthsAtCapture ?? '—'} mos</span>
              </div>
              {beforeMedia?.caption && (
                <p className="text-[11px] text-stone-600 italic leading-relaxed">
                  "{beforeMedia.caption}"
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5 space-y-1.5">
              <span className="font-semibold text-emerald-900 text-xs">
                {afterMedia?.title}
              </span>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-emerald-200/60 font-mono">
                <span>Date: {afterMedia?.capturedAt?.split('T')[0] || '—'}</span>
                <span>Stage: {afterMedia?.stage || 'Current'}</span>
                <span>Age: {afterMedia?.ageMonthsAtCapture ?? '—'} mos</span>
              </div>
              {afterMedia?.caption && (
                <p className="text-[11px] text-stone-600 italic leading-relaxed">
                  "{afterMedia.caption}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
