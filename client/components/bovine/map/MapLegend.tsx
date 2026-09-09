'use client';

import React, { useState } from 'react';
import { useBovineMap } from '@/lib/bovine-map-store';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Activity,
  ShieldAlert,
  Radio,
  MapPin,
  TrendingUp,
  Award,
  CircleDot,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

export function MapLegend() {
  const { overlay, layers } = useBovineMap();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-xl rounded-2xl p-3.5 max-w-xs w-full text-xs transition-all">
      {/* Legend Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Layers className="w-3 h-3" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 tracking-tight leading-none">Map Legend</h4>
            <span className="text-[10px] text-stone-500 font-medium">
              Mode: {overlay.replace('_', ' ')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          title={isCollapsed ? 'Expand Legend' : 'Collapse Legend'}
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="pt-2.5 space-y-3">
          {/* Active Overlay Specific Scale */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
              <span>Active Metric Scale</span>
              <span className="text-[10px] text-emerald-800 font-bold">{overlay}</span>
            </div>

            {overlay === 'POPULATION' && (
              <div className="space-y-1 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-600">Herd Volume (Head)</span>
                  <span className="text-[10px] font-semibold text-stone-800">Relative Size</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[10px] text-stone-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-700"></div>
                    <span>&lt; 50</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-700"></div>
                    <span>50 - 200</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-700"></div>
                    <span>&gt; 200</span>
                  </div>
                </div>
              </div>
            )}

            {overlay === 'VACCINATION' && (
              <div className="space-y-1.5 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-stone-500">&lt; 70% (Non-compliant)</span>
                  <span className="text-stone-500">&gt; 90% (Protected)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500"></div>
                <div className="flex justify-between text-[9px] text-stone-400 font-medium">
                  <span>Critical Gap</span>
                  <span>Adequate</span>
                  <span>Herd Immunity</span>
                </div>
              </div>
            )}

            {overlay === 'GENOTYPE_COVERAGE' && (
              <div className="space-y-1.5 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-stone-500">0% Genotyped</span>
                  <span className="text-purple-700 font-semibold">100% Genomic</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-stone-200 via-purple-300 to-purple-700"></div>
                <div className="flex justify-between text-[9px] text-stone-400 font-medium">
                  <span>Pedigree Only</span>
                  <span>50k SNP Chip</span>
                  <span>Full Genomic BV</span>
                </div>
              </div>
            )}

            {overlay === 'COMPLIANCE' && (
              <div className="space-y-1 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <div className="flex items-center justify-between text-[10px] py-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-stone-700">Compliant (&ge; 95%)</span>
                  </div>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="flex items-center justify-between text-[10px] py-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-stone-700">Pending Review (85-94%)</span>
                  </div>
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                </div>
                <div className="flex items-center justify-between text-[10px] py-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <span className="text-stone-700">Non-Compliant (&lt; 85%)</span>
                  </div>
                  <ShieldAlert className="w-3 h-3 text-red-500" />
                </div>
              </div>
            )}

            {overlay === 'RISK_SCORE' && (
              <div className="space-y-1.5 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-emerald-700 font-medium">0 (Low Risk)</span>
                  <span className="text-red-700 font-bold">100 (Critical)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-600"></div>
                <div className="flex justify-between text-[9px] text-stone-400">
                  <span>Certified Clean</span>
                  <span>Monitored</span>
                  <span>Quarantine Vector</span>
                </div>
              </div>
            )}

            {overlay === 'HEALTH_STATUS' && (
              <div className="space-y-1 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <div className="flex items-center justify-between text-[10px] py-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-stone-700">Normal / Healthy</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800">Clear</span>
                </div>
                <div className="flex items-center justify-between text-[10px] py-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-stone-700">Under Observation</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700">Watch</span>
                </div>
                <div className="flex items-center justify-between text-[10px] py-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></div>
                    <span className="text-stone-700 font-semibold">Active Quarantine</span>
                  </div>
                  <span className="text-[10px] font-bold text-red-700">Lockdown</span>
                </div>
              </div>
            )}

            {overlay === 'BREEDING_STOCK' && (
              <div className="space-y-1 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-stone-600">Elite Sire / Dam Count</span>
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-100 via-blue-400 to-blue-800"></div>
                <div className="flex justify-between text-[9px] text-stone-400">
                  <span>&lt; 5 Head</span>
                  <span>10 - 25 Head</span>
                  <span>&gt; 25 Nucleus</span>
                </div>
              </div>
            )}

            {overlay === 'EXPECTED_CALVINGS' && (
              <div className="space-y-1 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-stone-600">Calvings Due Next 30d</span>
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-amber-100 via-amber-400 to-amber-700"></div>
                <div className="flex justify-between text-[9px] text-stone-400">
                  <span>Low</span>
                  <span>Moderate Workload</span>
                  <span>Peak Batch</span>
                </div>
              </div>
            )}
          </div>

          {/* Spatial Layer Symbols */}
          <div className="space-y-2 pt-2 border-t border-stone-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Layer Symbols
            </span>

            {/* Location Confidence taxonomy */}
            <div className="space-y-1 text-[10px] text-stone-600">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300"></div>
                <span className="font-medium text-stone-800">GPS Sensor (Live GNSS fix)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-300"></div>
                <span className="font-medium text-stone-800">RFID Paddock (Antenna gate)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-400"></div>
                <span className="font-medium text-stone-800">Event-Derived (Last inspection)</span>
              </div>
            </div>

            {/* Surveillance Buffers */}
            {layers.surveillanceBuffers && (
              <div className="space-y-1 pt-1 text-[10px] text-stone-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-red-600 border-t border-red-600"></div>
                  <span>5 km Core Ring Vaccination</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-amber-500 border-t border-amber-500"></div>
                  <span>10 km Movement Restriction Buffer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-500 border-t border-blue-500"></div>
                  <span>25 km Surveillance Perimeter</span>
                </div>
              </div>
            )}

            {/* Boundaries & Paddocks */}
            {layers.farmBoundaries && (
              <div className="flex items-center gap-2 text-[10px] text-stone-600">
                <div className="w-3 h-2 border border-emerald-600 bg-emerald-500/20 rounded-xs"></div>
                <span>Farm Perimeter & Internal Paddocks</span>
              </div>
            )}

            {/* Movements */}
            {layers.movements && (
              <div className="flex items-center gap-2 text-[10px] text-stone-600">
                <div className="w-4 border-b-2 border-dashed border-emerald-600"></div>
                <span>Active Movement Corridor</span>
              </div>
            )}
          </div>

          {/* Data Freshness Indicator */}
          <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between text-[10px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
              <span className="font-semibold text-emerald-800">Telemetry Live</span>
            </div>
            <span>Sub-minute sync</span>
          </div>
        </div>
      )}
    </div>
  );
}
