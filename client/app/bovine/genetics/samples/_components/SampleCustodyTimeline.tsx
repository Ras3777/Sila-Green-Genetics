'use client';

import React from 'react';
import { FileCheck, ShieldCheck } from 'lucide-react';
import { GeneticSample } from '@/lib/bovine-types';

interface SampleCustodyTimelineProps {
  selectedSample?: GeneticSample;
  onAddCustodyEvent: () => void;
}

export function SampleCustodyTimeline({
  selectedSample,
  onAddCustodyEvent,
}: SampleCustodyTimelineProps) {
  if (!selectedSample) {
    return (
      <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
        Select a biological sample from the left to view custody timeline.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
              {selectedSample.sampleCode}
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-600">{selectedSample.sampleType}</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mt-1">
            {selectedSample.animalName} ({selectedSample.animalIdentifier})
          </h3>
        </div>

        <button
          onClick={onAddCustodyEvent}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <FileCheck className="w-4 h-4" />
          <span>Add Custody Event</span>
        </button>
      </div>

      {/* Sample Logistics Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Destination Lab</span>
          <span className="font-bold text-stone-900">{selectedSample.destinationLabName}</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Barcode / RFID</span>
          <span className="font-mono font-bold text-stone-900">{selectedSample.barcode}</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Storage Temp &amp; Bin</span>
          <span className="font-bold text-stone-900">
            {selectedSample.storageTemp || '+4°C'} ({selectedSample.storageLocation || 'Vault A'})
          </span>
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Courier Tracking</span>
          <span className="font-mono font-semibold text-emerald-800">
            {selectedSample.shippingTrackingNumber || 'Pending Courier Pickup'}
          </span>
        </div>
      </div>

      {/* Chain of Custody Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Chain of Custody Audit Trail
          </h4>
          <span className="text-[11px] text-stone-500 font-mono">Immutable Log</span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {selectedSample.chainOfCustody.map((event, idx) => (
            <div key={idx} className="relative space-y-1 text-xs">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">{event.action}</span>
                <span className="text-[10px] text-stone-400 font-mono">{event.timestamp}</span>
              </div>
              <div className="text-[11px] text-stone-600 flex items-center gap-2">
                <span className="font-medium text-stone-800">{event.handledBy}</span>
                <span>•</span>
                <span>{event.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
