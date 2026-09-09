'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { ReproductiveProcess } from '@/lib/bovine-types';

interface BreedingReproductionTabProps {
  reproList: ReproductiveProcess[];
}

export function BreedingReproductionTab({ reproList }: BreedingReproductionTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
          <Heart className="w-4 h-4 text-emerald-700" />
          <span>Reproductive History &amp; Procedures</span>
        </h3>
        <Link
          href="/bovine/reproduction/processes/new"
          className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900"
        >
          Start New Repro Process
        </Link>
      </div>

      {reproList.length === 0 ? (
        <p className="text-xs text-stone-500 py-6 text-center">
          No reproductive processes or ET procedures logged for this animal yet.
        </p>
      ) : (
        <div className="divide-y divide-stone-100">
          {reproList.map((proc) => (
            <div key={proc.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-stone-900">{proc.procedureType}</span>
                <div className="text-stone-500">
                  Date: {proc.procedureDate} • Tech: {proc.technician || 'Staff'}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                {proc.currentStage}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
