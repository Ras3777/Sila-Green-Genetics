'use client';

import React from 'react';
import {
  X,
  BookOpen,
  Scale,
  Clock,
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';

export function MetricDefinitionDrawer() {
  const { activeMetricDefinition, closeMetricDefinitionDrawer } = useGovernment();

  if (!activeMetricDefinition) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={closeMetricDefinitionDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 bg-stone-50/80 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
                  {activeMetricDefinition.key}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-semibold text-[10px] uppercase">
                  v{activeMetricDefinition.version}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mt-2 leading-snug">
                {activeMetricDefinition.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {activeMetricDefinition.shortDescription}
              </p>
            </div>
            <button
              onClick={closeMetricDefinitionDrawer}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-stone-800">
            {/* Numerator & Denominator Breakdown */}
            <div className="space-y-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <h4 className="font-bold text-stone-900 text-xs flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-emerald-700" /> Calculation Lineage
              </h4>
              <div className="space-y-2 pt-1 border-t border-stone-200/80">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-600">Numerator:</span>
                  <p className="font-medium text-stone-900 mt-0.5">{activeMetricDefinition.numerator}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-600">Denominator:</span>
                  <p className="font-medium text-stone-900 mt-0.5">{activeMetricDefinition.denominator}</p>
                </div>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Population Inclusions
                </span>
                <p className="text-[11px] text-emerald-950 mt-1">{activeMetricDefinition.includedPopulation}</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80">
                <span className="text-[10px] font-bold uppercase text-rose-800 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Excluded Population
                </span>
                <p className="text-[11px] text-rose-950 mt-1">{activeMetricDefinition.excludedPopulation}</p>
              </div>
            </div>

            {/* Data Provenance & Lag SLA */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
              <h4 className="font-bold text-stone-900 text-xs flex items-center">
                <Database className="w-3.5 h-3.5 mr-1.5 text-emerald-700" /> Data Pipeline & Sources
              </h4>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-600">Primary Data Sources:</span>
                  <span className="font-medium text-stone-900 text-right">{activeMetricDefinition.dataSources.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Calculation Lag SLA:</span>
                  <span className="font-mono font-bold text-stone-900">{activeMetricDefinition.calculationLagDays} days</span>
                </div>
                {activeMetricDefinition.regulatoryStandardRef && (
                  <div className="flex justify-between">
                    <span className="text-stone-600">Regulatory Standard:</span>
                    <span className="font-medium text-stone-900">{activeMetricDefinition.regulatoryStandardRef}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
            <span className="text-[11px] text-stone-600">
              Auditable statutory lineage
            </span>
            <button
              onClick={closeMetricDefinitionDrawer}
              className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Definition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
