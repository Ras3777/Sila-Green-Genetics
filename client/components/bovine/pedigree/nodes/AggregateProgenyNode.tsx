'use client';

import React from 'react';
import { Users, ChevronRight, Sparkles } from 'lucide-react';
import { PedigreeNodeData, PedigreeDensity } from '@/lib/bovine-pedigree-types';

interface AggregateProgenyNodeProps {
  data: PedigreeNodeData;
  density: PedigreeDensity;
  onExpandProgeny: (nodeId: string) => void;
}

export default function AggregateProgenyNode({
  data,
  density,
  onExpandProgeny,
}: AggregateProgenyNodeProps) {
  const count = data.progenyCount || 6;

  return (
    <div
      onClick={() => onExpandProgeny(data.id)}
      className="w-full h-full bg-emerald-50/60 hover:bg-emerald-50 rounded-2xl border border-emerald-300/80 p-3 flex flex-col justify-between cursor-pointer transition-all shadow-2xs hover:shadow-xs"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center space-x-1 text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
          <Users className="w-2.5 h-2.5 mr-0.5" />
          Progeny Cluster
        </span>
        <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200/60 px-1.5 py-0.2 rounded-md">
          +{count}
        </span>
      </div>

      <div className="my-1">
        <div className="font-bold text-stone-900 text-xs truncate">
          Registered Offspring
        </div>
        <div className="text-[10px] text-stone-500">
          Evaluated sons & daughters
        </div>
      </div>

      <div className="pt-1.5 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-800 font-semibold">
        <span>Expand Progeny Tree</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
