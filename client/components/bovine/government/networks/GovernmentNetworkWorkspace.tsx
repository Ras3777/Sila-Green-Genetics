'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from '@dagrejs/dagre';
import {
  Building2,
  ShieldAlert,
  SearchCheck,
  Network,
  Truck,
  Layers,
  ArrowRight,
  Info,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import Link from 'next/link';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';

export type NetworkMode = 'MOVEMENT' | 'CONTACT' | 'EVIDENCE' | 'HIERARCHY';

// Custom Node Components
function FarmNode({ data }: { data: any }) {
  const isQuarantined = data.quarantineActive;
  const isHighRisk = data.riskScore >= 40;

  return (
    <div
      className={`min-w-44 p-3 rounded-2xl border bg-white shadow-md transition-all cursor-pointer ${
        isQuarantined
          ? 'border-rose-500 ring-2 ring-rose-300'
          : isHighRisk
          ? 'border-amber-400 ring-1 ring-amber-200'
          : 'border-stone-200 hover:border-emerald-600'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-stone-400 !w-2.5 !h-2.5 !border-2 !border-white" />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-stone-500">{data.code}</span>
        {isQuarantined ? (
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
            Q-ZONE
          </span>
        ) : (
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${
            isHighRisk ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
          }`}>
            Risk {data.riskScore}
          </span>
        )}
      </div>

      <h4 className="font-bold text-xs text-stone-900 mt-1 leading-snug truncate">
        {data.name}
      </h4>
      <p className="text-[10px] text-stone-600 truncate mt-0.5">
        {data.region} • {data.animalCount?.toLocaleString() || 450} cattle
      </p>

      <Handle type="source" position={Position.Right} className="!bg-emerald-600 !w-2.5 !h-2.5 !border-2 !border-white" />
    </div>
  );
}

function DiseaseNode({ data }: { data: any }) {
  return (
    <div className="min-w-48 p-3 rounded-2xl border-2 border-rose-600 bg-rose-50 shadow-lg text-rose-950">
      <Handle type="target" position={Position.Top} className="!bg-rose-600 !w-2.5 !h-2.5 !border-2 !border-white" />
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono">
          {data.confirmedStatus}
        </span>
        <span className="text-[10px] font-mono font-bold text-rose-700">{data.code}</span>
      </div>
      <h4 className="font-bold text-xs text-rose-950 mt-1 leading-snug">
        {data.diseaseName}
      </h4>
      <p className="text-[10px] text-rose-800 mt-0.5">
        Index: {data.farmName} ({data.regionName})
      </p>
      <div className="mt-1 text-[9px] font-semibold text-rose-700">
        Infected: {data.animalsAffected} head • Ring: 10km radius
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-rose-600 !w-2.5 !h-2.5 !border-2 !border-white" />
    </div>
  );
}

function EvidenceNode({ data }: { data: any }) {
  return (
    <div className="min-w-44 p-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 shadow-sm">
      <Handle type="target" position={Position.Left} className="!bg-indigo-400 !w-2.5 !h-2.5 !border-2 !border-white" />
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono font-bold bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded">
          {data.relation}
        </span>
        <span className="text-[9px] font-bold text-indigo-700">Rel: {data.relevanceScore}%</span>
      </div>
      <h4 className="font-bold text-xs text-stone-900 mt-1 leading-snug truncate">
        {data.label}
      </h4>
      <p className="text-[10px] text-stone-600 line-clamp-2 mt-0.5">
        {data.description}
      </p>
      <Handle type="source" position={Position.Right} className="!bg-indigo-600 !w-2.5 !h-2.5 !border-2 !border-white" />
    </div>
  );
}

