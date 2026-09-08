'use client';

import React from 'react';
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  Dna,
  TrendingUp,
  Tag,
  ShoppingBag,
  ExternalLink,
  Crown,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { PedigreeNodeData, PedigreeOverlay, PedigreeDensity } from '@/lib/bovine-pedigree-types';

interface PedigreeAnimalNodeProps {
  data: PedigreeNodeData;
  overlay: PedigreeOverlay;
  density: PedigreeDensity;
  onSelect: (nodeId: string) => void;
  onMakeRoot: (animalId: string) => void;
  onToggleCollapse: (nodeId: string) => void;
  onAssignParent?: (nodeId: string) => void;
}

export default function PedigreeAnimalNode({
  data,
  overlay,
  density,
  onSelect,
  onMakeRoot,
  onToggleCollapse,
}: PedigreeAnimalNodeProps) {
  const isSire = data.sex === 'MALE';
  const isDam = data.sex === 'FEMALE';
  const isRoot = data.isRoot;

  // Header and accent colors
  const accentBorder = isRoot
    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
    : isSire
    ? 'border-l-4 border-l-blue-600'
    : 'border-l-4 border-l-purple-600';

  const roleBadgeColor = isRoot
    ? 'bg-emerald-100 text-emerald-800'
    : isSire
    ? 'bg-blue-50 text-blue-700'
    : 'bg-purple-50 text-purple-700';

  const roleLabel = isRoot
    ? 'Root Subject'
    : data.generation === 1
    ? isSire
      ? 'Sire'
      : 'Dam'
    : data.generation === 2
    ? isSire
      ? 'Paternal Grandsire'
      : 'Granddam'
    : data.generation === -1
    ? 'Progeny'
    : `Gen ${data.generation}`;

  // Selection / Highlight ring
  const highlightRing = data.isSelected
    ? 'ring-2 ring-emerald-600 shadow-md scale-[1.02]'
    : data.matchesSearch
    ? 'ring-2 ring-amber-500 shadow-md animate-pulse'
    : data.isPathHighlighted
    ? 'ring-2 ring-emerald-500/80 shadow-xs'
    : 'hover:border-stone-400 hover:shadow-xs';

  // Minimal Density Mode
  if (density === 'minimal') {
    return (
      <div
        onClick={() => onSelect(data.id)}
        className={`w-full h-full bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-2.5 flex items-center justify-between cursor-pointer transition-all ${accentBorder} ${highlightRing}`}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0 ${
              isSire ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}
          >
            {isSire ? '♂' : '♀'}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-stone-900 text-xs truncate">{data.name}</div>
            <div className="text-[10px] text-stone-500 font-mono truncate">
              {data.primaryIdentifier || data.internalId}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          {data.isCommonAncestor && (
            <span title="Common Ancestor contributing to inbreeding" className="text-amber-600">
              <Crown className="w-3.5 h-3.5" />
            </span>
          )}
          {data.hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse(data.id);
              }}
              className="w-5 h-5 rounded-md bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 text-xs"
            >
              {data.isCollapsed ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Compact Density Mode
  if (density === 'compact') {
    return (
      <div
        onClick={() => onSelect(data.id)}
        className={`w-full h-full bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-3 flex flex-col justify-between cursor-pointer transition-all ${accentBorder} ${highlightRing}`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${roleBadgeColor}`}>
            {roleLabel}
          </span>
          <div className="flex items-center space-x-1.5">
            {data.isCommonAncestor && (
              <span className="flex items-center text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                <Crown className="w-2.5 h-2.5 mr-1" />
                CA
              </span>
            )}
            {data.parentageStatus === 'VERIFIED' && (
              <span title="DNA Verified" className="text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
            {!isRoot && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMakeRoot(data.animalId);
                }}
                title="Make Root Focus"
                className="text-[10px] font-semibold text-stone-400 hover:text-emerald-800"
              >
                Root ↗
              </button>
            )}
          </div>
        </div>

        {/* Main info */}
        <div className="my-1">
          <div className="font-bold text-stone-900 text-xs truncate">{data.name}</div>
          <div className="text-[10px] text-stone-500 font-mono truncate">
            {data.primaryIdentifier || data.internalId} • {data.breed}
          </div>
        </div>

        {/* Compact Overlay Indicator */}
        <div className="pt-1 border-t border-stone-100 flex items-center justify-between text-[10px]">
          {renderCompactOverlay(data, overlay)}
          {data.hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse(data.id);
              }}
              className="w-5 h-5 rounded-md bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 text-xs"
            >
              {data.isCollapsed ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Detailed Density Mode
  return (
    <div
      onClick={() => onSelect(data.id)}
      className={`w-full h-full bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-3.5 flex flex-col justify-between cursor-pointer transition-all ${accentBorder} ${highlightRing}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center space-x-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadgeColor}`}>
            {roleLabel}
          </span>
          {data.isFounder && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-bold">
              Founder
            </span>
          )}
          {data.isCommonAncestor && (
            <span className="px-1.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-800 text-[9px] font-bold flex items-center">
              <Crown className="w-2.5 h-2.5 mr-1" />
              Common Ancestor
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {!isRoot && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMakeRoot(data.animalId);
              }}
              title="Set as graph root focal point"
              className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-emerald-800 hover:text-white text-[10px] font-bold text-stone-600 transition-colors"
            >
              Make Root
            </button>
          )}
          {data.hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse(data.id);
              }}
              className="w-5 h-5 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 text-xs"
            >
              {data.isCollapsed ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Center Animal Identity */}
      <div className="flex items-center space-x-3 my-1.5">
        {data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt={data.name}
            className="w-11 h-11 rounded-2xl object-cover border border-stone-200 shrink-0"
          />
        ) : (
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
              isSire ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}
          >
            {isSire ? '♂' : '♀'}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="font-bold text-stone-900 text-xs truncate">{data.name}</div>
          <div className="text-[11px] font-mono text-stone-600 truncate">
            {data.primaryIdentifier || data.internalId}
          </div>
          <div className="text-[10px] text-stone-400 truncate">
            {data.breed} {data.birthDate ? `• ${data.birthDate}` : ''}
          </div>
        </div>
      </div>

      {/* Dynamic Overlay Box */}
      <div className="pt-2 border-t border-stone-100">
        {renderDetailedOverlay(data, overlay)}
      </div>
    </div>
  );
}

// Render Compact Overlay Data
function renderCompactOverlay(data: PedigreeNodeData, overlay: PedigreeOverlay) {
  switch (overlay) {
    case 'parentage':
      return (
        <span
          className={`font-semibold ${
            data.parentageStatus === 'VERIFIED'
              ? 'text-emerald-700'
              : data.parentageStatus === 'DISPUTED'
              ? 'text-red-700'
              : 'text-stone-600'
          }`}
        >
          {data.parentageStatus}
        </span>
      );

    case 'genetics':
      return data.selectedTraitValue ? (
        <span className="font-semibold text-emerald-800 font-mono">
          {data.selectedTraitValue.traitCode}: {data.selectedTraitValue.value > 0 ? '+' : ''}
          {data.selectedTraitValue.value} {data.selectedTraitValue.unit}
        </span>
      ) : (
        <span className="text-stone-400">No EPD</span>
      );

    case 'conditions':
      const carrier = data.conditions?.find((c) => c.status === 'CARRIER');
      return carrier ? (
        <span className="text-amber-700 font-bold">Carrier: {carrier.conditionCode}</span>
      ) : (
        <span className="text-emerald-700 font-semibold">Clean / Free</span>
      );

    case 'inbreeding':
      return (
        <span className="font-mono text-purple-800 font-semibold">
          F: {data.inbreedingF ? `${(data.inbreedingF * 100).toFixed(2)}%` : '0.0%'}
        </span>
      );

    case 'marketplace':
      return data.marketplaceListing?.price ? (
        <span className="font-bold text-stone-900 font-mono">
          ${data.marketplaceListing.price.toLocaleString()}
        </span>
      ) : (
        <span className="text-stone-400">Not Listed</span>
      );

    case 'dataQuality':
      return data.dataQualityFlags && data.dataQualityFlags.length > 0 ? (
        <span className="text-amber-700 font-bold flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {data.dataQualityFlags.length} Flags
        </span>
      ) : (
        <span className="text-emerald-700 font-semibold">Clean Data</span>
      );

    default:
      return <span className="text-stone-500">{data.registrationNumber || 'Registered'}</span>;
  }
}

// Render Detailed Overlay Data
function renderDetailedOverlay(data: PedigreeNodeData, overlay: PedigreeOverlay) {
  switch (overlay) {
    case 'parentage':
      return (
        <div className="flex items-center justify-between text-[11px] bg-stone-50 p-2 rounded-xl">
          <div className="flex items-center space-x-1.5">
            {data.parentageStatus === 'VERIFIED' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            ) : data.parentageStatus === 'DISPUTED' ? (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            ) : (
              <FileCheck className="w-4 h-4 text-stone-500" />
            )}
            <span
              className={`font-bold ${
                data.parentageStatus === 'VERIFIED'
                  ? 'text-emerald-800'
                  : data.parentageStatus === 'DISPUTED'
                  ? 'text-red-800'
                  : 'text-stone-800'
              }`}
            >
              {data.parentageStatus}
            </span>
          </div>
          <span className="text-stone-500 text-[10px] truncate max-w-[130px]" title={data.verificationMethod}>
            {data.verificationMethod || 'Herd Record'}
          </span>
        </div>
      );

    case 'genetics':
      return (
        <div className="bg-emerald-50/70 p-2 rounded-xl text-[11px]">
          {data.selectedTraitValue ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-emerald-900 font-bold">{data.selectedTraitValue.traitName}</span>
                <span className="font-mono font-bold text-emerald-950">
                  {data.selectedTraitValue.value > 0 ? '+' : ''}
                  {data.selectedTraitValue.value} {data.selectedTraitValue.unit}
                </span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-emerald-700">
                <span>Acc: {data.selectedTraitValue.accuracy || 94}%</span>
                <span>Top {data.selectedTraitValue.percentile || 5}% Breed</span>
              </div>
            </div>
          ) : (
            <div className="text-stone-400 italic text-center">No trait estimate loaded</div>
          )}
        </div>
      );

    case 'performance':
      return (
        <div className="grid grid-cols-3 gap-1 text-center bg-stone-50 p-1.5 rounded-xl text-[10px]">
          <div>
            <div className="text-stone-400 text-[9px]">Birth</div>
            <div className="font-bold text-stone-800">{data.actualWeights?.birthKg || 39}kg</div>
          </div>
          <div>
            <div className="text-stone-400 text-[9px]">Weaning</div>
            <div className="font-bold text-stone-800">{data.actualWeights?.weaningKg || 245}kg</div>
          </div>
          <div>
            <div className="text-stone-400 text-[9px]">Yearling</div>
            <div className="font-bold text-stone-800">{data.actualWeights?.yearlingKg || 480}kg</div>
          </div>
        </div>
      );

    case 'conditions':
      return (
        <div className="flex flex-wrap gap-1 bg-stone-50 p-1.5 rounded-xl">
          {data.conditions && data.conditions.length > 0 ? (
            data.conditions.slice(0, 3).map((c) => (
              <span
                key={c.conditionCode}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  c.status === 'CARRIER'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : c.status === 'AFFECTED'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {c.conditionCode}: {c.status}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-emerald-700 font-semibold px-1">All Conditions: Free (SNP Tested)</span>
          )}
        </div>
      );

    case 'inbreeding':
      return (
        <div className="bg-purple-50/70 p-2 rounded-xl text-[11px] flex justify-between items-center">
          <div>
            <span className="text-purple-900 font-bold">Individual F:</span>
            <span className="font-mono font-bold text-purple-950 ml-1.5">
              {data.inbreedingF ? `${(data.inbreedingF * 100).toFixed(2)}%` : '2.75%'}
            </span>
          </div>
          {data.ancestralContribution && (
            <span className="text-[10px] text-purple-700">
              Contribution: {(data.ancestralContribution * 100).toFixed(1)}%
            </span>
          )}
        </div>
      );

    case 'marketplace':
      return (
        <div className="bg-stone-50 p-2 rounded-xl text-[11px] flex justify-between items-center">
          {data.marketplaceListing ? (
            <>
              <div>
                <span className="font-bold text-stone-900 font-mono">
                  ${data.marketplaceListing.price?.toLocaleString() || '18,500'}
                </span>
                <span className="text-[9px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded ml-1.5 font-bold">
                  ACTIVE
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">
                {data.marketplaceListing.semenStraws || 250} straws
              </span>
            </>
          ) : (
            <span className="text-stone-400 italic text-[10px]">Private Herd Stock (Not Listed)</span>
          )}
        </div>
      );

    case 'dataQuality':
      const flags = data.dataQualityFlags || [];
      return (
        <div className="bg-stone-50 p-1.5 rounded-xl text-[10px]">
          {flags.length > 0 ? (
            <div className="flex items-center space-x-1.5 text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span className="font-semibold truncate">{flags[0].title}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">All integrity checks passed</span>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-between text-[10px] text-stone-500 bg-stone-50 p-1.5 rounded-xl">
          <span>Reg: {data.registrationNumber || 'Official'}</span>
          <span>Status: {data.lifeStatus || 'ALIVE'}</span>
        </div>
      );
  }
}
