'use client';

import React from 'react';
import { QrCode } from 'lucide-react';
import { GeneticSample } from '@/lib/bovine-types';

interface SampleCardListProps {
  samples: GeneticSample[];
  selectedSampleId?: string;
  onSelectSample: (id: string) => void;
}

export function SampleCardList({
  samples,
  selectedSampleId,
  onSelectSample,
}: SampleCardListProps) {
  if (samples.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
        No biological samples found matching your search or filters.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {samples.map((sample) => {
        const isSelected = sample.id === selectedSampleId;
        return (
          <div
            key={sample.id}
            onClick={() => onSelectSample(sample.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
              isSelected
                ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold bg-stone-100 text-stone-900 px-2 py-0.5 rounded">
                  {sample.sampleCode}
                </span>
                <span className="text-[10px] font-mono text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200">
                  {sample.sampleType}
                </span>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  sample.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : sample.status === 'REJECTED'
                    ? 'bg-rose-100 text-rose-800'
                    : sample.status === 'PROCESSING'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {sample.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">{sample.animalName}</h4>
                <div className="font-mono text-[11px] text-stone-500">
                  {sample.animalIdentifier}
                </div>
              </div>
              {sample.barcode && (
                <div className="flex items-center gap-1 font-mono text-[11px] text-stone-600 bg-stone-50 px-2 py-1 rounded border border-stone-200">
                  <QrCode className="w-3.5 h-3.5 text-stone-400" />
                  <span>{sample.barcode}</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
              <span>Lab: {sample.destinationLabName || 'Unassigned'}</span>
              <span>Collected {sample.collectedDate}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
