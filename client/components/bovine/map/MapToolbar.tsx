'use client';

import React from 'react';
import { useBovineMap } from '@/lib/bovine-map-store';
import { MapOverlayMode } from '@/lib/bovine-map-types';
import {
  Users,
  ShieldCheck,
  Dna,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Award,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface OverlayOption {
  key: MapOverlayMode;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  activeClass: string;
}

const OVERLAY_OPTIONS: OverlayOption[] = [
  {
    key: 'POPULATION',
    label: 'Population',
    sublabel: 'Head count',
    icon: Users,
    activeClass: 'bg-emerald-800 text-white shadow-xs',
  },
  {
    key: 'VACCINATION',
    label: 'Vaccination',
    sublabel: '% Immunized',
    icon: ShieldCheck,
    activeClass: 'bg-emerald-800 text-white shadow-xs',
  },
  {
    key: 'GENOTYPE_COVERAGE',
    label: 'Genotyped',
    sublabel: 'SNP coverage',
    icon: Dna,
    activeClass: 'bg-purple-900 text-white shadow-xs',
  },
  {
    key: 'COMPLIANCE',
    label: 'Compliance',
    sublabel: 'Audit state',
    icon: CheckCircle2,
    activeClass: 'bg-sky-900 text-white shadow-xs',
  },
  {
    key: 'RISK_SCORE',
    label: 'Farm Risk',
    sublabel: 'Biosecurity tier',
    icon: AlertTriangle,
    activeClass: 'bg-amber-800 text-white shadow-xs',
  },
  {
    key: 'HEALTH_STATUS',
    label: 'Health & Quarantines',
    sublabel: 'Active cases',
    icon: HeartPulse,
    activeClass: 'bg-red-800 text-white shadow-xs',
  },
  {
    key: 'BREEDING_STOCK',
    label: 'Breeding Stock',
    sublabel: 'Elite nucleus',
    icon: Award,
    activeClass: 'bg-amber-900 text-white shadow-xs',
  },
  {
    key: 'EXPECTED_CALVINGS',
    label: 'Calvings Due',
    sublabel: 'Next 30 days',
    icon: Calendar,
    activeClass: 'bg-rose-900 text-white shadow-xs',
  },
];

export function MapToolbar() {
  const { overlay, setOverlay } = useBovineMap();

  return (
    <div className="bg-white/95 backdrop-blur-xs border-b border-stone-200/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs shadow-2xs">
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono mr-1.5 shrink-0">
        Marker Metric:
      </span>

      <div className="flex items-center space-x-1.5 min-w-max">
        {OVERLAY_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = overlay === opt.key;

          return (
            <button
              key={opt.key}
              onClick={() => setOverlay(opt.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                isActive
                  ? `${opt.activeClass} font-bold ring-1 ring-white/20`
                  : 'bg-stone-100/80 hover:bg-stone-200/70 text-stone-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-normal ${
                  isActive ? 'bg-white/20 text-white' : 'text-stone-500'
                }`}
              >
                {opt.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