function OfficeNode({ data }: { data: any }) {
  return (
    <div className="min-w-44 p-3 rounded-2xl border border-stone-300 bg-stone-900 text-white shadow-md">
      <Handle type="target" position={Position.Top} className="!bg-emerald-400 !w-2.5 !h-2.5 !border-2 !border-stone-900" />
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono font-bold bg-emerald-700 px-1.5 py-0.5 rounded text-white">
          {data.level}
        </span>
        <span className="text-[10px] text-stone-400 font-mono">{data.code}</span>
      </div>
      <h4 className="font-bold text-xs text-white mt-1 leading-snug">
        {data.name}
      </h4>
      <p className="text-[10px] text-stone-300 mt-0.5">
        Lead: {data.leadOfficialName}
      </p>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !w-2.5 !h-2.5 !border-2 !border-stone-900" />
    </div>
  );
}

const nodeTypes = {
  farmNode: FarmNode,
  diseaseNode: DiseaseNode,
  evidenceNode: EvidenceNode,
  officeNode: OfficeNode,
};

// Dagre Layout Algorithm Helper
function layoutElements(nodes: Node[], edges: Edge[], direction = 'LR') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 70, nodesep: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 190, height: 90 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 95,
        y: nodeWithPosition.y - 45,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export function GovernmentNetworkWorkspace({
  initialMode = 'MOVEMENT',
  height = '560px',
}: {
  initialMode?: NetworkMode;
  height?: string;
}) {
  const [mode, setMode] = useState<NetworkMode>(initialMode);
  const [selectedElement, setSelectedElement] = useState<any | null>(null);

  const {
    jurisdictions,
    diseaseEvents,
    investigations,
  } = useGovernment();

  const { farms } = useBovine();

  // Generate Graph elements based on active mode
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (mode === 'MOVEMENT') {
      const rawNodes: Node[] = farms.slice(0, 8).map((f) => ({
        id: f.id,
        type: 'farmNode',
        data: {
          code: f.code,
          name: f.name,
          region: f.region,
          animalCount: 450,
          riskScore: f.code === 'FARM-ET-003' ? 45 : 12,
          quarantineActive: f.code === 'FARM-ET-003',
        },
        position: { x: 0, y: 0 },
      }));

      const rawEdges: Edge[] = [
        {
          id: 'e1-2',
          source: farms[0]?.id || 'f1',
          target: farms[1]?.id || 'f2',
          label: '28 Heifers (Permit Approved)',
          animated: false,
          style: { stroke: '#047857', strokeWidth: 2 },
        },
        {
          id: 'e1-3',
          source: farms[0]?.id || 'f1',
          target: farms[2]?.id || 'f3',
          label: '14 Bulls (Quarantine Transit)',
          animated: true,
          style: { stroke: '#dc2626', strokeWidth: 2.5 },
        },
        {
          id: 'e2-4',
          source: farms[1]?.id || 'f2',
          target: farms[3]?.id || 'f4',
          label: '50 Feeder Calves',
          animated: false,
          style: { stroke: '#0284c7', strokeWidth: 2 },
        },
        {
          id: 'e3-5',
          source: farms[2]?.id || 'f3',
          target: farms[4]?.id || 'f5',
          label: '8 Elite Sires',
          animated: false,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        },
      ];

      return layoutElements(rawNodes, rawEdges, 'LR');
    }

    if (mode === 'CONTACT') {
      const event = diseaseEvents[0] || {
        id: 'dev-001',
        code: 'DE-2026-FMD-01',
        diseaseName: 'Foot and Mouth Disease (Serotype O)',
        confirmedStatus: 'CONFIRMED',
        farmName: 'Bishoftu Apex Nucleus Farm',
        regionName: 'Tigray',
        animalsAffected: 24,
      };

      const rawNodes: Node[] = [
        {
          id: 'index-event',
          type: 'diseaseNode',
          data: { ...event } as Record<string, unknown>,
          position: { x: 0, y: 0 },
        },
        ...farms.slice(0, 5).map((f, i) => ({
          id: `farm-${f.id}`,
          type: 'farmNode',
          data: {
            code: f.code,
            name: f.name,
            region: f.region,
            animalCount: 380,
            riskScore: i === 0 ? 85 : 30 + i * 5,
            quarantineActive: i === 0 || i === 1,
          },
          position: { x: 0, y: 0 },
        })),
      ];

      const rawEdges: Edge[] = [
        {
          id: 'ec-1',
          source: 'index-event',
          target: `farm-${farms[0]?.id}`,
          label: 'Direct Contact / Ground Zero',
          animated: true,
          style: { stroke: '#dc2626', strokeWidth: 3 },
        },
        {
          id: 'ec-2',
          source: 'index-event',
          target: `farm-${farms[1]?.id}`,
          label: 'Downstream Shipment (48h prior)',
          animated: true,
          style: { stroke: '#ea580c', strokeWidth: 2 },
        },
        {
          id: 'ec-3',
          source: `farm-${farms[1]?.id}`,
          target: `farm-${farms[2]?.id}`,
          label: 'Secondary Contact (Shared Truck)',
          style: { stroke: '#d97706', strokeWidth: 2 },
        },
        {
          id: 'ec-4',
          source: `farm-${farms[0]?.id}`,
          target: `farm-${farms[3]?.id}`,
          label: 'Fenced Border (1.2km distance)',
          style: { stroke: '#4b5563', strokeDasharray: '4 4' },
        },
      ];

      return layoutElements(rawNodes, rawEdges, 'TB');
    }

    if (mode === 'EVIDENCE') {
      const targetCase = investigations[0] || {
        caseNumber: 'INV-2026-001',
        title: 'Mendelian Parentage Fraud Investigation',
        evidenceItems: [],
      };

      const rawNodes: Node[] = [
        {
          id: 'case-root',
          type: 'evidenceNode',
          data: {
            relation: 'PRIMARY_CASE',
            relevanceScore: 100,
            label: `${targetCase.caseNumber}: Case Dossier`,
            description: targetCase.title,
          },
          position: { x: 0, y: 0 },
        },
        {
          id: 'ev-1',
          type: 'evidenceNode',
          data: {
            relation: 'AUDIT_FINDING',
            relevanceScore: 95,
            label: 'Audit Finding CF-2026-001',
            description: 'Duplicate RFID tags attached to unverified commercial yearlings.',
          },
          position: { x: 0, y: 0 },
        },
        {
          id: 'ev-2',
          type: 'evidenceNode',
          data: {
            relation: 'LAB_ASSAY',
            relevanceScore: 92,
            label: '50K SNP Genotyping Assay',
            description: '14 alleles non-conforming to registered sire Boran Bull ET-091.',
          },
          position: { x: 0, y: 0 },
        },
        {
          id: 'ev-3',
          type: 'evidenceNode',
          data: {
            relation: 'TRANSIT_RECORD',
            relevanceScore: 84,
            label: 'Movement Manifest Breached',
            description: 'Night transit without pre-movement inspection certificate.',
          },
          position: { x: 0, y: 0 },
        },
      ];

      const rawEdges: Edge[] = [
        { id: 'ee-1', source: 'case-root', target: 'ev-1', label: 'Primary Charge', style: { stroke: '#6366f1', strokeWidth: 2 } },
        { id: 'ee-2', source: 'case-root', target: 'ev-2', label: 'Genomic Proof', style: { stroke: '#6366f1', strokeWidth: 2 } },
        { id: 'ee-3', source: 'ev-1', target: 'ev-3', label: 'Corroborating Transit', style: { stroke: '#64748b', strokeDasharray: '4 4' } },
      ];

      return layoutElements(rawNodes, rawEdges, 'LR');
    }

    // HIERARCHY
    const rawNodes: Node[] = jurisdictions.slice(0, 6).map((j) => ({
      id: j.id,
      type: 'officeNode',
      data: { ...j } as Record<string, unknown>,
      position: { x: 0, y: 0 },
    }));

    const rawEdges: Edge[] = [
      { id: 'eh-1', source: jurisdictions[0]?.id || 'jur-1', target: jurisdictions[1]?.id || 'jur-2', label: 'Supervises' },
      { id: 'eh-2', source: jurisdictions[0]?.id || 'jur-1', target: jurisdictions[2]?.id || 'jur-3', label: 'Supervises' },
      { id: 'eh-3', source: jurisdictions[1]?.id || 'jur-2', target: jurisdictions[3]?.id || 'jur-4', label: 'Delegates' },
      { id: 'eh-4', source: jurisdictions[1]?.id || 'jur-2', target: jurisdictions[4]?.id || 'jur-5', label: 'Delegates' },
    ];

    return layoutElements(rawNodes, rawEdges, 'TB');
  }, [mode, farms, diseaseEvents, investigations, jurisdictions]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedElement(node);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col">
      {/* Network Toolbar */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-bold">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              Institutional Graph & Network Intelligence
            </h3>
            <p className="text-xs text-stone-600">
              Interactive topological mapping across movements, biosecurity contacts, and investigation evidence.
            </p>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-white border border-stone-200 rounded-xl text-xs overflow-x-auto">
          {[
            { key: 'MOVEMENT' as const, label: 'Movements', icon: Truck },
            { key: 'CONTACT' as const, label: 'Contact Tracing', icon: ShieldAlert },
            { key: 'EVIDENCE' as const, label: 'Evidence Graph', icon: SearchCheck },
            { key: 'HIERARCHY' as const, label: 'Authority Tree', icon: Building2 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setMode(tab.key);
                setSelectedElement(null);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                mode === tab.key
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full" style={{ height }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#cbd5e1" gap={16} size={1} />
          <Controls position="bottom-right" />
          <MiniMap
            position="top-right"
            nodeColor={(node) => {
              if (node.type === 'diseaseNode') return '#dc2626';
              if (node.type === 'evidenceNode') return '#6366f1';
              if (node.type === 'officeNode') return '#0f172a';
              return '#059669';
            }}
            className="!bg-white !border !border-stone-200 !rounded-xl !shadow-md"
          />
        </ReactFlow>

        {/* Node Detail Slide-over Panel */}
        {selectedElement && (
          <div className="absolute top-4 left-4 z-20 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl p-4 animate-in fade-in slide-in-from-left-2 duration-150">
            <div className="flex items-start justify-between pb-2 border-b border-stone-100">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {selectedElement.type}
              </span>
              <button
                onClick={() => setSelectedElement(null)}
                className="p-1 hover:bg-stone-100 rounded text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 text-sm">
                {selectedElement.data.name || selectedElement.data.label || selectedElement.data.diseaseName}
              </h4>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                {selectedElement.data.description || `Registered entity code: ${selectedElement.data.code}`}
              </p>

              {selectedElement.data.region && (
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-stone-500">Region Scope:</span>
                  <span className="font-semibold text-stone-800">{selectedElement.data.region}</span>
                </div>
              )}
              {selectedElement.data.animalCount !== undefined && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-500">Registered Cattle:</span>
                  <span className="font-mono font-bold text-stone-800">
                    {selectedElement.data.animalCount.toLocaleString()}
                  </span>
                </div>
              )}
              {selectedElement.data.quarantineActive && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-[11px]">
                  Active Quarantine Zone Declared
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <Link
                href={
                  selectedElement.type === 'farmNode'
                    ? `/bovine/government/farms/${selectedElement.id}`
                    : selectedElement.type === 'diseaseNode'
                    ? '/bovine/government/health'
                    : selectedElement.type === 'evidenceNode'
                    ? '/bovine/government/investigations'
                    : '/bovine/government/institutional'
                }
                className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
              >
                <span>View Complete File</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Network Footer Legend */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/50 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block" />
            <span>Compliant / Low Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500 inline-block" />
            <span>Special Surveillance</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-600 inline-block" />
            <span>Quarantine Declared</span>
          </div>
        </div>
        <span className="text-[11px]">Powered by @xyflow/react &amp; Dagre Directed Topology</span>
      </div>
    </div>
  );
}
