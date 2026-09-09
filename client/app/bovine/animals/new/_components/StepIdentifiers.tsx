'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { IdentifierType } from '@/lib/bovine-types';

interface StepIdentifiersProps {
  identifierList: Array<{ type: IdentifierType; value: string; isPrimary: boolean }>;
  setIdentifierList: React.Dispatch<
    React.SetStateAction<Array<{ type: IdentifierType; value: string; isPrimary: boolean }>>
  >;
  addIdentifierRow: () => void;
  removeIdentifierRow: (index: number) => void;
  setPrimaryIdentifier: (index: number) => void;
}

export function StepIdentifiers({
  identifierList,
  setIdentifierList,
  addIdentifierRow,
  removeIdentifierRow,
  setPrimaryIdentifier,
}: StepIdentifiersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <h2 className="text-lg font-bold text-stone-900">2. Physical & Electronic Identifiers</h2>
        <button
          type="button"
          onClick={addIdentifierRow}
          className="text-xs font-semibold text-emerald-800 hover:underline flex items-center"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Identifier
        </button>
      </div>

      <p className="text-xs text-stone-500">
        Attach primary visual ear tags, 15-digit ISO RFID chips, herd tattoos, or official national registry codes.
      </p>

      <div className="space-y-3">
        {identifierList.map((idItem, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="w-36">
              <select
                value={idItem.type}
                onChange={(e) => {
                  const newType = e.target.value as IdentifierType;
                  setIdentifierList((prev) =>
                    prev.map((item, i) => (i === idx ? { ...item, type: newType } : item))
                  );
                }}
                className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-stone-900"
              >
                <option value="EAR_TAG">Ear Tag</option>
                <option value="RFID">RFID / EID</option>
                <option value="DGR">DGR Number</option>
                <option value="TATTOO">Tattoo</option>
                <option value="BRAND">Brand</option>
                <option value="NATIONAL_ID">National ID</option>
              </select>
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Tag / Transponder Value..."
                value={idItem.value}
                onChange={(e) => {
                  const val = e.target.value;
                  setIdentifierList((prev) =>
                    prev.map((item, i) => (i === idx ? { ...item, value: val } : item))
                  );
                }}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono text-stone-900"
              />
            </div>

            <button
              type="button"
              onClick={() => setPrimaryIdentifier(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                idItem.isPrimary
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {idItem.isPrimary ? 'Primary' : 'Make Primary'}
            </button>

            {identifierList.length > 1 && (
              <button
                type="button"
                onClick={() => removeIdentifierRow(idx)}
                className="text-stone-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
