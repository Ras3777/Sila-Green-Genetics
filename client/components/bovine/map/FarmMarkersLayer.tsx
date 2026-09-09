'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useBovineMap } from '@/lib/bovine-map-store';
import { Farm } from '@/lib/bovine-types';
import { Building2, ShieldCheck, AlertTriangle, ArrowRight, ExternalLink, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function FarmMarkersLayer() {
  const {
    filteredFarms,
    overlay,
    selectedEntity,
    setSelectedEntity,
    flyTo,
  } = useBovineMap();

  const createFarmIcon = (farm: Farm, isSelected: boolean) => {
    let metricText = `${farm.headCount}`;
    let metricSub = 'head';
    let ringColor = '#059669'; // default emerald
    let badgeBg = 'bg-emerald-800';

    if (overlay === 'POPULATION') {
      metricText = `${farm.headCount}`;
      metricSub = 'head';
      ringColor = '#059669';
      badgeBg = 'bg-emerald-900';
    } else if (overlay === 'VACCINATION') {
      // Mock realistic farm vaccination from environment or head
      const rate = farm.sickCount > 0 ? 88 : 96;
      metricText = `${rate}%`;
      metricSub = 'vax';
      ringColor = rate >= 90 ? '#059669' : '#f59e0b';
      badgeBg = rate >= 90 ? 'bg-emerald-800' : 'bg-amber-700';
    } else if (overlay === 'GENOTYPE_COVERAGE') {
      const gRate = farm.type === 'GENOMIC_HUB' ? 92 : farm.type === 'SEEDSTOCK' ? 78 : 45;
      metricText = `${gRate}%`;
      metricSub = 'genotyped';
      ringColor = '#7c3aed';
      badgeBg = 'bg-purple-900';
    } else if (overlay === 'COMPLIANCE') {
      const compliant = farm.sickCount === 0;
      metricText = compliant ? 'COMPLIANT' : 'REVIEW';
      metricSub = '';
      ringColor = compliant ? '#059669' : '#eab308';
      badgeBg = compliant ? 'bg-emerald-800' : 'bg-amber-800';
    } else if (overlay === 'RISK_SCORE') {
      const risk = farm.sickCount > 1 ? 'HIGH' : farm.sickCount > 0 ? 'MED' : 'LOW';
      metricText = risk;
      metricSub = 'risk';
      ringColor = risk === 'LOW' ? '#059669' : risk === 'MED' ? '#f59e0b' : '#dc2626';
      badgeBg = risk === 'LOW' ? 'bg-emerald-900' : risk === 'MED' ? 'bg-amber-800' : 'bg-red-900';
    } else if (overlay === 'HEALTH_STATUS') {
      const healthy = farm.sickCount === 0;
      metricText = healthy ? 'NORMAL' : `${farm.sickCount} SICK`;
      metricSub = '';
      ringColor = healthy ? '#059669' : '#dc2626';
      badgeBg = healthy ? 'bg-emerald-900' : 'bg-red-800';
    } else if (overlay === 'BREEDING_STOCK') {
      const breeding = Math.round(farm.headCount * 0.45);
      metricText = `${breeding}`;
      metricSub = 'elite';
      ringColor = '#d97706';
      badgeBg = 'bg-amber-900';
    } else if (overlay === 'EXPECTED_CALVINGS') {
      metricText = `${farm.birthsThisMonth}`;
      metricSub = 'due 30d';
      ringColor = '#e11d48';
      badgeBg = 'bg-rose-900';
    }

    const html = `
      <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-lg border text-white font-sans text-xs transition-all duration-200 ${badgeBg} ${
      isSelected ? 'ring-4 ring-amber-400 scale-110 border-amber-300' : 'border-white/30 hover:scale-105'
    }" style="box-shadow: 0 4px 12px rgba(0,0,0,0.35);">
          <div class="w-2 h-2 rounded-full" style="background-color: ${ringColor}; box-shadow: 0 0 6px ${ringColor};"></div>
          <div class="flex flex-col leading-tight">
            <span class="font-bold tracking-tight text-[11px] whitespace-nowrap">${metricText}</span>
            ${metricSub ? `<span class="text-[8px] uppercase tracking-wider text-white/75 -mt-0.5">${metricSub}</span>` : ''}
          </div>
        </div>
        <!-- Pointer triangle -->
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] mx-auto -mt-0.5" style="border-t-color: ${
          isSelected ? '#d97706' : ringColor
        };"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-bovine-farm-marker',
      iconSize: [60, 36],
      iconAnchor: [30, 36],
      popupAnchor: [0, -36],
    });
  };

  return (
    <>
      {filteredFarms.map((farm) => {
        const isSelected = selectedEntity?.id === farm.id;
        const icon = createFarmIcon(farm, isSelected);

        return (
          <Marker
            key={farm.id}
            position={[farm.latitude, farm.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => {
                setSelectedEntity({ type: 'FARM', id: farm.id, data: farm });
                flyTo([farm.latitude, farm.longitude], 13);
              },
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-3 font-sans text-xs max-w-xs space-y-2.5">
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2">
                  <div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      {farm.code}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm mt-1 leading-snug">
                      {farm.name}
                    </h3>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {farm.district}, {farm.region} • {farm.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                    <span className="text-[10px] text-stone-400 font-mono uppercase block">Live Population</span>
                    <span className="font-bold text-stone-900 font-mono text-sm">{farm.headCount} Head</span>
                    <span className="text-[9px] text-stone-500 block">{farm.herdCount} Herds</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                    <span className="text-[10px] text-stone-400 font-mono uppercase block">Health Status</span>
                    <span className={`font-bold font-mono text-xs ${farm.sickCount > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                      {farm.sickCount > 0 ? `${farm.sickCount} Active Cases` : 'All Normal'}
                    </span>
                    <span className="text-[9px] text-stone-500 block">Biosecure</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setSelectedEntity({ type: 'FARM', id: farm.id, data: farm });
                    }}
                    className="w-full py-1.5 rounded-lg bg-emerald-800 text-white font-semibold text-[11px] flex items-center justify-center gap-1 hover:bg-emerald-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Open Inspector</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <Link
                    href={`/bovine/farms/${farm.id}`}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
                    title="Farm Profile"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
