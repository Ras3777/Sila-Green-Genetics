'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, HelpCircle } from 'lucide-react';
import { PedigreeGraphEdge, PedigreeLayoutDirection } from '@/lib/bovine-pedigree-types';

interface PedigreeRelationshipEdgeProps {
  edge: PedigreeGraphEdge;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  direction: PedigreeLayoutDirection;
  onEdgeClick?: (edge: PedigreeGraphEdge) => void;
}

export default function PedigreeRelationshipEdge({
  edge,
  sourceX,
  sourceY,
  targetX,
  targetY,
  direction,
  onEdgeClick,
}: PedigreeRelationshipEdgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const status = edge.data.status;
  const isHighlighted = edge.data.isHighlighted || isHovered;

  // Calculate smooth cubic bezier path
  let pathD = '';
  let midX = (sourceX + targetX) / 2;
  let midY = (sourceY + targetY) / 2;

  if (direction === 'LR') {
    // Horizontal flow: source is left/right of target
    const deltaX = Math.abs(targetX - sourceX) * 0.55;
    pathD = `M ${sourceX} ${sourceY} C ${sourceX + deltaX} ${sourceY}, ${targetX - deltaX} ${targetY}, ${targetX} ${targetY}`;
  } else {
    // Vertical flow: source is above/below target
    const deltaY = Math.abs(targetY - sourceY) * 0.55;
    pathD = `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + deltaY}, ${targetX} ${targetY - deltaY}, ${targetX} ${targetY}`;
  }

  // Stroke styling based on verification status
  let strokeColor = '#a8a29e'; // stone-400
  let strokeWidth = 1.5;
  let strokeDasharray = undefined;

  if (status === 'VERIFIED') {
    strokeColor = isHighlighted ? '#059669' : '#10b981'; // emerald-600 / emerald-500
    strokeWidth = isHighlighted ? 2.5 : 2;
  } else if (status === 'PROPOSED') {
    strokeColor = '#f59e0b'; // amber-500
    strokeWidth = 2;
    strokeDasharray = '5,5';
  } else if (status === 'DISPUTED') {
    strokeColor = '#ef4444'; // red-500
    strokeWidth = 2;
    strokeDasharray = '3,3';
  } else if (status === 'EXCLUDED') {
    strokeColor = '#dc2626'; // red-600
    strokeWidth = 2;
    strokeDasharray = '8,4';
  }

  if (isHighlighted) {
    strokeWidth = Math.max(strokeWidth + 1, 2.5);
  }

  return (
    <g
      className="transition-all duration-200 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdgeClick && onEdgeClick(edge)}
    >
      {/* Invisible wider stroke for easier hover interaction */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        strokeLinecap="round"
      />

      {/* Main Visible Connector Edge */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        className="transition-colors duration-200"
      />

      {/* Edge Midpoint Badge */}
      <foreignObject
        x={midX - 44}
        y={midY - 12}
        width={88}
        height={24}
        className="overflow-visible pointer-events-auto"
      >
        <div
          title={`${edge.data.relationshipType}: ${status} (${edge.data.method || 'Herdbook'})`}
          className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center justify-center space-x-1 shadow-2xs border transition-all ${
            status === 'VERIFIED'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : status === 'PROPOSED'
              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              : status === 'DISPUTED'
              ? 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          } ${isHighlighted ? 'scale-110 shadow-xs' : ''}`}
        >
          {status === 'VERIFIED' ? (
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
          ) : status === 'DISPUTED' ? (
            <AlertTriangle className="w-2.5 h-2.5 text-red-600 shrink-0" />
          ) : (
            <FileText className="w-2.5 h-2.5 text-stone-500 shrink-0" />
          )}
          <span className="truncate max-w-[55px]">
            {edge.data.relationshipType === 'SIRE' ? 'Sire' : 'Dam'}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}
