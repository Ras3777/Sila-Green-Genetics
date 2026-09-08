'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  PedigreeMode,
  PedigreeOverlay,
  PedigreeDensity,
  PedigreeLayoutDirection,
  SavedPedigreeView,
  PedigreeGraphEdge,
} from '@/lib/bovine-pedigree-types';
import { buildPedigreeGraph } from '@/lib/bovine-pedigree-utils';
import PedigreeHeader from './PedigreeHeader';
import PedigreeToolbar from './PedigreeToolbar';
import PedigreeCanvas from './PedigreeCanvas';
import ReactFlowPedigreeCanvas from './ReactFlowPedigreeCanvas';
import PedigreeInspector from './PedigreeInspector';
import PedigreeAnalyticsDrawer from './PedigreeAnalyticsDrawer';
import MateCheckDialog from './dialogs/MateCheckDialog';
import RelationshipCompareDialog from './dialogs/RelationshipCompareDialog';
import CorrectionDialog from './dialogs/CorrectionDialog';
import ExportDialog from './dialogs/ExportDialog';
import SavedViewDialog from './dialogs/SavedViewDialog';
import PedigreeMobileTree from './mobile/PedigreeMobileTree';
import { AlertCircle } from 'lucide-react';

interface PedigreeWorkspaceProps {
  initialAnimalId: string;
}

