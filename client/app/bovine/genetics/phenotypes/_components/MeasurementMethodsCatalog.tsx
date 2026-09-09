'use client';

import React from 'react';
import { MeasurementMethod } from '@/lib/bovine-types';

interface MeasurementMethodsCatalogProps {
  measurementMethods: MeasurementMethod[];
}

export function MeasurementMethodsCatalog({ measurementMethods }: MeasurementMethodsCatalogProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {measurementMethods.map((method) => (
        <div
          key={method.id}
          className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3 text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
              {method.code}
            </span>
            <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
              {method.protocolVersion}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-sm">{method.name}</h4>
            <p className="text-[11px] text-stone-600 mt-1">
              {method.description}
            </p>
          </div>

          {method.equipment && (
            <div className="text-[11px] text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-200/80">
              <span className="font-semibold">Equipment / Platform:</span> {method.equipment}
            </div>
          )}

          {method.standardOperatingProcedure && (
            <div className="text-[10px] text-stone-600 bg-amber-50/50 p-2 rounded-lg border border-amber-200/50 italic">
              {method.standardOperatingProcedure}
            </div>
          )}

          {method.metadataFields && (
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
              {Object.entries(method.metadataFields).map(([k, v]) => (
                <div key={k}>
                  <span className="text-stone-500 block">{k}:</span>
                  <span className="font-semibold text-stone-800">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
