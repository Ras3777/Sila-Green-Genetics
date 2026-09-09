'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { PhenotypeObservation } from '@/lib/bovine-types';

interface SuspectPhenotypesCardProps {
  suspectPhenotypes: PhenotypeObservation[];
}

export function SuspectPhenotypesCard({ suspectPhenotypes }: SuspectPhenotypesCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Quality Audits & Suspect Phenotypes
          </h3>
          <p className="text-xs text-stone-500">
            Observations requiring validation or technician review.
          </p>
        </div>
        <Link
          href="/bovine/genetics/phenotypes"
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
        >
          Inspect
        </Link>
      </div>

      <div className="space-y-3 text-xs">
        {suspectPhenotypes.length === 0 ? (
          <div className="p-4 text-center text-stone-500 text-xs bg-stone-50 rounded-xl">
            No suspect observations in current queue.
          </div>
        ) : (
          suspectPhenotypes.map((obs) => (
            <div
              key={obs.id}
              className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900">
                  {obs.traitName} ({obs.traitCode})
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900">
                  {obs.qualityStatus}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-800 text-[11px]">
                <span>{obs.animalName}</span>
                <span className="font-bold font-mono">
                  {obs.rawValue} {obs.unit}
                </span>
              </div>
              {obs.qualityFlags && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {obs.qualityFlags.map((f, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-rose-100 text-rose-800 font-mono px-1.5 py-0.5 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
              {obs.notes && (
                <p className="text-[10px] text-stone-600 italic">{obs.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
