'use client';

import React from 'react';
import {
  Search,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  GitFork,
  ArrowRight,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Dna,
  Sliders,
  Check,
} from 'lucide-react';
import {
  PedigreeMode,
  PedigreeOverlay,
  PedigreeDensity,
  PedigreeLayoutDirection,
} from '@/lib/bovine-pedigree-types';

interface PedigreeToolbarProps {
  mode: PedigreeMode;
  onChangeMode: (mode: PedigreeMode) => void;
  maxGenerations: number;
  onChangeGenerations: (gens: number) => void;
  overlay: PedigreeOverlay;
  onChangeOverlay: (overlay: PedigreeOverlay) => void;
  selectedTraitCode: string;
  onChangeTraitCode: (trait: string) => void;
  selectedConditionCode?: string;
  onChangeConditionCode: (cond: string) => void;
  density: PedigreeDensity;
  onChangeDensity: (density: PedigreeDensity) => void;
  direction: PedigreeLayoutDirection;
  onChangeDirection: (dir: PedigreeLayoutDirection) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onResetZoom: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function PedigreeToolbar({
  mode,
  onChangeMode,
  maxGenerations,
  onChangeGenerations,
  overlay,
  onChangeOverlay,
  selectedTraitCode,
  onChangeTraitCode,
  selectedConditionCode,
  onChangeConditionCode,
  density,
  onChangeDensity,
  direction,
  onChangeDirection,
  searchQuery,
  onSearchChange,
  onZoomIn,
  onZoomOut,
  onFitView,
  onResetZoom,
  isFullscreen,
  onToggleFullscreen,
}: PedigreeToolbarProps) {
  const modes: Array<{ key: PedigreeMode; label: string }> = [
    { key: 'ancestors', label: 'Ancestors' },
    { key: 'descendants', label: 'Descendants' },
    { key: 'sireLine', label: 'Sire Line' },
    { key: 'damLine', label: 'Dam Line' },
    { key: 'founders', label: 'Founders' },
    { key: 'dataQuality', label: 'Data Quality' },
  ];

  const overlays: Array<{ key: PedigreeOverlay; label: string; icon: string }> = [
    { key: 'identity', label: 'Standard Identity', icon: 'ID' },
    { key: 'parentage', label: 'Parentage Verification', icon: '✓' },
    { key: 'genetics', label: 'Genetics (EPD / EBV)', icon: '🧬' },
    { key: 'performance', label: 'Growth Phenotypes', icon: '📈' },
    { key: 'conditions', label: 'Genetic Conditions', icon: '⚠️' },
    { key: 'inbreeding', label: 'Inbreeding (F)', icon: '👑' },
    { key: 'marketplace', label: 'Marketplace & Semen', icon: '🏷️' },
    { key: 'dataQuality', label: 'Data Quality Flags', icon: '🛡️' },
  ];

  const traits = [
    { code: 'BWT', name: 'Birth Weight (BWT)' },
    { code: 'WWT', name: 'Weaning Weight (WWT)' },
    { code: 'YWT', name: 'Yearling Weight (YWT)' },
    { code: 'MILK', name: 'Milk Yield (MILK)' },
    { code: 'FAT', name: 'Fat Percentage (FAT)' },
    { code: 'PROT', name: 'Protein Percentage (PROT)' },
    { code: 'CED', name: 'Calving Ease Direct (CED)' },
    { code: 'MARB', name: 'Marbling Score (MARB)' },
  ];

  const conditions = [
    { code: 'ALL', name: 'All Monitored Recessives' },
    { code: 'BLAD', name: 'BLAD (Leukocyte Adhesion)' },
    { code: 'CVM', name: 'CVM (Vertebral Malformation)' },
    { code: 'BY', name: 'Brachyspina Syndrome (BY)' },
    { code: 'HCD', name: 'Cholesterol Deficiency (HCD)' },
    { code: 'AM', name: 'Curly Calf (AM)' },
    { code: 'NH', name: 'Hydrocephalus (NH)' },
    { code: 'RED_FACTOR', name: 'Red Factor (MC1R)' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs p-3 lg:p-4 space-y-3">
      {/* Row 1: Mode switcher pills & Search */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        {/* Mode Pills */}
        <div className="flex items-center space-x-1 p-1 rounded-2xl bg-stone-100/80 overflow-x-auto max-w-full">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => onChangeMode(m.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                mode === m.key
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Live Search & Filter Bar */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ancestor name or ID..."
            className="w-full bg-stone-50 border border-stone-200/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Overlays, Generations, Traits, Density, and Canvas Tools */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-stone-100 text-xs">
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Overlay Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-stone-500 font-medium">Overlay:</span>
            <select
              value={overlay}
              onChange={(e) => onChangeOverlay(e.target.value as PedigreeOverlay)}
              className="bg-stone-50 border border-stone-200/80 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-800 cursor-pointer focus:ring-2 focus:ring-emerald-600/20"
            >
              {overlays.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.icon} {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Trait Selector */}
          {overlay === 'genetics' && (
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-800 font-medium">Trait:</span>
              <select
                value={selectedTraitCode}
                onChange={(e) => onChangeTraitCode(e.target.value)}
                className="bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-emerald-950 cursor-pointer"
              >
                {traits.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Conditional Condition Selector */}
          {overlay === 'conditions' && (
            <div className="flex items-center space-x-1.5">
              <span className="text-amber-800 font-medium">Defect:</span>
              <select
                value={selectedConditionCode || 'ALL'}
                onChange={(e) => onChangeConditionCode(e.target.value)}
                className="bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-950 cursor-pointer"
              >
                {conditions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Generation Depth Selector */}
          <div className="flex items-center space-x-1 pl-2 border-l border-stone-200">
            <span className="text-stone-500 font-medium mr-1">Depth:</span>
            {[3, 4, 5, 7].map((g) => (
              <button
                key={g}
                onClick={() => onChangeGenerations(g)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  maxGenerations === g
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {g}G
              </button>
            ))}
          </div>

          {/* Density Toggle */}
          <div className="flex items-center space-x-1 pl-2 border-l border-stone-200">
            <span className="text-stone-500 font-medium mr-1">Card:</span>
            {(['minimal', 'compact', 'detailed'] as PedigreeDensity[]).map((d) => (
              <button
                key={d}
                onClick={() => onChangeDensity(d)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                  density === d
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Direction Toggle */}
          <button
            type="button"
            onClick={() => onChangeDirection(direction === 'LR' ? 'TB' : 'LR')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
            title="Toggle Horizontal / Vertical orientation"
          >
            {direction === 'LR' ? (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                <span>Horizontal</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-3.5 h-3.5 text-stone-500" />
                <span>Vertical</span>
              </>
            )}
          </button>
        </div>

        {/* Right Canvas Controls (Zoom & Fullscreen) */}
        <div className="flex items-center space-x-1.5 ml-auto">
          <button
            type="button"
            onClick={onFitView}
            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
            title="Fit Entire Pedigree to View"
          >
            Fit View
          </button>

          <button
            type="button"
            onClick={onZoomIn}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onZoomOut}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onResetZoom}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
            title="Reset to 100%"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleFullscreen}
            className={`p-1.5 rounded-lg transition-colors ${
              isFullscreen
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
            title="Toggle Fullscreen Canvas"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
