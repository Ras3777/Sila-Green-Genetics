'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { BovineMapProvider, useBovineMap } from '@/lib/bovine-map-store';
import { MapHeader } from './MapHeader';
import { MapToolbar } from './MapToolbar';
import { MapFilterBar } from './MapFilterBar';
import { MapLayerDrawer } from './MapLayerDrawer';
import { MapTimelineSlider } from './MapTimelineSlider';
import { MapLegend } from './MapLegend';
import { MapSelectionInspector } from './MapSelectionInspector';
import { MapResultsTable } from './MapResultsTable';
import { MapMobileBottomSheet } from './MapMobileBottomSheet';
import { Loader2 } from 'lucide-react';

// Dynamic import with SSR disabled for Leaflet Canvas
const BovineMapCanvas = dynamic(
  () => import('./BovineMapCanvas').then((mod) => mod.BovineMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-stone-100 text-stone-500 rounded-2xl border border-stone-200">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-800 mb-2" />
        <span className="text-xs font-bold text-stone-700">Loading Geospatial Engine...</span>
        <span className="text-[10px] text-stone-400">Rendering administrative tiles & vectors</span>
      </div>
    ),
  }
);

function BovineMapWorkspaceInner() {
  const { viewMode } = useBovineMap();
  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] min-h-[700px] space-y-2 p-2 sm:p-4 max-w-[1920px] mx-auto overflow-hidden">
      {/* Top Workspace Header */}
      <MapHeader
        onOpenLayers={() => setIsLayerDrawerOpen(true)}
        onToggleTimeline={() => setShowTimeline((prev) => !prev)}
        showTimeline={showTimeline}
      />

      {/* Metric Overlay Selector Toolbar */}
      <MapToolbar />

      {/* Filter Bar */}
      <MapFilterBar />

      {/* 8-Domain Layer Toggle Drawer */}
      <MapLayerDrawer
        isOpen={isLayerDrawerOpen}
        onClose={() => setIsLayerDrawerOpen(false)}
      />

      {/* Workspace View Mode Body */}
      <main className="flex-1 relative min-h-0 overflow-hidden rounded-2xl border border-stone-200/90 shadow-xs bg-stone-100 flex flex-col">
        {/* MAP VIEW */}
        {viewMode === 'MAP' && (
          <div className="relative w-full h-full flex-1 overflow-hidden">
            <BovineMapCanvas className="w-full h-full" />

            {/* Floating Dynamic Legend on bottom left */}
            <div className="absolute bottom-4 left-4 z-900 pointer-events-auto hidden md:block">
              <MapLegend />
            </div>

            {/* Floating Timeline Scrubber on bottom center */}
            {showTimeline && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-900 pointer-events-auto max-w-xl w-full">
                <MapTimelineSlider />
              </div>
            )}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === 'TABLE' && (
          <div className="w-full h-full flex-1 p-2 overflow-hidden bg-white">
            <MapResultsTable />
          </div>
        )}

        {/* SPLIT VIEW */}
        {viewMode === 'SPLIT' && (
          <div className="w-full h-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 p-2 overflow-hidden bg-stone-200/50">
            {/* Left/Top Map */}
            <div className="relative w-full h-[320px] lg:h-full rounded-xl overflow-hidden border border-stone-200 shadow-xs">
              <BovineMapCanvas className="w-full h-full" />
              <div className="absolute bottom-2 left-2 z-900 hidden xl:block">
                <MapLegend />
              </div>
              {showTimeline && (
                <div className="absolute bottom-2 left-2 right-2 sm:left-auto sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-900 pointer-events-auto max-w-md w-full">
                  <MapTimelineSlider />
                </div>
              )}
            </div>

            {/* Right/Bottom Table */}
            <div className="w-full h-[400px] lg:h-full overflow-hidden">
              <MapResultsTable />
            </div>
          </div>
        )}

        {/* Slide-over Selection Inspector */}
        <MapSelectionInspector />
      </main>

      {/* Mobile Touch Bottom Sheet */}
      <MapMobileBottomSheet />
    </div>
  );
}

export function BovineMapClient() {
  return (
    <BovineMapProvider>
      <BovineMapWorkspaceInner />
    </BovineMapProvider>
  );
}
