'use client';

import React from 'react';
import { X } from 'lucide-react';

interface NewMeasurementMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newMethodCode: string;
  setNewMethodCode: (val: string) => void;
  newMethodVersion: string;
  setNewMethodVersion: (val: string) => void;
  newMethodName: string;
  setNewMethodName: (val: string) => void;
  newMethodEquipment: string;
  setNewMethodEquipment: (val: string) => void;
  newMethodSop: string;
  setNewMethodSop: (val: string) => void;
}

export function NewMeasurementMethodModal({
  isOpen,
  onClose,
  onSubmit,
  newMethodCode,
  setNewMethodCode,
  newMethodVersion,
  setNewMethodVersion,
  newMethodName,
  setNewMethodName,
  newMethodEquipment,
  setNewMethodEquipment,
  newMethodSop,
  setNewMethodSop,
}: NewMeasurementMethodModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-base font-bold text-stone-900">Add Measurement Method S.O.P.</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Method Code</label>
              <input
                type="text"
                required
                placeholder="e.g. ULTRA_CARCASS_V2"
                value={newMethodCode}
                onChange={(e) => setNewMethodCode(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 uppercase font-mono font-bold text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Protocol Version</label>
              <input
                type="text"
                required
                placeholder="e.g. v2.1 (ICAR Certified)"
                value={newMethodVersion}
                onChange={(e) => setNewMethodVersion(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Method Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Calibrated Ultrasound Ribeye Cross-Section"
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Equipment / Platform</label>
            <input
              type="text"
              placeholder="e.g. Aloka 500V 3.5MHz Probe"
              value={newMethodEquipment}
              onChange={(e) => setNewMethodEquipment(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Standard Operating Procedure</label>
            <textarea
              rows={3}
              placeholder="Step-by-step measurement instructions and calibration checks..."
              value={newMethodSop}
              onChange={(e) => setNewMethodSop(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
            >
              Register S.O.P.
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
