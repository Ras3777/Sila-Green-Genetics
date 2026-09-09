'use client';

import React, { useState } from 'react';
import { useBovineMap } from '@/lib/bovine-map-store';
import {
  ChevronUp,
  ChevronDown,
  Building2,
  Users,
  Compass,
  Radio,
  MapPin,
  ShieldAlert,
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
} from 'lucide-react';

type SheetState = 'COLLAPSED' | 'HALF' | 'EXPANDED';

export function MapMobileBottomSheet() {
  const {
    filteredFarms,
    filteredAnimalLocations,
    selectedEntity,
    setSelectedEntity,
    flyTo,
    overlay,
  } = useBovineMap();

  const [sheetState, setSheetState] = useState<SheetState>('COLLAPSED');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const toggleExpand = () => {
    if (sheetState === 'COLLAPSED') setSheetState('HALF');
    else if (sheetState === 'HALF') setSheetState('EXPANDED');
    else setSheetState('COLLAPSED');
  };

  const handleAction = (label: string) => {
    setActionSuccess(`Action "${label}" recorded for field sync.`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-1000 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-2xl rounded-t-3xl transition-all duration-300 ease-in-out flex flex-col ${
        sheetState === 'COLLAPSED'
          ? 'h-14'
          : sheetState === 'HALF'
          ? 'h-64'
          : 'h-[75vh]'
      }`}
    >
      {/* Pull Handle Header */}
      <div
        onClick={toggleExpand}
        className="w-full py-2 flex flex-col items-center justify-center cursor-pointer select-none"
      >
        <div className="w-10 h-1 bg-stone-300 rounded-full mb-1"></div>
        <div className="w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-xs font-bold text-stone-900">
              {filteredFarms.length} Farms • {filteredAnimalLocations.length} Tracked
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {overlay}
            </span>
            {sheetState === 'EXPANDED' ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Sheet Content Body */}
      {sheetState !== 'COLLAPSED' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {actionSuccess && (
            <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Selected entity preview if available */}
          {selectedEntity ? (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-stone-500">
                  Selected {selectedEntity.type}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedEntity.data.coordinates) {
                      flyTo(selectedEntity.data.coordinates, 15);
                    } else if (selectedEntity.data.latitude && selectedEntity.data.longitude) {
                      flyTo([selectedEntity.data.latitude, selectedEntity.data.longitude], 15);
                    }
                  }}
                  className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1"
                >
                  <span>Center Map</span>
                  <Compass className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm font-bold text-stone-900 truncate">
                {selectedEntity.data.name || selectedEntity.data.title || selectedEntity.data.caseNumber}
              </p>
              <p className="text-xs text-stone-500 truncate">
                {selectedEntity.data.code || selectedEntity.data.primaryIdentifier || selectedEntity.data.farmName}
              </p>
            </div>
          ) : (
            /* Nearby Facilities Quick List */
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Facilities in Active Region
              </span>
              <div className="space-y-1.5">
                {filteredFarms.slice(0, 4).map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      if (f.latitude && f.longitude) {
                        flyTo([f.latitude, f.longitude], 15);
                      }
                      setSelectedEntity({ type: 'FARM', id: f.id, data: f });
                    }}
                    className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center justify-between hover:bg-emerald-50/50 cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-900">{f.name}</p>
                      <p className="text-[10px] text-stone-500">{f.code} • {f.region}</p>
                    </div>
                    <Compass className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Field Technician Quick Actions */}
          <div className="pt-2 border-t border-stone-200/70 space-y-2">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Field Technician Quick Actions
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAction('Record GPS Collar Fix')}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-left border border-emerald-200 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-700 mb-1" />
                <p className="text-[11px] font-bold">Record GPS Fix</p>
                <p className="text-[9px] text-emerald-700">Audit live tag coordinates</p>
              </button>

              <button
                type="button"
                onClick={() => handleAction('Paddock Transfer Shift')}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-left border border-blue-200 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-blue-700 mb-1" />
                <p className="text-[11px] font-bold">Log Paddock Shift</p>
                <p className="text-[9px] text-blue-700">Update herd subdivision</p>
              </button>

              <button
                type="button"
                onClick={() => handleAction('Report Disease Sighting')}
                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-900 rounded-xl text-left border border-red-200 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-700 mb-1" />
                <p className="text-[11px] font-bold">Report Disease Alert</p>
                <p className="text-[9px] text-red-700">Dispatch clinical alert</p>
              </button>

              <button
                type="button"
                onClick={() => handleAction('Verify Perimeter GPS')}
                className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-left border border-stone-300 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-stone-700 mb-1" />
                <p className="text-[11px] font-bold">Audit Perimeter</p>
                <p className="text-[9px] text-stone-600">Walk boundary fence</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
