'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  NodeProps,
  EdgeProps,
  getBezierPath,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

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
import { layoutWithElk, layoutWithDagre, LayoutEngine } from '@/lib/bovine-pedigree-layout';
import { Sparkles, Layers, Cpu } from 'lucide-react';

interface ReactFlowPedigreeCanvasProps {
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
}

// Custom Node Wrappers with Connection Handles
function FlowAnimalNodeWrapper({ data }: any) {
  const nodeData = data.nodeData as any;
  const direction = (data.direction as PedigreeLayoutDirection) || 'LR';

  return (
    <div className="relative">
      <Handle
        type="target"
        position={direction === 'LR' ? Position.Left : Position.Top}
        className="!bg-stone-400 !w-2 !h-2 !border-2 !border-white"
      />
      <PedigreeAnimalNode
        data={nodeData}
        overlay={data.overlay}
        density={data.density}
        onSelect={data.onSelectNode}
        onMakeRoot={data.onMakeRoot}
        onToggleCollapse={data.onToggleCollapse}
        onAssignParent={data.onAssignParent}
      />
      <Handle
        type="source"
        position={direction === 'LR' ? Position.Right : Position.Bottom}
        className="!bg-stone-400 !w-2 !h-2 !border-2 !border-white"
      />
    </div>
  );
}

function FlowExternalNodeWrapper({ data }: any) {
  const nodeData = data.nodeData as any;
  const direction = (data.direction as PedigreeLayoutDirection) || 'LR';

  return (
    <div className="relative">
      <Handle
        type="target"
        position={direction === 'LR' ? Position.Left : Position.Top}
        className="!bg-stone-400 !w-2 !h-2 !border-2 !border-white"
      />
      <ExternalAncestorNode
        data={nodeData}
        density={data.density}
        onSelect={data.onSelectNode}
        onMakeRoot={data.onMakeRoot}
      />
      <Handle
        type="source"
        position={direction === 'LR' ? Position.Right : Position.Bottom}
        className="!bg-stone-400 !w-2 !h-2 !border-2 !border-white"
      />
    </div>
  );
}

function FlowUnknownNodeWrapper({ data }: any) {
  const nodeData = data.nodeData as any;
  const direction = (data.direction as PedigreeLayoutDirection) || 'LR';

  return (
    <div className="relative">
      <Handle
        type="target"
        position={direction === 'LR' ? Position.Left : Position.Top}
        className="!bg-stone-300 !w-2 !h-2 !border-2 !border-white"
      />
      <UnknownAncestorNode
        data={nodeData}
        density={data.density}
        onAssignParent={data.onAssignParent}
      />
      <Handle
        type="source"
        position={direction === 'LR' ? Position.Right : Position.Bottom}
        className="!bg-stone-300 !w-2 !h-2 !border-2 !border-white"
      />
    </div>
  );
}

function FlowProgenyNodeWrapper({ data }: any) {
  const nodeData = data.nodeData as any;
  const direction = (data.direction as PedigreeLayoutDirection) || 'LR';

  return (
    <div className="relative">
      <Handle
        type="target"
        position={direction === 'LR' ? Position.Left : Position.Top}
        className="!bg-stone-400 !w-2 !h-2 !border-2 !border-white"
      />
      <AggregateProgenyNode
        data={nodeData}
        density={data.density}
        onExpandProgeny={data.onToggleCollapse}
      />
      <Handle
        type="source"
        position={direction === 'LR' ? Position.Right : Position.Bottom}
        className="!bg-stone-400 !w-2 !h-2 !border-2 !border-white"
      />
    </div>
  );
}

