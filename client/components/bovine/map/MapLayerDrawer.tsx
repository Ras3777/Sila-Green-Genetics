'use client';

import React from 'react';
import {
  X,
  Layers,
  MapPin,
  Building2,
  Users,
  Award,
  Truck,
  HeartPulse,
  Calendar,
  Dna,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';
import { useBovineMap } from '@/lib/bovine-map-store';
import { MapLayerToggles } from '@/lib/bovine-map-types';

interface MapLayerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MapLayerDrawer({ isOpen, onClose }: MapLayerDrawerProps) {
  const { layers, toggleLayer, resetLayers } = useBovineMap();

  if (!isOpen) return null;

  const sections = [
    {
      category: 'Geography & Land',
      icon: MapPin,
      items: [
        { key: 'regions' as keyof MapLayerToggles, label: 'Regional Boundaries' },
        { key: 'districts' as keyof MapLayerToggles, label: 'District Boundaries' },
        { key: 'farmBoundaries' as keyof MapLayerToggles, label: 'Farm Perimeter Boundaries' },
        { key: 'paddocks' as keyof MapLayerToggles, label: 'Paddocks & Pasture Fences' },
        { key: 'waterPoints' as keyof MapLayerToggles, label: 'Water Sources & Troughs' },
        { key: 'quarantineAreas' as keyof MapLayerToggles, label: 'Quarantine Holding Pens' },
      ],
    },
    {
      category: 'Animals & Breeding',
      icon: Users,
      items: [
        { key: 'farmAnimals' as keyof MapLayerToggles, label: 'Farm Animals (Operational)' },
        { key: 'breedingStock' as keyof MapLayerToggles, label: 'Elite Breeding Stock' },
        { key: 'bulls' as keyof MapLayerToggles, label: 'Bulls & AI Sires' },
        { key: 'cows' as keyof MapLayerToggles, label: 'Cows & Embryo Donors' },
        { key: 'animalLocations' as keyof MapLayerToggles, label: 'Live GPS & RFID Positions' },
      ],
    },
    {
      category: 'Health & Biosecurity',
      icon: HeartPulse,
      items: [
        { key: 'diseaseEvents' as keyof MapLayerToggles, label: 'Active Disease Outbreaks' },
        { key: 'surveillanceBuffers' as keyof MapLayerToggles, label: '5/10/25km Surveillance Buffers' },
        { key: 'quarantineZones' as keyof MapLayerToggles, label: 'Quarantine Geofences' },
        { key: 'vaccinationChoropleth' as keyof MapLayerToggles, label: 'Vaccination Coverage Choropleth' },
      ],
    },
    {
      category: 'Operations & Movements',
      icon: Truck,
      items: [
        { key: 'movements' as keyof MapLayerToggles, label: 'Inter-Farm Transit Routes' },
        { key: 'sensors' as keyof MapLayerToggles, label: 'Telemetry Sensors & Gate Scanners' },
      ],
    },
    {
      category: 'Reproduction',
      icon: Calendar,
      items: [
        { key: 'pregnantFemales' as keyof MapLayerToggles, label: 'Confirmed Pregnant Females' },
        { key: 'expectedCalvings' as keyof MapLayerToggles, label: 'Expected Calvings (Next 30d)' },
      ],
    },
    {
      category: 'Genetics & Genomics',
      icon: Dna,
      items: [
        { key: 'geneticMerit' as keyof MapLayerToggles, label: 'Genetic Merit Heatmap ($B / $M)' },
        { key: 'breedDistribution' as keyof MapLayerToggles, label: 'Breed Distribution Density' },
      ],
    },
    {
      category: 'Government & Compliance',
      icon: ShieldCheck,
      items: [
        { key: 'complianceOverlay' as keyof MapLayerToggles, label: 'Audit & Regulatory Compliance' },
      ],
    },
    {
      category: 'Commercial Marketplace',
      icon: ShoppingBag,
      items: [
        { key: 'marketplaceListings' as keyof MapLayerToggles, label: 'Marketplace Live & Semen Listings' },
      ],
    },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-white shadow-2xl border-l border-stone-200 flex flex-col">
      {/* Drawer Header */}
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-emerald-800" />
          <h3 className="font-bold text-stone-900 text-sm">Geospatial Layer Control</h3>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={resetLayers}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-xs font-semibold cursor-pointer flex items-center gap-1"
            title="Reset to Default Layers"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Reset</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
        {sections.map((sec) => {
          const SectionIcon = sec.icon;
          return (
            <div key={sec.category} className="space-y-2.5">
              <div className="flex items-center space-x-1.5 text-stone-400 font-bold uppercase tracking-wider text-[10px] font-mono border-b border-stone-100 pb-1">
                <SectionIcon className="w-3.5 h-3.5 text-emerald-800" />
                <span>{sec.category}</span>
              </div>
              <div className="space-y-1.5">
                {sec.items.map((item) => {
                  const isChecked = layers[item.key];
                  return (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer text-stone-800 select-none"
                    >
                      <span className="font-medium text-xs">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLayer(item.key)}
                        className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-stone-100 bg-stone-50 text-[11px] text-stone-500 font-mono">
        Active Overlays &amp; Layers apply in real-time
      </div>
    </div>
  );
}
