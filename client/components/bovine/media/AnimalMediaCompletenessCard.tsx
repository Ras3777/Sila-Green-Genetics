'use client';

import React from 'react';
import { AnimalMedia } from '@/lib/bovine-types';
import {
  CheckCircle2,
  Circle,
  Camera,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Video,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface AngleCheck {
  id: string;
  label: string;
  required: boolean;
  isSatisfied: boolean;
  matchedMedia?: AnimalMedia;
}

interface AnimalMediaCompletenessCardProps {
  mediaList: AnimalMedia[];
  onOpenGuidedCapture?: () => void;
  onOpenViewer?: (media: AnimalMedia) => void;
}

export default function AnimalMediaCompletenessCard({
  mediaList,
  onOpenGuidedCapture,
  onOpenViewer,
}: AnimalMediaCompletenessCardProps) {
  // Check criteria against current media list
  const hasPrimary = mediaList.some((m) => m.isIdentityPhoto || m.isProfile);
  const hasLeftFlank = mediaList.some(
    (m) =>
      m.category === 'CONFORMATION' &&
      (m.title.toLowerCase().includes('left') || m.tags?.includes('left_flank'))
  );
  const hasRightFlank = mediaList.some(
    (m) =>
      m.category === 'CONFORMATION' &&
      (m.title.toLowerCase().includes('right') || m.tags?.includes('right_flank'))
  );
  const hasRear = mediaList.some(
    (m) =>
      m.category === 'CONFORMATION' &&
      (m.title.toLowerCase().includes('rear') || m.title.toLowerCase().includes('udder'))
  );
  const hasEarTag = mediaList.some(
    (m) =>
      m.category === 'IDENTIFICATION' &&
      (m.title.toLowerCase().includes('tag') || m.tags?.includes('ear_tag'))
  );
  const hasVideo = mediaList.some(
    (m) => m.mediaType === 'VIDEO' || m.category === 'WALKING_VIDEO'
  );

  const checks: AngleCheck[] = [
    {
      id: 'primary',
      label: 'Primary Identity Portrait',
      required: true,
      isSatisfied: hasPrimary,
      matchedMedia: mediaList.find((m) => m.isIdentityPhoto || m.isProfile),
    },
    {
      id: 'left',
      label: 'Left Flank Conformation',
      required: true,
      isSatisfied: hasLeftFlank,
      matchedMedia: mediaList.find((m) => m.title.toLowerCase().includes('left')),
    },
    {
      id: 'right',
      label: 'Right Flank Conformation',
      required: true,
      isSatisfied: hasRightFlank,
      matchedMedia: mediaList.find((m) => m.title.toLowerCase().includes('right')),
    },
    {
      id: 'rear',
      label: 'Rear Udder / Pelvic Assessment',
      required: false,
      isSatisfied: hasRear,
      matchedMedia: mediaList.find((m) => m.title.toLowerCase().includes('rear')),
    },
    {
      id: 'tag',
      label: 'Ear Tag Identification Macro',
      required: true,
      isSatisfied: hasEarTag,
      matchedMedia: mediaList.find((m) => m.title.toLowerCase().includes('tag')),
    },
    {
      id: 'video',
      label: 'Walking Locomotion Video',
      required: false,
      isSatisfied: hasVideo,
      matchedMedia: mediaList.find((m) => m.mediaType === 'VIDEO' || m.category === 'WALKING_VIDEO'),
    },
  ];

  const satisfiedCount = checks.filter((c) => c.isSatisfied).length;
  const scorePct = Math.round((satisfiedCount / checks.length) * 100);

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <h4 className="text-sm font-bold text-stone-900">Media Dossier Completeness</h4>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                scorePct >= 80
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : scorePct >= 50
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {scorePct}% Complete
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Biometric and conformation evidence standard for registry audits, health monitoring, and marketplace certification.
          </p>
        </div>

        {onOpenGuidedCapture && scorePct < 100 && (
          <button
            type="button"
            onClick={onOpenGuidedCapture}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Camera className="h-3.5 w-3.5" /> Capture Missing Angle
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full rounded-full bg-stone-100 h-2.5 overflow-hidden p-0.5 border border-stone-200/60">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            scorePct >= 80 ? 'bg-emerald-600' : scorePct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${scorePct}%` }}
        />
      </div>

      {/* Checklist Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        {checks.map((check) => (
          <div
            key={check.id}
            className={`flex flex-col justify-between rounded-2xl border p-3 transition-colors ${
              check.isSatisfied
                ? 'border-emerald-200 bg-emerald-50/40'
                : 'border-stone-200/80 bg-stone-50/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-stone-400 uppercase font-mono font-medium">
                {check.required ? 'Required' : 'Optional'}
              </span>
              {check.isSatisfied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-stone-300 shrink-0" />
              )}
            </div>

            <p className="mt-1.5 font-semibold text-stone-900 text-[11px] leading-snug">
              {check.label}
            </p>

            <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
              {check.isSatisfied ? (
                <span
                  onClick={() => check.matchedMedia && onOpenViewer && onOpenViewer(check.matchedMedia)}
                  className="text-emerald-800 hover:underline cursor-pointer flex items-center gap-1 font-semibold truncate"
                >
                  <Eye className="h-3 w-3" /> View
                </span>
              ) : (
                <span className="text-amber-800 font-semibold">Missing</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
