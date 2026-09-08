'use client';

import React from 'react';
import { AnimalMedia } from '@/lib/bovine-types';
import {
  Calendar,
  Camera,
  Video,
  Play,
  CheckCircle2,
  Clock,
  Link2,
  Sparkles,
  Eye,
  Star,
  Activity,
  HeartPulse,
  Award,
} from 'lucide-react';

interface AnimalMediaTimelineProps {
  mediaList: AnimalMedia[];
  onOpenViewer: (media: AnimalMedia) => void;
  onCompare?: (media: AnimalMedia) => void;
}

export default function AnimalMediaTimeline({
  mediaList,
  onOpenViewer,
  onCompare,
}: AnimalMediaTimelineProps) {
  // Sort chronological by capture date (descending by default)
  const sorted = [...mediaList].sort((a, b) => {
    const dateA = new Date(a.capturedAt || a.takenAt || a.uploadedAt || 0).getTime();
    const dateB = new Date(b.capturedAt || b.takenAt || b.uploadedAt || 0).getTime();
    return dateB - dateA;
  });

  // Group by Year-Month or Life Stage
  const groups: { [key: string]: AnimalMedia[] } = {};
  sorted.forEach((item) => {
    const rawDate = item.capturedAt || item.takenAt || item.uploadedAt || 'Undated';
    let period = 'Undated';
    if (rawDate !== 'Undated') {
      const d = new Date(rawDate);
      period = isNaN(d.getTime())
        ? rawDate.slice(0, 7)
        : d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    if (!groups[period]) groups[period] = [];
    groups[period].push(item);
  });

  if (sorted.length === 0) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center text-stone-500 shadow-2xs">
        <Calendar className="h-8 w-8 mx-auto mb-2 text-stone-400" />
        <p className="text-sm font-semibold text-stone-700">No chronological media timeline data</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 md:pl-8 before:absolute before:left-3 md:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 space-y-8">
      {Object.entries(groups).map(([period, items]) => (
        <div key={period} className="relative">
          {/* Period Marker Dot */}
          <div className="absolute -left-6 md:-left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-emerald-800 shadow-2xs">
            <div className="h-2 w-2 rounded-full bg-emerald-800" />
          </div>

          {/* Period Title */}
          <div className="mb-4 flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <Calendar className="h-3.5 w-3.5 text-emerald-800" /> {period}
            </span>
            <span className="ml-2.5 text-xs text-stone-500 font-medium">
              {items.length} {items.length === 1 ? 'record' : 'records'} logged
            </span>
          </div>

          {/* Items in this Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((media) => {
              const isVideo = media.mediaType === 'VIDEO' || !!media.videoDurationSeconds;
              const dateStr = media.capturedAt || media.takenAt || media.uploadedAt || '';
              const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;

              return (
                <div
                  key={media.id}
                  className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-2xs hover:shadow-md transition-all hover:border-stone-300 group"
                >
                  {/* Thumbnail / Video launch */}
                  <div
                    className="relative w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => onOpenViewer(media)}
                  >
                    <img
                      src={media.thumbnailUrl || media.url}
                      alt={media.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
                          <Play className="h-4 w-4 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    {media.isIdentityPhoto && (
                      <span className="absolute top-1.5 left-1.5 rounded-lg bg-amber-500/95 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                        Primary
                      </span>
                    )}
                  </div>

                  {/* Narrative details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono text-stone-400">{cleanDate}</span>
                        {media.ageMonthsAtCapture !== undefined && (
                          <span className="rounded-lg bg-stone-100 border border-stone-200/60 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                            {media.ageMonthsAtCapture} Months
                          </span>
                        )}
                      </div>

                      <h4
                        className="text-xs font-semibold text-stone-900 mt-1 truncate hover:text-emerald-800 cursor-pointer transition-colors"
                        onClick={() => onOpenViewer(media)}
                        title={media.title}
                      >
                        {media.title}
                      </h4>

                      {media.caption && (
                        <p className="mt-1 text-[11px] text-stone-500 line-clamp-2 leading-tight">
                          {media.caption}
                        </p>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {media.stage && (
                          <span className="rounded-lg bg-stone-100 border border-stone-200/60 text-stone-700 px-2 py-0.5 font-semibold text-[10px]">
                            {media.stage}
                          </span>
                        )}
                        {media.links && media.links.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-stone-500">
                            <Link2 className="h-2.5 w-2.5" />
                            {media.links[0].label || media.links[0].entityType}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {onCompare && (
                          <button
                            onClick={() => onCompare(media)}
                            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                            title="Compare stage progression"
                          >
                            <Sparkles className="h-3 w-3 text-indigo-600" />
                          </button>
                        )}
                        <button
                          onClick={() => onOpenViewer(media)}
                          className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                          title="Open full inspector"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
