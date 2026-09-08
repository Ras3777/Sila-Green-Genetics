'use client';

import React, { useState } from 'react';
import { AnimalMedia } from '@/lib/bovine-types';
import {
  X,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Star,
  Eye,
  ShieldCheck,
  Globe,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface AnimalMediaMarketplaceSelectorProps {
  mediaList: AnimalMedia[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateMarketplaceList: (
    updatedOrder: Array<{ mediaId: string; selected: boolean; order: number }>
  ) => void;
}

export default function AnimalMediaMarketplaceSelector({
  mediaList,
  isOpen,
  onClose,
  onUpdateMarketplaceList,
}: AnimalMediaMarketplaceSelectorProps) {
  // Sort initial items: currently selected first by order, then rest
  const [items, setItems] = useState<
    Array<{ media: AnimalMedia; selected: boolean; order: number }>
  >(() => {
    return mediaList.map((m, idx) => ({
      media: m,
      selected: !!m.marketplaceSelected,
      order: m.marketplaceOrder || idx + 1,
    }));
  });

  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [includePedigreeBadge, setIncludePedigreeBadge] = useState(true);

  if (!isOpen) return null;

  const selectedItems = items
    .filter((i) => i.selected)
    .sort((a, b) => a.order - b.order);

  // Validation Checks
  const hasHeroPhoto = selectedItems.some(
    (i) => i.media.category === 'CONFORMATION' || i.media.category === 'MARKETPLACE_HERO'
  );
  const hasVideo = selectedItems.some(
    (i) => i.media.mediaType === 'VIDEO' || i.media.category === 'WALKING_VIDEO'
  );
  const hasInappropriateClinical = selectedItems.some(
    (i) => i.media.category === 'HEALTH_CLINICAL' && i.media.visibility !== 'PUBLIC'
  );

  const toggleSelect = (mediaId: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.media.id !== mediaId) return it;
        const newSelected = !it.selected;
        return {
          ...it,
          selected: newSelected,
          order: newSelected ? selectedItems.length + 1 : 99,
        };
      })
    );
  };

  const moveOrder = (index: number, direction: 'UP' | 'DOWN') => {
    const list = [...selectedItems];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Re-assign order numbers
    const updatedSelectedMap = new Map<string, number>();
    list.forEach((it, idx) => {
      updatedSelectedMap.set(it.media.id, idx + 1);
    });

    setItems((prev) =>
      prev.map((it) => {
        if (updatedSelectedMap.has(it.media.id)) {
          return {
            ...it,
            order: updatedSelectedMap.get(it.media.id)!,
          };
        }
        return it;
      })
    );
  };

  const handleSave = () => {
    const payload = items.map((it) => ({
      mediaId: it.media.id,
      selected: it.selected,
      order: it.order,
    }));
    onUpdateMarketplaceList(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col h-[90vh] w-full max-w-4xl rounded-3xl border border-stone-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Marketplace Media Curation</h3>
              <p className="text-xs text-stone-500">
                Select and sequence public listing photos, hero cover, and walking videos for prospective buyers
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

        {/* Curation Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Marketplace Validation Checklist */}
          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 space-y-3">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
              Public Catalog Quality Standards
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                {hasHeroPhoto ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
                <span className={hasHeroPhoto ? 'text-stone-900 font-medium' : 'text-amber-800 font-semibold'}>
                  Hero Conformation Photo
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasVideo ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-stone-400" />
                )}
                <span className={hasVideo ? 'text-stone-900 font-medium' : 'text-stone-500'}>
                  Walking Locomotion Video {hasVideo ? '' : '(Optional)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!hasInappropriateClinical ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                )}
                <span className={!hasInappropriateClinical ? 'text-stone-900 font-medium' : 'text-rose-700 font-semibold'}>
                  No Internal Clinical Wounds
                </span>
              </div>
            </div>
          </div>

          {/* Active Ordered Catalog Sequence */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">
                Current Catalog Sequence ({selectedItems.length} Enrolled)
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                Item #1 is designated as the Hero Cover Image
              </span>
            </div>

            {selectedItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-500 bg-stone-50/50">
                <p className="font-semibold text-stone-700">No media currently featured in the marketplace catalog.</p>
                <p className="text-[11px] mt-1 text-stone-500">Select assets from the pool below to add them.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item, idx) => (
                  <div
                    key={item.media.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                        #{idx + 1}
                      </span>
                      <img
                        src={item.media.thumbnailUrl || item.media.url}
                        alt={item.media.title}
                        className="h-12 w-16 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-stone-900 text-xs">{item.media.title}</h4>
                          {idx === 0 && (
                            <span className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                              HERO COVER
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500">{item.media.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveOrder(idx, 'UP')}
                        disabled={idx === 0}
                        className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveOrder(idx, 'DOWN')}
                        disabled={idx === selectedItems.length - 1}
                        className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSelect(item.media.id)}
                        className="rounded-lg p-1 text-rose-600 hover:bg-rose-50 transition-colors ml-2"
                        title="Remove from Marketplace"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Media Pool */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <span className="text-xs font-bold text-stone-900">
              All Available Animal Media ({mediaList.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((it) => (
                <div
                  key={it.media.id}
                  onClick={() => toggleSelect(it.media.id)}
                  className={`group relative rounded-2xl border p-2.5 cursor-pointer transition-all overflow-hidden ${
                    it.selected
                      ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/30'
                      : 'border-stone-200/80 bg-white hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 mb-2 border border-stone-200/60">
                    <img
                      src={it.media.thumbnailUrl || it.media.url}
                      alt={it.media.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-stone-900 truncate text-[11px] flex-1">
                      {it.media.title}
                    </p>
                    {it.selected && (
                      <span className="rounded-lg bg-amber-500 text-white font-bold text-[10px] px-1.5 py-0.2">
                        #{it.order}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-100 px-6 py-4 bg-stone-50/50">
          <div className="flex items-center gap-4 text-xs text-stone-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={watermarkEnabled}
                onChange={(e) => setWatermarkEnabled(e.target.checked)}
                className="h-3.5 w-3.5 rounded accent-emerald-800"
              />
              <span className="font-medium">Watermark Farm Brand</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includePedigreeBadge}
                onChange={(e) => setIncludePedigreeBadge(e.target.checked)}
                className="h-3.5 w-3.5 rounded accent-emerald-800"
              />
              <span className="font-medium">Overlay Verified Genomic Stamp</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              <ShoppingBag className="h-4 w-4" /> Save Marketplace Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
