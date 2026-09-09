'use client';

import React, { useState } from 'react';
import { useBovineMap } from '@/lib/bovine-map-store';
import {
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  History,
  Radio,
} from 'lucide-react';

export function MapTimelineSlider() {
  const { activeDate, setActiveDate, isPlayingTimeline, toggleTimelinePlayback } = useBovineMap();
  const [speed, setSpeed] = useState<number>(1);

  // Preset snapshot steps
  const presets = [
    { label: 'Today', daysAgo: 0 },
    { label: '-7d', daysAgo: 7 },
    { label: '-30d', daysAgo: 30 },
    { label: '-90d', daysAgo: 90 },
    { label: '-180d', daysAgo: 180 },
  ];

  const handlePreset = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setActiveDate(d.toISOString().split('T')[0]);
  };

  const handleStep = (days: number) => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() + days);
    const now = new Date();
    if (d > now) {
      setActiveDate(now.toISOString().split('T')[0]);
    } else {
      setActiveDate(d.toISOString().split('T')[0]);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Convert date to a slider range [0..365] where 365 is today
  const today = new Date();
  const currentDate = new Date(activeDate);
  const diffDays = Math.max(
    0,
    Math.min(365, Math.round((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)))
  );
  const sliderValue = 365 - diffDays;

  const handleSliderChange = (val: number) => {
    const daysAgo = 365 - val;
    const target = new Date();
    target.setDate(target.getDate() - daysAgo);
    setActiveDate(target.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-xl rounded-2xl px-4 py-2.5 max-w-2xl w-full mx-auto flex flex-col gap-2 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            aria-label="Previous day"
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleTimelinePlayback}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
              isPlayingTimeline
                ? 'bg-amber-600 text-white hover:bg-amber-700 ring-2 ring-amber-400/30'
                : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-stone-300'
            }`}
          >
            {isPlayingTimeline ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Playback</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleStep(1)}
            aria-label="Next day"
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handlePreset(0)}
            title="Reset to today"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors ml-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Active Date Display */}
        <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/80 px-3 py-1 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-emerald-800" />
          <span className="text-xs font-bold text-stone-900 tracking-tight">
            {formatDate(activeDate)}
          </span>
          {diffDays === 0 ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="text-[10px] font-medium text-stone-500">
              {diffDays}d ago
            </span>
          )}
        </div>

        {/* Right: Presets */}
        <div className="hidden sm:flex items-center gap-1">
          <History className="w-3 h-3 text-stone-400 mr-0.5" />
          {presets.map((p) => {
            const isSelected =
              p.daysAgo === 0
                ? diffDays === 0
                : Math.abs(diffDays - p.daysAgo) <= 2;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePreset(p.daysAgo)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded-lg transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrubber slider track */}
      <div className="flex items-center gap-2 w-full pt-1">
        <span className="text-[10px] font-medium text-stone-400 select-none">1y ago</span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={365}
            value={sliderValue}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>
        <span className="text-[10px] font-medium text-emerald-700 select-none font-semibold">Today</span>
      </div>
    </div>
  );
}
