'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Crown,
  Dna,
  ExternalLink,
  Plus,
  HelpCircle,
} from 'lucide-react';
import {
  PedigreeGraphData,
  PedigreeNodeData,
  PedigreeOverlay,
} from '@/lib/bovine-pedigree-types';

interface PedigreeMobileTreeProps {
  graphData: PedigreeGraphData;
  overlay: PedigreeOverlay;
  onSelectNode: (nodeId: string) => void;
  onMakeRoot: (animalId: string) => void;
  onAssignParent: (nodeId: string) => void;
}

export default function PedigreeMobileTree({
  graphData,
  overlay,
  onSelectNode,
  onMakeRoot,
  onAssignParent,
}: PedigreeMobileTreeProps) {
  // Group nodes by generation
  const [expandedGens, setExpandedGens] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
  });

  const toggleGen = (g: number) => {
    setExpandedGens((prev) => ({ ...prev, [g]: !prev[g] }));
  };

  const genLevels = [0, 1, 2, 3, 4, 5];

  return (
    <div className="md:hidden space-y-4">
      <div className="p-3 bg-stone-100/80 rounded-2xl text-xs text-stone-600 flex items-center justify-between">
        <span>Mobile Lineage Tree View</span>
        <span className="font-bold text-stone-900">{graphData.nodes.length} Lineage Nodes</span>
      </div>

      {genLevels.map((g) => {
        const nodesInGen = graphData.nodes
          .map((n) => n.data)
          .filter((d) => Math.abs(d.generation) === g);

        if (nodesInGen.length === 0) return null;

        const label =
          g === 0
            ? 'Root Subject'
            : g === 1
            ? 'Generation 1: Sire & Dam'
            : g === 2
            ? 'Generation 2: Grandparents (4)'
            : g === 3
            ? 'Generation 3: Great-Grandparents (8)'
            : `Generation ${g}`;

        const isExpanded = expandedGens[g] ?? false;

        return (
          <div
            key={g}
            className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleGen(g)}
              className="w-full p-4 bg-stone-50/80 flex items-center justify-between font-bold text-stone-900 text-xs text-left"
            >
              <span>{label}</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px]">
                  {nodesInGen.length}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-stone-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="p-3 space-y-2.5 divide-y divide-stone-100">
                {nodesInGen.map((node) => {
                  const isSire = node.sex === 'MALE';

                  if (node.nodeType === 'unknownAncestor') {
                    return (
                      <div
                        key={node.id}
                        className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-dashed border-stone-300"
                      >
                        <div className="flex items-center space-x-2 text-stone-500">
                          <HelpCircle className="w-4 h-4" />
                          <span className="font-bold">{node.name}</span>
                        </div>
                        <button
                          onClick={() => onAssignParent(node.id)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-emerald-800 font-bold text-[11px]"
                        >
                          + Assign
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={node.id}
                      onClick={() => onSelectNode(node.id)}
                      className="pt-2.5 flex items-center justify-between cursor-pointer first:pt-0"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            node.isRoot
                              ? 'bg-emerald-100 text-emerald-800'
                              : isSire
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {isSire ? '♂' : '♀'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-stone-900 text-xs truncate">
                            {node.name}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono truncate">
                            {node.primaryIdentifier || node.internalId} • {node.breed}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        {node.parentageStatus === 'VERIFIED' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        )}
                        {!node.isRoot && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMakeRoot(node.animalId);
                            }}
                            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-emerald-800 hover:text-white font-bold text-[10px] transition-colors"
                          >
                            Root ↗
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
