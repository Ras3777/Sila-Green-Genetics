'use client';

import React from 'react';
import { Globe, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { PedigreeNodeData, PedigreeDensity } from '@/lib/bovine-pedigree-types';

interface ExternalAncestorNodeProps {
  data: PedigreeNodeData;
  density: PedigreeDensity;
  onSelect: (nodeId: string) => void;
  onMakeRoot: (animalId: string) => void;
}

export default function ExternalAncestorNode({
  data,
  density,
  onSelect,
  onMakeRoot,
}: ExternalAncestorNodeProps) {
  const isSire = data.sex === 'MALE';

  return (
    <div
      onClick={() => onSelect(data.id)}
      className="w-full h-full bg-stone-50/80 rounded-2xl border-2 border-dashed border-stone-300 hover:border-stone-400 p-3 flex flex-col justify-between cursor-pointer transition-all hover:shadow-xs"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center space-x-1 text-[9px] font-bold uppercase tracking-wider text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded-full">
          <Globe className="w-2.5 h-2.5 mr-0.5" />
          External AI Sire / Dam
        </span>
        <span className="text-[10px] text-emerald-700 font-semibold flex items-center">
          <ShieldCheck className="w-3 h-3 mr-0.5" />
          NAAB
        </span>
      </div>

      <div className="my-1">
        <div className="font-bold text-stone-900 text-xs truncate flex items-center justify-between">
          <span className="truncate">{data.name}</span>
          <span className={`text-[10px] ml-1 font-bold ${isSire ? 'text-blue-700' : 'text-purple-700'}`}>
            {isSire ? '♂' : '♀'}
          </span>
        </div>
        <div className="text-[10px] font-mono text-stone-500 truncate">
          {data.primaryIdentifier || 'INT-CAN-12189047'}
        </div>
      </div>

      <div className="pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
        <span className="truncate">International Registry</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMakeRoot(data.animalId);
          }}
          className="text-emerald-800 font-semibold hover:underline flex items-center"
        >
          Explore ↗
        </button>
      </div>
    </div>
  );
}
