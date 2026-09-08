'use client';

import React from 'react';
import { HelpCircle, Plus, AlertCircle } from 'lucide-react';
import { PedigreeNodeData, PedigreeDensity } from '@/lib/bovine-pedigree-types';

interface UnknownAncestorNodeProps {
  data: PedigreeNodeData;
  density: PedigreeDensity;
  onAssignParent: (nodeId: string) => void;
}

export default function UnknownAncestorNode({
  data,
  density,
  onAssignParent,
}: UnknownAncestorNodeProps) {
  const isSire = data.branchRole === 'SIRE';

  return (
    <div className="w-full h-full bg-stone-50/50 rounded-2xl border-2 border-dashed border-stone-300/80 p-3 flex flex-col justify-between items-center text-center transition-all hover:border-amber-400/80 hover:bg-amber-50/20">
      <div className="flex items-center justify-center space-x-1 text-stone-400">
        <HelpCircle className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {isSire ? 'Unrecorded Sire' : 'Unrecorded Dam'}
        </span>
      </div>

      <div className="my-1">
        <div className="text-xs font-semibold text-stone-600">
          Missing Parent Lineage
        </div>
        <div className="text-[10px] text-stone-400">
          Generation {data.generation}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAssignParent(data.id)}
        className="w-full py-1 rounded-xl bg-white border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 text-[10px] font-bold flex items-center justify-center space-x-1 shadow-2xs transition-colors"
      >
        <Plus className="w-3 h-3 text-emerald-700" />
        <span>Assign Parent</span>
      </button>
    </div>
  );
}
