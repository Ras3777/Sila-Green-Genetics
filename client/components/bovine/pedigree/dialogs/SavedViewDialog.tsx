'use client';

import React, { useState, useEffect } from 'react';
import { X, Layers, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import {
  SavedPedigreeView,
  PedigreeMode,
  PedigreeOverlay,
  PedigreeDensity,
  PedigreeLayoutDirection,
} from '@/lib/bovine-pedigree-types';

interface SavedViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: {
    mode: PedigreeMode;
    overlay: PedigreeOverlay;
    selectedTrait?: string;
    generationDepth: number;
    density: PedigreeDensity;
    direction: PedigreeLayoutDirection;
  };
  onApplyView: (view: SavedPedigreeView) => void;
}

const DEFAULT_PRESETS: SavedPedigreeView[] = [
  {
    id: 'preset-genetics-5g',
    name: '5-Gen National Cattle Evaluation',
    mode: 'ancestors',
    overlay: 'genetics',
    selectedTrait: 'BWT',
    generationDepth: 5,
    density: 'detailed',
    direction: 'LR',
    createdDate: '2026-01-15',
  },
  {
    id: 'preset-carrier-check',
    name: 'Recessive Genetic Carrier Audit',
    mode: 'ancestors',
    overlay: 'conditions',
    generationDepth: 4,
    density: 'compact',
    direction: 'LR',
    createdDate: '2026-02-01',
  },
  {
    id: 'preset-sire-lineage',
    name: 'Pure Paternal Sire Lineage',
    mode: 'sireLine',
    overlay: 'parentage',
    generationDepth: 7,
    density: 'detailed',
    direction: 'LR',
    createdDate: '2026-03-01',
  },
  {
    id: 'preset-marketplace-sires',
    name: 'Commercial Semen & Marketplace Focus',
    mode: 'ancestors',
    overlay: 'marketplace',
    generationDepth: 3,
    density: 'compact',
    direction: 'LR',
    createdDate: '2026-03-10',
  },
];

export default function SavedViewDialog({
  isOpen,
  onClose,
  currentConfig,
  onApplyView,
}: SavedViewDialogProps) {
  const [views, setViews] = useState<SavedPedigreeView[]>(DEFAULT_PRESETS);
  const [newViewName, setNewViewName] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bovine_pedigree_views');
      if (saved) {
        setViews(JSON.parse(saved));
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const saveToStorage = (updated: SavedPedigreeView[]) => {
    setViews(updated);
    try {
      localStorage.setItem('bovine_pedigree_views', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const handleSaveCurrentView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;

    const newView: SavedPedigreeView = {
      id: `view-${Date.now()}`,
      name: newViewName.trim(),
      mode: currentConfig.mode,
      overlay: currentConfig.overlay,
      selectedTrait: currentConfig.selectedTrait,
      generationDepth: currentConfig.generationDepth,
      density: currentConfig.density,
      direction: currentConfig.direction,
      createdDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newView, ...views];
    saveToStorage(updated);
    setNewViewName('');
  };

  const handleDeleteView = (id: string) => {
    const updated = views.filter((v) => v.id !== id);
    saveToStorage(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Saved Workspace Views</h3>
              <p className="text-stone-500 text-xs">Switch presets or save current layout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-stone-700">
          {/* Save current config form */}
          <form onSubmit={handleSaveCurrentView} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <label className="block font-bold text-stone-900">Save Current Configuration</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="View Preset Name (e.g. 5-Gen Dairy View)"
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
              <button
                type="submit"
                disabled={!newViewName.trim()}
                className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold transition-colors shadow-2xs shrink-0"
              >
                Save
              </button>
            </div>
            <div className="text-[10px] text-stone-400">
              Captures: Mode ({currentConfig.mode}), Overlay ({currentConfig.overlay}), Depth ({currentConfig.generationDepth}G), Density ({currentConfig.density})
            </div>
          </form>

          {/* Preset list */}
          <div className="space-y-2">
            <div className="font-bold text-stone-900">Available Views & Presets</div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {views.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between hover:bg-emerald-50/40 transition-colors"
                >
                  <div>
                    <div className="font-bold text-stone-900">{v.name}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {v.mode} • {v.overlay} overlay • {v.generationDepth}G • {v.density}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyView(v);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-600 hover:text-emerald-900 font-bold text-xs transition-colors shadow-2xs"
                    >
                      Apply View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteView(v.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
