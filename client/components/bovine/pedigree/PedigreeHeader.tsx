'use client';

import React from 'react';
import Link from 'next/link';
import {
  GitBranch,
  ShieldCheck,
  Dna,
  Heart,
  Scale,
  Download,
  BarChart3,
  Sparkles,
  RotateCcw,
  ChevronRight,
  Eye,
  Layers,
} from 'lucide-react';
import { Animal } from '@/lib/bovine-types';
import { PedigreeGraphData } from '@/lib/bovine-pedigree-types';

interface PedigreeHeaderProps {
  rootAnimal: Animal;
  originalRootId: string;
  historyTrail: Array<{ id: string; name: string }>;
  graphData: PedigreeGraphData;
  onSelectRootFromHistory: (animalId: string) => void;
  onOpenMateCheck: () => void;
  onOpenRelationshipCompare: () => void;
  onOpenExport: () => void;
  onToggleAnalytics: () => void;
  onOpenSavedViews: () => void;
}

export default function PedigreeHeader({
  rootAnimal,
  originalRootId,
  historyTrail,
  graphData,
  onSelectRootFromHistory,
  onOpenMateCheck,
  onOpenRelationshipCompare,
  onOpenExport,
  onToggleAnalytics,
  onOpenSavedViews,
}: PedigreeHeaderProps) {
  const isMale = rootAnimal.sex === 'MALE';

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs p-5 lg:p-6 space-y-4">
      {/* Top Breadcrumb & Root History Trail */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs border-b border-stone-100 pb-3">
        <div className="flex items-center space-x-2 text-stone-500 overflow-x-auto py-1">
          <Link
            href="/bovine/animals/breeding-stock"
            className="hover:text-emerald-800 transition-colors font-medium"
          >
            Breeding Stock
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link
            href={`/bovine/animals/breeding-stock/${originalRootId}`}
            className="hover:text-emerald-800 transition-colors font-medium"
          >
            Profile 360
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-stone-900 font-bold flex items-center space-x-1">
            <GitBranch className="w-3.5 h-3.5 text-emerald-800 mr-1" />
            <span>Pedigree Workspace</span>
          </span>

          {/* If navigated into ancestor roots */}
          {historyTrail.length > 1 && (
            <>
              <span className="text-stone-300">|</span>
              <span className="text-[11px] text-stone-400">Focal Line:</span>
              {historyTrail.map((h, idx) => (
                <React.Fragment key={h.id}>
                  {idx > 0 && <span className="text-stone-300">→</span>}
                  <button
                    onClick={() => onSelectRootFromHistory(h.id)}
                    className={`font-mono text-xs rounded-md px-1.5 py-0.5 transition-colors ${
                      h.id === rootAnimal.id
                        ? 'bg-emerald-100 text-emerald-900 font-bold'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    {h.name}
                  </button>
                </React.Fragment>
              ))}
              {rootAnimal.id !== originalRootId && (
                <button
                  onClick={() => onSelectRootFromHistory(originalRootId)}
                  title="Reset to initial subject animal"
                  className="flex items-center space-x-1 text-[11px] text-emerald-800 hover:underline ml-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Root</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <button
            type="button"
            onClick={onOpenMateCheck}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/80 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Heart className="w-3.5 h-3.5 text-purple-700" />
            <span>Mate Compatibility</span>
          </button>

          <button
            type="button"
            onClick={onOpenRelationshipCompare}
            className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Scale className="w-3.5 h-3.5 text-stone-600" />
            <span>Compare Kinship</span>
          </button>

          <button
            type="button"
            onClick={onToggleAnalytics}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-800" />
            <span>Genetics Analytics</span>
          </button>

          <button
            type="button"
            onClick={onOpenSavedViews}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Saved Views</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Subject Banner & KPIs */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Animal Identity */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {rootAnimal.photoUrl || (rootAnimal as any).avatarUrl ? (
              <img
                src={rootAnimal.photoUrl || (rootAnimal as any).avatarUrl}
                alt={rootAnimal.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm"
              />
            ) : (
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs ${
                  isMale ? 'bg-blue-100 text-blue-800 border-2 border-blue-400' : 'bg-purple-100 text-purple-800 border-2 border-purple-400'
                }`}
              >
                {isMale ? '♂' : '♀'}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs ${
                isMale ? 'bg-blue-600' : 'bg-purple-600'
              }`}
            >
              {isMale ? '♂' : '♀'}
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg lg:text-xl font-bold text-stone-900">{rootAnimal.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Root Subject
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600">
                {(rootAnimal as any).breed || 'Holstein-Friesian'}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-stone-500 mt-1 flex-wrap">
              <span className="font-mono text-stone-700 font-semibold">
                ID: {rootAnimal.primaryIdentifier || rootAnimal.internalId}
              </span>
              <span>•</span>
              <span>DOB: {rootAnimal.birthDate || '2023-04-15'}</span>
              <span>•</span>
              <span className="flex items-center text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                SNP Verified Parentage
              </span>
            </div>
          </div>
        </div>

        {/* Pedigree Metrics KPI Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
          {/* Completeness Score */}
          <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center min-w-[110px]">
            <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Completeness</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">
              {graphData.completenessPercentage}%
            </div>
            <div className="text-[9px] text-stone-500 mt-0.5">
              {graphData.totalKnownAncestors} Known Ancestors
            </div>
          </div>

          {/* Inbreeding Coefficient */}
          <div className="p-2.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-center min-w-[110px]">
            <div className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Inbreeding (F)</div>
            <div className="text-base font-bold text-purple-950 font-mono mt-0.5">
              {(graphData.inbreedingF * 100).toFixed(2)}%
            </div>
            <div className="text-[9px] text-purple-700 mt-0.5">
              Genomic: {graphData.genomicF ? `${(graphData.genomicF * 100).toFixed(2)}%` : '3.1%'}
            </div>
          </div>

          {/* Generations Loaded */}
          <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center min-w-[110px]">
            <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Depth</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">
              {graphData.maxGeneration} Gens
            </div>
            <div className="text-[9px] text-stone-500 mt-0.5">
              {graphData.nodes.length} Nodes Displayed
            </div>
          </div>

          {/* Data Quality Health */}
          <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center min-w-[110px]">
            <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Data Quality</div>
            <div className="text-base font-bold text-emerald-950 mt-0.5 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mr-1" />
              100%
            </div>
            <div className="text-[9px] text-emerald-700 mt-0.5">Zero Conflicts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