export default function PedigreeWorkspace({
  initialAnimalId,
}: PedigreeWorkspaceProps) {
  const { animals, parentages } = useBovine();

  // Root tracking & Breadcrumb history trail
  const [rootAnimalId, setRootAnimalId] = useState<string>(initialAnimalId);
  const [historyTrail, setHistoryTrail] = useState<Array<{ id: string; name: string }>>(() => {
    const initialAnimal = animals.find((a) => a.id === initialAnimalId);
    return [{ id: initialAnimalId, name: initialAnimal?.name || 'Subject' }];
  });

  // Mode and Overlays
  const [mode, setMode] = useState<PedigreeMode>('ancestors');
  const [overlay, setOverlay] = useState<PedigreeOverlay>('parentage');
  const [maxGenerations, setMaxGenerations] = useState<number>(4);
  const [selectedTraitCode, setSelectedTraitCode] = useState<string>('BWT');
  const [selectedConditionCode, setSelectedConditionCode] = useState<string>('ALL');
  const [density, setDensity] = useState<PedigreeDensity>('detailed');
  const [direction, setDirection] = useState<PedigreeLayoutDirection>('LR');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  // Canvas Viewport State
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 120, y: 120 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [canvasEngine, setCanvasEngine] = useState<'reactflow' | 'native'>('reactflow');

  // Inspector & Modal States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialAnimalId);
  const [isMateCheckOpen, setIsMateCheckOpen] = useState(false);
  const [isRelationshipCompareOpen, setIsRelationshipCompareOpen] = useState(false);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [correctionTargetId, setCorrectionTargetId] = useState<string>(initialAnimalId);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSavedViewsOpen, setIsSavedViewsOpen] = useState(false);

  // Root animal resolution
  const rootAnimal = animals.find((a) => a.id === rootAnimalId);

  // Switch root animal
  const handleMakeRoot = useCallback(
    (animalId: string) => {
      const target = animals.find((a) => a.id === animalId);
      if (!target) return;

      setRootAnimalId(animalId);
      setSelectedNodeId(animalId);

      setHistoryTrail((prev) => {
        const existingIndex = prev.findIndex((h) => h.id === animalId);
        if (existingIndex >= 0) {
          return prev.slice(0, existingIndex + 1);
        }
        return [...prev, { id: animalId, name: target.name }];
      });
    },
    [animals]
  );

  // Toggle node collapse/expand
  const handleToggleCollapse = useCallback((nodeId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Quick parent assignment trigger
  const handleAssignParent = useCallback((nodeId: string) => {
    setCorrectionTargetId(rootAnimalId);
    setIsCorrectionOpen(true);
  }, [rootAnimalId]);

  // Click on relationship edge
  const handleEdgeClick = useCallback((edge: PedigreeGraphEdge) => {
    setSelectedNodeId(edge.source);
  }, []);

  // Apply Saved View Preset
  const handleApplySavedView = useCallback((view: SavedPedigreeView) => {
    setMode(view.mode);
    setOverlay(view.overlay);
    if (view.selectedTrait) setSelectedTraitCode(view.selectedTrait);
    setMaxGenerations(view.generationDepth);
    setDensity(view.density);
    setDirection(view.direction);
  }, []);

  // Build graph dynamically
  const { graphData, analyticsData } = useMemo(() => {
    return buildPedigreeGraph(rootAnimalId, animals, parentages, {
      mode,
      maxGenerations,
      overlay,
      selectedTraitCode,
      density,
      direction,
      searchQuery,
      collapsedIds,
    });
  }, [
    rootAnimalId,
    animals,
    parentages,
    mode,
    maxGenerations,
    overlay,
    selectedTraitCode,
    density,
    direction,
    searchQuery,
    collapsedIds,
  ]);

  if (!rootAnimal) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
        <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-stone-900">Breeding Animal Not Found</h3>
        <p className="text-xs text-stone-500 mt-1">
          Unable to locate animal ID: {initialAnimalId}
        </p>
      </div>
    );
  }

  const selectedNodeData = selectedNodeId
    ? graphData.nodes.find((n) => n.id === selectedNodeId)?.data || null
    : null;
  const selectedAnimal = selectedNodeId
    ? animals.find((a) => a.id === selectedNodeId)
    : undefined;
  const selectedParentage = selectedNodeId
    ? parentages[selectedNodeId]
    : undefined;

  return (
    <div
      className={`space-y-5 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-stone-100 p-4 overflow-y-auto' : ''
      }`}
    >
      {/* 1. Master Header Card */}
      <PedigreeHeader
        rootAnimal={rootAnimal}
        originalRootId={initialAnimalId}
        historyTrail={historyTrail}
        graphData={graphData}
        onSelectRootFromHistory={handleMakeRoot}
        onOpenMateCheck={() => setIsMateCheckOpen(true)}
        onOpenRelationshipCompare={() => setIsRelationshipCompareOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenSavedViews={() => setIsSavedViewsOpen(true)}
      />

      {/* 2. Interactive Toolbar */}
      <PedigreeToolbar
        mode={mode}
        onChangeMode={setMode}
        maxGenerations={maxGenerations}
        onChangeGenerations={setMaxGenerations}
        overlay={overlay}
        onChangeOverlay={setOverlay}
        selectedTraitCode={selectedTraitCode}
        onChangeTraitCode={setSelectedTraitCode}
        selectedConditionCode={selectedConditionCode}
        onChangeConditionCode={setSelectedConditionCode}
        density={density}
        onChangeDensity={setDensity}
        direction={direction}
        onChangeDirection={setDirection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onZoomIn={() => setZoomLevel((z) => Math.min(z * 1.2, 2.2))}
        onZoomOut={() => setZoomLevel((z) => Math.max(z * 0.82, 0.25))}
        onFitView={() => {
          setZoomLevel(0.85);
          setPanOffset({ x: 140, y: 120 });
        }}
        onResetZoom={() => {
          setZoomLevel(1.0);
          setPanOffset({ x: 100, y: 100 });
        }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((f) => !f)}
      />

      {/* 3. Canvas Engine Switcher & Main Canvas (Desktop & Tablet) */}
      <div className="hidden md:block space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
            <button
              onClick={() => setCanvasEngine('reactflow')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                canvasEngine === 'reactflow'
                  ? 'bg-white text-emerald-800 shadow-xs border border-stone-200/60'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              React Flow Engine (@xyflow/react)
            </button>
            <button
              onClick={() => setCanvasEngine('native')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                canvasEngine === 'native'
                  ? 'bg-white text-emerald-800 shadow-xs border border-stone-200/60'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Native High-Performance Canvas
            </button>
          </div>

          <span className="text-[11px] font-mono text-stone-400">
            {graphData.nodes.length} ancestors & progeny plotted
          </span>
        </div>

        {canvasEngine === 'reactflow' ? (
          <ReactFlowPedigreeCanvas
            graphData={graphData}
            overlay={overlay}
            density={density}
            direction={direction}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onMakeRoot={handleMakeRoot}
            onToggleCollapse={handleToggleCollapse}
            onAssignParent={handleAssignParent}
            onEdgeClick={handleEdgeClick}
          />
        ) : (
          <PedigreeCanvas
            graphData={graphData}
            overlay={overlay}
            density={density}
            direction={direction}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onMakeRoot={handleMakeRoot}
            onToggleCollapse={handleToggleCollapse}
            onAssignParent={handleAssignParent}
            onEdgeClick={handleEdgeClick}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            panOffset={panOffset}
            setPanOffset={setPanOffset}
          />
        )}
      </div>

      {/* 4. Mobile Hierarchical Tree Fallback */}
      <PedigreeMobileTree
        graphData={graphData}
        overlay={overlay}
        onSelectNode={setSelectedNodeId}
        onMakeRoot={handleMakeRoot}
        onAssignParent={handleAssignParent}
      />

      {/* 5. Slide-Over Inspector Drawer */}
      {selectedNodeData && (
        <PedigreeInspector
          nodeData={selectedNodeData}
          animal={selectedAnimal}
          parentage={selectedParentage}
          allAnimals={animals}
          onClose={() => setSelectedNodeId(null)}
          onMakeRoot={handleMakeRoot}
          onOpenCorrection={(id) => {
            setCorrectionTargetId(id);
            setIsCorrectionOpen(true);
          }}
        />
      )}

      {/* 6. Analytics Drawer */}
      <PedigreeAnalyticsDrawer
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        analyticsData={analyticsData}
        animalName={rootAnimal.name}
      />

      {/* 7. Potential Mate Compatibility Dialog */}
      <MateCheckDialog
        isOpen={isMateCheckOpen}
        onClose={() => setIsMateCheckOpen(false)}
        rootAnimal={rootAnimal}
        allAnimals={animals}
        parentages={parentages}
      />

      {/* 8. Relationship / Kinship Compare Dialog */}
      <RelationshipCompareDialog
        isOpen={isRelationshipCompareOpen}
        onClose={() => setIsRelationshipCompareOpen(false)}
        rootAnimal={rootAnimal}
        allAnimals={animals}
        parentages={parentages}
      />

      {/* 9. Parentage Correction / Assignment Dialog */}
      <CorrectionDialog
        isOpen={isCorrectionOpen}
        onClose={() => setIsCorrectionOpen(false)}
        targetAnimalId={correctionTargetId}
        allAnimals={animals}
        currentParentage={parentages[correctionTargetId]}
      />

      {/* 10. Official Export & Certificate Dialog */}
      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        rootAnimal={rootAnimal}
        graphData={graphData}
      />

      {/* 11. Saved Views Presets Dialog */}
      <SavedViewDialog
        isOpen={isSavedViewsOpen}
        onClose={() => setIsSavedViewsOpen(false)}
        currentConfig={{
          mode,
          overlay,
          selectedTrait: selectedTraitCode,
          generationDepth: maxGenerations,
          density,
          direction,
        }}
        onApplyView={handleApplySavedView}
      />
    </div>
  );
}