// Custom Relationship Edge Component
function FlowRelationshipEdgeWrapper({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: any) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data?.edgeData as PedigreeGraphEdge | undefined;
  const verification = edgeData?.data?.status || 'RECORDED';

  let strokeColor = '#94a3b8'; // stone-400
  let strokeDasharray: string | undefined = undefined;
  let strokeWidth = 2;

  if (verification === 'VERIFIED') {
    strokeColor = '#059669'; // emerald-600
    strokeWidth = 2.5;
  } else if (verification === 'DISPUTED' || verification === 'EXCLUDED') {
    strokeColor = '#dc2626'; // red-600
    strokeDasharray = '5 4';
  } else if (verification === 'RECORDED') {
    strokeColor = '#d97706'; // amber-600
    strokeDasharray = '4 4';
  }

  const relType = edgeData?.data?.relationshipType;

  return (
    <g>
      <path
        id={id}
        className="react-flow__edge-path transition-all hover:stroke-emerald-600"
        d={edgePath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        fill="none"
      />
      {relType && (
        <foreignObject
          width={64}
          height={20}
          x={labelX - 32}
          y={labelY - 10}
          className="pointer-events-none"
        >
          <div className="flex items-center justify-center">
            <span className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-stone-600 shadow-2xs border border-stone-200">
              {relType === 'SIRE' ? 'Sire' : 'Dam'}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

const nodeTypes: any = {
  pedigreeAnimal: FlowAnimalNodeWrapper,
  externalAncestor: FlowExternalNodeWrapper,
  unknownAncestor: FlowUnknownNodeWrapper,
  aggregateProgeny: FlowProgenyNodeWrapper,
};

const edgeTypes: any = {
  pedigreeRelationship: FlowRelationshipEdgeWrapper,
};

export default function ReactFlowPedigreeCanvas({
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
}: ReactFlowPedigreeCanvasProps) {
  const [layoutEngine, setLayoutEngine] = useState<LayoutEngine>('elk');
  const [isLayoutComputing, setIsLayoutComputing] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Compute Layout with ELK / Dagre
  useEffect(() => {
    let isCancelled = false;

    async function computeLayout() {
      setIsLayoutComputing(true);

      let positionedNodes: PedigreeGraphNode[];
      if (layoutEngine === 'elk') {
        positionedNodes = await layoutWithElk(graphData.nodes, graphData.edges, {
          density,
          direction,
        });
      } else {
        positionedNodes = layoutWithDagre(graphData.nodes, graphData.edges, {
          density,
          direction,
        });
      }

      if (isCancelled) return;

      // Transform into React Flow Node objects
      const rfNodes: Node[] = positionedNodes.map((pn) => ({
        id: pn.id,
        type: pn.type || 'pedigreeAnimal',
        position: { x: pn.x, y: pn.y },
        data: {
          nodeData: {
            ...pn.data,
            isSelected: pn.id === selectedNodeId,
          },
          overlay,
          density,
          direction,
          onSelectNode,
          onMakeRoot,
          onToggleCollapse,
          onAssignParent,
        },
      }));

      // Transform into React Flow Edge objects
      const rfEdges: Edge[] = graphData.edges.map((pe) => ({
        id: pe.id,
        source: pe.source,
        target: pe.target,
        type: 'pedigreeRelationship',
        data: {
          edgeData: pe,
        },
      }));

      setNodes(rfNodes);
      setEdges(rfEdges);
      setIsLayoutComputing(false);
    }

    computeLayout();

    return () => {
      isCancelled = true;
    };
  }, [
    graphData,
    layoutEngine,
    density,
    direction,
    overlay,
    selectedNodeId,
    onSelectNode,
    onMakeRoot,
    onToggleCollapse,
    onAssignParent,
    setNodes,
    setEdges,
  ]);

  return (
    <div className="relative w-full h-[720px] rounded-3xl border border-stone-200/90 bg-stone-50/50 shadow-2xs overflow-hidden">
      {/* Engine Switcher Header Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-2xl border border-stone-200 bg-white/95 px-3 py-1.5 shadow-xs backdrop-blur-xs">
        <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-emerald-700" />
          Engine:
        </span>
        <button
          onClick={() => setLayoutEngine('elk')}
          className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${
            layoutEngine === 'elk'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          ELK.js Layered
        </button>
        <button
          onClick={() => setLayoutEngine('dagre')}
          className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${
            layoutEngine === 'dagre'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Dagre
        </button>
        {isLayoutComputing && (
          <span className="text-[10px] text-amber-600 font-mono animate-pulse ml-1">
            Computing...
          </span>
        )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        onEdgeClick={(_, edge) => {
          if (onEdgeClick && edge.data?.edgeData) {
            onEdgeClick(edge.data.edgeData as PedigreeGraphEdge);
          }
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2.2}
        className="bovine-reactflow-canvas"
      >
        <Background gap={20} size={1.2} color="#cbd5e1" />
        <Controls
          showInteractive={false}
          className="!bg-white !border !border-stone-200 !shadow-sm !rounded-2xl overflow-hidden"
        />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(n) => {
            const sex = (n.data?.nodeData as any)?.sex;
            const isRoot = (n.data?.nodeData as any)?.isRoot;
            if (isRoot) return '#059669';
            if (sex === 'MALE') return '#3b82f6';
            if (sex === 'FEMALE') return '#a855f7';
            return '#94a3b8';
          }}
          className="!bg-white/95 !border !border-stone-200 !rounded-2xl !shadow-xs !overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
}
