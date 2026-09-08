'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PedigreeGraphData,
  PedigreeGraphNode,
  PedigreeGraphEdge,
  PedigreeOverlay,
  PedigreeDensity,
  PedigreeLayoutDirection,
} from '@/lib/bovine-pedigree-types';
import PedigreeAnimalNode from './nodes/PedigreeAnimalNode';
import ExternalAncestorNode from './nodes/ExternalAncestorNode';
import UnknownAncestorNode from './nodes/UnknownAncestorNode';
import AggregateProgenyNode from './nodes/AggregateProgenyNode';
import PedigreeRelationshipEdge from './edges/PedigreeRelationshipEdge';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PedigreeCanvasProps {
  graphData: PedigreeGraphData;
  overlay: PedigreeOverlay;
  density: PedigreeDensity;
  direction: PedigreeLayoutDirection;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onMakeRoot: (animalId: string) => void;
  onToggleCollapse: (nodeId: string) => void;
  onAssignParent: (nodeId: string) => void;
  onEdgeClick?: (edge: PedigreeGraphEdge) => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  panOffset: { x: number; y: number };
  setPanOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

export default function PedigreeCanvas({
  graphData,
  overlay,
  density,
  direction,
  selectedNodeId,
  onSelectNode,
  onMakeRoot,
  onToggleCollapse,
  onAssignParent,
  onEdgeClick,
  zoomLevel,
  setZoomLevel,
  panOffset,
  setPanOffset,
}: PedigreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Fit to view calculation
  const handleFitView = useCallback(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    graphData.nodes.forEach((n) => {
      if (n.x < minX) minX = n.x;
      if (n.x + n.width > maxX) maxX = n.x + n.width;
      if (n.y < minY) minY = n.y;
      if (n.y + n.height > maxY) maxY = n.y + n.height;
    });

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;

    if (graphWidth === 0 || graphHeight === 0) return;

    const padding = 80;
    const scaleX = (containerWidth - padding * 2) / graphWidth;
    const scaleY = (containerHeight - padding * 2) / graphHeight;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.35), 1.25);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoomLevel(newZoom);
    setPanOffset({
      x: containerWidth / 2 - centerX * newZoom,
      y: containerHeight / 2 - centerY * newZoom,
    });
  }, [graphData.nodes, setZoomLevel, setPanOffset]);

  // Center on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitView();
    }, 150);
    return () => clearTimeout(timer);
  }, [handleFitView]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newZoom = Math.min(Math.max(zoomLevel * zoomFactor, 0.25), 2.2);

    // Zoom centered around mouse pointer
    const newPanX = mouseX - (mouseX - panOffset.x) * (newZoom / zoomLevel);
    const newPanY = mouseY - (mouseY - panOffset.y) * (newZoom / zoomLevel);

    setZoomLevel(newZoom);
    setPanOffset({ x: newPanX, y: newPanY });
  };

  // Pan dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Map of nodes for quick edge coordinate calculation
  const nodeMap = new Map<string, PedigreeGraphNode>();
  graphData.nodes.forEach((n) => nodeMap.set(n.id, n));

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-[640px] lg:h-[720px] bg-stone-50/70 rounded-3xl border border-stone-200/80 overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-inner"
      style={{
        backgroundImage:
          'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px',
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
      }}
    >
      {/* Zoom Level Indicator & Canvas Legend */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-stone-200/80 shadow-xs text-xs">
        <span className="font-mono font-bold text-stone-700">
          {Math.round(zoomLevel * 100)}%
        </span>
        <span className="text-stone-300">|</span>
        <div className="flex items-center space-x-3 text-[11px] text-stone-600">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>Sire</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
            <span>Dam</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Root</span>
          </span>
        </div>
      </div>

      {/* Main Transform Container for Pan & Zoom */}
      <div
        className="absolute origin-top-left transition-transform duration-75 will-change-transform pointer-events-none"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          width: '5000px',
          height: '5000px',
        }}
      >
        {/* SVG Connector Edges Layer */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-auto"
          style={{ width: '5000px', height: '5000px' }}
        >
          {graphData.edges.map((edge) => {
            const sourceNode = nodeMap.get(edge.source);
            const targetNode = nodeMap.get(edge.target);
            if (!sourceNode || !targetNode) return null;

            let sX = 0;
            let sY = 0;
            let tX = 0;
            let tY = 0;

            if (direction === 'LR') {
              // Horizontal: source connects from right edge to target's left edge
              if (sourceNode.x < targetNode.x) {
                sX = sourceNode.x + sourceNode.width;
                sY = sourceNode.y + sourceNode.height / 2;
                tX = targetNode.x;
                tY = targetNode.y + targetNode.height / 2;
              } else {
                sX = sourceNode.x;
                sY = sourceNode.y + sourceNode.height / 2;
                tX = targetNode.x + targetNode.width;
                tY = targetNode.y + targetNode.height / 2;
              }
            } else {
              // Vertical: source connects from bottom edge to target's top edge
              sX = sourceNode.x + sourceNode.width / 2;
              sY = sourceNode.y + sourceNode.height;
              tX = targetNode.x + targetNode.width / 2;
              tY = targetNode.y;
            }

            return (
              <PedigreeRelationshipEdge
                key={edge.id}
                edge={edge}
                sourceX={sX}
                sourceY={sY}
                targetX={tX}
                targetY={tY}
                direction={direction}
                onEdgeClick={onEdgeClick}
              />
            );
          })}
        </svg>

        {/* HTML Custom Nodes Layer */}
        {graphData.nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const nodeData = {
            ...node.data,
            isSelected,
          };

          return (
            <div
              key={node.id}
              className="absolute pointer-events-auto transition-transform duration-100"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.width}px`,
                height: `${node.height}px`,
              }}
            >
              {node.type === 'externalAncestor' ? (
                <ExternalAncestorNode
                  data={nodeData}
                  density={density}
                  onSelect={onSelectNode}
                  onMakeRoot={onMakeRoot}
                />
              ) : node.type === 'unknownAncestor' ? (
                <UnknownAncestorNode
                  data={nodeData}
                  density={density}
                  onAssignParent={onAssignParent}
                />
              ) : node.type === 'aggregateProgeny' ? (
                <AggregateProgenyNode
                  data={nodeData}
                  density={density}
                  onExpandProgeny={onMakeRoot}
                />
              ) : (
                <PedigreeAnimalNode
                  data={nodeData}
                  overlay={overlay}
                  density={density}
                  onSelect={onSelectNode}
                  onMakeRoot={onMakeRoot}
                  onToggleCollapse={onToggleCollapse}
                  onAssignParent={onAssignParent}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Navigation Pad */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200/80 shadow-md">
        <button
          type="button"
          onClick={() => {
            setZoomLevel((z) => Math.min(z * 1.2, 2.2));
          }}
          className="p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            setZoomLevel((z) => Math.max(z * 0.82, 0.25));
          }}
          className="p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-stone-200" />

        <button
          type="button"
          onClick={handleFitView}
          className="px-2.5 py-1.5 rounded-xl hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors"
          title="Fit Complete Tree into Screen"
        >
          Fit Tree
        </button>

        <button
          type="button"
          onClick={() => {
            const root = graphData.nodes.find((n) => n.data.isRoot);
            if (root && containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              setPanOffset({
                x: rect.width / 2 - (root.x + root.width / 2) * zoomLevel,
                y: rect.height / 2 - (root.y + root.height / 2) * zoomLevel,
              });
            }
          }}
          className="p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors"
          title="Center on Root Subject"
        >
          <Crosshair className="w-4 h-4 text-emerald-800" />
        </button>
      </div>

      {/* Interactive Minimap */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:block w-44 h-32 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-md p-2 overflow-hidden">
        <div className="text-[9px] uppercase font-bold text-stone-400 tracking-wider mb-1 flex items-center justify-between">
          <span>Minimap</span>
          <Compass className="w-3 h-3 text-stone-400" />
        </div>
        <div className="relative w-full h-[88px] bg-stone-100/80 rounded-xl overflow-hidden">
          {graphData.nodes.map((n) => (
            <div
              key={`mini-${n.id}`}
              className={`absolute rounded-xs ${
                n.data.isRoot
                  ? 'bg-emerald-600'
                  : n.data.sex === 'MALE'
                  ? 'bg-blue-500'
                  : 'bg-purple-500'
              }`}
              style={{
                left: `${Math.min(Math.max((n.x / 3000) * 100, 2), 92)}%`,
                top: `${Math.min(Math.max((n.y / 2000) * 100, 2), 92)}%`,
                width: '6px',
                height: '4px',
              }}
            />
          ))}
          {/* Viewport Indicator */}
          <div
            className="absolute border border-emerald-600 bg-emerald-500/15 rounded-xs pointer-events-none"
            style={{
              left: `${Math.min(Math.max((-panOffset.x / 3000) * 100, 0), 80)}%`,
              top: `${Math.min(Math.max((-panOffset.y / 2000) * 100, 0), 75)}%`,
              width: '32px',
              height: '24px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
