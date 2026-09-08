'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import { AnimalMedia, MediaCategory } from '@/lib/bovine-types';
import AnimalMediaViewer from './AnimalMediaViewer';
import AnimalMediaUploader from './AnimalMediaUploader';
import {
  Image as ImageIcon,
  Video,
  Play,
  Upload,
  ExternalLink,
  CheckCircle2,
  Clock,
  Camera,
  ChevronRight,
} from 'lucide-react';

interface AnimalMediaEmbeddedWidgetProps {
  animalId: string;
  categoryFilter?: MediaCategory | MediaCategory[];
  stageFilter?: 'BIRTH' | 'MATERNAL' | 'WEANING' | 'YEARLING' | 'MATURE';
  title?: string;
  description?: string;
  compact?: boolean;
  maxItems?: number;
  allowUpload?: boolean;
  emptyMessage?: string;
  galleryPath?: string;
}

export default function AnimalMediaEmbeddedWidget({
  animalId,
  categoryFilter,
  stageFilter,
  title = 'Visual Evidence & Diagnostic Media',
  description = 'Operational photographs, ultrasound records, and locomotion recordings.',
  compact = false,
  maxItems = 4,
  allowUpload = true,
  emptyMessage = 'No visual records attached to this operational domain.',
  galleryPath,
}: AnimalMediaEmbeddedWidgetProps) {
  const { media, addAnimalMedia } = useBovine();
  const [activeMedia, setActiveMedia] = useState<AnimalMedia | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // Filter media for this animal and category/stage
  const filteredMedia = media.filter((m) => {
    if (m.animalId !== animalId) return false;
    if (categoryFilter) {
      if (Array.isArray(categoryFilter)) {
        if (!m.category || !categoryFilter.includes(m.category)) return false;
      } else {
        if (m.category !== categoryFilter) return false;
      }
    }
    if (stageFilter && m.stage !== stageFilter) return false;
    return true;
  });

  const displayList = filteredMedia.slice(0, maxItems);
  const targetGalleryUrl = galleryPath || `/bovine/animals/${animalId}/media`;

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">{title}</h4>
            {!compact && <p className="text-xs text-stone-500">{description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {allowUpload && (
            <button
              type="button"
              onClick={() => setIsUploaderOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors"
            >
              <Upload className="h-3.5 w-3.5" /> Upload Media
            </button>
          )}

          <Link
            href={targetGalleryUrl}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
          >
            <span>Full Gallery ({filteredMedia.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Media Grid or Empty State */}
      {filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50/50 py-8 text-center text-stone-500">
          <Camera className="h-6 w-6 mb-2 text-stone-400" />
          <p className="text-xs font-medium text-stone-600">{emptyMessage}</p>
          {allowUpload && (
            <button
              type="button"
              onClick={() => setIsUploaderOpen(true)}
              className="mt-3 text-xs font-semibold text-emerald-800 hover:underline"
            >
              Attach first record photo or video
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'}`}>
          {displayList.map((item) => {
            const isVideo = item.mediaType === 'VIDEO' || !!item.videoDurationSeconds;
            return (
              <div
                key={item.id}
                onClick={() => setActiveMedia(item)}
                className="group relative flex flex-col rounded-2xl border border-stone-200/80 bg-white overflow-hidden cursor-pointer hover:border-stone-300 hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
                        <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}
                  {item.verificationStatus === 'VERIFIED' && (
                    <span className="absolute top-1.5 right-1.5 rounded-lg bg-emerald-700/90 p-1 text-white shadow-xs">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>

                <div className="p-2.5">
                  <h5 className="font-semibold text-stone-900 text-[11px] truncate group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h5>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                    <span>{item.capturedAt?.split('T')[0] || item.takenAt?.split('T')[0] || 'Logged'}</span>
                    <span className="capitalize">{item.category?.toLowerCase().replace(/_/g, ' ') || item.mediaType}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Viewer */}
      {activeMedia && (
        <AnimalMediaViewer
          media={activeMedia}
          mediaList={filteredMedia}
          onClose={() => setActiveMedia(null)}
          onNavigate={(m) => setActiveMedia(m)}
        />
      )}

      {/* Uploader Modal */}
      {isUploaderOpen && (
        <AnimalMediaUploader
          animalId={animalId}
          isOpen={isUploaderOpen}
          onClose={() => setIsUploaderOpen(false)}
          onUpload={(data) => {
            addAnimalMedia(data);
          }}
        />
      )}
    </div>
  );
}
