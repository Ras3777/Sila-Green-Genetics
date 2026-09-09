'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Layers,
  Search,
  Crosshair,
  Ruler,
  Clock,
  Bookmark,
  Plus,
  Maximize2,
  Table,
  Map as MapIcon,
  Columns,
  ChevronDown,
  X,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useBovineMap } from '@/lib/bovine-map-store';
import { BaseMapProvider, MapViewMode, MeasurementToolMode } from '@/lib/bovine-map-types';

interface MapHeaderProps {
  onOpenLayers: () => void;
  onToggleTimeline: () => void;
  showTimeline: boolean;
}

export function MapHeader({
  onOpenLayers,
  onToggleTimeline,
  showTimeline,
}: MapHeaderProps) {
  const {
    filters,
    setFilter,
    baseMap,
    setBaseMap,
    viewMode,
    setViewMode,
    savedViews,
    activeSavedViewId,
    applySavedView,
    saveCurrentView,
    measurementMode,
    setMeasurementMode,
    clearMeasurements,
    flyTo,
    layers,
  } = useBovineMap();

  const [isSavedViewsOpen, setIsSavedViewsOpen] = useState(false);
  const [isMeasureMenuOpen, setIsMeasureMenuOpen] = useState(false);
  const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewDesc, setNewViewDesc] = useState('');

  // Count active layers
  const activeLayersCount = Object.values(layers).filter(Boolean).length;

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          flyTo([pos.coords.latitude, pos.coords.longitude], 14);
        },
        () => {
          // Default fallback to central hub
          flyTo([8.5414, 39.2689], 14);
        }
      );
    }
  };

  const handleSaveView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;
    saveCurrentView(newViewName.trim(), newViewDesc.trim());
    setIsSaveViewModalOpen(false);
    setNewViewName('');
    setNewViewDesc('');
  };

  return (
    <header className="bg-white border-b border-stone-200/80 px-4 py-3 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Brand, Search & Location Scope */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h1 className="font-bold text-stone-900 text-sm sm:text-base tracking-tight leading-tight">
                Geospatial Workspace
              </h1>
              <span className="text-[10px] text-stone-500 font-mono block">
                Bovine Spatial Operating System
              </span>
            </div>
          </div>

          {/* Global Spatial Search Input */}
          <div className="relative flex-1 sm:w-64 lg:w-80">
            <input
              type="text"
              placeholder="Search Tag, DGR, Farm, District, Case #..."
              value={filters.searchQuery}
              onChange={(e) => setFilter('searchQuery', e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
            {filters.searchQuery && (
              <button
                onClick={() => setFilter('searchQuery', '')}
                className="absolute right-2 top-2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: View Modes, Layers, Tools, Saved Views */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle: Map | Table | Split */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('MAP')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'MAP'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Full Map View"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => setViewMode('SPLIT')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'SPLIT'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Split Map & Table View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Data Table View"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Base Map Selector */}
          <select
            value={baseMap}
            onChange={(e) => setBaseMap(e.target.value as BaseMapProvider)}
            className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-700 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-700"
            title="Base Map Tiles"
          >
            <option value="standard">Standard Map</option>
            <option value="satellite">Satellite Imagery</option>
            <option value="terrain">Topographic</option>
            <option value="light">Carto Light</option>
          </select>

          {/* Saved Views Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSavedViewsOpen(!isSavedViewsOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 shadow-2xs cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-800" />
              <span className="hidden md:inline">
                {savedViews.find((v) => v.id === activeSavedViewId)?.name || 'Saved Views'}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isSavedViewsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-2 text-xs">
                <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
                  <span>Saved Viewports &amp; Layers</span>
                  <button
                    onClick={() => {
                      setIsSavedViewsOpen(false);
                      setIsSaveViewModalOpen(true);
                    }}
                    className="text-emerald-800 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Save Current
                  </button>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {savedViews.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        applySavedView(v);
                        setIsSavedViewsOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                        activeSavedViewId === v.id
                          ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                          : 'hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{v.name}</div>
                        <div className="text-[10px] text-stone-500 font-normal truncate max-w-[200px]">
                          {v.description}
                        </div>
                      </div>
                      {activeSavedViewId === v.id && (
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Measurement Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMeasureMenuOpen(!isMeasureMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${
                measurementMode !== 'NONE'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
              }`}
            >
              <Ruler className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline">
                {measurementMode !== 'NONE' ? measurementMode : 'Measure'}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isMeasureMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-2 text-xs space-y-1">
                <button
                  onClick={() => {
                    setMeasurementMode('DISTANCE');
                    setIsMeasureMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-stone-800 cursor-pointer"
                >
                  <div className="font-semibold">Measure Distance</div>
                  <div className="text-[10px] text-stone-500">Click points to measure length</div>
                </button>
                <button
                  onClick={() => {
                    setMeasurementMode('AREA');
                    setIsMeasureMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-stone-800 cursor-pointer"
                >
                  <div className="font-semibold">Measure Area</div>
                  <div className="text-[10px] text-stone-500">Click 3+ points for polygon area</div>
                </button>
                <button
                  onClick={() => {
                    setMeasurementMode('RADIUS_SEARCH');
                    setIsMeasureMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-stone-50 text-stone-800 cursor-pointer"
                >
                  <div className="font-semibold">Radius Circle</div>
                  <div className="text-[10px] text-stone-500">Surveillance or trade perimeter</div>
                </button>
                {measurementMode !== 'NONE' && (
                  <button
                    onClick={() => {
                      clearMeasurements();
                      setIsMeasureMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-red-50 text-red-700 font-semibold cursor-pointer border-t border-stone-100 mt-1"
                  >
                    Clear Measurement
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Locate Me */}
          <button
            onClick={handleLocateMe}
            className="p-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs transition-colors cursor-pointer shadow-2xs"
            title="Locate Current Position"
          >
            <Crosshair className="w-4 h-4 text-emerald-800" />
          </button>

          {/* Timeline Toggle */}
          <button
            onClick={onToggleTimeline}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${
              showTimeline
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
            }`}
            title="Historical Timeline Machine"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Timeline</span>
          </button>

          {/* Layers Drawer Trigger */}
          <button
            onClick={onOpenLayers}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/50 text-[10px] font-mono">
              {activeLayersCount}
            </span>
          </button>
        </div>
      </div>

      {/* Modal: Save Current View */}
      {isSaveViewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-800" />
                <span>Save Current Map View</span>
              </h3>
              <button
                onClick={() => setIsSaveViewModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveView} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">View Name</label>
                <input
                  type="text"
                  placeholder="e.g. Regional Seedstock Breeding Facilities"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Short note on purpose, layers, and filters captured..."
                  value={newViewDesc}
                  onChange={(e) => setNewViewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <div>Preserves active center coordinates, zoom level, enabled layers, and filter selections.</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveViewModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-700 shadow-2xs cursor-pointer"
                >
                  Save View
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
