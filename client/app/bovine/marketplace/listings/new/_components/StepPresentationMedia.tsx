'use client';

import React from 'react';
import { X } from 'lucide-react';

interface StepPresentationMediaProps {
  title: string;
  setTitle: (t: string) => void;
  description: string;
  setDescription: (d: string) => void;
  highlightInput: string;
  setHighlightInput: (h: string) => void;
  highlights: string[];
  onAddHighlight: () => void;
  onRemoveHighlight: (idx: number) => void;
  mediaUrl: string;
  setMediaUrl: (url: string) => void;
  mediaList: Array<{ id: string; url: string; title: string; type: 'IMAGE' }>;
  onAddMedia: () => void;
}

export function StepPresentationMedia({
  title,
  setTitle,
  description,
  setDescription,
  highlightInput,
  setHighlightInput,
  highlights,
  onAddHighlight,
  onRemoveHighlight,
  mediaUrl,
  setMediaUrl,
  mediaList,
  onAddMedia,
}: StepPresentationMediaProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-stone-900">Presentation & Marketing</h3>
        <p className="text-xs text-stone-600">Add compelling headlines, key strengths, and photography.</p>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Listing Headline / Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. GAR Sure Fire 6432 - Elite Calving Ease AI Sire"
          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Breeder Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe maternal qualities, phenotypic soundness, carcass traits, or semen collection data..."
          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />
      </div>

      {/* Highlights tags */}
      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Commercial Highlights</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            placeholder="e.g. Heifer Safe, Top 3% Marbling"
            className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
          />
          <button
            type="button"
            onClick={onAddHighlight}
            className="px-3 py-1.5 text-xs font-bold bg-stone-900 text-white rounded-xl hover:bg-stone-800 cursor-pointer"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {highlights.map((h, i) => (
            <span key={i} className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-1 font-medium">
              {h}
              <button type="button" onClick={() => onRemoveHighlight(i)} className="hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Media URL add */}
      <div>
        <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Image URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="Paste image link (https://...)"
            className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
          />
          <button
            type="button"
            onClick={onAddMedia}
            className="px-3 py-1.5 text-xs font-bold bg-stone-900 text-white rounded-xl hover:bg-stone-800 cursor-pointer"
          >
            Add Image
          </button>
        </div>
        {mediaList.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {mediaList.map((m) => (
              <div key={m.id} className="relative h-20 rounded-xl overflow-hidden border border-stone-200">
                <img src={m.url} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
