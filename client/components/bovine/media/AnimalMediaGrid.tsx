'use client';

import React, { useState } from 'react';
import { AnimalMedia, MediaVerificationStatus } from '@/lib/bovine-types';
import AnimalMediaCard from './AnimalMediaCard';
import {
  Layers,
  CheckSquare,
  Square,
  CheckCircle2,
  Trash2,
  ShoppingBag,
  Sparkles,
  X,
  Camera,
} from 'lucide-react';

interface AnimalMediaGridProps {
  mediaList: AnimalMedia[];
  onOpenViewer: (media: AnimalMedia) => void;
  onSetPrimary?: (mediaId: string) => void;
  onVerify?: (mediaId: string, status: MediaVerificationStatus) => void;
  onToggleMarketplace?: (mediaId: string, selected: boolean) => void;
  onDelete?: (mediaId: string) => void;
  onAddToAlbum?: (mediaId: string) => void;
  onCompare?: (media: AnimalMedia) => void;
  onBatchVerify?: (mediaIds: string[], status: MediaVerificationStatus) => void;
  onBatchMarketplace?: (mediaIds: string[], selected: boolean) => void;
  onBatchAddToAlbum?: (mediaIds: string[]) => void;
  onBatchDelete?: (mediaIds: string[]) => void;
  onOpenUploader?: () => void;
}

export default function AnimalMediaGrid({
  mediaList,
  onOpenViewer,
  onSetPrimary,
  onVerify,
  onToggleMarketplace,
  onDelete,
  onAddToAlbum,
  onCompare,
  onBatchVerify,
  onBatchMarketplace,
  onBatchAddToAlbum,
  onBatchDelete,
  onOpenUploader,
}: AnimalMediaGridProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mediaList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mediaList.map((m) => m.id));
    }
  };

  if (mediaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200/80 py-16 px-4 text-center bg-white shadow-2xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 mb-4 shadow-2xs">
          <Camera className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-stone-900">No Media Records Available</h3>
        <p className="mt-1 max-w-sm text-xs text-stone-500 leading-relaxed">
          No photographic evidence, ultrasound scans, or locomotion videos match your current filter parameters.
        </p>
        {onOpenUploader && (
          <button
            onClick={onOpenUploader}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors"
          >
            <Camera className="h-3.5 w-3.5" /> Upload or Capture Evidence
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Batch Selection Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-30 flex items-center justify-between gap-4 rounded-2xl border border-stone-800 bg-stone-900/95 text-white p-3 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {selectedIds.length === mediaList.length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {selectedIds.length} Selected of {mediaList.length}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onBatchVerify && (
              <button
                onClick={() => {
                  onBatchVerify(selectedIds, 'VERIFIED');
                  setSelectedIds([]);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Verify Batch
              </button>
            )}

            {onBatchMarketplace && (
              <button
                onClick={() => {
                  onBatchMarketplace(selectedIds, true);
                  setSelectedIds([]);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> Feature in Catalog
              </button>
            )}

            {onBatchAddToAlbum && (
              <button
                onClick={() => {
                  onBatchAddToAlbum(selectedIds);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 px-3 py-1.5 text-xs font-semibold text-stone-200 shadow-xs transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Add to Album
              </button>
            )}

            {onBatchDelete && (
              <button
                onClick={() => {
                  if (confirm(`Remove ${selectedIds.length} media items from animal records?`)) {
                    onBatchDelete(selectedIds);
                    setSelectedIds([]);
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            )}

            <button
              onClick={() => setSelectedIds([])}
              className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mediaList.map((item) => (
          <AnimalMediaCard
            key={item.id}
            media={item}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={handleToggleSelect}
            onOpenViewer={onOpenViewer}
            onSetPrimary={onSetPrimary}
            onVerify={onVerify}
            onToggleMarketplace={onToggleMarketplace}
            onDelete={onDelete}
            onAddToAlbum={onAddToAlbum}
            onCompare={onCompare}
          />
        ))}
      </div>
    </div>
  );
}
